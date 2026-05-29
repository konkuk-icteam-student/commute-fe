export type NotificationType =
  | "WORK_TIME_CHANGE_REJECTED"
  | "WORK_TIME_CHANGED"
  | "WORK_REQUEST_STARTED";

export type Notification = {
  id: number;
  type: NotificationType;
  title: string;
  message: string;
  createdAt: string;
};

export type NotificationSummary = {
  newNotificationCount: number;
};
