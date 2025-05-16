"use client";
import { createContext } from "react";


export interface ICreateUser {
  firstName: string;
  lastName: string;
  email: string;
  userName?: string;
  password: string;
}


export interface ICreateTeamMember extends ICreateUser {
  role?: number; 
}

export type ICreateProjectManager = ICreateUser;

export interface IUser {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  userName?: string;
}

export interface ITeamMember extends IUser {
  role: number;
  userId?: number;
}

export interface IProjectManager extends IUser {
  userId?: number;
}

export interface ICurrentUser {
  id: number;
  userName: string;
  name: string;
  surname: string;
  emailAddress: string;
  roles: string[];
}

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

export interface IAuthActions {
  login: (userNameOrEmail: string, password: string) => Promise<void>;
  logout: () => void;
  getCurrentLoginInfo: () => Promise<void>;
  createTeamMember: (data: ICreateTeamMember) => Promise<ITeamMember>;
  createProjectManager: (data: ICreateProjectManager) => Promise<IProjectManager>;
}

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

export const AuthStateContext = createContext<IAuthState>(INITIAL_STATE);
export const AuthActionContext = createContext<IAuthActions>({
  login: () => Promise.resolve(),
  logout: () => {},
  getCurrentLoginInfo: () => Promise.resolve(),
  createTeamMember: () => Promise.resolve({} as ITeamMember),
  createProjectManager: () => Promise.resolve({} as IProjectManager),
});