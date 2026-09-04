import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';
import {
  Scissors,
  Lock,
  Mail,
  User,
  CheckCircle2,
  AlertCircle,
  KeyRound,
  ShieldCheck,
  Building2,
  Sparkles,
  ArrowRight,
  HelpCircle,
  X
} from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const {
    targetLoginRole,
    setTargetLoginRole,
    currentView,
    setCurrentView,
    setIsLoginModalOpen,
    showToast
  } = useApp();

  const [fullName, setFullName] = useState('');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');

  const roleConfig: Record<UserRole, { title: string; subtitle: string; icon: any; defaultEmail: string; demoName: string }> = {
    CUSTOMER: {
      title: 'Login as Customer',
      subtitle: 'Explore South India’s finest salons, book instant slots & manage your appointments.',
      icon: Sparkles,
      defaultEmail: 'guruprasath@azhagu.demo',
      demoName: 'Guruprasath Sundaram'
    },
    SALON_OWNER: {
      title: 'Login as Salon Owner',
      subtitle: 'Manage your salon branch, view revenue metrics, approve bookings & configure stylists.',
      icon: Building2,
      defaultEmail: 'kavitha@azhagu.demo',
      demoName: 'Kavitha Ramasamy'
    },
    SALON_MANAGER: {
      title: 'Login as Salon Manager',
      subtitle: 'Oversee daily operations, shift schedules, appointment locks & customer reviews.',
      icon: User,
      defaultEmail: 'senthil@azhagu.demo',
      demoName: 'Senthil Nathan'
    },
    STAFF: {
      title: 'Login as Staff / Stylist',
      subtitle: 'View your upcoming appointments, track customer notes & manage leave schedules.',
      icon: Scissors,
      defaultEmail: 'senthil@azhagu.demo',
      demoName: 'Senthil Nathan'
    },
    ADMIN: {
      title: 'Login as Admin',
      subtitle: 'Platform command center — audit logs, salon verification & system settings.',
      icon: ShieldCheck,
      defaultEmail: 'admin@azhagu.demo',
      demoName: 'Praveen Kumar'
    },
    SUPER_ADMIN: {
      title: 'Login as Super Admin',
      subtitle: 'Full infrastructure authority — global management & system logs.',
      icon: ShieldCheck,
      defaultEmail: 'admin@azhagu.demo',
      demoName: 'Praveen Kumar'
    }
  };

  const currentRoleConfig = roleConfig[targetLoginRole] || roleConfig.CUSTOMER;
  const RoleIcon = currentRoleConfig.icon;

  // Autofill initial demo values on role change
  useEffect(() => {
    setIdentifier(currentRoleConfig.defaultEmail);
    setFullName(currentRoleConfig.demoName);
    setPassword('password123');
    setErrorMsg(null);
  }, [targetLoginRole]);

  const handleAutofillDemo = () => {
    setIdentifier(currentRoleConfig.defaultEmail);
    setFullName(currentRoleConfig.demoName);
    setPassword('password123');
    setErrorMsg(null);
    showToast(`Autofilled credentials for ${currentRoleConfig.title}`, 'info');
  };

  const handleCloseLogin = () => {
    setIsLoginModalOpen(false);
    if (currentView === 'LOGIN') {
      setCurrentView('MARKETING');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!identifier.trim()) {
      setErrorMsg('Please enter your Email Address, Phone Number, or Full Name.');
      return;
    }

    if (!password.trim()) {
      setErrorMsg('Please enter your account password.');
      return;
    }

    setIsLoading(true);
    const res = await login(identifier, password);
    setIsLoading(false);

    if (res.success && res.user) {
      showToast(`Welcome back, ${res.user.full_name}! Logged in as ${res.user.role.replace('_', ' ')}.`, 'success');
      setIsLoginModalOpen(false);
      
      // Auto-open panel based on the authenticated user's ACTUAL role
      const authenticatedRole = res.user.role;
      if (authenticatedRole === 'ADMIN' || authenticatedRole === 'SUPER_ADMIN') {
        setCurrentView('ADMIN_DASHBOARD');
      } else if (authenticatedRole === 'SALON_OWNER' || authenticatedRole === 'SALON_MANAGER' || authenticatedRole === 'STAFF') {
        setCurrentView('SALON_DASHBOARD');
      } else {
        setCurrentView('DISCOVER');
      }
    } else {
      setErrorMsg(res.error || 'Authentication failed. Please check your credentials.');
    }
  };

  const handleForgotPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsForgotModalOpen(false);
    showToast(`Password reset link sent to ${forgotEmail || identifier}!`, 'info');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/75 backdrop-blur-xs animate-in fade-in overflow-y-auto">
      <div className="sm:mx-auto sm:w-full sm:max-w-md space-y-3 relative my-8">
        {/* Brand Logo Header */}
        <div className="text-center flex flex-col items-center">
          <img src="/azhagu-logo.png" alt="AZHAGU Logo" className="h-14 w-auto object-contain mb-1" />
        </div>

        {/* Role Selector Tabs */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-sm p-1.5 shadow-xs grid grid-cols-4 gap-1 text-[11px] font-medium text-center">
          {(['CUSTOMER', 'SALON_OWNER', 'STAFF', 'ADMIN'] as UserRole[]).map((r) => {
            const isSelected = targetLoginRole === r;
            const labels: Record<UserRole, string> = {
              CUSTOMER: 'Customer',
              SALON_OWNER: 'Salon Owner',
              SALON_MANAGER: 'Manager',
              STAFF: 'Staff / Stylist',
              ADMIN: 'Admin',
              SUPER_ADMIN: 'Admin'
            };
            return (
              <button
                key={r}
                type="button"
                onClick={() => setTargetLoginRole(r)}
                className={`py-1.5 rounded-xs transition-colors ${
                  isSelected
                    ? 'bg-white text-neutral-950 font-semibold shadow-xs'
                    : 'text-neutral-400 hover:bg-neutral-800 hover:text-white'
                }`}
              >
                {labels[r]}
              </button>
            );
          })}
        </div>

        {/* Main Card */}
        <div className="bg-white border border-neutral-200 shadow-2xl rounded-sm p-6 sm:p-7 space-y-5 relative">
          {/* Top Right Close (X) Button */}
          <button
            type="button"
            onClick={handleCloseLogin}
            className="absolute top-4 right-4 p-1.5 text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 rounded-sm transition-colors"
            title="Close Log In Pop-up"
          >
            <X className="w-5 h-5" />
          </button>
          {/* Card Title Header */}
          <div className="flex items-start gap-3 pb-4 border-b border-neutral-100">
            <div className="p-2.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-sm flex-none">
              <RoleIcon className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-neutral-950">{currentRoleConfig.title}</h2>
              <p className="text-xs text-neutral-500 leading-relaxed mt-0.5">{currentRoleConfig.subtitle}</p>
            </div>
          </div>

          {/* Validation & Error Alert */}
          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-sm flex items-start gap-2 text-xs animate-in fade-in">
              <AlertCircle className="w-4 h-4 flex-none mt-0.5" />
              <div className="leading-relaxed">{errorMsg}</div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-[10px] uppercase font-mono font-bold text-neutral-500 block mb-1">
                Full Name (Optional)
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Enter full name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-neutral-50 border border-neutral-200 rounded-sm text-xs focus:outline-none focus:border-neutral-900"
                />
                <User className="w-4 h-4 text-neutral-400 absolute left-3 top-2.5" />
              </div>
            </div>

            <div>
              <label className="text-[10px] uppercase font-mono font-bold text-neutral-500 block mb-1">
                Email Address / Phone Number / Identifier <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder="e.g. kavitha@azhagu.demo or 98401 23456"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-neutral-50 border border-neutral-200 rounded-sm text-xs focus:outline-none focus:border-neutral-900 font-mono"
                />
                <Mail className="w-4 h-4 text-neutral-400 absolute left-3 top-2.5" />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-[10px] uppercase font-mono font-bold text-neutral-500 block">
                  Password <span className="text-red-500">*</span>
                </label>
                <button
                  type="button"
                  onClick={() => setIsForgotModalOpen(true)}
                  className="text-[11px] text-emerald-700 hover:underline font-medium"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <input
                  type="password"
                  required
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-neutral-50 border border-neutral-200 rounded-sm text-xs focus:outline-none focus:border-neutral-900 font-mono"
                />
                <Lock className="w-4 h-4 text-neutral-400 absolute left-3 top-2.5" />
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-neutral-600">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded-xs border-neutral-300 text-neutral-900 focus:ring-neutral-900"
                />
                <span>Remember me on this browser</span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 bg-neutral-950 hover:bg-neutral-800 text-white font-semibold text-xs rounded-sm transition-colors flex items-center justify-center gap-2 shadow-sm"
            >
              {isLoading ? (
                <span>Authenticating...</span>
              ) : (
                <>
                  <span>Sign In & Access Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Credentials Bar */}
          <div className="pt-4 border-t border-neutral-100 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-mono font-bold text-neutral-400 tracking-wider">
                Demo Account Credentials
              </span>
              <button
                type="button"
                onClick={handleAutofillDemo}
                className="text-[11px] text-neutral-800 hover:text-neutral-950 font-bold underline flex items-center gap-1"
              >
                <KeyRound className="w-3 h-3 text-emerald-600" />
                Autofill Credentials
              </button>
            </div>
            <div className="p-2.5 bg-neutral-50 border border-neutral-200 rounded-sm font-mono text-[11px] space-y-1 text-neutral-700">
              <div className="flex justify-between">
                <span className="text-neutral-400">Account:</span>
                <span className="font-semibold text-neutral-900">{currentRoleConfig.defaultEmail}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-400">Password:</span>
                <span className="font-semibold text-neutral-900">password123</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {isForgotModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white border border-neutral-200 rounded-sm shadow-2xl w-full max-w-sm overflow-hidden p-6 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-neutral-100">
              <div className="flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-emerald-600" />
                <h3 className="text-sm font-bold text-neutral-950">Password Recovery</h3>
              </div>
              <button
                onClick={() => setIsForgotModalOpen(false)}
                className="text-neutral-400 hover:text-neutral-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-neutral-500 leading-relaxed">
              Enter your registered email address to receive a secure password reset link.
            </p>

            <form onSubmit={handleForgotPasswordSubmit} className="space-y-3">
              <div>
                <label className="text-[10px] uppercase font-mono text-neutral-400 block mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="e.g. kavitha@azhagu.demo"
                  value={forgotEmail || identifier}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-neutral-50 border border-neutral-200 rounded-sm text-xs font-mono"
                />
              </div>

              <div className="pt-2 flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={() => setIsForgotModalOpen(false)}
                  className="px-3 py-1.5 border border-neutral-200 text-xs rounded-sm hover:bg-neutral-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-neutral-900 text-white text-xs font-semibold rounded-sm hover:bg-neutral-800"
                >
                  Send Reset Link
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
