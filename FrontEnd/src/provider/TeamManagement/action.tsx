import { ITeam, IUserTeam, PagedResultDto } from "./context";

export enum TeamActionEnum {
  // Team Actions
  teamPending = "TEAM_PENDING",
  teamSuccess = "TEAM_SUCCESS",
  teamError = "TEAM_ERROR",
  
  // UserTeam Actions
  userTeamPending = "USER_TEAM_PENDING",
  userTeamSuccess = "USER_TEAM_SUCCESS",
  userTeamError = "USER_TEAM_ERROR",
  
  // List Actions
  teamsLoaded = "TEAMS_LOADED",
  userTeamsLoaded = "USER_TEAMS_LOADED",
}

// Base Actions
export const basePending = () => ({
  type: TeamActionEnum.teamPending,
  payload: {
    isPending: true,
    isSuccess: false,
    isError: false,
  }
});

const baseSuccess = (message: string) => ({
  type: TeamActionEnum.teamSuccess,
  payload: {
    isPending: false,
    isSuccess: true,
    isError: false,
    message
  }
});

export const baseError = (message: string) => ({
  type: TeamActionEnum.teamError,
  payload: {
    isPending: false,
    isSuccess: false,
    isError: true,
    message
  }
});

// Team Actions
export const teamPending = () => basePending();

export const teamError = (message: string) => baseError(message);

export const createTeamSuccess = (team: ITeam, message: string) => ({
  type: TeamActionEnum.teamSuccess,
  payload: {
    ...baseSuccess(message).payload,
    team,
    teams: [team]
  }
});

export const updateTeamSuccess = (team: ITeam, message: string) => ({
  type: TeamActionEnum.teamSuccess,
  payload: {
    ...baseSuccess(message).payload,
    team
  }
});

export const loadTeamsSuccess = (teams: ITeam[]) => ({
  type: TeamActionEnum.teamsLoaded,
  payload: {
    ...baseSuccess("Teams loaded successfully").payload,
    teams
  }
});

// UserTeam Actions
export const userTeamPending = () => ({
  ...basePending(),
  type: TeamActionEnum.userTeamPending
});

export const userTeamError = (message: string) => ({
  ...baseError(message),
  type: TeamActionEnum.userTeamError
});

export const createUserTeamSuccess = (userTeam: IUserTeam, message: string) => ({
  type: TeamActionEnum.userTeamSuccess,
  payload: {
    isPending: false,
    isSuccess: true,
    isError: false,
    userTeam,
    message
  }
});

export const updateUserTeamSuccess = (userTeam: IUserTeam, message: string) => ({
  type: TeamActionEnum.userTeamSuccess,
  payload: {
    isPending: false,
    isSuccess: true,
    isError: false,
    userTeam,
    message
  }
});

export const loadUserTeamsSuccess = (result: PagedResultDto<IUserTeam>) => ({
  type: TeamActionEnum.userTeamsLoaded,
  payload: {
    isPending: false,
    isSuccess: true,
    isError: false,
    userTeams: result.items,
    message: "User teams loaded successfully"
  }
});