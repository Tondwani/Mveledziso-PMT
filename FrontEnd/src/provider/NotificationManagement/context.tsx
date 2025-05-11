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
  userId?: number;
  isRead?: boolean;
  skipCount?: number;
  maxResultCount?: number;
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
  createNotification: (notification: ICreateNotificationDto) => Promise<INotification>;
  updateNotification: (id: string, notification: IUpdateNotificationDto) => Promise<INotification>;
  deleteNotification: (id: string) => Promise<void>;
  getNotification: (id: string) => Promise<INotification>;
  getNotifications: (input: IGetNotificationInput) => Promise<{ items: INotification[], totalCount: number }>;
  markAsRead: (id: string) => Promise<INotification>;
  markAllAsRead: () => Promise<void>;
  getUnreadCount: () => Promise<number>;
}

// Create contexts
export const NotificationStateContext = createContext<INotificationStateContext>(INITIAL_STATE);
export const NotificationActionContext = createContext<INotificationActionContext>({
  createNotification: () => Promise.resolve({} as INotification),
  updateNotification: () => Promise.resolve({} as INotification),
  deleteNotification: () => Promise.resolve(),
  getNotification: () => Promise.resolve({} as INotification),
  getNotifications: () => Promise.resolve({ items: [], totalCount: 0 }),
  markAsRead: () => Promise.resolve({} as INotification),
  markAllAsRead: () => Promise.resolve(),
  getUnreadCount: () => Promise.resolve(0)
});
