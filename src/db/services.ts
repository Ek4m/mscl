import { db } from "./config";
import {
  DROP_WORKOUT_EXERCISE_TABLE,
  DROP_WORKOUT_SESSION_TABLE,
  COMPLETE_WORKOUT_SESSION,
  DELETE_WORKOUT_EXERCISE,
  INSERT_WORKOUT_EXERCISE,
  INSERT_WORKOUT_SESSION,
  SELECT_WORKOUT_EXERCISE_BY_ID,
  SELECT_WORKOUT_EXERCISES_BY_SESSION_ID,
  SELECT_WORKOUT_SESSION_FOR_DAY,
  GET_WORKOUT_SESSIONS_BY_USER,
  GET_DONE_SESSION_BY_DAY,
} from "./queries";
import { WorkoutSession, WorkoutSessionExercise } from "./types";

export function insertOrCreateWorkoutSession(
  userId: number,
  userPlanId: number,
  planDayId: number,
) {
  const existing = db.getFirstSync<{
    id: number;
  }>(SELECT_WORKOUT_SESSION_FOR_DAY, [userId, userPlanId, planDayId]);
  if (existing?.id) return existing.id;
  const result = db.runSync(INSERT_WORKOUT_SESSION, [
    userId,
    userPlanId,
    planDayId,
  ]);
  return result.lastInsertRowId;
}

export function clearWorkoutDbDev() {
  if (!__DEV__) {
    console.warn("Clearing workout db blocked outside dev mode");
    return;
  }
  try {
    db.execSync(DROP_WORKOUT_SESSION_TABLE);
    db.execSync(DROP_WORKOUT_EXERCISE_TABLE);
    console.log("🧹 DEV: Workout DB cleared");
  } catch (err) {
    console.error("❌ DEV: Failed to clear workout DB", err);
    throw err;
  }
}

export function getWorkoutExercises(
  workoutSessionId: number,
): WorkoutSessionExercise[] {
  return db.getAllSync<WorkoutSessionExercise>(
    SELECT_WORKOUT_EXERCISES_BY_SESSION_ID,
    [workoutSessionId],
  );
}

export function getWorkoutExerciseByid(
  exerciseId: number,
): WorkoutSessionExercise | null {
  return db.getFirstSync<WorkoutSessionExercise>(
    SELECT_WORKOUT_EXERCISE_BY_ID,
    exerciseId,
  );
}

export function createWorkoutExercise(
  workoutSessionId: number,
  planDayExerciseId: number,
  exerciseId: number,
  orderIndex: number,
  variationId?: number | null,
  reps: number = 0,
) {
  const result = db.runSync(INSERT_WORKOUT_EXERCISE, [
    workoutSessionId,
    planDayExerciseId,
    exerciseId,
    variationId || null,
    orderIndex,
    reps
  ]);
  return getWorkoutExerciseByid(result.lastInsertRowId);
}

export function removeWorkoutExercise(exerciseId: number) {
  const result = db.runSync(DELETE_WORKOUT_EXERCISE, [exerciseId]);
  return result.changes;
}

export function finishWorkoutSession(
  workoutSessionId: number,
  duration: number,
): number {
  const result = db.runSync(COMPLETE_WORKOUT_SESSION, [
    duration,
    workoutSessionId,
  ]);
  return result.changes;
}

export function getDoneSessionByDay(dayId: number): WorkoutSession | null {
  const result = db.getFirstSync<WorkoutSession>(GET_DONE_SESSION_BY_DAY, [
    dayId,
  ]);
  return result;
}

export function getWorkoutSessionsByUser(
  userId: number,
  planId: number,
): WorkoutSession[] {
  return db.getAllSync(GET_WORKOUT_SESSIONS_BY_USER, [userId, planId]);
}
