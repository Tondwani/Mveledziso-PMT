import { INotification } from "./context";

// Action Types
export enum NotificationActionEnum {
  SET_PENDING = "SET_PENDING",
  SET_ERROR = "SET_ERROR",
  SET_SUCCESS = "SET_SUCCESS",
  SET_NOTIFICATION = "SET_NOTIFICATION",
  SET_NOTIFICATIONS = "SET_NOTIFICATIONS",
  SET_TOTAL_COUNT = "SET_TOTAL_COUNT",
  SET_UNREAD_COUNT = "SET_UNREAD_COUNT",
  RESET_STATE = "RESET_STATE"
}

// Action Interfaces
export interface ISetPendingAction {
  type: typeof NotificationActionEnum.SET_PENDING;
  payload: {
    isPending: boolean;
    isSuccess: boolean;
  };
}

export interface ISetErrorAction {
  type: typeof NotificationActionEnum.SET_ERROR;
  payload: {
    isError: boolean;
    errorMessage: string;
    isPending: boolean;
    isSuccess: boolean;
  };
}

export interface ISetSuccessAction {
  type: typeof NotificationActionEnum.SET_SUCCESS;
  payload: {
    isSuccess: boolean;
    isPending: boolean;
    isError: boolean;
    errorMessage?: string;
  };
}

export interface ISetNotificationAction {
  type: typeof NotificationActionEnum.SET_NOTIFICATION;
  payload: {
    notification: INotification | null;
  };
}

export interface ISetNotificationsAction {
  type: typeof NotificationActionEnum.SET_NOTIFICATIONS;
  payload: {
    notifications: INotification[];
  };
}

export interface ISetTotalCountAction {
  type: typeof NotificationActionEnum.SET_TOTAL_COUNT;
  payload: {
    totalCount: number;
  };
}

export interface ISetUnreadCountAction {
  type: typeof NotificationActionEnum.SET_UNREAD_COUNT;
  payload: {
    unreadCount: number;
  };
}

// Union Action Types
export type NotificationActionTypes =
  | ISetPendingAction
  | ISetErrorAction
  | ISetSuccessAction
  | ISetNotificationAction
  | ISetNotificationsAction
  | ISetTotalCountAction
  | ISetUnreadCountAction;

// Action Creators
export const setPending = (isPending: boolean) => ({
  type: NotificationActionEnum.SET_PENDING,
  payload: {
    isPending,
    isSuccess: false
  }
});

export const setError = (errorMessage: string) => ({
  type: NotificationActionEnum.SET_ERROR,
  payload: {
    isError: true,
    errorMessage,
    isPending: false,
    isSuccess: false
  }
});

export const setSuccess = (isSuccess: boolean) => ({
  type: NotificationActionEnum.SET_SUCCESS,
  payload: {
    isSuccess,
    isPending: false,
    isError: false,
    errorMessage: undefined
  }
});

export const setNotification = (notification: INotification | null) => ({
  type: NotificationActionEnum.SET_NOTIFICATION,
  payload: {
    notification
  }
});

export const setNotifications = (notifications: INotification[]) => ({
  type: NotificationActionEnum.SET_NOTIFICATIONS,
  payload: {
    notifications
  }
});

export const setTotalCount = (totalCount: number) => ({
  type: NotificationActionEnum.SET_TOTAL_COUNT,
  payload: {
    totalCount
  }
});

export const setUnreadCount = (unreadCount: number) => ({
  type: NotificationActionEnum.SET_UNREAD_COUNT,
  payload: {
    unreadCount
  }
});

export const resetState = () => ({
  type: NotificationActionEnum.RESET_STATE
});
