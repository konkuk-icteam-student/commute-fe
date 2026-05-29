import Image from "next/image";
import Link from "next/link";
import notificationIcon from "@/assets/icons/notification-icon.svg";

type HomeHeaderProps = {
  newNotificationCount: number;
};

export default function HomeHeader({
  newNotificationCount,
}: HomeHeaderProps) {
  const hasNewNotifications = newNotificationCount > 0;

  return (
    <header className="mr-1.25 ml-1.5 flex items-center justify-between">
      <span className="text-[12px] leading-6 font-bold text-[#8892A6]">홈</span>

      <Link
        aria-label={
          hasNewNotifications ? `새 알림 ${newNotificationCount}개` : "알림함"
        }
        className="relative flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-[#DFE7F5] bg-white"
        href="/alarm"
      >
        <Image
          alt=""
          aria-hidden="true"
          src={notificationIcon}
          width={24}
          height={24}
        />
        {hasNewNotifications ? (
          <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#FF6B72] px-1 text-[11px] leading-none text-white">
            {newNotificationCount}
          </span>
        ) : null}
      </Link>
    </header>
  );
}
