"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

import { useGetAdminMeQuery } from "@/apis/admin/me";
import chevronLeftIcon from "@/assets/icons/admin-common/ic_chevron_right_bold.svg";
import profileIcon from "@/assets/icons/admin-nav/ic_profile.svg";

export default function AdminHeader({
  showBackButton,
  title,
}: {
  showBackButton: boolean;
  title: string;
}) {
  const router = useRouter();
  const { adminMeData } = useGetAdminMeQuery();
  // 아직 못 받았거나 조회에 실패해도 헤더는 그려야 하므로 이름 자리를 비우지 않는다.
  const adminLabel = adminMeData
    ? `${adminMeData.adminName} (${adminMeData.teamName})`
    : "관리자";

  return (
    <header className="sticky top-0 z-20 flex h-25 shrink-0 items-center justify-between border-b [border-bottom-width:0.5px] border-l [border-left-width:0.5px] border-[#D1D1D1] bg-white pr-14.5 pl-10">
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

      <div className="flex items-center gap-[4.5px] text-2xl font-bold whitespace-nowrap text-[#000000]">
        <Image
          src={profileIcon}
          alt=""
          width={45}
          height={45}
          className="h-11.25 w-11.25"
        />
        <span>{adminLabel}</span>
      </div>
    </header>
  );
}
