import {
  UserProfile,
  Category,
  Salon,
  Service,
  Staff,
  SalonWorkingHours,
  StaffWorkingHours,
  StaffLeave,
  Appointment,
  Review,
  Notification,
  AuditLog
} from '../types';
import {
  INITIAL_CATEGORIES,
  INITIAL_SALONS,
  INITIAL_SERVICES,
  INITIAL_STAFF,
  INITIAL_SALON_WORKING_HOURS,
  INITIAL_STAFF_WORKING_HOURS,
  INITIAL_STAFF_LEAVES,
  INITIAL_USERS,
  INITIAL_APPOINTMENTS,
  INITIAL_REVIEWS,
  INITIAL_NOTIFICATIONS,
  INITIAL_AUDIT_LOGS
} from '../data/seedData';
import { timeToMinutes } from './availabilityEngine';
import { ApiClient } from './api';

const STORAGE_KEYS = {
  USERS: 'azhagu_users_v5',
  CATEGORIES: 'azhagu_categories_v5',
  SALONS: 'azhagu_salons_v5',
  SERVICES: 'azhagu_services_v5',
  STAFF: 'azhagu_staff_v5',
  SALON_HOURS: 'azhagu_salon_hours_v5',
  STAFF_HOURS: 'azhagu_staff_hours_v5',
  STAFF_LEAVES: 'azhagu_staff_leaves_v5',
  APPOINTMENTS: 'azhagu_appointments_v5',
  REVIEWS: 'azhagu_reviews_v5',
  NOTIFICATIONS: 'azhagu_notifications_v5',
  AUDIT_LOGS: 'azhagu_audit_logs_v5',
  ACTIVE_USER_ID: 'azhagu_active_user_id_v5'
};

function getStored<T>(key: string, fallback: T): T {
  try {
    const data = localStorage.getItem(key);
    if (!data) return fallback;
    return JSON.parse(data);
  } catch {
    return fallback;
  }
}

function setStored<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error('Storage write error', e);
  }
}

export class DatabaseService {
  private static instance: DatabaseService;

  public static getInstance(): DatabaseService {
    if (!DatabaseService.instance) {
      DatabaseService.instance = new DatabaseService();
    }
    return DatabaseService.instance;
  }

  // --- Initializers ---
  public resetToSeed(): void {
    setStored(STORAGE_KEYS.USERS, INITIAL_USERS);
    setStored(STORAGE_KEYS.CATEGORIES, INITIAL_CATEGORIES);
    setStored(STORAGE_KEYS.SALONS, INITIAL_SALONS);
    setStored(STORAGE_KEYS.SERVICES, INITIAL_SERVICES);
    setStored(STORAGE_KEYS.STAFF, INITIAL_STAFF);
    setStored(STORAGE_KEYS.SALON_HOURS, INITIAL_SALON_WORKING_HOURS);
    setStored(STORAGE_KEYS.STAFF_HOURS, INITIAL_STAFF_WORKING_HOURS);
    setStored(STORAGE_KEYS.STAFF_LEAVES, INITIAL_STAFF_LEAVES);
    setStored(STORAGE_KEYS.APPOINTMENTS, INITIAL_APPOINTMENTS);
    setStored(STORAGE_KEYS.REVIEWS, INITIAL_REVIEWS);
    setStored(STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS);
    setStored(STORAGE_KEYS.AUDIT_LOGS, INITIAL_AUDIT_LOGS);
    setStored(STORAGE_KEYS.ACTIVE_USER_ID, 'user-cust-1');
  }

  public init(): void {
    const existing = getStored<Salon[]>(STORAGE_KEYS.SALONS, []);
    const existingAppts = getStored<Appointment[]>(STORAGE_KEYS.APPOINTMENTS, []);
    if (!existing || existing.length < INITIAL_SALONS.length || !existingAppts || existingAppts.length < INITIAL_APPOINTMENTS.length) {
      this.resetToSeed();
    }
  }

  // --- Getters ---
  public getUsers(): UserProfile[] {
    return getStored<UserProfile[]>(STORAGE_KEYS.USERS, INITIAL_USERS);
  }

  public getCategories(): Category[] {
    return getStored<Category[]>(STORAGE_KEYS.CATEGORIES, INITIAL_CATEGORIES);
  }

  public getSalons(): Salon[] {
    return getStored<Salon[]>(STORAGE_KEYS.SALONS, INITIAL_SALONS);
  }

