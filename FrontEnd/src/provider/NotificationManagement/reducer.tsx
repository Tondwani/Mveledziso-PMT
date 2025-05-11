"use client";

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
      isPending: action.payload?.isPending || false,
      isSuccess: action.payload?.isSuccess || false
    }),
    [NotificationActionEnum.SET_ERROR]: (state, action) => ({
      ...state,
      isError: action.payload?.isError || false,
      errorMessage: action.payload?.errorMessage,
      isPending: action.payload?.isPending || false,
      isSuccess: action.payload?.isSuccess || false
    }),
    [NotificationActionEnum.SET_SUCCESS]: (state, action) => ({
      ...state,
      isSuccess: action.payload?.isSuccess || false,
      isPending: action.payload?.isPending || false,
      isError: action.payload?.isError || false,
      errorMessage: action.payload?.errorMessage
    }),
    [NotificationActionEnum.SET_NOTIFICATION]: (state, action) => ({
      ...state,
      notification: action.payload?.notification || null
    }),
    [NotificationActionEnum.SET_NOTIFICATIONS]: (state, action) => {
      if (!action.payload?.notifications) {
        return state;
      }
      return {
        ...state,
        notifications: action.payload.notifications
      };
    },
    [NotificationActionEnum.SET_TOTAL_COUNT]: (state, action) => ({
      ...state,
      totalCount: action.payload?.totalCount || 0
    }),
    [NotificationActionEnum.SET_UNREAD_COUNT]: (state, action) => ({
      ...state,
      unreadCount: action.payload?.unreadCount || 0
    }),
    [NotificationActionEnum.RESET_STATE]: () => ({
      ...INITIAL_STATE
    })
  },
  INITIAL_STATE
);
