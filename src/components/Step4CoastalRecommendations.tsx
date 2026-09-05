import React, { useState } from 'react';
import { Check, ArrowLeft, BookmarkCheck, Fish, Waves, MessageSquare } from 'lucide-react';
import { NutrientKey, NutritionAnalysisResponse, CoastalRecommendation } from '../types';

interface Step4CoastalRecommendationsProps {
  analysis: NutritionAnalysisResponse;
  selectedNutrientKey: NutrientKey;
  confirmedDeficit: number;
  onSaveToJournal: (chosenFoodSolution: string, reflection: string) => Promise<void>;
  onBackToStep3: () => void;
  isSaving: boolean;
}

export const Step4CoastalRecommendations: React.FC<Step4CoastalRecommendationsProps> = ({
  analysis,
  selectedNutrientKey,
  confirmedDeficit,
  onSaveToJournal,
  onBackToStep3,
  isSaving,
}) => {
  const nutrient = analysis.nutrients[selectedNutrientKey];

  const defaultRecommendations: CoastalRecommendation[] = [
    {
      id: 'r1',
      name: 'Ikan Kembung Bakar Sambal Dabu-Dabu',
      portion: '1 ekor sedang (80g)',
      nutrientContribution: `Menambah +${confirmedDeficit > 0 ? confirmedDeficit : 22}% AKG ${nutrient.label}`,
      whyGood: 'Ikan kembung kaya protein tinggi dan omega-3 untuk kecerdasan otak, pas untuk menggantikan olahan sosis!',
      coastalFact: 'Ikan kembung segar melimpah di Tempat Pelelangan Ikan (TPI) dan pasar pesisir.',
      targetNutrientKey: selectedNutrientKey,
    },
    {
      id: 'r2',
      name: 'Sayur Bening Daun Kelor & Jagung Manis',
      portion: '1 mangkuk sedang (100g)',
      nutrientContribution: `Menambah +${Math.max(10, Math.round(confirmedDeficit * 0.8))}% AKG ${nutrient.label} & Serat`,
      whyGood: 'Pohon kelor tumbuh subur di tanah berpasir pesisir; kaya vitamin A, kalsium, dan zat besi.',
      coastalFact: 'Masyarakat pesisir terbiasa memetik daun kelor pekarangan untuk santapan makan siang.',
      targetNutrientKey: selectedNutrientKey,
    },
    {
      id: 'r3',
      name: 'Sup Ikan Kuah Asam Segar',
      portion: '1 porsi mangkuk hangat',
      nutrientContribution: `Menyeimbangkan ${nutrient.label} dan menyegarkan tubuh`,
      whyGood: 'Kuah asam memakai perasan belimbing wuluh dan tomat pantai, segar tanpa minyak jenuh.',
      coastalFact: 'Menu wajib nelayan pesisir untuk memulihkan stamina sesudah melaut.',
      targetNutrientKey: selectedNutrientKey,
    },
  ];

  const recommendations =
    analysis.recommendedSolutions?.[selectedNutrientKey]?.length > 0
      ? analysis.recommendedSolutions[selectedNutrientKey]
      : defaultRecommendations;

  const [selectedSolution, setSelectedSolution] = useState<string>(recommendations[0]?.name || '');
  const [studentReflection, setStudentReflection] = useState<string>('');

  const handleSave = () => {
    if (!selectedSolution) {
      alert('Pilih salah satu pangan pesisir terlebih dahulu.');
      return;
    }
    onSaveToJournal(selectedSolution, studentReflection);
  };

  return (
    <div className="bg-white rounded-[32px] sm:rounded-[40px] border-4 border-[#1A365D] shadow-[10px_10px_0px_#1A365D] p-6 sm:p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b-3 border-[#1A365D]">
        <div>
          <div className="inline-block px-3 py-1 rounded-xl bg-[#81C784] text-[#1A365D] font-black uppercase text-xs border-2 border-[#1A365D] shadow-[2px_2px_0px_#1A365D] transform -rotate-1 mb-1">
            Langkah 4: Solusi Pangan Pesisir
          </div>
          <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-[#1A365D] font-display">
            Rekomendasi Pangan Lokal
          </h2>
          <p className="text-xs sm:text-sm font-bold text-slate-600">
            Solusi menutup defisit: <strong className="text-[#FF6B6B] font-black">{confirmedDeficit}% AKG {nutrient.label}</strong>
          </p>
        </div>
        <div className="w-12 h-12 rounded-2xl bg-[#81C784] border-3 border-[#1A365D] text-white flex items-center justify-center shadow-[3px_3px_0px_#1A365D] transform rotate-2">
          <Fish className="w-7 h-7 stroke-[2.5]" />
        </div>
      </div>

      {/* Tutor Encouragement in Storybook Comic style */}
      <div className="bg-[#E0F2F1] p-5 sm:p-6 rounded-3xl border-3 border-[#1A365D] shadow-[4px_4px_0px_#1A365D] flex items-start gap-4">
        <div className="w-12 h-12 rounded-2xl bg-[#00796B] border-2 border-[#1A365D] text-white flex items-center justify-center shrink-0 shadow-[2px_2px_0px_#1A365D]">
          <Waves className="w-6 h-6" />
        </div>
        <div className="space-y-1">
          <div className="text-xs font-black text-[#00796B] uppercase tracking-wider">
            Kekayaan Laut Nusantara
          </div>
          <p className="text-xs sm:text-sm text-[#1A365D] font-bold leading-relaxed">
            Laut kita melimpah dengan ikan berprotein tinggi dan sayur pesisir segar. Pilih 1 menu lauk favoritmu untuk melengkapi piring makan siangmu!
          </p>
        </div>
      </div>

      {/* 3 Coastal Food Recommendation Cards */}
      <div className="space-y-3">
        <label className="block text-xs sm:text-sm font-black uppercase tracking-wider text-[#1A365D]">
          Pilih 1 Menu Pesisir Pendamping Favoritmu:
        </label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {recommendations.slice(0, 3).map((item, idx) => {
            const isSelected = selectedSolution === item.name;
            return (
              <div
                key={item.id || idx}
                onClick={() => setSelectedSolution(item.name)}
                className={`p-5 rounded-3xl border-3 border-[#1A365D] transition-all cursor-pointer flex flex-col justify-between relative overflow-hidden shadow-[4px_4px_0px_#1A365D] transform ${
                  isSelected
                    ? 'bg-[#E0F2F1] -rotate-1 shadow-[6px_6px_0px_#1A365D]'
                    : 'bg-white hover:bg-amber-50/50'
                }`}
              >
                {/* Decorative bubble */}
                <div className="absolute -right-4 -top-4 w-16 h-16 bg-[#FFF9C4]/60 rounded-full pointer-events-none"></div>

                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-2">
                    <span className="px-2.5 py-1 rounded-xl text-[10px] font-black uppercase bg-[#81C784] text-[#1A365D] border border-[#1A365D]">
                      {item.portion}
                    </span>
                    <div
                      className={`w-7 h-7 rounded-xl border-2 border-[#1A365D] flex items-center justify-center transition-all ${
                        isSelected ? 'bg-[#00796B] text-white' : 'bg-white'
                      }`}
                    >
                      {isSelected && <Check className="w-4 h-4 stroke-[3]" />}
                    </div>
                  </div>

                  <h3 className="text-base font-black text-[#1A365D] font-display">
                    {item.name}
                  </h3>
                  <div className="text-xs font-black text-[#00796B] mt-1">
                    {item.nutrientContribution}
                  </div>

                  <p className="text-xs text-slate-700 font-bold mt-2 leading-relaxed">
                    {item.whyGood}
                  </p>
                </div>

                <div className="relative z-10 mt-4 pt-3 border-t-2 border-dashed border-[#1A365D]">
                  <div className="text-[10px] text-[#1A365D] font-bold italic flex items-center gap-1.5">
                    <Fish className="w-3.5 h-3.5 text-[#00796B] shrink-0" />
                    <span>{item.coastalFact}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Student Reflection Input */}
      <div className="space-y-2 pt-2">
        <label htmlFor="reflection-input" className="block text-xs sm:text-sm font-black uppercase tracking-wider text-[#1A365D] flex items-center gap-1.5">
          <MessageSquare className="w-4 h-4 text-[#00796B]" />
          <span>Refleksi Belajar Siswa (Opsional):</span>
        </label>
        <textarea
          id="reflection-input"
          rows={2}
          value={studentReflection}
          onChange={(e) => setStudentReflection(e.target.value)}
          placeholder="Contoh: Saya belajar bahwa biskuit kemasan sedikit proteinnya, jadi saya tambahkan ikan kembung bakar agar gizinya pas..."
          className="w-full px-4 py-3 rounded-2xl border-3 border-[#1A365D] focus:outline-none focus:bg-amber-50/50 text-[#1A365D] font-bold text-xs sm:text-sm shadow-[3px_3px_0px_#1A365D]"
        />
      </div>

      {/* Action CTA */}
      <div className="pt-4 flex flex-col-reverse sm:flex-row items-center justify-between gap-3 border-t-2 border-[#1A365D]">
        <button
          id="back-to-step3-btn"
          type="button"
          onClick={onBackToStep3}
          className="w-full sm:w-auto px-5 py-3 rounded-2xl border-3 border-[#1A365D] text-[#1A365D] font-black text-xs hover:bg-slate-100 transition-all flex items-center justify-center gap-1.5 shadow-[3px_3px_0px_#1A365D] cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          Kembali ke Hitungan
        </button>

        <button
          id="save-to-journal-btn"
          type="button"
          onClick={handleSave}
          disabled={isSaving || !selectedSolution}
          className="w-full sm:w-auto px-8 py-4 bg-[#4DB6AC] text-white font-black rounded-2xl border-3 border-[#1A365D] shadow-[4px_6px_0px_#1A365D] active:translate-y-1.5 active:shadow-[1px_1px_0px_#1A365D] uppercase tracking-widest text-base sm:text-lg disabled:opacity-50 transition-all flex items-center justify-center gap-3 cursor-pointer"
          style={{ borderBottomWidth: '7px', borderBottomColor: '#00796B' }}
        >
          {isSaving ? (
            <>
              <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Menyimpan ke Cloud Firestore...</span>
            </>
          ) : (
            <>
              <BookmarkCheck className="w-6 h-6" />
              <span>Simpan ke Jurnal Piringku!</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
