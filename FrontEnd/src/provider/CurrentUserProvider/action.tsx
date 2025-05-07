"use client";
import { ICurrentUser, ITeamMember, IProjectManager } from "./context";
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
  
  createTeamMemberPending = "CREATE_TEAM_MEMBER_PENDING",
  createTeamMemberSuccess = "CREATE_TEAM_MEMBER_SUCCESS",
  createTeamMemberError = "CREATE_TEAM_MEMBER_ERROR",

  createProjectManagerPending = "CREATE_PROJECT_MANAGER_PENDING",
  createProjectManagerSuccess = "CREATE_PROJECT_MANAGER_SUCCESS",
  createProjectManagerError = "CREATE_PROJECT_MANAGER_ERROR",
}

// Login actions
export const loginPending = createAction<undefined>(
  AuthActionEnums.loginPending
);

export const loginSuccess = createAction<string>(
  AuthActionEnums.loginSuccess
);

export const loginError = createAction<string>(
  AuthActionEnums.loginError
);

// Logout action
export const logoutSuccess = createAction<undefined>(
  AuthActionEnums.logoutSuccess
);

// Current user info actions
export const getCurrentLoginInfoPending = createAction<undefined>(
  AuthActionEnums.getCurrentLoginInfoPending
);

export const getCurrentLoginInfoSuccess = createAction<ICurrentUser>(
  AuthActionEnums.getCurrentLoginInfoSuccess
);

export const getCurrentLoginInfoError = createAction<undefined>(
  AuthActionEnums.getCurrentLoginInfoError
);

// Team Member actions
export const createTeamMemberPending = createAction<undefined>(
  AuthActionEnums.createTeamMemberPending
);

export const createTeamMemberSuccess = createAction<ITeamMember>(
  AuthActionEnums.createTeamMemberSuccess
);

export const createTeamMemberError = createAction<string>(
  AuthActionEnums.createTeamMemberError
);

// Project Manager actions
export const createProjectManagerPending = createAction<undefined>(
  AuthActionEnums.createProjectManagerPending
);

export const createProjectManagerSuccess = createAction<IProjectManager>(
  AuthActionEnums.createProjectManagerSuccess
);

export const createProjectManagerError = createAction<string>(
  AuthActionEnums.createProjectManagerError
);