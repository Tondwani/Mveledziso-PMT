"use client";
import { handleActions } from "redux-actions";
import { INITIAL_STATE, IAuthState, ICurrentUser, ITeamMember, IProjectManager } from "./context";
import { AuthActionEnums } from "./action";

type AuthPayload = {
  isPending?: boolean;
  isSuccess?: boolean;
  isError?: boolean;
  errorMessage?: string;
  token?: string;
  currentUser?: ICurrentUser;
  teamMember?: ITeamMember;
  projectManager?: IProjectManager;
  teamMembers?: ITeamMember[];
  projectManagers?: IProjectManager[];
};

// Auth Reducer
export const AuthReducer = handleActions<IAuthState, AuthPayload>(
  {
    // Login Auth
    [AuthActionEnums.loginPending]: (state, action) => ({
      ...state,
      ...action.payload,
    }),
    [AuthActionEnums.loginSuccess]: (state, action) => ({
      ...state,
      ...action.payload,
    }),
    [AuthActionEnums.loginError]: (state, action) => ({
      ...state,
      ...action.payload,
    }),

    // Logout Auth
    [AuthActionEnums.logoutSuccess]: (state, action) => ({
      ...INITIAL_STATE,
      ...action.payload,
    }),

    // Current User Info
    [AuthActionEnums.getCurrentLoginInfoPending]: (state, action) => ({
      ...state,
      ...action.payload,
    }),
    [AuthActionEnums.getCurrentLoginInfoSuccess]: (state, action) => ({
      ...state,
      ...action.payload,
    }),
    [AuthActionEnums.getCurrentLoginInfoError]: (state, action) => ({
      ...state,
      ...action.payload,
    }),

    // Team Member
    [AuthActionEnums.createTeamMemberPending]: (state, action) => ({
      ...state,
      ...action.payload,
    }),
    [AuthActionEnums.createTeamMemberSuccess]: (state, action) => ({
      ...state,
      ...action.payload,
      teamMembers: state.teamMembers 
        ? [...state.teamMembers, action.payload.teamMember!]
        : [action.payload.teamMember!],
    }),
    [AuthActionEnums.createTeamMemberError]: (state, action) => ({
      ...state,
      ...action.payload,
    }),

    // Project Manager
    [AuthActionEnums.createProjectManagerPending]: (state, action) => ({
      ...state,
      ...action.payload,
    }),
    [AuthActionEnums.createProjectManagerSuccess]: (state, action) => ({
      ...state,
      ...action.payload,
      projectManagers: state.projectManagers 
        ? [...state.projectManagers, action.payload.projectManager!]
        : [action.payload.projectManager!],
    }),
    [AuthActionEnums.createProjectManagerError]: (state, action) => ({
      ...state,
      ...action.payload,
    }),
  },
  INITIAL_STATE
);
