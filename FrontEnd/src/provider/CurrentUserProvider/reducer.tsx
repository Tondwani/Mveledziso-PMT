"use client";
import { handleActions } from "redux-actions";
import { INITIAL_STATE, IAuthStateContext, ICurrentUser } from "./context";
import { AuthActionEnums } from "./action";

// Define payload types for each action
type LoginSuccessPayload = string; 
type LoginErrorPayload = string; 
type GetCurrentLoginInfoSuccessPayload = ICurrentUser; 
type RegisterErrorPayload = string; // errorMessage

export const AuthReducer = handleActions<
  IAuthStateContext, 
  | undefined // For actions without payload
  | LoginSuccessPayload
  | LoginErrorPayload
  | GetCurrentLoginInfoSuccessPayload
  | RegisterErrorPayload
>(
  {
    // Login handlers
    [AuthActionEnums.loginPending]: (state) => ({
      ...state,
      isPending: true,
      isSuccess: false,
      isError: false,
      errorMessage: undefined
    }),
    [AuthActionEnums.loginSuccess]: (state, { payload }) => ({
      ...state,
      isPending: false,
      isSuccess: true,
      accessToken: payload as LoginSuccessPayload
    }),
    [AuthActionEnums.loginError]: (state, { payload }) => ({
      ...state,
      isPending: false,
      isError: true,
      errorMessage: payload as LoginErrorPayload
    }),

    // Logout handler
    [AuthActionEnums.logoutSuccess]: () => INITIAL_STATE,

    // Current user info handlers
    [AuthActionEnums.getCurrentLoginInfoPending]: (state) => ({
      ...state,
      isPending: true,
      isSuccess: false,
      isError: false
    }),
    [AuthActionEnums.getCurrentLoginInfoSuccess]: (state, { payload }) => ({
      ...state,
      isPending: false,
      isSuccess: true,
      currentUser: payload as GetCurrentLoginInfoSuccessPayload
    }),
    [AuthActionEnums.getCurrentLoginInfoError]: (state) => ({
      ...state,
      isPending: false,
      isError: true
    }),

    // Registration handlers
    [AuthActionEnums.registerPending]: (state) => ({
      ...state,
      isPending: true,
      isSuccess: false,
      isError: false,
      errorMessage: undefined
    }),
    [AuthActionEnums.registerSuccess]: (state) => ({
      ...state,
      isPending: false,
      isSuccess: true
    }),
    [AuthActionEnums.registerError]: (state, { payload }) => ({
      ...state,
      isPending: false,
      isError: true,
      errorMessage: payload as RegisterErrorPayload
    }),
  },
  INITIAL_STATE
);