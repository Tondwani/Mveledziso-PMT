export enum CommentActionEnum {
  SET_PENDING = "SET_COMMENT_PENDING",
  SET_SUCCESS = "SET_COMMENT_SUCCESS",
  SET_ERROR = "SET_COMMENT_ERROR",
  SET_COMMENT = "SET_COMMENT",
  SET_COMMENTS = "SET_COMMENTS",
  RESET_STATE = "RESET_COMMENT_STATE"
}

import { IComment } from "./context";

// Base Actions
export const setPending = () => ({
  type: CommentActionEnum.SET_PENDING,
  payload: { isPending: true, isSuccess: false, isError: false, errorMessage: undefined }
});

export const setSuccess = (successMessage?: string) => ({
  type: CommentActionEnum.SET_SUCCESS,
  payload: { 
    isPending: false, 
    isSuccess: true, 
    isError: false, 
    errorMessage: undefined,
    successMessage 
  }
});

export const setError = (errorMessage: string) => ({
  type: CommentActionEnum.SET_ERROR,
  payload: { 
    isPending: false, 
    isSuccess: false, 
    isError: true, 
    errorMessage,
    successMessage: undefined
  }
});

export const resetState = () => ({
  type: CommentActionEnum.RESET_STATE
});

// Specific Actions
export const setComment = (comment: IComment) => ({
  type: CommentActionEnum.SET_COMMENT,
  payload: { 
    comment, 
    isPending: false, 
    isSuccess: true, 
    isError: false,
    successMessage: undefined
  }
});

export const setComments = (comments: IComment[], totalCount: number = 0) => ({
  type: CommentActionEnum.SET_COMMENTS,
  payload: { 
    comments, 
    totalCount, 
    isPending: false, 
    isSuccess: true, 
    isError: false,
    successMessage: undefined
  }
});