import { IProject, IProjectDuty } from "./context";

export enum ProjectActionEnum {
  // Project Actions
  PROJECT_PENDING = "PROJECT_PENDING",
  PROJECT_SUCCESS = "PROJECT_SUCCESS",
  PROJECT_ERROR = "PROJECT_ERROR",
  PROJECTS_LOADED = "PROJECTS_LOADED",

  // Project Duty Actions
  DUTY_PENDING = "DUTY_PENDING",
  DUTY_SUCCESS = "DUTY_SUCCESS",
  DUTY_ERROR = "DUTY_ERROR",
  DUTIES_LOADED = "DUTIES_LOADED",
}

// Base Actions
export const projectPending = () => ({
  type: ProjectActionEnum.PROJECT_PENDING,
  payload: { isPending: true, isSuccess: false, isError: false }
});

const projectSuccess = (message: string) => ({
  type: ProjectActionEnum.PROJECT_SUCCESS,
  payload: { isPending: false, isSuccess: true, message }
});

export const projectError = (message: string) => ({
  type: ProjectActionEnum.PROJECT_ERROR,
  payload: { isPending: false, isError: true, message }
});

// Project Actions
export const createProjectSuccess = (project: IProject) => ({
  type: ProjectActionEnum.PROJECT_SUCCESS,
  payload: { 
    ...projectSuccess("Project created successfully").payload,
    project,
    projects: [project]
  }
});

export const loadProjectsSuccess = (projects: IProject[]) => ({
  type: ProjectActionEnum.PROJECTS_LOADED,
  payload: { 
    ...projectSuccess("Projects loaded successfully").payload,
    projects 
  }
});

// Duty Actions
export const dutyPending = () => ({
  type: ProjectActionEnum.DUTY_PENDING,
  payload: { isPending: true, isSuccess: false, isError: false }
});

export const createDutySuccess = (duty: IProjectDuty) => ({
  type: ProjectActionEnum.DUTY_SUCCESS,
  payload: {
    ...projectSuccess("Duty created successfully").payload,
    projectDuty: duty,
    projectDuties: [duty]
  }
});

export const loadDutiesSuccess = (duties: IProjectDuty[]) => ({
  type: ProjectActionEnum.DUTIES_LOADED,
  payload: {
    ...projectSuccess("Duties loaded successfully").payload,
    projectDuties: duties
  }
});