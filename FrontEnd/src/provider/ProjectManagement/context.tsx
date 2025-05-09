import { createContext } from "react";

// Project Interfaces
export interface IProject {
  id: string;
  name: string;
  description?: string;
  startDate: string;
  endDate: string;
  isCollaborationEnabled: boolean;
  teamId: string;
  timeline?: ITimeline;
  duties?: IProjectDuty[];
}

export interface ITimeline {
  id: string;
  name: string;
  phases: ITimelinePhase[];
  milestones: IMilestone[];
}

export interface ITimelinePhase {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
}

export interface IMilestone {
  id: string;
  name: string;
  date: string;
  isCompleted: boolean;
}

// Project Duty Interfaces
export enum DutyStatus {
  ToDo = 1,
  InProgress = 2,
  Review = 3,
  Done = 4,
}

export enum Priority {
  low = 1,
  Medium = 2,
  High = 3,
  Urgent = 4
}

export interface IProjectDuty {
  id: string;
  title: string;
  description?: string;
  status: DutyStatus;
  priority: Priority;
  projectId: string;
  dueDate?: string;
  assignedUserId?: string;
}

// Input DTOs
export interface ICreateProjectDto {
  name: string;
  description?: string;
  teamId: string;
  startDate: string;
  endDate: string;
  isCollaborationEnabled: boolean;
}

export interface IUpdateProjectDto {
  id: string;
  name: string;
  description?: string;
  startDate: string;
  endDate: string;
  isCollaborationEnabled: boolean;
}

export interface IGetProjectsInput {
  filter?: string;
  teamId?: string;
  sorting?: string;
}

export interface ICreateProjectDutyDto {
  title: string;
  description?: string;
  projectId: string;
  priority: Priority;
  dueDate?: string;
}

export interface IUpdateProjectDutyDto {
  id: string;
  title?: string;
  description?: string;
  priority?: Priority;
  dueDate?: string;
}

export interface IGetProjectDutiesInput {
  filter?: string;
  projectId?: string;
  status?: DutyStatus;
  priority?: Priority;
}

// State Interfaces
export interface IProjectStateContext {
  isPending: boolean;
  isSuccess: boolean;
  isError: boolean;
  project?: IProject;
  projects?: IProject[];
  projectDuty?: IProjectDuty;
  projectDuties?: IProjectDuty[];
  message?: string;
}

// Initial State
export const INITIAL_STATE: IProjectStateContext = {
  isPending: false,
  isSuccess: false,
  isError: false,
};

// Actions Interface
export interface IProjectActionContext {
  // Project Actions
  createProject: (project: ICreateProjectDto) => Promise<IProject>;
  updateProject: (project: IUpdateProjectDto) => Promise<IProject>;
  getProject: (id: string) => Promise<IProject>;
  getProjects: (input: IGetProjectsInput) => Promise<IProject[]>;
  getProjectsByTeam: (teamId: string) => Promise<IProject[]>;
  getProjectWithDetails: (id: string) => Promise<IProject>;

  // Project Duty Actions
  createProjectDuty: (duty: ICreateProjectDutyDto) => Promise<IProjectDuty>;
  updateProjectDuty: (duty: IUpdateProjectDutyDto) => Promise<IProjectDuty>;
  updateDutyStatus: (id: string, status: DutyStatus) => Promise<void>;
  getProjectDuty: (id: string) => Promise<IProjectDuty>;
  getProjectDuties: (input: IGetProjectDutiesInput) => Promise<IProjectDuty[]>;
  getDutiesByProject: (projectId: string) => Promise<IProjectDuty[]>;
}

// Contexts
export const ProjectStateContext = createContext<IProjectStateContext>(INITIAL_STATE);
export const ProjectActionContext = createContext<IProjectActionContext | undefined>(undefined);