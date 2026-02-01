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
} from "./queries";
import { WorkoutSessionExercise } from "./types";

export function insertOrCreateWorkoutSession(
  userId: number,
  userPlanId: number,
  planDayId: number,
) {
  console.log(
    "USER ID:",
    userId,
    "USER PLAN ID",
    userPlanId,
    "PLAN DAY ID",
    planDayId,
  );
  const existing = db.getFirstSync<{
    id: number;
  }>(SELECT_WORKOUT_SESSION_FOR_DAY, [userId, userPlanId, planDayId]);
  console.log("___EXISTING",existing)
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
) {
  const result = db.runSync(INSERT_WORKOUT_EXERCISE, [
    workoutSessionId,
    planDayExerciseId,
    exerciseId,
    orderIndex,
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
