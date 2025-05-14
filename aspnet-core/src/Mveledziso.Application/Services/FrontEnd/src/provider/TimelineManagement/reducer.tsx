import { ITimelineStateContext, INITIAL_STATE } from './context';
import { Action, ActionType } from './action';

export const TimelineReducer = (
  state: ITimelineStateContext = INITIAL_STATE,
  action: Action
): ITimelineStateContext => {
  switch (action.type) {
    case ActionType.SET_PENDING:
      return {
        ...state,
        isPending: true,
        isSuccess: false,
        isError: false,
        errorMessage: undefined
      };

    case ActionType.SET_SUCCESS:
      return {
        ...state,
        isPending: false,
        isSuccess: true,
        isError: false,
        errorMessage: undefined
      };

    case ActionType.SET_ERROR:
      return {
        ...state,
        isPending: false,
        isSuccess: false,
        isError: true,
        errorMessage: action.payload
      };

    case ActionType.SET_TIMELINE:
      return {
        ...state,
        isPending: false,
        isSuccess: true,
        isError: false,
        timeline: action.payload
      };

    case ActionType.SET_TIMELINES:
      return {
        ...state,
        isPending: false,
        isSuccess: true,
        isError: false,
        timelines: action.payload.items,
        totalCount: action.payload.totalCount
      };

    case ActionType.SET_TIMELINE_PHASE:
      return {
        ...state,
        isPending: false,
        isSuccess: true,
        isError: false,
        timelinePhase: action.payload
      };

    case ActionType.SET_TIMELINE_PHASES:
      return {
        ...state,
        isPending: false,
        isSuccess: true,
        isError: false,
        timelinePhases: action.payload
      };

    case ActionType.CLEAR_STATE:
      return INITIAL_STATE;

    default:
      return state;
  }
};
