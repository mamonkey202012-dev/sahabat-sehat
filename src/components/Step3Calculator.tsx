import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { ArrowRight, ArrowLeft, Calculator, CheckCircle2, Sparkles, Lightbulb } from 'lucide-react';
import { NutrientKey, NutritionAnalysisResponse } from '../types';

interface Step3CalculatorProps {
  analysis: NutritionAnalysisResponse;
  selectedNutrientKey: NutrientKey;
  onProceedToStep4: (confirmedDeficit: number) => void;
  onBackToStep2: () => void;
}

export const Step3Calculator: React.FC<Step3CalculatorProps> = ({
  analysis,
  selectedNutrientKey,
  onProceedToStep4,
  onBackToStep2,
}) => {
  const nutrient = analysis.nutrients[selectedNutrientKey];
  const targetPercent = 30; // Target 1x makan ideal
  const packagePercent = nutrient.akgPercent;
  const actualDeficit = Math.max(0, targetPercent - packagePercent);

  const [studentInput, setStudentInput] = useState<string>('');
  const [feedback, setFeedback] = useState<{
    status: 'idle' | 'correct' | 'incorrect';
    message: string;
  }>({ status: 'idle', message: '' });

  // Multiple choice options for scaffolding
  const options = React.useMemo(() => {
    const set = new Set<number>();
    set.add(actualDeficit);
    set.add(Math.max(0, actualDeficit + 5));
    set.add(Math.max(1, actualDeficit - 5));
    set.add(actualDeficit + 10);
    return Array.from(set).slice(0, 4).sort((a, b) => a - b);
  }, [actualDeficit]);

  const handleCheckAnswer = (val: number) => {
    if (val === actualDeficit) {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
      setFeedback({
        status: 'correct',
        message: `Tepat sekali! 30% - ${packagePercent}% = ${actualDeficit}% AKG. Kamu hebat!`,
      });
    } else {
      setFeedback({
        status: 'incorrect',
        message: `Hampir! Coba kurangkan: [Target 30%] - [Kemasan ${packagePercent}%] = ?`,
      });
    }
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = parseInt(studentInput, 10);
    if (isNaN(parsed)) return;
    handleCheckAnswer(parsed);
  };

  return (
    <div className="bg-white rounded-[32px] sm:rounded-[40px] border-4 border-[#1A365D] shadow-[10px_10px_0px_#1A365D] p-6 sm:p-8 space-y-6">
      {/* Step Header */}
      <div className="flex items-center justify-between pb-4 border-b-3 border-[#1A365D]">
        <div>
          <div className="inline-block px-3 py-1 rounded-xl bg-[#FFF9C4] text-[#1A365D] font-black uppercase text-xs border-2 border-[#1A365D] shadow-[2px_2px_0px_#1A365D] transform -rotate-1 mb-1">
            Langkah 3: Kalkulator Defisit Gizi
          </div>
          <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-[#1A365D] font-display">
            Hitung Selisih Gizi Interaktif
          </h2>
          <p className="text-xs sm:text-sm font-bold text-slate-600">
            Penyelidikan Zat Gizi: <strong className="text-[#00796B]">{nutrient.label}</strong>
          </p>
        </div>
        <div className="w-12 h-12 rounded-2xl bg-[#FF6B6B] border-3 border-[#1A365D] text-white flex items-center justify-center shadow-[3px_3px_0px_#1A365D] transform rotate-2">
          <Calculator className="w-6 h-6 stroke-[2.5]" />
        </div>
      </div>

      {/* Tutor Dialogue & Math Formula */}
      <div className="bg-[#E0F2F1] p-5 sm:p-6 rounded-3xl border-3 border-[#1A365D] shadow-[4px_4px_0px_#1A365D] space-y-4">
        <div className="flex items-center gap-2 text-[#00796B] font-black text-xs sm:text-sm uppercase tracking-wider">
          <Sparkles className="w-4 h-4 text-[#00796B]" />
          <span>Tantangan Berhitung Detektif Gizi:</span>
        </div>
        <p className="text-xs sm:text-sm text-[#1A365D] font-bold leading-relaxed">
          "Kebutuhan makan siang kita adalah <strong>30% AKG</strong>. Dari kemasan <strong>{analysis.foodName}</strong>, kita baru mendapatkan <strong>{packagePercent}% AKG {nutrient.label}</strong>. Berapa selisih kekurangan gizi yang harus kita penuhi dari lauk pesisir?"
        </p>

        {/* Artistic Mathematical Formula Block */}
        <div className="bg-[#FFEBEE] border-3 border-[#FF6B6B] p-4 sm:p-5 rounded-2xl shadow-[4px_4px_0px_#1A365D]">
          <div className="flex justify-between items-center mb-3">
            <p className="text-xs font-black text-[#D32F2F] uppercase tracking-wider">
              Rumus Defisit Gizi
            </p>
            <span className="bg-[#FF6B6B] text-white px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider border border-[#1A365D]">
              30% Target AKG
            </span>
          </div>

          <div className="flex items-center justify-center gap-3 sm:gap-6 font-black text-xl sm:text-3xl text-[#1A365D]">
            <div className="text-center bg-white px-4 py-2 rounded-2xl border-2 border-[#1A365D] shadow-[2px_2px_0px_#1A365D]">
              <p className="text-[9px] font-black opacity-60 uppercase tracking-wider">Target</p>
              <span>30%</span>
            </div>

            <div className="text-[#FF6B6B] font-black text-3xl">-</div>

            <div className="text-center bg-white px-4 py-2 rounded-2xl border-2 border-[#1A365D] shadow-[2px_2px_0px_#1A365D]">
              <p className="text-[9px] font-black opacity-60 uppercase tracking-wider">Kemasan</p>
              <span>{packagePercent}%</span>
            </div>

            <div className="text-[#1A365D] font-black text-3xl">=</div>

            <div className="text-center bg-[#FFF9C4] px-4 py-2 rounded-2xl border-3 border-[#1A365D] shadow-[3px_3px_0px_#1A365D]">
              <p className="text-[9px] font-black text-[#00796B] uppercase tracking-wider">Kekurangan</p>
              <span className="text-[#D32F2F]">
                {feedback.status === 'correct' ? `${actualDeficit}%` : '? %'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Multiple Choice Chips */}
      <div className="space-y-3">
        <label className="block text-xs sm:text-sm font-black uppercase tracking-wider text-[#1A365D]">
          Pilih atau tebak berapa selisih kekurangan % AKG {nutrient.label}:
        </label>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {options.map((opt, idx) => (
            <button
              key={opt}
              type="button"
              onClick={() => {
                setStudentInput(opt.toString());
                handleCheckAnswer(opt);
              }}
              className={`py-4 px-3 rounded-2xl border-3 border-[#1A365D] bg-white hover:bg-[#FFF9C4] font-black text-lg sm:text-xl text-[#1A365D] transition-all text-center cursor-pointer shadow-[3px_3px_0px_#1A365D] active:translate-y-1 active:shadow-[1px_1px_0px_#1A365D] transform ${
                idx % 2 === 0 ? 'hover:-rotate-1' : 'hover:rotate-1'
              }`}
            >
              {opt}% AKG
            </button>
          ))}
        </div>

        {/* Manual Input option */}
        <form onSubmit={handleManualSubmit} className="flex gap-2 pt-1">
          <input
            id="student-deficit-input"
            type="number"
            value={studentInput}
            onChange={(e) => setStudentInput(e.target.value)}
            placeholder="Atau ketik angka tebakanmu..."
            className="flex-1 px-4 py-3 rounded-2xl border-3 border-[#1A365D] focus:outline-none focus:bg-amber-50/50 text-[#1A365D] font-black text-sm shadow-[3px_3px_0px_#1A365D]"
          />
          <button
            type="submit"
            className="px-5 py-3 rounded-2xl bg-[#1A365D] text-white font-black text-xs uppercase tracking-wider border-3 border-[#1A365D] shadow-[3px_3px_0px_#1A365D] hover:bg-slate-800 active:translate-y-1 transition-all cursor-pointer"
          >
            Cek Hasil
          </button>
        </form>
      </div>

      {/* Feedback Messages */}
      {feedback.status === 'correct' && (
        <div className="p-4 sm:p-5 rounded-2xl bg-[#81C784]/20 border-3 border-[#81C784] shadow-[3px_3px_0px_#1A365D] flex items-start gap-3 text-[#1A365D]">
          <CheckCircle2 className="w-6 h-6 text-[#00796B] shrink-0 mt-0.5" />
          <div>
            <div className="text-sm font-black uppercase tracking-wider text-[#00796B]">Tepat Sekali! 🎉</div>
            <p className="text-xs sm:text-sm font-bold mt-0.5">{feedback.message}</p>
          </div>
        </div>
      )}

      {feedback.status === 'incorrect' && (
        <div className="p-4 sm:p-5 rounded-2xl bg-[#FFF9C4] border-3 border-[#FBC02D] shadow-[3px_3px_0px_#1A365D] flex items-start gap-3 text-[#1A365D]">
          <Lightbulb className="w-6 h-6 text-[#F9A825] shrink-0 mt-0.5" />
          <div>
            <div className="text-sm font-black uppercase tracking-wider text-[#F9A825]">Petunjuk Detektif 💡</div>
            <p className="text-xs sm:text-sm font-bold mt-0.5">{feedback.message}</p>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="pt-4 flex flex-col-reverse sm:flex-row items-center justify-between gap-3 border-t-2 border-[#1A365D]">
        <button
          id="back-to-step2-btn"
          type="button"
          onClick={onBackToStep2}
          className="w-full sm:w-auto px-5 py-3 rounded-2xl border-3 border-[#1A365D] text-[#1A365D] font-black text-xs hover:bg-slate-100 transition-all flex items-center justify-center gap-1.5 shadow-[3px_3px_0px_#1A365D] cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          Pilih Zat Gizi Lain
        </button>

        <button
          id="proceed-to-step4-btn"
          type="button"
          onClick={() => onProceedToStep4(actualDeficit)}
          className="w-full sm:w-auto px-7 py-3.5 bg-[#4DB6AC] text-white font-black rounded-2xl border-3 border-[#1A365D] shadow-[4px_4px_0px_#1A365D] active:translate-y-1 active:shadow-[1px_1px_0px_#1A365D] uppercase tracking-wider text-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <span>Pilih Pangan Pesisir (Langkah 4)</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
