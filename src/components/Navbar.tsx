import React from 'react';
import { Sparkles, BookOpen, ShieldCheck, LogOut, Fish, UtensilsCrossed, Waves } from 'lucide-react';
import { UserProfile } from '../types';

interface NavbarProps {
  user: UserProfile | null;
  activeTab: 'assistant' | 'journal' | 'guide';
  setActiveTab: (tab: 'assistant' | 'journal' | 'guide') => void;
  onOpenSecurity: () => void;
  onSignOut: () => void;
  onSignIn: () => void;
  journalCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  user,
  activeTab,
  setActiveTab,
  onOpenSecurity,
  onSignOut,
  onSignIn,
  journalCount,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-[#FDF8F1]/95 backdrop-blur-md border-b-4 border-[#1A365D] shadow-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
        {/* Brand with Artistic Flair icon */}
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="w-12 h-12 sm:w-14 sm:h-14 bg-[#FF6B6B] rounded-2xl border-3 border-[#1A365D] flex items-center justify-center text-white shadow-[4px_4px_0px_#1A365D] transform -rotate-3 hover:rotate-0 transition-transform">
            <Fish className="w-7 h-7 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tighter text-[#1A365D] font-display">
                Sahabat Sehat
              </h1>
              <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-lg text-[11px] font-black uppercase bg-[#81C784] text-[#1A365D] border-2 border-[#1A365D] transform rotate-1">
                Fase C • Kelas 6
              </span>
            </div>
            <p className="text-xs sm:text-sm font-bold text-[#00796B] flex items-center gap-1.5">
              <Waves className="w-4 h-4 text-[#4DB6AC]" />
              Asisten Nutrisi Pesisir • Pedoman Isi Piringku
            </p>
          </div>
        </div>

        {/* Center Navigation Tabs - Artistic Flair Pill Style */}
        {user && (
          <nav className="hidden md:flex items-center gap-2 bg-[#FFF9C4] p-1.5 rounded-2xl border-3 border-[#1A365D] shadow-[3px_3px_0px_#1A365D]">
            <button
              id="nav-assistant-btn"
              onClick={() => setActiveTab('assistant')}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === 'assistant'
                  ? 'bg-[#4DB6AC] text-white border-2 border-[#1A365D] shadow-[2px_2px_0px_#1A365D] transform -rotate-1'
                  : 'text-[#1A365D] hover:bg-white/80'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              Asisten Gizi
            </button>
            <button
              id="nav-journal-btn"
              onClick={() => setActiveTab('journal')}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === 'journal'
                  ? 'bg-[#4DB6AC] text-white border-2 border-[#1A365D] shadow-[2px_2px_0px_#1A365D] transform rotate-1'
                  : 'text-[#1A365D] hover:bg-white/80'
              }`}
            >
              <UtensilsCrossed className="w-4 h-4" />
              Jurnal Piringku
              {journalCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-[#FF6B6B] text-white font-black border border-[#1A365D]">
                  {journalCount}
                </span>
              )}
            </button>
            <button
              id="nav-guide-btn"
              onClick={() => setActiveTab('guide')}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === 'guide'
                  ? 'bg-[#4DB6AC] text-white border-2 border-[#1A365D] shadow-[2px_2px_0px_#1A365D]'
                  : 'text-[#1A365D] hover:bg-white/80'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              Isi Piringku
            </button>
          </nav>
        )}

        {/* User & Security Actions */}
        <div className="flex items-center gap-3">
          <button
            id="security-threat-model-btn"
            onClick={onOpenSecurity}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black text-[#1A365D] bg-white hover:bg-amber-50 transition-all border-2 border-[#1A365D] shadow-[2px_2px_0px_#1A365D] cursor-pointer"
            title="Lihat Threat Model & OWASP Security"
          >
            <ShieldCheck className="w-4 h-4 text-[#4DB6AC]" />
            <span className="hidden sm:inline">Threat Model</span>
          </button>

          {user ? (
            <div className="flex items-center gap-3 pl-2 border-l-2 border-[#1A365D]">
              <div className="flex items-center gap-2.5 bg-white px-3 py-1.5 rounded-2xl border-2 border-[#1A365D] shadow-[2px_2px_0px_#1A365D] transform rotate-1">
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={user.displayName || 'Siswa'}
                    className="w-9 h-9 rounded-xl border-2 border-[#1A365D] object-cover"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-9 h-9 rounded-xl bg-[#81C784] border-2 border-[#1A365D] flex items-center justify-center font-black text-white text-base">
                    {(user.displayName || 'B')[0].toUpperCase()}
                  </div>
                )}
                <div className="hidden lg:block text-right">
                  <p className="text-[9px] uppercase font-black text-[#00796B] tracking-wider">
                    Petualang Sehat
                  </p>
                  <p className="font-black text-xs text-[#1A365D] truncate max-w-[110px]">
                    {user.displayName?.split(' ')[0] || 'Budi'}
                  </p>
                </div>
              </div>
              <button
                id="signout-btn"
                onClick={onSignOut}
                className="p-2 text-[#1A365D] hover:bg-[#FFEBEE] hover:text-[#D32F2F] rounded-xl border-2 border-[#1A365D] bg-white transition-all shadow-[2px_2px_0px_#1A365D] cursor-pointer"
                title="Keluar / Ganti Akun"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              id="header-login-btn"
              onClick={onSignIn}
              className="flex items-center gap-2 px-4 py-2 bg-[#4DB6AC] text-white rounded-xl text-xs font-black uppercase tracking-wider border-2 border-[#1A365D] shadow-[3px_3px_0px_#1A365D] hover:bg-[#00796B] transition-all cursor-pointer"
            >
              Masuk Google
            </button>
          )}
        </div>
      </div>

      {/* Mobile Tab bar */}
      {user && (
        <div className="md:hidden flex items-center justify-around border-t-2 border-[#1A365D] bg-[#FFF9C4] py-2 px-2">
          <button
            onClick={() => setActiveTab('assistant')}
            className={`flex flex-col items-center py-1 px-3 rounded-xl text-xs font-black uppercase ${
              activeTab === 'assistant'
                ? 'text-white bg-[#4DB6AC] border-2 border-[#1A365D] shadow-[2px_2px_0px_#1A365D]'
                : 'text-[#1A365D]'
            }`}
          >
            <Sparkles className="w-4 h-4 mb-0.5" />
            Asisten
          </button>
          <button
            onClick={() => setActiveTab('journal')}
            className={`flex flex-col items-center py-1 px-3 rounded-xl text-xs font-black uppercase ${
              activeTab === 'journal'
                ? 'text-white bg-[#4DB6AC] border-2 border-[#1A365D] shadow-[2px_2px_0px_#1A365D]'
                : 'text-[#1A365D]'
            }`}
          >
            <UtensilsCrossed className="w-4 h-4 mb-0.5" />
            Jurnal ({journalCount})
          </button>
          <button
            onClick={() => setActiveTab('guide')}
            className={`flex flex-col items-center py-1 px-3 rounded-xl text-xs font-black uppercase ${
              activeTab === 'guide'
                ? 'text-white bg-[#4DB6AC] border-2 border-[#1A365D] shadow-[2px_2px_0px_#1A365D]'
                : 'text-[#1A365D]'
            }`}
          >
            <BookOpen className="w-4 h-4 mb-0.5" />
            Isi Piringku
          </button>
        </div>
      )}
    </header>
  );
};
