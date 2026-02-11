import { WorkoutSessionExercise } from "../../db/types";
import { CustomPlanDayExercise, CustomPlanDetails } from "../workout/types";
import { GymLevel } from "./enums";

export interface PredictionResult {
  isLoading: boolean;
  predictions: string[];
}

export interface Exercise {
  id: number;
  title: string;
  targetSets: number;
  targetReps: number;
  notes?: string;
}

export interface ActiveExercise extends CustomPlanDayExercise {
  completedSets: (WorkoutSessionExercise | null)[];
}

export interface WorkoutDay {
  id: number;
  title: string;
  exercises: Exercise[];
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
  sessionId: number;
  duration: number;
}

export interface GenPlanCredentials {
  equipments: string[];
  level: GymLevel;
  numOfDays: number;
}