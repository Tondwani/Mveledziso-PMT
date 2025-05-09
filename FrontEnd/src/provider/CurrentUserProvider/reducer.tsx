"use client";
import { handleActions } from "redux-actions";
import { INITIAL_STATE, IAuthState, ICurrentUser, ITeamMember, IProjectManager } from "./context";
import { AuthActionEnums } from "./action";

// Define payload types for each action
type ActionPayload = 
  | string  
  | ICurrentUser  
  | ITeamMember   
  | IProjectManager 
  | undefined;     

export const AuthReducer = handleActions<IAuthState, ActionPayload>(
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
      accessToken: payload as string
    }),
    [AuthActionEnums.loginError]: (state, { payload }) => ({
      ...state,
      isPending: false,
      isError: true,
      errorMessage: payload as string
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
      currentUser: payload as ICurrentUser
    }),
    [AuthActionEnums.getCurrentLoginInfoError]: (state) => ({
      ...state,
      isPending: false,
      isError: true
    }),

    // Team Member reducers
    [AuthActionEnums.createTeamMemberPending]: (state) => ({
      ...state,
      isPending: true,
      isSuccess: false,
      isError: false,
      errorMessage: undefined,
    }),
    [AuthActionEnums.createTeamMemberSuccess]: (state, { payload }) => ({
      ...state,
      isPending: false,
      isSuccess: true,
      teamMember: payload as ITeamMember,
    }),
    [AuthActionEnums.createTeamMemberError]: (state, { payload }) => ({
      ...state,
      isPending: false,
      isError: true,
      errorMessage: payload as string,
    }),

    // Project Manager reducers
    [AuthActionEnums.createProjectManagerPending]: (state) => ({
      ...state,
      isPending: true,
      isSuccess: false,
      isError: false,
      errorMessage: undefined,
    }),
    [AuthActionEnums.createProjectManagerSuccess]: (state, { payload }) => ({
      ...state,
      isPending: false,
      isSuccess: true,
      projectManager: payload as IProjectManager,
    }),
    [AuthActionEnums.createProjectManagerError]: (state, { payload }) => ({
      ...state,
      isPending: false,
      isError: true,
      errorMessage: payload as string,
    }),
  },
  INITIAL_STATE
);