import React from 'react';

export const HeartPulseLogo = ({ className = "w-6 h-6 text-white" }) => {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {/* Steady Heart Outline */}
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" opacity="0.85" />
      
      {/* Animated Pulse Line Inside Heart */}
      <path
        d="M3.5 12h5.5l.6-1.5 1.8 4.5 1.8-7.5 1.5 4.5h5.8"
        className="animate-ecg-pulse"
        strokeDasharray="30"
        strokeDashoffset="30"
      />
    </svg>
  );
};
