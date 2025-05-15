import { createContext } from "react";
import { ITimeline } from "../ProjectManagement/context";

// Milestone Interfaces
export interface IMilestone {
  id: string;
  title: string;
  description?: string;
  timelineId: string;
  timeline?: ITimeline;
  dueDate: Date;
  isCompleted: boolean;
  timelineName?: string;
  creationTime: Date;
}

// Input DTOs
export interface ICreateMilestoneDto {
  title: string;
  description?: string;
  timelineId: string;
  dueDate: Date;
  isCompleted: boolean;
}

export interface IUpdateMilestoneDto {
  id: string;
  title: string;
  description?: string;
  timelineId: string;
  dueDate: Date;
  isCompleted: boolean;
}

export interface IGetMilestonesInput {
  timelineId?: string;
  isCompleted?: boolean;
  skipCount?: number;
  maxResultCount?: number;
}

// State Interfaces
export interface IMilestoneStateContext {
  isPending: boolean;
  isSuccess: boolean;
  isError: boolean;
  milestone?: IMilestone;
  milestones?: IMilestone[];
  message?: string;
}

// Initial State
export const INITIAL_STATE: IMilestoneStateContext = {
  isPending: false,
  isSuccess: false,
  isError: false,
};

// Actions Interface
export interface IMilestoneActionContext {
  createMilestone: (milestone: ICreateMilestoneDto) => Promise<IMilestone>;
  updateMilestone: (milestone: IUpdateMilestoneDto) => Promise<IMilestone>;
  deleteMilestone: (id: string) => Promise<void>;
  getMilestone: (id: string) => Promise<IMilestone>;
  getMilestones: (input: IGetMilestonesInput) => Promise<PagedResultDto<IMilestone>>;
}

// Contexts
export const MilestoneStateContext = createContext<IMilestoneStateContext>(INITIAL_STATE);
export const MilestoneActionContext = createContext<IMilestoneActionContext | undefined>(undefined);

// Paged Result Interface
export interface PagedResultDto<T> {
  totalCount: number;
  items: T[];
}
