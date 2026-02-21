import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { createApi } from "@reduxjs/toolkit/query/react";
import { ImagePickerAsset } from "expo-image-picker";

import axiosBaseQuery from "../baseQuery";
import { RootState } from "../root";
import { Gender, GymLevel } from "../../modules/prediction/enums";
import {
  GenPlanCredentials,
  WorkoutPlan,
} from "../../modules/prediction/types";
import { CustomPlanDetails, Equipment, Exercise } from "../../modules/workout/types";

export interface PredictSliceState {
  predictions: string[];
  selectedPredictions: string[];
  isFetching: boolean;
  files: ImagePickerAsset[];
  started: boolean;
  level: GymLevel;
  equipments: Equipment[];
  exercises: Exercise[];
  gender: Gender;
  weeks: number;
  days: number;
}

const initialState: PredictSliceState = {
  predictions: [],
  selectedPredictions: [],
  isFetching: true,
  files: [],
  gender: Gender.MALE,
  started: false,
  level: GymLevel.INTERMEDIATE,
  equipments: [],
  exercises: [],
  weeks: 4,
  days: 3,
};

export const predictApi = createApi({
  reducerPath: "predictApi",
  baseQuery: axiosBaseQuery(),
  endpoints: (builder) => ({
    getProfile: builder.query<WorkoutPlan[], void>({
      query: () => ({ url: "workout/plans", method: "get" }),
    }),
    getInitialInfo: builder.query<
      { exercises: Exercise[]; equipments: Equipment[] },
      void
    >({
      query: () => ({ url: "common/exercises-and-equipments", method: "get" }),
    }),
    sendImages: builder.mutation<string[], FormData>({
      query: (credentials: FormData) => ({
        url: "workout/detect",
        method: "post",
        data: credentials,
        headers: { "Content-Type": "multipart/form-data" },
      }),
    }),
    generatePlan: builder.mutation<CustomPlanDetails, GenPlanCredentials>({
      query: (credentials: GenPlanCredentials) => ({
        url: "workout/generate-program",
        method: "post",
        data: credentials,
      }),
    }),
  }),
});

export const predictSlice = createSlice({
  name: "prediction",
  initialState,
  reducers: {
    reset: (state) => {
      state = initialState;
    },
    closeAnalyzing: (state) => {
      state.isFetching = false;
    },
    addFile: (state, action: PayloadAction<ImagePickerAsset>) => {
      state.files.push(action.payload);
    },
    startAIPlanning: (state) => {
      state.started = true;
    },
    removeFile: (state, action: PayloadAction<number>) => {
      state.files = state.files.filter((_, index) => index !== action.payload);
    },
    addToSelected: (state, action: PayloadAction<string | string[]>) => {
      state.selectedPredictions = [
        ...state.selectedPredictions,
        ...(typeof action.payload === "string"
          ? [action.payload]
          : action.payload),
      ];
    },
    removeFromSelectedPredictions: (state, action: PayloadAction<string>) => {
      state.selectedPredictions = state.selectedPredictions.filter(
        (item) => item !== action.payload,
      );
    },
    setLevel: (state, action: PayloadAction<GymLevel>) => {
      state.level = action.payload;
    },
    setDays: (state, action: PayloadAction<number>) => {
      state.days = action.payload;
    },
    setWeeks: (state, action: PayloadAction<number>) => {
      state.weeks = action.payload;
    },
    setGender: (state, action: PayloadAction<Gender>) => {
      state.gender = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      predictApi.endpoints.sendImages.matchRejected,
      (state) => {
        state.isFetching = false;
      },
    );
    builder.addMatcher(
      predictApi.endpoints.sendImages.matchPending,
      (state) => {
        state.isFetching = true;
      },
    );
    builder.addMatcher(
      predictApi.endpoints.sendImages.matchFulfilled,
      (state, action) => {
        state.predictions = action.payload;
      },
    );
    builder.addMatcher(
      predictApi.endpoints.getInitialInfo.matchFulfilled,
      (state, action) => {
        state.exercises = action.payload.exercises;
        state.equipments = action.payload.equipments;
      },
    );
  },
});

export const selectAiPlan = (state: RootState) => state.detection;
export const {
  useSendImagesMutation,
  useGeneratePlanMutation,
  useGetInitialInfoQuery,
} = predictApi;
export const {
  reset,
  closeAnalyzing,
  addFile,
  removeFile,
  removeFromSelectedPredictions,
  addToSelected,
  setLevel,
  setGender,
  setDays,
  setWeeks,
  startAIPlanning,
} = predictSlice.actions;
export default predictSlice.reducer;
