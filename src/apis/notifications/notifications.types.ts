export type NotificationTypeCode = "NT01" | "NT02" | "NT03";

export interface NotificationItem {
  notificationId: string;
  typeCode: NotificationTypeCode;
  typeName: string;
  title: string;
  content: string;
  refId: string;
  createdAt: string;
  isNew: boolean;
}

export interface GetNotificationsResponse {
  notifications: NotificationItem[];
}

export interface GetNewNotificationsResponse {
  hasNewNotification: boolean;
  newNotificationCount: number;
}

export interface CheckNotificationsResponse {
  lastCheckedAt: string;
}
