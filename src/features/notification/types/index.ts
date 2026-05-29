export type NotificationTypeCode = "NT01" | "NT02" | "NT03";

export type Notification = {
  notificationId: string;
  typeCode: NotificationTypeCode;
  typeName: string;
  title: string;
  content: string;
  refId: string;
  createdAt: string;
  isNew: boolean;
};

export type NotificationSummary = {
  isSuccess: boolean;
  message: string;
  details: {
    hasNewNotification: boolean;
    newNotificationCount: number;
  };
};
