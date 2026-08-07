"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { type ApiError } from "../api-client";
import {
  checkNotificationsApi,
  getNewNotificationsApi,
  getNotificationsApi,
} from "./notifications.api";
import { NOTIFICATIONS_QUERY_KEY } from "./notifications.key";
import type {
  CheckNotificationsResponse,
  GetNewNotificationsResponse,
  GetNotificationsResponse,
} from "./notifications.types";

const NOTIFICATIONS_CACHE_TIME = {
  LIST: {
    STALE: 1000 * 60,
    GC: 1000 * 60 * 5,
  },
  NEW: {
    STALE: 1000 * 30,
    GC: 1000 * 60 * 5,
  },
} as const;

export const useGetNotificationsQuery = () => {
  const {
    data: notificationsData,
    isPending: isPendingNotifications,
    isError: isErrorNotifications,
    error: notificationsError,
  } = useQuery<GetNotificationsResponse, ApiError>({
    queryKey: NOTIFICATIONS_QUERY_KEY.LIST,
    queryFn: getNotificationsApi,
    retry: 1,
    staleTime: NOTIFICATIONS_CACHE_TIME.LIST.STALE,
    gcTime: NOTIFICATIONS_CACHE_TIME.LIST.GC,
  });

  return {
    notificationsData,
    isPendingNotifications,
    isErrorNotifications,
    notificationsError,
  };
};

export const useGetNewNotificationsQuery = () => {
  const {
    data: newNotificationsData,
    isPending: isPendingNewNotifications,
    isError: isErrorNewNotifications,
    error: newNotificationsError,
  } = useQuery<GetNewNotificationsResponse, ApiError>({
    queryKey: NOTIFICATIONS_QUERY_KEY.NEW,
    queryFn: getNewNotificationsApi,
    retry: 1,
    staleTime: NOTIFICATIONS_CACHE_TIME.NEW.STALE,
    gcTime: NOTIFICATIONS_CACHE_TIME.NEW.GC,
  });

  return {
    newNotificationsData,
    isPendingNewNotifications,
    isErrorNewNotifications,
    newNotificationsError,
  };
};

const useInvalidateNotifications = () => {
  const queryClient = useQueryClient();

  return () =>
    queryClient.invalidateQueries({ queryKey: NOTIFICATIONS_QUERY_KEY.ALL });
};

export const useCheckNotificationsMutation = () => {
  const invalidateNotifications = useInvalidateNotifications();

  const {
    mutate: checkNotifications,
    isPending: isPendingCheckNotifications,
  } = useMutation<CheckNotificationsResponse, ApiError>({
    mutationFn: checkNotificationsApi,
    onSuccess: invalidateNotifications,
  });

  return {
    checkNotifications,
    isPendingCheckNotifications,
  };
};
