import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  Salon,
  Category,
  Service,
  Staff,
  SalonWorkingHours,
  StaffWorkingHours,
  StaffLeave,
  Appointment,
  Review,
  Notification,
  AuditLog,
  UserRole
} from '../types';
import { db } from '../services/storage';
import { PageLoader } from '../components/common/PageLoader';

export type AppView = 
  | 'MARKETING' 
  | 'DISCOVER' 
  | 'SALON_DETAILS' 
  | 'MY_BOOKINGS' 
  | 'PROFILE' 
  | 'DOCS'
  | 'LOGIN_CUSTOMER'
  | 'LOGIN_OWNER'
  | 'LOGIN_MANAGER'
  | 'LOGIN_STAFF'
  | 'LOGIN_ADMIN'
  | 'SALON_OWNER_DASHBOARD'
  | 'SALON_MANAGER_DASHBOARD'
  | 'STAFF_DASHBOARD'
  | 'ADMIN_DASHBOARD'
  | 'ACCESS_DENIED';

interface ToastState {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

interface AppContextType {
  currentView: AppView;
  setCurrentView: (view: AppView) => void;
  targetLoginRole: UserRole;
  setTargetLoginRole: (role: UserRole) => void;
  isLoginModalOpen: boolean;
  setIsLoginModalOpen: (open: boolean) => void;
  selectedSalonId: string | null;
  setSelectedSalonId: (id: string | null) => void;
  selectedServiceForBooking: Service | null;
  setSelectedServiceForBooking: (srv: Service | null) => void;
  isBookingModalOpen: boolean;
  setIsBookingModalOpen: (open: boolean) => void;
  isReviewModalOpen: boolean;
  setIsReviewModalOpen: (open: boolean) => void;
  targetAppointmentForReview: Appointment | null;
  setTargetAppointmentForReview: (appt: Appointment | null) => void;
  isMobileSimulatorOpen: boolean;
  setIsMobileSimulatorOpen: (open: boolean) => void;
  isSqlDocsOpen: boolean;
  setIsSqlDocsOpen: (open: boolean) => void;
  
  // Data
  salons: Salon[];
  categories: Category[];
  services: Service[];
  staff: Staff[];
  salonHours: SalonWorkingHours[];
  staffHours: StaffWorkingHours[];
  staffLeaves: StaffLeave[];
  appointments: Appointment[];
  reviews: Review[];
  notifications: Notification[];
  auditLogs: AuditLog[];
  
  // Actions
  refreshData: () => void;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  navigateToSalon: (salonId: string) => void;
  openBookingForService: (salonId: string, service: Service) => void;
  bookAppointment: (payload: any) => { success: boolean; appointment?: Appointment; error?: string };
  cancelBooking: (appointmentId: string, actorId: string, role: string) => { success: boolean; error?: string };
  submitReview: (payload: any) => { success: boolean; error?: string };
  resetSeedData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentView, setCurrentView] = useState<AppView>('MARKETING');
  const [targetLoginRole, setTargetLoginRole] = useState<UserRole>('CUSTOMER');
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(true);
  const [selectedSalonId, setSelectedSalonId] = useState<string | null>('salon-1');
  const [selectedServiceForBooking, setSelectedServiceForBooking] = useState<Service | null>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [targetAppointmentForReview, setTargetAppointmentForReview] = useState<Appointment | null>(null);
  const [isMobileSimulatorOpen, setIsMobileSimulatorOpen] = useState(false);
  const [isSqlDocsOpen, setIsSqlDocsOpen] = useState(false);
  const [toast, setToast] = useState<ToastState | null>(null);

