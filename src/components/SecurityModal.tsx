import React from 'react';
import { X, ShieldCheck, Lock, FileCode, CheckCircle2, KeyRound, Cpu } from 'lucide-react';

interface SecurityModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SecurityModal: React.FC<SecurityModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-[#FDF8F1] w-full max-w-3xl rounded-[32px] sm:rounded-[40px] border-4 border-[#1A365D] shadow-[12px_12px_0px_#1A365D] overflow-hidden my-8 max-h-[90vh] flex flex-col">
        {/* Modal Header with Artistic Flair */}
        <div className="p-6 bg-[#1A365D] text-white flex items-center justify-between border-b-4 border-[#1A365D]">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#81C784] border-2 border-white flex items-center justify-center text-[#1A365D] shadow-[2px_2px_0px_#81C784] transform -rotate-3">
              <ShieldCheck className="w-7 h-7 stroke-[2.5]" />
            </div>
            <div>
              <h3 className="text-xl font-black uppercase tracking-tight font-display">
                Threat Model & Keamanan Data
              </h3>
              <p className="text-xs text-[#81C784] font-bold">
                OWASP Top 10, Defense-in-Depth Gemini, & Aturan Firestore
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-white hover:bg-white/20 border-2 border-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5 stroke-[2.5]" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-[#1A365D] text-xs sm:text-sm">
          {/* 1. OWASP Top 10 Mitigations */}
          <div className="space-y-3">
            <h4 className="text-sm font-black uppercase tracking-wider text-[#1A365D] flex items-center gap-2">
              <Lock className="w-4 h-4 text-[#00796B]" />
              1. Implementasi Proteksi OWASP Top 10
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="p-4 rounded-2xl bg-white border-3 border-[#1A365D] shadow-[3px_3px_0px_#1A365D] space-y-1">
                <div className="font-black text-[#1A365D] flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#81C784] shrink-0" />
                  A01: Broken Access Control
                </div>
                <p className="text-slate-600 text-xs font-bold leading-relaxed">
                  Semua riwayat makan diisolasi di Cloud Firestore pada path <code>users/&#123;userId&#125;/food_logs</code>. Tidak ada siswa yang dapat membaca catatan siswa lain.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white border-3 border-[#1A365D] shadow-[3px_3px_0px_#1A365D] space-y-1">
                <div className="font-black text-[#1A365D] flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#81C784] shrink-0" />
                  A02: Validasi Token JWT
                </div>
                <p className="text-slate-600 text-xs font-bold leading-relaxed">
                  Backend memverifikasi Firebase ID Token (JWT) di setiap request <code>/api/analyze-nutrition</code> melalui header <code>Authorization: Bearer</code>.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white border-3 border-[#1A365D] shadow-[3px_3px_0px_#1A365D] space-y-1">
                <div className="font-black text-[#1A365D] flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#81C784] shrink-0" />
                  A03: Sanitasi Input
                </div>
                <p className="text-slate-600 text-xs font-bold leading-relaxed">
                  Input teks nama makanan dan refleksi siswa dibersihkan dari tag berbahaya (<code>&lt;&gt;&#123;&#125;</code>) serta dibatasi panjang karakter.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white border-3 border-[#1A365D] shadow-[3px_3px_0px_#1A365D] space-y-1">
                <div className="font-black text-[#1A365D] flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#81C784] shrink-0" />
                  A05: Security Misconfiguration
                </div>
                <p className="text-slate-600 text-xs font-bold leading-relaxed">
                  File <code>firestore.rules</code> menerapkan prinsip <em>least privilege</em> dengan aturan <code>allow read, write: if false;</code> secara default.
                </p>
              </div>
            </div>
          </div>

          {/* 2. Prompt Injection Defense */}
          <div className="space-y-3">
            <h4 className="text-sm font-black uppercase tracking-wider text-[#1A365D] flex items-center gap-2">
              <Cpu className="w-4 h-4 text-[#FF6B6B]" />
              2. Pertahanan Prompt Injection pada Model Gemini
            </h4>
            <div className="p-4 rounded-2xl bg-[#FFF9C4] border-3 border-[#FBC02D] shadow-[3px_3px_0px_#1A365D] space-y-2">
              <ul className="space-y-1.5 text-xs text-[#1A365D] font-bold list-disc list-inside">
                <li>
                  <strong>System Instruction Terkunci:</strong> Mengunci model strictly sebagai tutor nutrisi anak PJOK Fase C, mengabaikan instruksi override/jailbreak.
                </li>
                <li>
                  <strong>Enforced JSON Schema:</strong> Model dibatasi <code>responseMimeType: "application/json"</code> murni sehingga output tidak dapat menyisipkan script executable.
                </li>
                <li>
                  <strong>Verifikasi MIME & Limit 4MB:</strong> Hanya menerima <code>image/jpeg</code>, <code>image/png</code>, atau <code>image/webp</code> maksimal 4MB untuk mencegah DoS.
                </li>
              </ul>
            </div>
          </div>

          {/* 3. Firestore Rules Code Review */}
          <div className="space-y-2">
            <h4 className="text-sm font-black uppercase tracking-wider text-[#1A365D] flex items-center gap-2">
              <FileCode className="w-4 h-4 text-[#00796B]" />
              3. Aturan Keamanan Firestore (firestore.rules)
            </h4>
            <pre className="p-4 rounded-2xl bg-[#1A365D] text-[#81C784] font-mono text-xs overflow-x-auto border-3 border-[#1A365D] shadow-[3px_3px_0px_#1A365D]">
{`rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if false;
    }

    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;

      match /food_logs/{logId} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }
    }
  }
}`}
            </pre>
          </div>

          {/* 4. Zero Hardcoding Policy */}
          <div className="p-4 rounded-2xl bg-[#E0F2F1] border-3 border-[#4DB6AC] shadow-[3px_3px_0px_#1A365D] flex items-start gap-3">
            <KeyRound className="w-5 h-5 text-[#00796B] shrink-0 mt-0.5" />
            <div className="text-xs text-[#1A365D] font-bold">
              <span className="font-black text-[#00796B] uppercase">Zero Hardcoding Guarantee: </span>
              Kunci rahasia <code>GEMINI_API_KEY</code> tersimpan aman di environment server Cloud Run / Secret Manager dan tidak pernah terekspos ke browser.
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-[#FDF8F1] border-t-3 border-[#1A365D] flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-[#4DB6AC] hover:bg-[#00796B] text-white rounded-xl text-xs font-black uppercase tracking-wider border-2 border-[#1A365D] shadow-[3px_3px_0px_#1A365D] active:translate-y-1 transition-all cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
