import React from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { MarketingPage } from './components/marketing/MarketingPage';
import { DiscoverSalons } from './components/customer/DiscoverSalons';
import { SalonDetails } from './components/customer/SalonDetails';
import { MyBookings } from './components/customer/MyBookings';
import { CustomerProfile } from './components/customer/CustomerProfile';
import { SalonDashboard } from './components/salon/SalonDashboard';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { BookingModal } from './components/customer/BookingModal';
import { ReviewModal } from './components/customer/ReviewModal';
import { RoleLoginPage } from './components/auth/RoleLoginPage';
import { AccessDeniedPage } from './components/auth/AccessDeniedPage';
import { CheckCircle2, AlertCircle, Info } from 'lucide-react';

const AppContent: React.FC = () => {
  const { currentView, toast } = useApp();
  const { role, currentUser } = useAuth();

  return (
    <div className="min-h-screen flex flex-col bg-neutral-50 text-neutral-900 font-sans selection:bg-neutral-900 selection:text-white">
      {/* Universal Clean Header */}
      <Header />

      {/* Main Viewport Router with Strict Role Isolation & Separate Login Pages */}
      <main className="flex-1">
        {currentView === 'MARKETING' && <MarketingPage />}
        {currentView === 'DISCOVER' && <DiscoverSalons />}
        {currentView === 'SALON_DETAILS' && <SalonDetails />}
        {currentView === 'MY_BOOKINGS' && (currentUser ? <MyBookings /> : <RoleLoginPage portalRole="CUSTOMER" />)}
        {currentView === 'PROFILE' && (currentUser ? <CustomerProfile /> : <RoleLoginPage portalRole="CUSTOMER" />)}

        {/* Separate Dedicated Role Login Pages */}
        {currentView === 'LOGIN_CUSTOMER' && <RoleLoginPage portalRole="CUSTOMER" />}
        {currentView === 'LOGIN_OWNER' && <RoleLoginPage portalRole="SALON_OWNER" />}
        {currentView === 'LOGIN_MANAGER' && <RoleLoginPage portalRole="SALON_MANAGER" />}
        {currentView === 'LOGIN_STAFF' && <RoleLoginPage portalRole="STAFF" />}
        {currentView === 'LOGIN_ADMIN' && <RoleLoginPage portalRole="ADMIN" />}

        {/* Separate Protected Role Dashboards */}
        {(currentView === 'SALON_OWNER_DASHBOARD' || currentView === 'SALON_MANAGER_DASHBOARD' || currentView === 'STAFF_DASHBOARD') && (
          ['SALON_OWNER', 'SALON_MANAGER', 'STAFF'].includes(role) ? (
            <SalonDashboard />
          ) : (
            <AccessDeniedPage requiredRole="SALON_OWNER" />
          )
        )}
        {currentView === 'ADMIN_DASHBOARD' && (
          ['ADMIN', 'SUPER_ADMIN'].includes(role) ? (
            <AdminDashboard />
          ) : (
            <AccessDeniedPage requiredRole="ADMIN" />
          )
        )}
        {currentView === 'ACCESS_DENIED' && <AccessDeniedPage />}
      </main>

      {/* Global Interactive Modals */}
      <BookingModal />
      <ReviewModal />

      {/* Global Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-3 duration-300">
          <div
            className={`px-4 py-3 rounded-sm shadow-xl flex items-center gap-2.5 text-xs border ${
              toast.type === 'success'
                ? 'bg-neutral-950 text-white border-neutral-800'
                : toast.type === 'error'
                ? 'bg-red-950 text-white border-red-800'
                : 'bg-white text-neutral-950 border-neutral-200'
            }`}
          >
            {toast.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-none" />}
            {toast.type === 'error' && <AlertCircle className="w-4 h-4 text-red-400 flex-none" />}
            {toast.type === 'info' && <Info className="w-4 h-4 text-blue-500 flex-none" />}
            <span className="font-medium">{toast.message}</span>
          </div>
        </div>
      )}

      {/* Universal Clean Footer */}
      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </AuthProvider>
  );
}
