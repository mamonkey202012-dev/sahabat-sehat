import { GoogleGenAI } from '@google/genai';

let geminiClient: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI {
  if (!geminiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY environment variable is not configured');
    }
    geminiClient = new GoogleGenAI({ apiKey });
  }
  return geminiClient;
}

export interface AnalyzeLabelParams {
  imageBase64?: string;
  imageMimeType?: string;
  foodName?: string;
  studentName?: string;
}

export async function analyzeNutritionLabel(params: AnalyzeLabelParams) {
  const ai = getGeminiClient();

  const sanitizedFoodName = (params.foodName || 'Makanan Kemasan')
    .slice(0, 100)
    .replace(/[<>{}]/g, '');
  const studentGreeting = (params.studentName || 'Siswa')
    .slice(0, 50)
    .replace(/[<>{}]/g, '');

  const systemInstruction = `Kamu adalah "Sahabat Sehat", asisten dan tutor gizi interaktif untuk siswa kelas 6 SD (Kurikulum Merdeka - PJOK Fase C) di kawasan pesisir Indonesia.
Karaktermu:
- Ramah, hangat, menyemangati, dan sama sekali TIDAK MENGHAKIMI pilihan makanan siswa.
- Menggunakan bahasa Indonesia yang mudah dipahami anak usia 11-12 tahun.
- Patokan ideal 1 kali makan siang/makan utama siswa adalah ~30% AKG (Angka Kecukupan Gizi) sesuai pedoman SIBI PJOK & Pedoman Isi Piringku.
- Fokus pada kearifan pangan lokal pesisir Indonesia (ikan kembung, tongkol, cakalang, daun kelor, kuah asam, kangkung pesisir, teri segar).

TUGAS UTAMA:
1. Analisis gambar Informasi Nilai Gizi kemasan atau estimasikan berdasarkan makanan "${sanitizedFoodName}".
2. Ekstraksi 4 zat gizi wajib:
   - Karbohidrat Total (satuan gram, hitung % AKG)
   - Lemak Total (satuan gram, hitung % AKG)
   - Natrium / Sodium (satuan miligram, hitung % AKG)
   - Protein (satuan gram, hitung % AKG)
   Catatan: Patokan 1x makan ideal adalah 30% AKG.
   Hitung selisih defisit: target (30%) - kandungan kemasan (% AKG). Jika kandungan >= 30%, defisit adalah 0.
3. Untuk SETIAP zat gizi (karbohidrat, lemak, natrium, protein), siapkan tepat 3 rekomendasi pangan lokal pesisir khas Indonesia untuk menutupi kekurangan tersebut atau menyeimbangkannya.
4. Tulis rangkuman ramah (summaryTutor) menyapa ${studentGreeting}, memuji keingintahuannya untuk belajar gizi, dan menyemangatinya melengkapi isi piring makannya.

PENTING KEAMANAN:
Keluarkan HANYA format JSON murni tanpa markdown triple-backtick, tanpa awalan ataupun akhiran teks lain.`;

  const promptText = `Periksa informasi nilai gizi untuk makanan: "${sanitizedFoodName}".
Tolong ekstrak data zat gizi kemasan dan berikan rekomendasi pangan pesisir. Kembalikan dalam format JSON dengan struktur:
{
  "foodName": "${sanitizedFoodName}",
  "servingInfo": "Ukuran takaran saji",
  "nutrients": {
    "karbohidrat": {
      "key": "karbohidrat",
      "label": "Karbohidrat Total",
      "amount": number,
      "unit": "g",
      "akgPercent": number,
      "targetAkg": 30,
      "deficit": number,
      "status": "kurang" | "cukup" | "lebih"
    },
    "lemak": {
      "key": "lemak",
      "label": "Lemak Total",
      "amount": number,
      "unit": "g",
      "akgPercent": number,
      "targetAkg": 30,
      "deficit": number,
      "status": "kurang" | "cukup" | "lebih"
    },
    "natrium": {
      "key": "natrium",
      "label": "Natrium / Garam",
      "amount": number,
      "unit": "mg",
      "akgPercent": number,
      "targetAkg": 30,
      "deficit": number,
      "status": "kurang" | "cukup" | "lebih"
    },
    "protein": {
      "key": "protein",
      "label": "Protein",
      "amount": number,
      "unit": "g",
      "akgPercent": number,
      "targetAkg": 30,
      "deficit": number,
      "status": "kurang" | "cukup" | "lebih"
    }
  },
  "recommendedSolutions": {
    "karbohidrat": [
      {
        "id": "c1",
        "name": "string (nama masakan pesisir)",
        "portion": "string (contoh: 1 mangkuk sedang)",
        "nutrientContribution": "string (contoh: +25% AKG Karbohidrat Sehat)",
        "whyGood": "string (penjelasan bahasa anak)",
        "coastalFact": "string (fakta seru daerah pesisir)",
        "targetNutrientKey": "karbohidrat"
      }
    ],
    "lemak": [ ...3 items ],
    "natrium": [ ...3 items ],
    "protein": [ ...3 items ]
  },
  "summaryTutor": "string pesan hangat untuk siswa"
}`;

  const contents: any[] = [];

  if (params.imageBase64 && params.imageMimeType) {
    contents.push({
      inlineData: {
        data: params.imageBase64,
        mimeType: params.imageMimeType,
      },
    });
  }

  contents.push(promptText);

  let response: any = null;
  const candidateModels = Array.from(
    new Set(
      [
        process.env.GEMINI_MODEL,
        'gemini-3.8-flash',
        'gemini-3.6-flash',
        'gemini-2.0-flash',
      ].filter(Boolean) as string[]
    )
  );

  let lastError: any = null;

  for (const modelName of candidateModels) {
    try {
      console.log(`Attempting Gemini analysis with model: ${modelName}`);
      response = await ai.models.generateContent({
        model: modelName,
        contents: contents,
        config: {
          systemInstruction: systemInstruction,
          temperature: 0.2,
          responseMimeType: 'application/json',
        },
      });
      if (response && response.text) {
        lastError = null;
        break; // Success!
      }
    } catch (apiError: any) {
      lastError = apiError;
      const status = apiError?.status || apiError?.code;
      const msg = apiError?.message || '';
      console.warn(`Model ${modelName} returned status ${status}: ${msg}`);

      // If temporary 503 UNAVAILABLE or 429 rate limit, wait briefly before checking next model
      if (
        status === 503 ||
        status === 429 ||
        msg.includes('high demand') ||
        msg.includes('UNAVAILABLE') ||
        msg.includes('ResourceExhausted')
      ) {
        console.warn(`Temporary high demand on ${modelName}. Waiting 800ms before next attempt...`);
        await new Promise((r) => setTimeout(r, 800));
      }
      // Continue to next model in loop
    }
  }

  // If a model succeeded and returned text, parse it
  if (response && response.text) {
    const rawText = response.text.trim();
    try {
      const cleanedText = rawText.replace(/^```json\s*/i, '').replace(/\s*```$/, '');
      return JSON.parse(cleanedText);
    } catch (err) {
      console.error('Failed to parse Gemini response as JSON:', rawText);
    }
  }

  // RESILIENT FALLBACK: If all cloud models are unavailable (e.g. 503 traffic spike),
  // return an authentic, educational nutritional calculation grounded in Indonesian PJOK curriculum
  console.warn(
    'All Gemini models temporarily unavailable (503/404). Activating smart educational fallback for:',
    sanitizedFoodName
  );

  return generateSmartEducationalFallback(sanitizedFoodName, studentGreeting);
}

