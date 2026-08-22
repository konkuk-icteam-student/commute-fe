"use client";

import { useSyncExternalStore } from "react";

import {
  clearAuthNotice,
  getAuthNotice,
  subscribeAuthNotice,
} from "@/apis/auth-notice";
import { redirectToLogin } from "@/apis/auth-guard";
import { Modal } from "@/components/ui";

// 인증이 끊겼거나 권한이 없을 때 알리는 모달. 루트에 하나만 둔다.
// 서버 렌더 중에는 안내가 있을 수 없으므로 스냅샷을 null로 준다.
export default function AuthNoticeModal() {
  const notice = useSyncExternalStore(
    subscribeAuthNotice,
    getAuthNotice,
    () => null,
  );

  const handleConfirm = () => {
    const shouldRedirectToLogin = notice?.shouldRedirectToLogin ?? false;

    clearAuthNotice();

    if (shouldRedirectToLogin) {
      redirectToLogin();
    }
  };

  return (
    <Modal
      open={notice !== null}
      title="알림"
      onButtonClick={handleConfirm}
      panelClassName="w-76.5 whitespace-pre-line text-center leading-none"
      contentClassName="gap-5"
    >
      <span>{notice?.message}</span>
    </Modal>
  );
}
