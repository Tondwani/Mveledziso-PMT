"use client";

import { useContext, useReducer } from "react";
import { getAxiosInstance } from "../../utils/axiosInstance";
import { 
  INITIAL_STATE, 
  TeamStateContext, 
  TeamActionContext,
  ITeamActionContext,
  ITeam,
  IUserTeam,
  ICreateTeamDto,
  IUpdateTeamDto,
  IGetTeamsInput,
  ICreateUserTeamDto,
  IUpdateUserTeamDto,
  IUserTeamListDto,
  PagedResultDto
} from "./context";
import { TeamReducer } from "./reducer";
import { 
  basePending,
  baseError,
  createTeamSuccess,
  updateTeamSuccess,
  loadTeamsSuccess,
  userTeamPending,
  createUserTeamSuccess,
  updateUserTeamSuccess,
  loadUserTeamsSuccess,
  TeamActionEnum
} from "./action";
import { AxiosError } from "axios";

const API_ENDPOINTS = {
  teams: "/api/services/app/Team",
  userTeams: "/api/services/app/UserTeam"
};

interface ErrorResponse {
  error?: {
    message?: string;
  };
}

const baseSuccess = (message: string) => ({
  type: TeamActionEnum.teamSuccess,
  payload: {
    isPending: false,
    isSuccess: true,
    isError: false,
    message
  }
});

export const TeamProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(TeamReducer, INITIAL_STATE);
  const instance = getAxiosInstance();

  // Team Actions
  const createTeam = async (team: ICreateTeamDto) => {
    dispatch(basePending());
    try {
      const response = await instance.post(`${API_ENDPOINTS.teams}/Create`, team);
      const createdTeam: ITeam = response.data.result;
      dispatch(createTeamSuccess(createdTeam, "Team created successfully"));
      return createdTeam;
    } catch (error) {
      const axiosError = error as AxiosError;
      const errorData = axiosError.response?.data as ErrorResponse;
      dispatch(baseError(errorData?.error?.message || "Failed to create team"));
      throw error;
    }
  };

  const updateTeam = async (team: IUpdateTeamDto) => {
    dispatch(basePending());
    try {
      const response = await instance.put(`${API_ENDPOINTS.teams}/Update`, team);
      const updatedTeam: ITeam = response.data.result;
      dispatch(updateTeamSuccess(updatedTeam, "Team updated successfully"));
      return updatedTeam;
    } catch (error) {
      const axiosError = error as AxiosError;
      const errorData = axiosError.response?.data as ErrorResponse;
      dispatch(baseError(errorData?.error?.message || "Failed to update team"));
      throw error;
    }
  };

  const getTeam = async (id: string) => {
    dispatch(basePending());
    try {
      const response = await instance.get(`${API_ENDPOINTS.teams}/Get`, { params: { id } });
      const team: ITeam = response.data.result;
      dispatch(createTeamSuccess(team, "Team loaded successfully"));
      return team;
    } catch (error) {
      const axiosError = error as AxiosError;
      const errorData = axiosError.response?.data as ErrorResponse;
      dispatch(baseError(errorData?.error?.message || "Failed to get team"));
      throw error;
    }
  };

  const getTeams = async (input: IGetTeamsInput) => {
    dispatch(basePending());
    try {
      const response = await instance.get(`${API_ENDPOINTS.teams}/GetAll`, { params: input });
      const teams: ITeam[] = response.data.result.items;
      dispatch(loadTeamsSuccess(teams));
      return teams;
    } catch (error) {
      const axiosError = error as AxiosError;
      const errorData = axiosError.response?.data as ErrorResponse;
      dispatch(baseError(errorData?.error?.message || "Failed to get teams"));
      throw error;
    }
  };

  // UserTeam Actions
  const createUserTeam = async (input: ICreateUserTeamDto) => {
    dispatch(userTeamPending());
    try {
      const response = await instance.post(`${API_ENDPOINTS.userTeams}/Create`, input);
      const userTeam: IUserTeam = response.data.result;
      dispatch(createUserTeamSuccess(userTeam, "User added to team successfully"));
      return userTeam;
    } catch (error) {
      const axiosError = error as AxiosError;
      const errorData = axiosError.response?.data as ErrorResponse;
      dispatch(baseError(errorData?.error?.message || "Failed to add user to team"));
      throw error;
    }
  };

  const updateUserTeam = async (id: string, input: IUpdateUserTeamDto) => {
    dispatch(userTeamPending());
    try {
      const response = await instance.put(`${API_ENDPOINTS.userTeams}/Update`, { ...input, id });
      const userTeam: IUserTeam = response.data.result;
      dispatch(updateUserTeamSuccess(userTeam, "User team updated successfully"));
      return userTeam;
    } catch (error) {
      const axiosError = error as AxiosError;
      const errorData = axiosError.response?.data as ErrorResponse;
      dispatch(baseError(errorData?.error?.message || "Failed to update user team"));
      throw error;
    }
  };

  const deleteUserTeam = async (id: string) => {
    dispatch(userTeamPending());
    try {
      await instance.delete(`${API_ENDPOINTS.userTeams}/Delete`, { params: { id } });
      dispatch(baseSuccess("User removed from team successfully"));
    } catch (error) {
      const axiosError = error as AxiosError;
      const errorData = axiosError.response?.data as ErrorResponse;
      dispatch(baseError(errorData?.error?.message || "Failed to remove user from team"));
      throw error;
    }
  };

  const getUserTeam = async (id: string) => {
    dispatch(userTeamPending());
    try {
      const response = await instance.get(`${API_ENDPOINTS.userTeams}/Get`, { params: { id } });
      const userTeam: IUserTeam = response.data.result;
      dispatch(createUserTeamSuccess(userTeam, "User team loaded successfully"));
      return userTeam;
    } catch (error) {
      const axiosError = error as AxiosError;
      const errorData = axiosError.response?.data as ErrorResponse;
      dispatch(baseError(errorData?.error?.message || "Failed to get user team"));
      throw error;
    }
  };

  const getUserTeams = async (input: IUserTeamListDto) => {
    dispatch(userTeamPending());
    try {
      const response = await instance.get(`${API_ENDPOINTS.userTeams}/GetAll`, { params: input });
      const result: PagedResultDto<IUserTeam> = response.data.result;
      dispatch(loadUserTeamsSuccess(result));
      return result;
    } catch (error) {
      const axiosError = error as AxiosError;
      const errorData = axiosError.response?.data as ErrorResponse;
      dispatch(baseError(errorData?.error?.message || "Failed to get user teams"));
      throw error;
    }
  };

  const actionContextValue: ITeamActionContext = {
    createTeam,
    updateTeam,
    getTeam,
    getTeams,
    createUserTeam,
    updateUserTeam,
    deleteUserTeam,
    getUserTeam,
    getUserTeams
  };

  return (
    <TeamStateContext.Provider value={state}>
      <TeamActionContext.Provider value={actionContextValue}>
        {children}
      </TeamActionContext.Provider>
    </TeamStateContext.Provider>
  );
};

export const useTeamState = () => {
  const context = useContext(TeamStateContext);
  if (!context) {
    throw new Error('useTeamState must be used within a TeamProvider');
  }
  return context;
};

export const useTeamActions = () => {
  const context = useContext(TeamActionContext);
  if (!context) {
    throw new Error('useTeamActions must be used within a TeamProvider');
  }
  return context;
};