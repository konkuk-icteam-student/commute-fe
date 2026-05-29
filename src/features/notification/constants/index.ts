import type { Notification, NotificationSummary } from "../types";

export const mockNotifications: Notification[] = [
  {
    id: 1,
    type: "WORK_TIME_CHANGE_REJECTED",
    title: "근무 시간 수정이 거절되었습니다.",
    message: "4월 6일 13:00-14:30 (1.5h)",
    createdAt: "2026년 3월 20일 16:21",
  },
  {
    id: 2,
    type: "WORK_TIME_CHANGED",
    title: "근무 시간이 변경되었습니다.",
    message: "4월 6일 13:00-14:30 (1.5h)",
    createdAt: "2026년 3월 20일 16:21",
  },
  {
    id: 3,
    type: "WORK_REQUEST_STARTED",
    title: "근무 신청이 시작되었습니다.",
    message: "6월 근무 신청을 진행해주세요. (5월 26일 ~ 5월 29일)",
    createdAt: "2026년 3월 20일 16:21",
  },
  {
    id: 4,
    type: "WORK_TIME_CHANGED",
    title: "근무 시간이 변경되었습니다.",
    message: "4월 6일 13:00-14:30 (1.5h)",
    createdAt: "2026년 3월 20일 16:21",
  },
];

export const mockNotificationSummary: NotificationSummary = {
  newNotificationCount: 3,
};
