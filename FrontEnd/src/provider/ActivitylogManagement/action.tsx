import { IActivityLog } from "./context";

export enum ActivityLogActionEnum {
  SET_PENDING = "SET_ACTIVITY_LOG_PENDING",
  SET_SUCCESS = "SET_ACTIVITY_LOG_SUCCESS",
  SET_ERROR = "SET_ACTIVITY_LOG_ERROR",
  SET_ACTIVITY_LOG = "SET_ACTIVITY_LOG",
  SET_ACTIVITY_LOGS = "SET_ACTIVITY_LOGS",
  RESET_STATE = "RESET_ACTIVITY_LOG_STATE"
}

// Base Actions
export const setPending = () => ({
  type: ActivityLogActionEnum.SET_PENDING,
  payload: { isPending: true, isSuccess: false, isError: false, errorMessage: undefined }
});

export const setSuccess = (message?: string) => ({
  type: ActivityLogActionEnum.SET_SUCCESS,
  payload: { isPending: false, isSuccess: true, isError: false, errorMessage: undefined, message }
});

export const setError = (errorMessage: string) => ({
  type: ActivityLogActionEnum.SET_ERROR,
  payload: { isPending: false, isSuccess: false, isError: true, errorMessage }
});

export const resetState = () => ({
  type: ActivityLogActionEnum.RESET_STATE
});

// Activity Log Actions
export const setActivityLog = (activityLog: IActivityLog) => ({
  type: ActivityLogActionEnum.SET_ACTIVITY_LOG,
  payload: { 
    activityLog,
    isPending: false,
    isSuccess: true,
    isError: false
  }
});

export const setActivityLogs = (activityLogs: IActivityLog[]) => ({
  type: ActivityLogActionEnum.SET_ACTIVITY_LOGS,
  payload: { 
    activityLogs,
    isPending: false,
    isSuccess: true,
    isError: false
  }
});
