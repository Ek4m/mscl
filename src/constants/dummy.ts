import { WorkoutPlan } from "../modules/prediction/types";

export const plan: WorkoutPlan = {
  id: 1,
  title: "Full Body Starter",
  level: "Beginner",
  days: [
    {
      id: 19,
      title: "Day 1 – Full Body",
      moves: [
        { id: 1, name: "Bodyweight Squats", sets: 3, reps: "12–15" },
        { id: 1, name: "Push-Ups", sets: 3, reps: "8–12" },
        { id: 1, name: "Lat Pulldown", sets: 3, reps: "10–12" },
        { id: 1, name: "Dumbbell Shoulder Press", sets: 3, reps: "10–12" },
        {
          id: 3,
          name: "Plank",
          sets: 3,
          reps: "30–45 sec",
          notes: "Keep core tight",
        },
      ],
    },
    {
      id: 3,
      title: "Day 2 – Rest",
      moves: [],
    },
    {
      id: 10,
      title: "Day 3 – Full Body",
      moves: [
        { id: 5, name: "Leg Press", sets: 3, reps: "10–12" },
        { id: 6, name: "Dumbbell Bench Press", sets: 3, reps: "10–12" },
        { id: 7, name: "Seated Cable Row", sets: 3, reps: "10–12" },
        { id: 9, name: "Dumbbell Bicep Curl", sets: 3, reps: "12–15" },
        { id: 8, name: "Triceps Rope Pushdown", sets: 3, reps: "12–15" },
      ],
    },
  ],
};
