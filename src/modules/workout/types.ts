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
  slug: string;
  steps: string[];
  title: string;
  updatedAt: string;
}

export interface CustomExercise {
  id: number;
  name: string;
  muscle?: string;
}

export interface CustomDayPlan {
  dayNumber: number;
  exercises: CustomExercise[];
}
