export type WorkoutSessionExercise = {
  id: number;
  title: string;
  workoutSessionId: number;
  planDayExerciseId: number;
  reps: number;
  exerciseId: number;
  orderIndex: number;
  createdAt: string;
};

export interface WorkoutSession {
  completed: number;
  finishedAt: string;
  id: number;
  planDayId: number;
  seconds: number;
  startedAt: string;
  userId: number;
  userPlanId: number;
}
