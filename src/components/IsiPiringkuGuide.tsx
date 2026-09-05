import React from 'react';
import { BookOpen, Fish, Salad, Apple, Sparkles, Heart, Waves, Target } from 'lucide-react';

export const IsiPiringkuGuide: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Hero Banner with Artistic Flair */}
      <div className="bg-[#E0F2F1] rounded-[32px] sm:rounded-[40px] border-4 border-[#1A365D] text-[#1A365D] p-6 sm:p-10 shadow-[10px_10px_0px_#1A365D] relative overflow-hidden">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#FFF9C4] text-[#1A365D] text-xs font-black uppercase tracking-wider border-2 border-[#1A365D] shadow-[2px_2px_0px_#1A365D] transform -rotate-1">
            <BookOpen className="w-3.5 h-3.5 text-[#F9A825]" />
            Buku SIBI PJOK Kelas 6 SD • Kurikulum Merdeka
          </div>
          <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-[#1A365D] font-display">
            Pedoman Isi Piringku & Pangan Pesisir
          </h2>
          <p className="text-sm sm:text-base text-[#1A365D] leading-relaxed font-bold">
            Kementerian Kesehatan Republik Indonesia menganjurkan komposisi makanan seimbang dalam 1 porsi makan. Untuk kita di kawasan pesisir, sumber protein dan sayur segar sangat melimpah ruah!
          </p>
        </div>
      </div>

      {/* Visual Plate Breakdown */}
      <div className="bg-white rounded-[32px] sm:rounded-[40px] border-4 border-[#1A365D] p-6 sm:p-8 shadow-[10px_10px_0px_#1A365D] space-y-6">
        <div className="flex items-center justify-between pb-3 border-b-3 border-[#1A365D]">
          <h3 className="text-xl font-black uppercase tracking-tight text-[#1A365D] font-display flex items-center gap-2">
            <Target className="w-6 h-6 text-[#FF6B6B]" />
            Komposisi Ideal 1 Piring Makan Sehat
          </h3>
          <span className="hidden sm:inline-block text-xs font-black uppercase bg-[#81C784] text-[#1A365D] px-3 py-1 rounded-xl border-2 border-[#1A365D]">
            Pedoman Kemenkes
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-3xl bg-[#FFF9C4] border-3 border-[#FBC02D] shadow-[4px_4px_0px_#1A365D] space-y-2 transform -rotate-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase px-2.5 py-1 rounded-lg bg-white text-[#1A365D] border border-[#1A365D]">
                1/3 Piring (33%)
              </span>
              <span className="text-2xl">🍚</span>
            </div>
            <h4 className="text-base font-black text-[#1A365D] font-display">
              Makanan Pokok
            </h4>
            <p className="text-xs text-slate-700 font-bold leading-relaxed">
              Sumber Karbohidrat sebagai tenaga belajar & bermain. Contoh pesisir: Nasi beras, Sagu, Jagung lokal, Ubi jalar rebus.
            </p>
          </div>

          <div className="p-5 rounded-3xl bg-[#81C784]/20 border-3 border-[#81C784] shadow-[4px_4px_0px_#1A365D] space-y-2 transform rotate-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase px-2.5 py-1 rounded-lg bg-white text-[#1A365D] border border-[#1A365D]">
                1/3 Piring (33%)
              </span>
              <Salad className="w-6 h-6 text-[#00796B]" />
            </div>
            <h4 className="text-base font-black text-[#1A365D] font-display">
              Sayuran Hijau & Kuah
            </h4>
            <p className="text-xs text-slate-700 font-bold leading-relaxed">
              Sumber Vitamin, Mineral & Serat. Pesisir andalan: Sayur bening daun kelor pekarangan, tumis kangkung pantai, sayur kuah asam.
            </p>
          </div>

          <div className="p-5 rounded-3xl bg-[#E0F2F1] border-3 border-[#4DB6AC] shadow-[4px_4px_0px_#1A365D] space-y-2 transform -rotate-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase px-2.5 py-1 rounded-lg bg-white text-[#1A365D] border border-[#1A365D]">
                1/6 Piring (17%)
              </span>
              <Fish className="w-6 h-6 text-[#00796B]" />
            </div>
            <h4 className="text-base font-black text-[#1A365D] font-display">
              Lauk Pauk Laut
            </h4>
            <p className="text-xs text-slate-700 font-bold leading-relaxed">
              Sumber Protein pembangun otot dan kecerdasan otak. Pilihan terbaik: Ikan kembung, tongkol, cakalang, teri segar, telur, tahu/tempe.
            </p>
          </div>

          <div className="p-5 rounded-3xl bg-[#FFEBEE] border-3 border-[#FF6B6B] shadow-[4px_4px_0px_#1A365D] space-y-2 transform rotate-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase px-2.5 py-1 rounded-lg bg-white text-[#1A365D] border border-[#1A365D]">
                1/6 Piring (17%)
              </span>
              <Apple className="w-6 h-6 text-[#D32F2F]" />
            </div>
            <h4 className="text-base font-black text-[#1A365D] font-display">
              Buah-buahan Segar
            </h4>
            <p className="text-xs text-slate-700 font-bold leading-relaxed">
              Antioksidan alami & hidrasi tubuh. Contoh tropis: Pisang lokal, Pepaya manis, Semangka pesisir, Jeruk segar.
            </p>
          </div>
        </div>
      </div>

      {/* Coastal Superfood Spotlight */}
      <div className="bg-white rounded-[32px] sm:rounded-[40px] border-4 border-[#1A365D] p-6 sm:p-8 shadow-[10px_10px_0px_#1A365D] space-y-6">
        <h3 className="text-xl font-black uppercase tracking-tight text-[#1A365D] font-display flex items-center gap-2">
          <Waves className="w-6 h-6 text-[#00796B]" />
          Fakta Gizi Pangan Pesisir Nusantara
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="p-5 rounded-3xl border-3 border-[#1A365D] bg-[#FDF8F1] shadow-[4px_4px_0px_#1A365D] space-y-3">
            <div className="flex items-center gap-3">
              <span className="w-10 h-10 rounded-2xl bg-[#E0F2F1] border-2 border-[#1A365D] flex items-center justify-center text-[#00796B]">
                <Fish className="w-6 h-6" />
              </span>
              <div>
                <h4 className="font-black text-[#1A365D] text-sm uppercase">
                  Ikan Kembung vs Salmon
                </h4>
                <span className="text-[11px] font-bold text-[#00796B]">Kaya Omega-3 & Terjangkau</span>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-slate-700 font-bold leading-relaxed">
              Banyak orang mengira salmon adalah ikan tersehat, padahal penelitian Kementerian Kelautan dan Perikanan (KKP) membuktikan bahwa <strong>Ikan Kembung lokal memiliki kandungan Omega-3 (1,86 gram) lebih tinggi dibanding salmon (1,60 gram)</strong>! Harganya sangat ramah dan mudah dibeli segar setiap pagi.
            </p>
          </div>

          <div className="p-5 rounded-3xl border-3 border-[#1A365D] bg-[#FDF8F1] shadow-[4px_4px_0px_#1A365D] space-y-3">
            <div className="flex items-center gap-3">
              <span className="w-10 h-10 rounded-2xl bg-[#FFF9C4] border-2 border-[#1A365D] flex items-center justify-center text-[#F9A825]">
                <Sparkles className="w-6 h-6 text-[#1A365D]" />
              </span>
              <div>
                <h4 className="font-black text-[#1A365D] text-sm uppercase">
                  Daun Kelor (Moringa)
                </h4>
                <span className="text-[11px] font-bold text-[#00796B]">Pohon Ajaib Pesisir</span>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-slate-700 font-bold leading-relaxed">
              Pohon kelor sangat tahan dengan angin laut dan tanah berpasir pesisir. Daunnya dijuluki <em>The Miracle Tree</em> karena mengandung <strong>Vitamin C 7x lebih banyak dari jeruk, Kalsium 4x lebih banyak dari susu, dan Zat Besi tinggi</strong> untuk mencegah anemia pada masa pertumbuhan siswa.
            </p>
          </div>
        </div>
      </div>

      {/* Batasan GGL (Gula, Garam, Lemak) */}
      <div className="p-6 sm:p-8 rounded-[32px] sm:rounded-[40px] bg-[#1A365D] text-white border-4 border-[#1A365D] shadow-[10px_10px_0px_#81C784] space-y-4">
        <div className="flex items-center gap-2 text-[#81C784] font-black text-xs uppercase tracking-wider">
          <Heart className="w-5 h-5 text-[#FF6B6B]" />
          Kaidah PJOK: Batas Konsumsi GGL Harian
        </div>
        <h4 className="text-2xl sm:text-3xl font-black uppercase tracking-tight font-display text-white">
          Rumus Rahasia: G4 - G1 - L5
        </h4>
        <p className="text-xs sm:text-sm text-slate-200 max-w-2xl leading-relaxed font-semibold">
          Dalam buku PJOK Kelas 6 SD, kita diajak membatasi asupan harian agar tubuh selalu bugar dan terhindar dari penyakit degeneratif:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          <div className="p-4 rounded-2xl bg-white/10 border-2 border-white/20">
            <div className="text-[#FFF9C4] font-black text-sm uppercase">Gula (G4)</div>
            <div className="text-xs text-slate-200 mt-1 font-semibold">Maksimal 4 sendok makan (50 gram/hari)</div>
          </div>
          <div className="p-4 rounded-2xl bg-white/10 border-2 border-white/20">
            <div className="text-[#FF6B6B] font-black text-sm uppercase">Garam/Natrium (G1)</div>
            <div className="text-xs text-slate-200 mt-1 font-semibold">Maksimal 1 sendok teh (2000 mg Natrium/hari)</div>
          </div>
          <div className="p-4 rounded-2xl bg-white/10 border-2 border-white/20">
            <div className="text-[#81C784] font-black text-sm uppercase">Lemak (L5)</div>
            <div className="text-xs text-slate-200 mt-1 font-semibold">Maksimal 5 sendok makan minyak (67 gram/hari)</div>
          </div>
        </div>
      </div>
    </div>
  );
};
