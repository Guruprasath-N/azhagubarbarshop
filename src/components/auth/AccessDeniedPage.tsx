import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';
import { ShieldAlert, LogIn, Home, ArrowLeft } from 'lucide-react';

interface AccessDeniedPageProps {
  requiredRole?: string;
}

export const AccessDeniedPage: React.FC<AccessDeniedPageProps> = ({ requiredRole }) => {
  const { currentUser, role } = useAuth();
  const { setCurrentView, setTargetLoginRole } = useApp();

  const roleLabels: Record<string, string> = {
    CUSTOMER: 'Customer',
    SALON_OWNER: 'Salon Owner',
    SALON_MANAGER: 'Salon Manager',
    STAFF: 'Staff / Stylist',
    ADMIN: 'Platform Admin',
    SUPER_ADMIN: 'Super Admin'
  };

  const handleSwitchAccount = () => {
    if (requiredRole && (['CUSTOMER', 'SALON_OWNER', 'SALON_MANAGER', 'STAFF', 'ADMIN'] as string[]).includes(requiredRole)) {
      setTargetLoginRole(requiredRole as UserRole);
    }
    setCurrentView('LOGIN');
  };

  return (
    <div className="min-h-[75vh] bg-neutral-100 flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="bg-white border border-neutral-200 shadow-2xl rounded-sm p-8 max-w-md w-full text-center space-y-6 animate-in fade-in">
        {/* Shield Icon */}
        <div className="w-16 h-16 rounded-full bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center mx-auto shadow-sm">
          <ShieldAlert className="w-8 h-8" />
        </div>

        {/* Title */}
        <div className="space-y-1">
          <span className="text-xs font-mono font-bold text-rose-600 uppercase tracking-wider">
            Error 403 — Unauthorized Access
          </span>
          <h2 className="text-xl font-bold text-neutral-950">Access Denied</h2>
          <p className="text-xs text-neutral-500 leading-relaxed max-w-xs mx-auto">
            You do not have permission to view the {requiredRole ? roleLabels[requiredRole] || requiredRole : 'requested'} protected panel.
          </p>
        </div>

        {/* Role Comparison Badge */}
        <div className="p-3.5 bg-neutral-50 border border-neutral-200 rounded-sm font-mono text-xs text-left space-y-2">
          <div className="flex justify-between items-center pb-2 border-b border-neutral-200">
            <span className="text-neutral-400">Current Account:</span>
            <span className="font-semibold text-neutral-900">{currentUser?.full_name || 'Guest'}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-neutral-400">Your Current Role:</span>
            <span className="px-2 py-0.5 bg-amber-50 text-amber-800 border border-amber-200 font-bold rounded-xs text-[11px]">
              {roleLabels[role] || role}
            </span>
          </div>
          {requiredRole && (
            <div className="flex justify-between items-center pt-1">
              <span className="text-neutral-400">Required Role:</span>
              <span className="px-2 py-0.5 bg-rose-50 text-rose-800 border border-rose-200 font-bold rounded-xs text-[11px]">
                {roleLabels[requiredRole] || requiredRole}
              </span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-2 pt-2">
          <button
            onClick={() => setCurrentView('MARKETING')}
            className="flex-1 py-2.5 px-4 border border-neutral-200 text-neutral-700 text-xs font-semibold rounded-sm hover:bg-neutral-50 transition-colors flex items-center justify-center gap-1.5"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Return Home</span>
          </button>
          <button
            onClick={handleSwitchAccount}
            className="flex-1 py-2.5 px-4 bg-neutral-950 hover:bg-neutral-800 text-white text-xs font-semibold rounded-sm transition-colors flex items-center justify-center gap-1.5 shadow-sm"
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Log In as Authorized Role</span>
          </button>
        </div>
      </div>
    </div>
  );
};
