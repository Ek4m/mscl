import { GymLevel } from './enums';

export interface PredictionResult {
  isLoading: boolean;
  predictions: string[];
}

export interface Exercise {
  id: number;
  name: string;
  sets: number;
  reps: string;
  notes?: string;
}

export interface ActiveExercise extends Exercise {
  completedSets: boolean[];
}

export interface WorkoutDay {
  id: number;
  title: string;
  moves: Exercise[];
}
export interface WorkoutPlanPreview {
  id: number;
  title: string;
  level: string;
}
export interface WorkoutPlan extends WorkoutPlanPreview {
  days: WorkoutDay[];
}

export interface WorkoutHistoryEntry {
  id?: number;
  plan_title: string;
  date: string;
  total_duration_seconds: number;
}

export interface GenPlanCredentials {
  equipments: string[];
  level: GymLevel;
  numOfDays: number;
}
