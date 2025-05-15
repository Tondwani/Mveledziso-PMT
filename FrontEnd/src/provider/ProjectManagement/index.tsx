"use client";

import { useContext, useReducer } from "react";
import { getAxiosInstance } from "../../utils/axiosInstance";
import { 
  INITIAL_STATE, 
  ProjectStateContext, 
  ProjectActionContext,
  IProjectActionContext,
  IProject,
  IProjectDuty,
  ICreateProjectDto,
  IUpdateProjectDto,
  IGetProjectsInput,
  ICreateProjectDutyDto,
  IUpdateProjectDutyDto,
  DutyStatus,
  IGetProjectDutiesInput
} from "./context";
import { ProjectReducer } from "./reducer";
import { 
  setPending,
  setError,
  setProject,
  setProjects,
  setProjectDuty,
  setProjectDuties
} from "./action";

const API_ENDPOINTS = {
  projects: "/api/services/app/Project",
  duties: "/api/services/app/ProjectDuty"
};

interface ApiError {
  response?: {
    data?: {
      error?: {
        message?: string;
      };
    };
  };
}

export const ProjectProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(ProjectReducer, INITIAL_STATE);
  const instance = getAxiosInstance();

  // Project Actions
  const createProject = async (project: ICreateProjectDto) => {
    dispatch(setPending());
    try {
      const response = await instance.post(`${API_ENDPOINTS.projects}/Create`, project);
      const createdProject: IProject = response.data.result;
      dispatch(setProject(createdProject));
      return createdProject;
    } catch (error: unknown) {
      const apiError = error as ApiError;
      dispatch(setError(apiError.response?.data?.error?.message || "Project creation failed"));
      throw error;
    }
  };

  const updateProject = async (project: IUpdateProjectDto): Promise<IProject> => {
    dispatch(setPending());
    try {
      const response = await instance.put(`${API_ENDPOINTS.projects}/Update`, project);
      const updatedProject: IProject = response.data.result;
      dispatch(setProject(updatedProject));
      return updatedProject;
    } catch (error: unknown) {
      const apiError = error as ApiError;
      dispatch(setError(apiError.response?.data?.error?.message || "Project update failed"));
      throw error;
    }
  };

  const getProject = async (id: string): Promise<IProject> => {
    dispatch(setPending());
    try {
      const response = await instance.get(`${API_ENDPOINTS.projects}/Get`, {
        params: { id }
      });
      const project: IProject = response.data.result;
      dispatch(setProject(project));
      return project;
    } catch (error: unknown) {
      const apiError = error as ApiError;
      dispatch(setError(apiError.response?.data?.error?.message || "Failed to load project"));
      throw error;
    }
  };

  const getProjects = async (input: IGetProjectsInput): Promise<IProject[]> => {
    dispatch(setPending());
    try {
      const response = await instance.get(`${API_ENDPOINTS.projects}/GetAll`, { params: input });
      const projects: IProject[] = response.data.result.items;
      dispatch(setProjects(projects));
      return projects;
    } catch (error: unknown) {
      const apiError = error as ApiError;
      dispatch(setError(apiError.response?.data?.error?.message || "Failed to load projects"));
      throw error;
    }
  };

  const getProjectsByTeam = async (teamId: string) => {
    dispatch(setPending());
    try {
      const response = await instance.get(`${API_ENDPOINTS.projects}/GetProjectsByTeam`, {
        params: { id: teamId }
      });
      const projects: IProject[] = response.data.result.items;
      dispatch(setProjects(projects));
      return projects;
    } catch (error: unknown) {
      const apiError = error as ApiError;
      dispatch(setError(apiError.response?.data?.error?.message || "Failed to load projects"));
      throw error;
    }
  };

  const getProjectWithDetails = async (id: string): Promise<IProject> => {
    dispatch(setPending());
    try {
      const response = await instance.get(`${API_ENDPOINTS.projects}/GetWithDetails`, {
        params: { id }
      });
      const project: IProject = response.data.result;
      dispatch(setProject(project));
      return project;
    } catch (error: unknown) {
      const apiError = error as ApiError;
      dispatch(setError(apiError.response?.data?.error?.message || "Failed to load project details"));
      throw error;
    }
  };

  // Project Duty Actions
  const createProjectDuty = async (duty: ICreateProjectDutyDto) => {
    dispatch(setPending());
    try {
      const response = await instance.post(`${API_ENDPOINTS.duties}/Create`, duty);
      const createdDuty: IProjectDuty = response.data.result;
      dispatch(setProjectDuty(createdDuty));
      return createdDuty;
    } catch (error: unknown) {
      const apiError = error as ApiError;
      dispatch(setError(apiError.response?.data?.error?.message || "Duty creation failed"));
      throw error;
    }
  };

  const updateProjectDuty = async (duty: IUpdateProjectDutyDto): Promise<IProjectDuty> => {
    dispatch(setPending());
    try {
      const response = await instance.put(`${API_ENDPOINTS.duties}/Update`, duty);
      const updatedDuty: IProjectDuty = response.data.result;
      dispatch(setProjectDuty(updatedDuty));
      return updatedDuty;
    } catch (error: unknown) {
      const apiError = error as ApiError;
      dispatch(setError(apiError.response?.data?.error?.message || "Duty update failed"));
      throw error;
    }
  };

  const updateDutyStatus = async (id: string, status: DutyStatus) => {
    dispatch(setPending());
    try {
      await instance.put(`${API_ENDPOINTS.duties}/UpdateStatus`, { id, status });
      const updatedDuty = await instance.get(`${API_ENDPOINTS.duties}/Get`, { params: { id } });
      dispatch(setProjectDuty(updatedDuty.data.result));
    } catch (error: unknown) {
      const apiError = error as ApiError;
      dispatch(setError(apiError.response?.data?.error?.message || "Status update failed"));
      throw error;
    }
  };

  const getProjectDuty = async (id: string): Promise<IProjectDuty> => {
    dispatch(setPending());
    try {
      const response = await instance.get(`${API_ENDPOINTS.duties}/Get`, {
        params: { id }
      });
      const duty: IProjectDuty = response.data.result;
      dispatch(setProjectDuty(duty));
      return duty;
    } catch (error: unknown) {
      const apiError = error as ApiError;
      dispatch(setError(apiError.response?.data?.error?.message || "Failed to load duty"));
      throw error;
    }
  };

  const getProjectDuties = async (input: IGetProjectDutiesInput): Promise<IProjectDuty[]> => {
    dispatch(setPending());
    try {
      const response = await instance.get(`${API_ENDPOINTS.duties}/GetAll`, {
        params: input
      });
      const duties: IProjectDuty[] = response.data.result.items;
      dispatch(setProjectDuties(duties));
      return duties;
    } catch (error: unknown) {
      const apiError = error as ApiError;
      dispatch(setError(apiError.response?.data?.error?.message || "Failed to load duties"));
      throw error;
    }
  };

  const getDutiesByProject = async (projectId: string) => {
    dispatch(setPending());
    try {
      const response = await instance.get(`${API_ENDPOINTS.duties}/GetDutiesByProject`, {
        params: { id: projectId }
      });
      const duties: IProjectDuty[] = response.data.result.items;
      dispatch(setProjectDuties(duties));
      return duties;
    } catch (error: unknown) {
      const apiError = error as ApiError;
      dispatch(setError(apiError.response?.data?.error?.message || "Failed to load duties"));
      throw error;
    }
  };

  const actionContextValue: IProjectActionContext = {
    createProject,
    updateProject,
    getProject,
    getProjects,
    getProjectsByTeam,
    getProjectWithDetails,
    createProjectDuty,
    updateProjectDuty,
    updateDutyStatus,
    getProjectDuty,
    getProjectDuties,
    getDutiesByProject
  };

  return (
    <ProjectStateContext.Provider value={state}>
      <ProjectActionContext.Provider value={actionContextValue}>
        {children}
      </ProjectActionContext.Provider>
    </ProjectStateContext.Provider>
  );
};

export const useProjectState = () => {
  const context = useContext(ProjectStateContext);
  if (!context) throw new Error('useProjectState must be used within a ProjectProvider');
  return context;
};

export const useProjectActions = () => {
  const context = useContext(ProjectActionContext);
  if (!context) throw new Error('useProjectActions must be used within a ProjectProvider');
  return context;
};