import { createSlice, isAnyOf } from "@reduxjs/toolkit";
import { createApi } from "@reduxjs/toolkit/query/react";

import axiosBaseQuery from "../baseQuery";
import {
  AuthResult,
  AuthUser,
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
  useFreezeAccountMutation,
} = authApi;
export const { logout } = authSlice.actions;
export default authSlice.reducer;
