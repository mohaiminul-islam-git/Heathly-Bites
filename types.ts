export enum ViewState {
  HOME = 'HOME',
  RECIPE_GENERATOR = 'RECIPE_GENERATOR',
  NUTRITION_ANALYZER = 'NUTRITION_ANALYZER',
  HEALTH_ASSISTANT = 'HEALTH_ASSISTANT',
  WELLNESS_PLANNER = 'WELLNESS_PLANNER'
}

export interface MacroNutrients {
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
}

export interface Recipe {
  title: string;
  description: string;
  ingredients: string[];
  instructions: string[];
  cookingTime: string;
  difficulty: string;
  macros: MacroNutrients;
}

export interface NutritionAnalysis {
  foodItem: string;
  summary: string;
  macros: MacroNutrients;
  healthRating: number; // 1-10
  suggestions: string[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

export interface WorkoutDay {
  day: string;
  focus: string;
  exercises: string[];
  duration: string;
}

export interface MealGuide {
  breakfast: string;
  lunch: string;
  dinner: string;
  snack: string;
}

export interface WellnessPlan {
  summary: string;
  targetMacros: MacroNutrients;
  weeklySchedule: WorkoutDay[];
  mealGuide: MealGuide;
  hydrationGoal: string; // e.g., "2.5 Liters"
  sleepGoal: string; // e.g., "7-8 Hours"
}