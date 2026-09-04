import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, UserRole } from '../types';
import { db } from '../services/storage';

interface AuthContextType {
  currentUser: UserProfile | null;
  isAuthenticated: boolean;
  role: UserRole;
  switchRole: (role: UserRole) => void;
  login: (email: string, pass?: string) => Promise<{ success: boolean; user?: UserProfile; error?: string }>;
  register: (payload: { full_name: string; email: string; phone: string; role: UserRole }) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateProfile: (data: Partial<UserProfile>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    db.init();
    const users = db.getUsers();
    const activeId = db.getActiveUserId();
    const found = users.find((u) => u.id === activeId) || users[0];
    setCurrentUser(found || null);
  }, []);

  const STORAGE_USERS_KEY = 'azhagu_users_v5';

  const switchRole = (role: UserRole) => {
    const users = db.getUsers();
    let target = users.find((u) => u.role === role);
    if (!target) {
      target = {
        id: `user-${role.toLowerCase()}-${Date.now()}`,
        auth_user_id: `auth-${role.toLowerCase()}`,
        full_name: `Azhagu ${role.replace('_', ' ')}`,
        email: `${role.toLowerCase()}@azhagu.demo`,
        phone: '+91 98400 11223',
        avatar_url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&h=200&q=80',
        role: role,
        password: 'password123',
        status: 'ACTIVE',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      users.push(target);
      localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(users));
    }
    db.setActiveUserId(target.id);
    setCurrentUser(target);
  };

  const login = async (identifier: string, pass?: string): Promise<{ success: boolean; user?: UserProfile; error?: string }> => {
    if (!identifier || !identifier.trim()) {
      return { success: false, error: 'Please enter your Name, Phone Number, or Email ID.' };
    }
    if (!pass || !pass.trim()) {
      return { success: false, error: 'Password is required to log in.' };
    }
    const users = db.getUsers();
    const cleanId = identifier.trim().toLowerCase();
    const cleanDigits = identifier.replace(/\D/g, '');

    const found = users.find((u) => {
      const emailMatch = u.email.toLowerCase() === cleanId;
      const nameMatch = u.full_name.toLowerCase() === cleanId || (cleanId.length >= 3 && u.full_name.toLowerCase().includes(cleanId));
      const userDigits = u.phone.replace(/\D/g, '');
      const phoneMatch = cleanDigits.length >= 4 && (userDigits.includes(cleanDigits) || cleanDigits.includes(userDigits));
      return emailMatch || phoneMatch || nameMatch;
    });

    if (!found) {
      return { success: false, error: 'No account found matching that Name, Phone Number, or Email. Please register or use demo presets.' };
    }
    if (found.status === 'SUSPENDED') {
      return { success: false, error: 'Your account has been suspended. Please contact platform support.' };
    }
    if (found.password && found.password !== pass) {
      return { success: false, error: 'Incorrect password. (Demo default password is: password123)' };
    }
    db.setActiveUserId(found.id);
    setCurrentUser(found);
    return { success: true, user: found };
  };

  const register = async (payload: {
    full_name: string;
    email: string;
    phone: string;
    role: UserRole;
    password?: string;
  }): Promise<{ success: boolean; error?: string }> => {
    const users = db.getUsers();
    if (users.some((u) => u.email.toLowerCase() === payload.email.toLowerCase())) {
      return { success: false, error: 'An account with this email already exists. Please log in instead.' };
    }

    const newUser: UserProfile = {
      id: `user-${Date.now()}`,
      auth_user_id: `auth-${Date.now()}`,
      full_name: payload.full_name,
      email: payload.email,
      phone: payload.phone,
      avatar_url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&h=200&q=80',
      role: payload.role,
      password: payload.password || 'password123',
      status: 'ACTIVE',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    users.push(newUser);
    localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(users));
    db.setActiveUserId(newUser.id);
    setCurrentUser(newUser);
    return { success: true };
  };

  const logout = () => {
    const users = db.getUsers();
    const guest = users.find((u) => u.role === 'CUSTOMER') || users[0];
    if (guest) {
      db.setActiveUserId(guest.id);
      setCurrentUser(guest);
    }
  };

  const updateProfile = (data: Partial<UserProfile>) => {
    if (!currentUser) return;
    const users = db.getUsers();
    const idx = users.findIndex((u) => u.id === currentUser.id);
    if (idx !== -1) {
      users[idx] = { ...users[idx], ...data, updated_at: new Date().toISOString() };
      localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(users));
      setCurrentUser({ ...users[idx] });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated: !!currentUser,
        role: currentUser?.role || 'CUSTOMER',
        switchRole,
        login,
        register,
        logout,
        updateProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
