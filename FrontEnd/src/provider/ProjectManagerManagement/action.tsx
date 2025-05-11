"use client";
import { IProjectManager } from "./context";

// Action Types
export enum ProjectManagerActionEnum {
  SET_PENDING = "PROJECT_MANAGER_SET_PENDING",
  SET_ERROR = "PROJECT_MANAGER_SET_ERROR",
  SET_SUCCESS = "PROJECT_MANAGER_SET_SUCCESS",
  SET_PROJECT_MANAGER = "PROJECT_MANAGER_SET_PROJECT_MANAGER",
  SET_PROJECT_MANAGERS = "PROJECT_MANAGER_SET_PROJECT_MANAGERS",
  SET_TOTAL_COUNT = "PROJECT_MANAGER_SET_TOTAL_COUNT",
  RESET_STATE = "PROJECT_MANAGER_RESET_STATE"
}

// Action Interfaces
export interface ISetPendingAction {
  type: typeof ProjectManagerActionEnum.SET_PENDING;
  payload: {
    isPending: boolean;
    isSuccess: boolean;
  };
}

export interface ISetErrorAction {
  type: typeof ProjectManagerActionEnum.SET_ERROR;
  payload: {
    isError: boolean;
    errorMessage: string;
    isPending: boolean;
    isSuccess: boolean;
  };
}

export interface ISetSuccessAction {
  type: typeof ProjectManagerActionEnum.SET_SUCCESS;
  payload: {
    isSuccess: boolean;
    isPending: boolean;
    isError: boolean;
    errorMessage?: string;
  };
}

export interface ISetProjectManagerAction {
  type: typeof ProjectManagerActionEnum.SET_PROJECT_MANAGER;
  payload: {
    projectManager: IProjectManager | null;
  };
}

export interface ISetProjectManagersAction {
  type: typeof ProjectManagerActionEnum.SET_PROJECT_MANAGERS;
  payload: {
    projectManagers: IProjectManager[];
  };
}

export interface ISetTotalCountAction {
  type: typeof ProjectManagerActionEnum.SET_TOTAL_COUNT;
  payload: {
    totalCount: number;
  };
}

// Union Action Types
export type ProjectManagerActionTypes =
  | ISetPendingAction
  | ISetErrorAction
  | ISetSuccessAction
  | ISetProjectManagerAction
  | ISetProjectManagersAction
  | ISetTotalCountAction;

// Action Creators
export const setPending = (isPending: boolean) => ({
  type: ProjectManagerActionEnum.SET_PENDING,
  payload: {
    isPending,
    isSuccess: false
  }
});

export const setError = (errorMessage: string) => ({
  type: ProjectManagerActionEnum.SET_ERROR,
  payload: {
    isError: true,
    errorMessage,
    isPending: false,
    isSuccess: false
  }
});

export const setSuccess = (isSuccess: boolean) => ({
  type: ProjectManagerActionEnum.SET_SUCCESS,
  payload: {
    isSuccess,
    isPending: false,
    isError: false,
    errorMessage: undefined
  }
});

export const setProjectManager = (projectManager: IProjectManager | null) => ({
  type: ProjectManagerActionEnum.SET_PROJECT_MANAGER,
  payload: {
    projectManager
  }
});

export const setProjectManagers = (projectManagers: IProjectManager[]) => ({
  type: ProjectManagerActionEnum.SET_PROJECT_MANAGERS,
  payload: {
    projectManagers
  }
});

export const setTotalCount = (totalCount: number) => ({
  type: ProjectManagerActionEnum.SET_TOTAL_COUNT,
  payload: {
    totalCount
  }
});

export const resetState = () => ({
  type: ProjectManagerActionEnum.RESET_STATE
}); 