import Image from "next/image";
import Link from "next/link";

import addTimeIcon from "@/assets/icons/add-time-icon.svg";
import emptyNotificationIcon from "@/assets/icons/empty-notification-icon.svg";
import {
  formatNotificationCreatedAt,
  getNotificationDateTime,
  getNotificationIcon,
  mockNotifications,
  shouldShowAddTimeIcon,
} from "@/features/notification";

export default function AlarmScreen() {
  const notifications = mockNotifications;

  return (
    <section className="flex min-h-full w-full flex-col bg-white text-[#111827]">
      <header className="relative mb-10 flex h-15.25 shrink-0 items-center justify-center">
        <Link
          aria-label="홈으로 이동"
          className="absolute left-2.5 flex items-center justify-center text-[28px] leading-none text-[#111827]"
          href="/"
        >
          ‹
        </Link>
        <h1 className="text-[16px] leading-6 font-bold">알림</h1>
      </header>

      {notifications.length > 0 ? (
        <ul className="border-t border-[#EFEFEF]">
          {notifications.map((notification) => (
            <li
              className="border-b border-[#EEF1F6] px-2.5"
              key={notification.notificationId}
            >
              <article className="flex flex-col">
                <p className="text-[12px] leading-6 tracking-[0.24px] text-[#717171]">
                  <span aria-hidden="true" className="mr-0.5">
                    {getNotificationIcon(notification.typeCode)}
                  </span>
                  {notification.title}
                </p>
                <p className="text-[14px] leading-3 tracking-[0.21px] text-[#09121C]">
                  {shouldShowAddTimeIcon(notification) && (
                    <Image
                      alt=""
                      aria-hidden="true"
                      className="mr-0.5 inline-block align-[-1px]"
                      src={addTimeIcon}
                      width={10}
                      height={10}
                    />
                  )}
                  {notification.content}
                </p>
                <time
                  className="text-[10px] leading-6 tracking-[0.24px] text-[#717171]"
                  dateTime={getNotificationDateTime(notification.createdAt)}
                >
                  {formatNotificationCreatedAt(notification.createdAt)}
                </time>
              </article>
            </li>
          ))}
        </ul>
      ) : (
        <div className="flex flex-1 flex-col items-center justify-center pb-18">
          <Image
            alt=""
            aria-hidden="true"
            src={emptyNotificationIcon}
            width={28}
            height={28}
          />
          <p className="mt-2.25 text-[15px] leading-6 font-bold text-[#111827]">
            새로운 알림이 없습니다.
          </p>
        </div>
      )}
    </section>
  );
}
