"use client";

import { useQuery } from "@tanstack/react-query";

import { type ApiError } from "@/apis/api-client";

import {
  getAdminHomeAttendanceStatusApi,
  getAdminHomeAttendanceSummaryApi,
} from "./admin-home.api";
import { ADMIN_HOME_QUERY_KEY } from "./admin-home.key";
import type {
  GetAdminHomeAttendanceStatusRequest,
  GetAdminHomeAttendanceStatusResponse,
  GetAdminHomeAttendanceSummaryRequest,
  GetAdminHomeAttendanceSummaryResponse,
} from "./admin-home.types";

const ADMIN_HOME_CACHE_TIME = {
  ATTENDANCE_SUMMARY: {
    STALE: 1000 * 30,
    GC: 1000 * 60 * 5,
  },
  ATTENDANCE_STATUS: {
    STALE: 1000 * 30,
    GC: 1000 * 60 * 5,
  },
} as const;

export const useGetAdminHomeAttendanceSummaryQuery = (
  params: GetAdminHomeAttendanceSummaryRequest,
) => {
  const {
    data: adminHomeAttendanceSummaryData,
    isPending: isPendingAdminHomeAttendanceSummary,
    isError: isErrorAdminHomeAttendanceSummary,
    error: adminHomeAttendanceSummaryError,
  } = useQuery<GetAdminHomeAttendanceSummaryResponse, ApiError>({
    queryKey: ADMIN_HOME_QUERY_KEY.ATTENDANCE_SUMMARY(params),
    queryFn: () => getAdminHomeAttendanceSummaryApi(params),
    retry: 1,
    staleTime: ADMIN_HOME_CACHE_TIME.ATTENDANCE_SUMMARY.STALE,
    gcTime: ADMIN_HOME_CACHE_TIME.ATTENDANCE_SUMMARY.GC,
  });

  return {
    adminHomeAttendanceSummaryData,
    isPendingAdminHomeAttendanceSummary,
    isErrorAdminHomeAttendanceSummary,
    adminHomeAttendanceSummaryError,
  };
};

export const useGetAdminHomeAttendanceStatusQuery = (
  params: GetAdminHomeAttendanceStatusRequest,
) => {
  const {
    data: adminHomeAttendanceStatusData,
    isPending: isPendingAdminHomeAttendanceStatus,
    isError: isErrorAdminHomeAttendanceStatus,
    error: adminHomeAttendanceStatusError,
  } = useQuery<GetAdminHomeAttendanceStatusResponse, ApiError>({
    queryKey: ADMIN_HOME_QUERY_KEY.ATTENDANCE_STATUS(params),
    queryFn: () => getAdminHomeAttendanceStatusApi(params),
    retry: 1,
    staleTime: ADMIN_HOME_CACHE_TIME.ATTENDANCE_STATUS.STALE,
    gcTime: ADMIN_HOME_CACHE_TIME.ATTENDANCE_STATUS.GC,
  });

  return {
    adminHomeAttendanceStatusData,
    isPendingAdminHomeAttendanceStatus,
    isErrorAdminHomeAttendanceStatus,
    adminHomeAttendanceStatusError,
  };
};
