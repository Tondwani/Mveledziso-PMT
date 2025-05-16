"use client";

import { useContext, useReducer } from "react";
import { getAxiosInstance } from "../../utils/axiosInstance";
import {
  INITIAL_STATE,
  MilestoneStateContext,
  MilestoneActionContext,
  IMilestoneActionContext,
  IMilestone,
  ICreateMilestoneDto,
  IUpdateMilestoneDto,
  IGetMilestonesInput,
  PagedResultDto
} from "./context";
import { MilestoneReducer } from "./reducer";
import {
  basePending,
  baseError,
  createMilestoneSuccess,
  updateMilestoneSuccess,
  loadMilestonesSuccess,
} from "./action";
import { AxiosError } from "axios";
import axios from "axios";

const API_ENDPOINTS = {
  milestones: "/api/services/app/Milestone"
};

interface ErrorResponse {
  error?: {
    message?: string;
  };
}

export const MilestoneProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(MilestoneReducer, INITIAL_STATE);
  const instance = getAxiosInstance();

  const createMilestone = async (milestone: ICreateMilestoneDto) => {
    dispatch(basePending());
    try {
      console.error('Creating milestone:', milestone);
      const response = await instance.post(`${API_ENDPOINTS.milestones}/Create`, milestone);
      console.error('Create response:', response.data);
      const createdMilestone: IMilestone = response.data.result;
      dispatch(createMilestoneSuccess(createdMilestone, "Milestone created successfully"));
      return createdMilestone;
    } catch (error) {
      console.error('Create error:', error);
      const axiosError = error as AxiosError;
      const errorData = axiosError.response?.data as ErrorResponse;
      dispatch(baseError(errorData?.error?.message || "Failed to create milestone"));
      throw error;
    }
  };

  const updateMilestone = async (milestone: IUpdateMilestoneDto) => {
    dispatch(basePending());
    try {
      console.error('Updating milestone:', milestone);
      const response = await instance.put(`${API_ENDPOINTS.milestones}/Update?id=${milestone.id}`, milestone);
      console.error('Update response:', response.data);
      const updatedMilestone: IMilestone = response.data.result;
      dispatch(updateMilestoneSuccess(updatedMilestone, "Milestone updated successfully"));
      return updatedMilestone;
    } catch (error) {
      console.error('Update error:', error);
      const axiosError = error as AxiosError;
      const errorData = axiosError.response?.data as ErrorResponse;
      dispatch(baseError(errorData?.error?.message || "Failed to update milestone"));
      throw error;
    }
  };

  const deleteMilestone = async (id: string) => {
    dispatch(basePending());
    try {
      console.error('Deleting milestone:', id);
      await instance.delete(`${API_ENDPOINTS.milestones}/Delete?id=${id}`);
      console.error('Delete successful');
      dispatch({
        type: "MILESTONE_SUCCESS",
        payload: {
          isPending: false,
          isSuccess: true,
          isError: false,
          message: "Milestone deleted successfully"
        }
      });
    } catch (error) {
      console.error('Delete error:', error);
      const axiosError = error as AxiosError;
      const errorData = axiosError.response?.data as ErrorResponse;
      dispatch(baseError(errorData?.error?.message || "Failed to delete milestone"));
      throw error;
    }
  };

  const getMilestone = async (id: string) => {
    dispatch(basePending());
    try {
      console.error('Getting milestone:', id);
      const response = await instance.get(`${API_ENDPOINTS.milestones}/Get?id=${id}`);
      console.error('Get response:', response.data);
      const milestone: IMilestone = response.data.result;
      dispatch(createMilestoneSuccess(milestone, "Milestone loaded successfully"));
      return milestone;
    } catch (error) {
      console.error('Get error:', error);
      const axiosError = error as AxiosError;
      const errorData = axiosError.response?.data as ErrorResponse;
      dispatch(baseError(errorData?.error?.message || "Failed to get milestone"));
      throw error;
    }
  };

  const getMilestones = async (input: IGetMilestonesInput) => {
    dispatch(basePending());
    try {
      console.error('Starting getMilestones API call with input:', input);
      console.error('API URL:', `${API_ENDPOINTS.milestones}/GetList`);
      
      // Log the auth token (masked)
      const authToken = instance.defaults.headers.common[""];
      console.error('Auth token present:', !!authToken);
      
      const response = await instance.get(`${API_ENDPOINTS.milestones}/GetList`, {
        params: {
          TimelineId: input.timelineId || undefined,
          IsCompleted: input.isCompleted,
          SkipCount: input.skipCount || 0,
          MaxResultCount: input.maxResultCount || 10
        }
      });
      
      console.error('GetList API Response:', {
        status: response.status,
        statusText: response.statusText,
        data: response.data
      });

      if (!response.data || !response.data.result) {
        console.warn('Invalid response format:', response.data);
        dispatch(loadMilestonesSuccess({ items: [], totalCount: 0 }));
        return { items: [], totalCount: 0 };
      }

      const result: PagedResultDto<IMilestone> = {
        items: response.data.result,
        totalCount: response.data.result.length
      };

      console.error('Parsed milestones result:', result);
      
      dispatch(loadMilestonesSuccess(result));
      return result;
    } catch (error) {
      console.error('Error in getMilestones:', error);
      if (axios.isAxiosError(error)) {
        console.error('Axios error details:', {
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
          config: {
            url: error.config?.url,
            method: error.config?.method,
            params: error.config?.params
          }
        });
      }
      const axiosError = error as AxiosError;
      const errorData = axiosError.response?.data as ErrorResponse;
      const errorMessage = errorData?.error?.message || "Failed to get milestones";
      console.error('Error message:', errorMessage);
      dispatch(baseError(errorMessage));
      throw error;
    }
  };

  const actionContextValue: IMilestoneActionContext = {
    createMilestone,
    updateMilestone,
    deleteMilestone,
    getMilestone,
    getMilestones,
  };

  return (
    <MilestoneStateContext.Provider value={state}>
      <MilestoneActionContext.Provider value={actionContextValue}>
        {children}
      </MilestoneActionContext.Provider>
    </MilestoneStateContext.Provider>
  );
};

export const useMilestoneState = () => {
  const context = useContext(MilestoneStateContext);
  if (context === undefined) {
    throw new Error("useMilestoneState must be used within a MilestoneProvider");
  }
  return context;
};

export const useMilestoneActions = () => {
  const context = useContext(MilestoneActionContext);
  if (context === undefined) {
    throw new Error("useMilestoneActions must be used within a MilestoneProvider");
  }
  return context;
};
