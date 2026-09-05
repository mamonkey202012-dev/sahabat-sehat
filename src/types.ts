export interface UserProfile {
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
}

export type NutrientKey = 'karbohidrat' | 'lemak' | 'natrium' | 'protein';

export interface NutrientItem {
  key: NutrientKey;
  label: string;
  amount: number;
  unit: string;
  akgPercent: number;
  targetAkg: number; // 30% AKG
  deficit: number; // 30 - akgPercent (bounded >= 0)
  status: 'kurang' | 'cukup' | 'lebih';
}

export interface CoastalRecommendation {
  id: string;
  name: string;
  portion: string;
  nutrientContribution: string;
  whyGood: string;
  coastalFact: string;
  targetNutrientKey: NutrientKey;
}

export interface NutritionAnalysisResponse {
  foodName: string;
  servingInfo: string;
  nutrients: {
    karbohidrat: NutrientItem;
    lemak: NutrientItem;
    natrium: NutrientItem;
    protein: NutrientItem;
  };
  recommendedSolutions: Record<NutrientKey, CoastalRecommendation[]>;
  summaryTutor: string;
}

export interface FoodLogEntry {
  id?: string;
  timestamp: any;
  foodName: string;
  imageUrl?: string;
  nutritionalData: {
    karbohidrat: { amount: number; unit: string; akgPercent: number };
    lemak: { amount: number; unit: string; akgPercent: number };
    natrium: { amount: number; unit: string; akgPercent: number };
    protein: { amount: number; unit: string; akgPercent: number };
  };
  selectedNutrient: string;
  selectedNutrientKey: NutrientKey;
  deficit: number;
  localFoodSolution: string;
  studentReflection?: string;
  userId: string;
}
