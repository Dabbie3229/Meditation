import React from 'react';
import { Wifi, Battery } from 'lucide-react';

interface TopStatusBarProps {
  darkText?: boolean;
}

export const TopStatusBar: React.FC<TopStatusBarProps> = ({ darkText = true }) => {
  return (
    <div
      className={`w-full flex items-center justify-between px-6 pt-3 pb-1 text-xs font-semibold select-none z-30 transition-colors ${
        darkText ? 'text-slate-800 dark:text-slate-200' : 'text-white'
      }`}
    >
      <span className="font-medium tracking-tight">9:41</span>
      
      {/* Cellular + Wifi + Battery */}
      <div className="flex items-center gap-1.5">
        <svg
          className="w-4 h-3 fill-current"
          viewBox="0 0 17 11"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect x="0" y="8" width="3" height="3" rx="0.5" />
          <rect x="4.5" y="5.5" width="3" height="5.5" rx="0.5" />
          <rect x="9" y="3" width="3" height="8" rx="0.5" />
          <rect x="13.5" y="0" width="3" height="11" rx="0.5" />
        </svg>
        <Wifi className="w-3.5 h-3.5" strokeWidth={2.5} />
        <div className="flex items-center">
          <Battery className="w-5 h-5 -rotate-90" strokeWidth={2} />
        </div>
      </div>
    </div>
  );
};
