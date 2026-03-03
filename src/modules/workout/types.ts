import { GymLevel } from "../prediction/enums";
import { WorkoutDay, WorkoutExercise, WorkoutPlan } from "../prediction/types";
import { MuscleGroup } from "./vault";

export interface Equipment {
  createdAt: string;
  id: number;
  title: string;
  updatedAt: string;
}

export interface Exercise {
  description: string;
  id: number;
  thumbnail: string;
  primaryMuscles: MuscleGroup[];
  secondaryMuscles: MuscleGroup[];
  steps: string[];
  level: GymLevel;
  title: string;
}

export interface CustomExercise {
  id: number;
  name: string;
  muscle?: MuscleGroup[];
  sets: string;
  variationId?: number;
  reps: string;
}

export interface CustomDayPlan {
  dayIndex: number;
  id: number;
  exercises: WorkoutExercise[];
}

export interface CustomPlanCredentials {
  plan: CustomDayPlan[];
  title: string;
}

export interface CustomPlanDay {
  id: number;
  dayIndex: number;
  title: string | null;
  createdAt: string;
  exercises: CustomPlanDayExercise[];
}

export interface CustomPlanWeeks {
  id: number;
  weekIndex: number;
  days: CustomDayPlan[];
}

export interface CustomPlanDayExercise {
  id: number;
  orderIndex: number;
  targetSets: number;
  targetReps: number;
  variation: Exercise;
  createdAt: string;
}

export interface CustomPlanDetails {
  id: number;
  title: string;
  template?: PremadePlan;
  createdAt: string;
  updatedAt: string;
  weeks: CustomPlanWeeks[];
}

export interface PremadePlanWeek {
  id: number;
  weekNumber: number;
  description: string | null;
  createdAt: string;
  days: WorkoutDay[];
}

export interface PremadePlan {
  id: number;
  title: string;
  thumbnail: string;
  level: GymLevel;
  description: string | null;
  daysPerWeek: number;
  isTemplate: boolean;
  createdAt: string;
  updatedAt: string;
  weeks: PremadePlanWeek[];
}
