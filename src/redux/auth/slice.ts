import { createSlice, isAnyOf } from "@reduxjs/toolkit";
import { createApi } from "@reduxjs/toolkit/query/react";

import axiosBaseQuery from "../baseQuery";
import {
  AuthResult,
  AuthUser,
  ChangePasswordCredentials,
  ForgotPasswordCredentials,
  LoginCredentials,
  RegisterCredentials,
} from "../../modules/auth/types";
import { RootState } from "../root";

export interface AuthSliceState {
  userInfo?: AuthUser;
  isFetching: boolean;
}

const initialState: AuthSliceState = {
  userInfo: undefined,
  isFetching: true,
};

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: axiosBaseQuery(),
  endpoints: (builder) => ({
    getProfile: builder.query<{ user: AuthUser }, void>({
      query: () => ({ url: "auth/profile", method: "get" }),
    }),
    login: builder.mutation<AuthResult, LoginCredentials>({
      query: (credentials: LoginCredentials) => ({
        url: "auth/login",
        method: "post",
        data: credentials,
      }),
    }),
    resetPassword: builder.mutation<
      { success: boolean },
      ForgotPasswordCredentials
    >({
      query: (data: ForgotPasswordCredentials) => ({
        url: "auth/reset-password",
        method: "post",
        data,
      }),
    }),
    changePassword: builder.mutation<
      { success: boolean },
      ChangePasswordCredentials
    >({
      query: (data: ChangePasswordCredentials) => ({
        url: "auth/change-password",
        method: "post",
        data,
      }),
    }),
    forgotPassword: builder.mutation<{ success: boolean }, string>({
      query: (email: string) => ({
        url: "auth/forgot-password",
        method: "post",
        data: { email },
      }),
    }),
    register: builder.mutation<AuthResult, RegisterCredentials>({
      query: (credentials: RegisterCredentials) => ({
        url: "auth/register",
        method: "post",
        data: credentials,
      }),
    }),
    freezeAccount: builder.mutation<boolean, void>({
      query: () => ({
        url: "auth/freeze",
        method: "delete",
      }),
    }),
  }),
});

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.userInfo = undefined;
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      isAnyOf(
        authApi.endpoints.login.matchFulfilled,
        authApi.endpoints.register.matchFulfilled,
      ),
      (state, action) => {
        state.userInfo = action.payload.user;
      },
    );
    builder.addMatcher(authApi.endpoints.getProfile.matchPending, (state) => {
      state.isFetching = true;
    });
    builder.addMatcher(
      authApi.endpoints.getProfile.matchFulfilled,
      (state, action) => {
        state.userInfo = action.payload.user;
        state.isFetching = false;
      },
    );
    builder.addMatcher(authApi.endpoints.getProfile.matchRejected, (state) => {
      state.isFetching = false;
    });
  },
});

export const selectUserInfo = (state: RootState) => state.auth;
export const {
  useGetProfileQuery,
  useLoginMutation,
  useRegisterMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useFreezeAccountMutation,
  useChangePasswordMutation,
} = authApi;
export const { logout } = authSlice.actions;
export default authSlice.reducer;
