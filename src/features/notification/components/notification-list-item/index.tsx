import type { NotificationItem } from "@/apis/notifications";
import { StatusHistoryCard, type StatusHistoryCardTone } from "@/components/ui";
import {
  formatNotificationContent,
  formatNotificationCreatedAt,
} from "../../utils";

type NotificationListItemProps = {
  notification: NotificationItem;
};

const notificationTone: Record<
  NotificationItem["typeCode"],
  StatusHistoryCardTone
> = {
  NT01: "approved",
  NT02: "rejected",
  NT03: "notice",
};

const notificationBadgeLabel: Record<NotificationItem["typeCode"], string> = {
  NT01: "승인",
  NT02: "반려",
  NT03: "안내",
};

export default function NotificationListItem({
  notification,
}: NotificationListItemProps) {
  const items = notification.content.map((content, index) => ({
    key: `${notification.notificationId}-${index}`,
    text: formatNotificationContent(content),
    type:
      content.changeTypeCode === "CR01"
        ? ("add" as const)
        : ("delete" as const),
  }));

  return (
    <li>
      <StatusHistoryCard
        statusLabel={notificationBadgeLabel[notification.typeCode]}
        tone={notificationTone[notification.typeCode]}
        title={notification.title}
        items={items}
        reason={
          notification.typeCode === "NT02" ? notification.rejectReason : null
        }
        footer={formatNotificationCreatedAt(notification.createdAt)}
        footerDateTime={notification.createdAt}
      />
    </li>
  );
}
