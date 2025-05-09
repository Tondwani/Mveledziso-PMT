import { handleActions } from "redux-actions";
import { INITIAL_STATE, ITimelineStateContext, ITimeline, ITimelinePhase } from "./context";
import { TimelineActionEnum } from "./action";

interface ITimelineAction {
  type: TimelineActionEnum;
  payload?: {
    isPending?: boolean;
    isSuccess?: boolean;
    isError?: boolean;
    errorMessage?: string;
    timeline?: ITimeline | null;
    timelines?: ITimeline[];
    timelinePhase?: ITimelinePhase | null;
    timelinePhases?: ITimelinePhase[];
  };
}

export const TimelineReducer = handleActions<ITimelineStateContext, ITimelineAction['payload']>(
  {
    [TimelineActionEnum.SET_PENDING]: (state, action) => ({
      ...state,
      ...action.payload
    }),
    [TimelineActionEnum.SET_SUCCESS]: (state, action) => ({
      ...state,
      ...action.payload
    }),
    [TimelineActionEnum.SET_ERROR]: (state, action) => ({
      ...state,
      ...action.payload
    }),
    [TimelineActionEnum.SET_TIMELINE]: (state, action) => ({
      ...state,
      ...action.payload
    }),
    [TimelineActionEnum.SET_TIMELINES]: (state, action) => ({
      ...state,
      ...action.payload
    }),
    [TimelineActionEnum.SET_TIMELINE_PHASE]: (state, action) => ({
      ...state,
      ...action.payload
    }),
    [TimelineActionEnum.SET_TIMELINE_PHASES]: (state, action) => ({
      ...state,
      ...action.payload
    }),
    [TimelineActionEnum.RESET_STATE]: () => ({
      ...INITIAL_STATE
    })
  },
  INITIAL_STATE
);
