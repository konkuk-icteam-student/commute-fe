"use client";

import { useMutation } from "@tanstack/react-query";

import { type ApiError } from "../api-client";
import { logoutApi } from "./auth.api";
import type { LogoutResponse } from "./auth.types";

export const useLogoutMutation = () => {
  const { mutate: logout, isPending: isPendingLogout } = useMutation<
    LogoutResponse,
    ApiError
  >({
    mutationFn: logoutApi,
  });

  return { logout, isPendingLogout };
};
