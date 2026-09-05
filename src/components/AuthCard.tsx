import React from 'react';
import { Fish, ShieldCheck, Sparkles, Utensils, CheckCircle2, Waves, HeartHandshake, ArrowRight } from 'lucide-react';

interface AuthCardProps {
  onGoogleSignIn: () => void;
  onDemoSignIn: () => void;
  loading: boolean;
  error?: string | null;
}

export const AuthCard: React.FC<AuthCardProps> = ({
  onGoogleSignIn,
  onDemoSignIn,
  loading,
  error,
}) => {
  return (
    <div className="max-w-4xl mx-auto px-2 sm:px-4 py-6">
      {/* Outer Comic/Artistic Frame */}
      <div className="bg-[#FDF8F1] rounded-[36px] sm:rounded-[44px] border-[8px] sm:border-[12px] border-[#81C784] shadow-[12px_12px_0px_#1A365D] overflow-hidden">
        {/* Banner Section */}
        <div className="relative bg-[#E0F2F1] p-6 sm:p-10 text-[#1A365D] border-b-4 border-[#1A365D] overflow-hidden">
          <div className="absolute -right-8 -bottom-8 opacity-10 pointer-events-none transform -rotate-12">
            <Fish className="w-72 h-72 text-[#00796B]" />
          </div>

          <div className="max-w-2xl relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-[#FFF9C4] text-[#1A365D] text-xs font-black uppercase tracking-wider mb-3 border-2 border-[#1A365D] shadow-[2px_2px_0px_#1A365D] transform -rotate-2">
              <Sparkles className="w-3.5 h-3.5 text-[#F9A825]" />
              PJOK Kelas 6 SD • Kurikulum Merdeka
            </div>

            <div className="flex items-center gap-4 mb-3">
              <div className="w-14 h-14 bg-[#FF6B6B] rounded-full border-3 border-[#1A365D] flex items-center justify-center text-white shadow-[4px_4px_0px_#1A365D] transform -rotate-6">
                <Fish className="w-8 h-8 stroke-[2.5]" />
              </div>
              <div>
                <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tighter text-[#1A365D] font-display">
                  Sahabat Sehat
                </h1>
                <p className="text-xs sm:text-sm font-bold text-[#00796B]">
                  Asisten Nutrisi Pesisir • Petualang Gizi Cilik
                </p>
              </div>
            </div>

            <p className="text-sm sm:text-base text-[#1A365D] font-semibold leading-relaxed mb-6 bg-white/70 p-3.5 rounded-2xl border-2 border-[#1A365D] shadow-[3px_3px_0px_#1A365D]">
              Hai teman-teman pesisir! Yuk jadi detektif gizi: foto tabel kemasan camilanmu, cari tahu gizinya dengan <strong>Gemini Vision</strong>, lalu lengkapi piringmu dengan lezatnya ikan kembung, tongkol, dan daun kelor!
            </p>

            <div className="flex flex-wrap gap-2.5 text-xs font-black">
              <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-xl border-2 border-[#1A365D] shadow-[2px_2px_0px_#1A365D]">
                <CheckCircle2 className="w-4 h-4 text-[#81C784]" />
                Patokan 1x Makan ~30% AKG
              </div>
              <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-xl border-2 border-[#1A365D] shadow-[2px_2px_0px_#1A365D]">
                <CheckCircle2 className="w-4 h-4 text-[#4DB6AC]" />
                Gemini Multimodal Vision
              </div>
              <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-xl border-2 border-[#1A365D] shadow-[2px_2px_0px_#1A365D]">
                <CheckCircle2 className="w-4 h-4 text-[#FF6B6B]" />
                Privasi Siswa Firestore
              </div>
            </div>
          </div>
        </div>

        {/* Content & Sign In Form */}
        <div className="p-6 sm:p-10 grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8 items-center bg-[#FDF8F1]">
          <div className="md:col-span-7 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-[#FFF9C4] border-2 border-[#1A365D] flex items-center justify-center text-[#F9A825] shadow-[2px_2px_0px_#1A365D]">
                <HeartHandshake className="w-5 h-5" />
              </div>
              <h2 className="text-lg sm:text-xl font-black text-[#1A365D] uppercase tracking-tight font-display">
                Tutor Ramah Tanpa Menghakimi
              </h2>
            </div>

            <p className="text-xs sm:text-sm text-[#1A365D]/80 leading-relaxed font-medium">
              Semua makanan bisa kita pelajari bersama secara asyik! Tidak perlu takut salah. Kita akan menghitung berapa persen zat gizi yang sudah ada di kemasan, lalu memilih makanan pendamping dari laut kita.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="p-3.5 rounded-2xl bg-white border-3 border-[#1A365D] shadow-[3px_3px_0px_#1A365D] transform -rotate-1">
                <div className="text-xs font-black text-[#00796B] mb-1 flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-lg bg-[#E0F2F1] border border-[#1A365D] text-[#1A365D] flex items-center justify-center text-[10px] font-black">1</span>
                  Foto Nilai Gizi
                </div>
                <div className="text-[11px] text-slate-600 font-bold">Membaca Karbohidrat, Lemak, Natrium, & Protein.</div>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#FFF9C4] border-3 border-[#FBC02D] shadow-[3px_3px_0px_#1A365D] transform rotate-1">
                <div className="text-xs font-black text-[#F9A825] mb-1 flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-lg bg-white border border-[#FBC02D] text-[#1A365D] flex items-center justify-center text-[10px] font-black">2</span>
                  Hitung Defisit 30%
                </div>
                <div className="text-[11px] text-slate-700 font-bold">Kalkulator interaktif selisih gizi yang seru.</div>
              </div>

              <div className="p-3.5 rounded-2xl bg-white border-3 border-[#81C784] shadow-[3px_3px_0px_#1A365D] transform rotate-1">
                <div className="text-xs font-black text-[#00796B] mb-1 flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-lg bg-[#81C784] border border-[#1A365D] text-white flex items-center justify-center text-[10px] font-black">3</span>
                  Pangan Laut Pesisir
                </div>
                <div className="text-[11px] text-slate-600 font-bold">Ikan kembung, cakalang & kuah asam segar.</div>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#FFEBEE] border-3 border-[#FF6B6B] shadow-[3px_3px_0px_#1A365D] transform -rotate-1">
                <div className="text-xs font-black text-[#D32F2F] mb-1 flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-lg bg-[#FF6B6B] text-white flex items-center justify-center text-[10px] font-black">4</span>
                  Jurnal Piring Sehat
                </div>
                <div className="text-[11px] text-slate-700 font-bold">Tersimpan aman di akun Firestore pribadimu.</div>
              </div>
            </div>
          </div>

          {/* Login Card */}
          <div className="md:col-span-5 bg-white p-6 sm:p-7 rounded-[28px] border-4 border-[#1A365D] shadow-[8px_8px_0px_#1A365D] text-center space-y-4">
            <div className="w-14 h-14 bg-[#FFF9C4] text-[#1A365D] rounded-2xl border-3 border-[#1A365D] flex items-center justify-center mx-auto mb-2 shadow-[3px_3px_0px_#1A365D] transform -rotate-3">
              <Utensils className="w-7 h-7" />
            </div>

            <div>
              <h3 className="text-xl font-black uppercase text-[#1A365D] font-display tracking-tight">
                Mulai Berpetualang!
              </h3>
              <p className="text-xs font-bold text-slate-500 mt-0.5">
                Masuk untuk menyimpan jurnal piring sehatmu
              </p>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-[#FFEBEE] border-2 border-[#D32F2F] text-xs font-bold text-[#D32F2F] text-left">
                {error}
              </div>
            )}

            <button
              id="google-signin-btn"
              onClick={onGoogleSignIn}
              disabled={loading}
              className="w-full py-3.5 px-4 bg-white hover:bg-amber-50 border-3 border-[#1A365D] text-[#1A365D] rounded-2xl font-black text-sm shadow-[4px_4px_0px_#1A365D] active:translate-y-1 active:shadow-[1px_1px_0px_#1A365D] transition-all flex items-center justify-center gap-3 disabled:opacity-50 cursor-pointer"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>{loading ? 'Menghubungkan...' : 'Masuk dengan Google'}</span>
            </button>

            <div className="relative flex items-center justify-center my-2">
              <div className="border-t-2 border-[#1A365D] w-full"></div>
              <span className="bg-white px-2 text-[10px] font-black uppercase text-slate-500 tracking-wider">
                atau mode kelas
              </span>
            </div>

            <button
              id="demo-student-signin-btn"
              onClick={onDemoSignIn}
              className="w-full py-3 px-4 bg-[#81C784] hover:bg-[#66BB6A] text-[#1A365D] border-3 border-[#1A365D] rounded-2xl font-black text-xs shadow-[4px_4px_0px_#1A365D] active:translate-y-1 active:shadow-[1px_1px_0px_#1A365D] transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>Uji Coba Cepat (Budi Hartono)</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="flex items-center justify-center gap-1.5 text-[11px] font-bold text-slate-500 pt-1">
              <ShieldCheck className="w-4 h-4 text-[#00796B]" />
              <span>Privasi Terisolasi di Cloud Firestore</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
