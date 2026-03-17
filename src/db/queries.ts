export const CREATE_WORKOUT_SESSIONS_TABLE = `
      CREATE TABLE IF NOT EXISTS workout_sessions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        userId INTEGER NOT NULL,
        userPlanId INTEGER NOT NULL,
        seconds INTEGER,
        planDayId INTEGER NOT NULL,
        startedAt TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
        finishedAt TEXT,
        completed INTEGER DEFAULT 0,
        createdAt TEXT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `;

export const CREATE_WORKOUT_EXERCISES_TABLE = `
      CREATE TABLE IF NOT EXISTS workout_exercises (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        workoutSessionId INTEGER NOT NULL,
        planDayExerciseId INTEGER NOT NULL,
        exerciseId INTEGER NOT NULL,
        reps INTEGER,
        orderIndex INTEGER NOT NULL,
        doneValue INTEGER NOT NULL,
        extraWeight INTEGER,
        createdAt TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updatedAt TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `;

export const CREATE_USER_SESSION_INDEX = `
      CREATE INDEX IF NOT EXISTS idx_sessions_user
      ON workout_sessions (userId, completed);
    `;

export const CREATE_EXERCISE_SESSION_INDEX = `
      CREATE INDEX IF NOT EXISTS idx_exercises_session
      ON workout_exercises (workoutSessionId);
    `;

export const SELECT_WORKOUT_SESSION_FOR_DAY = `
    SELECT * FROM workout_sessions
    WHERE userId = ?
      AND userPlanId = ?
      AND planDayId = ?
      AND completed = 0
    ORDER BY startedAt DESC
    LIMIT 1
    `;

export const INSERT_WORKOUT_SESSION = `
    INSERT INTO workout_sessions (
      userId,
      userPlanId,
      planDayId,
      startedAt,
      completed
    )
    VALUES (?, ?, ?, CURRENT_TIMESTAMP, 0)
    `;

export const SELECT_WORKOUT_EXERCISES_BY_SESSION_ID = `
    SELECT * FROM workout_exercises
    WHERE workoutSessionId = ?
    ORDER BY id DESC
    `;

export const SELECT_WORKOUT_EXERCISES = `
    SELECT id, workoutSessionId, planDayExerciseId, exerciseId, orderIndex
    FROM workout_exercises
    `;

export const SELECT_WORKOUT_EXERCISE_BY_ID = `
    SELECT * FROM workout_exercises
    WHERE id = ?
    `;

export const INSERT_WORKOUT_EXERCISE = `
    INSERT INTO workout_exercises (
      workoutSessionId,
      planDayExerciseId,
      exerciseId,
      orderIndex,
      reps,
      doneValue,
      extraWeight,
      createdAt
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
    `;

export const DELETE_WORKOUT_EXERCISE = `
    DELETE FROM workout_exercises
    WHERE id = ?
    `;

export const GET_WORKOUT_SESSIONS_BY_USER = `
      SELECT * FROM workout_sessions WHERE
        userId = ? AND 
        completed = 1 AND 
        userPlanId = ?
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
      finishedAt = CURRENT_TIMESTAMP
      WHERE id = ?
      AND completed = 0
    `;

export const GET_DONE_SESSION_BY_DAY = `
    SELECT * FROM workout_sessions
    WHERE planDayId = ?
      AND completed = 1
    ORDER BY finishedAt DESC
    `;

export const GET_SESSIONS_AND_EXERCISES_BY_PLAN = `
SELECT 
    s.id AS sessionId,
    s.startedAt,
    s.finishedAt,
    s.completed,
    s.seconds,
    s.userPlanId,
    s.planDayId,
    e.planDayExerciseId AS exerciseResultId,
    e.exerciseId,
    e.reps,
    e.doneValue,
    e.extraWeight,
    e.orderIndex
FROM workout_sessions s
LEFT JOIN workout_exercises e ON s.id = e.workoutSessionId
WHERE s.userPlanId = ?
ORDER BY s.startedAt DESC, e.orderIndex ASC;
`;
