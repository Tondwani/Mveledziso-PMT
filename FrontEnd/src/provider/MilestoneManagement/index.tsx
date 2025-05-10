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
      const response = await instance.post(`${API_ENDPOINTS.milestones}/Create`, milestone);
      const createdMilestone: IMilestone = response.data.result;
      dispatch(createMilestoneSuccess(createdMilestone, "Milestone created successfully"));
      return createdMilestone;
    } catch (error) {
      const axiosError = error as AxiosError;
      const errorData = axiosError.response?.data as ErrorResponse;
      dispatch(baseError(errorData?.error?.message || "Failed to create milestone"));
      throw error;
    }
  };

  const updateMilestone = async (milestone: IUpdateMilestoneDto) => {
    dispatch(basePending());
    try {
      const response = await instance.put(`${API_ENDPOINTS.milestones}/Update`, milestone);
      const updatedMilestone: IMilestone = response.data.result;
      dispatch(updateMilestoneSuccess(updatedMilestone, "Milestone updated successfully"));
      return updatedMilestone;
    } catch (error) {
      const axiosError = error as AxiosError;
      const errorData = axiosError.response?.data as ErrorResponse;
      dispatch(baseError(errorData?.error?.message || "Failed to update milestone"));
      throw error;
    }
  };

  const deleteMilestone = async (id: string) => {
    dispatch(basePending());
    try {
      await instance.delete(`${API_ENDPOINTS.milestones}/Delete`, { params: { id } });
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
      const axiosError = error as AxiosError;
      const errorData = axiosError.response?.data as ErrorResponse;
      dispatch(baseError(errorData?.error?.message || "Failed to delete milestone"));
      throw error;
    }
  };

  const getMilestone = async (id: string) => {
    dispatch(basePending());
    try {
      const response = await instance.get(`${API_ENDPOINTS.milestones}/Get`, { params: { id } });
      const milestone: IMilestone = response.data.result;
      dispatch(createMilestoneSuccess(milestone, "Milestone loaded successfully"));
      return milestone;
    } catch (error) {
      const axiosError = error as AxiosError;
      const errorData = axiosError.response?.data as ErrorResponse;
      dispatch(baseError(errorData?.error?.message || "Failed to get milestone"));
      throw error;
    }
  };

  const getMilestones = async (input: IGetMilestonesInput) => {
    dispatch(basePending());
    try {
      const response = await instance.get(`${API_ENDPOINTS.milestones}/GetList`, { params: input });
      const result: PagedResultDto<IMilestone> = response.data.result;
      dispatch(loadMilestonesSuccess(result));
      return result;
    } catch (error) {
      const axiosError = error as AxiosError;
      const errorData = axiosError.response?.data as ErrorResponse;
      dispatch(baseError(errorData?.error?.message || "Failed to get milestones"));
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
