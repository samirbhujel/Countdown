
import React from 'react';
import { TimeRemaining } from '../types';

interface ClockProps {
  time: TimeRemaining;
}

const TimeUnit: React.FC<{ value: number; label: string }> = ({ value, label }) => (
  <div className="flex flex-col items-center mx-2 sm:mx-6">
    <div className="relative group">
      <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
      <div className="relative bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-4 sm:p-8 w-20 sm:w-32 h-24 sm:h-40 flex items-center justify-center shadow-2xl">
        <span className="text-4xl sm:text-7xl font-extrabold text-white tabular-nums drop-shadow-sm">
          {value.toString().padStart(2, '0')}
        </span>
      </div>
    </div>
    <span className="mt-4 text-xs sm:text-sm font-semibold tracking-[0.2em] uppercase text-gray-400">
      {label}
    </span>
  </div>
);

const Clock: React.FC<ClockProps> = ({ time }) => {
  return (
    <div className="flex flex-wrap justify-center items-center gap-2">
      <TimeUnit value={time.days} label="Days" />
      <TimeUnit value={time.hours} label="Hours" />
      <TimeUnit value={time.minutes} label="Minutes" />
      <TimeUnit value={time.seconds} label="Seconds" />
    </div>
  );
};

export default Clock;
