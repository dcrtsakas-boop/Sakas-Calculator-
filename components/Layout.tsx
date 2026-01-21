
import React from 'react';
import { AppMode } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  mode: AppMode;
  setMode: (mode: AppMode) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, mode, setMode }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-green-900 bg-black/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#22C55E] rounded flex items-center justify-center shadow-[0_0_15px_rgba(34,197,94,0.5)]">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
            <h1 className="text-2xl font-black tracking-tighter text-[#22C55E] neon-glow uppercase">CALCULATOR<span className="text-white ml-1">AI</span></h1>
          </div>
          
          <nav className="flex bg-green-950/30 p-1 rounded-lg border border-green-900/50 flex-wrap justify-center">
            <button 
              onClick={() => setMode('ANALYZE')}
              className={`px-4 md:px-6 py-2 rounded-md transition-all duration-300 font-bold text-xs md:text-sm ${mode === 'ANALYZE' ? 'bg-[#22C55E] text-black shadow-[0_0_10px_rgba(34,197,94,0.4)]' : 'text-[#22C55E] hover:text-green-400'}`}
            >
              ANALYSER
            </button>
            <button 
              onClick={() => setMode('CALCULATE')}
              className={`px-4 md:px-6 py-2 rounded-md transition-all duration-300 font-bold text-xs md:text-sm ${mode === 'CALCULATE' ? 'bg-[#22C55E] text-black shadow-[0_0_10px_rgba(34,197,94,0.4)]' : 'text-[#22C55E] hover:text-green-400'}`}
            >
              BESOINS
            </button>
            <button 
              onClick={() => setMode('HISTORY')}
              className={`px-4 md:px-6 py-2 rounded-md transition-all duration-300 font-bold text-xs md:text-sm ${mode === 'HISTORY' ? 'bg-[#22C55E] text-black shadow-[0_0_10px_rgba(34,197,94,0.4)]' : 'text-[#22C55E] hover:text-green-400'}`}
            >
              HISTORIQUE
            </button>
          </nav>
        </div>
      </header>

      <div className="flex-1 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-green-950/20 via-black to-black">
        {children}
      </div>

      <footer className="border-t border-green-900/30 py-6 bg-black text-center text-green-900 text-xs font-mono uppercase tracking-widest">
        &copy; {new Date().getFullYear()} CALCULATOR AI • INTERFACE TERMINAL v1.2.0
      </footer>
    </div>
  );
};

export default Layout;
