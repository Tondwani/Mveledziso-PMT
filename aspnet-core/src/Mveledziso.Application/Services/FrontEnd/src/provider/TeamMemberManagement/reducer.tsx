import { handleActions } from "redux-actions";
import { INITIAL_STATE, ITeamMemberStateContext } from "./context";
import { TeamMemberActionEnum, TeamMemberPayload } from "./action";

export const TeamMemberReducer = handleActions<ITeamMemberStateContext, TeamMemberPayload>(
  {
    [TeamMemberActionEnum.SET_PENDING]: (state, action) => ({
      ...state,
      isPending: action.payload?.isPending || false,
      isSuccess: action.payload?.isSuccess || false,
      isError: false,
      errorMessage: undefined
    }),

    [TeamMemberActionEnum.SET_ERROR]: (state, action) => ({
      ...state,
      isError: action.payload?.isError || false,
      errorMessage: action.payload?.errorMessage,
      isPending: action.payload?.isPending || false,
      isSuccess: action.payload?.isSuccess || false
    }),

    [TeamMemberActionEnum.SET_SUCCESS]: (state, action) => ({
      ...state,
      isSuccess: action.payload?.isSuccess || false,
      isPending: action.payload?.isPending || false,
      isError: false,
      errorMessage: undefined
    }),

    [TeamMemberActionEnum.SET_TEAM_MEMBER]: (state, action) => ({
      ...state,
      teamMember: action.payload?.teamMember || null
    }),

    [TeamMemberActionEnum.SET_TEAM_MEMBERS]: (state, action) => ({
      ...state,
      teamMembers: action.payload?.teamMembers || []
    }),

    [TeamMemberActionEnum.SET_TOTAL_COUNT]: (state, action) => ({
      ...state,
      totalCount: action.payload?.totalCount || 0
    }),

    [TeamMemberActionEnum.SET_USER_TEAMS]: (state, action) => ({
      ...state,
      userTeams: action.payload?.userTeams || []
    }),

    [TeamMemberActionEnum.RESET_STATE]: () => ({
      ...INITIAL_STATE
    })
  },
  INITIAL_STATE
);
