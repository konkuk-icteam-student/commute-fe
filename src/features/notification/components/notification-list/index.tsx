import type { NotificationItem } from "@/apis/notifications";

import NotificationListItem from "../notification-list-item";

type NotificationListProps = {
  notifications: NotificationItem[];
};

export default function NotificationList({
  notifications,
}: NotificationListProps) {
  return (
    <ul className="flex flex-col gap-4 px-6 pb-8">
      {notifications.map((notification) => (
        <NotificationListItem
          key={notification.notificationId}
          notification={notification}
        />
      ))}
    </ul>
  );
}
