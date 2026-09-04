import React from 'react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import {
  Sparkles,
  MapPin,
  Phone,
  Mail,
  ShieldCheck,
  Clock,
  Compass,
  Scissors,
  Heart,
  ArrowUpRight,
  Award
} from 'lucide-react';

export const Footer: React.FC = () => {
  const { setCurrentView, setIsSqlDocsOpen } = useApp();
  const { switchRole } = useAuth();

  return (
    <footer className="border-t border-neutral-800 bg-neutral-950 text-neutral-300 font-sans relative overflow-hidden">
      {/* Subtle Amber Ambient Light Accent */}
      <div className="absolute top-0 right-1/3 w-80 h-32 bg-amber-500/10 blur-3xl pointer-events-none rounded-full" />
      <div className="absolute bottom-0 left-1/4 w-72 h-32 bg-rose-500/5 blur-3xl pointer-events-none rounded-full" />

      {/* Main Footer Container */}
      <div className="max-w-7xl mx-auto px-6 lg:px-10 pt-14 pb-8 relative z-10">
        
        {/* Top Grid: Brand, Quick Links, Hubs & Guarantee */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-white/10">
          
          {/* Brand & Mission (Col 1 & 2) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
              <span className="text-xl font-bold tracking-tight text-white font-sans">
                AZHAGU
              </span>
            </div>
            
            <p className="text-xs sm:text-sm text-neutral-400 font-normal leading-relaxed max-w-sm">
              South India’s premier salon discovery and Muhurtham temple bridal booking platform. Connecting authentic stylists, herbal wellness spas, and luxury groomers across Tamil Nadu.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xs bg-white/5 border border-white/10 text-[11px] text-emerald-400 font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                Live Slot Engine · Zero Double-Booking
              </div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xs bg-amber-500/10 border border-amber-400/20 text-[11px] text-amber-300 font-mono">
                <Award className="w-3.5 h-3.5 text-amber-400" />
                Verified Stylists Only
              </div>
            </div>
          </div>

          {/* Column 3: Quick Navigation */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono font-semibold uppercase tracking-wider text-white">
              Explore & Book
            </h4>
            <ul className="space-y-2 text-xs text-neutral-400">
              <li>
                <button
                  onClick={() => {
                    setCurrentView('MARKETING');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-amber-300 transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <span>Home Overview</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setCurrentView('DISCOVER');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-amber-300 transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <Compass className="w-3.5 h-3.5 text-amber-400" />
                  <span>Find Salons & Studios</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setCurrentView('MY_BOOKINGS');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-amber-300 transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  <span>My Appointments</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    switchRole('SALON_OWNER');
                    setCurrentView('SALON_DASHBOARD');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-amber-300 transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <Scissors className="w-3.5 h-3.5 text-amber-400" />
                  <span>Salon Partner Portal</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Popular Hubs in Tamil Nadu */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono font-semibold uppercase tracking-wider text-white">
              Signature Hubs
            </h4>
            <ul className="space-y-2 text-xs text-neutral-400 font-mono">
              <li className="flex items-center gap-1.5 hover:text-neutral-200 transition-colors">
                <MapPin className="w-3 h-3 text-amber-500 flex-none" />
                <span>Chennai (Anna Nagar, T. Nagar)</span>
              </li>
              <li className="flex items-center gap-1.5 hover:text-neutral-200 transition-colors">
                <MapPin className="w-3 h-3 text-amber-500 flex-none" />
                <span>Coimbatore (R.S. Puram)</span>
              </li>
              <li className="flex items-center gap-1.5 hover:text-neutral-200 transition-colors">
                <MapPin className="w-3 h-3 text-amber-500 flex-none" />
                <span>Madurai (KK Nagar)</span>
              </li>
              <li className="flex items-center gap-1.5 hover:text-neutral-200 transition-colors">
                <MapPin className="w-3 h-3 text-amber-500 flex-none" />
                <span>Trichy & Thanjavur</span>
              </li>
            </ul>
          </div>

          {/* Column 5: Support & Contact */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono font-semibold uppercase tracking-wider text-white">
              Direct Assistance
            </h4>
            <div className="space-y-2.5 text-xs text-neutral-400">
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-amber-400 flex-none" />
                <span>+91 94440 82910</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-amber-400 flex-none" />
                <span>support@azhagusallon.in</span>
              </div>
              <div className="pt-1">
                <button
                  onClick={() => setIsSqlDocsOpen(true)}
                  className="px-2.5 py-1 bg-white/10 hover:bg-white/20 border border-white/10 rounded-xs text-[10px] font-mono text-neutral-300 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Schema & Docs</span>
                  <ArrowUpRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar: Copyright & Tagline */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
          <div className="flex items-center gap-2">
            <span>© {new Date().getFullYear()} AZHAGU Salon OS.</span>
            <span>·</span>
            <span className="flex items-center gap-1 text-neutral-400">
              Crafted with <Heart className="w-3 h-3 text-rose-500 fill-rose-500" /> for Tamil Nadu & South India
            </span>
          </div>

          <div className="flex items-center gap-4 text-neutral-400 font-mono text-[11px]">
            <span className="hover:text-neutral-200 cursor-pointer">Instant Booking</span>
            <span>·</span>
            <span className="hover:text-neutral-200 cursor-pointer">Temple Bridal Verified</span>
            <span>·</span>
            <span className="hover:text-neutral-200 cursor-pointer">100% Privacy</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
