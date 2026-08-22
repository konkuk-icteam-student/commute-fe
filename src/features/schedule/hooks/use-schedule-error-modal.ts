"use client";

import { useState } from "react";

import { ApiError } from "@/apis/api-client";
import {
  AuthRequiredError,
  isAuthError,
  isForbiddenError,
} from "@/apis/auth-guard";

// 401·403은 루트의 안내 모달이 맡는다. 화면에서도 띄우면 모달이 두 개 겹친다.
export const isHandledAuthError = (error: unknown) =>
  error instanceof AuthRequiredError ||
  (error instanceof ApiError &&
    (isAuthError({ status: error.status }) ||
      isForbiddenError({ status: error.status })));

// 통신 자체가 끊기거나 응답 형식이 어긋나면 서버 문구가 없다. 그때 대신 보여 줄 문구.
const DEFAULT_ERROR_MESSAGE =
  "요청 처리에 실패했습니다.\n잠시 후 다시 시도해주세요.";

// 서버가 내려준 message만 사용자에게 보여 준다.
// ApiError가 아니면 axios의 영문 메시지라 그대로 노출하지 않는다.
export const getApiErrorMessage = (error: unknown) =>
  error instanceof ApiError && error.message
    ? error.message
    : DEFAULT_ERROR_MESSAGE;

// 조회 실패는 errors로 받아 자동으로 띄우고, 제출 실패는 showError로 직접 띄운다.
//
// 조회 에러는 화면에 계속 남아 있는 상태라 "닫았다"를 따로 기억해야 한다.
// 닫은 에러를 dismissedError에 담아 두고 렌더 중에 비교하므로,
// 확인을 눌러 닫으면 같은 에러로는 다시 열리지 않고 새 에러가 오면 다시 열린다.
export const useScheduleErrorModal = (errors: unknown[]) => {
  const [dismissedError, setDismissedError] = useState<unknown>(null);
  const [requestErrorMessage, setRequestErrorMessage] = useState("");

  const queryError = errors.find(
    (error) => Boolean(error) && !isHandledAuthError(error),
  );
  const queryErrorMessage =
    queryError && queryError !== dismissedError
      ? getApiErrorMessage(queryError)
      : "";

  // 제출 실패를 먼저 보여 준다. 사용자가 방금 한 행동이라서다.
  const errorMessage = requestErrorMessage || queryErrorMessage;

  const showError = (error: unknown) => {
    if (isHandledAuthError(error)) {
      return;
    }

    setRequestErrorMessage(getApiErrorMessage(error));
  };

  // 지금 화면에 떠 있는 것만 닫는다.
  // 제출 실패에 가려져 있던 조회 실패까지 함께 닫으면,
  // 문구가 다른 경우 사용자가 보지 못한 오류를 본 것으로 기록하게 된다.
  const closeErrorModal = () => {
    if (requestErrorMessage) {
      setRequestErrorMessage("");
      return;
    }

    setDismissedError(queryError ?? null);
  };

  return { errorMessage, showError, closeErrorModal };
};
