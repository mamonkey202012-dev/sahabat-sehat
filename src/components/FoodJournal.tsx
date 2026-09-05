import React from 'react';
import { Utensils, Calendar, Trash2, Fish, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';
import { FoodLogEntry } from '../types';

interface FoodJournalProps {
  logs: FoodLogEntry[];
  loading: boolean;
  onDeleteLog: (id: string) => Promise<void>;
  onStartNewMeal: () => void;
}

export const FoodJournal: React.FC<FoodJournalProps> = ({
  logs,
  loading,
  onDeleteLog,
  onStartNewMeal,
}) => {
  const totalMeals = logs.length;
  const proteinSolutions = logs.filter(
    (l) => l.selectedNutrientKey === 'protein' || l.selectedNutrient.toLowerCase().includes('protein')
  ).length;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-[32px] sm:rounded-[40px] border-4 border-[#1A365D] p-6 sm:p-8 shadow-[10px_10px_0px_#1A365D] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-black uppercase bg-[#81C784] text-[#1A365D] border-2 border-[#1A365D] shadow-[2px_2px_0px_#1A365D] transform -rotate-1 mb-2">
            <Fish className="w-3.5 h-3.5" />
            <span>Jurnal Petualang Gizi Pesisir</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-[#1A365D] font-display">
            Jurnal Piring Sehatku
          </h2>
          <p className="text-xs sm:text-sm font-bold text-slate-600 mt-1">
            Riwayat harian investigasi makanan kemasan dan pelengkap gizi laut pesisir yang telah kamu selidiki.
          </p>
        </div>

        <button
          id="new-meal-btn"
          onClick={onStartNewMeal}
          className="px-6 py-3.5 bg-[#4DB6AC] text-white rounded-2xl font-black uppercase tracking-wider text-xs border-3 border-[#1A365D] shadow-[4px_4px_0px_#1A365D] active:translate-y-1 active:shadow-[1px_1px_0px_#1A365D] transition-all flex items-center gap-2 cursor-pointer shrink-0"
        >
          <Sparkles className="w-4 h-4" />
          <span>Catat Makanan Baru</span>
        </button>
      </div>

      {/* Stats Cards - Artistic Flair Trio */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Yellow post-it card */}
        <div className="bg-[#FFF9C4] rounded-3xl border-4 border-[#FBC02D] p-5 shadow-[4px_4px_0px_#1A365D] transform -rotate-1">
          <div className="text-xs font-black text-[#1A365D] uppercase tracking-wider pb-1 border-b-2 border-[#FBC02D]">
            Total Piring Tercatat
          </div>
          <div className="text-4xl font-black text-[#1A365D] font-display mt-2">
            {totalMeals}
          </div>
          <div className="text-[11px] font-bold text-slate-600 mt-1">Investigasi gizi berhasil</div>
        </div>

        {/* Navy point card */}
        <div className="bg-[#1A365D] text-white rounded-3xl border-4 border-[#1A365D] p-5 shadow-[4px_4px_0px_#1A365D] transform rotate-1">
          <div className="text-xs font-black text-[#81C784] uppercase tracking-wider pb-1 border-b-2 border-white/20">
            Fokus Protein Laut
          </div>
          <div className="text-4xl font-black text-white font-display mt-2">
            {proteinSolutions} kali
          </div>
          <div className="text-[11px] font-bold text-cyan-200 mt-1">Ikan kembung & tongkol</div>
        </div>

        {/* Seafoam security card */}
        <div className="bg-[#E0F2F1] rounded-3xl border-4 border-[#4DB6AC] p-5 shadow-[4px_4px_0px_#1A365D]">
          <div className="text-xs font-black text-[#00796B] uppercase tracking-wider pb-1 border-b-2 border-[#4DB6AC]">
            Privasi Siswa
          </div>
          <div className="flex items-center gap-2 text-[#1A365D] font-black text-sm mt-3">
            <ShieldCheck className="w-6 h-6 text-[#00796B]" />
            <span>Terisolasi di Firestore</span>
          </div>
          <div className="text-[11px] font-bold text-slate-600 mt-1">Aman per ID akun siswa</div>
        </div>
      </div>

      {/* Logs List */}
      <div className="bg-white rounded-[32px] sm:rounded-[40px] border-4 border-[#1A365D] shadow-[10px_10px_0px_#1A365D] p-6 sm:p-8">
        <h3 className="text-xl font-black uppercase tracking-tight text-[#1A365D] font-display mb-4 flex items-center justify-between">
          <span>Riwayat Investigasi Piringku</span>
          <span className="text-xs bg-[#FF6B6B] text-white px-3 py-1 rounded-xl border-2 border-[#1A365D]">
            {logs.length} Catatan
          </span>
        </h3>

        {loading ? (
          <div className="py-12 text-center text-[#1A365D]">
            <div className="w-8 h-8 border-3 border-[#00796B] border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
            <p className="text-sm font-black uppercase tracking-wider">Memuat catatan dari Firestore...</p>
          </div>
        ) : logs.length === 0 ? (
          <div className="py-12 text-center space-y-3">
            <div className="w-16 h-16 rounded-2xl bg-[#FFF9C4] border-3 border-[#1A365D] text-[#1A365D] flex items-center justify-center mx-auto shadow-[3px_3px_0px_#1A365D]">
              <Utensils className="w-8 h-8" />
            </div>
            <div className="text-lg font-black text-[#1A365D] uppercase">
              Belum Ada Catatan Piring Sehat
            </div>
            <p className="text-xs font-bold text-slate-500 max-w-md mx-auto">
              Yuk foto kemasan makanan pertamamu di tab "Asisten Gizi" dan temukan pangan laut pendampingnya!
            </p>
            <button
              onClick={onStartNewMeal}
              className="mt-2 px-5 py-2.5 bg-[#4DB6AC] text-white rounded-xl text-xs font-black uppercase tracking-wider border-2 border-[#1A365D] shadow-[2px_2px_0px_#1A365D] hover:bg-[#00796B] transition-colors inline-flex items-center gap-2 cursor-pointer"
            >
              <span>Mulai Investigasi Pertama</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {logs.map((log) => {
              const formattedDate = log.timestamp?.toDate
                ? log.timestamp.toDate().toLocaleDateString('id-ID', {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })
                : new Date(log.timestamp).toLocaleDateString('id-ID', {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  });

              return (
                <div
                  key={log.id}
                  className="p-5 rounded-2xl border-3 border-[#1A365D] bg-white hover:bg-[#FDF8F1] shadow-[4px_4px_0px_#1A365D] transition-all space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2.5">
                        <h4 className="text-base font-black text-[#1A365D] font-display">
                          {log.foodName}
                        </h4>
                        <span className="px-2.5 py-0.5 rounded-lg text-xs font-black bg-[#FFF9C4] text-[#1A365D] border border-[#1A365D]">
                          {log.selectedNutrient} (Defisit: {log.deficit}%)
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500 font-bold flex items-center gap-1.5 mt-0.5">
                        <Calendar className="w-3.5 h-3.5 text-[#00796B]" />
                        <span>{formattedDate}</span>
                      </div>
                    </div>

                    {log.id && (
                      <button
                        onClick={() => onDeleteLog(log.id!)}
                        className="self-end sm:self-auto p-2 text-slate-400 hover:text-[#D32F2F] hover:bg-[#FFEBEE] rounded-xl border border-transparent hover:border-[#1A365D] transition-all cursor-pointer"
                        title="Hapus Catatan"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  {/* Nutrients badges */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-xs">
                    <div className="p-2.5 rounded-xl bg-white border-2 border-[#1A365D] shadow-[2px_2px_0px_#1A365D]">
                      <span className="text-[10px] font-black uppercase text-slate-500 block">Karbohidrat</span>
                      <span className="font-black text-[#1A365D]">
                        {log.nutritionalData?.karbohidrat?.amount ?? 0}g ({log.nutritionalData?.karbohidrat?.akgPercent ?? 0}%)
                      </span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-white border-2 border-[#1A365D] shadow-[2px_2px_0px_#1A365D]">
                      <span className="text-[10px] font-black uppercase text-slate-500 block">Lemak Total</span>
                      <span className="font-black text-[#1A365D]">
                        {log.nutritionalData?.lemak?.amount ?? 0}g ({log.nutritionalData?.lemak?.akgPercent ?? 0}%)
                      </span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-white border-2 border-[#1A365D] shadow-[2px_2px_0px_#1A365D]">
                      <span className="text-[10px] font-black uppercase text-slate-500 block">Natrium</span>
                      <span className="font-black text-[#1A365D]">
                        {log.nutritionalData?.natrium?.amount ?? 0}mg ({log.nutritionalData?.natrium?.akgPercent ?? 0}%)
                      </span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-white border-2 border-[#1A365D] shadow-[2px_2px_0px_#1A365D]">
                      <span className="text-[10px] font-black uppercase text-slate-500 block">Protein</span>
                      <span className="font-black text-[#1A365D]">
                        {log.nutritionalData?.protein?.amount ?? 0}g ({log.nutritionalData?.protein?.akgPercent ?? 0}%)
                      </span>
                    </div>
                  </div>

                  {/* Chosen Coastal Solution */}
                  <div className="p-3.5 rounded-xl bg-[#E0F2F1] border-2 border-[#1A365D] flex items-start gap-2.5 shadow-[2px_2px_0px_#1A365D]">
                    <Fish className="w-5 h-5 text-[#00796B] shrink-0 mt-0.5" />
                    <div className="text-xs">
                      <span className="font-black text-[#00796B] uppercase tracking-wider">
                        Pangan Laut Pilihan:{' '}
                      </span>
                      <span className="text-[#1A365D] font-black">
                        {log.localFoodSolution}
                      </span>
                      {log.studentReflection && (
                        <p className="mt-1 text-slate-700 font-bold italic">
                          "{log.studentReflection}"
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
