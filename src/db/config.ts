import { openDatabaseSync } from "expo-sqlite";

import {
  CREATE_EXERCISE_SESSION_INDEX,
  CREATE_USER_SESSION_INDEX,
  CREATE_WORKOUT_EXERCISES_TABLE,
  CREATE_WORKOUT_SESSIONS_TABLE,
} from "./queries";

export const db = openDatabaseSync("test120.db");

export function initDb() {
  try {
    db.execSync(`PRAGMA foreign_keys = ON;`);
    try {
      db.execSync(`PRAGMA journal_mode = WAL;`);
    } catch {
      console.log("WAL not supported, continuing without it");
    }
    db.execSync(CREATE_WORKOUT_SESSIONS_TABLE);
    db.execSync(CREATE_WORKOUT_EXERCISES_TABLE);
    db.execSync(CREATE_USER_SESSION_INDEX);
    db.execSync(CREATE_EXERCISE_SESSION_INDEX);

    console.log("✅ SQLite DB initialized");
  } catch (err) {
    console.error("❌ DB init failed", err);
    throw err;
  }
}
