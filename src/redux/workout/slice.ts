import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { createApi } from "@reduxjs/toolkit/query/react";
import { Asset } from "react-native-image-picker";

import axiosBaseQuery from "../baseQuery";
import { RootState } from "../root";
import { GymLevel } from "../../modules/prediction/enums";
import {
  GenPlanCredentials,
  WorkoutPlan,
} from "../../modules/prediction/types";
import { Equipment, Exercise } from "../../modules/workout/types";

export interface PredictSliceState {
  predictions: string[];
  selectedPredictions: string[];
  isFetching: boolean;
  files: Asset[];
  level: GymLevel;
  equipments: Equipment[];
  exercises: Exercise[];
  days: number;
}

const initialState: PredictSliceState = {
  predictions: [],
  selectedPredictions: [],
  isFetching: true,
  files: [],
  level: GymLevel.INTERMEDIATE,
  equipments: [],
  exercises: [],
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
      query: () => ({ url: "workout/data/all", method: "get" }),
      keepUnusedDataFor: 3600,
    }),
    sendImages: builder.mutation<string[], FormData>({
      query: (credentials: FormData) => ({
        url: "workout/detect",
        method: "post",
        data: credentials,
        headers: { "Content-Type": "multipart/form-data" },
      }),
    }),
    generatePlan: builder.mutation<WorkoutPlan, GenPlanCredentials>({
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
      state.predictions = [];
    },
    closeAnalyzing: (state) => {
      state.isFetching = false;
    },
    addFile: (state, action: PayloadAction<Asset>) => {
      state.files.push(action.payload);
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

export const selectPredictions = (state: RootState) => state.detection;
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
  setDays,
} = predictSlice.actions;
export default predictSlice.reducer;
