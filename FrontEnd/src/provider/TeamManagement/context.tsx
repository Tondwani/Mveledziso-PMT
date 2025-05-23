import { createContext } from "react";
import { IProjectManager } from "../CurrentUserProvider/context";


export interface ITeam {
  id: string;
  name: string;
  description?: string;
  projectCount?: number;
  projects?: IProjectManager[]; 
}


export interface IUserTeam {
  id: string;
  teamMemberId: string;
  teamId: string;
  role: string;
}

export interface ITeamMember {
  id: string;
  userId: string;
}


export interface ICreateTeamDto {
  name: string;
  description?: string;
}

export interface IUpdateTeamDto {
  id: string;
  name: string;
  description?: string;
}

export interface IGetTeamsInput {
  filter?: string;
}

export interface ICreateUserTeamDto {
  teamMemberId: string;
  teamId: string;
  role: string;
}

export interface IUpdateUserTeamDto {
  role: string;
}

export interface IUserTeamListDto {
  teamId?: string;
  teamMemberId?: string;
  sorting?: string;
  skipCount?: number;
  maxResultCount?: number;
}

export interface ITeamStateContext {
  isPending: boolean;
  isSuccess: boolean;
  isError: boolean;
  team?: ITeam;
  teams?: ITeam[];
  userTeam?: IUserTeam;
  userTeams?: IUserTeam[];
  message?: string;
  errorMessage?: string;
}

export const INITIAL_STATE: ITeamStateContext = {
  isPending: false,
  isSuccess: false,
  isError: false,
  errorMessage: undefined
};

export interface ITeamActionContext {
  createTeam: (team: ICreateTeamDto) => Promise<ITeam>;
  updateTeam: (team: IUpdateTeamDto) => Promise<ITeam>;
  getTeam: (id: string) => Promise<ITeam>;
  getTeams: (input: IGetTeamsInput) => Promise<ITeam[]>;
  createUserTeam: (input: ICreateUserTeamDto) => Promise<IUserTeam>;
  updateUserTeam: (id: string, input: IUpdateUserTeamDto) => Promise<IUserTeam>;
  deleteUserTeam: (id: string) => Promise<void>;
  getUserTeam: (id: string) => Promise<IUserTeam>;
  getUserTeams: (input: IUserTeamListDto) => Promise<PagedResultDto<IUserTeam>>;
}


export const TeamStateContext = createContext<ITeamStateContext>(INITIAL_STATE);
export const TeamActionContext = createContext<ITeamActionContext | undefined>(undefined);


export interface PagedResultDto<T> {
  totalCount: number;
  items: T[];
}