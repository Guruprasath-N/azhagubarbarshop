import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';
import {
  Scissors,
  Lock,
  Mail,
  User,
  AlertCircle,
  KeyRound,
  ShieldCheck,
  Building2,
  Sparkles,
  ArrowRight,
  HelpCircle,
  X,
  UserCheck,
  CalendarCheck,
  BadgeAlert
} from 'lucide-react';

interface RoleLoginPageProps {
  portalRole: UserRole;
}

export const RoleLoginPage: React.FC<RoleLoginPageProps> = ({ portalRole }) => {
  const { login } = useAuth();
  const { setCurrentView, showToast } = useApp();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');

  const portalConfig: Record<UserRole, {
    title: string;
    badge: string;
    subtitle: string;
    icon: any;
    demoEmail: string;
    demoName: string;
    allowedRoles: UserRole[];
    destinationView: any;
    themeColor: string;
  }> = {
    CUSTOMER: {
      title: 'Customer Portal Login',
      badge: 'CUSTOMER ACCESS ONLY',
      subtitle: 'Discover top South Indian salons, book instant appointments & track booking history.',
      icon: Sparkles,
      demoEmail: 'guruprasath@azhagu.demo',
      demoName: 'Guruprasath Sundaram',
      allowedRoles: ['CUSTOMER'],
      destinationView: 'DISCOVER',
      themeColor: 'emerald'
    },
    SALON_OWNER: {
      title: 'Salon Owner Portal Login',
      badge: 'SALON OWNER ACCESS ONLY',
      subtitle: 'Manage salon details, revenue analytics, service catalog & staff shifts.',
      icon: Building2,
      demoEmail: 'kavitha@azhagu.demo',
      demoName: 'Kavitha Ramasamy',
      allowedRoles: ['SALON_OWNER'],
      destinationView: 'SALON_OWNER_DASHBOARD',
      themeColor: 'blue'
    },
    SALON_MANAGER: {
      title: 'Salon Manager Portal Login',
      badge: 'SALON MANAGER ACCESS ONLY',
      subtitle: 'Oversee daily salon operations, appointment queues & staff leave approvals.',
      icon: UserCheck,
      demoEmail: 'senthil@azhagu.demo',
      demoName: 'Senthil Nathan',
      allowedRoles: ['SALON_MANAGER', 'SALON_OWNER'],
      destinationView: 'SALON_MANAGER_DASHBOARD',
      themeColor: 'purple'
    },
    STAFF: {
      title: 'Staff & Stylist Portal Login',
      badge: 'STAFF ACCESS ONLY',
      subtitle: 'View your daily appointment schedule, customer notes & leave requests.',
      icon: Scissors,
      demoEmail: 'senthil@azhagu.demo',
      demoName: 'Senthil Nathan',
      allowedRoles: ['STAFF', 'SALON_MANAGER', 'SALON_OWNER'],
      destinationView: 'STAFF_DASHBOARD',
      themeColor: 'amber'
    },
    ADMIN: {
      title: 'Platform Admin Panel Login',
      badge: 'RESTRICTED ADMIN ACCESS',
      subtitle: 'Platform infrastructure command center — audit logs & salon approvals.',
      icon: ShieldCheck,
      demoEmail: 'admin@azhagu.demo',
      demoName: 'Praveen Kumar',
      allowedRoles: ['ADMIN', 'SUPER_ADMIN'],
      destinationView: 'ADMIN_DASHBOARD',
      themeColor: 'rose'
    },
    SUPER_ADMIN: {
      title: 'Platform Admin Panel Login',
      badge: 'RESTRICTED ADMIN ACCESS',
      subtitle: 'Platform infrastructure command center — audit logs & salon approvals.',
      icon: ShieldCheck,
      demoEmail: 'admin@azhagu.demo',
      demoName: 'Praveen Kumar',
      allowedRoles: ['ADMIN', 'SUPER_ADMIN'],
      destinationView: 'ADMIN_DASHBOARD',
      themeColor: 'rose'
    }
  };

  const currentConfig = portalConfig[portalRole] || portalConfig.CUSTOMER;
  const PortalIcon = currentConfig.icon;

  useEffect(() => {
    setIdentifier(currentConfig.demoEmail);
    setPassword('password123');
    setErrorMsg(null);
  }, [portalRole]);

  const handleAutofillDemo = () => {
    setIdentifier(currentConfig.demoEmail);
    setPassword('password123');
    setErrorMsg(null);
    showToast(`Autofilled demo credentials for ${currentConfig.title}`, 'info');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!identifier.trim()) {
      setErrorMsg('Please enter your Email Address, Phone Number, or Full Name.');
      return;
    }
    if (!password.trim()) {
      setErrorMsg('Please enter your password.');
      return;
    }

    setIsLoading(true);
    const res = await login(identifier, password);
    setIsLoading(false);

    if (res.success && res.user) {
      const userRole = res.user.role;

      // Strict Portal Authorization Check
      if (!currentConfig.allowedRoles.includes(userRole)) {
        setErrorMsg(
          `Access Denied: Your account role is "${userRole.replace('_', ' ')}". You cannot log in through the ${currentConfig.title}.`
        );
        showToast(`Access Denied: Please use your designated role login portal.`, 'error');
        return;
      }

      showToast(`Authenticated successfully! Welcome, ${res.user.full_name}.`, 'success');
      setCurrentView(currentConfig.destinationView);
    } else {
      setErrorMsg(res.error || 'Authentication failed. Please verify credentials.');
    }
  };

  return (
    <div className="min-h-[85vh] bg-neutral-100 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 animate-in fade-in">
      <div className="sm:mx-auto sm:w-full sm:max-w-md space-y-4">
        {/* Brand Header */}
        <div className="text-center flex flex-col items-center">
          <img src="/azhagu-logo.png" alt="AZHAGU Logo" className="h-16 w-auto object-contain mb-2" />
        </div>

        {/* Portal Access Badge */}
        <div className="bg-neutral-950 text-white text-[10px] font-mono font-bold tracking-wider uppercase py-1.5 px-3 rounded-sm flex items-center justify-between border border-neutral-800 shadow-sm">
          <span>{currentConfig.badge}</span>
          <PortalIcon className="w-3.5 h-3.5 text-emerald-400" />
        </div>

        {/* Login Card */}
        <div className="bg-white border border-neutral-200 shadow-2xl rounded-sm p-6 sm:p-8 space-y-6">
          {/* Card Header */}
          <div className="flex items-start gap-3 pb-4 border-b border-neutral-100">
            <div className="p-2.5 bg-neutral-100 text-neutral-900 border border-neutral-200 rounded-sm flex-none">
              <PortalIcon className="w-6 h-6 text-neutral-950" />
            </div>
            <div>
              <h2 className="text-base font-bold text-neutral-950">{currentConfig.title}</h2>
              <p className="text-xs text-neutral-500 leading-relaxed mt-0.5">{currentConfig.subtitle}</p>
            </div>
          </div>

          {/* Validation & Authorization Error Alert */}
          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-sm flex items-start gap-2 text-xs animate-in fade-in">
              <BadgeAlert className="w-4 h-4 text-rose-600 flex-none mt-0.5" />
              <div className="leading-relaxed font-medium">{errorMsg}</div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-[10px] uppercase font-mono font-bold text-neutral-500 block mb-1">
                Email Address / Phone Number / Identifier <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder="Enter email or registered identifier"
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
                  Password <span className="text-rose-500">*</span>
                </label>
                <button
                  type="button"
                  onClick={() => setIsForgotModalOpen(true)}
                  className="text-[11px] text-neutral-600 hover:text-neutral-950 hover:underline font-medium"
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

            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-neutral-600">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded-xs border-neutral-300 text-neutral-900 focus:ring-neutral-900"
                />
                <span>Remember session on this device</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 bg-neutral-950 hover:bg-neutral-800 text-white font-semibold text-xs rounded-sm transition-colors flex items-center justify-center gap-2 shadow-sm"
            >
              {isLoading ? (
                <span>Authenticating Portal Access...</span>
              ) : (
                <>
                  <span>Sign In to {currentConfig.title.replace(' Login', '')}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Credentials Autofill */}
          <div className="pt-4 border-t border-neutral-100 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-mono font-bold text-neutral-400 tracking-wider">
                Authorized Portal Demo Credentials
              </span>
              <button
                type="button"
                onClick={handleAutofillDemo}
                className="text-[11px] text-neutral-900 hover:underline font-bold flex items-center gap-1"
              >
                <KeyRound className="w-3 h-3 text-emerald-600" />
                Autofill Credentials
              </button>
            </div>
            <div className="p-2.5 bg-neutral-50 border border-neutral-200 rounded-sm font-mono text-[11px] space-y-1 text-neutral-700">
              <div className="flex justify-between">
                <span className="text-neutral-400">Account:</span>
                <span className="font-semibold text-neutral-900">{currentConfig.demoEmail}</span>
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
          <div className="bg-white border border-neutral-200 rounded-sm shadow-2xl w-full max-w-sm p-6 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-neutral-100">
              <div className="flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-emerald-600" />
                <h3 className="text-sm font-bold text-neutral-950">Password Recovery</h3>
              </div>
              <button onClick={() => setIsForgotModalOpen(false)} className="text-neutral-400 hover:text-neutral-600">
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-neutral-500">Enter your email address to receive password recovery instructions.</p>
            <form onSubmit={(e) => { e.preventDefault(); setIsForgotModalOpen(false); showToast(`Password recovery link sent to ${forgotEmail || identifier}!`, 'info'); }} className="space-y-3">
              <input type="email" required placeholder="Enter registered email" value={forgotEmail || identifier} onChange={(e) => setForgotEmail(e.target.value)} className="w-full px-2.5 py-1.5 bg-neutral-50 border border-neutral-200 rounded-sm text-xs font-mono" />
              <div className="pt-2 flex gap-2 justify-end">
                <button type="button" onClick={() => setIsForgotModalOpen(false)} className="px-3 py-1.5 border border-neutral-200 text-xs rounded-sm hover:bg-neutral-50">Cancel</button>
                <button type="submit" className="px-4 py-1.5 bg-neutral-900 text-white text-xs font-semibold rounded-sm hover:bg-neutral-800">Send Link</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
