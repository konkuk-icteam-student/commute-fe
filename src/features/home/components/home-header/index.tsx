import Image from "next/image";
import notificationIcon from "@/assets/icons/notification-icon.svg";

type HomeHeaderProps = {
  unreadNotificationCount: number;
};

export default function HomeHeader({
  unreadNotificationCount,
}: HomeHeaderProps) {
  const hasUnreadNotifications = unreadNotificationCount > 0;

  return (
    <header className="mr-1.25 ml-1.5 flex items-center justify-between">
      <span className="text-[12px] leading-6 font-bold text-[#8892A6]">홈</span>

      <button
        aria-label={`읽지 않은 알림 ${unreadNotificationCount}개`}
        className="relative flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-[#DFE7F5] bg-white"
        type="button"
      >
        <Image
          alt=""
          aria-hidden="true"
          src={notificationIcon}
          width={24}
          height={24}
        />
        {hasUnreadNotifications ? (
          <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#FF6B72] text-[11px] leading-none text-white">
            {unreadNotificationCount}
          </span>
        ) : null}
      </button>
    </header>
  );
}
