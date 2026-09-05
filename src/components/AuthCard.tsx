import React, { useState } from 'react';
import {
  Fish,
  ShieldCheck,
  Sparkles,
  Utensils,
  CheckCircle2,
  HeartHandshake,
  ArrowRight,
  Backpack,
  GraduationCap,
  Lock,
  Eye,
  EyeOff,
  ShieldAlert,
  KeyRound,
  LayoutDashboard,
  Bell,
  Users,
} from 'lucide-react';

interface AuthCardProps {
  onGoogleSignIn: (role?: 'student' | 'teacher', teacherPin?: string) => void;
  onDemoSignIn: (role?: 'student' | 'teacher', teacherPin?: string) => void;
  loading: boolean;
  error?: string | null;
}

export const AuthCard: React.FC<AuthCardProps> = ({
  onGoogleSignIn,
  onDemoSignIn,
  loading,
  error,
}) => {
  // Pre-Login Role Selection: 'student' (default) vs 'teacher'
  const [selectedRole, setSelectedRole] = useState<'student' | 'teacher'>('student');
  
  // Teacher verification credential / PIN state
  const [teacherPin, setTeacherPin] = useState<string>('');
  const [showPin, setShowPin] = useState<boolean>(false);
  const [pinError, setPinError] = useState<string | null>(null);

  const VALID_TEACHER_PINS = ['GURU2026', '772601', 'UKS2026'];

  // Handle Google Sign In with role awareness and teacher PIN check
  const handleRoleGoogleSignIn = () => {
    setPinError(null);
    if (selectedRole === 'teacher') {
      const trimmedPin = teacherPin.trim().toUpperCase();
      if (!trimmedPin) {
        setPinError('Harap masukkan PIN Otorisasi Guru terlebih dahulu.');
        return;
      }
      if (!VALID_TEACHER_PINS.includes(trimmedPin)) {
        setPinError('PIN Guru tidak valid. Gunakan PIN resmi (Demo: GURU2026).');
        return;
      }
      onGoogleSignIn('teacher', trimmedPin);
    } else {
      onGoogleSignIn('student');
    }
  };

  // Handle Demo Fast Sign In with role awareness and teacher PIN check
  const handleRoleDemoSignIn = (role: 'student' | 'teacher') => {
    setPinError(null);
    if (role === 'teacher') {
      const trimmedPin = teacherPin.trim().toUpperCase() || 'GURU2026';
      if (teacherPin.trim() && !VALID_TEACHER_PINS.includes(teacherPin.trim().toUpperCase())) {
        setPinError('PIN Guru tidak valid. Gunakan PIN resmi (Demo: GURU2026).');
        return;
      }
      onDemoSignIn('teacher', trimmedPin);
    } else {
      onDemoSignIn('student');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-2 sm:px-4 py-4 sm:py-6 space-y-6">
      {/* 1. Pre-Login Role Selector Section (Directive 1) */}
      <div className="bg-white p-4 sm:p-6 rounded-[28px] border-4 border-[#1A365D] shadow-[6px_6px_0px_#1A365D]">
        <div className="text-center mb-4 sm:mb-5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-[#FFF9C4] text-[#1A365D] text-xs font-black uppercase tracking-wider mb-1.5 border-2 border-[#1A365D] shadow-[2px_2px_0px_#1A365D]">
            <Users className="w-3.5 h-3.5 text-[#F9A825]" />
            Langkah 1: Pilih Peran Pengguna Sebelum Masuk
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-[#1A365D] uppercase tracking-tight font-display">
            Siapakah Kamu Hari Ini?
          </h2>
          <p className="text-xs sm:text-sm font-semibold text-slate-600 max-w-lg mx-auto">
            Pilih peranmu untuk masuk ke ruang belajar gizi anak atau dasbor pemantauan kesehatan kelas.
          </p>
        </div>

        {/* 2 Role Choice Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Card A: Siswa (Kelas 6 SD) */}
          <button
            id="role-selector-student-btn"
            type="button"
            onClick={() => {
              setSelectedRole('student');
              setPinError(null);
            }}
            className={`relative text-left p-5 sm:p-6 rounded-2xl border-4 transition-all cursor-pointer flex flex-col justify-between ${
              selectedRole === 'student'
                ? 'bg-[#E8F5E9] border-[#2E7D32] shadow-[6px_6px_0px_#2E7D32] ring-4 ring-[#81C784]/40 transform -translate-y-1'
                : 'bg-[#FDF8F1] border-[#1A365D] shadow-[3px_3px_0px_#1A365D] hover:bg-[#FFF9C4]/60'
            }`}
          >
            {selectedRole === 'student' && (
              <span className="absolute -top-3 right-4 px-3 py-0.5 bg-[#2E7D32] text-white text-[10px] font-black uppercase tracking-wider rounded-full border-2 border-[#1A365D] shadow-[2px_2px_0px_#1A365D]">
                ✓ Peran Aktif
              </span>
            )}

            <div>
              <div className="flex items-center gap-3.5 mb-3">
                <div className="w-14 h-14 bg-[#81C784] rounded-2xl border-3 border-[#1A365D] flex items-center justify-center text-white shadow-[3px_3px_0px_#1A365D] transform -rotate-3">
                  <Backpack className="w-7 h-7 stroke-[2.5]" />
                </div>
                <div>
                  <div className="inline-block px-2 py-0.5 bg-[#FFF9C4] border border-[#1A365D] rounded-md text-[10px] font-black text-[#1A365D] uppercase tracking-wider mb-0.5">
                    Fase C SD Pesisir
                  </div>
                  <h3 className="text-lg sm:text-xl font-black text-[#1A365D] uppercase tracking-tight font-display">
                    Siswa (Kelas 6 SD)
                  </h3>
                </div>
              </div>

              <p className="text-xs text-[#1A365D]/80 font-bold leading-relaxed mb-3">
                Akses penuh ke <strong>AI Nutrition Tutor</strong> ramah anak untuk memindai tabel nilai gizi camilan, menghitung defisit target 30% AKG, dan memilih lauk ikan pesisir.
              </p>
            </div>

            <div className="pt-2 border-t-2 border-[#1A365D]/20 flex items-center justify-between text-xs font-black text-[#2E7D32]">
              <span className="flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                Petualang Gizi Cilik
              </span>
              <span className="text-[11px] underline">Masuk Belajar →</span>
            </div>
          </button>

          {/* Card B: Guru / Pembina UKS */}
          <button
            id="role-selector-teacher-btn"
            type="button"
            onClick={() => {
              setSelectedRole('teacher');
              setPinError(null);
            }}
            className={`relative text-left p-5 sm:p-6 rounded-2xl border-4 transition-all cursor-pointer flex flex-col justify-between ${
              selectedRole === 'teacher'
                ? 'bg-[#0F172A] text-white border-[#D97706] shadow-[6px_6px_0px_#D97706] ring-4 ring-[#F59E0B]/40 transform -translate-y-1'
                : 'bg-slate-50 border-[#1A365D] shadow-[3px_3px_0px_#1A365D] hover:bg-slate-100'
            }`}
          >
            {selectedRole === 'teacher' && (
              <span className="absolute -top-3 right-4 px-3 py-0.5 bg-[#D97706] text-white text-[10px] font-black uppercase tracking-wider rounded-full border-2 border-white shadow-[2px_2px_0px_#000]">
                ✓ Peran Aktif
              </span>
            )}

            <div>
              <div className="flex items-center gap-3.5 mb-3">
                <div className="w-14 h-14 bg-[#1E293B] border-3 border-[#D97706] rounded-2xl flex items-center justify-center text-[#F59E0B] shadow-[3px_3px_0px_#D97706] transform rotate-3">
                  <GraduationCap className="w-8 h-8 stroke-[2.5]" />
                </div>
                <div>
                  <div className="inline-block px-2 py-0.5 bg-[#D97706] text-white rounded-md text-[10px] font-black uppercase tracking-wider mb-0.5">
                    Akses Pendidik Terverifikasi
                  </div>
                  <h3 className={`text-lg sm:text-xl font-black uppercase tracking-tight font-display ${selectedRole === 'teacher' ? 'text-white' : 'text-[#1A365D]'}`}>
                    Guru / Pembina UKS
                  </h3>
                </div>
              </div>

              <p className={`text-xs font-bold leading-relaxed mb-3 ${selectedRole === 'teacher' ? 'text-slate-300' : 'text-slate-600'}`}>
                Akses analitik profesional ke <strong>Dasbor Pantau Kelas</strong>, rekap kepatuhan AKG siswa, log audit gizi, dan sistem peringatan natrium tinggi.
              </p>
            </div>

            <div className={`pt-2 border-t-2 flex items-center justify-between text-xs font-black ${selectedRole === 'teacher' ? 'border-slate-700 text-[#F59E0B]' : 'border-slate-200 text-[#1A365D]'}`}>
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                Dasbor & Notifikasi Kelas
              </span>
              <span className="text-[11px] underline">Masuk Guru →</span>
            </div>
          </button>
        </div>
      </div>

      {/* 2. Distinct Visual Theme & Auth Flow based on Selected Role (Directive 3) */}
      {selectedRole === 'student' ? (
        /* ================= MODE SISWA (Cheerful, Child-friendly, Bright) ================= */
        <div className="bg-[#FDF8F1] rounded-[36px] sm:rounded-[44px] border-[8px] sm:border-[10px] border-[#81C784] shadow-[12px_12px_0px_#1A365D] overflow-hidden">
          {/* Banner Section */}
          <div className="relative bg-[#E0F2F1] p-6 sm:p-8 text-[#1A365D] border-b-4 border-[#1A365D] overflow-hidden">
            <div className="absolute -right-8 -bottom-8 opacity-10 pointer-events-none transform -rotate-12">
              <Fish className="w-72 h-72 text-[#00796B]" />
            </div>

            <div className="max-w-2xl relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-[#FFF9C4] text-[#1A365D] text-xs font-black uppercase tracking-wider mb-3 border-2 border-[#1A365D] shadow-[2px_2px_0px_#1A365D] transform -rotate-2">
                <Sparkles className="w-3.5 h-3.5 text-[#F9A825]" />
                PJOK Kelas 6 SD • Kurikulum Merdeka Fase C
              </div>

              <div className="flex items-center gap-4 mb-3">
                <div className="w-14 h-14 bg-[#FF6B6B] rounded-full border-3 border-[#1A365D] flex items-center justify-center text-white shadow-[4px_4px_0px_#1A365D] transform -rotate-6">
                  <Fish className="w-8 h-8 stroke-[2.5]" />
                </div>
                <div>
                  <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tighter text-[#1A365D] font-display">
                    Sahabat Sehat
                  </h1>
                  <p className="text-xs sm:text-sm font-bold text-[#00796B]">
                    Tutor Gizi Cilik Pesisir • Pedoman Isi Piringku
                  </p>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-[#1A365D] font-bold leading-relaxed mb-4 bg-white/80 p-3 rounded-2xl border-2 border-[#1A365D] shadow-[2px_2px_0px_#1A365D]">
                Hai teman-teman pesisir! Yuk jadi detektif gizi: foto tabel kemasan camilanmu, cari tahu gizinya dengan <strong>Gemini Vision</strong>, lalu lengkapi piringmu dengan lezatnya ikan kembung, tongkol, dan daun kelor!
              </p>

              <div className="flex flex-wrap gap-2 text-xs font-black">
                <div className="flex items-center gap-1 bg-white px-2.5 py-1 rounded-xl border-2 border-[#1A365D]">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#81C784]" />
                  Patokan 1x Makan ~30% AKG
                </div>
                <div className="flex items-center gap-1 bg-white px-2.5 py-1 rounded-xl border-2 border-[#1A365D]">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#4DB6AC]" />
                  Gemini Multimodal Vision
                </div>
                <div className="flex items-center gap-1 bg-white px-2.5 py-1 rounded-xl border-2 border-[#1A365D]">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#FF6B6B]" />
                  Privasi Siswa Firestore
                </div>
              </div>
            </div>
          </div>

          {/* Content & Sign In Form */}
          <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-12 gap-6 items-center bg-[#FDF8F1]">
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

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div className="p-3 rounded-2xl bg-white border-3 border-[#1A365D] shadow-[3px_3px_0px_#1A365D] transform -rotate-1">
                  <div className="text-xs font-black text-[#00796B] mb-0.5 flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-lg bg-[#E0F2F1] border border-[#1A365D] text-[#1A365D] flex items-center justify-center text-[10px] font-black">1</span>
                    Foto Nilai Gizi
                  </div>
                  <div className="text-[11px] text-slate-600 font-bold">Membaca Karbohidrat, Lemak, Natrium, & Protein.</div>
                </div>

                <div className="p-3 rounded-2xl bg-[#FFF9C4] border-3 border-[#FBC02D] shadow-[3px_3px_0px_#1A365D] transform rotate-1">
                  <div className="text-xs font-black text-[#F9A825] mb-0.5 flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-lg bg-white border border-[#FBC02D] text-[#1A365D] flex items-center justify-center text-[10px] font-black">2</span>
                    Hitung Defisit 30%
                  </div>
                  <div className="text-[11px] text-slate-700 font-bold">Kalkulator interaktif selisih gizi yang seru.</div>
                </div>

                <div className="p-3 rounded-2xl bg-white border-3 border-[#81C784] shadow-[3px_3px_0px_#1A365D] transform rotate-1">
                  <div className="text-xs font-black text-[#00796B] mb-0.5 flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-lg bg-[#81C784] border border-[#1A365D] text-white flex items-center justify-center text-[10px] font-black">3</span>
                    Lauk Pesisir Segar
                  </div>
                  <div className="text-[11px] text-slate-600 font-bold">Ikan kembung, cakalang & kuah asam segar.</div>
                </div>

                <div className="p-3 rounded-2xl bg-[#FFEBEE] border-3 border-[#FF6B6B] shadow-[3px_3px_0px_#1A365D] transform -rotate-1">
                  <div className="text-xs font-black text-[#D32F2F] mb-0.5 flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-lg bg-[#FF6B6B] text-white flex items-center justify-center text-[10px] font-black">4</span>
                    Jurnal Piring Sehat
                  </div>
                  <div className="text-[11px] text-slate-700 font-bold">Tersimpan aman di akun Firestore pribadimu.</div>
                </div>
              </div>
            </div>

            {/* Login Card (Siswa) */}
            <div className="md:col-span-5 bg-white p-6 sm:p-7 rounded-[28px] border-4 border-[#1A365D] shadow-[8px_8px_0px_#1A365D] text-center space-y-4">
              <div className="w-14 h-14 bg-[#FFF9C4] text-[#1A365D] rounded-2xl border-3 border-[#1A365D] flex items-center justify-center mx-auto mb-2 shadow-[3px_3px_0px_#1A365D] transform -rotate-3">
                <Utensils className="w-7 h-7" />
              </div>

              <div>
                <h3 className="text-xl font-black uppercase text-[#1A365D] font-display tracking-tight">
                  Mulai Petualangan Gizi!
                </h3>
                <p className="text-xs font-bold text-slate-500 mt-0.5">
                  Masuk untuk membuka Tutor Gizi & Jurnal Makanmu
                </p>
              </div>

              {error && (
                <div className="p-3 rounded-xl bg-[#FFEBEE] border-2 border-[#D32F2F] text-xs font-bold text-[#D32F2F] text-left">
                  {error}
                </div>
              )}

              <button
                id="student-google-signin-btn"
                onClick={handleRoleGoogleSignIn}
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
                <span>{loading ? 'Menghubungkan...' : 'Masuk dengan Akun Google Siswa'}</span>
              </button>

              <div className="relative flex items-center justify-center my-2">
                <div className="border-t-2 border-[#1A365D] w-full"></div>
                <span className="bg-white px-2 text-[10px] font-black uppercase text-slate-500 tracking-wider">
                  atau mode cepat kelas
                </span>
              </div>

              <button
                id="demo-student-signin-btn"
                onClick={() => handleRoleDemoSignIn('student')}
                className="w-full py-3 px-4 bg-[#81C784] hover:bg-[#66BB6A] text-[#1A365D] border-3 border-[#1A365D] rounded-2xl font-black text-xs shadow-[3px_3px_0px_#1A365D] active:translate-y-1 active:shadow-[1px_1px_0px_#1A365D] transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>🎒 Masuk sebagai Siswa (Budi Santoso)</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-center gap-1.5 text-[11px] font-bold text-slate-500 pt-1">
                <ShieldCheck className="w-4 h-4 text-[#00796B]" />
                <span>Data tersimpan aman terpisah di Firestore Siswa</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* ================= MODE GURU (Professional, Analytical, High-Contrast Navy/Gold) ================= */
        <div className="bg-[#0F172A] rounded-[36px] sm:rounded-[44px] border-[8px] sm:border-[10px] border-[#1A365D] shadow-[12px_12px_0px_#D97706] overflow-hidden text-white">
          {/* Header Banner Mode Guru */}
          <div className="relative bg-gradient-to-r from-[#1E293B] to-[#0F172A] p-6 sm:p-8 border-b-4 border-[#D97706] overflow-hidden">
            <div className="max-w-2xl relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-[#D97706] text-white text-xs font-black uppercase tracking-wider mb-3 shadow-[2px_2px_0px_#000]">
                <ShieldAlert className="w-3.5 h-3.5 text-white" />
                Akses Pendidik Terverifikasi (Educator Verified)
              </div>

              <div className="flex items-center gap-4 mb-3">
                <div className="w-14 h-14 bg-[#D97706] rounded-2xl border-3 border-white flex items-center justify-center text-white shadow-[4px_4px_0px_#000] transform -rotate-3">
                  <GraduationCap className="w-8 h-8 stroke-[2.5]" />
                </div>
                <div>
                  <h1 className="text-2xl sm:text-4xl font-black uppercase tracking-tight font-display text-white">
                    Portal Monitoring Guru PJOK
                  </h1>
                  <p className="text-xs sm:text-sm font-bold text-[#FBBF24]">
                    Dasbor Pantau Kelas, Deteksi Dini Risiko Gizi & Notifikasi Eksternal
                  </p>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-slate-200 font-medium leading-relaxed mb-4 bg-white/10 p-3 rounded-2xl border border-white/20 backdrop-blur-sm">
                Instrumen profesional bagi Guru PJOK dan Pembina UKS untuk menganalisis data kepatuhan gizi satu rombel kelas, memfilter risiko kelebihan natrium (&ge; 50% AKG), serta mengelola alur notifikasi pendampingan gizi keluarga.
              </p>

              <div className="flex flex-wrap gap-2 text-xs font-black text-slate-200">
                <div className="flex items-center gap-1.5 bg-[#1E293B] px-3 py-1.5 rounded-xl border border-slate-600">
                  <LayoutDashboard className="w-3.5 h-3.5 text-[#F59E0B]" />
                  Dasbor Analitik Real-Time
                </div>
                <div className="flex items-center gap-1.5 bg-[#1E293B] px-3 py-1.5 rounded-xl border border-slate-600">
                  <Bell className="w-3.5 h-3.5 text-[#EF4444]" />
                  Alert Pemicu Natrium &ge; 50%
                </div>
                <div className="flex items-center gap-1.5 bg-[#1E293B] px-3 py-1.5 rounded-xl border border-slate-600">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#10B981]" />
                  RBAC Firestore Terisolasi
                </div>
              </div>
            </div>
          </div>

          {/* Teacher Credential & Authentication Panel */}
          <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-12 gap-6 items-start bg-[#0F172A]">
            <div className="md:col-span-6 space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#D97706]/20 border border-[#D97706] flex items-center justify-center text-[#F59E0B]">
                  <KeyRound className="w-4 h-4" />
                </div>
                <h3 className="text-lg font-black uppercase tracking-tight text-white font-display">
                  Ketentuan Keamanan & Isolasi Data
                </h3>
              </div>

              <div className="space-y-2.5 text-xs text-slate-300 font-medium leading-relaxed">
                <div className="p-3 rounded-xl bg-[#1E293B] border border-slate-700">
                  <strong className="text-white block mb-0.5">1. Proteksi Kebocoran Data Siswa:</strong>
                  Data gizi seluruh rombel kelas hanya dapat dibaca oleh pengguna dengan klaim peran terotentikasi <code className="text-[#FBBF24]">role === 'teacher'</code>.
                </div>
                <div className="p-3 rounded-xl bg-[#1E293B] border border-slate-700">
                  <strong className="text-white block mb-0.5">2. Verifikasi Kode Otorisasi Guru:</strong>
                  Sistem mewajibkan PIN Pendidik resmi sebelum memberikan akses ke Dasbor Kelas dan antarmuka notifikasi email eksternal.
                </div>
                <div className="p-3 rounded-xl bg-[#1E293B] border border-slate-700">
                  <strong className="text-white block mb-0.5">3. Otomatisasi Alert Nutrisi:</strong>
                  Ketika siswa mencatat camilan berkadar natrium tinggi (&ge; 50% AKG), peringatan tercatat otomatis di portal pendidik.
                </div>
              </div>
            </div>

            {/* Verification Form Card (Guru) */}
            <div className="md:col-span-6 bg-[#1E293B] p-6 rounded-[28px] border-3 border-[#D97706] shadow-[8px_8px_0px_#000] space-y-4">
              <div className="text-center pb-1">
                <span className="inline-block px-3 py-1 bg-[#D97706] text-white text-[10px] font-black uppercase tracking-wider rounded-lg mb-2">
                  Verifikasi Kredensial Pendidik
                </span>
                <h3 className="text-xl font-black uppercase text-white font-display">
                  Masuk Dasbor Guru
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Masukkan PIN otorisasi guru sekolah pesisir
                </p>
              </div>

              {/* PIN Input Field */}
              <div className="space-y-1.5">
                <label className="block text-xs font-black text-slate-300 uppercase tracking-wider">
                  PIN Otorisasi Guru / UKS
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    id="teacher-pin-input"
                    type={showPin ? 'text' : 'password'}
                    value={teacherPin}
                    onChange={(e) => {
                      setTeacherPin(e.target.value);
                      setPinError(null);
                    }}
                    placeholder="Masukkan PIN Guru (Contoh: GURU2026)"
                    className="w-full pl-10 pr-10 py-3 bg-[#0F172A] border-2 border-slate-600 rounded-xl text-white placeholder-slate-500 font-bold text-sm focus:outline-none focus:border-[#F59E0B]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPin(!showPin)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-white cursor-pointer"
                  >
                    {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {/* Quick Hint / Test Demo PIN Chip */}
                <div className="flex items-center justify-between pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      setTeacherPin('GURU2026');
                      setPinError(null);
                    }}
                    className="text-[11px] font-bold text-[#FBBF24] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <KeyRound className="w-3 h-3" />
                    Gunakan Kunci Demo: GURU2026
                  </button>
                  <span className="text-[10px] text-slate-400">PIN Guru PJOK</span>
                </div>
              </div>

              {/* Error Alert */}
              {(pinError || error) && (
                <div className="p-3 rounded-xl bg-red-950/80 border-2 border-red-500 text-xs font-bold text-red-200">
                  {pinError || error}
                </div>
              )}

              {/* Action Buttons */}
              <div className="space-y-2.5 pt-2">
                <button
                  id="teacher-google-signin-btn"
                  onClick={handleRoleGoogleSignIn}
                  disabled={loading}
                  className="w-full py-3.5 px-4 bg-white hover:bg-slate-100 text-[#0F172A] rounded-xl font-black text-sm shadow-[4px_4px_0px_#000] active:translate-y-1 active:shadow-[1px_1px_0px_#000] transition-all flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-50"
                >
                  <ShieldCheck className="w-4 h-4 text-[#D97706]" />
                  <span>{loading ? 'Mengautentikasi Pendidik...' : 'Verifikasi & Masuk Akun Google Guru'}</span>
                </button>

                <div className="relative flex items-center justify-center my-1">
                  <div className="border-t border-slate-700 w-full"></div>
                  <span className="bg-[#1E293B] px-2 text-[10px] font-black uppercase text-slate-400 tracking-wider">
                    atau akses uji coba pendidik
                  </span>
                </div>

                <button
                  id="demo-teacher-signin-btn"
                  onClick={() => handleRoleDemoSignIn('teacher')}
                  className="w-full py-3 px-4 bg-[#D97706] hover:bg-[#B45309] text-white border-2 border-amber-300 rounded-xl font-black text-xs shadow-[3px_3px_0px_#000] active:translate-y-1 active:shadow-[1px_1px_0px_#000] transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>👨‍🏫 Masuk Cepat sebagai Guru PJOK (Ibu Ratna, S.Pd.)</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="flex items-center justify-center gap-1.5 text-[11px] font-medium text-slate-400 pt-1 text-center">
                <ShieldAlert className="w-3.5 h-3.5 text-[#F59E0B] shrink-0" />
                <span>Akun siswa tidak memiliki izin melihat data ini.</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
