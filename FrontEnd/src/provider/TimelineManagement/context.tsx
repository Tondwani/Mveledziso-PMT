import { createContext } from "react";

export type TimelinePhaseStatus = 'Completed' | 'InProgress' | 'NotStarted';

// Timeline Interfaces
export interface ITimeline {
  id: string;
  name: string;
  projectId: string;
  creationTime: string;
  creatorUserId: number;
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
  name: string;
  timelineId: string;
  startDate: string;
  endDate: string;
  status: TimelinePhaseStatus;
}

// Input DTOs
export interface ICreateTimelineDto {
  name: string;
  projectId: string;
}

export interface IUpdateTimelineDto {
  id: string;
  name?: string;
  projectId?: string;
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
  name?: string;
  startDate?: string;
  endDate?: string;
  status?: TimelinePhaseStatus;
}

export interface IGetTimelineInput {
  projectId?: string;
  maxResultCount?: number;
  skipCount?: number;
  fromDate?: string;
  toDate?: string;
  isDeleted?: boolean;
}

export interface IGetTimelinePhaseInput {
  timelineId?: string;
  maxResultCount?: number;
  skipCount?: number;
}

// State Interface
export interface ITimelineStateContext {
  isPending: boolean;
  isSuccess: boolean;
  isError: boolean;
  errorMessage: string | undefined;
  timeline: ITimeline | null;
  timelines: ITimeline[];
  timelinePhase: ITimelinePhase | null;
  timelinePhases: ITimelinePhase[];
}

// Actions Interface
export interface ITimelineActionContext {
  createTimeline: (timeline: ICreateTimelineDto) => Promise<ITimeline>;
  updateTimeline: (timeline: IUpdateTimelineDto) => Promise<ITimeline>;
  deleteTimeline: (id: string) => Promise<void>;
  getTimeline: (id: string) => Promise<ITimeline>;
  getTimelines: (input: IGetTimelineInput) => Promise<TimelineResponse>;
  createTimelinePhase: (phase: ICreateTimelinePhaseDto) => Promise<ITimelinePhase>;
  updateTimelinePhase: (phase: IUpdateTimelinePhaseDto) => Promise<ITimelinePhase>;
  deleteTimelinePhase: (id: string) => Promise<void>;
  getTimelinePhase: (id: string) => Promise<ITimelinePhase>;
  getTimelinePhases: (input: IGetTimelinePhaseInput) => Promise<ITimelinePhase[]>;
}

// Initial State
export const INITIAL_STATE: ITimelineStateContext = {
  isPending: false,
  isSuccess: false,
  isError: false,
  errorMessage: undefined,
  timeline: null,
  timelines: [],
  timelinePhase: null,
  timelinePhases: []
};

// Create contexts
export const TimelineStateContext = createContext<ITimelineStateContext>(INITIAL_STATE);
export const TimelineActionContext = createContext<ITimelineActionContext>({
  createTimeline: () => Promise.resolve({} as ITimeline),
  updateTimeline: () => Promise.resolve({} as ITimeline),
  deleteTimeline: () => Promise.resolve(),
  getTimeline: () => Promise.resolve({} as ITimeline),
  getTimelines: () => Promise.resolve({} as TimelineResponse),
  createTimelinePhase: () => Promise.resolve({} as ITimelinePhase),
  updateTimelinePhase: () => Promise.resolve({} as ITimelinePhase),
  deleteTimelinePhase: () => Promise.resolve(),
  getTimelinePhase: () => Promise.resolve({} as ITimelinePhase),
  getTimelinePhases: () => Promise.resolve([])
});
