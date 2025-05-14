"use client";

import { useContext, useReducer } from "react";
import { getAxiosInstance } from "../../utils/axiosInstance";
import { 
  INITIAL_STATE, 
  ActivityLogStateContext, 
  ActivityLogActionContext,
  IActivityLogActionContext,
  IActivityLog,
  ICreateActivityLogDto,
  IUpdateActivityLogDto,
  IGetActivityLogsInput
} from "./context";
import { ActivityLogReducer } from "./reducer";
import { 
  setPending,
  setError,
  setActivityLog,
  setActivityLogs
} from "./action";

const API_ENDPOINTS = {
  activityLog: "/api/services/app/ActivityLog"
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

export const ActivityLogProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(ActivityLogReducer, INITIAL_STATE);
  const instance = getAxiosInstance();

  const createActivityLog = async (log: ICreateActivityLogDto) => {
    dispatch(setPending());
    try {
      const response = await instance.post(`${API_ENDPOINTS.activityLog}/Create`, log);
      const createdLog: IActivityLog = response.data.result;
      dispatch(setActivityLog(createdLog));
      return createdLog;
    } catch (error: unknown) {
      const apiError = error as ApiError;
      dispatch(setError(apiError.response?.data?.error?.message || "Activity log creation failed"));
      throw error;
    }
  };

  const updateActivityLog = async (id: string, log: IUpdateActivityLogDto): Promise<IActivityLog> => {
    dispatch(setPending());
    try {
      const response = await instance.put(`${API_ENDPOINTS.activityLog}/Update?id=${id}`, log);
      const updatedLog: IActivityLog = response.data.result;
      dispatch(setActivityLog(updatedLog));
      return updatedLog;
    } catch (error: unknown) {
      const apiError = error as ApiError;
      dispatch(setError(apiError.response?.data?.error?.message || "Activity log update failed"));
      throw error;
    }
  };

  const deleteActivityLog = async (id: string): Promise<void> => {
    dispatch(setPending());
    try {
      await instance.delete(`${API_ENDPOINTS.activityLog}/Delete?id=${id}`);
      // After successful deletion, you might want to refresh the list
      const currentLogs = state.activityLogs.filter(log => log.id !== id);
      dispatch(setActivityLogs(currentLogs));
    } catch (error: unknown) {
      const apiError = error as ApiError;
      dispatch(setError(apiError.response?.data?.error?.message || "Activity log deletion failed"));
      throw error;
    }
  };

  const getActivityLog = async (id: string): Promise<IActivityLog> => {
    dispatch(setPending());
    try {
      const response = await instance.get(`${API_ENDPOINTS.activityLog}/Get`, {
        params: { id }
      });
      const log: IActivityLog = response.data.result;
      dispatch(setActivityLog(log));
      return log;
    } catch (error: unknown) {
      const apiError = error as ApiError;
      dispatch(setError(apiError.response?.data?.error?.message || "Failed to load activity log"));
      throw error;
    }
  };

  const getActivityLogs = async (input: IGetActivityLogsInput): Promise<IActivityLog[]> => {
    dispatch(setPending());
    try {
      const response = await instance.get(`${API_ENDPOINTS.activityLog}/GetList`, { params: input });
      const logs: IActivityLog[] = response.data.result;
      dispatch(setActivityLogs(logs));
      return logs;
    } catch (error: unknown) {
      const apiError = error as ApiError;
      dispatch(setError(apiError.response?.data?.error?.message || "Failed to load activity logs"));
      throw error;
    }
  };

  const actions: IActivityLogActionContext = {
    createActivityLog,
    updateActivityLog,
    deleteActivityLog,
    getActivityLog,
    getActivityLogs
  };

  return (
    <ActivityLogStateContext.Provider value={state}>
      <ActivityLogActionContext.Provider value={actions}>
        {children}
      </ActivityLogActionContext.Provider>
    </ActivityLogStateContext.Provider>
  );
};

// Custom hooks for consuming the context
export const useActivityLogState = () => {
  const context = useContext(ActivityLogStateContext);
  if (context === undefined) {
    throw new Error("useActivityLogState must be used within an ActivityLogProvider");
  }
  return context;
};

export const useActivityLogActions = () => {
  const context = useContext(ActivityLogActionContext);
  if (context === undefined) {
    throw new Error("useActivityLogActions must be used within an ActivityLogProvider");
  }
  return context;
};
