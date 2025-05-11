import { createContext } from "react";
import { TeamRole } from "../../enums/TeamRole";

// TeamMember Interfaces
export interface ITeamMember {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  userId: number;
  role: TeamRole;
  teams?: string[];
}

// Team Role Management Interfaces
export interface IUserTeam {
  id: string;
  teamMemberId: string;
  teamId: string;
  role: TeamRole;
}

export interface IAssignTeamRoleDto {
  teamMemberId: string;  // Will contain the userId as a string
  teamId: string;        // Will contain the team's GUID
  role: TeamRole;        // Enum value
}

export interface IUpdateTeamRoleDto {
  role: TeamRole;
}

// Input DTOs
export interface ICreateTeamMemberDto {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  userName?: string;
  role?: TeamRole;
}

export interface IUpdateTeamMemberDto {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role?: TeamRole;
}

export interface IGetTeamMembersInput {
  filter?: string;
  role?: TeamRole;
  teamId?: string;
  skipCount?: number;
  maxResultCount?: number;
}

// State Interface
export interface ITeamMemberStateContext {
  isPending: boolean;
  isSuccess: boolean;
  isError: boolean;
  errorMessage: string | undefined;
  teamMember: ITeamMember | null;
  teamMembers: ITeamMember[];
  totalCount: number;
  userTeams: IUserTeam[];
}

// Initial State
export const INITIAL_STATE: ITeamMemberStateContext = {
  isPending: false,
  isSuccess: false,
  isError: false,
  errorMessage: undefined,
  teamMember: null,
  teamMembers: [],
  totalCount: 0,
  userTeams: []
};

// Actions Interface
export interface ITeamMemberActionContext {
  createTeamMember: (teamMember: ICreateTeamMemberDto) => Promise<ITeamMember>;
  updateTeamMember: (id: string, teamMember: IUpdateTeamMemberDto) => Promise<ITeamMember>;
  deleteTeamMember: (id: string) => Promise<void>;
  getTeamMember: (id: string) => Promise<ITeamMember>;
  getTeamMembers: (input: IGetTeamMembersInput) => Promise<{ items: ITeamMember[], totalCount: number }>;
  getTeamMembersByTeam: (teamId: string) => Promise<ITeamMember[]>;
  // New team role management actions
  assignTeamRole: (input: IAssignTeamRoleDto) => Promise<IUserTeam>;
  updateTeamRole: (userTeamId: string, input: IUpdateTeamRoleDto) => Promise<IUserTeam>;
  removeFromTeam: (userTeamId: string) => Promise<void>;
  getUserTeams: (teamMemberId: string) => Promise<IUserTeam[]>;
}

// Create contexts
export const TeamMemberStateContext = createContext<ITeamMemberStateContext>(INITIAL_STATE);
export const TeamMemberActionContext = createContext<ITeamMemberActionContext>({
  createTeamMember: () => Promise.resolve({} as ITeamMember),
  updateTeamMember: () => Promise.resolve({} as ITeamMember),
  deleteTeamMember: () => Promise.resolve(),
  getTeamMember: () => Promise.resolve({} as ITeamMember),
  getTeamMembers: () => Promise.resolve({ items: [], totalCount: 0 }),
  getTeamMembersByTeam: () => Promise.resolve([]),
  assignTeamRole: () => Promise.resolve({} as IUserTeam),
  updateTeamRole: () => Promise.resolve({} as IUserTeam),
  removeFromTeam: () => Promise.resolve(),
  getUserTeams: () => Promise.resolve([])
});
