"use client";
import { ICurrentUser, ITeamMember, IProjectManager } from "./context";

export enum AuthActionEnums {
  loginPending = "LOGIN_PENDING",
  loginSuccess = "LOGIN_SUCCESS",
  loginError = "LOGIN_ERROR",
  

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


export const loginPending = () => ({
  type: AuthActionEnums.loginPending,
  payload: {
    isPending: true,
    isSuccess: false,
    isError: false
  }
});

export const loginSuccess = (token: string) => ({
  type: AuthActionEnums.loginSuccess,
  payload: {
    isPending: false,
    isSuccess: true,
    isError: false,
    token
  }
});

export const loginError = (message: string = "Login failed") => ({
  type: AuthActionEnums.loginError,
  payload: {
    isPending: false,
    isSuccess: false,
    isError: true,
    errorMessage: message
  }
});

export const logoutSuccess = () => ({
  type: AuthActionEnums.logoutSuccess,
  payload: {
    isPending: false,
    isSuccess: true,
    isError: false,
    token: undefined,
    currentUser: undefined
  }
});

export const getCurrentLoginInfoPending = () => ({
  type: AuthActionEnums.getCurrentLoginInfoPending,
  payload: {
    isPending: true,
    isSuccess: false,
    isError: false
  }
});

export const getCurrentLoginInfoSuccess = (currentUser: ICurrentUser) => ({
  type: AuthActionEnums.getCurrentLoginInfoSuccess,
  payload: {
    isPending: false,
    isSuccess: true,
    isError: false,
    currentUser
  }
});

export const getCurrentLoginInfoError = () => ({
  type: AuthActionEnums.getCurrentLoginInfoError,
  payload: {
    isPending: false,
    isSuccess: false,
    isError: true,
    errorMessage: "Failed to fetch user info"
  }
});

export const createTeamMemberPending = () => ({
  type: AuthActionEnums.createTeamMemberPending,
  payload: {
    isPending: true,
    isSuccess: false,
    isError: false
  }
});

export const createTeamMemberSuccess = (teamMember: ITeamMember) => ({
  type: AuthActionEnums.createTeamMemberSuccess,
  payload: {
    isPending: false,
    isSuccess: true,
    isError: false,
    teamMember
  }
});

export const createTeamMemberError = (message: string = "Failed to create team member") => ({
  type: AuthActionEnums.createTeamMemberError,
  payload: {
    isPending: false,
    isSuccess: false,
    isError: true,
    errorMessage: message
  }
});

export const createProjectManagerPending = () => ({
  type: AuthActionEnums.createProjectManagerPending,
  payload: {
    isPending: true,
    isSuccess: false,
    isError: false
  }
});

export const createProjectManagerSuccess = (projectManager: IProjectManager) => ({
  type: AuthActionEnums.createProjectManagerSuccess,
  payload: {
    isPending: false,
    isSuccess: true,
    isError: false,
    projectManager
  }
});

export const createProjectManagerError = (message: string = "Failed to create project manager") => ({
  type: AuthActionEnums.createProjectManagerError,
  payload: {
    isPending: false,
    isSuccess: false,
    isError: true,
    errorMessage: message
  }
});