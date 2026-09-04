import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { Appointment } from '../../types';
import { formatTime12h } from '../../services/availabilityEngine';
import { FullOrderModal } from './FullOrderModal';
import { NearestAttractions } from './NearestAttractions';
import {
  Calendar,
  Clock,
  User,
  MapPin,
  Star,
  Ban,
  Scissors,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  Sparkles,
  FileText,
  Navigation,
  Phone,
  Gift,
  ChevronDown,
  ChevronUp,
  Receipt
} from 'lucide-react';

export const MyBookings: React.FC = () => {
  const {
    appointments,
    salons,
    reviews,
    cancelBooking,
    setIsReviewModalOpen,
    setTargetAppointmentForReview,
    setCurrentView,
    navigateToSalon
  } = useApp();

  const { currentUser, role } = useAuth();
  const [tab, setTab] = useState<'UPCOMING' | 'PAST' | 'CANCELLED'>('UPCOMING');
  const [cancelModalAppointment, setCancelModalAppointment] = useState<Appointment | null>(null);
  const [cancelError, setCancelError] = useState<string | null>(null);
  const [selectedOrderForModal, setSelectedOrderForModal] = useState<Appointment | null>(null);
  const [showNearestAttractions, setShowNearestAttractions] = useState<boolean>(true);

  // Filter bookings for active user (or all if demo testing)
  const myAppointments = appointments.filter((appt) => {
    if (role === 'CUSTOMER' && currentUser) {
      return appt.customer_id === currentUser.id || appt.customer_email === currentUser.email;
    }
    return true;
  });

  const upcomingList = myAppointments.filter(
    (a) => a.status === 'CONFIRMED' || a.status === 'PENDING'
  );
  const pastList = myAppointments.filter((a) => a.status === 'COMPLETED');
  const cancelledList = myAppointments.filter((a) => a.status === 'CANCELLED');

  const currentList =
    tab === 'UPCOMING' ? upcomingList : tab === 'PAST' ? pastList : cancelledList;

  const handleConfirmCancel = () => {
    if (!cancelModalAppointment) return;
    setCancelError(null);

    const res = cancelBooking(
      cancelModalAppointment.id,
      currentUser?.id || 'customer',
      'CUSTOMER'
    );

    if (res.success) {
      setCancelModalAppointment(null);
    } else {
      setCancelError(res.error || 'Failed to cancel appointment.');
    }
  };

  const scrollToNearestAttractions = () => {
    setShowNearestAttractions(true);
    setTimeout(() => {
      document.getElementById('nearest-10-customer-attraction')?.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }, 100);
  };

  return (
    <div className="bg-neutral-50 min-h-screen py-10 px-6 lg:px-10 text-neutral-900 font-sans">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div className="border-b border-neutral-200 pb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-[10px] uppercase font-bold text-neutral-400 font-mono tracking-widest block mb-1">
              Personal Appointment History
            </span>
            <h1 className="text-3xl font-light text-neutral-950">My Reservations</h1>
          </div>
          <button
            onClick={() => setCurrentView('DISCOVER')}
            className="px-4 py-2 bg-neutral-900 text-white text-xs font-semibold rounded-sm hover:bg-neutral-800 transition-colors flex items-center gap-1.5"
          >
            <Scissors className="w-3.5 h-3.5" />
            Book New Treatment
          </button>
        </div>

        {/* Tab Filters */}
        <div className="bg-white border border-neutral-200 rounded-sm p-1 flex items-center gap-1 text-xs">
          <button
            id="tab-upcoming"
            onClick={() => setTab('UPCOMING')}
            className={`flex-1 py-2 rounded-xs font-medium transition-colors ${
              tab === 'UPCOMING'
                ? 'bg-neutral-900 text-white'
                : 'text-neutral-600 hover:text-neutral-950 hover:bg-neutral-50'
            }`}
          >
            Upcoming Reservations ({upcomingList.length})
          </button>
          <button
            id="tab-past"
            onClick={() => setTab('PAST')}
            className={`flex-1 py-2 rounded-xs font-medium transition-colors ${
              tab === 'PAST'
                ? 'bg-neutral-900 text-white'
                : 'text-neutral-600 hover:text-neutral-950 hover:bg-neutral-50'
            }`}
          >
            Completed & History ({pastList.length})
          </button>
          <button
            id="tab-cancelled"
            onClick={() => setTab('CANCELLED')}
            className={`flex-1 py-2 rounded-xs font-medium transition-colors ${
              tab === 'CANCELLED'
                ? 'bg-neutral-900 text-white'
                : 'text-neutral-600 hover:text-neutral-950 hover:bg-neutral-50'
            }`}
          >
            Cancelled ({cancelledList.length})
          </button>
        </div>

        {/* Bookings List */}
        <div className="space-y-5">
          {currentList.length === 0 ? (
            <div className="p-12 bg-white border border-neutral-200 rounded-sm text-center">
              <Calendar className="w-8 h-8 text-neutral-400 mx-auto mb-3" />
              <h3 className="text-base font-semibold text-neutral-900 mb-1">
                No {tab.toLowerCase()} appointments found
              </h3>
              <p className="text-xs text-neutral-500 max-w-sm mx-auto mb-4">
                Explore our curated salons and book your next haircut, treatment, or styling session.
              </p>
              <button
                onClick={() => setCurrentView('DISCOVER')}
                className="px-4 py-2 bg-neutral-900 text-white text-xs font-medium rounded-sm cursor-pointer hover:bg-neutral-800"
              >
                Discover Salons
              </button>
            </div>
          ) : (
            currentList.map((appt) => {
              const existingReview = reviews.find((r) => r.appointment_id === appt.id);
              const targetSalon = salons.find((s) => s.id === appt.salon_id);
              const basePrice = Math.round(appt.total_price / 1.18);
              const gst = appt.total_price - basePrice;
              const isFlagship = appt.id === 'appt-101';

              return (
                <div
                  key={appt.id}
                  id={`booking-card-${appt.id}`}
                  className={`bg-white border rounded-sm p-5 space-y-4 transition-all duration-200 ${
                    isFlagship
                      ? 'border-amber-400/90 ring-1 ring-amber-400/30 shadow-xs bg-gradient-to-b from-amber-50/15 via-white to-white'
                      : 'border-neutral-200 hover:border-neutral-350'
                  }`}
                >
                  {/* Card Header Ribbon */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-neutral-100 gap-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs font-bold text-neutral-950">
                        {appt.salon_name}
                      </span>
                      <span className="text-neutral-300">•</span>
                      <span className="text-xs text-neutral-500 font-mono">
                        #ORD-TN-{appt.id.toUpperCase()}
                      </span>
                      {isFlagship && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-mono bg-amber-50 text-amber-900 border border-amber-300/80 rounded-xs font-semibold">
                          <MapPin className="w-3 h-3 text-red-500 flex-none" />
                          Nearest Studio: 0.8 km · Anna Nagar
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider rounded-xs font-semibold inline-block w-fit ${
                          appt.status === 'CONFIRMED'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : appt.status === 'COMPLETED'
                            ? 'bg-blue-50 text-blue-700 border border-blue-200'
                            : appt.status === 'CANCELLED'
                            ? 'bg-neutral-100 text-neutral-500 border border-neutral-200 line-through'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}
                      >
                        {appt.status}
                      </span>
                    </div>
                  </div>

                  {/* Order Live Stepper (for upcoming/confirmed) */}
                  {appt.status === 'CONFIRMED' && (
                    <div className="bg-neutral-50/80 border border-neutral-200/70 rounded-xs p-2.5 text-[10px] font-mono">
                      <div className="grid grid-cols-4 gap-1 text-center">
                        <div className="text-emerald-700 font-semibold">
                          <span className="inline-block w-4 h-4 rounded-full bg-emerald-600 text-white leading-4 text-center mr-1">✓</span>
                          Order Placed
                        </div>
                        <div className="text-emerald-700 font-semibold">
                          <span className="inline-block w-4 h-4 rounded-full bg-emerald-600 text-white leading-4 text-center mr-1">✓</span>
                          Studio Confirmed
                        </div>
                        <div className="text-emerald-700 font-semibold">
                          <span className="inline-block w-4 h-4 rounded-full bg-emerald-600 text-white leading-4 text-center mr-1">✓</span>
                          Stylist Assigned
                        </div>
                        <div className="text-amber-800 font-semibold">
                          <span className="inline-block w-4 h-4 rounded-full bg-amber-600 text-white leading-4 text-center mr-1 animate-pulse">4</span>
                          Ready for Check-in
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Order Main Details Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
                    <div className="sm:col-span-1">
                      <span className="text-[10px] uppercase font-mono text-neutral-400 block mb-1">
                        Service Treatment
                      </span>
                      <p className="font-semibold text-neutral-900 leading-snug">{appt.service_name}</p>
                      <p className="text-neutral-500 font-mono text-[11px] pt-1">
                        Base: ₹{basePrice.toLocaleString()} + GST (18%): ₹{gst.toLocaleString()}
                      </p>
                    </div>

                    <div>
                      <span className="text-[10px] uppercase font-mono text-neutral-400 block mb-1">
                        Stylist Specialist
                      </span>
                      <p className="font-semibold text-neutral-900 flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-neutral-400" />
                        {appt.staff_name}
                      </p>
                      <p className="text-[11px] text-neutral-400 font-mono mt-0.5">
                        Verified Senior Stylist
                      </p>
                    </div>

                    <div>
                      <span className="text-[10px] uppercase font-mono text-neutral-400 block mb-1">
                        Date & Scheduled Time
                      </span>
                      <p className="font-semibold text-neutral-900 flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-neutral-400" />
                        {appt.appointment_date}
                      </p>
                      <p className="text-neutral-600 font-mono pt-0.5 flex items-center gap-1 font-medium">
                        <Clock className="w-3.5 h-3.5 text-amber-600" />
                        {formatTime12h(appt.start_time)} - {formatTime12h(appt.end_time)}
                      </p>
                    </div>

                    <div className="sm:border-l sm:border-neutral-100 sm:pl-4">
                      <span className="text-[10px] uppercase font-mono text-neutral-400 block mb-1">
                        Total Order Due
                      </span>
                      <p className="text-base font-bold text-neutral-950 font-mono">
                        ₹{appt.total_price.toLocaleString()}
                      </p>
                      <span className="inline-block mt-0.5 text-[10px] text-emerald-700 font-mono bg-emerald-50 px-1.5 py-0.5 rounded-xs border border-emerald-200">
                        Pay at Counter / UPI
                      </span>
                    </div>
                  </div>

                  {appt.notes && (
                    <div className="p-2.5 bg-neutral-50 border border-neutral-100 rounded-sm text-[11px] text-neutral-600">
                      <span className="font-semibold text-neutral-900">Client Note: </span>
                      {appt.notes}
                    </div>
                  )}

                  {/* Proximity & Studio Address Bar */}
                  <div className="bg-neutral-50/60 p-2.5 rounded-xs border border-neutral-200/60 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] text-neutral-600">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-neutral-400 flex-none" />
                      <span>{targetSalon?.address || '2nd Avenue, Near Roundtana'}, {targetSalon?.city || 'Chennai'}</span>
                      <span className="text-neutral-300">•</span>
                      <span className="text-neutral-500 font-mono">
                        {isFlagship ? '0.8 km from user' : 'Verified Partner Studio'}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <a
                        href={`tel:${targetSalon?.phone || '+919840123456'}`}
                        className="text-neutral-600 hover:text-neutral-950 flex items-center gap-1 font-medium font-mono"
                      >
                        <Phone className="w-3 h-3 text-neutral-400" />
                        <span>Call Reception</span>
                      </a>
                      <button
                        onClick={scrollToNearestAttractions}
                        className="text-amber-800 hover:text-amber-950 font-semibold flex items-center gap-1 cursor-pointer"
                      >
                        <Sparkles className="w-3 h-3 text-amber-500" />
                        <span>Nearest 10 Attractions</span>
                      </button>
                    </div>
                  </div>

                  {/* Actions Row */}
                  <div className="pt-3 border-t border-neutral-100 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      {/* View Full Order Modal CTA */}
                      <button
                        onClick={() => setSelectedOrderForModal(appt)}
                        className="px-3 py-1.5 bg-neutral-950 text-white hover:bg-neutral-800 text-xs font-semibold rounded-sm transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
                      >
                        <Receipt className="w-3.5 h-3.5 text-amber-400" />
                        <span>View Full Order & Tax Invoice</span>
                      </button>

                      <button
                        onClick={() => navigateToSalon(appt.salon_id)}
                        className="px-3 py-1.5 border border-neutral-200 hover:bg-neutral-50 text-xs text-neutral-700 font-medium rounded-sm transition-colors"
                      >
                        View Salon Page
                      </button>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Cancel Action (for upcoming) */}
                      {appt.status === 'CONFIRMED' && (
                        <button
                          onClick={() => {
                            setCancelError(null);
                            setCancelModalAppointment(appt);
                          }}
                          className="px-3 py-1.5 border border-red-200 text-red-700 bg-red-50 hover:bg-red-100 text-xs font-medium rounded-sm transition-colors flex items-center gap-1 cursor-pointer"
                        >
                          <Ban className="w-3.5 h-3.5" />
                          Cancel Appointment
                        </button>
                      )}

                      {/* Review Action (for completed) */}
                      {appt.status === 'COMPLETED' && (
                        <>
                          {existingReview ? (
                            <div className="flex items-center gap-1 text-xs text-emerald-700 bg-emerald-50 px-2.5 py-1 border border-emerald-200 rounded-sm">
                              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                              <span>Rated {existingReview.rating}.0 ★</span>
                            </div>
                          ) : (
                            <button
                              onClick={() => {
                                setTargetAppointmentForReview(appt);
                                setIsReviewModalOpen(true);
                              }}
                              className="px-3 py-1.5 bg-neutral-900 text-white hover:bg-neutral-800 text-xs font-medium rounded-sm transition-colors flex items-center gap-1 cursor-pointer"
                            >
                              <Star className="w-3.5 h-3.5 text-amber-400" />
                              Leave Verified Review
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Nearest 10 Customer Attractions & Exclusive Studio Perks */}
        <div className="pt-8 border-t border-neutral-200 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-[10px] uppercase font-bold text-amber-700 font-mono tracking-widest block mb-1">
                Proximity Attraction Engine
              </span>
              <h2 className="text-2xl font-light text-neutral-950">
                Nearest 10 Studios & Customer Attraction Offers
              </h2>
            </div>
            <button
              onClick={() => setShowNearestAttractions(!showNearestAttractions)}
              className="px-3 py-1.5 border border-neutral-300 hover:bg-neutral-100 text-xs font-medium rounded-sm flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
            >
              {showNearestAttractions ? (
                <>
                  <ChevronUp className="w-3.5 h-3.5 text-neutral-500" />
                  <span>Minimize Nearest 10</span>
                </>
              ) : (
                <>
                  <ChevronDown className="w-3.5 h-3.5 text-neutral-500" />
                  <span>Show Nearest 10 Studios</span>
                </>
              )}
            </button>
          </div>

          {showNearestAttractions && (
            <NearestAttractions
              salons={salons}
              currentSalonId="salon-1"
              onNavigateToSalon={navigateToSalon}
            />
          )}
        </div>
      </div>

      {/* Full Order & Tax Invoice Modal */}
      {selectedOrderForModal && (
        <FullOrderModal
          appointment={selectedOrderForModal}
          salon={salons.find((s) => s.id === selectedOrderForModal.salon_id)}
          onClose={() => setSelectedOrderForModal(null)}
          onNavigateToSalon={navigateToSalon}
        />
      )}

      {/* Cancellation Confirmation Dialog */}
      {cancelModalAppointment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/60 backdrop-blur-xs">
          <div className="bg-white border border-neutral-200 rounded-sm p-6 max-w-md w-full shadow-2xl space-y-4 text-xs text-neutral-900">
            <div className="flex items-center gap-2 text-red-600 font-semibold text-sm">
              <AlertCircle className="w-4 h-4" />
              <span>Cancel Appointment?</span>
            </div>

            <p className="text-neutral-600 leading-relaxed">
              Are you sure you want to cancel your reservation for{' '}
              <span className="font-semibold text-neutral-900">
                {cancelModalAppointment.service_name}
              </span>{' '}
              at{' '}
              <span className="font-semibold text-neutral-900">
                {cancelModalAppointment.salon_name}
              </span>{' '}
              on {cancelModalAppointment.appointment_date} at{' '}
              {formatTime12h(cancelModalAppointment.start_time)}?
            </p>

            <div className="p-2.5 bg-neutral-50 border border-neutral-200 rounded-sm text-[11px] text-neutral-500 font-mono">
              Policy Rule: Cancellations permitted up to 2 hours before scheduled slot.
            </div>

            {cancelError && (
              <div className="p-2.5 bg-red-50 border border-red-200 text-red-700 rounded-sm text-xs">
                {cancelError}
              </div>
            )}

            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                onClick={() => setCancelModalAppointment(null)}
                className="px-4 py-2 border border-neutral-200 rounded-sm text-neutral-600 hover:bg-neutral-50"
              >
                Keep Appointment
              </button>
              <button
                onClick={handleConfirmCancel}
                className="px-4 py-2 bg-red-600 text-white rounded-sm hover:bg-red-700 font-medium"
              >
                Confirm Cancellation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
