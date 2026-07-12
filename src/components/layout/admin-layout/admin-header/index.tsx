"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

import chevronLeftIcon from "@/assets/icons/admin-common/ic_chevron_right_bold.svg";
import profileIcon from "@/assets/icons/admin-nav/ic_profile.svg";

// 1728px 이상에서는 Figma 데스크톱 기준 치수를 사용합니다.
export default function AdminHeader({
  adminUser,
  showBackButton,
  title,
}: {
  adminUser?: {
    name: string;
    team?: string;
  };
  showBackButton: boolean;
  title: string;
}) {
  const router = useRouter();
  const adminLabel = adminUser?.team
    ? `${adminUser.name} (${adminUser.team})`
    : (adminUser?.name ?? "관리자");

  return (
    <header className="sticky top-0 z-20 flex h-22 shrink-0 items-center justify-between border-b [border-bottom-width:0.5px] border-l [border-left-width:0.5px] border-[#D1D1D1] bg-white pr-10 pl-9 min-[1728px]:h-25 min-[1728px]:pr-14.5 min-[1728px]:pl-10">
      <div className="flex items-center gap-4">
        {showBackButton ? (
          <button
            type="button"
            className="flex h-10 w-10 cursor-pointer items-center justify-center"
            aria-label="뒤로가기"
            onClick={() => router.back()}
          >
            <Image
              src={chevronLeftIcon}
              alt=""
              width={40}
              height={40}
              className="rotate-180"
            />
          </button>
        ) : null}

        <h1 className="text-2xl font-bold text-[#000000]">{title}</h1>
      </div>

      <div className="flex items-center gap-[4.5px] text-xl font-bold whitespace-nowrap text-[#000000] min-[1728px]:text-2xl">
        <Image
          src={profileIcon}
          alt=""
          width={45}
          height={45}
          className="h-10 w-10 min-[1728px]:h-11.25 min-[1728px]:w-11.25"
        />
        <span>{adminLabel}</span>
      </div>
    </header>
  );
}
