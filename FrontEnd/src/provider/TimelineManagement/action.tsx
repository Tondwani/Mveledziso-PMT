import { ITimeline, ITimelinePhase } from "./context";

export enum TimelineActionEnum {
  SET_PENDING = "SET_TIMELINE_PENDING",
  SET_SUCCESS = "SET_TIMELINE_SUCCESS",
  SET_ERROR = "SET_TIMELINE_ERROR",
  SET_TIMELINE = "SET_TIMELINE",
  SET_TIMELINES = "SET_TIMELINES",
  SET_TIMELINE_PHASE = "SET_TIMELINE_PHASE",
  SET_TIMELINE_PHASES = "SET_TIMELINE_PHASES",
  RESET_STATE = "RESET_TIMELINE_STATE"
}

// Base Actions
export const setPending = () => ({
  type: TimelineActionEnum.SET_PENDING,
  payload: { isPending: true, isSuccess: false, isError: false, errorMessage: undefined }
});

export const setSuccess = (message?: string) => ({
  type: TimelineActionEnum.SET_SUCCESS,
  payload: { isPending: false, isSuccess: true, isError: false, errorMessage: undefined, message }
});

export const setError = (errorMessage: string) => ({
  type: TimelineActionEnum.SET_ERROR,
  payload: { isPending: false, isSuccess: false, isError: true, errorMessage }
});

export const resetState = () => ({
  type: TimelineActionEnum.RESET_STATE
});

// Timeline Specific Actions
export const setTimeline = (timeline: ITimeline) => ({
  type: TimelineActionEnum.SET_TIMELINE,
  payload: { timeline, isPending: false, isSuccess: true, isError: false }
});

export const setTimelines = (timelines: ITimeline[]) => ({
  type: TimelineActionEnum.SET_TIMELINES,
  payload: { timelines, isPending: false, isSuccess: true, isError: false }
});

// Timeline Phase Specific Actions
export const setTimelinePhase = (timelinePhase: ITimelinePhase) => ({
  type: TimelineActionEnum.SET_TIMELINE_PHASE,
  payload: { timelinePhase, isPending: false, isSuccess: true, isError: false }
});

export const setTimelinePhases = (timelinePhases: ITimelinePhase[]) => ({
  type: TimelineActionEnum.SET_TIMELINE_PHASES,
  payload: { timelinePhases, isPending: false, isSuccess: true, isError: false }
});
