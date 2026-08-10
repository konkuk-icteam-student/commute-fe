import { useMutation } from "@tanstack/react-query";

import { type ApiError } from "@/apis/api-client";

import type {
  SaveWorkApplicationSettingsRequest,
  SaveWorkApplicationSettingsResponse,
} from "./work-application-settings.types";
import { saveWorkApplicationSettingsApi } from "./work-application-settings.api";

export const useSaveWorkApplicationSettingsMutation = () => {
  const {
    mutate: saveWorkApplicationSettings,
    isPending: isPendingSaveWorkApplicationSettings,
  } = useMutation<
    SaveWorkApplicationSettingsResponse,
    ApiError,
    SaveWorkApplicationSettingsRequest
  >({
    mutationFn: saveWorkApplicationSettingsApi,
    onSuccess: () => {
      // TODO: 기존에 신청했던 내용 쿼리 캐시 초기화
    },
    onError: () => {
      // TODO: 사용하는 화면에서 토스트 메시지 사용
    },
  });

  return {
    saveWorkApplicationSettings,
    isPendingSaveWorkApplicationSettings,
  };
};
