import { handleActions } from "redux-actions";
import { INITIAL_STATE, IActivityLogStateContext, IActivityLog } from "./context";
import { ActivityLogActionEnum } from "./action";

interface IActivityLogAction {
  type: ActivityLogActionEnum;
  payload?: {
    isPending?: boolean;
    isSuccess?: boolean;
    isError?: boolean;
    errorMessage?: string;
    message?: string;
    activityLog?: IActivityLog | null;
    activityLogs?: IActivityLog[];
  };
}

export const ActivityLogReducer = handleActions<IActivityLogStateContext, IActivityLogAction['payload']>(
  {
    [ActivityLogActionEnum.SET_PENDING]: (state, action) => ({
      ...state,
      ...action.payload
    }),
    [ActivityLogActionEnum.SET_SUCCESS]: (state, action) => ({
      ...state,
      ...action.payload
    }),
    [ActivityLogActionEnum.SET_ERROR]: (state, action) => ({
      ...state,
      ...action.payload
    }),
    [ActivityLogActionEnum.SET_ACTIVITY_LOG]: (state, action) => ({
      ...state,
      ...action.payload
    }),
    [ActivityLogActionEnum.SET_ACTIVITY_LOGS]: (state, action) => ({
      ...state,
      ...action.payload
    }),
    [ActivityLogActionEnum.RESET_STATE]: () => ({
      ...INITIAL_STATE
    })
  },
  INITIAL_STATE
);
