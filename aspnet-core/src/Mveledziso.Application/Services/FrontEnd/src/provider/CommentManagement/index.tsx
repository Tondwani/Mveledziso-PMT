"use client";

import { useContext, useReducer } from "react";
import { getAxiosInstance } from "../../utils/axiosInstance";
import { 
  INITIAL_STATE, 
  CommentStateContext, 
  CommentActionContext,
  ICommentActionContext,
  IComment,
  ICreateCommentDto,
  IUpdateCommentDto,
  ICommentListInputDto
} from "./context";
import { CommentReducer } from "./reducer";
import { 
  setPending,
  setSuccess,
  setError,
  setComment,
  setComments,
  resetState
} from "./action";
import axios from 'axios';

const API_ENDPOINTS = {
  comments: "/api/services/app/Comment"
};

export const CommentProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(CommentReducer, INITIAL_STATE);
  const instance = getAxiosInstance();

  const getErrorMessage = (error: unknown): string => {
    if (axios.isAxiosError(error)) {
      return error.response?.data?.error?.message || error.message;
    }
    return 'An unexpected error occurred';
  };

  // Helper function to validate GUID format
  const isValidGuid = (value: unknown): boolean => {
    if (!value) return false;
    const guid = String(value).trim();
    const guidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return guidRegex.test(guid);
  };

  // Helper function to format value as GUID
  const formatGuid = (value: unknown): string => {
    if (!value) return '';
    return String(value).trim().toLowerCase();
  };

  /**
   * Creates a new comment
   * @param comment The comment data to create
   * @returns The created comment
   */
  const createComment = async (comment: ICreateCommentDto): Promise<IComment> => {
    dispatch(setPending());
    try {
      // Validate required fields
      if (!comment.content || !comment.entityType || !comment.entityId) {
        throw new Error('Content, EntityType, and EntityId are required');
      }

      // Format and validate GUID for entityId
      const formattedComment = {
        ...comment,
        entityId: formatGuid(comment.entityId)
      };

      // Validate GUID
      if (!isValidGuid(formattedComment.entityId)) {
        throw new Error('Invalid GUID format for entityId');
      }

      const response = await instance.post(`${API_ENDPOINTS.comments}/Create`, formattedComment);
      const createdComment = response.data.result;
      dispatch(setComment(createdComment));
      dispatch(setSuccess('Comment created successfully'));
      return createdComment;
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      dispatch(setError(errorMessage));
      throw error;
    }
  };

  /**
   * Updates an existing comment
   * @param id The comment ID to update
   * @param comment The updated comment data
   * @returns The updated comment
   */
  const updateComment = async (id: string, comment: IUpdateCommentDto): Promise<IComment> => {
    dispatch(setPending());
    try {
      // Format and validate GUID
      const formattedId = formatGuid(id);
      if (!isValidGuid(formattedId)) {
        throw new Error('Invalid GUID format for comment id');
      }

      // Validate required content
      if (!comment.content || comment.content.trim() === '') {
        throw new Error('Comment content is required');
      }

      const response = await instance.put(`${API_ENDPOINTS.comments}/Update`, {
        id: formattedId,
        content: comment.content
      });
      
      const updatedComment = response.data.result;
      dispatch(setComment(updatedComment));
      dispatch(setSuccess('Comment updated successfully'));
      return updatedComment;
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      dispatch(setError(errorMessage));
      throw error;
    }
  };

  /**
   * Deletes a comment by ID
   * @param id The comment ID to delete
   */
  const deleteComment = async (id: string): Promise<void> => {
    dispatch(setPending());
    try {
      // Format and validate GUID
      const formattedId = formatGuid(id);
      if (!isValidGuid(formattedId)) {
        throw new Error('Invalid GUID format for comment id');
      }

      await instance.delete(`${API_ENDPOINTS.comments}/Delete`, { 
        params: { id: formattedId } 
      });
      
      dispatch(setSuccess('Comment deleted successfully'));
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      dispatch(setError(errorMessage));
      throw error;
    }
  };

  /**
   * Retrieves a single comment by ID
   * @param id The comment ID to retrieve
   * @returns The comment
   */
  const getComment = async (id: string): Promise<IComment> => {
    dispatch(setPending());
    try {
      // Format and validate GUID
      const formattedId = formatGuid(id);
      if (!isValidGuid(formattedId)) {
        throw new Error('Invalid GUID format for comment id');
      }

      const response = await instance.get(`${API_ENDPOINTS.comments}/Get`, { 
        params: { id: formattedId } 
      });
      
      const comment = response.data.result;
      dispatch(setComment(comment));
      return comment;
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      dispatch(setError(errorMessage));
      throw error;
    }
  };

  /**
   * Retrieves a list of comments by entity type and ID
   * @param input The input parameters for filtering comments
   * @returns List of comments
   */
  const getComments = async (input: ICommentListInputDto): Promise<IComment[]> => {
    dispatch(setPending());
    try {
      // Validate required fields
      if (!input.entityType || !input.entityId) {
        throw new Error('EntityType and EntityId are required');
      }

      // Format and validate GUID
      const formattedInput = {
        ...input,
        entityId: formatGuid(input.entityId),
        skipCount: input.skipCount || 0,
        maxResultCount: input.maxResultCount || 10
      };

      // Validate GUID
      if (!isValidGuid(formattedInput.entityId)) {
        throw new Error('Invalid GUID format for entityId');
      }

      const response = await instance.get(`${API_ENDPOINTS.comments}/GetList`, { 
        params: formattedInput 
      });
      
      const comments = response.data.result.items;
      const totalCount = response.data.result.totalCount;
      dispatch(setComments(comments, totalCount));
      return comments;
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      dispatch(setError(errorMessage));
      throw error;
    }
  };

  /**
   * Resets the comment state
   */
  const resetCommentState = () => {
    dispatch(resetState());
  };

  const actionContextValue: ICommentActionContext = {
    createComment,
    updateComment,
    deleteComment,
    getComment,
    getComments,
    resetState: resetCommentState
  };

  return (
    <CommentStateContext.Provider value={state}>
      <CommentActionContext.Provider value={actionContextValue}>
        {children}
      </CommentActionContext.Provider>
    </CommentStateContext.Provider>
  );
};

/**
 * Hook to access comment state
 * @returns The comment state context
 */
export const useCommentState = () => {
  const context = useContext(CommentStateContext);
  if (!context) throw new Error('useCommentState must be used within a CommentProvider');
  return context;
};

/**
 * Hook to access comment actions
 * @returns The comment action context
 */
export const useCommentActions = () => {
  const context = useContext(CommentActionContext);
  if (!context) throw new Error('useCommentActions must be used within a CommentProvider');
  return context;
};