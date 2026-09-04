import React from 'react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { Smartphone, X, Star, Calendar, Scissors, CheckCircle2, ShieldCheck } from 'lucide-react';

export const MobileSimulatorModal: React.FC = () => {
  const { isMobileSimulatorOpen, setIsMobileSimulatorOpen, salons, services, staff, setCurrentView } = useApp();
  const { currentUser, role } = useAuth();

  if (!isMobileSimulatorOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-neutral-900 border border-neutral-800 shadow-2xl rounded-3xl w-full max-w-sm overflow-hidden text-white flex flex-col h-[750px] relative">
        {/* Top Mobile Phone Speaker Notch */}
        <div className="h-6 bg-neutral-950 flex items-center justify-center relative flex-none">
          <div className="w-16 h-3 bg-neutral-800 rounded-full" />
          <button
            onClick={() => setIsMobileSimulatorOpen(false)}
            className="absolute right-3 top-1 text-neutral-400 hover:text-white p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Mobile Header Bar */}
        <div className="p-4 bg-neutral-900 border-b border-neutral-800 flex items-center justify-between flex-none">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-white text-neutral-950 flex items-center justify-center font-bold text-xs">
              AZ
            </div>
            <div>
              <h3 className="text-xs font-bold tracking-tight">AZHAGU MOBILE APP</h3>
              <p className="text-[9px] text-emerald-400 font-mono flex items-center gap-1">
                <ShieldCheck className="w-2.5 h-2.5" /> Shared REST API Connected
              </p>
            </div>
          </div>
          <span className="px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded text-[9px] font-mono">
            {role}
          </span>
        </div>

        {/* Scrollable Mobile App Screen */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs font-sans">
          {/* Welcome Banner */}
          <div className="p-3.5 bg-gradient-to-br from-neutral-800 to-neutral-900 border border-neutral-700/50 rounded-xl space-y-1">
            <span className="text-[10px] text-neutral-400 uppercase font-mono">Mobile Customer App</span>
            <h4 className="text-sm font-bold text-white">Hello, {currentUser?.full_name || 'Guest'} 👋</h4>
            <p className="text-[11px] text-neutral-300">Book traditional Tamil Nadu bridal salons & styling instantly.</p>
          </div>

          {/* Salons Stream (Shared REST API Data) */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-neutral-200 uppercase tracking-wider">Top Salons Near You</span>
              <span className="text-[10px] text-emerald-400 font-mono">API Sync Active</span>
            </div>

            {salons.map((s) => (
              <div key={s.id} className="p-3 bg-neutral-800/80 border border-neutral-700/60 rounded-xl space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <h5 className="font-bold text-white leading-tight">{s.name}</h5>
                    <p className="text-[10px] text-neutral-400">{s.city}, {s.state}</p>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-0.5">
                    <Star className="w-3 h-3 fill-emerald-400 text-emerald-400" /> {s.rating}
                  </span>
                </div>

                <div className="flex items-center justify-between pt-1 border-t border-neutral-700/40 text-[10px]">
                  <span className="text-neutral-400">{services.filter((srv) => srv.salon_id === s.id).length} Services Available</span>
                  <button
                    onClick={() => {
                      setIsMobileSimulatorOpen(false);
                      setCurrentView('DISCOVER');
                    }}
                    className="px-2.5 py-1 bg-white text-neutral-950 font-bold rounded-lg hover:bg-neutral-200 transition-colors"
                  >
                    Book Now
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Stylists */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-neutral-200 uppercase tracking-wider">Verified Stylists</span>
            <div className="grid grid-cols-2 gap-2">
              {staff.map((st) => (
                <div key={st.id} className="p-2.5 bg-neutral-800/60 border border-neutral-700/40 rounded-xl text-center space-y-1">
                  <img src={st.avatar_url} alt={st.display_name} className="w-10 h-10 rounded-full mx-auto object-cover border border-neutral-600" />
                  <p className="font-bold text-[11px] text-white truncate">{st.display_name}</p>
                  <p className="text-[9px] text-neutral-400 truncate">{st.specialization}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile Bottom Navigation Bar */}
        <div className="h-14 bg-neutral-950 border-t border-neutral-800 flex items-center justify-around flex-none px-4 text-[10px]">
          <button onClick={() => { setIsMobileSimulatorOpen(false); setCurrentView('MARKETING'); }} className="flex flex-col items-center text-neutral-400 hover:text-white">
            <Scissors className="w-4 h-4" />
            <span>Home</span>
          </button>
          <button onClick={() => { setIsMobileSimulatorOpen(false); setCurrentView('DISCOVER'); }} className="flex flex-col items-center text-emerald-400">
            <Smartphone className="w-4 h-4" />
            <span>Explore</span>
          </button>
          <button onClick={() => { setIsMobileSimulatorOpen(false); setCurrentView('MY_BOOKINGS'); }} className="flex flex-col items-center text-neutral-400 hover:text-white">
            <Calendar className="w-4 h-4" />
            <span>Bookings</span>
          </button>
        </div>
      </div>
    </div>
  );
};