  public getServices(): Service[] {
    return getStored<Service[]>(STORAGE_KEYS.SERVICES, INITIAL_SERVICES);
  }

  public getStaff(): Staff[] {
    return getStored<Staff[]>(STORAGE_KEYS.STAFF, INITIAL_STAFF);
  }

  public getSalonWorkingHours(): SalonWorkingHours[] {
    return getStored<SalonWorkingHours[]>(STORAGE_KEYS.SALON_HOURS, INITIAL_SALON_WORKING_HOURS);
  }

  public getStaffWorkingHours(): StaffWorkingHours[] {
    return getStored<StaffWorkingHours[]>(STORAGE_KEYS.STAFF_HOURS, INITIAL_STAFF_WORKING_HOURS);
  }

  public getStaffLeaves(): StaffLeave[] {
    return getStored<StaffLeave[]>(STORAGE_KEYS.STAFF_LEAVES, INITIAL_STAFF_LEAVES);
  }

  public getAppointments(): Appointment[] {
    return getStored<Appointment[]>(STORAGE_KEYS.APPOINTMENTS, INITIAL_APPOINTMENTS);
  }

  public getReviews(): Review[] {
    return getStored<Review[]>(STORAGE_KEYS.REVIEWS, INITIAL_REVIEWS);
  }

  public getNotifications(): Notification[] {
    return getStored<Notification[]>(STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS);
  }

  public getAuditLogs(): AuditLog[] {
    return getStored<AuditLog[]>(STORAGE_KEYS.AUDIT_LOGS, INITIAL_AUDIT_LOGS);
  }

  public getActiveUserId(): string {
    return getStored<string>(STORAGE_KEYS.ACTIVE_USER_ID, 'user-cust-1');
  }

  public setActiveUserId(userId: string): void {
    setStored(STORAGE_KEYS.ACTIVE_USER_ID, userId);
  }

