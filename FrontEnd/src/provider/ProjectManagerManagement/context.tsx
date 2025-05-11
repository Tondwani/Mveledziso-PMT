"use client";

import { createContext } from "react";

// Project Manager Interfaces
export interface IProjectManager {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  userId: number;
}

// Input DTOs
export interface IGetProjectManagerInput {
  userId: number;
}

// State Interface
export interface IProjectManagerStateContext {
  isPending: boolean;
  isSuccess: boolean;
  isError: boolean;
  errorMessage: string | undefined;
  projectManager: IProjectManager | null;
  projectManagers: IProjectManager[];
  totalCount: number;
}

// Initial State
export const INITIAL_STATE: IProjectManagerStateContext = {
  isPending: false,
  isSuccess: false,
  isError: false,
  errorMessage: undefined,
  projectManager: null,
  projectManagers: [],
  totalCount: 0
};

// Actions Interface
export interface IProjectManagerActionContext {
  getProjectManager: (id: string) => Promise<IProjectManager>;
  getProjectManagers: (input: IGetProjectManagerInput) => Promise<{ items: IProjectManager[], totalCount: number }>;
  getCurrentProjectManager: (userId: number) => Promise<IProjectManager | null>;
}

// Create contexts
export const ProjectManagerStateContext = createContext<IProjectManagerStateContext>(INITIAL_STATE);
export const ProjectManagerActionContext = createContext<IProjectManagerActionContext>({
  getProjectManager: () => Promise.resolve({} as IProjectManager),
  getProjectManagers: () => Promise.resolve({ items: [], totalCount: 0 }),
  getCurrentProjectManager: () => Promise.resolve(null)
}); 