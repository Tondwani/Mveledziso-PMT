/* eslint-disable @typescript-eslint/no-explicit-any */
import { handleActions } from "redux-actions";
import { INITIAL_STATE, ITeamStateContext } from "./context";
import { TeamActionEnum } from "./action";


export const TeamReducer = handleActions<ITeamStateContext, any>(
  {
    // Base team actions
    [TeamActionEnum.teamPending]: (state, action) => ({
      ...state,
      ...action.payload,
    }),
    [TeamActionEnum.teamSuccess]: (state, action) => ({
      ...state,
      ...action.payload,
    }),
    [TeamActionEnum.teamError]: (state, action) => ({
      ...state,
      ...action.payload,
    }),

    // Teams list
    [TeamActionEnum.teamsLoaded]: (state, action) => ({
      ...state,
      ...action.payload,
      teams: action.payload.teams,
    }),

    // UserTeam base actions
    [TeamActionEnum.userTeamPending]: (state, action) => ({
      ...state,
      ...action.payload,
    }),
    [TeamActionEnum.userTeamSuccess]: (state, action) => ({
      ...state,
      ...action.payload,
    }),
    [TeamActionEnum.userTeamError]: (state, action) => ({
      ...state,
      ...action.payload,
    }),

    // UserTeams list
    [TeamActionEnum.userTeamsLoaded]: (state, action) => ({
      ...state,
      ...action.payload,
      userTeams: action.payload.userTeams,
    }),
  },
  INITIAL_STATE
);