export type UserRole = 
  | 'CUSTOMER' 
  | 'SALON_OWNER' 
  | 'SALON_MANAGER' 
  | 'STAFF' 
  | 'ADMIN' 
  | 'SUPER_ADMIN';

export type SalonStatus = 'PENDING' | 'ACTIVE' | 'SUSPENDED' | 'INACTIVE';

export type AppointmentStatus = 
  | 'PENDING' 
  | 'CONFIRMED' 
  | 'COMPLETED' 
  | 'CANCELLED' 
  | 'NO_SHOW';

export type LeaveStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export type NotificationType = 
  | 'BOOKING_CREATED' 
  | 'BOOKING_CONFIRMED' 
  | 'BOOKING_CANCELLED' 
  | 'BOOKING_COMPLETED' 
  | 'REVIEW_RECEIVED' 
  | 'SYSTEM_ALERT';

export interface UserProfile {
  id: string;
  auth_user_id: string;
  full_name: string;
  email: string;
  phone: string;
  avatar_url: string;
  role: UserRole;
  password?: string;
  status: 'ACTIVE' | 'SUSPENDED';
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image_url: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Salon {
  id: string;
  owner_id: string;
  name: string;
  slug: string;
  description: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  state: string;
  country: string;
  postal_code: string;
  latitude: number;
  longitude: number;
  logo_url: string;
  cover_image_url: string;
  gallery_urls?: string[];
  status: SalonStatus;
  rating: number;
  review_count: number;
  category_ids: string[];
  created_at: string;
  updated_at: string;
}

export interface Service {
  id: string;
  salon_id: string;
  category_id: string;
  name: string;
  description: string;
  price: number;
  duration_minutes: number;
  image_url: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Staff {
  id: string;
  salon_id: string;
  profile_id?: string;
  display_name: string;
  bio: string;
  specialization: string;
  experience_years: number;
  avatar_url: string;
  is_active: boolean;
  service_ids: string[]; // Assigned services
  rating?: number;
  created_at: string;
  updated_at: string;
}

export interface SalonWorkingHours {
  id: string;
  salon_id: string;
  day_of_week: number; // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
  open_time: string; // e.g. "09:00"
  close_time: string; // e.g. "20:00"
  is_closed: boolean;
}

export interface StaffWorkingHours {
  id: string;
  staff_id: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
  is_available: boolean;
}

export interface StaffLeave {
  id: string;
  staff_id: string;
  start_date: string; // YYYY-MM-DD
  end_date: string; // YYYY-MM-DD
  reason: string;
  status: LeaveStatus;
  created_at: string;
}

export interface Appointment {
  id: string;
  customer_id: string;
  salon_id: string;
  staff_id: string;
  service_id: string;
  appointment_date: string; // YYYY-MM-DD
  start_time: string; // HH:mm
  end_time: string; // HH:mm
  status: AppointmentStatus;
  notes?: string;
  total_price: number;
  customer_name: string;
  customer_phone: string;
  customer_email: string;
  service_name: string;
  staff_name: string;
  salon_name: string;
  payment_status?: 'PENDING' | 'PAID' | 'PAY_AT_SALON';
  payment_method?: 'PAY_AT_SALON' | 'UPI' | 'CARD';
  created_at: string;
  updated_at: string;
}

export interface Review {
  id: string;
  customer_id: string;
  customer_name: string;
  customer_avatar: string;
  salon_id: string;
  appointment_id: string;
  rating: number; // 1-5
  comment: string;
  status: 'PUBLISHED' | 'HIDDEN';
  created_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  created_at: string;
  link_id?: string;
}

export interface AuditLog {
  id: string;
  actor_id: string;
  actor_name: string;
  action: string;
  entity_type: string;
  entity_id: string;
  metadata?: Record<string, any>;
  created_at: string;
}
