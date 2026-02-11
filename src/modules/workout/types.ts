import { MuscleGroup } from "./vault";

export interface Equipment {
  createdAt: string;
  id: number;
  title: string;
  updatedAt: string;
}

export interface Exercise {
  createdAt: string;
  description: string;
  id: number;
  primaryMuscles: MuscleGroup[];
  secondaryMuscles: MuscleGroup[];
  variations: { title: string; id: number; description: string }[];
  slug: string;
  steps: string[];
  title: string;
  variationId?: number;
  updatedAt: string;
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
  dayNumber: number;
  exercises: CustomExercise[];
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

export interface CustomPlanDayExercise {
  id: number;
  orderIndex: number;
  targetSets: number;
  targetReps: number;
  variation?: { id: number; title: string };
  createdAt: string;
  exercise: Exercise;
}

export interface CustomPlanDetails {
  id: number;
  title: string;
  createdAt: string;
  updatedAt: string;
  days: CustomPlanDay[];
}
