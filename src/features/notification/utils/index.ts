import type { NotificationContentItem } from "@/apis/notifications";

export const formatNotificationContent = ({
  date,
  startTime,
  endTime,
  durationMinutes,
}: NotificationContentItem) => {
  const [, month, day] = date.split("-").map(Number);

  return `${month}월 ${day}일 ${startTime}-${endTime} (${durationMinutes / 60}h)`;
};

export const formatNotificationCreatedAt = (createdAt: string) => {
  const [date = "", time = ""] = createdAt.split(/[ T]/);
  const [year, month, day] = date.split("-");
  const [hour, minute] = time.split(":");

  if (!year || !month || !day || !hour || !minute) {
    return createdAt;
  }

  return `${year}.${month}.${day} ${hour}:${minute}`;
};
