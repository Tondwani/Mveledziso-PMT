"use client";

import { createContext } from "react";

export interface IProjectManager {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  userId: number;
}

export interface IGetProjectManagerInput {
  userId: number;
}

export interface IProjectManagerStateContext {
  isPending: boolean;
  isSuccess: boolean;
  isError: boolean;
  errorMessage: string | undefined;
  projectManager: IProjectManager | null;
  projectManagers: IProjectManager[];
  totalCount: number;
}

export const INITIAL_STATE: IProjectManagerStateContext = {
  isPending: false,
  isSuccess: false,
  isError: false,
  errorMessage: undefined,
  projectManager: null,
  projectManagers: [],
  totalCount: 0
};

export interface IProjectManagerActionContext {
  getProjectManager: (id: string) => Promise<IProjectManager>;
  getProjectManagers: (input: IGetProjectManagerInput) => Promise<{ items: IProjectManager[], totalCount: number }>;
  getCurrentProjectManager: (userId: number) => Promise<IProjectManager | null>;
}

export const ProjectManagerStateContext = createContext<IProjectManagerStateContext>(INITIAL_STATE);
export const ProjectManagerActionContext = createContext<IProjectManagerActionContext>({
  getProjectManager: () => Promise.resolve({} as IProjectManager),
  getProjectManagers: () => Promise.resolve({ items: [], totalCount: 0 }),
  getCurrentProjectManager: () => Promise.resolve(null)
}); 