"use client";

import { useEffect, useRef } from "react";

import {
  useCheckNotificationsMutation,
  useGetNotificationsQuery,
} from "@/apis/notifications";
import {
  NotificationEmptyState,
  NotificationErrorState,
  NotificationHeader,
  NotificationList,
  NotificationLoadingState,
} from "@/features/notification";

export default function AlarmScreen() {
  const hasCheckedNotificationsRef = useRef(false);
  const {
    notificationsData,
    isPendingNotifications,
    isErrorNotifications,
    notificationsError,
  } = useGetNotificationsQuery();
  const { checkNotifications } = useCheckNotificationsMutation();
  const notifications = notificationsData?.notifications ?? [];

  useEffect(() => {
    if (!notificationsData || hasCheckedNotificationsRef.current) {
      return;
    }

    hasCheckedNotificationsRef.current = true;
    checkNotifications();
  }, [checkNotifications, notificationsData]);

  return (
    <section className="flex min-h-full w-full flex-col bg-white text-[#111827]">
      <NotificationHeader />

      {isPendingNotifications ? (
        <NotificationLoadingState />
      ) : isErrorNotifications ? (
        <NotificationErrorState message={notificationsError?.message} />
      ) : notifications.length > 0 ? (
        <NotificationList notifications={notifications} />
      ) : (
        <NotificationEmptyState />
      )}
    </section>
  );
}
