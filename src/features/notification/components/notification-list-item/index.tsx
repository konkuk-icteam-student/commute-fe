import Image from "next/image";

import type { NotificationItem } from "@/apis/notifications";
import minusTimeIcon from "@/assets/icons/common/ic_minus_filled.svg";
import addTimeIcon from "@/assets/icons/common/ic_plus_filled.svg";
import { cn } from "@/lib/utils";
import {
  formatNotificationCreatedAt,
  getNotificationDateTime,
  shouldShowAddTimeIcon,
} from "../../utils";

type NotificationListItemProps = {
  notification: NotificationItem;
};

const typeBadgeClassNames = {
  NT01: "bg-[#DBEAFE] text-[#2563EB]",
  NT02: "bg-[#FFE4E4] text-[#C44B5F]",
  NT03: "bg-[#FFF4D7] text-[#B88A42]",
} as const;

const typeBadgeLabels = {
  NT01: "승인",
  NT02: "반려",
  NT03: "안내",
} as const;

const typeBadgeBaseClassName =
  "flex h-4.75 min-w-10.25 shrink-0 items-center justify-center rounded-lg px-2.5 py-1 text-[11px] font-bold";

const timeIconClassNames = {
  NT01: addTimeIcon,
  NT02: minusTimeIcon,
} as const;

export default function NotificationListItem({
  notification,
}: NotificationListItemProps) {
  const isApproved = notification.typeCode === "NT01";
  const contentLines = notification.content
    .split(/\r?\n/)
    .filter((content) => content.trim().length > 0);
  const hasContent = contentLines.length > 0;
  const timeIcon =
    notification.typeCode in timeIconClassNames
      ? timeIconClassNames[
          notification.typeCode as keyof typeof timeIconClassNames
        ]
      : null;

  if (isApproved) {
    return (
      <li>
        <article className="rounded-[20px] border-[0.5px] border-[#DDE3EF] bg-white px-3.75 py-3 shadow-[0_2px_8px_0_#F3F2F2]">
          <div className="flex items-start justify-between gap-4">
            <h2 className="min-w-0 flex-1 pt-0.5 text-[11px] leading-4.5 font-bold text-[#1A2236]">
              {notification.title}
            </h2>
            <span
              className={`${typeBadgeBaseClassName} ${typeBadgeClassNames[notification.typeCode]}`}
            >
              {typeBadgeLabels[notification.typeCode]}
            </span>
          </div>

          <ul className="mt-3 ml-[5px] flex flex-col gap-1">
            {contentLines.map((content, index) => (
              <li
                className="flex items-center gap-1.5 text-[10px] leading-4.5 font-medium text-[#1A2236]"
                key={`${notification.notificationId}-${index}`}
              >
                {timeIcon ? (
                  <Image
                    alt=""
                    aria-hidden="true"
                    className="shrink-0"
                    src={timeIcon}
                    width={5}
                    height={5}
                  />
                ) : null}
                <span>{content}</span>
              </li>
            ))}
          </ul>

          <time
            className="mt-2 ml-[5px] block text-[8px] leading-2.5 font-medium text-[#8892A6]"
            dateTime={getNotificationDateTime(notification.createdAt)}
          >
            신청 {formatNotificationCreatedAt(notification.createdAt)}
          </time>
        </article>
      </li>
    );
  }

  return (
    <li>
      <article className="rounded-[20px] border-[0.5px] border-[#DDE3EF] bg-white px-3.75 py-3 shadow-[0_2px_8px_0_#F3F2F2]">
        <div className="flex items-start justify-between gap-4">
          <h2 className="min-w-0 flex-1 pt-0.5 text-[11px] leading-4.5 font-bold text-[#1A2236]">
            {notification.title}
          </h2>
          <span
            className={`${typeBadgeBaseClassName} ${typeBadgeClassNames[notification.typeCode]}`}
          >
            {typeBadgeLabels[notification.typeCode]}
          </span>
        </div>

        {hasContent ? (
          <p
            className="mt-3 ml-[5px] flex items-center gap-1.5 text-[10px] leading-4.5 font-medium text-[#1A2236]"
          >
            {shouldShowAddTimeIcon(notification) && timeIcon ? (
              <Image
                alt=""
                aria-hidden="true"
                className="shrink-0"
                src={timeIcon}
                width={5}
                height={5}
              />
            ) : null}
            <span>{contentLines.join("\n")}</span>
          </p>
        ) : null}

        <time
          className={cn(
            "ml-[5px] block text-[8px] leading-2.5 font-medium text-[#8892A6]",
            hasContent ? "mt-3" : "mt-4",
          )}
          dateTime={getNotificationDateTime(notification.createdAt)}
        >
          신청 {formatNotificationCreatedAt(notification.createdAt)}
        </time>
      </article>
    </li>
  );
}
