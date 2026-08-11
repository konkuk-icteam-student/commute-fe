"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { type ApiError } from "@/apis/api-client";

import type {
  GetWorkApplicationSettingsRequest,
  GetWorkApplicationSettingsResponse,
  SaveWorkApplicationSettingsRequest,
  SaveWorkApplicationSettingsResponse,
} from "./work-application-settings.types";
import {
  getWorkApplicationSettingsApi,
  saveWorkApplicationSettingsApi,
} from "./work-application-settings.api";
import { WORK_APPLICATION_SETTINGS_QUERY_KEY } from "./work-application-settings.key";

const WORK_APPLICATION_SETTINGS_CACHE_TIME = {
  SETTINGS: {
    STALE: 1000 * 30,
    GC: 1000 * 60 * 5,
  },
} as const;

export const useGetWorkApplicationSettingsQuery = ({
  year,
  month,
}: GetWorkApplicationSettingsRequest) => {
  const {
    data: workApplicationSettingsData,
    isPending: isPendingWorkApplicationSettings,
    isError: isErrorWorkApplicationSettings,
    error: workApplicationSettingsError,
  } = useQuery<GetWorkApplicationSettingsResponse, ApiError>({
    queryKey: WORK_APPLICATION_SETTINGS_QUERY_KEY.SETTINGS(year, month),
    queryFn: () => getWorkApplicationSettingsApi({ year, month }),
    retry: 1,
    staleTime: WORK_APPLICATION_SETTINGS_CACHE_TIME.SETTINGS.STALE,
    gcTime: WORK_APPLICATION_SETTINGS_CACHE_TIME.SETTINGS.GC,
  });

  return {
    workApplicationSettingsData,
    isPendingWorkApplicationSettings,
    isErrorWorkApplicationSettings,
    workApplicationSettingsError,
  };
};

export const useSaveWorkApplicationSettingsMutation = () => {
  const queryClient = useQueryClient();

  const {
    mutate: saveWorkApplicationSettings,
    isPending: isPendingSaveWorkApplicationSettings,
  } = useMutation<
    SaveWorkApplicationSettingsResponse,
    ApiError,
    SaveWorkApplicationSettingsRequest
  >({
    mutationFn: saveWorkApplicationSettingsApi,
    // 저장이 반영되면 화면에 떠 있는 설정이 낡으므로 다시 받아 오게 한다.
    onSuccess: (_, { year, month }) => {
      queryClient.invalidateQueries({
        queryKey: WORK_APPLICATION_SETTINGS_QUERY_KEY.SETTINGS(year, month),
      });
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
