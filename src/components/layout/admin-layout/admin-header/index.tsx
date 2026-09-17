"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { useGetAdminMeQuery } from "@/apis/admin/me";
import { useLogoutMutation } from "@/apis/auth";
import { deleteAuthToken } from "@/apis/token-storage";
import chevronLeftIcon from "@/assets/icons/admin-common/ic_chevron_right_bold.svg";
import chevronDownIcon from "@/assets/icons/admin-worktime-request/ic_chevron_down.svg";
import logoutIcon from "@/assets/icons/admin-nav/ic_logout_gray.svg";
import profileIcon from "@/assets/icons/admin-nav/ic_profile.svg";
import { Alert, Toast } from "@/components/ui";

export default function AdminHeader({
  showBackButton,
  title,
}: {
  showBackButton: boolean;
  title: string;
}) {
  const router = useRouter();
  const menuRef = useRef<HTMLDivElement>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLogoutAlertOpen, setIsLogoutAlertOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const { adminMeData } = useGetAdminMeQuery();
  const { logout, isPendingLogout } = useLogoutMutation();
  // 아직 못 받았거나 조회에 실패해도 헤더는 그려야 하므로 이름 자리를 비우지 않는다.
  const adminLabel = adminMeData
    ? `${adminMeData.adminName} (${adminMeData.teamName})`
    : "관리자";

  useEffect(() => {
    if (!isMenuOpen) {
      return;
    }

    const closeMenuOnOutsideClick = (event: MouseEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    const closeMenuOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", closeMenuOnOutsideClick);
    document.addEventListener("keydown", closeMenuOnEscape);

    return () => {
      document.removeEventListener("mousedown", closeMenuOnOutsideClick);
      document.removeEventListener("keydown", closeMenuOnEscape);
    };
  }, [isMenuOpen]);

  const handleLogoutConfirm = () => {
    if (isPendingLogout) {
      return;
    }

    logout(undefined, {
      onSuccess: () => {
        deleteAuthToken();
        setIsLogoutAlertOpen(false);
        setToastMessage("로그아웃되었습니다.");
      },
      onError: () => {
        setIsLogoutAlertOpen(false);
        setToastMessage("로그아웃에 실패했습니다. 다시 시도해 주세요.");
      },
    });
  };

  const handleToastDismiss = () => {
    const shouldRedirectToLogin = toastMessage === "로그아웃되었습니다.";

    setToastMessage("");

    if (shouldRedirectToLogin) {
      window.location.replace("/login");
    }
  };

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

      <div ref={menuRef} className="relative">
        <button
          type="button"
          className="flex cursor-pointer items-center gap-2 text-2xl font-bold whitespace-nowrap text-[#000000]"
          aria-haspopup="menu"
          aria-expanded={isMenuOpen}
          onClick={() => setIsMenuOpen((isOpen) => !isOpen)}
        >
          <Image
            src={profileIcon}
            alt=""
            width={45}
            height={45}
            className="h-11.25 w-11.25"
          />
          <span>{adminLabel}</span>
          <Image
            src={chevronDownIcon}
            alt=""
            width={20}
            height={20}
            className={`h-5 w-5 transition-transform ${isMenuOpen ? "rotate-180" : ""}`}
          />
        </button>

        {isMenuOpen ? (
          <div
            className="absolute top-[calc(100%+12px)] right-7 z-30 w-62.25 rounded-lg border border-[#CDD1D5] bg-white px-2 py-1.5 text-[#1A2236]"
            role="menu"
          >
            <div className="mb-1 flex flex-col justify-center px-2 py-1.25">
              <p className="text-sm font-semibold">
                {adminMeData?.adminName ?? "관리자"}
              </p>
              <p className="text-[12px] font-medium">
                {adminMeData?.teamName ?? "-"}
              </p>
            </div>

            <button
              type="button"
              className="flex h-8 w-full cursor-pointer items-center justify-between border-y border-[#E2E4E8] px-2 py-1.5"
              role="menuitem"
              onClick={() => {
                setIsMenuOpen(false);
                setToastMessage("기능 준비중입니다.");
              }}
            >
              <span className="text-[12px] font-bold">네이트온 계정 연결</span>
              <span className="rounded-full bg-[#F0F2F8] px-2 py-px text-[10px] font-bold text-[#8892A6]">
                <span className="text-[#98989D]">●</span>
                <span className="ml-1">미연결</span>
              </span>
            </button>

            <button
              type="button"
              className="mt-1 flex h-4.5 w-full cursor-pointer items-center gap-2 px-2 py-0.5 text-left text-[12px] font-bold disabled:cursor-default disabled:opacity-50"
              role="menuitem"
              disabled={isPendingLogout}
              onClick={() => {
                setIsMenuOpen(false);
                setIsLogoutAlertOpen(true);
              }}
            >
              <Image src={logoutIcon} alt="" width={18} height={18} />
              {isPendingLogout ? "로그아웃 중..." : "로그아웃"}
            </button>
          </div>
        ) : null}
      </div>

      <Alert
        open={isLogoutAlertOpen}
        title="로그아웃"
        message="로그아웃 하시겠습니까?"
        onCancel={() => setIsLogoutAlertOpen(false)}
        onConfirm={handleLogoutConfirm}
        confirmText={isPendingLogout ? "로그아웃 중..." : "확인"}
      />
      <Toast
        open={toastMessage.length > 0}
        message={toastMessage}
        onDismiss={handleToastDismiss}
      />
    </header>
  );
}
