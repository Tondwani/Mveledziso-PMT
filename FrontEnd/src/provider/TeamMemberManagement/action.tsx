import { Action, createAction } from "redux-actions";
import { ITeamMember, IUserTeam } from "./context";

// Action Types
export enum TeamMemberActionEnum {
  SET_PENDING = "SET_PENDING",
  SET_ERROR = "SET_ERROR",
  SET_SUCCESS = "SET_SUCCESS",
  SET_TEAM_MEMBER = "SET_TEAM_MEMBER",
  SET_TEAM_MEMBERS = "SET_TEAM_MEMBERS",
  SET_TOTAL_COUNT = "SET_TOTAL_COUNT",
  SET_USER_TEAMS = "SET_USER_TEAMS",
  RESET_STATE = "RESET_STATE"
}

// Action Payloads
export interface TeamMemberPayload {
  isPending?: boolean;
  isSuccess?: boolean;
  isError?: boolean;
  errorMessage?: string;
  teamMember?: ITeamMember | null;
  teamMembers?: ITeamMember[];
  totalCount?: number;
  userTeams?: IUserTeam[];
}

type ActionCreator<T> = (payload: T) => Action<TeamMemberPayload>;

// Action Creators
export const setPending: ActionCreator<boolean> = createAction(
  TeamMemberActionEnum.SET_PENDING,
  (isPending: boolean): TeamMemberPayload => ({
    isPending,
    isSuccess: false,
    isError: false,
    errorMessage: undefined
  })
);

export const setError: ActionCreator<string> = createAction(
  TeamMemberActionEnum.SET_ERROR,
  (errorMessage: string): TeamMemberPayload => ({
    isPending: false,
    isSuccess: false,
    isError: true,
    errorMessage
  })
);

export const setSuccess: ActionCreator<boolean> = createAction(
  TeamMemberActionEnum.SET_SUCCESS,
  (isSuccess: boolean): TeamMemberPayload => ({
    isPending: false,
    isSuccess,
    isError: false,
    errorMessage: undefined
  })
);

export const setTeamMember: ActionCreator<ITeamMember | null> = createAction(
  TeamMemberActionEnum.SET_TEAM_MEMBER,
  (teamMember: ITeamMember | null): TeamMemberPayload => ({
    teamMember
  })
);

export const setTeamMembers: ActionCreator<ITeamMember[]> = createAction(
  TeamMemberActionEnum.SET_TEAM_MEMBERS,
  (teamMembers: ITeamMember[]): TeamMemberPayload => ({
    teamMembers
  })
);

export const setTotalCount: ActionCreator<number> = createAction(
  TeamMemberActionEnum.SET_TOTAL_COUNT,
  (totalCount: number): TeamMemberPayload => ({
    totalCount
  })
);

export const setUserTeams: ActionCreator<IUserTeam[]> = createAction(
  TeamMemberActionEnum.SET_USER_TEAMS,
  (userTeams: IUserTeam[]): TeamMemberPayload => ({
    userTeams
  })
);

export const resetState = createAction(TeamMemberActionEnum.RESET_STATE);
