import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  MapPin,
  Phone,
  Mail,
  Star,
  Clock,
  Scissors,
  User,
  ArrowLeft,
  CheckCircle2,
  Calendar,
  Sparkles
} from 'lucide-react';
import { Service } from '../../types';

export const SalonDetails: React.FC = () => {
  const {
    selectedSalonId,
    salons,
    services,
    staff,
    salonHours,
    reviews,
    setCurrentView,
    openBookingForService
  } = useApp();

  const [activeTab, setActiveTab] = useState<'SERVICES' | 'STYLISTS' | 'REVIEWS' | 'HOURS'>('SERVICES');
  const [selectedServiceCategory, setSelectedServiceCategory] = useState<string>('ALL');

  const salon = salons.find((s) => s.id === selectedSalonId) || salons[0];
  const salonServices = services.filter((s) => s.salon_id === salon?.id && s.is_active);
  const salonStaff = staff.filter((st) => st.salon_id === salon?.id && st.is_active);
  const salonReviews = reviews.filter((r) => r.salon_id === salon?.id && r.status === 'PUBLISHED');
  const salonSchedule = salonHours.filter((wh) => wh.salon_id === salon?.id);

  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  if (!salon) {
    return (
      <div className="p-12 text-center">
        <p className="text-xs text-neutral-500">Salon not found.</p>
        <button
          onClick={() => setCurrentView('DISCOVER')}
          className="mt-4 px-4 py-2 bg-neutral-900 text-white text-xs rounded-sm"
        >
          Back to Directory
        </button>
      </div>
    );
  }

  return (
    <div className="bg-neutral-50 min-h-screen pb-16 text-neutral-900 font-sans">
      {/* Top Back Nav */}
      <div className="bg-white border-b border-neutral-200 px-6 lg:px-10 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <button
            onClick={() => setCurrentView('DISCOVER')}
            className="text-xs text-neutral-600 hover:text-neutral-950 flex items-center gap-1.5 font-medium"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to All Salons
          </button>
          <div className="text-[11px] font-mono text-neutral-400">
            Salon ID: <span className="text-neutral-900">{salon.slug}</span>
          </div>
        </div>
      </div>

      {/* Hero Cover Header */}
      <div className="relative h-64 sm:h-80 lg:h-96 w-full bg-neutral-900 overflow-hidden">
        <img
          src={salon.cover_image_url}
          alt={salon.name}
          className="w-full h-full object-cover opacity-85"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/80 via-neutral-950/20 to-transparent" />

        <div className="absolute bottom-6 left-6 lg:left-10 right-6 lg:right-10 max-w-7xl mx-auto text-white flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[10px] uppercase font-mono tracking-wider rounded-xs">
                Verified Studio
              </span>
              <span className="px-2 py-0.5 bg-white/20 backdrop-blur-xs text-white text-[10px] uppercase font-mono tracking-wider rounded-xs">
                {salon.city}, India
              </span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-light tracking-tight">{salon.name}</h1>
            <p className="text-xs sm:text-sm text-neutral-300 flex items-center gap-2 mt-1">
              <MapPin className="w-3.5 h-3.5 text-neutral-400 flex-none" />
              <span>{salon.address}</span>
            </p>
          </div>

          <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md p-3 rounded-sm border border-white/15">
            <div className="text-right">
              <div className="flex items-center justify-end gap-1 text-sm font-semibold">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span>{salon.rating}</span>
              </div>
              <span className="text-[10px] text-neutral-300 font-mono">
                {salon.review_count} Verified Reviews
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-6 lg:px-10 mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Left Content: Tabs & Catalog (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            {/* Tabs Header */}
            <div className="bg-white border border-neutral-200 rounded-sm p-1 flex items-center gap-1 text-xs">
              <button
                id="tab-services"
                onClick={() => setActiveTab('SERVICES')}
                className={`flex-1 py-2 rounded-xs font-medium transition-colors flex items-center justify-center gap-1.5 ${
                  activeTab === 'SERVICES'
                    ? 'bg-neutral-900 text-white'
                    : 'text-neutral-600 hover:text-neutral-950 hover:bg-neutral-50'
                }`}
              >
                <Scissors className="w-3.5 h-3.5" />
                Services Menu ({salonServices.length})
              </button>

              <button
                id="tab-stylists"
                onClick={() => setActiveTab('STYLISTS')}
                className={`flex-1 py-2 rounded-xs font-medium transition-colors flex items-center justify-center gap-1.5 ${
                  activeTab === 'STYLISTS'
                    ? 'bg-neutral-900 text-white'
                    : 'text-neutral-600 hover:text-neutral-950 hover:bg-neutral-50'
                }`}
              >
                <User className="w-3.5 h-3.5" />
                Master Stylists ({salonStaff.length})
              </button>

              <button
                id="tab-reviews"
                onClick={() => setActiveTab('REVIEWS')}
                className={`flex-1 py-2 rounded-xs font-medium transition-colors flex items-center justify-center gap-1.5 ${
                  activeTab === 'REVIEWS'
                    ? 'bg-neutral-900 text-white'
                    : 'text-neutral-600 hover:text-neutral-950 hover:bg-neutral-50'
                }`}
              >
                <Star className="w-3.5 h-3.5" />
                Reviews ({salonReviews.length})
              </button>

              <button
                id="tab-hours"
                onClick={() => setActiveTab('HOURS')}
                className={`flex-1 py-2 rounded-xs font-medium transition-colors flex items-center justify-center gap-1.5 ${
                  activeTab === 'HOURS'
                    ? 'bg-neutral-900 text-white'
                    : 'text-neutral-600 hover:text-neutral-950 hover:bg-neutral-50'
                }`}
              >
                <Clock className="w-3.5 h-3.5" />
                Working Hours
              </button>
            </div>

            {/* TAB CONTENT: SERVICES */}
            {activeTab === 'SERVICES' && (
              <div className="space-y-4">
                <div className="bg-white border border-neutral-200 rounded-sm p-6 space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
                    <div>
                      <h2 className="text-lg font-semibold text-neutral-950">Select a Service</h2>
                      <p className="text-xs text-neutral-500">Pick any treatment to configure stylist, date, and live time slot.</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {salonServices.length === 0 ? (
                      <p className="text-xs text-neutral-400 py-6 text-center">No services currently listed.</p>
                    ) : (
                      salonServices.map((srv) => (
                        <div
                          key={srv.id}
                          className="p-4 bg-neutral-50 border border-neutral-200 rounded-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-neutral-400 transition-all"
                        >
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <h3 className="text-sm font-semibold text-neutral-950">{srv.name}</h3>
                              <span className="text-[10px] font-mono text-neutral-500 bg-neutral-200 px-1.5 py-0.2 rounded-xs">
                                {srv.duration_minutes} mins
                              </span>
                            </div>
                            <p className="text-xs text-neutral-600 leading-relaxed max-w-xl">
                              {srv.description}
                            </p>
                          </div>

                          <div className="flex sm:flex-col items-center sm:items-end justify-between gap-3 flex-none pt-2 sm:pt-0 border-t sm:border-t-0 border-neutral-200">
                            <span className="text-base font-semibold text-neutral-950 font-mono">
                              ₹{srv.price.toLocaleString()}
                            </span>
                            <button
                              id={`btn-book-srv-${srv.id}`}
                              onClick={() => openBookingForService(salon.id, srv)}
                              className="px-4 py-1.5 bg-neutral-900 text-white text-xs font-medium rounded-sm hover:bg-neutral-800 transition-colors flex items-center gap-1.5"
                            >
                              <Calendar className="w-3.5 h-3.5" />
                              <span>Book Service</span>
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* TAB CONTENT: STYLISTS */}
            {activeTab === 'STYLISTS' && (
              <div className="bg-white border border-neutral-200 rounded-sm p-6 space-y-4">
                <div>
                  <h2 className="text-lg font-semibold text-neutral-950">Master Stylists & Technicians</h2>
                  <p className="text-xs text-neutral-500">Experienced resident specialists dedicated to personalized craft.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  {salonStaff.length === 0 ? (
                    <p className="text-xs text-neutral-400 col-span-2 text-center py-6">No staff currently active.</p>
                  ) : (
                    salonStaff.map((st) => (
                      <div
                        key={st.id}
                        className="p-4 bg-neutral-50 border border-neutral-200 rounded-sm flex gap-3.5 items-start"
                      >
                        <img
                          src={st.avatar_url}
                          alt={st.display_name}
                          className="w-12 h-12 rounded-sm object-cover border border-neutral-200 flex-none"
                        />
                        <div className="space-y-1 flex-1">
                          <div className="flex items-center justify-between">
                            <h3 className="text-xs font-semibold text-neutral-950">{st.display_name}</h3>
                            <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded-xs">
                              {st.experience_years}y exp
                            </span>
                          </div>
                          <p className="text-[11px] font-medium text-neutral-600">{st.specialization}</p>
                          <p className="text-[11px] text-neutral-500 line-clamp-2 leading-relaxed pt-1">
                            {st.bio}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* TAB CONTENT: REVIEWS */}
            {activeTab === 'REVIEWS' && (
              <div className="bg-white border border-neutral-200 rounded-sm p-6 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
                  <div>
                    <h2 className="text-lg font-semibold text-neutral-950">Verified Client Reviews</h2>
                    <p className="text-xs text-neutral-500">Only verified clients with completed appointments can submit ratings.</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xl font-light text-neutral-950">{salon.rating} / 5.0</span>
                    <p className="text-[10px] font-mono text-neutral-400 uppercase">{salon.review_count} Reviews</p>
                  </div>
                </div>

                <div className="space-y-3">
                  {salonReviews.length === 0 ? (
                    <p className="text-xs text-neutral-400 py-6 text-center">No reviews written yet.</p>
                  ) : (
                    salonReviews.map((rev) => (
                      <div key={rev.id} className="p-4 bg-neutral-50 border border-neutral-100 rounded-sm space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2.5">
                            <img
                              src={rev.customer_avatar}
                              alt={rev.customer_name}
                              className="w-7 h-7 rounded-sm object-cover"
                            />
                            <div>
                              <span className="text-xs font-semibold text-neutral-900 block">{rev.customer_name}</span>
                              <span className="text-[10px] font-mono text-neutral-400">
                                {new Date(rev.created_at).toLocaleDateString(undefined, {
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric'
                                })}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-1 bg-white px-2 py-0.5 border border-neutral-200 rounded-xs text-xs font-mono">
                            <Star className="w-3 h-3 fill-amber-400 text-amber-500" />
                            <span>{rev.rating}.0</span>
                          </div>
                        </div>
                        <p className="text-xs text-neutral-700 leading-relaxed">{rev.comment}</p>
                        <div className="flex items-center gap-1 text-[10px] text-emerald-700">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Verified Velora Appointment</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* TAB CONTENT: HOURS */}
            {activeTab === 'HOURS' && (
              <div className="bg-white border border-neutral-200 rounded-sm p-6 space-y-4">
                <div>
                  <h2 className="text-lg font-semibold text-neutral-950">Operating Hours</h2>
                  <p className="text-xs text-neutral-500">Live booking slots respect these weekly operational windows.</p>
                </div>

                <div className="divide-y divide-neutral-100 text-xs">
                  {daysOfWeek.map((dayName, idx) => {
                    const sched = salonSchedule.find((wh) => wh.day_of_week === idx);
                    const isClosed = !sched || sched.is_closed;

                    return (
                      <div key={dayName} className="py-2.5 flex items-center justify-between">
                        <span className="font-medium text-neutral-800">{dayName}</span>
                        {isClosed ? (
                          <span className="text-neutral-400 font-mono">Closed</span>
                        ) : (
                          <span className="text-neutral-900 font-mono">
                            {sched.open_time} - {sched.close_time}
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Right Sidebar: Studio Info & Contact (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white border border-neutral-200 rounded-sm p-6 space-y-4">
              <h2 className="text-xs uppercase font-bold text-neutral-400 font-mono tracking-wider">
                Studio Information
              </h2>

              <p className="text-xs text-neutral-600 leading-relaxed">
                {salon.description}
              </p>

              <div className="space-y-2.5 pt-3 border-t border-neutral-100 text-xs">
                <div className="flex items-start gap-2 text-neutral-700">
                  <MapPin className="w-4 h-4 text-neutral-400 flex-none mt-0.5" />
                  <span>{salon.address}, {salon.city}, {salon.state} - {salon.postal_code}</span>
                </div>

                <div className="flex items-center gap-2 text-neutral-700">
                  <Phone className="w-4 h-4 text-neutral-400 flex-none" />
                  <span className="font-mono">{salon.phone}</span>
                </div>

                <div className="flex items-center gap-2 text-neutral-700">
                  <Mail className="w-4 h-4 text-neutral-400 flex-none" />
                  <span className="font-mono">{salon.email}</span>
                </div>
              </div>

              <div className="pt-4 border-t border-neutral-100">
                <button
                  onClick={() => {
                    if (salonServices.length > 0) {
                      openBookingForService(salon.id, salonServices[0]);
                    }
                  }}
                  className="w-full py-2.5 bg-neutral-950 text-white text-xs font-semibold uppercase tracking-wider rounded-sm hover:bg-neutral-800 transition-colors flex items-center justify-center gap-1.5"
                >
                  <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Book Full Experience</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
