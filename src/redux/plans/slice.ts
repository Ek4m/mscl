import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { createApi } from "@reduxjs/toolkit/query/react";

import axiosBaseQuery from "../baseQuery";
import { RootState } from "../root";
import { WorkoutPlan } from "../../modules/prediction/types";
import { CustomPlanDetails } from "../../modules/workout/types";

export interface PlansState {
  plans: WorkoutPlan[];
}

const initialState: PlansState = {
  plans: [],
};

export const planApi = createApi({
  reducerPath: "planApi",
  baseQuery: axiosBaseQuery(),
  endpoints: (builder) => ({
    getPlans: builder.query<WorkoutPlan[], void>({
      query: () => ({ url: "workout/plans", method: "get" }),
    }),
    getUserCustomPlanById: builder.query<CustomPlanDetails, any>({
      query: (id: string | number) => ({
        url: "workout/user-plan/" + id,
        method: "get",
      }),
    }),
  }),
});

export const planSlice = createSlice({
  name: "prediction",
  initialState,
  reducers: {
    reset: (state) => {
      state.plans = [];
    },
  },
});

export const selectPlans = (state: RootState) => state.plans;
export const { useGetPlansQuery, useGetUserCustomPlanByIdQuery } = planApi;
export const { reset } = planSlice.actions;
export default planSlice.reducer;
