import { createContext } from "react";
import { ITimeline } from "../ProjectManagement/context";

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

export interface IMilestoneStateContext {
  isPending: boolean;
  isSuccess: boolean;
  isError: boolean;
  milestone?: IMilestone;
  milestones?: IMilestone[];
  message?: string;
}

export const INITIAL_STATE: IMilestoneStateContext = {
  isPending: false,
  isSuccess: false,
  isError: false,
};

export interface IMilestoneActionContext {
  createMilestone: (milestone: ICreateMilestoneDto) => Promise<IMilestone>;
  updateMilestone: (milestone: IUpdateMilestoneDto) => Promise<IMilestone>;
  deleteMilestone: (id: string) => Promise<void>;
  getMilestone: (id: string) => Promise<IMilestone>;
  getMilestones: (input: IGetMilestonesInput) => Promise<PagedResultDto<IMilestone>>;
}

export const MilestoneStateContext = createContext<IMilestoneStateContext>(INITIAL_STATE);
export const MilestoneActionContext = createContext<IMilestoneActionContext | undefined>(undefined);

export interface PagedResultDto<T> {
  totalCount: number;
  items: T[];
}
