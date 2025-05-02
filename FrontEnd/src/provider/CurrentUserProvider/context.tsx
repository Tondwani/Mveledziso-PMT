import { createContext } from "react";

export type UserRole = 'Admin' | 'User';

export interface UserLoginInfo {
  id: number;
  name: string;
  surname: string;
  userName: string;
  emailAddress: string;
  role: UserRole; 
}

export interface SessionData {
  application: {
    version: string;
    releaseDate: string;
  };
  user?: UserLoginInfo;
}

export interface ISessionStateContext {
  isPending: boolean;
  isSuccess: boolean;
  isError: boolean;
  data?: SessionData;
  error?: string;
}

export interface ISessionActionContext {
  getCurrentLoginInfo: () => Promise<void>;
  clearSession: () => void;
}

export const INITIAL_STATE: ISessionStateContext = {
  isPending: false,
  isSuccess: false,
  isError: false,
};

export const SessionStateContext = createContext<ISessionStateContext>(INITIAL_STATE);
export const SessionActionContext = createContext<ISessionActionContext | undefined>(undefined);