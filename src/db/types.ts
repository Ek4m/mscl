export type WorkoutSessionExercise = {
  id: number;
  title: string;
  workout_session_id: number;
  plan_day_exercise_id: number;
  exercise_id: number;
  variation_id: number | null;
  order_index: number;
  created_at: string;
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
