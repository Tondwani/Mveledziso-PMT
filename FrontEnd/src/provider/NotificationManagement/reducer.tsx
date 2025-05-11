import { handleActions } from "redux-actions";
import { INITIAL_STATE, INotificationStateContext, INotification } from "./context";
import { NotificationActionEnum } from "./action";

interface INotificationAction {
  type: NotificationActionEnum;
  payload?: {
    isPending?: boolean;
    isSuccess?: boolean;
    isError?: boolean;
    errorMessage?: string;
    notification?: INotification | null;
    notifications?: INotification[];
    totalCount?: number;
    unreadCount?: number;
  };
}

export const NotificationReducer = handleActions<INotificationStateContext, INotificationAction['payload']>(
  {
    [NotificationActionEnum.SET_PENDING]: (state, action) => ({
      ...state,
      ...action.payload
    }),
    [NotificationActionEnum.SET_ERROR]: (state, action) => ({
      ...state,
      ...action.payload
    }),
    [NotificationActionEnum.SET_SUCCESS]: (state, action) => ({
      ...state,
      ...action.payload
    }),
    [NotificationActionEnum.SET_NOTIFICATION]: (state, action) => ({
      ...state,
      ...action.payload
    }),
    [NotificationActionEnum.SET_NOTIFICATIONS]: (state, action) => ({
      ...state,
      ...action.payload
    }),
    [NotificationActionEnum.SET_TOTAL_COUNT]: (state, action) => ({
      ...state,
      ...action.payload
    }),
    [NotificationActionEnum.SET_UNREAD_COUNT]: (state, action) => ({
      ...state,
      ...action.payload
    }),
    [NotificationActionEnum.RESET_STATE]: () => ({
      ...INITIAL_STATE
    })
  },
  INITIAL_STATE
);
