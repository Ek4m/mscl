import {
  GymHistoryItem,
  WorkoutHistoryCredentials,
} from "../modules/prediction/types";
import { db } from "./config";

export async function saveWorkoutHistory(
  data: WorkoutHistoryCredentials,
): Promise<number> {
  try {
    let workoutId: number | null = null;

    await db.withTransactionAsync(async () => {
      const result = await db.runAsync(
        `INSERT INTO workout_history (plan_id, user_id, day_id, duration) VALUES (?, ?, ?, ?)`,
        [data.planId, data.userId, data.dayId, data.duration],
      );
      workoutId = result.lastInsertRowId;
      for (const exercise of data.exercises) {
        await db.runAsync(
          `INSERT INTO workout_history_exercises (workout_history_id, move_id, completed_steps) VALUES (?, ?, ?)`,
          [workoutId, exercise.moveId, exercise.completedSteps],
        );
      }
    });
    if (workoutId === null) throw new Error("Failed to retrieve workout ID");
    console.log(`Workout history saved with ID: ${workoutId}`);
    return workoutId;
  } catch (error) {
    console.error("Error saving workout history:", error);
    throw error;
  }
}

export const getUsersWorkoutHistory = async (
  userId: number,
  planId: number,
): Promise<GymHistoryItem[]> => {
  const response: GymHistoryItem[] = await db.getAllAsync(
    `SELECT * from workout_history WHERE user_id=${userId} AND plan_id=${planId}`,
  );
  return response;
};
