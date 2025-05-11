import React, { useReducer, useContext, useCallback, useEffect } from "react";
import {
  NotificationStateContext,
  NotificationActionContext,
  INotificationActionContext,
  INotification,
  ICreateNotificationDto,
  IUpdateNotificationDto,
  IGetNotificationInput,
  INITIAL_STATE,
} from "./context";
import { NotificationReducer } from "./reducer";
import {
  setPending,
  setError,
  setSuccess,
  setNotification,
  setNotifications,
  setTotalCount,
  setUnreadCount,
} from "./action";
import { getAxiosInstance } from "../../utils/axiosInstance";
import { AxiosError } from "axios";

export type {
  INotification,
  ICreateNotificationDto,
  IUpdateNotificationDto,
  IGetNotificationInput
};

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(NotificationReducer, INITIAL_STATE);
  const api = getAxiosInstance();

  // Fetch unread count periodically
  useEffect(() => {
    const fetchUnreadCount = async () => {
      try {
        const response = await api.get("/api/services/app/Notification/GetUnreadCount");
        dispatch(setUnreadCount(response.data.result));
      } catch (error) {
        console.error("Failed to fetch unread count:", error);
      }
    };

    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, [api]);

  const createNotification = useCallback(
    async (notification: ICreateNotificationDto): Promise<INotification> => {
      try {
        dispatch(setPending(true));
        const response = await api.post("/api/services/app/Notification/Create", notification);
        const result = response.data.result;
        dispatch(setNotification(result));
        dispatch(setSuccess(true));
        return result;
      } catch (error) {
        const axiosError = error as AxiosError;
        dispatch(setError(axiosError.message || "Failed to create notification"));
        throw error;
      }
    },
    [api]
  );

  const updateNotification = useCallback(
    async (id: string, notification: IUpdateNotificationDto): Promise<INotification> => {
      try {
        dispatch(setPending(true));
        const response = await api.put(`/api/services/app/Notification/Update?id=${id}`, notification);
        const result = response.data.result;
        dispatch(setNotification(result));
        dispatch(setSuccess(true));
        return result;
      } catch (error) {
        const axiosError = error as AxiosError;
        dispatch(setError(axiosError.message || "Failed to update notification"));
        throw error;
      }
    },
    [api]
  );

  const deleteNotification = useCallback(
    async (id: string): Promise<void> => {
      try {
        dispatch(setPending(true));
        await api.delete(`/api/services/app/Notification/Delete?id=${id}`);
        dispatch(setNotification(null));
        dispatch(setSuccess(true));
      } catch (error) {
        const axiosError = error as AxiosError;
        dispatch(setError(axiosError.message || "Failed to delete notification"));
        throw error;
      }
    },
    [api]
  );

  const getNotification = useCallback(
    async (id: string): Promise<INotification> => {
      try {
        dispatch(setPending(true));
        const response = await api.get(`/api/services/app/Notification/Get?id=${id}`);
        const result = response.data.result;
        dispatch(setNotification(result));
        dispatch(setSuccess(true));
        return result;
      } catch (error) {
        const axiosError = error as AxiosError;
        dispatch(setError(axiosError.message || "Failed to fetch notification"));
        throw error;
      }
    },
    [api]
  );

  const getNotifications = useCallback(
    async (input: IGetNotificationInput): Promise<{ items: INotification[]; totalCount: number }> => {
      try {
        dispatch(setPending(true));
        const response = await api.get("/api/services/app/Notification/GetList", {
          params: input,
        });
        const result = response.data.result;
        dispatch(setNotifications(result.items));
        dispatch(setTotalCount(result.totalCount));
        dispatch(setSuccess(true));
        return result;
      } catch (error) {
        const axiosError = error as AxiosError;
        dispatch(setError(axiosError.message || "Failed to fetch notifications"));
        throw error;
      }
    },
    [api]
  );

  const markAsRead = useCallback(
    async (id: string): Promise<INotification> => {
      try {
        dispatch(setPending(true));
        const response = await api.put(`/api/services/app/Notification/Update?id=${id}`, {
          isRead: true,
        });
        const result = response.data.result;
        dispatch(setNotification(result));
        dispatch(setSuccess(true));
        return result;
      } catch (error) {
        const axiosError = error as AxiosError;
        dispatch(setError(axiosError.message || "Failed to mark notification as read"));
        throw error;
      }
    },
    [api]
  );

  const markAllAsRead = useCallback(
    async (): Promise<void> => {
      try {
        dispatch(setPending(true));
        await api.post("/api/services/app/Notification/MarkAllAsRead");
        dispatch(setUnreadCount(0));
        dispatch(setSuccess(true));
      } catch (error) {
        const axiosError = error as AxiosError;
        dispatch(setError(axiosError.message || "Failed to mark all notifications as read"));
        throw error;
      }
    },
    [api]
  );

  const getUnreadCount = useCallback(
    async (): Promise<number> => {
      try {
        const response = await api.get("/api/services/app/Notification/GetUnreadCount");
        const count = response.data.result;
        dispatch(setUnreadCount(count));
        return count;
      } catch (error) {
        console.error("Failed to get unread count:", error);
        return state.unreadCount;
      }
    },
    [api, state.unreadCount]
  );

  const actions: INotificationActionContext = {
    createNotification,
    updateNotification,
    deleteNotification,
    getNotification,
    getNotifications,
    markAsRead,
    markAllAsRead,
    getUnreadCount,
  };

  return (
    <NotificationStateContext.Provider value={state}>
      <NotificationActionContext.Provider value={actions}>
        {children}
      </NotificationActionContext.Provider>
    </NotificationStateContext.Provider>
  );
};

// Custom hooks for using the notification context
export const useNotificationState = () => {
  const context = useContext(NotificationStateContext);
  if (context === undefined) {
    throw new Error("useNotificationState must be used within a NotificationProvider");
  }
  return context;
};

export const useNotificationActions = () => {
  const context = useContext(NotificationActionContext);
  if (context === undefined) {
    throw new Error("useNotificationActions must be used within a NotificationProvider");
  }
  return context;
};
