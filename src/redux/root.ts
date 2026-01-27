import { configureStore } from "@reduxjs/toolkit";
import authReducer, { authApi } from "./auth/slice";
import detectionReducer, { predictApi } from "./workout/create-ai";
import createPlanReducer, { createPlanApi } from "./workout/create-plan";
import planReducer, { planApi } from "./plans/slice";
import { useDispatch, useSelector } from "react-redux";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    detection: detectionReducer,
    plans: planReducer,
    createPlan: createPlanReducer,
    [planApi.reducerPath]: planApi.reducer,
    [authApi.reducerPath]: authApi.reducer,
    [createPlanApi.reducerPath]: createPlanApi.reducer,
    [predictApi.reducerPath]: predictApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authApi.middleware,
      predictApi.middleware,
      createPlanApi.middleware,
      planApi.middleware,
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