/**
 * Educational Fallback Generator based on Indonesian Food Composition (DKBM)
 * and 6th Grade PJOK Coastal Curriculum
 */
function generateSmartEducationalFallback(foodName: string, studentGreeting: string) {
  const lowerName = foodName.toLowerCase();

  let carbs = 20;
  let fat = 8;
  let sodium = 280;
  let protein = 3;

  if (lowerName.includes('mie') || lowerName.includes('mi ') || lowerName.includes('ramen')) {
    carbs = 48;
    fat = 14;
    sodium = 920;
    protein = 6;
  } else if (lowerName.includes('kerupuk') || lowerName.includes('krupuk') || lowerName.includes('kripik') || lowerName.includes('chips')) {
    carbs = 18;
    fat = 10;
    sodium = 380;
    protein = 2;
  } else if (lowerName.includes('biskuit') || lowerName.includes('wafer') || lowerName.includes('roti') || lowerName.includes('kue')) {
    carbs = 28;
    fat = 7;
    sodium = 140;
    protein = 2;
  } else if (lowerName.includes('ikan') || lowerName.includes('seafood') || lowerName.includes('tongkol')) {
    carbs = 8;
    fat = 6;
    sodium = 420;
    protein = 14;
  }

  // Indonesian AKG standard references (approximate 11-12 yo daily reference: Carbs ~300g, Fat ~65g, Sodium ~1500mg, Protein ~60g)
  const akgCarbs = Math.min(100, Math.round((carbs / 300) * 100));
  const akgFat = Math.min(100, Math.round((fat / 65) * 100));
  const akgSodium = Math.min(100, Math.round((sodium / 1500) * 100));
  const akgProtein = Math.min(100, Math.round((protein / 60) * 100));

  const target = 30; // 30% AKG for one main meal

  const getDeficit = (val: number) => Math.max(0, target - val);
  const getStatus = (val: number): 'kurang' | 'cukup' | 'lebih' => {
    if (val < 25) return 'kurang';
    if (val <= 35) return 'cukup';
    return 'lebih';
  };

  return {
    foodName: foodName,
    servingInfo: '1 bungkus / porsi saji standar',
    nutrients: {
      karbohidrat: {
        key: 'karbohidrat',
        label: 'Karbohidrat Total',
        amount: carbs,
        unit: 'g',
        akgPercent: akgCarbs,
        targetAkg: target,
        deficit: getDeficit(akgs(akgCarbs)),
        status: getStatus(akgCarbs),
      },
      lemak: {
        key: 'lemak',
        label: 'Lemak Total',
        amount: fat,
        unit: 'g',
        akgPercent: akgFat,
        targetAkg: target,
        deficit: getDeficit(akgFat),
        status: getStatus(akgFat),
      },
      natrium: {
        key: 'natrium',
        label: 'Natrium / Garam',
        amount: sodium,
        unit: 'mg',
        akgPercent: akgSodium,
        targetAkg: target,
        deficit: getDeficit(akgSodium),
        status: getStatus(akgSodium),
      },
      protein: {
        key: 'protein',
        label: 'Protein',
        amount: protein,
        unit: 'g',
        akgPercent: akgProtein,
        targetAkg: target,
        deficit: getDeficit(akgProtein),
        status: getStatus(akgProtein),
      },
    },
    recommendedSolutions: {
      protein: [
        {
          id: 'fb-p1',
          name: 'Ikan Kembung Bakar Bumbu Kuning',
          portion: '1 ekor ukuran sedang (~80g)',
          nutrientContribution: '+26% AKG Protein Super',
          whyGood: 'Ikan kembung lokal memiliki kandungan Omega-3 dan protein berkualitas yang setara bahkan melebihi salmon!',
          coastalFact: 'Ikan kembung banyak ditangkap oleh nelayan pesisir Nusantara dan harganya sangat terjangkau.',
          targetNutrientKey: 'protein',
        },
        {
          id: 'fb-p2',
          name: 'Pepes Ikan Tongkol Daun Kemangi',
          portion: '1 potong sedang (~75g)',
          nutrientContribution: '+22% AKG Protein Bebas Lemak Jenuh',
          whyGood: 'Dimasak dengan cara dikukus dan dibungkus daun pisang, menjaga keutuhan asam amino protein.',
          coastalFact: 'Ikan tongkol adalah hasil tangkapan utama perahu nelayan tradisional di pantai selatan dan timur.',
          targetNutrientKey: 'protein',
        },
        {
          id: 'fb-p3',
          name: 'Sup Ikan Kuah Asam Segar Pesisir',
          portion: '1 mangkuk kuah bening dengan fillet cakalang/kakap',
          nutrientContribution: '+20% AKG Protein Alami',
          whyGood: 'Segar dan gurih dari rempah alami tanpa santan, sangat mudah diserap tubuh anak usia 11-12 tahun.',
          coastalFact: 'Masakan kuah asam adalah kuliner legendaris masyarakat bahari yang menyegarkan di cuaca terik.',
          targetNutrientKey: 'protein',
        },
      ],
      karbohidrat: [
        {
          id: 'fb-c1',
          name: 'Nasi Merah Pesisir atau Nasi Jagung',
          portion: '1 centong sedang (~100g)',
          nutrientContribution: '+24% AKG Karbohidrat Kompleks',
          whyGood: 'Kaya serat pangan alami yang membuat tubuh berenergi stabil saat berolahraga dan belajar di sekolah.',
          coastalFact: 'Jagung dan beras merah adalah pangan pokok alternatif andalan di berbagai pulau dan pesisir.',
          targetNutrientKey: 'karbohidrat',
        },
        {
          id: 'fb-c2',
          name: 'Singkong Rebus Tabur Kelapa Parut Segar',
          portion: '1 potong sedang (~100g)',
          nutrientContribution: '+20% AKG Karbohidrat Sehat Bebas Gluten',
          whyGood: 'Sumber pati alami yang ramah pencernaan dan memberi stamina beraktivitas fisik.',
          coastalFact: 'Singkong pesisir sering ditanam di kebun pinggir pantai karena tahan terhadap angin laut.',
          targetNutrientKey: 'karbohidrat',
        },
        {
          id: 'fb-c3',
          name: 'Ubi Jalar Ungu Kukus',
          portion: '1 buah ukuran sedang',
          nutrientContribution: '+18% AKG Karbohidrat & Antosianin',
          whyGood: 'Warna ungunya mengandung antioksidan kuat untuk menjaga daya tahan tubuh dari radikal bebas.',
          coastalFact: 'Ubi ungu sering dijadikan bekal melaut oleh para nelayan karena tahan lama dan mengenyangkan.',
          targetNutrientKey: 'karbohidrat',
        },
      ],
      lemak: [
        {
          id: 'fb-l1',
          name: 'Ikan Kembung Kukus Daun Kelor',
          portion: '1 ekor sedang',
          nutrientContribution: '+15% AKG Lemak Baik (Omega-3 DHA & EPA)',
          whyGood: 'Omega-3 adalah lemak tak jenuh ganda esensial untuk kecerdasan otak dan konsentrasi belajar.',
          coastalFact: 'Minyak alami ikan laut tidak menyumbat pembuluh darah, berbeda dengan minyak jelantah gorengan.',
          targetNutrientKey: 'lemak',
        },
        {
          id: 'fb-l2',
          name: 'Tumis Kangkung Minyak Kelapa Murni (VCO)',
          portion: '1 piring sedang',
          nutrientContribution: '+12% AKG Lemak Sehat & Asam Laurat',
          whyGood: 'Minyak kelapa lokal mengandung asam laurat yang membantu memperkuat kekebalan tubuh.',
          coastalFact: 'Pohon kelapa tumbuh melimpah di sepanjang pesisir pantai Indonesia.',
          targetNutrientKey: 'lemak',
        },
        {
          id: 'fb-l3',
          name: 'Lalapan Sambal Dabu-Dabu Minyak Kelapa Segar',
          portion: '2 sendok makan siraman dabu-dabu',
          nutrientContribution: '+10% AKG Lemak Nabati Seimbang',
          whyGood: 'Campuran tomat, bawang merah, cabai, dan perasan jeruk limau memberi lemak nabati segar tanpa digoreng.',
          coastalFact: 'Dabu-dabu adalah sambal segar khas pesisir Sulawesi dan Maluku yang melegenda.',
          targetNutrientKey: 'lemak',
        },
      ],
      natrium: [
        {
          id: 'fb-n1',
          name: 'Sayur Bening Daun Kelor & Jagung Manis',
          portion: '1 mangkuk sedang kuah bening',
          nutrientContribution: 'Kaya Kalium Penyeimbang Garam / Natrium',
          whyGood: 'Daun kelor kaya kalium alami yang membantu tubuh membuang kelebihan natrium dari makanan olahan.',
          coastalFact: 'Pohon kelor dijuluki "Miracle Tree" dan sangat subur tumbuh di pekarangan rumah pesisir.',
          targetNutrientKey: 'natrium',
        },
        {
          id: 'fb-n2',
          name: 'Sup Kuah Asam Segar Rempah Alami',
          portion: '1 mangkuk sedang kuah segar',
          nutrientContribution: 'Rendah Garam, Tinggi Vitamin C Alami',
          whyGood: 'Rasa gurih asam segar didapat dari belimbing wuluh dan asam jawa alami tanpa perlu banyak vetsin.',
          coastalFact: 'Masyarakat pesisir terbiasa menggunakan rempah asam untuk menjaga kesegaran ikan tangkapan.',
          targetNutrientKey: 'natrium',
        },
        {
          id: 'fb-n3',
          name: 'Lalapan Mentimun & Tomat Segar Pesisir',
          portion: '1 piring kecil irisan segar',
          nutrientContribution: 'Kaya Cairan & Mineral Kalium Alami',
          whyGood: 'Kandungan air dan kalium yang tinggi mengembalikan hidrasi tubuh dan menetralkan rasa haus akibat garam.',
          coastalFact: 'Mentimun segar sangat renyah disantap bersama ikan bakar di tepi pantai.',
          targetNutrientKey: 'natrium',
        },
      ],
    },
    summaryTutor: `Halo ${studentGreeting}! Hebat sekali rasa ingin tahumu untuk meneliti makanan "${foodName}"! Karena server AI sedang ramai, Sahabat Sehat menyajikan estimasi cerdas berbasis buku PJOK Fase C & Pedoman Isi Piringku. Pilihanmu sangat menarik untuk diselidiki yuk kita hitung selisih gizinya!`,
  };
}

function akgs(val: number): number {
  return val;
}
