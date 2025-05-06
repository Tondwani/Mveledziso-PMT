"use client";
import { createContext } from "react";

// User information interface matching ABP response
export interface ICurrentUser {
  id: number;
  name: string;
  surname: string;
  userName: string;
  emailAddress: string;
  roles: string[];
}

// Authentication state interface
export interface IAuthStateContext {
  isPending: boolean;
  isSuccess: boolean;
  isError: boolean;
  errorMessage?: string;
  currentUser?: ICurrentUser;
  accessToken?: string;
}

// Authentication actions interface
export interface IAuthActionContext {
  login: (userNameOrEmail: string, password: string) => Promise<void>;
  logout: () => void;
  getCurrentLoginInfo: () => Promise<void>;
  register: (userData: IRegisterUser) => Promise<void>;
}

// User registration interface matching ABP Create User endpoint
export interface IRegisterUser {
  userName: string;
  name: string;
  surname: string;
  emailAddress: string;
  password: string;
  roleNames: string[]; // ['  Manager'] or ['User']
}

// Initial state
export const INITIAL_STATE: IAuthStateContext = {
  isPending: false,
  isSuccess: false,
  isError: false,
};

// Create contexts
export const AuthStateContext = createContext<IAuthStateContext>(INITIAL_STATE);
export const AuthActionContext = createContext<IAuthActionContext | undefined>(undefined);