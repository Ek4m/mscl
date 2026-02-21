export const CREATE_WORKOUT_SESSIONS_TABLE = `
      CREATE TABLE IF NOT EXISTS workout_sessions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        user_plan_id INTEGER NOT NULL,
        seconds INTEGER,
        plan_day_id INTEGER NOT NULL,
        started_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
        finished_at TEXT,
        completed INTEGER DEFAULT 0,
        created_at TEXT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `;

export const CREATE_WORKOUT_EXERCISES_TABLE = `
      CREATE TABLE IF NOT EXISTS workout_exercises (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        workout_session_id INTEGER NOT NULL,
        plan_day_exercise_id INTEGER NOT NULL,
        exercise_id INTEGER NOT NULL,
        variation_id INTEGER,
        reps INTEGER,
        order_index INTEGER NOT NULL,
        created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `;

export const CREATE_USER_SESSION_INDEX = `
      CREATE INDEX IF NOT EXISTS idx_sessions_user
      ON workout_sessions (user_id, completed);
    `;

export const CREATE_EXERCISE_SESSION_INDEX = `
      CREATE INDEX IF NOT EXISTS idx_exercises_session
      ON workout_exercises (workout_session_id);
    `;

export const SELECT_WORKOUT_SESSION_FOR_DAY = `
    SELECT * FROM workout_sessions
    WHERE user_id = ?
      AND user_plan_id = ?
      AND plan_day_id = ?
      AND completed = 0
    ORDER BY started_at DESC
    LIMIT 1
    `;

export const INSERT_WORKOUT_SESSION = `
    INSERT INTO workout_sessions (
      user_id,
      user_plan_id,
      plan_day_id,
      started_at,
      completed
    )
    VALUES (?, ?, ?, CURRENT_TIMESTAMP, 0)
    `;

export const SELECT_WORKOUT_EXERCISES_BY_SESSION_ID = `
    SELECT * FROM workout_exercises
    WHERE workout_session_id = ?
    ORDER BY id DESC
    `;

export const SELECT_WORKOUT_EXERCISES = `
    SELECT id, workout_session_id, plan_day_exercise_id, exercise_id, order_index
    FROM workout_exercises
    `;

export const SELECT_WORKOUT_EXERCISE_BY_ID = `
    SELECT * FROM workout_exercises
    WHERE id = ?
    `;

export const INSERT_WORKOUT_EXERCISE = `
    INSERT INTO workout_exercises (
      workout_session_id,
      plan_day_exercise_id,
      exercise_id,
      variation_id,
      order_index,
      reps,
      created_at
    )
    VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
    `;

export const DELETE_WORKOUT_EXERCISE = `
    DELETE FROM workout_exercises
    WHERE id = ?
    `;

export const GET_WORKOUT_SESSIONS_BY_USER = `
      SELECT * FROM workout_sessions WHERE
        user_id = ? AND 
        completed = 1 AND 
        user_plan_id = ?
        ORDER BY id DESC
    `;

export const DROP_WORKOUT_SESSION_TABLE =
  "DROP TABLE IF EXISTS workout_sessions;";

export const DROP_WORKOUT_EXERCISE_TABLE =
  "DROP TABLE IF EXISTS workout_exercises;";

export const COMPLETE_WORKOUT_SESSION = `
    UPDATE workout_sessions
    SET
      completed = 1,
      seconds = ?,
      finished_at = CURRENT_TIMESTAMP
      WHERE id = ?
      AND completed = 0
    `;

export const GET_DONE_SESSION_BY_DAY = `
    SELECT * FROM workout_sessions
    WHERE plan_day_id = ?
      AND completed = 1
    ORDER BY finished_at DESC
    `;
