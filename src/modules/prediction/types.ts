import { WorkoutSessionExercise } from "../../db/types";
import {
  CustomPlanDayExercise,
  CustomPlanDetails,
  Exercise,
} from "../workout/types";
import { Gender, GymLevel } from "./enums";

export interface PredictionResult {
  isLoading: boolean;
  predictions: string[];
}

export interface ActiveExercise extends CustomPlanDayExercise {
  completedSets: (WorkoutSessionExercise | null)[];
}

export interface WorkoutExercise {
  variation: Exercise;
  orderIndex: number;
  id: number;
  targetSets: number;
  targetReps: number;
}

export interface WorkoutDay {
  id: number;
  title: string;
  dayIndex: number;
  exercises: WorkoutExercise[];
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
  gender: Gender;
  weeks: number;
  level: GymLevel;
  numOfDays: number;
}
