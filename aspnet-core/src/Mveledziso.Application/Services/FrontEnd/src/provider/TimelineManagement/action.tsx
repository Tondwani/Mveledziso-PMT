import { ITimeline, ITimelinePhase } from "./context";

export enum ActionType {
  SET_PENDING = 'SET_PENDING',
  SET_SUCCESS = 'SET_SUCCESS',
  SET_ERROR = 'SET_ERROR',
  SET_TIMELINE = 'SET_TIMELINE',
  SET_TIMELINES = 'SET_TIMELINES',
  SET_TIMELINE_PHASE = 'SET_TIMELINE_PHASE',
  SET_TIMELINE_PHASES = 'SET_TIMELINE_PHASES',
  CLEAR_STATE = 'CLEAR_STATE'
}

export interface Action {
  type: ActionType;
  payload?: string | ITimeline | ITimelinePhase | ITimelinePhase[] | { items: ITimeline[], totalCount: number };
}

// General state actions
export const setPending = (): Action => ({
  type: ActionType.SET_PENDING
});

export const setSuccess = (message?: string): Action => ({
  type: ActionType.SET_SUCCESS,
  payload: message
});

export const setError = (message: string): Action => ({
  type: ActionType.SET_ERROR,
  payload: message
});

export const clearState = (): Action => ({
  type: ActionType.CLEAR_STATE
});

// Timeline specific actions
export const setTimeline = (timeline: ITimeline): Action => ({
  type: ActionType.SET_TIMELINE,
  payload: timeline
});

export const setTimelines = (timelines: ITimeline[], totalCount: number = 0): Action => ({
  type: ActionType.SET_TIMELINES,
  payload: { items: timelines, totalCount }
});

// Timeline Phase specific actions
export const setTimelinePhase = (phase: ITimelinePhase): Action => ({
  type: ActionType.SET_TIMELINE_PHASE,
  payload: phase
});

export const setTimelinePhases = (phases: ITimelinePhase[]): Action => ({
  type: ActionType.SET_TIMELINE_PHASES,
  payload: phases
});
