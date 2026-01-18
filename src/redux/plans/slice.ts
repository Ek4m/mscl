import { createSlice } from '@reduxjs/toolkit';
import { createApi } from '@reduxjs/toolkit/query/react';

import axiosBaseQuery from '../baseQuery';
import { RootState } from '../root';
import { WorkoutPlan } from '../../modules/prediction/types';

export interface PlansState {
  plans: WorkoutPlan[];
}

const initialState: PlansState = {
  plans: [],
};

export const planApi = createApi({
  reducerPath: 'planApi',
  baseQuery: axiosBaseQuery(),
  endpoints: builder => ({
    getPlans: builder.query<WorkoutPlan[], void>({
      query: () => ({ url: 'workout/plans', method: 'get' }),
    }),
  }),
});

export const planSlice = createSlice({
  name: 'prediction',
  initialState,
  reducers: {
    reset: state => {
      state.plans = [];
    },
  },
  extraReducers: builder => {
    builder.addMatcher(
      planApi.endpoints.getPlans.matchFulfilled,
      (state, action) => {
        state.plans = action.payload;
      },
    );
  },
});

export const selectPlans = (state: RootState) => state.plans;
export const { useGetPlansQuery } = planApi;
export const { reset } = planSlice.actions;
export default planSlice.reducer;
