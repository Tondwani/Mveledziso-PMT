"use client";

import React, { useReducer, useContext, useCallback } from "react";
import {
  ProjectManagerStateContext,
  ProjectManagerActionContext,
  IProjectManagerStateContext,
  IProjectManagerActionContext,
  IProjectManager,
  IGetProjectManagerInput,
  INITIAL_STATE,
} from "./context";
import { ProjectManagerReducer } from "./reducer";
import {
  setPending,
  setError,
  setSuccess,
  setProjectManager,
  setProjectManagers,
  setTotalCount,
} from "./action";
import { getAxiosInstance } from "../../utils/axiosInstance";
import { AxiosError } from "axios";

export const ProjectManagerProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(ProjectManagerReducer, INITIAL_STATE);
  const api = getAxiosInstance();

  const getProjectManager = useCallback(
    async (id: string): Promise<IProjectManager> => {
      try {
        dispatch(setPending(true));
        const response = await api.get(`/api/services/app/ProjectManager/Get?id=${id}`);
        const result = response.data.result;
        dispatch(setProjectManager(result));
        dispatch(setSuccess(true));
        return result;
      } catch (error) {
        const axiosError = error as AxiosError;
        dispatch(setError(axiosError.message || "Failed to fetch project manager"));
        throw error;
      }
    },
    [api]
  );

  const getProjectManagers = useCallback(
    async (input: IGetProjectManagerInput): Promise<{ items: IProjectManager[]; totalCount: number }> => {
      try {
        dispatch(setPending(true));
        const response = await api.get("/api/services/app/ProjectManager/GetAll", {
          params: input,
        });
        const result = response.data.result;
        dispatch(setProjectManagers(result.items));
        dispatch(setTotalCount(result.totalCount));
        dispatch(setSuccess(true));
        return result;
      } catch (error) {
        const axiosError = error as AxiosError;
        dispatch(setError(axiosError.message || "Failed to fetch project managers"));
        throw error;
      }
    },
    [api]
  );

  const getCurrentProjectManager = useCallback(
    async (userId: number): Promise<IProjectManager | null> => {
      try {
        dispatch(setPending(true));
        
        // First attempt to get from local storage to avoid unnecessary API calls
        const cachedData = localStorage.getItem(`project_manager_${userId}`);
        if (cachedData) {
          try {
            const projectManager = JSON.parse(cachedData) as IProjectManager;
            dispatch(setProjectManager(projectManager));
            dispatch(setSuccess(true));
            return projectManager;
          } catch {
            // Invalid cached data, continue with API call
            localStorage.removeItem(`project_manager_${userId}`);
          }
        }

        // Make API call to find the project manager by user ID
        const response = await api.get(`/api/services/app/ProjectManager/GetByUserId`, {
          params: { userId }
        });

        if (response.data.success && response.data.result) {
          const projectManager = response.data.result;
          
          // Cache the result
          localStorage.setItem(`project_manager_${userId}`, JSON.stringify(projectManager));
          
          dispatch(setProjectManager(projectManager));
          dispatch(setSuccess(true));
          return projectManager;
        } else {
          throw new Error("No project manager found for the current user");
        }
      } catch (error) {
        const axiosError = error as AxiosError;
        dispatch(setError(axiosError.message || "Failed to get project manager"));
        console.error("Error fetching project manager:", error);
        return null;
      }
    },
    [api]
  );

  const actions: IProjectManagerActionContext = {
    getProjectManager,
    getProjectManagers,
    getCurrentProjectManager,
  };

  return (
    <ProjectManagerStateContext.Provider value={state}>
      <ProjectManagerActionContext.Provider value={actions}>
        {children}
      </ProjectManagerActionContext.Provider>
    </ProjectManagerStateContext.Provider>
  );
};

// Custom hooks for consuming the context
export const useProjectManagerState = (): IProjectManagerStateContext => {
  const context = useContext(ProjectManagerStateContext);
  if (context === undefined) {
    throw new Error("useProjectManagerState must be used within a ProjectManagerProvider");
  }
  return context;
};

export const useProjectManagerActions = (): IProjectManagerActionContext => {
  const context = useContext(ProjectManagerActionContext);
  if (context === undefined) {
    throw new Error("useProjectManagerActions must be used within a ProjectManagerProvider");
  }
  return context;
}; 