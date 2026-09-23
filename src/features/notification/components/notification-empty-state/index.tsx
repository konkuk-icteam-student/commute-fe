import Image from "next/image";

import emptyNotificationIcon from "@/assets/icons/home/ic_empty_notification.svg";

export default function NotificationEmptyState() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center pb-18">
      <Image
        alt=""
        aria-hidden="true"
        src={emptyNotificationIcon}
        width={28}
        height={28}
      />
      <p className="mt-2.25 text-[14px] leading-6 font-medium text-[#8892A6]">
        최근 30일 내 새로운 알림이 없습니다.
      </p>
    </div>
  );
}
