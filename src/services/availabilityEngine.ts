import {
  Salon,
  Service,
  Staff,
  SalonWorkingHours,
  StaffWorkingHours,
  StaffLeave,
  Appointment
} from '../types';

export interface TimeSlotResult {
  time: string; // HH:mm format, e.g. "10:00"
  endTime: string; // HH:mm format, e.g. "11:00"
  available: boolean;
  reason?: string;
  assignedStaffId?: string;
  assignedStaffName?: string;
}

/**
 * Converts "HH:mm" string to total minutes from midnight
 */
export function timeToMinutes(timeStr: string): number {
  const [hours, minutes] = timeStr.split(':').map(Number);
  return (hours || 0) * 60 + (minutes || 0);
}

/**
 * Converts total minutes from midnight back to "HH:mm"
 */
export function minutesToTime(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
}

/**
 * Formats "HH:mm" to 12-hour format "h:mm A"
 */
export function formatTime12h(timeStr: string): string {
  const [hours, minutes] = timeStr.split(':').map(Number);
  const period = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours % 12 || 12;
  return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
}

export interface CalculateAvailabilityParams {
  salon: Salon;
  service: Service;
  staffId: string; // Specific staff ID or 'ANY'
  selectedDate: string; // YYYY-MM-DD
  allStaff: Staff[];
  salonHours: SalonWorkingHours[];
  staffHours: StaffWorkingHours[];
  staffLeaves: StaffLeave[];
  existingAppointments: Appointment[];
}

export function calculateAvailability(params: CalculateAvailabilityParams): {
  slots: TimeSlotResult[];
  isClosedDay: boolean;
  closedReason?: string;
} {
  const {
    salon,
    service,
    staffId,
    selectedDate,
    allStaff,
    salonHours,
    staffHours,
    staffLeaves,
    existingAppointments
  } = params;

  // 1. Verify Salon is Active
  if (salon.status !== 'ACTIVE') {
    return {
      slots: [],
      isClosedDay: true,
      closedReason: 'Salon is currently not accepting bookings.'
    };
  }

  // 2. Verify Service is Active
  if (!service.is_active) {
    return {
      slots: [],
      isClosedDay: true,
      closedReason: 'This service is currently unavailable.'
    };
  }

  // Determine day of week from YYYY-MM-DD in local time
  const [year, month, day] = selectedDate.split('-').map(Number);
  const dateObj = new Date(year, month - 1, day);
  const dayOfWeek = dateObj.getDay(); // 0 = Sun, 1 = Mon, ..., 6 = Sat

  // 3. Check Salon Working Hours (Default to 09:00 - 20:30 if specific entry is unseeded)
  const salonDaySchedule = salonHours.find(
    (wh) => wh.salon_id === salon.id && wh.day_of_week === dayOfWeek
  ) || {
    id: `default-wh-${salon.id}-${dayOfWeek}`,
    salon_id: salon.id,
    day_of_week: dayOfWeek,
    open_time: '09:00',
    close_time: '20:30',
    is_closed: false
  };

  if (salonDaySchedule.is_closed) {
    return {
      slots: [],
      isClosedDay: true,
      closedReason: 'Salon is closed on this day.'
    };
  }

  const salonOpenMins = timeToMinutes(salonDaySchedule.open_time);
  const salonCloseMins = timeToMinutes(salonDaySchedule.close_time);
  const durationMins = service.duration_minutes || 60;

  // Get eligible staff members
  let eligibleStaff: Staff[] = [];
  if (staffId === 'ANY') {
    eligibleStaff = allStaff.filter(
      (s) => s.salon_id === salon.id && s.is_active && s.service_ids.includes(service.id)
    );
  } else {
    const target = allStaff.find((s) => s.id === staffId && s.salon_id === salon.id);
    if (target && target.is_active && target.service_ids.includes(service.id)) {
      eligibleStaff = [target];
    }
  }

  if (eligibleStaff.length === 0) {
    return {
      slots: [],
      isClosedDay: true,
      closedReason: 'No stylists available for this service on this date.'
    };
  }

  // Standard step size: 30 minutes
  const stepMinutes = 30;
  const potentialSlots: { startMins: number; endMins: number }[] = [];

  for (let current = salonOpenMins; current + durationMins <= salonCloseMins; current += stepMinutes) {
    potentialSlots.push({
      startMins: current,
      endMins: current + durationMins
    });
  }

  const todayStr = new Date().toISOString().split('T')[0];
  const now = new Date();
  const currentMinutesNow = now.getHours() * 60 + now.getMinutes();
  const isSelectedToday = selectedDate === todayStr;

  // Evaluate each slot
  const finalSlots: TimeSlotResult[] = potentialSlots.map((slot) => {
    const startTimeStr = minutesToTime(slot.startMins);
    const endTimeStr = minutesToTime(slot.endMins);

    // Rule: Past time check if selected date is today
    if (isSelectedToday && slot.startMins <= currentMinutesNow + 15) {
      return {
        time: startTimeStr,
        endTime: endTimeStr,
        available: false,
        reason: 'Past time slot'
      };
    }

    // Check if at least one eligible staff member is free for the entire slot duration
    let availableStaffMember: Staff | null = null;

    for (const member of eligibleStaff) {
      // 1. Staff working hours
      const sSchedule = staffHours.find(
        (sh) => sh.staff_id === member.id && sh.day_of_week === dayOfWeek
      );

      if (sSchedule) {
        if (!sSchedule.is_available) continue;
        const staffStart = timeToMinutes(sSchedule.start_time);
        const staffEnd = timeToMinutes(sSchedule.end_time);
        if (slot.startMins < staffStart || slot.endMins > staffEnd) {
          continue;
        }
      }

      // 2. Staff Leaves
      const isOnLeave = staffLeaves.some((leave) => {
        if (leave.staff_id !== member.id || leave.status !== 'APPROVED') return false;
        return selectedDate >= leave.start_date && selectedDate <= leave.end_date;
      });

      if (isOnLeave) continue;

      // 3. Appointment collisions
      const hasConflict = existingAppointments.some((appt) => {
        if (
          appt.staff_id !== member.id ||
          appt.appointment_date !== selectedDate ||
          appt.status === 'CANCELLED'
        ) {
          return false;
        }

        const apptStartMins = timeToMinutes(appt.start_time);
        const apptEndMins = timeToMinutes(appt.end_time);

        // Check if intervals overlap: [slot.startMins, slot.endMins] with [apptStartMins, apptEndMins]
        const overlaps = !(slot.endMins <= apptStartMins || slot.startMins >= apptEndMins);
        return overlaps;
      });

      if (!hasConflict) {
        availableStaffMember = member;
        break; // Found an available staff member
      }
    }

    if (availableStaffMember) {
      return {
        time: startTimeStr,
        endTime: endTimeStr,
        available: true,
        assignedStaffId: availableStaffMember.id,
        assignedStaffName: availableStaffMember.display_name
      };
    } else {
      return {
        time: startTimeStr,
        endTime: endTimeStr,
        available: false,
        reason: 'Booked / Unavailable'
      };
    }
  });

  return {
    slots: finalSlots,
    isClosedDay: false
  };
}
