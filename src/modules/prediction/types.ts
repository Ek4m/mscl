import { CustomPlanDayExercise, CustomPlanDetails } from "../workout/types";
import { GymLevel } from "./enums";

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

export interface ActiveExercise extends CustomPlanDayExercise {
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

export interface WorkoutHistoryCredentials {
  planId: number;
  userId: number;
  dayId: number;
  exercises: { completedSteps: number; moveId: number }[];
  duration: number;
}

export interface GenPlanCredentials {
  equipments: string[];
  level: GymLevel;
  numOfDays: number;
}

export interface GymHistoryItem {
  id: number;
  user_id: number;
  plan_id: number;
  day_id: number;
  duration: number;
  created_at: string; 
}