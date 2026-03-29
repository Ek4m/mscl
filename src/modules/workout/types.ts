import { Gender, GymLevel, PlanStatus } from "../prediction/enums";
import { Metric, WorkoutDay, WorkoutExercise } from "../prediction/types";
import { MuscleGroup } from "./vault";

export interface ExerciseType {
  id: number;
  title: string;
}

export interface WorkoutDaySessionExercise {
  id: number;
  reps: number;
  orderIndex: number;
  doneValue: number;
  workoutExerciseId: number;
  extraWeight: number;
  variation: Exercise;
  createdAt: string;
  updatedAt: string;
}

export interface WorkoutDaySession {
  id: number;
  seconds: number;
  startedAt: string;
  finishedAt: string;
  exercises: WorkoutDaySessionExercise[];
}

export interface Exercise {
  description: string;
  id: number;
  thumbnail: string;
  primaryMuscles: MuscleGroup[];
  secondaryMuscles: MuscleGroup[];
  steps: string[];
  level: GymLevel;
  exercise: {
    id: number;
    defaultMetric: Metric;
    isBodyweight: boolean;
    allowsWeight: boolean;
  };
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
  orderIndex: number;
  id: number;
  exercises: WorkoutExercise[];
  sessions?: WorkoutDaySession[];
}

export interface CustomPlanCredentials {
  plan: CustomDayPlan[];
  title: string;
}

export interface CustomPlanDay {
  id: number;
  orderIndex: number;
  title: string | null;
  createdAt: string;
  exercises: CustomPlanDayExercise[];
}

export interface CustomPlanWeeks {
  id: number;
  orderIndex: number;
  days: CustomDayPlan[];
}

export interface CustomPlanDayExercise {
  id: number;
  orderIndex: number;
  targetSets: number;
  targetReps: number;
  targetValue: number;
  variation: Exercise;
  createdAt: string;
  metric: Metric;
}

export interface CustomPlanDetails {
  id: number;
  status: PlanStatus;
  title: string;
  template?: PremadePlan;
  createdAt: string;
  updatedAt: string;
  weeks: CustomPlanWeeks[];
}

export interface PremadePlanWeek {
  id: number;
  orderIndex: number;
  description: string | null;
  createdAt: string;
  days: WorkoutDay[];
}

export interface PremadePlan {
  id: number;
  title: string;
  gender: Gender;
  thumbnail: string;
  level: GymLevel;
  description: string | null;
  daysPerWeek: number;
  createdAt: string;
  updatedAt: string;
  weeks: PremadePlanWeek[];
}
