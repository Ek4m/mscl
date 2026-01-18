import * as SQLite from "expo-sqlite";

export const db = SQLite.openDatabaseSync("test1.db");

export async function initWorkoutTables(): Promise<void> {
  try {
    await db.execAsync(`
      PRAGMA foreign_keys = ON;

      CREATE TABLE IF NOT EXISTS workout_history (
        id           INTEGER PRIMARY KEY AUTOINCREMENT,
        plan_id      INTEGER NOT NULL,
        user_id      INTEGER NOT NULL,
        day_id       INTEGER NOT NULL,
        duration     INTEGER NOT NULL,
        created_at   TEXT DEFAULT (datetime('now'))
      );

      CREATE TABLE IF NOT EXISTS workout_history_exercises (
        id                  INTEGER PRIMARY KEY AUTOINCREMENT,
        workout_history_id  INTEGER NOT NULL,
        move_id             INTEGER NOT NULL,
        completed_steps     INTEGER NOT NULL DEFAULT 0,
        FOREIGN KEY (workout_history_id) 
          REFERENCES workout_history(id) 
          ON DELETE CASCADE
      );
    `);

    console.log("Workout history tables initialized successfully.");
  } catch (error) {
    console.error("Failed to initialize workout tables:", error);
    throw error;
  }
}