  // Live Data State
  const [salons, setSalons] = useState<Salon[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [staff, setStaff] = useState<Staff[]>([]);
  const [salonHours, setSalonHours] = useState<SalonWorkingHours[]>([]);
  const [staffHours, setStaffHours] = useState<StaffWorkingHours[]>([]);
  const [staffLeaves, setStaffLeaves] = useState<StaffLeave[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);

  const refreshData = useCallback(() => {
    setSalons(db.getSalons());
    setCategories(db.getCategories());
    setServices(db.getServices());
    setStaff(db.getStaff());
    setSalonHours(db.getSalonWorkingHours());
    setStaffHours(db.getStaffWorkingHours());
    setStaffLeaves(db.getStaffLeaves());
    setAppointments(db.getAppointments());
    setReviews(db.getReviews());
    setNotifications(db.getNotifications());
    setAuditLogs(db.getAuditLogs());
  }, []);

  useEffect(() => {
    db.init();
    refreshData();
  }, [refreshData]);

  const [isPageLoading, setIsPageLoading] = useState(false);
  const [pageLoadingMessage, setPageLoadingMessage] = useState('Loading AZHAGU Platform...');

  const changeViewWithLoader = (view: AppView, customMessage?: string) => {
    const messages: Record<string, string> = {
      MARKETING: 'Loading AZHAGU Home...',
      DISCOVER: 'Discovering South India Salons...',
      SALON_DETAILS: 'Loading Salon Studio & Services...',
      MY_BOOKINGS: 'Fetching Your Reserved Slots...',
      PROFILE: 'Loading Profile Details...',
      LOGIN_CUSTOMER: 'Opening Customer Portal...',
      LOGIN_OWNER: 'Opening Salon Owner Portal...',
      LOGIN_MANAGER: 'Opening Manager Portal...',
      LOGIN_STAFF: 'Opening Stylist Portal...',
      LOGIN_ADMIN: 'Opening Platform Admin Panel...',
      SALON_OWNER_DASHBOARD: 'Loading Salon Owner Dashboard...',
      SALON_MANAGER_DASHBOARD: 'Loading Manager Portal...',
      STAFF_DASHBOARD: 'Loading Stylist Dashboard...',
      ADMIN_DASHBOARD: 'Loading Admin Console...'
    };

    setPageLoadingMessage(customMessage || messages[view] || 'Loading AZHAGU Platform...');
    setIsPageLoading(true);

    setTimeout(() => {
      setCurrentView(view);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setTimeout(() => {
        setIsPageLoading(false);
      }, 200);
    }, 350);
  };

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToast({ id, message, type });
    setTimeout(() => {
      setToast((curr) => (curr?.id === id ? null : curr));
    }, 4000);
  };

  const navigateToSalon = (salonId: string) => {
    setSelectedSalonId(salonId);
    changeViewWithLoader('SALON_DETAILS', 'Opening Salon Studio & Stylist Slots...');
  };

  const openBookingForService = (salonId: string, service: Service) => {
    setSelectedSalonId(salonId);
    setSelectedServiceForBooking(service);
    setIsBookingModalOpen(true);
  };

  const handleBookAppointment = (payload: any) => {
    const res = db.bookAppointment(payload);
    refreshData();
    if (res.success) {
      showToast('Appointment reserved successfully!', 'success');
    } else {
      showToast(res.error || 'Failed to book appointment', 'error');
    }
    return res;
  };

  const handleCancelBooking = (appointmentId: string, actorId: string, role: string) => {
    const res = db.cancelAppointment(appointmentId, actorId, role);
    refreshData();
    if (res.success) {
      showToast('Appointment cancelled.', 'info');
    } else {
      showToast(res.error || 'Unable to cancel appointment.', 'error');
    }
    return res;
  };

  const handleSubmitReview = (payload: any) => {
    const res = db.submitReview(payload);
    refreshData();
    if (res.success) {
      showToast('Thank you! Your verified review has been published.', 'success');
    } else {
      showToast(res.error || 'Could not post review.', 'error');
    }
    return res;
  };

  const resetSeedData = () => {
    db.resetToSeed();
    refreshData();
    showToast('Database reset to master seed state.', 'info');
  };

  return (
    <AppContext.Provider
      value={{
        currentView,
        setCurrentView: changeViewWithLoader,
        targetLoginRole,
        setTargetLoginRole,
        isLoginModalOpen,
        setIsLoginModalOpen,
        selectedSalonId,
        setSelectedSalonId,
        selectedServiceForBooking,
        setSelectedServiceForBooking,
        isBookingModalOpen,
        setIsBookingModalOpen,
        isReviewModalOpen,
        setIsReviewModalOpen,
        targetAppointmentForReview,
        setTargetAppointmentForReview,
        isMobileSimulatorOpen,
        setIsMobileSimulatorOpen,
        isSqlDocsOpen,
        setIsSqlDocsOpen,
        salons,
        categories,
        services,
        staff,
        salonHours,
        staffHours,
        staffLeaves,
        appointments,
        reviews,
        notifications,
        auditLogs,
        refreshData,
        showToast,
        navigateToSalon,
        openBookingForService,
        bookAppointment: handleBookAppointment,
        cancelBooking: handleCancelBooking,
        submitReview: handleSubmitReview,
        resetSeedData
      }}
    >
      {children}

      {/* Global Luxury Page Loader with New Azhagu Logo */}
      <PageLoader isLoading={isPageLoading} message={pageLoadingMessage} />

      {/* Global Toast Notification */}
      {toast && (
        <div
          id="global-toast"
          className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 bg-neutral-900 text-white text-xs font-medium rounded shadow-lg border border-neutral-800 animate-in fade-in slide-in-from-bottom-3 duration-200"
        >
          <div
            className={`w-2 h-2 rounded-full ${
              toast.type === 'success'
                ? 'bg-emerald-400'
                : toast.type === 'error'
                ? 'bg-red-400'
                : 'bg-neutral-300'
            }`}
          />
          <span>{toast.message}</span>
        </div>
      )}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
