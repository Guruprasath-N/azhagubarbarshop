import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { formatTime12h } from '../../services/availabilityEngine';
import { Service, Staff, SalonWorkingHours, StaffLeave, Appointment } from '../../types';
import { db } from '../../services/storage';
import {
  LayoutDashboard,
  Scissors,
  Users,
  Clock,
  CalendarDays,
  CalendarCheck,
  Star,
  Settings,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  XCircle,
  AlertCircle,
  TrendingUp,
  MapPin
} from 'lucide-react';

export const SalonDashboard: React.FC = () => {
  const {
    salons,
    services,
    staff,
    salonHours,
    staffLeaves,
    appointments,
    reviews,
    refreshData,
    showToast
  } = useApp();

  const { currentUser } = useAuth();

  // Pick the salon owned/managed by user or first salon as default
  const mySalon = useMemo(() => {
    return salons.find((s) => s.owner_id === currentUser?.id) || salons[0];
  }, [salons, currentUser]);

  const [activeTab, setActiveTab] = useState<
    'OVERVIEW' | 'APPOINTMENTS' | 'SERVICES' | 'STAFF' | 'SCHEDULE' | 'LEAVES' | 'SETTINGS'
  >('OVERVIEW');

  // Service Modal State
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<Partial<Service> | null>(null);

  // Staff Modal State
  const [isStaffModalOpen, setIsStaffModalOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<Partial<Staff> | null>(null);

  // Leave Modal State
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);
  const [newLeaveStaffId, setNewLeaveStaffId] = useState('');
  const [newLeaveStartDate, setNewLeaveStartDate] = useState('');
  const [newLeaveEndDate, setNewLeaveEndDate] = useState('');
  const [newLeaveReason, setNewLeaveReason] = useState('');

  // Appointments Filter
  const [apptStatusFilter, setApptStatusFilter] = useState<string>('ALL');
  const [apptDateFilter, setApptDateFilter] = useState<string>('');

  if (!mySalon) {
    return (
      <div className="p-12 text-center text-xs text-neutral-500">
        No associated salon profile found.
      </div>
    );
  }

  const salonServices = services.filter((s) => s.salon_id === mySalon.id);
  const salonStaff = staff.filter((st) => st.salon_id === mySalon.id);
  const salonAppts = appointments.filter((a) => a.salon_id === mySalon.id);
  const salonSchedule = salonHours.filter((h) => h.salon_id === mySalon.id);
  const salonStaffLeaves = staffLeaves.filter((l) =>
    salonStaff.some((st) => st.id === l.staff_id)
  );

  const todayStr = new Date().toISOString().split('T')[0];
  const todayAppts = salonAppts.filter((a) => a.appointment_date === todayStr);
  const confirmedCount = salonAppts.filter((a) => a.status === 'CONFIRMED').length;
  const completedCount = salonAppts.filter((a) => a.status === 'COMPLETED').length;
  const totalRevenue = salonAppts
    .filter((a) => a.status === 'COMPLETED')
    .reduce((sum, a) => sum + a.total_price, 0);

  // Filtered Appointments
  const filteredAppointments = salonAppts.filter((a) => {
    if (apptStatusFilter !== 'ALL' && a.status !== apptStatusFilter) return false;
    if (apptDateFilter && a.appointment_date !== apptDateFilter) return false;
    return true;
  });

  // Handle Save Service
  const handleSaveService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingService?.name || !editingService?.price || !editingService?.duration_minutes) {
      showToast('Please fill in service name, price, and duration.', 'error');
      return;
    }

    db.saveService({
      ...editingService,
      salon_id: mySalon.id,
      category_id: editingService.category_id || 'cat-1',
      name: editingService.name,
      price: Number(editingService.price),
      duration_minutes: Number(editingService.duration_minutes)
    });

    refreshData();
    setIsServiceModalOpen(false);
    setEditingService(null);
    showToast('Service updated successfully.', 'success');
  };

  // Handle Save Staff
  const handleSaveStaff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStaff?.display_name) {
      showToast('Staff display name is required.', 'error');
      return;
    }

    db.saveStaff({
      ...editingStaff,
      salon_id: mySalon.id,
      display_name: editingStaff.display_name,
      specialization: editingStaff.specialization || 'Stylist',
      experience_years: Number(editingStaff.experience_years || 2),
      service_ids: editingStaff.service_ids || []
    });

    refreshData();
    setIsStaffModalOpen(false);
    setEditingStaff(null);
    showToast('Staff member updated.', 'success');
  };

  // Handle Add Leave
  const handleAddLeave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLeaveStaffId || !newLeaveStartDate || !newLeaveEndDate) {
      showToast('Please select staff member and dates.', 'error');
      return;
    }

    db.addStaffLeave({
      staff_id: newLeaveStaffId,
      start_date: newLeaveStartDate,
      end_date: newLeaveEndDate,
      reason: newLeaveReason || 'Personal Leave',
      status: 'APPROVED'
    });

    refreshData();
    setIsLeaveModalOpen(false);
    setNewLeaveStaffId('');
    setNewLeaveStartDate('');
    setNewLeaveEndDate('');
    setNewLeaveReason('');
    showToast('Staff leave scheduled. Overlapping availability blocked.', 'success');
  };

  // Status Change
  const handleStatusChange = (apptId: string, newStatus: 'CONFIRMED' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW') => {
    db.updateAppointmentStatus(apptId, newStatus, currentUser?.id || 'owner', currentUser?.full_name || 'Salon Manager');
    refreshData();
    showToast(`Appointment status updated to ${newStatus}.`, 'success');
  };

  return (
    <div className="bg-neutral-50 min-h-screen pb-16 text-neutral-900 font-sans">
      {/* Studio Header Bar */}
      <div className="bg-white border-b border-neutral-200 px-6 lg:px-10 py-5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] uppercase font-bold text-neutral-400 font-mono tracking-widest">
                Partner Operations Control
              </span>
              <span className="px-2 py-0.2 bg-emerald-50 border border-emerald-200 text-emerald-700 font-mono text-[10px] rounded-xs font-semibold">
                {mySalon.status}
              </span>
            </div>
            <h1 className="text-2xl font-light text-neutral-950">{mySalon.name}</h1>
            <p className="text-xs text-neutral-500 flex items-center gap-1.5 mt-0.5">
              <MapPin className="w-3.5 h-3.5 text-neutral-400" />
              {mySalon.address}, {mySalon.city}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setEditingService({
                  salon_id: mySalon.id,
                  category_id: 'cat-1',
                  name: '',
                  price: 1000,
                  duration_minutes: 45,
                  is_active: true
                });
                setIsServiceModalOpen(true);
              }}
              className="px-3.5 py-2 bg-neutral-900 text-white text-xs font-medium rounded-sm hover:bg-neutral-800 transition-colors flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Service</span>
            </button>
            <button
              onClick={() => {
                setEditingStaff({
                  salon_id: mySalon.id,
                  display_name: '',
                  specialization: 'Senior Stylist',
                  experience_years: 3,
                  is_active: true,
                  service_ids: []
                });
                setIsStaffModalOpen(true);
              }}
              className="px-3.5 py-2 bg-white border border-neutral-200 text-neutral-900 text-xs font-medium rounded-sm hover:bg-neutral-100 transition-colors flex items-center gap-1.5"
            >
              <Users className="w-3.5 h-3.5" />
              <span>Add Stylist</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-6 lg:px-10 mt-6">
        <div className="bg-white border border-neutral-200 rounded-sm p-1 flex items-center gap-1 text-xs overflow-x-auto">
          {[
            { key: 'OVERVIEW', label: 'Dashboard Overview', icon: LayoutDashboard },
            { key: 'APPOINTMENTS', label: `Appointments (${salonAppts.length})`, icon: CalendarCheck },
            { key: 'SERVICES', label: `Services Menu (${salonServices.length})`, icon: Scissors },
            { key: 'STAFF', label: `Stylists & Staff (${salonStaff.length})`, icon: Users },
            { key: 'SCHEDULE', label: 'Weekly Schedule', icon: Clock },
            { key: 'LEAVES', label: `Staff Leaves (${salonStaffLeaves.length})`, icon: CalendarDays }
          ].map((tabItem) => {
            const Icon = tabItem.icon;
            const isActive = activeTab === tabItem.key;
            return (
              <button
                key={tabItem.key}
                onClick={() => setActiveTab(tabItem.key as any)}
                className={`px-3 py-2 rounded-xs font-medium transition-colors flex items-center gap-1.5 flex-none ${
                  isActive
                    ? 'bg-neutral-900 text-white'
                    : 'text-neutral-600 hover:text-neutral-950 hover:bg-neutral-50'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tabItem.label}</span>
              </button>
            );
          })}
        </div>

        {/* TAB 1: OVERVIEW */}
        {activeTab === 'OVERVIEW' && (
          <div className="mt-6 space-y-6">
            {/* KPI Cards Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-5 bg-white border border-neutral-200 rounded-sm">
                <span className="text-[10px] uppercase font-mono text-neutral-400 block mb-1">
                  Today&apos;s Bookings
                </span>
                <p className="text-2xl font-light text-neutral-950 font-mono">{todayAppts.length}</p>
                <p className="text-[11px] text-neutral-500 mt-1">Live active schedule</p>
              </div>

              <div className="p-5 bg-white border border-neutral-200 rounded-sm">
                <span className="text-[10px] uppercase font-mono text-neutral-400 block mb-1">
                  Upcoming Confirmed
                </span>
                <p className="text-2xl font-light text-neutral-950 font-mono">{confirmedCount}</p>
                <p className="text-[11px] text-neutral-500 mt-1">Ready for execution</p>
              </div>

              <div className="p-5 bg-white border border-neutral-200 rounded-sm">
                <span className="text-[10px] uppercase font-mono text-neutral-400 block mb-1">
                  Completed Revenue
                </span>
                <p className="text-2xl font-light text-emerald-600 font-mono">
                  ₹{totalRevenue.toLocaleString()}
                </p>
                <p className="text-[11px] text-neutral-500 mt-1">{completedCount} services delivered</p>
              </div>

              <div className="p-5 bg-white border border-neutral-200 rounded-sm">
                <span className="text-[10px] uppercase font-mono text-neutral-400 block mb-1">
                  Studio Rating
                </span>
                <p className="text-2xl font-light text-neutral-950 font-mono flex items-center gap-1">
                  <Star className="w-5 h-5 fill-amber-400 text-amber-500" />
                  <span>{mySalon.rating}</span>
                </p>
                <p className="text-[11px] text-neutral-500 mt-1">{mySalon.review_count} verified reviews</p>
              </div>
            </div>

            {/* Today's Schedule & Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-8 bg-white border border-neutral-200 rounded-sm p-6 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
                  <div>
                    <h2 className="text-sm font-semibold text-neutral-950">Today&apos;s Active Timeline</h2>
                    <p className="text-[11px] text-neutral-500">Live operational schedule for {todayStr}</p>
                  </div>
                  <button
                    onClick={() => setActiveTab('APPOINTMENTS')}
                    className="text-xs text-neutral-600 hover:text-neutral-950 font-medium"
                  >
                    View All
                  </button>
                </div>

                <div className="space-y-3">
                  {todayAppts.length === 0 ? (
                    <p className="text-xs text-neutral-400 py-8 text-center">
                      No appointments scheduled for today.
                    </p>
                  ) : (
                    todayAppts.map((appt) => (
                      <div
                        key={appt.id}
                        className="p-3 bg-neutral-50 border border-neutral-200 rounded-sm flex items-center justify-between gap-4 text-xs"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-16 font-mono text-xs font-semibold text-neutral-900">
                            {formatTime12h(appt.start_time)}
                          </div>
                          <div>
                            <p className="font-semibold text-neutral-950">{appt.customer_name}</p>
                            <p className="text-neutral-500 text-[11px]">
                              {appt.service_name} • Stylist: {appt.staff_name}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <span
                            className={`px-2 py-0.5 text-[10px] font-mono uppercase rounded-xs ${
                              appt.status === 'CONFIRMED'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : 'bg-neutral-200 text-neutral-700'
                            }`}
                          >
                            {appt.status}
                          </span>
                          {appt.status === 'CONFIRMED' && (
                            <button
                              onClick={() => handleStatusChange(appt.id, 'COMPLETED')}
                              className="px-2.5 py-1 bg-neutral-900 text-white rounded-xs text-[11px] hover:bg-neutral-800"
                            >
                              Mark Complete
                            </button>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Quick Roster Status */}
              <div className="lg:col-span-4 bg-white border border-neutral-200 rounded-sm p-6 space-y-4">
                <h2 className="text-xs uppercase font-bold text-neutral-400 font-mono tracking-wider">
                  Active Stylists ({salonStaff.length})
                </h2>
                <div className="space-y-3">
                  {salonStaff.map((st) => (
                    <div key={st.id} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2.5">
                        <img src={st.avatar_url} alt={st.display_name} className="w-7 h-7 rounded-sm object-cover" />
                        <div>
                          <p className="font-semibold text-neutral-950">{st.display_name}</p>
                          <p className="text-[10px] text-neutral-400">{st.specialization}</p>
                        </div>
                      </div>
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: APPOINTMENTS MANAGEMENT */}
        {activeTab === 'APPOINTMENTS' && (
          <div className="mt-6 space-y-4">
            {/* Filter Bar */}
            <div className="bg-white border border-neutral-200 rounded-sm p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono text-neutral-400 uppercase">Status:</span>
                {['ALL', 'CONFIRMED', 'COMPLETED', 'CANCELLED', 'NO_SHOW'].map((st) => (
                  <button
                    key={st}
                    onClick={() => setApptStatusFilter(st)}
                    className={`px-2.5 py-1 rounded-sm text-xs font-medium transition-colors ${
                      apptStatusFilter === st
                        ? 'bg-neutral-900 text-white'
                        : 'bg-neutral-50 text-neutral-600 border border-neutral-200 hover:bg-neutral-100'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono text-neutral-400 uppercase">Filter Date:</span>
                <input
                  type="date"
                  value={apptDateFilter}
                  onChange={(e) => setApptDateFilter(e.target.value)}
                  className="px-2.5 py-1 bg-neutral-50 border border-neutral-200 rounded-sm text-xs"
                />
                {apptDateFilter && (
                  <button
                    onClick={() => setApptDateFilter('')}
                    className="text-xs text-neutral-400 hover:text-neutral-600 underline"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>

            {/* Appointments Table */}
            <div className="bg-white border border-neutral-200 rounded-sm overflow-hidden text-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left divide-y divide-neutral-200">
                  <thead className="bg-neutral-50 font-mono text-[10px] text-neutral-400 uppercase tracking-wider">
                    <tr>
                      <th className="px-4 py-3">Booking ID</th>
                      <th className="px-4 py-3">Client</th>
                      <th className="px-4 py-3">Service & Stylist</th>
                      <th className="px-4 py-3">Schedule</th>
                      <th className="px-4 py-3">Price</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3 text-right">Lifecycle Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100">
                    {filteredAppointments.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="px-4 py-8 text-center text-neutral-400">
                          No matching appointments found.
                        </td>
                      </tr>
                    ) : (
                      filteredAppointments.map((appt) => (
                        <tr key={appt.id} className="hover:bg-neutral-50/50">
                          <td className="px-4 py-3 font-mono font-bold text-neutral-900">{appt.id}</td>
                          <td className="px-4 py-3">
                            <p className="font-semibold text-neutral-950">{appt.customer_name}</p>
                            <p className="text-[11px] text-neutral-400 font-mono">{appt.customer_phone}</p>
                          </td>
                          <td className="px-4 py-3">
                            <p className="font-medium text-neutral-900">{appt.service_name}</p>
                            <p className="text-[11px] text-neutral-500">Stylist: {appt.staff_name}</p>
                          </td>
                          <td className="px-4 py-3 font-mono">
                            <p className="text-neutral-900 font-semibold">{appt.appointment_date}</p>
                            <p className="text-[11px] text-neutral-400">
                              {formatTime12h(appt.start_time)} - {formatTime12h(appt.end_time)}
                            </p>
                          </td>
                          <td className="px-4 py-3 font-mono font-semibold text-neutral-950">
                            ₹{appt.total_price.toLocaleString()}
                          </td>
                          <td className="px-4 py-3">
                            <span
                              className={`px-2 py-0.5 text-[10px] font-mono uppercase rounded-xs font-semibold ${
                                appt.status === 'CONFIRMED'
                                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                  : appt.status === 'COMPLETED'
                                  ? 'bg-blue-50 text-blue-700 border border-blue-200'
                                  : appt.status === 'CANCELLED'
                                  ? 'bg-neutral-100 text-neutral-500 line-through'
                                  : 'bg-amber-50 text-amber-700'
                              }`}
                            >
                              {appt.status}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              {appt.status === 'CONFIRMED' && (
                                <>
                                  <button
                                    onClick={() => handleStatusChange(appt.id, 'COMPLETED')}
                                    className="px-2 py-1 bg-emerald-600 text-white rounded-xs text-[11px] hover:bg-emerald-700 font-medium"
                                  >
                                    Complete
                                  </button>
                                  <button
                                    onClick={() => handleStatusChange(appt.id, 'NO_SHOW')}
                                    className="px-2 py-1 bg-neutral-100 text-neutral-700 border border-neutral-200 rounded-xs text-[11px] hover:bg-neutral-200"
                                  >
                                    No-Show
                                  </button>
                                  <button
                                    onClick={() => handleStatusChange(appt.id, 'CANCELLED')}
                                    className="px-2 py-1 bg-red-50 text-red-700 border border-red-200 rounded-xs text-[11px] hover:bg-red-100"
                                  >
                                    Cancel
                                  </button>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: SERVICES MENU CRUD */}
        {activeTab === 'SERVICES' && (
          <div className="mt-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-semibold text-neutral-950">Treatment Offerings</h2>
                <p className="text-xs text-neutral-500">Configure prices, durations, and availability states.</p>
              </div>
              <button
                onClick={() => {
                  setEditingService({
                    salon_id: mySalon.id,
                    category_id: 'cat-1',
                    name: '',
                    price: 1200,
                    duration_minutes: 45,
                    is_active: true
                  });
                  setIsServiceModalOpen(true);
                }}
                className="px-4 py-2 bg-neutral-900 text-white text-xs font-semibold rounded-sm hover:bg-neutral-800 flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                Add New Service
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {salonServices.map((srv) => (
                <div
                  key={srv.id}
                  className="bg-white border border-neutral-200 rounded-sm p-4 flex items-start justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-neutral-950 text-xs">{srv.name}</h3>
                      <span className="text-[10px] font-mono text-neutral-500 bg-neutral-100 px-1.5 py-0.2 rounded-xs">
                        {srv.duration_minutes} mins
                      </span>
                    </div>
                    <p className="text-[11px] text-neutral-500 leading-relaxed">{srv.description}</p>
                    <p className="text-sm font-mono font-semibold text-neutral-950 pt-1">
                      ₹{srv.price.toLocaleString()}
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5 flex-none">
                    <button
                      onClick={() => {
                        setEditingService(srv);
                        setIsServiceModalOpen(true);
                      }}
                      className="p-1.5 text-neutral-400 hover:text-neutral-900 border border-neutral-200 rounded-xs"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Delete service "${srv.name}"?`)) {
                          db.deleteService(srv.id);
                          refreshData();
                          showToast('Service deleted.', 'info');
                        }
                      }}
                      className="p-1.5 text-red-500 hover:text-red-700 border border-red-200 rounded-xs hover:bg-red-50"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: STAFF ROSTER CRUD */}
        {activeTab === 'STAFF' && (
          <div className="mt-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-semibold text-neutral-950">Staff & Stylist Directory</h2>
                <p className="text-xs text-neutral-500">Manage individual profiles and assign treatment permissions.</p>
              </div>
              <button
                onClick={() => {
                  setEditingStaff({
                    salon_id: mySalon.id,
                    display_name: '',
                    specialization: 'Senior Stylist',
                    experience_years: 3,
                    is_active: true,
                    service_ids: []
                  });
                  setIsStaffModalOpen(true);
                }}
                className="px-4 py-2 bg-neutral-900 text-white text-xs font-semibold rounded-sm hover:bg-neutral-800 flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Stylist
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {salonStaff.map((st) => (
                <div
                  key={st.id}
                  className="bg-white border border-neutral-200 rounded-sm p-4 flex items-start gap-3.5"
                >
                  <img src={st.avatar_url} alt={st.display_name} className="w-12 h-12 rounded-sm object-cover border border-neutral-200 flex-none" />
                  <div className="flex-1 space-y-1 text-xs">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-neutral-950">{st.display_name}</h3>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => {
                            setEditingStaff(st);
                            setIsStaffModalOpen(true);
                          }}
                          className="p-1 text-neutral-400 hover:text-neutral-900"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Remove staff member "${st.display_name}"?`)) {
                              db.deleteStaff(st.id);
                              refreshData();
                              showToast('Staff removed.', 'info');
                            }
                          }}
                          className="p-1 text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                    <p className="text-[11px] text-neutral-600 font-medium">{st.specialization} ({st.experience_years}y exp)</p>
                    <p className="text-[11px] text-neutral-400">Assigned {st.service_ids.length} treatment types</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: WEEKLY SCHEDULE */}
        {activeTab === 'SCHEDULE' && (
          <div className="mt-6 bg-white border border-neutral-200 rounded-sm p-6 space-y-4 text-xs">
            <div>
              <h2 className="text-sm font-semibold text-neutral-950">Operating Hours & Booking Schedule</h2>
              <p className="text-neutral-500">Configure weekly open and close times. The availability engine strictly obeys these boundaries.</p>
            </div>

            <div className="divide-y divide-neutral-100">
              {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map((dayName, idx) => {
                const sched = salonSchedule.find((wh) => wh.day_of_week === idx);
                return (
                  <div key={dayName} className="py-3 flex items-center justify-between">
                    <span className="font-semibold text-neutral-900 w-28">{dayName}</span>
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-neutral-600">
                        {sched && !sched.is_closed
                          ? `${sched.open_time} — ${sched.close_time}`
                          : 'Closed'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 6: STAFF LEAVES */}
        {activeTab === 'LEAVES' && (
          <div className="mt-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-semibold text-neutral-950">Staff Leave & Blackout Periods</h2>
                <p className="text-xs text-neutral-500">Approved leaves automatically remove slot availability for affected staff.</p>
              </div>
              <button
                onClick={() => {
                  setNewLeaveStaffId(salonStaff[0]?.id || '');
                  setIsLeaveModalOpen(true);
                }}
                className="px-4 py-2 bg-neutral-900 text-white text-xs font-semibold rounded-sm hover:bg-neutral-800 flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                Schedule Staff Leave
              </button>
            </div>

            <div className="bg-white border border-neutral-200 rounded-sm divide-y divide-neutral-100 text-xs">
              {salonStaffLeaves.length === 0 ? (
                <p className="p-8 text-center text-neutral-400">No scheduled leaves currently active.</p>
              ) : (
                salonStaffLeaves.map((leave) => {
                  const staffObj = salonStaff.find((s) => s.id === leave.staff_id);
                  return (
                    <div key={leave.id} className="p-4 flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-neutral-950">{staffObj?.display_name}</p>
                        <p className="text-neutral-500 text-[11px] font-mono">
                          {leave.start_date} to {leave.end_date} • {leave.reason}
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          db.deleteStaffLeave(leave.id);
                          refreshData();
                          showToast('Leave cancelled.', 'info');
                        }}
                        className="px-2.5 py-1 text-red-600 border border-red-200 rounded-xs hover:bg-red-50 text-[11px]"
                      >
                        Revoke Leave
                      </button>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}
      </div>

      {/* SERVICE MODAL */}
      {isServiceModalOpen && editingService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/60 backdrop-blur-xs">
          <div className="bg-white border border-neutral-200 rounded-sm p-6 max-w-md w-full shadow-2xl space-y-4 text-xs">
            <h3 className="text-sm font-semibold text-neutral-950">
              {editingService.id ? 'Edit Service' : 'Add New Service'}
            </h3>

            <form onSubmit={handleSaveService} className="space-y-3">
              <div>
                <label className="text-[10px] uppercase font-mono text-neutral-400 block mb-1">Service Title</label>
                <input
                  type="text"
                  required
                  value={editingService.name || ''}
                  onChange={(e) => setEditingService({ ...editingService, name: e.target.value })}
                  className="w-full px-2.5 py-1.5 bg-neutral-50 border border-neutral-200 rounded-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] uppercase font-mono text-neutral-400 block mb-1">Price (₹ INR)</label>
                  <input
                    type="number"
                    required
                    min={100}
                    value={editingService.price || ''}
                    onChange={(e) => setEditingService({ ...editingService, price: Number(e.target.value) })}
                    className="w-full px-2.5 py-1.5 bg-neutral-50 border border-neutral-200 rounded-sm font-mono"
                  />
                </div>

                <div>
                  <label className="text-[10px] uppercase font-mono text-neutral-400 block mb-1">Duration (Minutes)</label>
                  <select
                    value={editingService.duration_minutes || 45}
                    onChange={(e) => setEditingService({ ...editingService, duration_minutes: Number(e.target.value) })}
                    className="w-full px-2.5 py-1.5 bg-neutral-50 border border-neutral-200 rounded-sm font-mono"
                  >
                    <option value={30}>30 mins</option>
                    <option value={45}>45 mins</option>
                    <option value={60}>60 mins</option>
                    <option value={90}>90 mins</option>
                    <option value={120}>120 mins</option>
                    <option value={180}>180 mins</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[10px] uppercase font-mono text-neutral-400 block mb-1">Description</label>
                <textarea
                  rows={3}
                  value={editingService.description || ''}
                  onChange={(e) => setEditingService({ ...editingService, description: e.target.value })}
                  className="w-full px-2.5 py-1.5 bg-neutral-50 border border-neutral-200 rounded-sm resize-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsServiceModalOpen(false)}
                  className="px-4 py-2 border border-neutral-200 rounded-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-neutral-900 text-white rounded-sm font-medium"
                >
                  Save Service
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* STAFF MODAL */}
      {isStaffModalOpen && editingStaff && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/60 backdrop-blur-xs">
          <div className="bg-white border border-neutral-200 rounded-sm p-6 max-w-md w-full shadow-2xl space-y-4 text-xs">
            <h3 className="text-sm font-semibold text-neutral-950">
              {editingStaff.id ? 'Edit Staff Member' : 'Add Staff Member'}
            </h3>

            <form onSubmit={handleSaveStaff} className="space-y-3">
              <div>
                <label className="text-[10px] uppercase font-mono text-neutral-400 block mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={editingStaff.display_name || ''}
                  onChange={(e) => setEditingStaff({ ...editingStaff, display_name: e.target.value })}
                  className="w-full px-2.5 py-1.5 bg-neutral-50 border border-neutral-200 rounded-sm"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase font-mono text-neutral-400 block mb-1">Specialization</label>
                <input
                  type="text"
                  value={editingStaff.specialization || ''}
                  onChange={(e) => setEditingStaff({ ...editingStaff, specialization: e.target.value })}
                  placeholder="e.g. Master Colorist & Texture Director"
                  className="w-full px-2.5 py-1.5 bg-neutral-50 border border-neutral-200 rounded-sm"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase font-mono text-neutral-400 block mb-1">Experience (Years)</label>
                <input
                  type="number"
                  min={1}
                  value={editingStaff.experience_years || 2}
                  onChange={(e) => setEditingStaff({ ...editingStaff, experience_years: Number(e.target.value) })}
                  className="w-full px-2.5 py-1.5 bg-neutral-50 border border-neutral-200 rounded-sm font-mono"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase font-mono text-neutral-400 block mb-1">
                  Assigned Treatment Capabilities
                </label>
                <div className="max-h-36 overflow-y-auto space-y-1 p-2 bg-neutral-50 border border-neutral-200 rounded-sm">
                  {salonServices.map((srv) => {
                    const isChecked = editingStaff.service_ids?.includes(srv.id);
                    return (
                      <label key={srv.id} className="flex items-center gap-2 text-[11px] cursor-pointer">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) => {
                            const current = editingStaff.service_ids || [];
                            const updated = e.target.checked
                              ? [...current, srv.id]
                              : current.filter((id) => id !== srv.id);
                            setEditingStaff({ ...editingStaff, service_ids: updated });
                          }}
                        />
                        <span>{srv.name}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsStaffModalOpen(false)}
                  className="px-4 py-2 border border-neutral-200 rounded-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-neutral-900 text-white rounded-sm font-medium"
                >
                  Save Staff Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* LEAVE MODAL */}
      {isLeaveModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/60 backdrop-blur-xs">
          <div className="bg-white border border-neutral-200 rounded-sm p-6 max-w-md w-full shadow-2xl space-y-4 text-xs">
            <h3 className="text-sm font-semibold text-neutral-950">Schedule Staff Leave</h3>

            <form onSubmit={handleAddLeave} className="space-y-3">
              <div>
                <label className="text-[10px] uppercase font-mono text-neutral-400 block mb-1">Staff Member</label>
                <select
                  value={newLeaveStaffId}
                  onChange={(e) => setNewLeaveStaffId(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-neutral-50 border border-neutral-200 rounded-sm"
                >
                  {salonStaff.map((st) => (
                    <option key={st.id} value={st.id}>
                      {st.display_name} ({st.specialization})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] uppercase font-mono text-neutral-400 block mb-1">Start Date</label>
                  <input
                    type="date"
                    required
                    value={newLeaveStartDate}
                    onChange={(e) => setNewLeaveStartDate(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-neutral-50 border border-neutral-200 rounded-sm font-mono"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase font-mono text-neutral-400 block mb-1">End Date</label>
                  <input
                    type="date"
                    required
                    value={newLeaveEndDate}
                    onChange={(e) => setNewLeaveEndDate(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-neutral-50 border border-neutral-200 rounded-sm font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] uppercase font-mono text-neutral-400 block mb-1">Reason</label>
                <input
                  type="text"
                  value={newLeaveReason}
                  onChange={(e) => setNewLeaveReason(e.target.value)}
                  placeholder="e.g. Masterclass Seminar, Medical, Personal"
                  className="w-full px-2.5 py-1.5 bg-neutral-50 border border-neutral-200 rounded-sm"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsLeaveModalOpen(false)}
                  className="px-4 py-2 border border-neutral-200 rounded-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-neutral-900 text-white rounded-sm font-medium"
                >
                  Confirm Leave Block
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
