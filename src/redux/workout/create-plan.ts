import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { createApi } from "@reduxjs/toolkit/query/react";

import axiosBaseQuery from "../baseQuery";
import { RootState } from "../root";
import {
  CustomDayPlan,
  CustomPlanCredentials,
  Exercise,
} from "../../modules/workout/types";
import { MuscleGroup } from "../../modules/workout/vault";

export interface CreatePlanState {
  daysCount: number;
  activeDay: number;
  plan: CustomDayPlan[];
  pickerMode: MuscleGroup | "all";
  title: string;
}

const initialState: CreatePlanState = {
  activeDay: 1,
  daysCount: 1,
  pickerMode: "all",
  plan: Array.from({ length: 7 }, (_, i) => ({
    dayNumber: i + 1,
    exercises: [],
  })),
  title: "",
};

export const createPlanApi = createApi({
  reducerPath: "createPlanApi",
  baseQuery: axiosBaseQuery(),
  endpoints: (builder) => ({
    submitCustomPlan: builder.mutation<string[], CustomPlanCredentials>({
      query: (credentials: CustomPlanCredentials) => ({
        url: "workout/plan/custom-create",
        method: "post",
        data: credentials,
      }),
    }),
  }),
});

export const createPlanSlice = createSlice({
  name: "createPlan",
  initialState,
  reducers: {
    addExercise: (state, action: PayloadAction<Exercise>) => {
      const exercise = action.payload;
      const updatedPlan = [...state.plan];
      if (
        updatedPlan[state.activeDay - 1].exercises.some(
          (e) => e.id === exercise.id,
        )
      )
        return;
      updatedPlan[state.activeDay - 1].exercises.push({
        id: exercise.id,
        name: exercise.title,
        muscle: exercise.primaryMuscles,
        reps: "12",
        sets: "4",
      });
      state.plan = updatedPlan;
    },
    removeExercise: (state, action: PayloadAction<number>) => {
      const index = action.payload;
      const updatedPlan = [...state.plan];
      updatedPlan[state.activeDay - 1].exercises.splice(index, 1);
    },
    setActiveDay: (state, action) => {
      state.activeDay = action.payload;
    },
    setDaysCount: (state, action) => {
      state.daysCount = action.payload;
    },
    setPickerMode: (state, action) => {
      state.pickerMode = action.payload;
    },
    setTitle: (state, action) => {
      state.title = action.payload;
    },
    updateMetrics: (
      state,
      action: PayloadAction<{ id: number; sets?: string; reps?: string }>,
    ) => {
      const { id, sets, reps } = action.payload;
      const dayIndex = state.activeDay - 1;
      const index = state.plan[dayIndex].exercises.findIndex(
        (e) => e.id === id,
      );
      if (state.plan[dayIndex].exercises[index]) {
        if (typeof reps === "string")
          state.plan[dayIndex].exercises[index].reps = reps.trim();
        if (typeof sets === "string")
          state.plan[dayIndex].exercises[index].sets = sets.trim();
      }
    },
  },
});

export const selectCreatePlanState = (state: RootState) => state.createPlan;
export const { useSubmitCustomPlanMutation } = createPlanApi;
export const {
  addExercise,
  removeExercise,
  setActiveDay,
  setDaysCount,
  setPickerMode,
  setTitle,
  updateMetrics,
} = createPlanSlice.actions;
export default createPlanSlice.reducer;
