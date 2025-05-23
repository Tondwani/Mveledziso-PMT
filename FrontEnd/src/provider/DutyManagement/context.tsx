import { createContext } from "react";

export interface IUserDuty {
  id: string;
  teamMemberId: string;
  projectDutyId: string;
  creationTime: string;
  creatorUserId?: number;
}


export interface ICreateUserDutyDto {
  teamMemberId: string; 
  projectDutyId: string; 
}

export interface IUpdateUserDutyDto {
  id: string;
  teamMemberId: string; 
  projectDutyId: string; 
}

export interface IGetUserDutyInput {
  teamMemberId?: string; 
  projectDutyId?: string; 
  fromDate?: Date;
  toDate?: Date;
  skipCount?: number;    
  maxResultCount?: number; 
}

export interface IUserDutyStateContext {
  isPending: boolean;
  isSuccess: boolean;
  isError: boolean;
  errorMessage: string | undefined;
  userDuty: IUserDuty | null;
  userDuties: IUserDuty[];
  totalCount: number;
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
  userDuties: [],
  totalCount: 0
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