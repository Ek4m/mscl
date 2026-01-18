import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { createApi } from '@reduxjs/toolkit/query/react';
import { Asset } from 'react-native-image-picker';

import axiosBaseQuery from '../baseQuery';
import { RootState } from '../root';
import { GymLevel } from '../../modules/prediction/enums';
import {
  GenPlanCredentials,
  WorkoutPlan,
} from '../../modules/prediction/types';

export interface PredictSliceState {
  predictions: string[];
  selectedPredictions: string[];
  isFetching: boolean;
  files: Asset[];
  level: GymLevel;
  days: number;
}

const initialState: PredictSliceState = {
  predictions: [],
  selectedPredictions: [],
  isFetching: true,
  files: [],
  level: GymLevel.INTERMEDIATE,
  days: 3,
};

export const predictApi = createApi({
  reducerPath: 'predictApi',
  baseQuery: axiosBaseQuery(),
  endpoints: builder => ({
    getProfile: builder.query<WorkoutPlan[], void>({
      query: () => ({ url: 'workout/plans', method: 'get' }),
    }),
    sendImages: builder.mutation<string[], FormData>({
      query: (credentials: FormData) => ({
        url: 'workout/detect',
        method: 'post',
        data: credentials,
        headers: { 'Content-Type': 'multipart/form-data' },
      }),
    }),
    generatePlan: builder.mutation<WorkoutPlan, GenPlanCredentials>({
      query: (credentials: GenPlanCredentials) => ({
        url: 'workout/generate-program',
        method: 'post',
        data: credentials,
      }),
    }),
  }),
});

export const predictSlice = createSlice({
  name: 'prediction',
  initialState,
  reducers: {
    reset: state => {
      state.predictions = [];
    },
    closeAnalyzing: state => {
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
        ...(typeof action.payload === 'string'
          ? [action.payload]
          : action.payload),
      ];
    },
    removeFromSelectedPredictions: (state, action: PayloadAction<string>) => {
      console.log(action.payload);
      state.selectedPredictions = state.selectedPredictions.filter(
        item => item !== action.payload,
      );
    },
    setLevel: (state, action: PayloadAction<GymLevel>) => {
      state.level = action.payload;
    },
    setDays: (state, action: PayloadAction<number>) => {
      state.days = action.payload;
    },
  },
  extraReducers: builder => {
    builder.addMatcher(predictApi.endpoints.sendImages.matchRejected, state => {
      state.isFetching = false;
    });
    builder.addMatcher(predictApi.endpoints.sendImages.matchPending, state => {
      state.isFetching = true;
    });
    builder.addMatcher(
      predictApi.endpoints.sendImages.matchFulfilled,
      (state, action) => {
        state.predictions = action.payload;
      },
    );
  },
});

export const selectPredictions = (state: RootState) => state.detection;
export const { useSendImagesMutation, useGeneratePlanMutation } = predictApi;
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
