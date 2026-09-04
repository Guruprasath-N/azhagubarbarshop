import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../services/storage';
import {
  ShieldAlert,
  Building2,
  Users,
  CalendarCheck,
  Star,
  CheckCircle2,
  Ban,
  RotateCcw,
  Activity,
  Search,
  Eye,
  FileText
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { salons, appointments, reviews, auditLogs, refreshData, showToast } = useApp();
  const { currentUser } = useAuth();

  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'APPOINTMENTS' | 'SALONS' | 'REVIEWS' | 'AUDIT'>('OVERVIEW');
  const [salonSearch, setSalonSearch] = useState('');
  const [appointmentSearch, setAppointmentSearch] = useState('');

  const activeSalonsCount = salons.filter((s) => s.status === 'ACTIVE').length;
  const pendingSalonsCount = salons.filter((s) => s.status === 'PENDING').length;
  const totalVolume = appointments
    .filter((a) => a.status === 'COMPLETED')
    .reduce((sum, a) => sum + a.total_price, 0);

  const filteredSalons = salons.filter((s) => {
    if (!salonSearch.trim()) return true;
    const q = salonSearch.toLowerCase();
    return s.name.toLowerCase().includes(q) || s.city.toLowerCase().includes(q);
  });

  const filteredAppointments = appointments.filter((a) => {
    if (!appointmentSearch.trim()) return true;
    const q = appointmentSearch.toLowerCase();
    return (
      a.customer_name.toLowerCase().includes(q) ||
      a.salon_name.toLowerCase().includes(q) ||
      a.service_name.toLowerCase().includes(q) ||
      a.staff_name.toLowerCase().includes(q) ||
      a.appointment_date.includes(q)
    );
  });

  const handleSalonStatusChange = (salonId: string, newStatus: 'ACTIVE' | 'SUSPENDED' | 'PENDING') => {
    db.updateSalonStatus(salonId, newStatus, currentUser?.full_name || 'Platform Admin');
    refreshData();
    showToast(`Salon status changed to ${newStatus}.`, 'success');
  };

  return (
    <div className="bg-neutral-50 min-h-screen pb-16 text-neutral-900 font-sans">
      {/* Admin Top Banner */}
      <div className="bg-white border-b border-neutral-200 px-6 lg:px-10 py-5">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-sm bg-neutral-900 text-white flex items-center justify-center">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-semibold text-neutral-950">AZHAGU Platform Administration</h1>
                <span className="px-2 py-0.2 bg-amber-50 border border-amber-200 text-amber-800 text-[10px] font-mono rounded-xs font-semibold">
                  Root Authority
                </span>
              </div>
              <p className="text-xs text-neutral-500 font-mono">Centralized moderation, audit logs & multi-tenant registry</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-6 lg:px-10 mt-6">
        <div className="bg-white border border-neutral-200 rounded-sm p-1 flex items-center gap-1 text-xs overflow-x-auto">
          {[
            { key: 'OVERVIEW', label: 'Platform Metrics', icon: Activity },
            { key: 'APPOINTMENTS', label: `Customer Bookings (${appointments.length})`, icon: CalendarCheck },
            { key: 'SALONS', label: `Partner Salons (${salons.length})`, icon: Building2 },
            { key: 'REVIEWS', label: `Review Moderation (${reviews.length})`, icon: Star },
            { key: 'AUDIT', label: `System Audit Logs (${auditLogs.length})`, icon: FileText }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`px-3 py-2 rounded-xs font-medium transition-colors flex items-center gap-1.5 flex-none ${
                  isActive
                    ? 'bg-neutral-900 text-white font-semibold'
                    : 'text-neutral-600 hover:text-neutral-950 hover:bg-neutral-50'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* TAB 1: OVERVIEW */}
        {activeTab === 'OVERVIEW' && (
          <div className="mt-6 space-y-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-5 bg-white border border-neutral-200 rounded-sm">
                <span className="text-[10px] uppercase font-mono text-neutral-400 block mb-1">
                  Active Salons
                </span>
                <p className="text-2xl font-light text-neutral-950 font-mono">{activeSalonsCount}</p>
                <p className="text-[11px] text-amber-600 mt-1">{pendingSalonsCount} pending approval</p>
              </div>

              <div className="p-5 bg-white border border-neutral-200 rounded-sm">
                <span className="text-[10px] uppercase font-mono text-neutral-400 block mb-1">
                  Total Bookings
                </span>
                <p className="text-2xl font-light text-neutral-950 font-mono">{appointments.length}</p>
                <p className="text-[11px] text-emerald-600 mt-1">
                  {appointments.filter((a) => a.status === 'COMPLETED').length} successfully fulfilled
                </p>
              </div>

              <div className="p-5 bg-white border border-neutral-200 rounded-sm">
                <span className="text-[10px] uppercase font-mono text-neutral-400 block mb-1">
                  Platform Volume
                </span>
                <p className="text-2xl font-light text-emerald-600 font-mono">₹{totalVolume.toLocaleString()}</p>
                <p className="text-[11px] text-neutral-500 mt-1">Gross Merchandise Value</p>
              </div>

              <div className="p-5 bg-white border border-neutral-200 rounded-sm">
                <span className="text-[10px] uppercase font-mono text-neutral-400 block mb-1">
                  Verified Reviews
                </span>
                <p className="text-2xl font-light text-neutral-950 font-mono">{reviews.length}</p>
                <p className="text-[11px] text-neutral-500 mt-1">100% verified appointments</p>
              </div>
            </div>

            {/* Recent Audit Stream */}
            <div className="bg-white border border-neutral-200 rounded-sm p-6 space-y-4">
              <h2 className="text-sm font-semibold text-neutral-950">Recent System Events</h2>
              <div className="divide-y divide-neutral-100 font-mono text-xs">
                {auditLogs.slice(0, 5).map((log) => (
                  <div key={log.id} className="py-2.5 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-neutral-900">{log.action}</span>
                      <span className="text-neutral-400 mx-2">•</span>
                      <span className="text-neutral-600">{log.actor_name}</span>
                    </div>
                    <span className="text-neutral-400 text-[11px]">
                      {new Date(log.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: ALL CUSTOMER BOOKINGS STREAM */}
        {activeTab === 'APPOINTMENTS' && (
          <div className="mt-6 space-y-4">
            <div className="bg-white border border-neutral-200 rounded-sm p-3 flex flex-col sm:flex-row justify-between items-center gap-3">
              <div className="relative w-full sm:w-96">
                <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={appointmentSearch}
                  onChange={(e) => setAppointmentSearch(e.target.value)}
                  placeholder="Filter customer bookings by name, salon, or service..."
                  className="w-full pl-9 pr-3 py-1.5 bg-neutral-50 border border-neutral-200 rounded-sm text-xs"
                />
              </div>
              <span className="text-xs font-mono text-neutral-500">
                Showing {filteredAppointments.length} of {appointments.length} customer bookings
              </span>
            </div>

            <div className="bg-white border border-neutral-200 rounded-sm overflow-hidden text-xs">
              <table className="w-full text-left divide-y divide-neutral-200">
                <thead className="bg-neutral-50 font-mono text-[10px] text-neutral-400 uppercase">
                  <tr>
                    <th className="px-4 py-3">Customer Details</th>
                    <th className="px-4 py-3">Salon & Service</th>
                    <th className="px-4 py-3">Stylist / Staff</th>
                    <th className="px-4 py-3">Date & Time</th>
                    <th className="px-4 py-3">Amount & Payment</th>
                    <th className="px-4 py-3 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {filteredAppointments.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-4 py-8 text-center text-neutral-400">
                        No customer bookings found matching criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredAppointments.map((appt) => (
                      <tr key={appt.id} className="hover:bg-neutral-50/50">
                        <td className="px-4 py-3">
                          <p className="font-semibold text-neutral-950">{appt.customer_name}</p>
                          <p className="text-[11px] text-neutral-500 font-mono">{appt.customer_phone}</p>
                          <p className="text-[10px] text-neutral-400">{appt.customer_email}</p>
                        </td>
                        <td className="px-4 py-3">
                          <p className="font-semibold text-neutral-900">{appt.service_name}</p>
                          <p className="text-[11px] text-neutral-500">{appt.salon_name}</p>
                        </td>
                        <td className="px-4 py-3 text-neutral-700">
                          {appt.staff_name}
                        </td>
                        <td className="px-4 py-3 font-mono">
                          <p className="font-semibold text-neutral-900">{appt.appointment_date}</p>
                          <p className="text-[11px] text-neutral-500">{appt.start_time} - {appt.end_time}</p>
                        </td>
                        <td className="px-4 py-3 font-mono">
                          <p className="font-bold text-neutral-950">₹{appt.total_price.toLocaleString()}</p>
                          <span className="text-[10px] text-neutral-500 uppercase">
                            {appt.payment_method === 'PAY_AT_SALON' ? 'Pay at Salon' : appt.payment_method}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <span
                            className={`px-2.5 py-1 text-[10px] font-mono uppercase rounded-xs font-semibold ${
                              appt.status === 'CONFIRMED'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : appt.status === 'COMPLETED'
                                ? 'bg-blue-50 text-blue-700 border border-blue-200'
                                : appt.status === 'CANCELLED'
                                ? 'bg-red-50 text-red-700 border border-red-200'
                                : 'bg-neutral-100 text-neutral-700'
                            }`}
                          >
                            {appt.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: SALONS MODERATION */}
        {activeTab === 'SALONS' && (
          <div className="mt-6 space-y-4">
            <div className="bg-white border border-neutral-200 rounded-sm p-3">
              <div className="relative">
                <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={salonSearch}
                  onChange={(e) => setSalonSearch(e.target.value)}
                  placeholder="Filter studios by name or city..."
                  className="w-full pl-9 pr-3 py-1.5 bg-neutral-50 border border-neutral-200 rounded-sm text-xs"
                />
              </div>
            </div>

            <div className="bg-white border border-neutral-200 rounded-sm overflow-hidden text-xs">
              <table className="w-full text-left divide-y divide-neutral-200">
                <thead className="bg-neutral-50 font-mono text-[10px] text-neutral-400 uppercase">
                  <tr>
                    <th className="px-4 py-3">Salon Name</th>
                    <th className="px-4 py-3">Location</th>
                    <th className="px-4 py-3">Rating</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3 text-right">Moderation Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {filteredSalons.map((s) => (
                    <tr key={s.id} className="hover:bg-neutral-50/50">
                      <td className="px-4 py-3">
                        <p className="font-semibold text-neutral-950">{s.name}</p>
                        <p className="text-[11px] text-neutral-400 font-mono">{s.slug}</p>
                      </td>
                      <td className="px-4 py-3 text-neutral-600">
                        {s.city}, {s.state}
                      </td>
                      <td className="px-4 py-3 font-mono">
                        {s.rating} ★ ({s.review_count})
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-2 py-0.5 text-[10px] font-mono uppercase rounded-xs font-semibold ${
                            s.status === 'ACTIVE'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : s.status === 'PENDING'
                              ? 'bg-amber-50 text-amber-700 border border-amber-200'
                              : 'bg-red-50 text-red-700 border border-red-200'
                          }`}
                        >
                          {s.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {s.status !== 'ACTIVE' && (
                            <button
                              onClick={() => handleSalonStatusChange(s.id, 'ACTIVE')}
                              className="px-2.5 py-1 bg-emerald-600 text-white rounded-xs text-[11px] hover:bg-emerald-700 font-medium"
                            >
                              Approve / Activate
                            </button>
                          )}
                          {s.status === 'ACTIVE' && (
                            <button
                              onClick={() => handleSalonStatusChange(s.id, 'SUSPENDED')}
                              className="px-2.5 py-1 border border-red-200 text-red-700 bg-red-50 rounded-xs text-[11px] hover:bg-red-100 font-medium"
                            >
                              Suspend
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: REVIEWS MODERATION */}
        {activeTab === 'REVIEWS' && (
          <div className="mt-6 space-y-3">
            {reviews.map((rev) => (
              <div key={rev.id} className="bg-white border border-neutral-200 rounded-sm p-4 text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-neutral-950">{rev.customer_name}</span>
                    <span className="text-neutral-300">•</span>
                    <span className="font-mono text-neutral-500">{rev.rating}.0 ★</span>
                  </div>
                  <span className="px-2 py-0.2 bg-neutral-100 text-neutral-600 font-mono text-[10px] rounded-xs">
                    {rev.status}
                  </span>
                </div>
                <p className="text-neutral-700 leading-relaxed">{rev.comment}</p>
              </div>
            ))}
          </div>
        )}

        {/* TAB 4: AUDIT LOGS */}
        {activeTab === 'AUDIT' && (
          <div className="mt-6 bg-white border border-neutral-200 rounded-sm p-6 space-y-4">
            <h2 className="text-sm font-semibold text-neutral-950">System Audit Trail</h2>
            <div className="divide-y divide-neutral-100 font-mono text-xs">
              {auditLogs.map((log) => (
                <div key={log.id} className="py-3 flex items-start justify-between gap-4">
                  <div>
                    <span className="px-2 py-0.5 bg-neutral-100 border border-neutral-200 rounded-xs font-bold text-neutral-900">
                      {log.action}
                    </span>
                    <span className="text-neutral-600 ml-2">by {log.actor_name}</span>
                    {log.metadata && (
                      <pre className="text-[10px] text-neutral-400 mt-1 bg-neutral-50 p-1.5 rounded-xs">
                        {JSON.stringify(log.metadata)}
                      </pre>
                    )}
                  </div>
                  <span className="text-neutral-400 text-[10px] flex-none">
                    {new Date(log.created_at).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
