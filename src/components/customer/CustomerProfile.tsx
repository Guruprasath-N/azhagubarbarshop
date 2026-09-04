import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { User, Phone, Mail, Shield, CheckCircle2, Calendar, Award } from 'lucide-react';

export const CustomerProfile: React.FC = () => {
  const { currentUser, role, updateProfile } = useAuth();
  const { appointments, showToast, setCurrentView } = useApp();

  const [fullName, setFullName] = useState(currentUser?.full_name || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [isSaved, setIsSaved] = useState(false);

  const myAppointments = appointments.filter(
    (a) => a.customer_id === currentUser?.id || a.customer_email === currentUser?.email
  );
  const completedCount = myAppointments.filter((a) => a.status === 'COMPLETED').length;
  const totalSpent = myAppointments
    .filter((a) => a.status === 'COMPLETED')
    .reduce((sum, a) => sum + a.total_price, 0);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({ full_name: fullName, phone });
    setIsSaved(true);
    showToast('Profile updated successfully.', 'success');
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="bg-neutral-50 min-h-screen py-10 px-6 lg:px-10 text-neutral-900 font-sans">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="border-b border-neutral-200 pb-6">
          <span className="text-[10px] uppercase font-bold text-neutral-400 font-mono tracking-widest block mb-1">
            Account Management
          </span>
          <h1 className="text-3xl font-light text-neutral-950">Profile & Credentials</h1>
        </div>

        {/* User Card */}
        <div className="bg-white border border-neutral-200 rounded-sm p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <img
              src={currentUser?.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&h=200&q=80'}
              alt={currentUser?.full_name}
              className="w-16 h-16 rounded-sm object-cover border border-neutral-200"
            />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-semibold text-neutral-950">{currentUser?.full_name}</h2>
                <span className="px-2 py-0.5 bg-neutral-100 border border-neutral-200 text-neutral-800 font-mono text-[10px] uppercase rounded-xs">
                  {role}
                </span>
              </div>
              <p className="text-xs text-neutral-500 font-mono mt-0.5">{currentUser?.email}</p>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="flex items-center gap-6 pt-4 sm:pt-0 border-t sm:border-t-0 border-neutral-100">
            <div className="text-right">
              <span className="text-xl font-light text-neutral-950 font-mono">{myAppointments.length}</span>
              <span className="text-[10px] text-neutral-400 font-mono uppercase block">Total Bookings</span>
            </div>
            <div className="text-right">
              <span className="text-xl font-light text-emerald-600 font-mono">₹{totalSpent.toLocaleString()}</span>
              <span className="text-[10px] text-neutral-400 font-mono uppercase block">Total Spent</span>
            </div>
          </div>
        </div>

        {/* Edit Form */}
        <div className="bg-white border border-neutral-200 rounded-sm p-6 space-y-6">
          <div>
            <h3 className="text-sm font-semibold text-neutral-950">Personal Details</h3>
            <p className="text-xs text-neutral-500">Update your contact information for salon communications.</p>
          </div>

          <form onSubmit={handleSave} className="space-y-4 max-w-lg text-xs">
            <div>
              <label className="text-[10px] uppercase font-mono text-neutral-400 block mb-1 font-bold">
                Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-neutral-50 border border-neutral-200 rounded-sm text-xs focus:outline-none focus:border-neutral-900 focus:bg-white"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] uppercase font-mono text-neutral-400 block mb-1 font-bold">
                Phone Number
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-neutral-50 border border-neutral-200 rounded-sm text-xs focus:outline-none focus:border-neutral-900 focus:bg-white"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] uppercase font-mono text-neutral-400 block mb-1 font-bold">
                Email Address (Immutable)
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  disabled
                  value={currentUser?.email || ''}
                  className="w-full pl-9 pr-3 py-2 bg-neutral-100 border border-neutral-200 rounded-sm text-xs text-neutral-500 cursor-not-allowed font-mono"
                />
              </div>
            </div>

            <div className="pt-2 flex items-center gap-3">
              <button
                type="submit"
                className="px-5 py-2 bg-neutral-950 text-white rounded-sm font-medium hover:bg-neutral-800 transition-colors"
              >
                Save Changes
              </button>
              {isSaved && (
                <span className="text-xs text-emerald-600 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Saved
                </span>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
