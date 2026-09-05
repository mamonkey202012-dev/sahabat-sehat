export type UserRole = 'student' | 'teacher' | 'admin';

export interface UserProfile {
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
  role?: UserRole;
  schoolClass?: string;
}

export interface StructuredNutritionLog {
  id?: string;
  student_id: string;
  student_name?: string;
  timestamp: string;
  food_item: string;
  selected_nutrient: string;
  akg_percentage: number;
  deficiency_percentage: number;
  chosen_local_solution: string;
  balanced_status: boolean;
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

export type NotificationEventType =
  | 'CRITICAL_SODIUM_ALERT'
  | 'HIGH_PROTEIN_DEFICIT'
  | 'EXCESS_SUGAR_CARB'
  | 'BALANCED_PLATE_LOGGED';

export type NotificationSeverity = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'INFO';

export interface NotificationPayload {
  notificationId: string;
  timestamp: string;
  eventType: NotificationEventType;
  severity: NotificationSeverity;
  recipient: {
    email: string;
    role: 'teacher' | 'parent' | 'health_officer';
    recipientName?: string;
  };
  student: {
    id: string;
    name: string;
    schoolClass?: string;
  };
  journalEntry: {
    foodName: string;
    selectedNutrient: string;
    akgPercentage: number;
    deficiencyPercentage: number;
    excessPercentage?: number;
    coastalSolutionChosen?: string;
    nutritionalSummary?: any;
  };
  actionRecommendation: {
    summary: string;
    pedagogicalAdvice: string;
    suggestedAction: string;
  };
  metadata: {
    sourceApp: string;
    version: string;
    framework: string;
    dispatchedBy: string;
  };
}

export interface NotificationDispatchResult {
  success: boolean;
  notificationId: string;
  eventType: NotificationEventType;
  status: 'dispatched' | 'simulated_success' | 'failed';
  channel: 'external_webhook' | 'email_simulation';
  destination: string;
  dispatchedAt: string;
  message: string;
  error?: string;
}
