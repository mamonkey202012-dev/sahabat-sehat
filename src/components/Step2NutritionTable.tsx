import React from 'react';
import { ArrowRight, CheckCircle, AlertTriangle, Info, ArrowLeft, Target, Sparkles } from 'lucide-react';
import { NutrientKey, NutritionAnalysisResponse, NutrientItem } from '../types';

interface Step2NutritionTableProps {
  analysis: NutritionAnalysisResponse;
  selectedNutrientKey: NutrientKey;
  setSelectedNutrientKey: (key: NutrientKey) => void;
  onProceedToStep3: () => void;
  onBackToStep1: () => void;
}

export const Step2NutritionTable: React.FC<Step2NutritionTableProps> = ({
  analysis,
  selectedNutrientKey,
  setSelectedNutrientKey,
  onProceedToStep3,
  onBackToStep1,
}) => {
  const nutrientsList: NutrientItem[] = Object.values(analysis.nutrients);

  return (
    <div className="bg-white rounded-[32px] sm:rounded-[40px] border-4 border-[#1A365D] shadow-[10px_10px_0px_#1A365D] p-6 sm:p-8 space-y-6">
      {/* Header & Tutor Greeting */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b-3 border-[#1A365D] gap-3">
        <div>
          <div className="inline-block px-3 py-1 rounded-xl bg-[#81C784] text-[#1A365D] font-black uppercase text-xs border-2 border-[#1A365D] shadow-[2px_2px_0px_#1A365D] transform -rotate-1 mb-1">
            Langkah 2: Hasil Analisis Gemini
          </div>
          <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-[#1A365D] font-display">
            Ekstraksi Nilai Gizi Kemasan
          </h2>
          <p className="text-xs sm:text-sm font-bold text-slate-600 mt-0.5">
            Makanan: <span className="text-[#00796B] font-black">{analysis.foodName}</span> ({analysis.servingInfo || '1 Porsi Kemasan'})
          </p>
        </div>
        <div className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-[#FFF9C4] border-2 border-[#1A365D] text-xs font-black text-[#1A365D] shadow-[2px_2px_0px_#1A365D] transform rotate-1">
          <Target className="w-4 h-4 text-[#FF6B6B]" />
          <span>Patokan 1x Makan: ~30% AKG</span>
        </div>
      </div>

      {/* Tutor Non-Judgmental Summary Box */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[#FFF9C4] border-3 border-[#FBC02D] shadow-[4px_4px_0px_#1A365D] flex items-start gap-3 transform -rotate-1">
        <div className="w-11 h-11 rounded-2xl bg-[#FBC02D] border-2 border-[#1A365D] text-white flex items-center justify-center shrink-0 shadow-[2px_2px_0px_#1A365D] mt-0.5">
          <Sparkles className="w-6 h-6 text-[#1A365D]" />
        </div>
        <div className="space-y-1">
          <div className="text-xs font-black text-[#1A365D] uppercase tracking-wider">
            Catatan Tutor Sahabat Sehat
          </div>
          <p className="text-xs sm:text-sm text-[#1A365D] leading-relaxed font-bold">
            {analysis.summaryTutor ||
              'Hebat! Makanan kemasan ini sudah kamu catat dengan teliti. Ingat, tidak ada makanan yang "dilarang", yang terpenting kita tahu kandungannya dan melengkapinya dengan lauk sehat dari laut pesisir kita!'}
          </p>
        </div>
      </div>

      {/* Comparison Table */}
      <div className="overflow-x-auto rounded-2xl border-3 border-[#1A365D] shadow-[4px_4px_0px_#1A365D]">
        <table className="w-full text-left text-sm border-collapse bg-white">
          <thead>
            <tr className="bg-[#E0F2F1] text-[#1A365D] font-black text-xs uppercase tracking-wider border-b-3 border-[#1A365D]">
              <th className="py-3 px-4">Zat Gizi Pokok</th>
              <th className="py-3 px-4">Kandungan Kemasan</th>
              <th className="py-3 px-4">% AKG Kemasan</th>
              <th className="py-3 px-4">Target 1x Makan</th>
              <th className="py-3 px-4">Evaluasi Gizi</th>
            </tr>
          </thead>
          <tbody className="divide-y-2 divide-slate-100 font-bold">
            {nutrientsList.map((item) => {
              const isDeficit = item.akgPercent < item.targetAkg;
              const isExcess = item.akgPercent > 40;
              const isSelected = selectedNutrientKey === item.key;

              return (
                <tr
                  key={item.key}
                  onClick={() => setSelectedNutrientKey(item.key)}
                  className={`cursor-pointer transition-all ${
                    isSelected ? 'bg-[#FFF9C4]/70' : 'hover:bg-amber-50/50'
                  }`}
                >
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2.5">
                      <input
                        type="radio"
                        name="selected-nutrient"
                        checked={isSelected}
                        onChange={() => setSelectedNutrientKey(item.key)}
                        className="w-4 h-4 text-[#4DB6AC] accent-[#00796B] cursor-pointer"
                      />
                      <span className="text-[#1A365D] font-black">{item.label}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-[#1A365D]">
                    {item.amount} {item.unit}
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="space-y-1">
                      <div className="flex justify-between items-center text-xs font-black">
                        <span>{item.akgPercent}% AKG</span>
                      </div>
                      <div className="h-3.5 w-28 sm:w-36 bg-[#F5F5F5] rounded-full overflow-hidden border-2 border-[#1A365D]">
                        <div
                          className={`h-full ${
                            item.key === 'protein' ? 'bg-[#4DB6AC]' : 'bg-[#FF6B6B]'
                          }`}
                          style={{ width: `${Math.min(100, (item.akgPercent / 30) * 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-slate-600 font-black">
                    {item.targetAkg}% AKG
                  </td>
                  <td className="py-3.5 px-4">
                    {isDeficit ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-black bg-[#FFEBEE] text-[#D32F2F] border-2 border-[#FF6B6B]">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        Defisit {item.targetAkg - item.akgPercent}%
                      </span>
                    ) : isExcess ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-black bg-amber-100 text-amber-900 border-2 border-amber-300">
                        <Info className="w-3.5 h-3.5" />
                        Tinggi (+{item.akgPercent - item.targetAkg}%)
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-black bg-[#81C784]/30 text-[#00796B] border-2 border-[#81C784]">
                        <CheckCircle className="w-3.5 h-3.5" />
                        Seimbang (~30%)
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Select Nutrient to Investigate */}
      <div className="space-y-3 pt-2">
        <label className="block text-xs sm:text-sm font-black uppercase tracking-wider text-[#1A365D]">
          Pilih 1 Zat Gizi yang ingin kamu selidiki dan lengkapi dengan lauk pesisir:
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {nutrientsList.map((item, idx) => {
            const isSelected = selectedNutrientKey === item.key;
            return (
              <button
                key={item.key}
                type="button"
                onClick={() => setSelectedNutrientKey(item.key)}
                className={`p-3.5 rounded-2xl border-3 border-[#1A365D] text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#FFF9C4] shadow-[4px_4px_0px_#1A365D] transform -rotate-1'
                    : 'bg-white hover:bg-amber-50/50 shadow-[2px_2px_0px_#1A365D]'
                }`}
              >
                <div className="text-[10px] text-[#00796B] uppercase tracking-wider font-black">
                  {item.key}
                </div>
                <div className="text-sm font-black text-[#1A365D] mt-0.5">{item.label}</div>
                <div className="text-xs text-[#1A365D] font-bold mt-1">
                  Kemasan: <strong>{item.akgPercent}%</strong>
                </div>
                <div className="text-[11px] font-black text-[#FF6B6B] mt-0.5">
                  {item.akgPercent < 30 ? `Kurang: ${30 - item.akgPercent}% AKG` : 'Sudah Terpenuhi!'}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="pt-4 flex flex-col-reverse sm:flex-row items-center justify-between gap-3 border-t-2 border-[#1A365D]">
        <button
          id="back-to-step1-btn"
          type="button"
          onClick={onBackToStep1}
          className="w-full sm:w-auto px-5 py-3 rounded-2xl border-3 border-[#1A365D] text-[#1A365D] font-black text-xs hover:bg-slate-100 transition-all flex items-center justify-center gap-1.5 shadow-[3px_3px_0px_#1A365D] cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          Ganti Makanan / Foto
        </button>

        <button
          id="proceed-to-step3-btn"
          type="button"
          onClick={onProceedToStep3}
          className="w-full sm:w-auto px-7 py-3.5 bg-[#4DB6AC] text-white font-black rounded-2xl border-3 border-[#1A365D] shadow-[4px_4px_0px_#1A365D] active:translate-y-1 active:shadow-[1px_1px_0px_#1A365D] uppercase tracking-wider text-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <span>Hitung Defisit di Langkah 3</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
