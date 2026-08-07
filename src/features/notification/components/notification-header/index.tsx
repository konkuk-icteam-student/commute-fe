import Image from "next/image";
import Link from "next/link";

import icLeft from "@/assets/icons/common/ic_left.svg";

export default function NotificationHeader() {
  return (
    <header className="relative mb-10 flex h-15.25 shrink-0 items-center justify-center">
      <Link
        aria-label="홈으로 이동"
        className="absolute left-2.5 flex items-center justify-center"
        href="/"
      >
        <Image alt="" aria-hidden="true" src={icLeft} width={20} height={20} />
      </Link>
      <h1 className="text-[16px] leading-6">알림</h1>
    </header>
  );
}
