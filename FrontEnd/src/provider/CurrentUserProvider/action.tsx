"use client";
import { ICurrentUser } from "./context";
import { createAction } from "redux-actions";

export enum AuthActionEnums {
  loginPending = "LOGIN_PENDING",
  loginSuccess = "LOGIN_SUCCESS",
  loginError = "LOGIN_ERROR",
  
  logoutPending = "LOGOUT_PENDING",
  logoutSuccess = "LOGOUT_SUCCESS",
  
  getCurrentLoginInfoPending = "GET_CURRENT_LOGIN_INFO_PENDING",
  getCurrentLoginInfoSuccess = "GET_CURRENT_LOGIN_INFO_SUCCESS",
  getCurrentLoginInfoError = "GET_CURRENT_LOGIN_INFO_ERROR",
  
  registerPending = "REGISTER_PENDING",
  registerSuccess = "REGISTER_SUCCESS",
  registerError = "REGISTER_ERROR",
}

// Login actions
export const loginPending = createAction(
  AuthActionEnums.loginPending
);

export const loginSuccess = createAction<string>(
  AuthActionEnums.loginSuccess
);

export const loginError = createAction<string>(
  AuthActionEnums.loginError
);

// Logout action
export const logoutSuccess = createAction(
  AuthActionEnums.logoutSuccess
);

// Current user info actions
export const getCurrentLoginInfoPending = createAction(
  AuthActionEnums.getCurrentLoginInfoPending
);

export const getCurrentLoginInfoSuccess = createAction<ICurrentUser>(
  AuthActionEnums.getCurrentLoginInfoSuccess
);

export const getCurrentLoginInfoError = createAction(
  AuthActionEnums.getCurrentLoginInfoError
);

// Registration actions
export const registerPending = createAction(
  AuthActionEnums.registerPending
);

export const registerSuccess = createAction(
  AuthActionEnums.registerSuccess
);

export const registerError = createAction<string>(
  AuthActionEnums.registerError
);