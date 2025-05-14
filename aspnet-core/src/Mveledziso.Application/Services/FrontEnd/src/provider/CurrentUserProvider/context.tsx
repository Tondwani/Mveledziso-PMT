"use client";
import { createContext } from "react";

// Base interface for user creation
export interface ICreateUser {
  firstName: string;
  lastName: string;
  email: string;
  userName?: string;
  password: string;
}

// Team Member specific interface
export interface ICreateTeamMember extends ICreateUser {
  role?: number; // TeamRole enum value (0 for Member) - now optional
}

// Project Manager specific type 
export type ICreateProjectManager = ICreateUser;

// Base interface for user
export interface IUser {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  userName?: string;
}

// Team Member specific interface
export interface ITeamMember extends IUser {
  role: number;
  userId?: number;
}

// Project Manager specific type
export interface IProjectManager extends IUser {
  userId?: number;
}

// Current user interface with roles
export interface ICurrentUser {
  id: number;
  userName: string;
  name: string;
  surname: string;
  emailAddress: string;
  roles: string[];
}

// Auth state interface
export interface IAuthState {
  token: string | null;
  currentUser: ICurrentUser | null;
  isPending: boolean;
  isSuccess: boolean;
  isError: boolean;
  errorMessage: string | undefined;
  teamMembers?: ITeamMember[];
  projectManagers?: IProjectManager[];
}

// Auth actions interface
export interface IAuthActions {
  login: (userNameOrEmail: string, password: string) => Promise<void>;
  logout: () => void;
  getCurrentLoginInfo: () => Promise<void>;
  createTeamMember: (data: ICreateTeamMember) => Promise<ITeamMember>;
  createProjectManager: (data: ICreateProjectManager) => Promise<IProjectManager>;
}

// Initial state
export const INITIAL_STATE: IAuthState = {
  token: null,
  currentUser: null,
  isPending: false,
  isSuccess: false,
  isError: false,
  errorMessage: undefined,
  teamMembers: [],
  projectManagers: []
};

// Create contexts
export const AuthStateContext = createContext<IAuthState>(INITIAL_STATE);
export const AuthActionContext = createContext<IAuthActions>({
  login: () => Promise.resolve(),
  logout: () => {},
  getCurrentLoginInfo: () => Promise.resolve(),
  createTeamMember: () => Promise.resolve({} as ITeamMember),
  createProjectManager: () => Promise.resolve({} as IProjectManager),
});