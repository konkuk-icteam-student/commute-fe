import type { Notification, NotificationType } from "../types";

const notificationIcons: Record<NotificationType, string> = {
  WORK_TIME_CHANGE_REJECTED: "❌",
  WORK_TIME_CHANGED: "✏️",
  WORK_REQUEST_STARTED: "🗓️",
};

export const getNotificationIcon = (type: NotificationType) =>
  notificationIcons[type];

export const shouldShowAddTimeIcon = (notification: Notification) =>
  notification.type === "WORK_TIME_CHANGE_REJECTED" ||
  notification.type === "WORK_TIME_CHANGED";
