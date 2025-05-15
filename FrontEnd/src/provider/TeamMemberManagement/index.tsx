"use client";

import React, { useReducer, useContext, useCallback } from "react";
import {
  TeamMemberStateContext,
  TeamMemberActionContext,
  ITeamMemberActionContext,
  ITeamMember,
  ICreateTeamMemberDto,
  IUpdateTeamMemberDto,
  IGetTeamMembersInput,
  IAssignTeamRoleDto,
  IUpdateTeamRoleDto,
  IUserTeam,
  INITIAL_STATE,
} from "./context";
import { TeamMemberReducer } from "./reducer";
import {
  setPending,
  setError,
  setSuccess,
  setTeamMember,
  setTeamMembers,
  setTotalCount,
  setUserTeams,
} from "./action";
import { getAxiosInstance } from "../../utils/axiosInstance";
import { AxiosError } from "axios";

export type {
  ITeamMember,
  ICreateTeamMemberDto,
  IUpdateTeamMemberDto,
  IGetTeamMembersInput,
  IAssignTeamRoleDto,
  IUpdateTeamRoleDto,
  IUserTeam
};

export const TeamMemberProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(TeamMemberReducer, INITIAL_STATE);
  const api = getAxiosInstance();

  const getTeamMembers = useCallback(
    async (input: IGetTeamMembersInput): Promise<{ items: ITeamMember[]; totalCount: number }> => {
      try {
        dispatch(setPending(true));
        const response = await api.get("/api/services/app/TeamMember/GetAll", {
          params: input,
        });
        const result = response.data.result;
        console.log('Team members loaded:', result); // Debug log
        dispatch(setTeamMembers(result.items));
        dispatch(setTotalCount(result.totalCount));
        dispatch(setSuccess(true));
        return result;
      } catch (error) {
        const axiosError = error as AxiosError;
        console.error('Error response:', axiosError.response?.data); // Debug log
        const errorMessage = axiosError.message || "Failed to fetch team members";
        dispatch(setError(errorMessage));
        throw error;
      }
    },
    [api]
  );

  const getTeamMember = useCallback(
    async (id: string): Promise<ITeamMember> => {
      try {
        dispatch(setPending(true));
        const response = await api.get(`/api/services/app/TeamMember/Get?id=${id}`);
        const result = response.data.result;
        dispatch(setTeamMember(result));
        dispatch(setSuccess(true));
        return result;
      } catch (error) {
        const axiosError = error as AxiosError;
        const errorMessage = axiosError.message || "Failed to fetch team member";
        dispatch(setError(errorMessage));
        throw error;
      }
    },
    [api]
  );

  const createTeamMember = useCallback(
    async (input: ICreateTeamMemberDto): Promise<ITeamMember> => {
      try {
        dispatch(setPending(true));
        const response = await api.post("/api/services/app/TeamMember/Create", input);
        const result = response.data.result;
        dispatch(setTeamMember(result));
        dispatch(setSuccess(true));
        return result;
      } catch (error) {
        const axiosError = error as AxiosError;
        const errorMessage = axiosError.message || "Failed to create team member";
        dispatch(setError(errorMessage));
        throw error;
      }
    },
    [api]
  );

  const updateTeamMember = useCallback(
    async (id: string, input: IUpdateTeamMemberDto): Promise<ITeamMember> => {
      try {
        dispatch(setPending(true));
        const response = await api.put(`/api/services/app/TeamMember/Update?id=${id}`, input);
        const result = response.data.result;
        dispatch(setTeamMember(result));
        dispatch(setSuccess(true));
        return result;
      } catch (error) {
        const axiosError = error as AxiosError;
        const errorMessage = axiosError.message || "Failed to update team member";
        dispatch(setError(errorMessage));
        throw error;
      }
    },
    [api]
  );

  const deleteTeamMember = useCallback(
    async (id: string): Promise<void> => {
      try {
        dispatch(setPending(true));
        await api.delete(`/api/services/app/TeamMember/Delete?id=${id}`);
        dispatch(setTeamMember(null));
        dispatch(setSuccess(true));
      } catch (error) {
        const axiosError = error as AxiosError;
        const errorMessage = axiosError.message || "Failed to delete team member";
        dispatch(setError(errorMessage));
        throw error;
      }
    },
    [api]
  );

  const getTeamMembersByTeam = useCallback(
    async (teamId: string): Promise<ITeamMember[]> => {
      try {
        dispatch(setPending(true));
        const response = await api.get(`/api/services/app/TeamMember/GetTeamMembersByTeam?id=${teamId}`);
        const result = response.data.result;
        dispatch(setTeamMembers(result.items));
        dispatch(setSuccess(true));
        return result.items;
      } catch (error) {
        const axiosError = error as AxiosError;
        const errorMessage = axiosError.message || "Failed to fetch team members by team";
        dispatch(setError(errorMessage));
        throw error;
      }
    },
    [api]
  );

  const assignTeamRole = useCallback(
    async (input: IAssignTeamRoleDto): Promise<IUserTeam> => {
      try {
        dispatch(setPending(true));
        const response = await api.post("/api/services/app/UserTeam/Create", input);
        const result = response.data.result;
        dispatch(setSuccess(true));
        return result;
      } catch (error) {
        const axiosError = error as AxiosError;
        const errorMessage = axiosError.message || "Failed to assign team role";
        dispatch(setError(errorMessage));
        throw error;
      }
    },
    [api]
  );

  const updateTeamRole = useCallback(
    async (userTeamId: string, input: IUpdateTeamRoleDto): Promise<IUserTeam> => {
      try {
        dispatch(setPending(true));
        const response = await api.put(`/api/services/app/UserTeam/Update?id=${userTeamId}`, input);
        const result = response.data.result;
        
        const userTeamsResponse = await api.get(`/api/services/app/UserTeam/GetList`, {
          params: { teamMemberId: result.teamMemberId }
        });
        dispatch(setUserTeams(userTeamsResponse.data.result.items));
        
        dispatch(setSuccess(true));
        return result;
      } catch (error) {
        const axiosError = error as AxiosError;
        const errorMessage = axiosError.message || "Failed to update team role";
        dispatch(setError(errorMessage));
        throw error;
      }
    },
    [api]
  );

  const removeFromTeam = useCallback(
    async (userTeamId: string): Promise<void> => {
      try {
        dispatch(setPending(true));
        await api.delete(`/api/services/app/UserTeam/Delete?id=${userTeamId}`);
        
        dispatch(setUserTeams(state.userTeams.filter(ut => ut.id !== userTeamId)));
        
        dispatch(setSuccess(true));
      } catch (error) {
        const axiosError = error as AxiosError;
        const errorMessage = axiosError.message || "Failed to remove from team";
        dispatch(setError(errorMessage));
        throw error;
      }
    },
    [api, state.userTeams]
  );

  const getUserTeams = useCallback(
    async (teamMemberId: string): Promise<IUserTeam[]> => {
      try {
        dispatch(setPending(true));
        const response = await api.get(`/api/services/app/UserTeam/GetList`, {
          params: { teamMemberId }
        });
        const result = response.data.result.items;
        dispatch(setUserTeams(result));
        dispatch(setSuccess(true));
        return result;
      } catch (error) {
        const axiosError = error as AxiosError;
        const errorMessage = axiosError.message || "Failed to fetch user teams";
        dispatch(setError(errorMessage));
        throw error;
      }
    },
    [api]
  );

  const actions: ITeamMemberActionContext = {
    getTeamMembers,
    getTeamMember,
    createTeamMember,
    updateTeamMember,
    deleteTeamMember,
    getTeamMembersByTeam,
    assignTeamRole,
    updateTeamRole,
    removeFromTeam,
    getUserTeams
  };

  return (
    <TeamMemberStateContext.Provider value={state}>
      <TeamMemberActionContext.Provider value={actions}>
        {children}
      </TeamMemberActionContext.Provider>
    </TeamMemberStateContext.Provider>
  );
};

export const useTeamMemberState = () => {
  const context = useContext(TeamMemberStateContext);
  if (context === undefined) {
    throw new Error("useTeamMemberState must be used within a TeamMemberProvider");
  }
  return context;
};

export const useTeamMemberActions = () => {
  const context = useContext(TeamMemberActionContext);
  if (context === undefined) {
    throw new Error("useTeamMemberActions must be used within a TeamMemberProvider");
  }
  return context;
};
