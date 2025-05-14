import { createContext } from "react";

export type TimelinePhaseStatus = 'Completed' | 'InProgress' | 'NotStarted';

// Timeline Interfaces
export interface ITimeline {
  id: string;
  name: string;
  projectId: string;
  creationTime: string;
  creatorUserId: number | null;
  lastModificationTime: string | null;
  lastModifierUserId: number | null;
  isDeleted: boolean;
  deleterUserId: number | null;
  deletionTime: string | null;
}

export interface TimelineResponse {
  totalCount: number;
  items: ITimeline[];
}

export interface ITimelinePhase {
  id: string;
  timelineId: string;
  name: string;
  startDate: string;
  endDate: string;
  status: TimelinePhaseStatus;
  creationTime: string;
  creatorUserId: number | null;
  lastModificationTime: string | null;
  lastModifierUserId: number | null;
}

// Input DTOs
export interface ICreateTimelineDto {
  name: string;
  projectId: string;
}

export interface IUpdateTimelineDto {
  id: string;
  name: string;
  projectId: string;
}

export interface ICreateTimelinePhaseDto {
  name: string;
  timelineId: string;
  startDate: string;
  endDate: string;
  status: TimelinePhaseStatus;
}

export interface IUpdateTimelinePhaseDto {
  id: string;
  name: string;
  timelineId: string;
  startDate: string;
  endDate: string;
  status: TimelinePhaseStatus;
}

export interface IGetTimelineInput {
  maxResultCount?: number;
  skipCount?: number;
  projectId?: string;
  isDeleted?: boolean;
}

export interface IGetTimelinePhaseInput {
  timelineId?: string;
  status?: TimelinePhaseStatus;
  startDate?: string;
  endDate?: string;
  maxResultCount?: number;
  skipCount?: number;
}

// State Interface
export interface ITimelineStateContext {
  timelines: ITimeline[];
  timeline: ITimeline | null;
  timelinePhases: ITimelinePhase[];
  timelinePhase: ITimelinePhase | null;
  isPending: boolean;
  isSuccess: boolean;
  isError: boolean;
  errorMessage: string | undefined;
  totalCount: number;
}

// Actions Interface
export interface ITimelineActionContext {
  getTimeline: (id: string) => Promise<ITimeline>;
  getTimelines: (input: IGetTimelineInput) => Promise<{totalCount: number; items: ITimeline[]}>;
  createTimeline: (timeline: ICreateTimelineDto) => Promise<ITimeline>;
  updateTimeline: (timeline: IUpdateTimelineDto) => Promise<ITimeline>;
  deleteTimeline: (id: string) => Promise<void>;
  getTimelinePhase: (id: string) => Promise<ITimelinePhase>;
  getTimelinePhases: (input: IGetTimelinePhaseInput) => Promise<ITimelinePhase[]>;
  createTimelinePhase: (phase: ICreateTimelinePhaseDto) => Promise<ITimelinePhase>;
  updateTimelinePhase: (phase: IUpdateTimelinePhaseDto) => Promise<ITimelinePhase>;
  deleteTimelinePhase: (id: string) => Promise<void>;
}

// Initial State
export const INITIAL_STATE: ITimelineStateContext = {
  timelines: [],
  timeline: null,
  timelinePhases: [],
  timelinePhase: null,
  isPending: false,
  isSuccess: false,
  isError: false,
  errorMessage: undefined,
  totalCount: 0
};

// Create contexts
export const TimelineStateContext = createContext<ITimelineStateContext>(INITIAL_STATE);
export const TimelineActionContext = createContext<ITimelineActionContext>({} as ITimelineActionContext);
