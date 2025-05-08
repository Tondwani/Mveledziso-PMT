import { createContext } from "react";

export type DutyStatus = 'Completed' | 'InProgress' | 'NotStarted';
export type DutyPriority = 'High' | 'Medium' | 'Low';

// UserDuty Interface
export interface IUserDuty {
  id: string;
  title: string;
  teamMemberId: string;
  projectDutyId: string;
  status: DutyStatus;
  priority: DutyPriority;
  dueDate: string;
  creationTime: string;
}

// Input DTOs
export interface ICreateUserDutyDto {
  title: string;
  teamMemberId: string;
  projectDutyId: string;
  status: DutyStatus;
  priority: DutyPriority;
  dueDate: string;
}

export interface IUpdateUserDutyDto {
  id: string;
  title?: string;
  teamMemberId?: string;
  projectDutyId?: string;
  status?: DutyStatus;
  priority?: DutyPriority;
  dueDate?: string;
}

export interface IGetUserDutyInput {
  teamMemberId?: string;
  projectDutyId?: string;
  fromDate?: Date;
  toDate?: Date;
}

// State Interface
export interface IUserDutyStateContext {
  isPending: boolean;
  isSuccess: boolean;
  isError: boolean;
  errorMessage: string | undefined;
  userDuty: IUserDuty | null;
  userDuties: IUserDuty[];
}

// Actions Interface
export interface IUserDutyActionContext {
  createUserDuty: (duty: ICreateUserDutyDto) => Promise<IUserDuty>;
  updateUserDuty: (duty: IUpdateUserDutyDto) => Promise<IUserDuty>;
  deleteUserDuty: (id: string) => Promise<void>;
  getUserDuty: (id: string) => Promise<IUserDuty>;
  getUserDuties: (input: IGetUserDutyInput) => Promise<IUserDuty[]>;
}

// Initial State
export const INITIAL_STATE: IUserDutyStateContext = {
  isPending: false,
  isSuccess: false,
  isError: false,
  errorMessage: undefined,
  userDuty: null,
  userDuties: []
};

// Create contexts
export const UserDutyStateContext = createContext<IUserDutyStateContext>(INITIAL_STATE);
export const UserDutyActionContext = createContext<IUserDutyActionContext>({
  createUserDuty: () => Promise.resolve({} as IUserDuty),
  updateUserDuty: () => Promise.resolve({} as IUserDuty),
  deleteUserDuty: () => Promise.resolve(),
  getUserDuty: () => Promise.resolve({} as IUserDuty),
  getUserDuties: () => Promise.resolve([])
});