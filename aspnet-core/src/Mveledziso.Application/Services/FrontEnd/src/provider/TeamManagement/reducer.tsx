/* eslint-disable @typescript-eslint/no-explicit-any */
import { handleActions } from "redux-actions";
import { INITIAL_STATE, ITeamStateContext } from "./context";
import { TeamActionEnum } from "./action";


export const TeamReducer = handleActions<ITeamStateContext, any>(
  {
    // Base team actions
    [TeamActionEnum.teamPending]: (state) => ({
      ...state,
      isPending: true,
      isSuccess: false,
      isError: false,
      errorMessage: undefined
    }),
    [TeamActionEnum.teamSuccess]: (state, action) => ({
      ...state,
      isPending: false,
      isSuccess: true,
      isError: false,
      ...action.payload,
    }),
    [TeamActionEnum.teamError]: (state, action) => ({
      ...state,
      isPending: false,
      isSuccess: false,
      isError: true,
      ...action.payload,
    }),

    // Teams list
    [TeamActionEnum.teamsLoaded]: (state, action) => ({
      ...state,
      isPending: false,
      isSuccess: true,
      isError: false,
      teams: action.payload.teams,
      message: action.payload.message
    }),

    // UserTeam base actions
    [TeamActionEnum.userTeamPending]: (state) => ({
      ...state,
      isPending: true,
      isSuccess: false,
      isError: false,
      errorMessage: undefined
    }),
    [TeamActionEnum.userTeamSuccess]: (state, action) => ({
      ...state,
      isPending: false,
      isSuccess: true,
      isError: false,
      ...action.payload,
    }),
    [TeamActionEnum.userTeamError]: (state, action) => ({
      ...state,
      isPending: false,
      isSuccess: false,
      isError: true,
      ...action.payload,
    }),

    // UserTeams list
    [TeamActionEnum.userTeamsLoaded]: (state, action) => ({
      ...state,
      isPending: false,
      isSuccess: true,
      isError: false,
      userTeams: action.payload.userTeams,
      message: action.payload.message
    }),
  },
  INITIAL_STATE
);