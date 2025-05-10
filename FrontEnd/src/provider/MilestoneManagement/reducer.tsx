/* eslint-disable @typescript-eslint/no-explicit-any */
import { handleActions } from "redux-actions";
import { INITIAL_STATE, IMilestoneStateContext } from "./context";
import { MilestoneActionEnum } from "./action";

export const MilestoneReducer = handleActions<IMilestoneStateContext, any>(
  {
    [MilestoneActionEnum.milestonePending]: (state, action) => ({
      ...state,
      ...action.payload,
    }),
    [MilestoneActionEnum.milestoneSuccess]: (state, action) => ({
      ...state,
      ...action.payload,
    }),
    [MilestoneActionEnum.milestoneError]: (state, action) => ({
      ...state,
      ...action.payload,
    }),
    [MilestoneActionEnum.milestonesLoaded]: (state, action) => ({
      ...state,
      ...action.payload,
      milestones: action.payload.milestones,
    }),
  },
  INITIAL_STATE
);
