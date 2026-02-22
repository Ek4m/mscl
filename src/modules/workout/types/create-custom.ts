import { MuscleGroup } from "../vault";

export interface CustomCreateExerciseEntry {
  id: number;
  instanceId: string;
  name: string;
  sets: string;
  reps: string;
  muscleGroups: MuscleGroup[];
  variationId?: number;
}

export interface CustomCreateDailySession {
  dayIndex: number;
  exercises: CustomCreateExerciseEntry[];
}

export interface CustomCreateWeeklyPlan {
  weekNumber: number;
  days: CustomCreateDailySession[];
}

// Data shape for the API request
export interface CustomCreatePlanSubmission {
  title: string;
  weeksCount: number;
  daysPerWeek: number;
  plan: CustomCreateWeeklyPlan[];
}

export interface CustomCreatePlanState extends CustomCreatePlanSubmission {
  activeWeek: number;
  activeDay: number;
  pickerMode: MuscleGroup | "all";
}
