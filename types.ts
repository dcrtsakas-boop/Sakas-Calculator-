
export interface NutritionInfo {
  foodName: string;
  calories: number;
  proteins: number;
  carbs: number;
  fats: number;
  confidence: number;
  description: string;
}

export interface DailyNeeds {
  calories: number;
  proteins: number;
  carbs: number;
  fats: number;
}

export type AppMode = 'ANALYZE' | 'CALCULATE' | 'HISTORY';

export interface UserStats {
  weight: number;
  height: number;
  age: number;
  gender: 'male' | 'female';
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'extra';
  goal: 'lose' | 'maintain' | 'gain';
}

export type HistoryItemType = 'PHOTO' | 'CALCULATION';

export interface HistoryItem {
  id: string;
  type: HistoryItemType;
  timestamp: number;
  data: NutritionInfo | (DailyNeeds & { stats: UserStats });
}
