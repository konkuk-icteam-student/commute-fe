import type { NotificationItem } from "@/apis/notifications";

import NotificationListItem from "../notification-list-item";

type NotificationListProps = {
  notifications: NotificationItem[];
};

export default function NotificationList({
  notifications,
}: NotificationListProps) {
  return (
    <ul className="border-t border-[#EFEFEF]">
      {notifications.map((notification) => (
        <NotificationListItem
          key={notification.notificationId}
          notification={notification}
        />
      ))}
    </ul>
  );
}
