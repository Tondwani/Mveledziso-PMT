import { createContext } from "react";

// Comment Interface
export interface IComment {
  id: string;
  content: string;
  userId: number;
  userName: string;
  userType: string;
  entityType: string;
  entityId: string;
  creationTime: string;
}

// Input DTOs
export interface ICreateCommentDto {
  content: string;
  entityType: string;
  entityId: string;
}

export interface IUpdateCommentDto {
  content: string;
}

export interface ICommentListInputDto {
  entityType: string;
  entityId: string;
  skipCount?: number;
  maxResultCount?: number;
}

// State Interface
export interface ICommentStateContext {
  isPending: boolean;
  isSuccess: boolean;
  isError: boolean;
  errorMessage: string | undefined;
  successMessage: string | undefined;
  comment: IComment | null;
  comments: IComment[];
  totalCount: number;
}

// Actions Interface
export interface ICommentActionContext {
  createComment: (comment: ICreateCommentDto) => Promise<IComment>;
  updateComment: (id: string, comment: IUpdateCommentDto) => Promise<IComment>;
  deleteComment: (id: string) => Promise<void>;
  getComment: (id: string) => Promise<IComment>;
  getComments: (input: ICommentListInputDto) => Promise<IComment[]>;
  resetState: () => void;
}

// Initial State
export const INITIAL_STATE: ICommentStateContext = {
  isPending: false,
  isSuccess: false,
  isError: false,
  errorMessage: undefined,
  successMessage: undefined,
  comment: null,
  comments: [],
  totalCount: 0
};

// Create contexts
export const CommentStateContext = createContext<ICommentStateContext>(INITIAL_STATE);
export const CommentActionContext = createContext<ICommentActionContext>({
  createComment: () => Promise.resolve({} as IComment),
  updateComment: () => Promise.resolve({} as IComment),
  deleteComment: () => Promise.resolve(),
  getComment: () => Promise.resolve({} as IComment),
  getComments: () => Promise.resolve([]),
  resetState: () => {}
});