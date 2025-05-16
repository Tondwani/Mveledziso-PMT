import { IMilestone, PagedResultDto } from "./context";

export enum MilestoneActionEnum {
  milestonePending = "MILESTONE_PENDING",
  milestoneSuccess = "MILESTONE_SUCCESS",
  milestoneError = "MILESTONE_ERROR",
  milestonesLoaded = "MILESTONES_LOADED",
}

export const basePending = () => ({
  type: MilestoneActionEnum.milestonePending,
  payload: {
    isPending: true,
    isSuccess: false,
    isError: false,
  }
});

const baseSuccess = (message: string) => ({
  type: MilestoneActionEnum.milestoneSuccess,
  payload: {
    isPending: false,
    isSuccess: true,
    isError: false,
    message
  }
});

export const baseError = (message: string) => ({
  type: MilestoneActionEnum.milestoneError,
  payload: {
    isPending: false,
    isSuccess: false,
    isError: true,
    message
  }
});

// Milestone Actions
export const milestonePending = () => basePending();

export const milestoneError = (message: string) => baseError(message);

export const createMilestoneSuccess = (milestone: IMilestone, message: string) => ({
  type: MilestoneActionEnum.milestoneSuccess,
  payload: {
    ...baseSuccess(message).payload,
    milestone,
    milestones: [milestone]
  }
});

export const updateMilestoneSuccess = (milestone: IMilestone, message: string) => ({
  type: MilestoneActionEnum.milestoneSuccess,
  payload: {
    ...baseSuccess(message).payload,
    milestone
  }
});

export const loadMilestonesSuccess = (result: PagedResultDto<IMilestone>) => {
  console.error('Creating loadMilestonesSuccess action with result:', result);
  return {
    type: MilestoneActionEnum.milestonesLoaded,
    payload: {
      isPending: false,
      isSuccess: true,
      isError: false,
      milestones: result.items || [],
      totalCount: result.totalCount || 0,
      message: "Milestones loaded successfully"
    }
  };
};
