import { createContext } from "react";

// Activity Log Interfaces
export interface IActivityLog {
  id: string;
  action: string;
  details: string;
  userId: number;
  userName: string;
  entityType: string;
  entityId: string;
  creationTime: string;
}

// Input DTOs
export interface ICreateActivityLogDto {
  action: string;
  details: string;
  entityType: string;
  entityId: string;
}

export interface IUpdateActivityLogDto {
  details: string;
}

export interface IGetActivityLogsInput {
  userId?: number;
  action?: string;
  entityType?: string;
  entityId?: string;
  startDate?: string;
  endDate?: string;
  skipCount?: number;
  maxResultCount?: number;
}

// State Interface
export interface IActivityLogStateContext {
  isPending: boolean;
  isSuccess: boolean;
  isError: boolean;
  errorMessage: string | undefined;
  activityLog: IActivityLog | null;
  activityLogs: IActivityLog[];
}

// Initial State
export const INITIAL_STATE: IActivityLogStateContext = {
  isPending: false,
  isSuccess: false,
  isError: false,
  errorMessage: undefined,
  activityLog: null,
  activityLogs: []
};

// Actions Interface
export interface IActivityLogActionContext {
  createActivityLog: (log: ICreateActivityLogDto) => Promise<IActivityLog>;
  updateActivityLog: (id: string, log: IUpdateActivityLogDto) => Promise<IActivityLog>;
  deleteActivityLog: (id: string) => Promise<void>;
  getActivityLog: (id: string) => Promise<IActivityLog>;
  getActivityLogs: (input: IGetActivityLogsInput) => Promise<IActivityLog[]>;
}

// Create contexts
export const ActivityLogStateContext = createContext<IActivityLogStateContext>(INITIAL_STATE);
export const ActivityLogActionContext = createContext<IActivityLogActionContext>({
  createActivityLog: () => Promise.resolve({} as IActivityLog),
  updateActivityLog: () => Promise.resolve({} as IActivityLog),
  deleteActivityLog: () => Promise.resolve(),
  getActivityLog: () => Promise.resolve({} as IActivityLog),
  getActivityLogs: () => Promise.resolve([])
});
