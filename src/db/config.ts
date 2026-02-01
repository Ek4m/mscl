import * as SQLite from "expo-sqlite";

export const db = SQLite.openDatabaseSync("test1.db");

export function initDb() {
  try {
    // Foreign keys ON (safe even if you don't use them)
    db.execSync(`PRAGMA foreign_keys = ON;`);

    // WAL mode → Android supports it, iOS may silently ignore
    try {
      db.execSync(`PRAGMA journal_mode = WAL;`);
    } catch {
      console.log("WAL not supported, continuing without it");
    }
    db.execSync(`
      CREATE TABLE IF NOT EXISTS workout_sessions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        user_plan_id INTEGER NOT NULL,
        plan_day_id INTEGER NOT NULL,
        started_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
        finished_at TEXT,
        completed INTEGER DEFAULT 0
      );
    `);
    db.execSync(`
      CREATE TABLE IF NOT EXISTS workout_exercises (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        workout_session_id INTEGER NOT NULL,
        plan_day_exercise_id INTEGER NOT NULL,
        exercise_id INTEGER NOT NULL,
        order_index INTEGER NOT NULL
      );
    `);

    // ---- workout_sets ----
    db.execSync(`
      CREATE TABLE IF NOT EXISTS workout_sets (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        workout_exercise_id INTEGER NOT NULL,
        set_index INTEGER NOT NULL,
        weight REAL,
        reps INTEGER,
        rir INTEGER,
        completed INTEGER DEFAULT 1,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // ---- indexes (important for performance) ----
    db.execSync(`
      CREATE INDEX IF NOT EXISTS idx_sessions_user
      ON workout_sessions (user_id, completed);
    `);

    db.execSync(`
      CREATE INDEX IF NOT EXISTS idx_exercises_session
      ON workout_exercises (workout_session_id);
    `);

    db.execSync(`
      CREATE INDEX IF NOT EXISTS idx_sets_exercise
      ON workout_sets (workout_exercise_id);
    `);

    console.log("✅ SQLite DB initialized");
  } catch (err) {
    console.error("❌ DB init failed", err);
    throw err;
  }
}
