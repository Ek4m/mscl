import { createSlice } from "@reduxjs/toolkit";
import { createApi } from "@reduxjs/toolkit/query/react";

import axiosBaseQuery from "../baseQuery";
import { RootState } from "../root";
import { WorkoutPlan } from "../../modules/prediction/types";
import { CustomPlanDetails, PremadePlan } from "../../modules/workout/types";
import { PlanStatus } from "../../modules/prediction/enums";
import { WorkoutSession } from "../../db/types";

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
    getPlans: builder.query<CustomPlanDetails[], void>({
      query: () => ({ url: "workout/plans", method: "get" }),
    }),
    getExistingPlanRegistration: builder.query<{ id: number }, number>({
      query: (planId: number) => ({
        url: "workout/plan-registration/" + planId,
        method: "get",
      }),
    }),
    registerPlan: builder.mutation<{ id: number }, { planId: number }>({
      query: (data) => ({
        url: "workout/plan/plan-registration",
        method: "post",
        data,
      }),
    }),
    editDay: builder.mutation<
      { id: number },
      {
        dayId: number;
        exercises: {
          variationId?: number;
          exerciseId?: number;
          targetReps: number;
          targetSets: number;
        }[];
      }
    >({
      query: (data) => ({
        url: "workout/edit-day",
        method: "put",
        data,
      }),
    }),
    updateStatus: builder.mutation<
      { id: number },
      {
        userPlanId: number;
        status: PlanStatus;
        sessionRecords: WorkoutSession[];
      }
    >({
      query: (data) => ({
        url: "workout/plan/update-status",
        method: "post",
        data,
      }),
    }),
    getPremadePlans: builder.query<PremadePlan[], void>({
      query: () => ({ url: "workout/premade-plans", method: "get" }),
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
export const {
  useGetPlansQuery,
  useGetUserCustomPlanByIdQuery,
  useUpdateStatusMutation,
  useGetPremadePlansQuery,
  useEditDayMutation,
  useGetExistingPlanRegistrationQuery,
  useRegisterPlanMutation,
} = planApi;
export const { reset } = planSlice.actions;
export default planSlice.reducer;
