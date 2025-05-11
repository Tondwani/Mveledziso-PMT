"use client";

import React, { useReducer, useContext, useCallback } from "react";
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

  const getNotifications = useCallback(
    async (input: IGetNotificationInput): Promise<{ items: INotification[]; totalCount: number }> => {
      try {
        dispatch(setPending(true));
        // The backend will automatically filter for the current logged-in user
        const response = await api.get("/api/services/app/Notification/GetList", {
          params: input,
        });
        const result = response.data.result;
        dispatch(setNotifications(result.items));
        dispatch(setTotalCount(result.totalCount));
        // Calculate unread count from the full list
        const unreadCount = result.items.filter((n: INotification) => !n.isRead).length;
        dispatch(setUnreadCount(unreadCount));
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
        
        // Update the notifications list to reflect the change
        const updatedNotifications = state.notifications.map((n: INotification) =>
          n.id === id ? { ...n, isRead: true } : n
        );
        dispatch(setNotifications(updatedNotifications));
        
        // Recalculate unread count
        const unreadCount = updatedNotifications.filter((n: INotification) => !n.isRead).length;
        dispatch(setUnreadCount(unreadCount));
        
        dispatch(setSuccess(true));
        return result;
      } catch (error) {
        const axiosError = error as AxiosError;
        dispatch(setError(axiosError.message || "Failed to mark notification as read"));
        throw error;
      }
    },
    [api, state.notifications]
  );

  const actions: INotificationActionContext = {
    getNotifications,
    markAsRead
  };

  return (
    <NotificationStateContext.Provider value={state}>
      <NotificationActionContext.Provider value={actions}>
        {children}
      </NotificationActionContext.Provider>
    </NotificationStateContext.Provider>
  );
};

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
