import type { Notification, NotificationTypeCode } from "../types";

const notificationIcons: Record<NotificationTypeCode, string> = {
  NT01: "✏️",
  NT02: "❌",
  NT03: "🗓️",
};

export const getNotificationIcon = (typeCode: NotificationTypeCode) =>
  notificationIcons[typeCode];

export const shouldShowAddTimeIcon = (notification: Notification) =>
  notification.typeCode === "NT01" || notification.typeCode === "NT02";

export const formatNotificationCreatedAt = (createdAt: string) => {
  const [date = "", time = ""] = createdAt.split(" ");
  const [year, month, day] = date.split("-");
  const [hour, minute] = time.split(":");

  if (!year || !month || !day || !hour || !minute) {
    return createdAt;
  }

  return `${year}년 ${Number(month)}월 ${Number(day)}일 ${hour}:${minute}`;
};

export const getNotificationDateTime = (createdAt: string) =>
  createdAt.replace(" ", "T");
