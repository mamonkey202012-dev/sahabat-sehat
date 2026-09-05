import React, { useState, useRef } from 'react';
import { Camera, Sparkles, X, AlertCircle, Utensils, HelpCircle } from 'lucide-react';
import { UserProfile } from '../types';
import { COASTAL_SAMPLE_SNACKS, SampleFoodLabel } from '../data/coastalSamples';

interface Step1InputProps {
  user: UserProfile;
  foodName: string;
  setFoodName: (name: string) => void;
  imagePreview: string | null;
  setImagePreview: (url: string | null) => void;
  selectedFile: File | null;
  setSelectedFile: (file: File | null) => void;
  onAnalyze: () => void;
  isAnalyzing: boolean;
  error?: string | null;
}

export const Step1Input: React.FC<Step1InputProps> = ({
  user,
  foodName,
  setFoodName,
  imagePreview,
  setImagePreview,
  setSelectedFile,
  onAnalyze,
  isAnalyzing,
  error,
}) => {
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const firstName = user.displayName?.split(' ')[0] || 'Budi';

  const handleFileChange = (file: File) => {
    if (!file) return;

    if (!['image/jpeg', 'image/png', 'image/webp', 'image/jpg'].includes(file.type)) {
      alert('Format foto harus JPG, PNG, atau WebP.');
      return;
    }

    if (file.size > 4 * 1024 * 1024) {
      alert('Ukuran foto maksimal 4MB.');
      return;
    }

    setSelectedFile(file);
    const reader = new FileReader();
    reader.onload = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleSelectSample = (sample: SampleFoodLabel) => {
    setFoodName(sample.name);
    setImagePreview(sample.sampleImageSvg);
    setSelectedFile(null);
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="bg-white rounded-[32px] sm:rounded-[40px] border-4 border-[#1A365D] shadow-[10px_10px_0px_#1A365D] p-6 sm:p-8 space-y-6">
      {/* Friendly Comic Speech Dialogue */}
      <div className="bg-[#E0F2F1] p-5 sm:p-6 rounded-3xl border-3 border-[#1A365D] shadow-[4px_4px_0px_#1A365D]">
        <div className="flex gap-4 items-start">
          <div className="w-13 h-13 sm:w-14 sm:h-14 bg-white rounded-2xl border-3 border-[#1A365D] shrink-0 flex items-center justify-center text-3xl shadow-[3px_3px_0px_#1A365D] transform -rotate-3">
            🐟
          </div>
          <div className="bg-white p-4 rounded-2xl rounded-tl-none border-3 border-[#1A365D] relative shadow-[3px_3px_0px_#1A365D] flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-black uppercase text-[#00796B] tracking-wider">
                Langkah 1: Detektif Gizi
              </span>
            </div>
            <p className="text-sm leading-relaxed text-[#1A365D] font-bold">
              Halo <strong>{firstName}</strong>! Senang sekali belajar bersamamu. Apa makanan atau camilan kemasan yang baru saja kamu nikmati? Yuk kita teliti tabel gizinya!
            </p>
          </div>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-[#FFEBEE] border-3 border-[#D32F2F] text-[#D32F2F] text-sm font-bold flex items-start gap-2.5 shadow-[3px_3px_0px_#1A365D]">
          <AlertCircle className="w-5 h-5 shrink-0 text-[#D32F2F] mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* Food Name Input */}
      <div className="space-y-2">
        <label htmlFor="food-name-input" className="block text-xs sm:text-sm font-black uppercase tracking-wider text-[#1A365D]">
          1. Nama Makanan atau Camilan Kemasan:
        </label>
        <input
          id="food-name-input"
          type="text"
          value={foodName}
          onChange={(e) => setFoodName(e.target.value)}
          placeholder="Contoh: Biskuit Kelapa, Kerupuk Tongkol, Mie Instan..."
          className="w-full px-4 py-3.5 rounded-2xl border-3 border-[#1A365D] focus:outline-none focus:bg-amber-50/50 text-[#1A365D] placeholder:text-slate-400 text-sm font-bold shadow-[4px_4px_0px_#1A365D] transition-all"
        />
      </div>

      {/* Image Upload Area */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="block text-xs sm:text-sm font-black uppercase tracking-wider text-[#1A365D]">
            2. Foto Tabel "Informasi Nilai Gizi" Kemasan:
          </label>
          <span className="text-[11px] font-bold text-slate-500 flex items-center gap-1">
            <HelpCircle className="w-3.5 h-3.5" />
            Maks. 4MB (JPG/PNG)
          </span>
        </div>

        {imagePreview ? (
          <div className="relative rounded-2xl border-3 border-[#1A365D] bg-[#E0F2F1] p-4 flex flex-col sm:flex-row items-center gap-4 shadow-[4px_4px_0px_#1A365D]">
            <img
              src={imagePreview}
              alt="Pratinjau label nilai gizi"
              className="w-44 h-32 object-contain rounded-xl bg-white border-2 border-[#1A365D] p-1 shadow-sm"
            />
            <div className="flex-1 text-center sm:text-left space-y-1">
              <span className="inline-block px-3 py-1 rounded-xl text-xs font-black uppercase bg-[#81C784] text-[#1A365D] border-2 border-[#1A365D]">
                Foto Siap Ditelaah
              </span>
              <p className="text-xs font-bold text-[#1A365D] mt-1">
                Gemini Vision siap mengekstrak Karbohidrat, Lemak, Natrium, & Protein.
              </p>
            </div>
            <button
              id="remove-image-btn"
              onClick={handleRemoveImage}
              className="px-3 py-2 rounded-xl bg-white hover:bg-[#FFEBEE] text-[#D32F2F] text-xs font-black uppercase border-2 border-[#1A365D] shadow-[2px_2px_0px_#1A365D] transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <X className="w-4 h-4" />
              Ganti Foto
            </button>
          </div>
        ) : (
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragActive(true);
            }}
            onDragLeave={() => setDragActive(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-4 border-dashed rounded-3xl p-8 text-center cursor-pointer transition-all ${
              dragActive
                ? 'border-[#00796B] bg-[#E0F2F1]'
                : 'border-[#BDBDBD] hover:border-[#1A365D] bg-[#FAFAFA] hover:bg-amber-50/40'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && handleFileChange(e.target.files[0])}
            />
            <div className="w-14 h-14 rounded-2xl bg-[#FFF9C4] text-[#1A365D] border-3 border-[#1A365D] flex items-center justify-center mx-auto mb-3 shadow-[3px_3px_0px_#1A365D] transform -rotate-3">
              <Camera className="w-7 h-7" />
            </div>
            <p className="text-sm sm:text-base font-black uppercase tracking-wider text-[#1A365D]">
              Klik untuk Ambil / Pilih Foto Label Kemasan
            </p>
            <p className="text-xs font-bold text-slate-500 mt-1">
              Atau seret (drag & drop) gambar tabel nilai gizi ke kotak ini
            </p>
          </div>
        )}
      </div>

      {/* Preset Sample Label Selection */}
      <div className="pt-3 border-t-2 border-[#1A365D]">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-black uppercase tracking-wider text-[#1A365D]">
            Belum ada kemasan? Pilih contoh camilan pesisir:
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {COASTAL_SAMPLE_SNACKS.map((sample, idx) => (
            <button
              key={sample.id}
              type="button"
              onClick={() => handleSelectSample(sample)}
              className={`p-3.5 rounded-2xl text-left bg-white hover:bg-[#FFF9C4] border-3 border-[#1A365D] shadow-[3px_3px_0px_#1A365D] transition-all group cursor-pointer transform ${
                idx % 2 === 0 ? 'hover:-rotate-1' : 'hover:rotate-1'
              }`}
            >
              <div className="text-xs font-black text-[#1A365D] group-hover:text-[#00796B] truncate">
                {sample.name}
              </div>
              <div className="text-[11px] text-[#4DB6AC] font-black mt-0.5">
                {sample.category}
              </div>
              <div className="text-[10px] text-slate-600 font-bold mt-1 line-clamp-1">
                {sample.badge}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Action CTA */}
      <div className="pt-4 flex justify-end">
        <button
          id="analyze-nutrition-btn"
          onClick={onAnalyze}
          disabled={isAnalyzing || (!foodName.trim() && !imagePreview)}
          className="w-full sm:w-auto px-8 py-4 bg-[#4DB6AC] text-white font-black rounded-2xl border-3 border-[#1A365D] border-bottom-8 border-[#00796B] shadow-[4px_6px_0px_#1A365D] active:translate-y-1.5 active:shadow-[1px_1px_0px_#1A365D] uppercase tracking-widest text-base disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-3 cursor-pointer"
          style={{ borderBottomWidth: '7px' }}
        >
          {isAnalyzing ? (
            <>
              <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Menyelam Menganalisis Gizi dengan Gemini... 🐟</span>
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              <span>Analisis Gizi Kemasan (Langkah 2)</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
