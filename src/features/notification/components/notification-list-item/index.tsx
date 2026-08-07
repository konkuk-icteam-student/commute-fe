import Image from "next/image";

import type { NotificationItem } from "@/apis/notifications";
import addTimeIcon from "@/assets/icons/common/ic_plus_filled.svg";
import {
  formatNotificationCreatedAt,
  getNotificationDateTime,
  getNotificationIcon,
  shouldShowAddTimeIcon,
} from "../../utils";

type NotificationListItemProps = {
  notification: NotificationItem;
};

export default function NotificationListItem({
  notification,
}: NotificationListItemProps) {
  return (
    <li className="border-b border-[#EEF1F6] px-2.5">
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
  );
}
