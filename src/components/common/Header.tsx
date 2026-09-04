import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';
import {
  Scissors,
  Bell,
  User,
  LogOut,
  Calendar,
  Compass,
  Home,
  LayoutDashboard,
  ShieldAlert,
  CheckCircle2,
  Smartphone,
  X
} from 'lucide-react';

export const Header: React.FC = () => {
  const { currentUser, role, logout } = useAuth();
  const {
    currentView,
    setCurrentView,
    notifications,
    showToast
  } = useApp();

  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);

  const handleNavigateSalonPortal = () => {
    if (role === 'SALON_OWNER') {
      setCurrentView('SALON_OWNER_DASHBOARD');
    } else if (role === 'SALON_MANAGER') {
      setCurrentView('SALON_MANAGER_DASHBOARD');
    } else if (role === 'STAFF') {
      setCurrentView('STAFF_DASHBOARD');
    } else {
      setCurrentView('LOGIN_OWNER');
      showToast('Please log in through the Salon Owner Portal', 'info');
    }
  };

  const handleNavigateAdminPanel = () => {
    if (role === 'ADMIN' || role === 'SUPER_ADMIN') {
      setCurrentView('ADMIN_DASHBOARD');
    } else {
      setCurrentView('LOGIN_ADMIN');
      showToast('Please log in through the Platform Admin Login Portal', 'info');
    }
  };

  const userNotifications = notifications.filter(
    (n) => n.user_id === currentUser?.id || n.user_id === 'all'
  );
  const unreadCount = userNotifications.filter((n) => !n.read).length;

  const roleLabels: Record<UserRole, { label: string; tag: string }> = {
    CUSTOMER: { label: 'Customer', tag: 'bg-neutral-100 text-neutral-800' },
    SALON_OWNER: { label: 'Salon Owner', tag: 'bg-emerald-50 text-emerald-700 border border-emerald-200' },
    SALON_MANAGER: { label: 'Salon Manager', tag: 'bg-blue-50 text-blue-700 border border-blue-200' },
    STAFF: { label: 'Stylist / Staff', tag: 'bg-purple-50 text-purple-700 border border-purple-200' },
    ADMIN: { label: 'Platform Admin', tag: 'bg-amber-50 text-amber-800 border border-amber-200' },
    SUPER_ADMIN: { label: 'Super Admin', tag: 'bg-rose-50 text-rose-800 border border-rose-200' }
  };

  return (
    <>
      <header className="h-16 border-b border-neutral-200 bg-white sticky top-0 z-40 flex items-center justify-between px-6 lg:px-10 flex-none">
        {/* Brand */}
        <div className="flex items-center gap-6">
          <button
            onClick={() => setCurrentView('MARKETING')}
            className="flex items-center gap-2 text-left group transition-transform active:scale-95"
            id="btn-brand-logo"
          >
            <img src="/azhagu-logo.png" alt="AZHAGU South India Salon Platform Logo" className="h-10 w-auto object-contain drop-shadow-sm" />
          </button>
        </div>

        {/* Main Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 text-xs font-medium text-neutral-600">
          <button
            id="nav-btn-home"
            onClick={() => setCurrentView('MARKETING')}
            className={`px-3 py-1.5 rounded-sm transition-colors flex items-center gap-1.5 ${
              currentView === 'MARKETING' ? 'bg-neutral-100 text-neutral-950 font-semibold' : 'hover:bg-neutral-50'
            }`}
          >
            <Home className="w-3.5 h-3.5" />
            Home
          </button>

          <button
            id="nav-btn-explore"
            onClick={() => setCurrentView('DISCOVER')}
            className={`px-3 py-1.5 rounded-sm transition-colors flex items-center gap-1.5 ${
              currentView === 'DISCOVER' ? 'bg-neutral-100 text-neutral-950 font-semibold' : 'hover:bg-neutral-50'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            Explore Salons
          </button>

          <button
            id="nav-btn-bookings"
            onClick={() => setCurrentView('MY_BOOKINGS')}
            className={`px-3 py-1.5 rounded-sm transition-colors flex items-center gap-1.5 ${
              currentView === 'MY_BOOKINGS' ? 'bg-neutral-100 text-neutral-950 font-semibold' : 'hover:bg-neutral-50'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            My Bookings
          </button>

          <button
            id="nav-btn-salon-dash"
            onClick={handleNavigateSalonPortal}
            className={`px-3 py-1.5 rounded-sm transition-colors flex items-center gap-1.5 ${
              currentView === 'SALON_DASHBOARD' ? 'bg-neutral-900 text-white font-semibold' : 'hover:bg-neutral-50 text-neutral-900'
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            Salon Portal
          </button>

          <button
            id="nav-btn-admin-dash"
            onClick={handleNavigateAdminPanel}
            className={`px-3 py-1.5 rounded-sm transition-colors flex items-center gap-1.5 ${
              currentView === 'ADMIN_DASHBOARD' ? 'bg-neutral-900 text-white font-semibold' : 'hover:bg-neutral-50 text-neutral-900'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            Admin Panel
          </button>
        </nav>

        {/* Right Controls: Persona Switcher, Notifications, Profile */}
        <div className="flex items-center gap-3">
          {/* Notification Bell */}
          <div className="relative">
            <button
              id="btn-notif-bell"
              onClick={() => setIsNotifOpen(!isNotifOpen)}
              className="p-2 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-sm relative"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-emerald-500 rounded-full" />
              )}
            </button>

            {/* Notifications Dropdown */}
            {isNotifOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-white border border-neutral-200 shadow-xl rounded-sm p-4 z-50 animate-in fade-in">
                <div className="flex items-center justify-between pb-2 border-b border-neutral-100 mb-3">
                  <span className="text-xs font-semibold uppercase tracking-wider text-neutral-900">
                    Activity Feed
                  </span>
                  <button
                    onClick={() => setIsNotifOpen(false)}
                    className="text-neutral-400 hover:text-neutral-600"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="max-h-64 overflow-y-auto space-y-2.5">
                  {userNotifications.length === 0 ? (
                    <p className="text-xs text-neutral-400 py-3 text-center">No notifications yet.</p>
                  ) : (
                    userNotifications.map((n) => (
                      <div key={n.id} className="p-2.5 bg-neutral-50 border border-neutral-100 rounded-sm">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[10px] uppercase font-bold text-neutral-500 tracking-wider">
                            {n.type.replace('_', ' ')}
                          </span>
                          <span className="text-[10px] text-neutral-400 font-mono">
                            {new Date(n.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <p className="text-xs font-medium text-neutral-900 mb-0.5">{n.title}</p>
                        <p className="text-[11px] text-neutral-500 leading-relaxed">{n.message}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Separate Role Portals Dropdown */}
          <div className="relative">
            <button
              id="btn-role-portals-menu"
              onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
              className="flex items-center gap-2 px-3 py-1.5 bg-neutral-900 text-white rounded-sm text-xs font-semibold hover:bg-neutral-800 transition-colors shadow-sm"
            >
              <User className="w-3.5 h-3.5 text-emerald-400" />
              <span>Role Portals</span>
              <span className="text-[10px] text-neutral-300 font-mono hidden sm:inline">({roleLabels[role]?.label || role})</span>
            </button>

            {isRoleDropdownOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white border border-neutral-200 shadow-2xl rounded-sm p-3 z-50 animate-in fade-in">
                <div className="text-[10px] uppercase font-mono font-bold text-neutral-400 tracking-wider mb-2 px-1">
                  Separate Role Login Portals
                </div>
                <div className="space-y-1">
                  {[
                    { view: 'LOGIN_CUSTOMER' as const, label: 'Customer Portal', role: 'CUSTOMER' },
                    { view: 'LOGIN_OWNER' as const, label: 'Salon Owner Portal', role: 'SALON_OWNER' },
                    { view: 'LOGIN_MANAGER' as const, label: 'Salon Manager Portal', role: 'SALON_MANAGER' },
                    { view: 'LOGIN_STAFF' as const, label: 'Staff & Stylist Portal', role: 'STAFF' },
                    { view: 'LOGIN_ADMIN' as const, label: 'Platform Admin Panel', role: 'ADMIN' }
                  ].map(({ view, label, role: r }) => (
                    <button
                      key={view}
                      onClick={() => {
                        setIsRoleDropdownOpen(false);
                        setCurrentView(view);
                      }}
                      className={`w-full text-left px-2.5 py-2 text-xs rounded-sm flex items-center justify-between transition-colors ${
                        role === r ? 'bg-neutral-100 font-semibold text-neutral-950' : 'text-neutral-700 hover:bg-neutral-50'
                      }`}
                    >
                      <span>{label}</span>
                      {role === r && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                    </button>
                  ))}
                </div>

                <div className="pt-2 mt-2 border-t border-neutral-100">
                  <button
                    onClick={() => {
                      logout();
                      setIsRoleDropdownOpen(false);
                      setCurrentView('LOGIN_CUSTOMER');
                      showToast('Signed out of account session.', 'info');
                    }}
                    className="w-full text-left px-2.5 py-1.5 text-xs text-rose-600 hover:bg-rose-50 rounded-sm flex items-center gap-2 font-medium"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    Sign Out Account
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Profile Avatar / Quick Link */}
          <button
            id="btn-header-profile"
            onClick={() => setCurrentView('PROFILE')}
            className="w-8 h-8 rounded-sm overflow-hidden border border-neutral-200 flex-none hover:opacity-80 transition-opacity"
            title={currentUser?.full_name || 'Profile'}
          >
            {currentUser?.avatar_url ? (
              <img src={currentUser.avatar_url} alt={currentUser.full_name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            ) : (
              <div className="w-full h-full bg-neutral-200 flex items-center justify-center">
                <User className="w-4 h-4 text-neutral-600" />
              </div>
            )}
          </button>
        </div>
      </header>
    </>
  );
};
