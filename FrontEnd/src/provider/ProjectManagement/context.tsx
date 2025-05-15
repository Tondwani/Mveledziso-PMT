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
  progress?: number;  // Computed property based on duties completion
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
  deadline?: string;
  projectName?: string;
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
  projectManagerId: string;
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
  errorMessage: string | undefined;
  project: IProject | null;
  projects: IProject[];
  projectDuty: IProjectDuty | null;
  projectDuties: IProjectDuty[];
}

// Initial State
export const INITIAL_STATE: IProjectStateContext = {
  isPending: false,
  isSuccess: false,
  isError: false,
  errorMessage: undefined,
  project: null,
  projects: [],
  projectDuty: null,
  projectDuties: []
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

// Create contexts
export const ProjectStateContext = createContext<IProjectStateContext>(INITIAL_STATE);
export const ProjectActionContext = createContext<IProjectActionContext>({
  // Project Actions
  createProject: () => Promise.resolve({} as IProject),
  updateProject: () => Promise.resolve({} as IProject),
  getProject: () => Promise.resolve({} as IProject),
  getProjects: () => Promise.resolve([]),
  getProjectsByTeam: () => Promise.resolve([]),
  getProjectWithDetails: () => Promise.resolve({} as IProject),

  // Project Duty Actions
  createProjectDuty: () => Promise.resolve({} as IProjectDuty),
  updateProjectDuty: () => Promise.resolve({} as IProjectDuty),
  updateDutyStatus: () => Promise.resolve(),
  getProjectDuty: () => Promise.resolve({} as IProjectDuty),
  getProjectDuties: () => Promise.resolve([]),
  getDutiesByProject: () => Promise.resolve([])
});