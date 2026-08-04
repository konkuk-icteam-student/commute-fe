import { useMutation } from "@tanstack/react-query";

import type {
  SaveAdminWorkSchedulesSettingsRequest,
  SaveAdminWorkSchedulesSettingsResponse,
} from "./admin-work-schedules.types";
import { ApiError } from "../api-client";
import { saveAdminWorkSchedulesSettingsApi } from "./admin-work-schedules.api";

export const useSaveAdminWorkSchedulesSettingsMutation = () => {
  const {
    mutate: saveAdminWorkSchedulesSettings,
    isPending: isPendingSaveAdminWorkSchedulesSettings,
  } = useMutation<
    SaveAdminWorkSchedulesSettingsResponse,
    ApiError,
    SaveAdminWorkSchedulesSettingsRequest
  >({
    mutationFn: saveAdminWorkSchedulesSettingsApi,
    onSuccess: () => {
      // TODO: 기존에 신청했던 내용 쿼리 캐시 초기화
    },
    onError: () => {
      // TODO: 사용하는 화면에서 토스트 메시지 사용
    },
  });

  return {
    saveAdminWorkSchedulesSettings,
    isPendingSaveAdminWorkSchedulesSettings,
  };
};
