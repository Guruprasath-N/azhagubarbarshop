import React, { useState, useMemo, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { calculateAvailability, formatTime12h } from '../../services/availabilityEngine';
import { Service, Staff } from '../../types';
import {
  X,
  CheckCircle2,
  Calendar as CalendarIcon,
  Clock,
  User,
  Scissors,
  ChevronRight,
  ChevronLeft,
  AlertCircle,
  Sparkles
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const BookingModal: React.FC = () => {
  const {
    isBookingModalOpen,
    setIsBookingModalOpen,
    selectedSalonId,
    selectedServiceForBooking,
    salons,
    services,
    staff,
    salonHours,
    staffHours,
    staffLeaves,
    appointments,
    bookAppointment,
    setCurrentView
  } = useApp();

  const { currentUser } = useAuth();

  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [currentService, setCurrentService] = useState<Service | null>(null);
  const [selectedStaffId, setSelectedStaffId] = useState<string>('ANY');
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    const d = new Date();
    // Default to tomorrow or today
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  });
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<{ time: string; endTime: string; assignedStaffId?: string } | null>(null);
  const [notes, setNotes] = useState('');
  const [clientName, setClientName] = useState(currentUser?.full_name || '');
  const [clientPhone, setClientPhone] = useState(currentUser?.phone || '+91 ');
  const [clientEmail, setClientEmail] = useState(currentUser?.email || '');
  const [paymentMethod, setPaymentMethod] = useState<'PAY_AT_SALON' | 'UPI' | 'CARD'>('PAY_AT_SALON');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingSuccessResult, setBookingSuccessResult] = useState<any>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const salon = salons.find((s) => s.id === selectedSalonId) || salons[0];
  const salonServices = services.filter((s) => s.salon_id === salon?.id && s.is_active);

  // Sync props
  useEffect(() => {
    if (selectedServiceForBooking) {
      setCurrentService(selectedServiceForBooking);
    } else if (salonServices.length > 0) {
      setCurrentService(salonServices[0]);
    }
  }, [selectedServiceForBooking, salonServices]);

  useEffect(() => {
    if (currentUser) {
      setClientName(currentUser.full_name);
      setClientPhone(currentUser.phone);
      setClientEmail(currentUser.email);
    }
  }, [currentUser]);

  // Eligible Staff for current service
  const eligibleStaff = useMemo(() => {
    if (!currentService || !salon) return [];
    return staff.filter(
      (st) => st.salon_id === salon.id && st.is_active && st.service_ids.includes(currentService.id)
    );
  }, [staff, currentService, salon]);

  // Date list: next 14 days
  const dateOptions = useMemo(() => {
    const list: { dateStr: string; dayName: string; dayNum: number; monthName: string }[] = [];
    const today = new Date();
    for (let i = 0; i < 14; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      const dateStr = d.toISOString().split('T')[0];
      const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
      const dayNum = d.getDate();
      const monthName = d.toLocaleDateString('en-US', { month: 'short' });
      list.push({ dateStr, dayName, dayNum, monthName });
    }
    return list;
  }, []);

  // Compute Availability using our mathematical engine
  const availabilityResult = useMemo(() => {
    if (!salon || !currentService || !selectedDate) {
      return { slots: [], isClosedDay: false };
    }

    return calculateAvailability({
      salon,
      service: currentService,
      staffId: selectedStaffId,
      selectedDate,
      allStaff: staff,
      salonHours,
      staffHours,
      staffLeaves,
      existingAppointments: appointments
    });
  }, [salon, currentService, selectedStaffId, selectedDate, staff, salonHours, staffHours, staffLeaves, appointments]);

  if (!isBookingModalOpen || !salon) return null;

  const handleNextStep = () => {
    setErrorMessage(null);
    if (step === 1 && !currentService) {
      setErrorMessage('Please select a service to proceed.');
      return;
    }
    if (step === 3 && !selectedDate) {
      setErrorMessage('Please select an appointment date.');
      return;
    }
    if (step === 4 && !selectedTimeSlot) {
      setErrorMessage('Please pick an available time slot.');
      return;
    }
    setStep((prev) => Math.min(5, prev + 1) as any);
  };

  const handlePrevStep = () => {
    setErrorMessage(null);
    setStep((prev) => Math.max(1, prev - 1) as any);
  };

  const handleConfirmBooking = () => {
    if (!currentService || !selectedTimeSlot) return;

    if (!clientName.trim() || !clientPhone.trim() || !clientEmail.trim()) {
      setErrorMessage('Please provide your name, phone number, and email.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    const actualStaffId =
      selectedStaffId === 'ANY'
        ? selectedTimeSlot.assignedStaffId || eligibleStaff[0]?.id
        : selectedStaffId;

    const paymentStatus = paymentMethod === 'PAY_AT_SALON' ? 'PAY_AT_SALON' : 'PAID';

    const result = bookAppointment({
      customer_id: currentUser?.id || 'guest-user',
      salon_id: salon.id,
      staff_id: actualStaffId,
      service_id: currentService.id,
      appointment_date: selectedDate,
      start_time: selectedTimeSlot.time,
      end_time: selectedTimeSlot.endTime,
      notes,
      customer_name: clientName,
      customer_phone: clientPhone,
      customer_email: clientEmail,
      payment_method: paymentMethod,
      payment_status: paymentStatus
    });

    setIsSubmitting(false);

    if (result.success && result.appointment) {
      setBookingSuccessResult(result.appointment);
      try {
        confetti({
          particleCount: 80,
          spread: 60,
          origin: { y: 0.6 }
        });
      } catch (e) {
        // canvas-confetti fallback
      }
    } else {
      setErrorMessage(result.error || 'Double booking error: slot is no longer available.');
    }
  };

  const handleClose = () => {
    setIsBookingModalOpen(false);
    setStep(1);
    setSelectedTimeSlot(null);
    setBookingSuccessResult(null);
    setErrorMessage(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white border border-neutral-200 rounded-sm shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-neutral-200 flex items-center justify-between bg-neutral-50 flex-none">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-sm bg-neutral-900 text-white flex items-center justify-center">
              <Scissors className="w-3.5 h-3.5" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-neutral-950">Book at {salon.name}</h2>
              <span className="text-[10px] text-neutral-400 font-mono uppercase">
                Step {step} of 5 — {step === 1 ? 'Service' : step === 2 ? 'Stylist' : step === 3 ? 'Date' : step === 4 ? 'Time Slot' : 'Confirm'}
              </span>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 text-neutral-400 hover:text-neutral-700 rounded-sm hover:bg-neutral-200/50"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 text-neutral-900 text-xs">
          {errorMessage && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-sm flex items-start gap-2.5 text-red-700">
              <AlertCircle className="w-4 h-4 flex-none mt-0.5" />
              <div className="text-xs leading-relaxed">{errorMessage}</div>
            </div>
          )}

          {/* SUCCESS SCREEN */}
          {bookingSuccessResult ? (
            <div className="text-center py-6 space-y-5">
              <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>

              <div>
                <h3 className="text-lg font-semibold text-neutral-950 mb-1">Appointment Confirmed!</h3>
                <p className="text-xs text-neutral-500">
                  Your reservation is locked in our real-time availability ledger.
                </p>
              </div>

              <div className="bg-neutral-50 border border-neutral-200 rounded-sm p-4 text-left max-w-md mx-auto space-y-2.5 font-mono text-xs">
                <div className="flex justify-between pb-2 border-b border-neutral-200">
                  <span className="text-neutral-400">Booking ID</span>
                  <span className="text-neutral-950 font-bold">{bookingSuccessResult.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">Salon</span>
                  <span className="text-neutral-900">{bookingSuccessResult.salon_name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">Service</span>
                  <span className="text-neutral-900">{bookingSuccessResult.service_name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">Stylist</span>
                  <span className="text-neutral-900">{bookingSuccessResult.staff_name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">Date & Time</span>
                  <span className="text-neutral-900 font-semibold">
                    {bookingSuccessResult.appointment_date} at {formatTime12h(bookingSuccessResult.start_time)}
                  </span>
                </div>
                <div className="flex justify-between pt-2 border-t border-neutral-200">
                  <span className="text-neutral-400">Amount Due</span>
                  <span className="text-neutral-950 font-bold text-sm">
                    ₹{bookingSuccessResult.total_price.toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => {
                    handleClose();
                    setCurrentView('MY_BOOKINGS');
                  }}
                  className="px-5 py-2.5 bg-neutral-950 text-white text-xs font-semibold uppercase tracking-wider rounded-sm hover:bg-neutral-800"
                >
                  View in My Bookings
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* STEP 1: SERVICE SELECTION */}
              {step === 1 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-neutral-900">Choose Treatment</span>
                    <span className="text-[10px] text-neutral-400 font-mono">{salonServices.length} Options</span>
                  </div>

                  <div className="space-y-2 max-h-72 overflow-y-auto">
                    {salonServices.map((srv) => {
                      const isSelected = currentService?.id === srv.id;
                      return (
                        <div
                          key={srv.id}
                          onClick={() => setCurrentService(srv)}
                          className={`p-3 rounded-sm border cursor-pointer transition-all flex items-center justify-between ${
                            isSelected
                              ? 'bg-neutral-900 text-white border-neutral-900'
                              : 'bg-neutral-50 text-neutral-900 border-neutral-200 hover:border-neutral-400'
                          }`}
                        >
                          <div>
                            <div className="font-semibold text-xs">{srv.name}</div>
                            <div className={`text-[11px] ${isSelected ? 'text-neutral-300' : 'text-neutral-500'}`}>
                              {srv.duration_minutes} mins • {srv.description}
                            </div>
                          </div>
                          <div className="text-right font-mono font-semibold text-xs flex-none ml-4">
                            ₹{srv.price.toLocaleString()}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* STEP 2: STYLIST SELECTION */}
              {step === 2 && (
                <div className="space-y-4">
                  <div>
                    <span className="text-xs font-semibold text-neutral-900">Select Specialist</span>
                    <p className="text-[11px] text-neutral-500 mt-0.5">
                      Stylists qualified for {currentService?.name}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-72 overflow-y-auto">
                    {/* Any Available Stylist Card */}
                    <div
                      onClick={() => setSelectedStaffId('ANY')}
                      className={`p-3 rounded-sm border cursor-pointer transition-all flex items-center gap-3 ${
                        selectedStaffId === 'ANY'
                          ? 'bg-neutral-900 text-white border-neutral-900'
                          : 'bg-neutral-50 text-neutral-900 border-neutral-200 hover:border-neutral-400'
                      }`}
                    >
                      <div className="w-10 h-10 rounded-sm bg-neutral-200 flex items-center justify-center text-neutral-700 flex-none font-bold text-xs">
                        ANY
                      </div>
                      <div>
                        <div className="font-semibold text-xs">Any Available Stylist</div>
                        <div className="text-[11px] opacity-75">Fastest slot allocation</div>
                      </div>
                    </div>

                    {/* Specific Stylists */}
                    {eligibleStaff.map((st) => {
                      const isSelected = selectedStaffId === st.id;
                      return (
                        <div
                          key={st.id}
                          onClick={() => setSelectedStaffId(st.id)}
                          className={`p-3 rounded-sm border cursor-pointer transition-all flex items-center gap-3 ${
                            isSelected
                              ? 'bg-neutral-900 text-white border-neutral-900'
                              : 'bg-neutral-50 text-neutral-900 border-neutral-200 hover:border-neutral-400'
                          }`}
                        >
                          <img
                            src={st.avatar_url}
                            alt={st.display_name}
                            className="w-10 h-10 rounded-sm object-cover flex-none border border-neutral-300"
                          />
                          <div className="overflow-hidden">
                            <div className="font-semibold text-xs truncate">{st.display_name}</div>
                            <div className="text-[11px] opacity-75 truncate">{st.specialization}</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* STEP 3: DATE SELECTION */}
              {step === 3 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-neutral-900">Select Date</span>
                    <span className="text-[10px] text-neutral-400 font-mono">14 Days Schedule</span>
                  </div>

                  <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                    {dateOptions.map((opt) => {
                      const isSelected = selectedDate === opt.dateStr;
                      return (
                        <button
                          key={opt.dateStr}
                          onClick={() => {
                            setSelectedDate(opt.dateStr);
                            setSelectedTimeSlot(null);
                          }}
                          className={`p-2.5 rounded-sm border text-center transition-all flex flex-col items-center justify-center ${
                            isSelected
                              ? 'bg-neutral-900 text-white border-neutral-900'
                              : 'bg-neutral-50 text-neutral-800 border-neutral-200 hover:border-neutral-400'
                          }`}
                        >
                          <span className="text-[10px] uppercase font-mono opacity-80">{opt.dayName}</span>
                          <span className="text-base font-semibold my-0.5">{opt.dayNum}</span>
                          <span className="text-[9px] font-mono opacity-70">{opt.monthName}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* STEP 4: TIME SLOT SELECTION */}
              {step === 4 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-semibold text-neutral-900">Choose Verified Slot</span>
                      <span className="text-[11px] text-neutral-400 block">
                        Duration: {currentService?.duration_minutes} mins on {selectedDate}
                      </span>
                    </div>
                  </div>

                  {availabilityResult.isClosedDay ? (
                    <div className="p-6 bg-neutral-50 border border-neutral-200 rounded-sm text-center">
                      <Clock className="w-6 h-6 text-neutral-400 mx-auto mb-2" />
                      <p className="text-xs text-neutral-600 font-medium">
                        {availabilityResult.closedReason || 'No availability on this date.'}
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 max-h-64 overflow-y-auto">
                      {availabilityResult.slots.map((slot) => {
                        const isSelected = selectedTimeSlot?.time === slot.time;
                        return (
                          <button
                            key={slot.time}
                            disabled={!slot.available}
                            onClick={() => setSelectedTimeSlot(slot)}
                            className={`p-2 rounded-sm border text-center transition-all ${
                              !slot.available
                                ? 'bg-neutral-100 text-neutral-300 border-neutral-200 cursor-not-allowed line-through'
                                : isSelected
                                ? 'bg-neutral-900 text-white border-neutral-900 font-semibold'
                                : 'bg-neutral-50 text-neutral-800 border-neutral-200 hover:border-neutral-900'
                            }`}
                          >
                            <span className="text-xs font-mono block">{formatTime12h(slot.time)}</span>
                            <span className="text-[9px] opacity-70 block font-mono">
                              until {formatTime12h(slot.endTime)}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* STEP 5: REVIEW & SUMMARY */}
              {step === 5 && (
                <div className="space-y-4">
                  <div className="p-4 bg-neutral-50 border border-neutral-200 rounded-sm space-y-2 font-mono text-xs">
                    <div className="flex justify-between">
                      <span className="text-neutral-400">Treatment</span>
                      <span className="text-neutral-900 font-semibold">{currentService?.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-400">Stylist</span>
                      <span className="text-neutral-900">
                        {selectedStaffId === 'ANY'
                          ? `Allocated: ${selectedTimeSlot?.assignedStaffId ? staff.find(s => s.id === selectedTimeSlot.assignedStaffId)?.display_name : 'Best Available'}`
                          : staff.find((s) => s.id === selectedStaffId)?.display_name}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-400">Schedule</span>
                      <span className="text-neutral-900">
                        {selectedDate} at {selectedTimeSlot?.time ? formatTime12h(selectedTimeSlot.time) : ''}
                      </span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-neutral-200">
                      <span className="text-neutral-400">Total Due</span>
                      <span className="text-neutral-950 font-bold text-sm">
                        ₹{currentService?.price.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Client Contact Inputs */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <div>
                      <label className="text-[10px] uppercase font-mono text-neutral-400 block mb-1">Full Name</label>
                      <input
                        type="text"
                        value={clientName}
                        onChange={(e) => setClientName(e.target.value)}
                        className="w-full px-2.5 py-1.5 bg-neutral-50 border border-neutral-200 rounded-sm text-xs"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] uppercase font-mono text-neutral-400 block mb-1">Phone</label>
                      <input
                        type="text"
                        value={clientPhone}
                        onChange={(e) => setClientPhone(e.target.value)}
                        className="w-full px-2.5 py-1.5 bg-neutral-50 border border-neutral-200 rounded-sm text-xs"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] uppercase font-mono text-neutral-400 block mb-1">Email</label>
                      <input
                        type="email"
                        value={clientEmail}
                        onChange={(e) => setClientEmail(e.target.value)}
                        className="w-full px-2.5 py-1.5 bg-neutral-50 border border-neutral-200 rounded-sm text-xs"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] uppercase font-mono text-neutral-400 block mb-1.5 font-bold">
                      Payment Verification & Option
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('PAY_AT_SALON')}
                        className={`p-2.5 border text-left rounded-sm transition-all ${
                          paymentMethod === 'PAY_AT_SALON'
                            ? 'border-neutral-950 bg-neutral-900 text-white font-semibold'
                            : 'border-neutral-200 bg-neutral-50 text-neutral-700 hover:border-neutral-400'
                        }`}
                      >
                        <div className="text-xs font-medium">Pay at Salon</div>
                        <div className="text-[10px] opacity-75 mt-0.5">Pay after service</div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setPaymentMethod('UPI')}
                        className={`p-2.5 border text-left rounded-sm transition-all ${
                          paymentMethod === 'UPI'
                            ? 'border-neutral-950 bg-neutral-900 text-white font-semibold'
                            : 'border-neutral-200 bg-neutral-50 text-neutral-700 hover:border-neutral-400'
                        }`}
                      >
                        <div className="text-xs font-medium">Instant UPI</div>
                        <div className="text-[10px] opacity-75 mt-0.5">Google Pay / PhonePe</div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setPaymentMethod('CARD')}
                        className={`p-2.5 border text-left rounded-sm transition-all ${
                          paymentMethod === 'CARD'
                            ? 'border-neutral-950 bg-neutral-900 text-white font-semibold'
                            : 'border-neutral-200 bg-neutral-50 text-neutral-700 hover:border-neutral-400'
                        }`}
                      >
                        <div className="text-xs font-medium">Credit / Debit Card</div>
                        <div className="text-[10px] opacity-75 mt-0.5">Visa / Mastercard</div>
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] uppercase font-mono text-neutral-400 block mb-1">
                      Notes / Hair or Skin Requests (Optional)
                    </label>
                    <textarea
                      rows={2}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="e.g. Sensitive scalp, preferring ammonia-free bleach, reference haircut photos..."
                      className="w-full px-2.5 py-1.5 bg-neutral-50 border border-neutral-200 rounded-sm text-xs resize-none"
                    />
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Modal Footer Controls */}
        {!bookingSuccessResult && (
          <div className="px-6 py-3 border-t border-neutral-200 bg-white flex items-center justify-between flex-none">
            {step > 1 ? (
              <button
                onClick={handlePrevStep}
                className="px-3 py-1.5 text-xs text-neutral-600 hover:text-neutral-900 border border-neutral-200 rounded-sm flex items-center gap-1"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                Back
              </button>
            ) : (
              <div />
            )}

            {step < 5 ? (
              <button
                onClick={handleNextStep}
                className="px-5 py-2 bg-neutral-900 text-white text-xs font-semibold rounded-sm hover:bg-neutral-800 transition-colors flex items-center gap-1"
              >
                Continue
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                disabled={isSubmitting}
                onClick={handleConfirmBooking}
                className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold uppercase tracking-wider rounded-sm transition-colors flex items-center gap-1.5 shadow-sm"
              >
                {isSubmitting ? 'Verifying Lock...' : 'Confirm & Reserve Slot'}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
