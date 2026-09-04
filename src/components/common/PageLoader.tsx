import React from 'react';

interface PageLoaderProps {
  isLoading: boolean;
  message?: string;
}

export const PageLoader: React.FC<PageLoaderProps> = ({ isLoading, message = 'Loading AZHAGU Platform...' }) => {
  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-neutral-950/90 backdrop-blur-md transition-opacity duration-300 animate-in fade-in">
      {/* Background Ambient Glow */}
      <div className="absolute w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute w-60 h-60 bg-rose-500/10 rounded-full blur-3xl pointer-events-none animate-pulse delay-300" />

      {/* Main Loader Container */}
      <div className="relative z-10 flex flex-col items-center max-w-sm px-6 text-center">
        {/* Glowing Logo Circle */}
        <div className="relative mb-6 group">
          <div className="absolute -inset-2 rounded-2xl bg-gradient-to-r from-amber-500/30 via-rose-500/30 to-amber-500/30 blur-lg animate-pulse" />
          <div className="relative bg-neutral-900 border border-neutral-800 p-5 rounded-2xl shadow-2xl flex items-center justify-center">
            <img
              src="/azhagu-logo.png"
              alt="AZHAGU Logo"
              className="h-16 w-auto object-contain animate-pulse"
            />
          </div>
        </div>

        {/* Loading Text */}
        <h3 className="text-sm font-semibold tracking-wider text-neutral-200 uppercase mb-2">
          {message}
        </h3>
        
        {/* Shimmering Progress Bar */}
        <div className="w-48 h-1 bg-neutral-800 rounded-full overflow-hidden relative mt-1">
          <div className="absolute inset-y-0 bg-gradient-to-r from-amber-500 via-rose-400 to-amber-500 rounded-full w-full animate-[shimmer_1.5s_infinite] -translate-x-full" />
        </div>

        <p className="text-[11px] text-neutral-500 mt-3 font-mono">
          Muhurtham Bridal & Grooming Platform
        </p>
      </div>

      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
};
