"use client";

import { createContext } from "react";

// Notification Interfaces
export interface INotification {
  id: string;
  message: string;
  type: number;
  isRead: boolean;
  userId: number;
  recipientName: string;
  entityType: string;
  entityId: string;
  creationTime: string;
  senderUserId: number;
  senderUserName: string;
}

// Input DTOs
export interface ICreateNotificationDto {
  message: string;
  type: number;
  userId: number;
  entityType: string;
  entityId: string;
}

export interface IUpdateNotificationDto {
  isRead: boolean;
}

export interface IGetNotificationInput {
  skipCount?: number;
  maxResultCount?: number;
  isRead?: boolean;
}

// State Interface
export interface INotificationStateContext {
  isPending: boolean;
  isSuccess: boolean;
  isError: boolean;
  errorMessage: string | undefined;
  notification: INotification | null;
  notifications: INotification[];
  totalCount: number;
  unreadCount: number;
}

// Initial State
export const INITIAL_STATE: INotificationStateContext = {
  isPending: false,
  isSuccess: false,
  isError: false,
  errorMessage: undefined,
  notification: null,
  notifications: [],
  totalCount: 0,
  unreadCount: 0
};

// Actions Interface
export interface INotificationActionContext {
  getNotifications: (input: IGetNotificationInput) => Promise<{ items: INotification[]; totalCount: number }>;
  markAsRead: (id: string) => Promise<INotification>;
}

export const NotificationStateContext = createContext<INotificationStateContext | undefined>(undefined);
export const NotificationActionContext = createContext<INotificationActionContext | undefined>(undefined);
