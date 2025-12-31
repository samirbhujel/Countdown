
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { MESSAGES, CHURCH_NAME } from './constants';
import { TimeRemaining, Quote } from './types';
import Clock from './components/Clock';
import Fireworks from './components/Fireworks';
import { getInspirationalQuote } from './services/geminiService';

const App: React.FC = () => {
  const [targetDate] = useState(() => {
    const nextYear = new Date().getFullYear() + 1;
    return new Date(`January 1, ${nextYear} 00:00:00`).getTime();
  });

  const [timeLeft, setTimeLeft] = useState<TimeRemaining>({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isNewYear, setIsNewYear] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [quote, setQuote] = useState<Quote | null>(null);
  const [showTestButton, setShowTestButton] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  const calculateTimeLeft = useCallback(() => {
    const now = new Date().getTime();
    const difference = targetDate - now;

    if (difference <= 0) {
      setIsNewYear(true);
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
      minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
      seconds: Math.floor((difference % (1000 * 60)) / 1000),
    };
  }, [targetDate]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    const fetchQuote = async () => {
      const data = await getInspirationalQuote();
      setQuote(data);
    };
    fetchQuote();

    return () => clearInterval(timer);
  }, [calculateTimeLeft]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable full-screen mode: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  };

  const triggerTestMode = () => {
    setIsNewYear(true);
    setShowTestButton(false);
  };

  return (
    <div 
      ref={containerRef}
      className={`relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden transition-colors duration-1000 ${
        isNewYear ? 'bg-black' : 'bg-[#050505]'
      }`}
    >
      {/* Dynamic Background Elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-900 rounded-full blur-[128px] animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-900 rounded-full blur-[128px] animate-pulse delay-700"></div>
      </div>

      {/* Header - Hidden in Fullscreen */}
      {!isFullscreen && (
        <header className="absolute top-0 w-full p-8 flex justify-between items-center z-50">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg flex items-center justify-center shadow-lg transform rotate-45">
               <span className="text-white font-bold -rotate-45">A</span>
            </div>
            <h1 className="text-xl font-bold tracking-tight text-white/90 uppercase">{CHURCH_NAME}</h1>
          </div>
          <button 
            onClick={toggleFullscreen}
            className="px-4 py-2 bg-white/5 hover:bg-white/10 backdrop-blur-md border border-white/10 rounded-full text-white/80 text-sm font-medium transition-all"
          >
            Enter Fullscreen
          </button>
        </header>
      )}

      {/* Main Content */}
      <main className="relative z-10 flex flex-col items-center text-center px-4 max-w-5xl">
        {!isNewYear ? (
          <>
            <div className="mb-12">
              <span className="inline-block px-4 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-bold tracking-[0.3em] uppercase mb-4 animate-bounce">
                Countdown to New Year
              </span>
              <h2 className="text-5xl sm:text-7xl font-extrabold text-white tracking-tight mb-2">
                A New Beginning
              </h2>
              <p className="text-white/40 text-sm sm:text-lg max-w-lg mx-auto leading-relaxed">
                Join us as we count down to a year of growth, grace, and new possibilities in the presence of God.
              </p>
            </div>

            <Clock time={timeLeft} />

            {quote && (
              <div className="mt-16 max-w-2xl transform transition-all duration-1000 hover:scale-105">
                <p className="text-white/60 italic text-lg mb-2">"{quote.english}"</p>
                <p className="text-white/60 text-lg mb-4 font-['Noto_Sans_Devanagari']">"{quote.nepali}"</p>
                <p className="text-purple-400 font-bold uppercase text-xs tracking-widest">— {quote.reference}</p>
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center animate-fadeIn">
            <Fireworks />
            <div className="z-20 text-center space-y-8 animate-bounceIn">
              <h2 className="text-3xl sm:text-5xl font-['Noto_Sans_Devanagari'] font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-yellow-400 to-yellow-600 drop-shadow-2xl">
                {MESSAGES.NEPALI}
              </h2>
              <h2 className="text-4xl sm:text-6xl font-black text-white tracking-tight drop-shadow-lg">
                {MESSAGES.ENGLISH}
              </h2>
              <h3 className="text-2xl sm:text-3xl font-medium text-white/70 italic">
                {MESSAGES.ROMAN_NEPALI}
              </h3>
              
              <div className="pt-12">
                 <div className="h-px w-24 bg-gradient-to-r from-transparent via-purple-500 to-transparent mx-auto mb-6"></div>
                 <p className="text-purple-300 font-semibold tracking-widest text-sm uppercase">Blessings from {CHURCH_NAME}</p>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Floating UI Elements */}
      {isFullscreen && (
        <button 
          onClick={toggleFullscreen}
          className="fixed bottom-8 right-8 p-4 bg-white/5 hover:bg-white/10 backdrop-blur-md rounded-full text-white/40 hover:text-white transition-all z-50 group"
          title="Exit Fullscreen"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}

      {/* Test Button - For Demo purposes */}
      {showTestButton && !isNewYear && (
        <button 
          onClick={triggerTestMode}
          className="fixed bottom-8 left-8 px-4 py-2 text-[10px] uppercase tracking-widest bg-red-500/20 text-red-400 border border-red-500/30 rounded hover:bg-red-500/30 transition-all z-50"
        >
          Test Midnight Effect
        </button>
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes bounceIn {
          0% { transform: scale(0.3); opacity: 0; }
          50% { transform: scale(1.05); opacity: 1; }
          70% { transform: scale(0.9); }
          100% { transform: scale(1); }
        }
        .animate-fadeIn { animation: fadeIn 2s ease-out forwards; }
        .animate-bounceIn { animation: bounceIn 1.2s cubic-bezier(0.215, 0.61, 0.355, 1) forwards; }
      `}</style>
    </div>
  );
};

export default App;
