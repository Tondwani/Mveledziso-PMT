import { createContext } from "react";

// UserDuty Interface
export interface IUserDuty {
  id: string;
  teamMemberId: string;
  projectDutyId: string;
  creationTime: string;
}

// Input DTOs
export interface ICreateUserDutyDto {
  teamMemberId: string;
  projectDutyId: string;
}

export interface IUpdateUserDutyDto {
  id: string;
  teamMemberId?: string;
  projectDutyId?: string;
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
  userDuty?: IUserDuty;
  userDuties?: IUserDuty[];
  message?: string;
}

// Initial State
export const INITIAL_STATE: IUserDutyStateContext = {
  isPending: false,
  isSuccess: false,
  isError: false,
};

// Actions Interface
export interface IUserDutyActionContext {
  createUserDuty: (duty: ICreateUserDutyDto) => Promise<IUserDuty>;
  updateUserDuty: (duty: IUpdateUserDutyDto) => Promise<IUserDuty>;
  deleteUserDuty: (id: string) => Promise<void>;
  getUserDuty: (id: string) => Promise<IUserDuty>;
  getUserDuties: (input: IGetUserDutyInput) => Promise<IUserDuty[]>;
}

// Contexts
export const UserDutyStateContext = createContext<IUserDutyStateContext>(INITIAL_STATE);
export const UserDutyActionContext = createContext<IUserDutyActionContext | undefined>(undefined);