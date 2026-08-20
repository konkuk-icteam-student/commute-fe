import type { NotificationItem } from "@/apis/notifications";

export const shouldShowAddTimeIcon = (notification: NotificationItem) =>
  notification.typeCode === "NT01" || notification.typeCode === "NT02";

export const formatNotificationCreatedAt = (createdAt: string) => {
  const [date = "", time = ""] = createdAt.split(/[ T]/);
  const [year, month, day] = date.split("-");
  const [hour, minute] = time.split(":");

  if (!year || !month || !day || !hour || !minute) {
    return createdAt;
  }

  return `${year}년 ${Number(month)}월 ${Number(day)}일 ${hour}:${minute}`;
};

export const getNotificationDateTime = (createdAt: string) =>
  createdAt.replace(" ", "T");