  // --- Atomic Booking Transaction & Concurrency Verification ---
  public bookAppointment(payload: {
    customer_id: string;
    salon_id: string;
    staff_id: string;
    service_id: string;
    appointment_date: string; // YYYY-MM-DD
    start_time: string; // HH:mm
    end_time: string; // HH:mm
    notes?: string;
    customer_name: string;
    customer_phone: string;
    customer_email: string;
    payment_method?: 'PAY_AT_SALON' | 'UPI' | 'CARD';
    payment_status?: 'PENDING' | 'PAID' | 'PAY_AT_SALON';
  }): { success: boolean; appointment?: Appointment; error?: string } {
    const salons = this.getSalons();
    const services = this.getServices();
    const staffList = this.getStaff();
    const salonHours = this.getSalonWorkingHours();
    const staffHours = this.getStaffWorkingHours();
    const staffLeaves = this.getStaffLeaves();
    const appointments = this.getAppointments();

    const salon = salons.find((s) => s.id === payload.salon_id);
    if (!salon || salon.status !== 'ACTIVE') {
      return { success: false, error: 'Salon is not active or accepting appointments.' };
    }

    const service = services.find((srv) => srv.id === payload.service_id && srv.salon_id === salon.id);
    if (!service || !service.is_active) {
      return { success: false, error: 'The selected service is not available.' };
    }

    const staffMember = staffList.find((stf) => stf.id === payload.staff_id && stf.salon_id === salon.id);
    if (!staffMember || !staffMember.is_active) {
      return { success: false, error: 'The selected staff member is unavailable.' };
    }

    if (!staffMember.service_ids.includes(service.id)) {
      return { success: false, error: 'Stylist does not perform this specific service.' };
    }

    const [year, month, day] = payload.appointment_date.split('-').map(Number);
    const dateObj = new Date(year, month - 1, day);
    const dayOfWeek = dateObj.getDay();

    // Check Salon Hours (Default to 09:00 - 20:30 if unseeded)
    const sHours = salonHours.find((sh) => sh.salon_id === salon.id && sh.day_of_week === dayOfWeek) || {
      id: `default-wh-${salon.id}-${dayOfWeek}`,
      salon_id: salon.id,
      day_of_week: dayOfWeek,
      open_time: '09:00',
      close_time: '20:30',
      is_closed: false
    };
    if (sHours.is_closed) {
      return { success: false, error: 'Salon is closed on this date.' };
    }

    const startMins = timeToMinutes(payload.start_time);
    const endMins = timeToMinutes(payload.end_time);
    const salonOpenMins = timeToMinutes(sHours.open_time);
    const salonCloseMins = timeToMinutes(sHours.close_time);

    if (startMins < salonOpenMins || endMins > salonCloseMins) {
      return { success: false, error: 'Selected time is outside salon business hours.' };
    }

    // Check Staff Hours
    const stfHours = staffHours.find((sh) => sh.staff_id === staffMember.id && sh.day_of_week === dayOfWeek);
    if (stfHours) {
      if (!stfHours.is_available) {
        return { success: false, error: 'Stylist is not on schedule for this day.' };
      }
      const stfStart = timeToMinutes(stfHours.start_time);
      const stfEnd = timeToMinutes(stfHours.end_time);
      if (startMins < stfStart || endMins > stfEnd) {
        return { success: false, error: 'Time is outside the stylist’s scheduled shift.' };
      }
    }

    // Check Staff Leaves
    const onLeave = staffLeaves.some((l) => {
      if (l.staff_id !== staffMember.id || l.status !== 'APPROVED') return false;
      return payload.appointment_date >= l.start_date && payload.appointment_date <= l.end_date;
    });

    if (onLeave) {
      return { success: false, error: 'Stylist is on an approved leave for the chosen date.' };
    }

    // Double Booking Overlap Protection (PostgreSQL Transactional Lock Simulation)
    const hasCollision = appointments.some((appt) => {
      if (
        appt.staff_id !== staffMember.id ||
        appt.appointment_date !== payload.appointment_date ||
        appt.status === 'CANCELLED'
      ) {
        return false;
      }

      const existingStart = timeToMinutes(appt.start_time);
      const existingEnd = timeToMinutes(appt.end_time);

      // Overlap condition: NOT (end <= existingStart OR start >= existingEnd)
      return !(endMins <= existingStart || startMins >= existingEnd);
    });

    if (hasCollision) {
      return {
        success: false,
        error: 'That time slot is no longer available. Please select another time.'
      };
    }

    // Create New Appointment
    const newAppointment: Appointment = {
      id: `appt-${Date.now()}`,
      customer_id: payload.customer_id,
      salon_id: salon.id,
      staff_id: staffMember.id,
      service_id: service.id,
      appointment_date: payload.appointment_date,
      start_time: payload.start_time,
      end_time: payload.end_time,
      status: 'CONFIRMED',
      notes: payload.notes || '',
      total_price: service.price,
      customer_name: payload.customer_name,
      customer_phone: payload.customer_phone,
      customer_email: payload.customer_email,
      service_name: service.name,
      staff_name: staffMember.display_name,
      salon_name: salon.name,
      payment_method: payload.payment_method || 'PAY_AT_SALON',
      payment_status: payload.payment_status || 'PAY_AT_SALON',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const updatedAppointments = [newAppointment, ...appointments];
    setStored(STORAGE_KEYS.APPOINTMENTS, updatedAppointments);

    // Notify Customer & Salon Owner
    this.addNotification({
      user_id: payload.customer_id,
      type: 'BOOKING_CONFIRMED',
      title: `Booking Confirmed at ${salon.name}`,
      message: `Your ${service.name} with ${staffMember.display_name} on ${payload.appointment_date} at ${payload.start_time} is confirmed. (${newAppointment.payment_method === 'PAY_AT_SALON' ? 'Pay at Salon' : 'Online Payment Received'})`,
      link_id: newAppointment.id
    });

    this.addNotification({
      user_id: salon.owner_id,
      type: 'BOOKING_CREATED',
      title: 'New Customer Booking',
      message: `${payload.customer_name} booked ${service.name} with ${staffMember.display_name} for ${payload.appointment_date} at ${payload.start_time}.`,
      link_id: newAppointment.id
    });

    this.addAuditLog({
      actor_id: payload.customer_id,
      actor_name: payload.customer_name,
      action: 'BOOKING_CREATED',
      entity_type: 'APPOINTMENT',
      entity_id: newAppointment.id,
      metadata: {
        salon: salon.name,
        service: service.name,
        price: service.price,
        date: payload.appointment_date,
        payment_method: newAppointment.payment_method
      }
    });

    // Async REST API sync to server
    ApiClient.createAppointment(payload).catch((e) => console.warn('API sync:', e));

    return { success: true, appointment: newAppointment };
  }

  // --- Cancellation Policy: 2 Hours Prior Rule ---
  public cancelAppointment(
    appointmentId: string,
    actorId: string,
    _actorRole?: string
  ): { success: boolean; error?: string } {
    const appointments = this.getAppointments();
    const target = appointments.find((a) => a.id === appointmentId);

    if (!target) {
      return { success: false, error: 'Appointment not found.' };
    }

    if (target.status === 'COMPLETED') {
      return { success: false, error: 'Cannot cancel an appointment that is already completed.' };
    }

    if (target.status === 'CANCELLED') {
      return { success: false, error: 'Appointment is already cancelled.' };
    }

    // Verify actor's actual role in DB instead of trusting caller string
    const actorUser = this.getUsers().find((u) => u.id === actorId);
    const verifiedRole = actorUser?.role || 'CUSTOMER';

    // If actor is Customer or cancelling their own appointment, enforce 2 hours notice rule
    if (verifiedRole === 'CUSTOMER' || target.customer_id === actorId) {
      const [year, month, day] = target.appointment_date.split('-').map(Number);
      const [hours, mins] = target.start_time.split(':').map(Number);
      const appointmentDateTime = new Date(year, month - 1, day, hours, mins).getTime();
      const now = Date.now();
      const differenceInHours = (appointmentDateTime - now) / (1000 * 60 * 60);

      if (differenceInHours < 2) {
        return {
          success: false,
          error: 'This appointment can no longer be cancelled online as it is within the 2-hour window. Please contact the salon directly.'
        };
      }
    }

    target.status = 'CANCELLED';
    target.updated_at = new Date().toISOString();

    setStored(STORAGE_KEYS.APPOINTMENTS, [...appointments]);

    this.addNotification({
      user_id: target.customer_id,
      type: 'BOOKING_CANCELLED',
      title: 'Appointment Cancelled',
      message: `Your booking for ${target.service_name} at ${target.salon_name} on ${target.appointment_date} has been cancelled.`,
      link_id: target.id
    });

    this.addAuditLog({
      actor_id: actorId,
      actor_name: verifiedRole,
      action: 'APPOINTMENT_CANCELLED',
      entity_type: 'APPOINTMENT',
      entity_id: target.id,
      metadata: { salon_name: target.salon_name, date: target.appointment_date }
    });

    // Async REST API sync to server
    ApiClient.cancelAppointment(appointmentId, actorId).catch((e) => console.warn('API cancel sync:', e));

    return { success: true };
  }

  // --- Appointment Status Update (Salon Owner / Manager) ---
  public updateAppointmentStatus(
    appointmentId: string,
    newStatus: 'CONFIRMED' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW',
    actorId: string,
    actorName: string
  ): { success: boolean; error?: string } {
    const appointments = this.getAppointments();
    const appt = appointments.find((a) => a.id === appointmentId);
    if (!appt) return { success: false, error: 'Appointment not found' };

    appt.status = newStatus;
    appt.updated_at = new Date().toISOString();
    setStored(STORAGE_KEYS.APPOINTMENTS, [...appointments]);

    if (newStatus === 'COMPLETED') {
      this.addNotification({
        user_id: appt.customer_id,
        type: 'BOOKING_COMPLETED',
        title: 'Thank you for visiting!',
        message: `Your appointment at ${appt.salon_name} is complete. Rate your experience to help our community!`,
        link_id: appt.id
      });
    }

    this.addAuditLog({
      actor_id: actorId,
      actor_name: actorName,
      action: `APPOINTMENT_${newStatus}`,
      entity_type: 'APPOINTMENT',
      entity_id: appt.id,
      metadata: { newStatus }
    });

    return { success: true };
  }

  // --- Verified Review Submission ---
  public submitReview(payload: {
    customer_id: string;
    customer_name: string;
    customer_avatar: string;
    salon_id: string;
    appointment_id: string;
    rating: number;
    comment: string;
  }): { success: boolean; error?: string; review?: Review } {
    const appointments = this.getAppointments();
    const reviews = this.getReviews();
    const salons = this.getSalons();

    // 1. Verify Appointment Exists and is COMPLETED
    const appt = appointments.find((a) => a.id === payload.appointment_id);
    if (!appt || appt.status !== 'COMPLETED') {
      return { success: false, error: 'Reviews are permitted only for verified, completed appointments.' };
    }

    // 2. Verify that payload customer_id matches appointment customer_id
    if (appt.customer_id !== payload.customer_id) {
      return { success: false, error: 'You can only leave a review for an appointment booked under your account.' };
    }

    // 3. Prevent Multiple Reviews for the Same Appointment
    const existing = reviews.find((r) => r.appointment_id === payload.appointment_id);
    if (existing) {
      return { success: false, error: 'You have already submitted a review for this appointment.' };
    }

    const newReview: Review = {
      id: `rev-${Date.now()}`,
      customer_id: payload.customer_id,
      customer_name: payload.customer_name,
      customer_avatar: payload.customer_avatar,
      salon_id: payload.salon_id,
      appointment_id: payload.appointment_id,
      rating: Math.max(1, Math.min(5, payload.rating)),
      comment: payload.comment.trim(),
      status: 'PUBLISHED',
      created_at: new Date().toISOString()
    };

    const updatedReviews = [newReview, ...reviews];
    setStored(STORAGE_KEYS.REVIEWS, updatedReviews);

    // Recalculate Salon Rating
    const salon = salons.find((s) => s.id === payload.salon_id);
    if (salon) {
      const salonReviews = updatedReviews.filter((r) => r.salon_id === salon.id && r.status === 'PUBLISHED');
      const avg = salonReviews.reduce((sum, r) => sum + r.rating, 0) / (salonReviews.length || 1);
      salon.rating = Number(avg.toFixed(1));
      salon.review_count = salonReviews.length;
      setStored(STORAGE_KEYS.SALONS, [...salons]);

      this.addNotification({
        user_id: salon.owner_id,
        type: 'REVIEW_RECEIVED',
        title: 'New Verified Review Received',
        message: `${payload.customer_name} left a ${payload.rating}-star review for ${salon.name}.`,
        link_id: newReview.id
      });
    }

    this.addAuditLog({
      actor_id: payload.customer_id,
      actor_name: payload.customer_name,
      action: 'REVIEW_SUBMITTED',
      entity_type: 'REVIEW',
      entity_id: newReview.id,
      metadata: { rating: payload.rating, salon_id: payload.salon_id }
    });

    return { success: true, review: newReview };
  }

  // --- CRUD: Services ---
  public saveService(service: Partial<Service> & { salon_id: string; name: string; price: number; duration_minutes: number; category_id: string }): Service {
    const services = this.getServices();
    if (service.id) {
      const idx = services.findIndex((s) => s.id === service.id);
      if (idx !== -1) {
        services[idx] = {
          ...services[idx],
          ...service,
          updated_at: new Date().toISOString()
        } as Service;
        setStored(STORAGE_KEYS.SERVICES, [...services]);
        return services[idx];
      }
    }

    const newSrv: Service = {
      id: `srv-${Date.now()}`,
      salon_id: service.salon_id,
      category_id: service.category_id,
      name: service.name,
      description: service.description || '',
      price: service.price,
      duration_minutes: service.duration_minutes,
      image_url: service.image_url || 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=400&q=80',
      is_active: service.is_active ?? true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    services.push(newSrv);
    setStored(STORAGE_KEYS.SERVICES, [...services]);
    return newSrv;
  }

  public deleteService(serviceId: string): void {
    const services = this.getServices().filter((s) => s.id !== serviceId);
    setStored(STORAGE_KEYS.SERVICES, services);
  }

  // --- CRUD: Staff ---
  public saveStaff(staffData: Partial<Staff> & { salon_id: string; display_name: string }): Staff {
    const staffList = this.getStaff();
    if (staffData.id) {
      const idx = staffList.findIndex((st) => st.id === staffData.id);
      if (idx !== -1) {
        staffList[idx] = {
          ...staffList[idx],
          ...staffData,
          updated_at: new Date().toISOString()
        } as Staff;
        setStored(STORAGE_KEYS.STAFF, [...staffList]);
        return staffList[idx];
      }
    }

    const newStaff: Staff = {
      id: `stf-${Date.now()}`,
      salon_id: staffData.salon_id,
      display_name: staffData.display_name,
      bio: staffData.bio || '',
      specialization: staffData.specialization || 'General Stylist',
      experience_years: staffData.experience_years || 2,
      avatar_url: staffData.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&h=200&q=80',
      is_active: staffData.is_active ?? true,
      service_ids: staffData.service_ids || [],
      rating: 5.0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    staffList.push(newStaff);
    setStored(STORAGE_KEYS.STAFF, [...staffList]);
    return newStaff;
  }

  public deleteStaff(staffId: string): void {
    const staffList = this.getStaff().filter((s) => s.id !== staffId);
    setStored(STORAGE_KEYS.STAFF, staffList);
  }

  // --- CRUD: Working Hours ---
  public saveSalonWorkingHours(hours: SalonWorkingHours[]): void {
    setStored(STORAGE_KEYS.SALON_HOURS, hours);
  }

  // --- CRUD: Leaves ---
  public addStaffLeave(leave: Omit<StaffLeave, 'id' | 'created_at'>): StaffLeave {
    const leaves = this.getStaffLeaves();
    const newLeave: StaffLeave = {
      ...leave,
      id: `leave-${Date.now()}`,
      created_at: new Date().toISOString()
    };
    leaves.push(newLeave);
    setStored(STORAGE_KEYS.STAFF_LEAVES, [...leaves]);
    return newLeave;
  }

  public deleteStaffLeave(leaveId: string): void {
    const leaves = this.getStaffLeaves().filter((l) => l.id !== leaveId);
    setStored(STORAGE_KEYS.STAFF_LEAVES, leaves);
  }

  // --- CRUD: Salons (Admin / Owner) ---
  public saveSalon(salonData: Partial<Salon> & { name: string; owner_id: string }): Salon {
    const salons = this.getSalons();
    if (salonData.id) {
      const idx = salons.findIndex((s) => s.id === salonData.id);
      if (idx !== -1) {
        salons[idx] = {
          ...salons[idx],
          ...salonData,
          updated_at: new Date().toISOString()
        } as Salon;
        setStored(STORAGE_KEYS.SALONS, [...salons]);
        return salons[idx];
      }
    }

    const newSalon: Salon = {
      id: `salon-${Date.now()}`,
      owner_id: salonData.owner_id,
      name: salonData.name,
      slug: salonData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      description: salonData.description || '',
      phone: salonData.phone || '+91 99999 88888',
      email: salonData.email || 'contact@salon.in',
      address: salonData.address || 'Central Avenue',
      city: salonData.city || 'Chennai',
      state: salonData.state || 'Tamil Nadu',
      country: 'India',
      postal_code: salonData.postal_code || '600001',
      latitude: salonData.latitude || 13.0827,
      longitude: salonData.longitude || 80.2707,
      logo_url: salonData.logo_url || 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=200&h=200&q=80',
      cover_image_url: salonData.cover_image_url || 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1200&q=80',
      status: salonData.status || 'PENDING',
      rating: 5.0,
      review_count: 0,
      category_ids: salonData.category_ids || ['cat-1'],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    salons.push(newSalon);
    setStored(STORAGE_KEYS.SALONS, [...salons]);
    return newSalon;
  }

  public updateSalonStatus(salonId: string, status: 'PENDING' | 'ACTIVE' | 'SUSPENDED' | 'INACTIVE', actorName: string): void {
    const salons = this.getSalons();
    const s = salons.find((item) => item.id === salonId);
    if (s) {
      s.status = status;
      s.updated_at = new Date().toISOString();
      setStored(STORAGE_KEYS.SALONS, [...salons]);

      this.addAuditLog({
        actor_id: 'admin',
        actor_name: actorName,
        action: `SALON_STATUS_${status}`,
        entity_type: 'SALON',
        entity_id: salonId,
        metadata: { salon_name: s.name, new_status: status }
      });
    }
  }

  // --- Notifications & Audit ---
  public addNotification(notif: Omit<Notification, 'id' | 'read' | 'created_at'>): void {
    const notifs = this.getNotifications();
    const newNotif: Notification = {
      ...notif,
      id: `notif-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
      read: false,
      created_at: new Date().toISOString()
    };
    setStored(STORAGE_KEYS.NOTIFICATIONS, [newNotif, ...notifs]);
  }

  public markNotificationRead(notifId: string): void {
    const notifs = this.getNotifications();
    const target = notifs.find((n) => n.id === notifId);
    if (target) {
      target.read = true;
      setStored(STORAGE_KEYS.NOTIFICATIONS, [...notifs]);
    }
  }

  public markAllNotificationsRead(userId: string): void {
    const notifs = this.getNotifications();
    notifs.forEach((n) => {
      if (n.user_id === userId) n.read = true;
    });
    setStored(STORAGE_KEYS.NOTIFICATIONS, [...notifs]);
  }

  public addAuditLog(log: Omit<AuditLog, 'id' | 'created_at'>): void {
    const logs = this.getAuditLogs();
    const newLog: AuditLog = {
      ...log,
      id: `audit-${Date.now()}`,
      created_at: new Date().toISOString()
    };
    setStored(STORAGE_KEYS.AUDIT_LOGS, [newLog, ...logs]);
  }
}

export const db = DatabaseService.getInstance();
