export type NotificationTypeCode = "NT01" | "NT02" | "NT03";

export type NotificationChangeTypeCode = "CR01" | "CR02";

export interface NotificationContentItem {
  date: string;
  startTime: string;
  endTime: string;
  durationMinutes: number;
  changeTypeCode: NotificationChangeTypeCode;
}

export interface NotificationItem {
  notificationId: number;
  typeCode: NotificationTypeCode;
  typeName: string;
  title: string;
  content: NotificationContentItem[];
  rejectReason: string | null;
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
