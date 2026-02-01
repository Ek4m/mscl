export type WorkoutSessionExercise = {
  id: number;
  workout_session_id: number;
  plan_day_exercise_id: number;
  exercise_id: number;
  order_index: number;
};

export interface WorkoutSession {
  completed: number;
  finished_at: string;
  id: number;
  plan_day_id: number;
  seconds: number;
  started_at: string;
  user_id: number;
  user_plan_id: number;
}
