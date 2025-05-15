import { IProject, IProjectDuty } from "./context";

export enum ProjectActionEnum {
  SET_PENDING = "SET_PROJECT_PENDING",
  SET_SUCCESS = "SET_PROJECT_SUCCESS",
  SET_ERROR = "SET_PROJECT_ERROR",
  SET_PROJECT = "SET_PROJECT",
  SET_PROJECTS = "SET_PROJECTS",
  SET_PROJECT_DUTY = "SET_PROJECT_DUTY",
  SET_PROJECT_DUTIES = "SET_PROJECT_DUTIES",
  RESET_STATE = "RESET_PROJECT_STATE"
}

// Base Actions
export const setPending = () => ({
  type: ProjectActionEnum.SET_PENDING,
  payload: { isPending: true, isSuccess: false, isError: false, errorMessage: undefined }
});

export const setSuccess = (message?: string) => ({
  type: ProjectActionEnum.SET_SUCCESS,
  payload: { isPending: false, isSuccess: true, isError: false, errorMessage: undefined, message }
});

export const setError = (errorMessage: string) => ({
  type: ProjectActionEnum.SET_ERROR,
  payload: { isPending: false, isSuccess: false, isError: true, errorMessage }
});

export const resetState = () => ({
  type: ProjectActionEnum.RESET_STATE
});

// Project Actions
export const setProject = (project: IProject) => ({
  type: ProjectActionEnum.SET_PROJECT,
  payload: { 
    project,
    isPending: false,
    isSuccess: true,
    isError: false
  }
});

export const setProjects = (projects: IProject[]) => ({
  type: ProjectActionEnum.SET_PROJECTS,
  payload: { 
    projects,
    isPending: false,
    isSuccess: true,
    isError: false
  }
});

// Project Duty Actions
export const setProjectDuty = (duty: IProjectDuty) => ({
  type: ProjectActionEnum.SET_PROJECT_DUTY,
  payload: {
    projectDuty: duty,
    isPending: false,
    isSuccess: true,
    isError: false
  }
});

export const setProjectDuties = (duties: IProjectDuty[]) => ({
  type: ProjectActionEnum.SET_PROJECT_DUTIES,
  payload: {
    projectDuties: duties,
    isPending: false,
    isSuccess: true,
    isError: false
  }
});