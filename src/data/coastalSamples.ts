export interface SampleFoodLabel {
  id: string;
  name: string;
  category: string;
  description: string;
  badge: string;
  mockNutrients: {
    karbohidrat: { amount: number; unit: string; akgPercent: number };
    lemak: { amount: number; unit: string; akgPercent: number };
    natrium: { amount: number; unit: string; akgPercent: number };
    protein: { amount: number; unit: string; akgPercent: number };
  };
  sampleImageSvg: string;
}

export const COASTAL_SAMPLE_SNACKS: SampleFoodLabel[] = [
  {
    id: 'kerupuk-ikan',
    name: 'Kerupuk Ikan Tongkol Gurih Kemasan',
    category: 'Camilan Olahan Pesisir',
    description: 'Camilan kerupuk olahan ikan renyah yang sering dijual di kantin pesisir.',
    badge: 'Tinggi Natrium & Lemak, Rendah Protein',
    mockNutrients: {
      karbohidrat: { amount: 16, unit: 'g', akgPercent: 5 },
      lemak: { amount: 8, unit: 'g', akgPercent: 12 },
      natrium: { amount: 340, unit: 'mg', akgPercent: 23 },
      protein: { amount: 2, unit: 'g', akgPercent: 3 }
    },
    sampleImageSvg: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="200" viewBox="0 0 300 200"><rect width="300" height="200" fill="%230284c7" rx="12"/><text x="150" y="80" fill="white" font-size="18" font-weight="bold" text-anchor="middle" font-family="sans-serif">Kerupuk Ikan Kemasan</text><rect x="40" y="105" width="220" height="60" fill="white" rx="6"/><text x="150" y="130" fill="%230f172a" font-size="12" font-weight="bold" text-anchor="middle" font-family="sans-serif">INFORMASI NILAI GIZI</text><text x="150" y="150" fill="%2364748b" font-size="10" text-anchor="middle" font-family="sans-serif">Takaran Saji: 30g | Energi 140 kkal</text></svg>'
  },
  {
    id: 'mie-instan-kuah',
    name: 'Mie Instan Kuah Seafood',
    category: 'Makanan Siap Saji',
    description: 'Mie instan rasa kuah bumbu laut yang populer saat cuaca berangin.',
    badge: 'Tinggi Natrium & Karbohidrat, Rendah Protein',
    mockNutrients: {
      karbohidrat: { amount: 48, unit: 'g', akgPercent: 15 },
      lemak: { amount: 14, unit: 'g', akgPercent: 21 },
      natrium: { amount: 920, unit: 'mg', akgPercent: 61 },
      protein: { amount: 6, unit: 'g', akgPercent: 10 }
    },
    sampleImageSvg: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="200" viewBox="0 0 300 200"><rect width="300" height="200" fill="%23ea580c" rx="12"/><text x="150" y="80" fill="white" font-size="18" font-weight="bold" text-anchor="middle" font-family="sans-serif">Mie Instan Seafood</text><rect x="40" y="105" width="220" height="60" fill="white" rx="6"/><text x="150" y="130" fill="%230f172a" font-size="12" font-weight="bold" text-anchor="middle" font-family="sans-serif">INFORMASI NILAI GIZI</text><text x="150" y="150" fill="%2364748b" font-size="10" text-anchor="middle" font-family="sans-serif">Natrium 920mg (61% AKG)</text></svg>'
  },
  {
    id: 'biskuit-kelapa',
    name: 'Biskuit Manis Kelapa Pesisir',
    category: 'Biskuit / Camilan Manis',
    description: 'Biskuit manis gurih rasa kelapa sering dibawa untuk bekal sekolah.',
    badge: 'Tinggi Karbohidrat, Rendah Protein',
    mockNutrients: {
      karbohidrat: { amount: 24, unit: 'g', akgPercent: 8 },
      lemak: { amount: 7, unit: 'g', akgPercent: 10 },
      natrium: { amount: 120, unit: 'mg', akgPercent: 8 },
      protein: { amount: 1.5, unit: 'g', akgPercent: 2 }
    },
    sampleImageSvg: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="200" viewBox="0 0 300 200"><rect width="300" height="200" fill="%230d9488" rx="12"/><text x="150" y="80" fill="white" font-size="18" font-weight="bold" text-anchor="middle" font-family="sans-serif">Biskuit Kelapa Pesisir</text><rect x="40" y="105" width="220" height="60" fill="white" rx="6"/><text x="150" y="130" fill="%230f172a" font-size="12" font-weight="bold" text-anchor="middle" font-family="sans-serif">INFORMASI NILAI GIZI</text><text x="150" y="150" fill="%2364748b" font-size="10" text-anchor="middle" font-family="sans-serif">Gula 8g | Protein 1.5g (2% AKG)</text></svg>'
  }
];
