import type { Notification, NotificationSummary } from "../types";

export const mockNotifications: Notification[] = [
  {
    notificationId: "550e8400-e29b-41d4-a716-446655440000",
    typeCode: "NT02",
    typeName: "근무 변경 요청 거절",
    title: "근무 시간 수정이 거절되었습니다.",
    content: "4월 6일 13:00-14:30 (1.5h)",
    refId: "9a1b2c3d-e29b-41d4-a716-446655440000",
    createdAt: "2026-03-20 16:21:00",
    isNew: true,
  },
  {
    notificationId: "660e8400-e29b-41d4-a716-446655440000",
    typeCode: "NT01",
    typeName: "근무 변경 요청 승인",
    title: "근무 시간이 변경되었습니다.",
    content: "4월 6일 13:00-14:30 (1.5h)",
    refId: "8b1b2c3d-e29b-41d4-a716-446655440000",
    createdAt: "2026-03-20 16:21:00",
    isNew: false,
  },
  {
    notificationId: "770e8400-e29b-41d4-a716-446655440000",
    typeCode: "NT03",
    typeName: "근무 신청 시작",
    title: "근무 신청이 시작되었습니다.",
    content: "6월 근무 신청을 진행해주세요. (5월 26일 ~ 5월 29일)",
    refId: "7c1b2c3d-e29b-41d4-a716-446655440000",
    createdAt: "2026-03-20 16:21:00",
    isNew: false,
  },
];

export const mockNotificationSummary: NotificationSummary = {
  isSuccess: true,
  message: "새 알림 여부를 조회했습니다.",
  details: {
    hasNewNotification: true,
    newNotificationCount: 3,
  },
};
