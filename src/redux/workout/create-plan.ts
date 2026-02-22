import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { createApi } from "@reduxjs/toolkit/query/react";
import axiosBaseQuery from "../baseQuery";
import { RootState } from "../root";
import { MuscleGroup } from "../../modules/workout/vault";
import {
  CustomCreateDailySession,
  CustomCreatePlanState,
  CustomCreatePlanSubmission,
  CustomCreateWeeklyPlan,
} from "../../modules/workout/types/create-custom";

const createEmptySession = (dayNum: number): CustomCreateDailySession => ({
  dayIndex: dayNum,
  exercises: [],
});

const createEmptyWeek = (weekNum: number): CustomCreateWeeklyPlan => ({
  weekNumber: weekNum,
  days: Array.from({ length: 7 }, (_, i) => createEmptySession(i + 1)),
});

const initialState: CustomCreatePlanState = {
  title: "",
  weeksCount: 1,
  daysPerWeek: 3,
  activeWeek: 1,
  activeDay: 1,
  pickerMode: "all",
  plan: [createEmptyWeek(1)],
};

export const createPlanApi = createApi({
  reducerPath: "createPlanApi",
  baseQuery: axiosBaseQuery(),
  endpoints: (builder) => ({
    submitCustomPlan: builder.mutation<any, CustomCreatePlanSubmission>({
      query: (data) => ({
        url: "workout/plan/custom-create",
        method: "post",
        data,
      }),
    }),
  }),
});

export const createPlanSlice = createSlice({
  name: "createPlan",
  initialState,
  reducers: {
    setWeeksCount: (state, action: PayloadAction<number>) => {
      const newCount = action.payload;
      if (newCount > state.plan.length) {
        for (let i = state.plan.length + 1; i <= newCount; i++) {
          state.plan.push(createEmptyWeek(i));
        }
      } else {
        state.plan = state.plan.slice(0, newCount);
      }
      state.weeksCount = newCount;
      if (state.activeWeek > newCount) state.activeWeek = newCount;
    },

    setDaysPerWeek: (state, action: PayloadAction<number>) => {
      state.daysPerWeek = action.payload;
      if (state.activeDay > action.payload) state.activeDay = action.payload;
    },

    addExercise: (
      state,
      action: PayloadAction<{ exercise: any; variationId?: number }>,
    ) => {
      const { exercise, variationId } = action.payload;
      const weekIdx = state.activeWeek - 1;
      const dayIdx = state.activeDay - 1;

      state.plan[weekIdx].days[dayIdx].exercises.push({
        id: exercise.id,
        instanceId: `${Date.now()}-${Math.random()}`,
        name: exercise.title || exercise.name,
        muscleGroups: exercise.primaryMuscles || [],
        reps: "12",
        sets: "4",
        variationId,
      });
    },

    removeExercise: (state, action: PayloadAction<string>) => {
      const instId = action.payload;
      const weekIdx = state.activeWeek - 1;
      const dayIdx = state.activeDay - 1;

      state.plan[weekIdx].days[dayIdx].exercises = state.plan[weekIdx].days[
        dayIdx
      ].exercises.filter((ex) => ex.instanceId !== instId);
    },

    updateMetrics: (
      state,
      action: PayloadAction<{
        instanceId: string;
        sets?: string;
        reps?: string;
      }>,
    ) => {
      const { instanceId, sets, reps } = action.payload;
      const weekIdx = state.activeWeek - 1;
      const dayIdx = state.activeDay - 1;

      const ex = state.plan[weekIdx].days[dayIdx].exercises.find(
        (e) => e.instanceId === instanceId,
      );
      if (ex) {
        if (sets !== undefined) ex.sets = sets;
        if (reps !== undefined) ex.reps = reps;
      }
    },

    setActiveWeek: (state, action: PayloadAction<number>) => {
      state.activeWeek = action.payload;
    },

    reset: (state) => {
      state = initialState;
    },

    setActiveDay: (state, action: PayloadAction<number>) => {
      state.activeDay = action.payload;
    },

    setPickerMode: (state, action: PayloadAction<MuscleGroup | "all">) => {
      state.pickerMode = action.payload;
    },

    setTitle: (state, action: PayloadAction<string>) => {
      state.title = action.payload;
    },
  },
});

export const { useSubmitCustomPlanMutation } = createPlanApi;

export const {
  setWeeksCount,
  setDaysPerWeek,
  addExercise,
  removeExercise,
  updateMetrics,
  setActiveWeek,
  reset,
  setActiveDay,
  setPickerMode,
  setTitle,
} = createPlanSlice.actions;

export const selectCreatePlanState = (state: RootState) => state.createPlan;

export default createPlanSlice.reducer;
