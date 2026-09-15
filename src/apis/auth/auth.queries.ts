"use client";

import { useMutation } from "@tanstack/react-query";

import { type ApiError } from "../api-client";
import {
  loginApi,
  logoutApi,
  registerApi,
  sendVerificationCodeApi,
  verifyCodeApi,
} from "./auth.api";
import type {
  LoginRequest,
  LoginResponse,
  LogoutResponse,
  RegisterRequest,
  RegisterResponse,
  SendVerificationCodeRequest,
  SendVerificationCodeResponse,
  VerifyCodeRequest,
  VerifyCodeResponse,
} from "./auth.types";

export const useLoginMutation = () => {
  const { mutate: login, isPending: isPendingLogin } = useMutation<
    LoginResponse,
    ApiError,
    LoginRequest
  >({
    mutationFn: loginApi,
  });

  return { login, isPendingLogin };
};

export const useLogoutMutation = () => {
  const { mutate: logout, isPending: isPendingLogout } = useMutation<
    LogoutResponse,
    ApiError
  >({
    mutationFn: logoutApi,
  });

  return { logout, isPendingLogout };
};

export const useSendVerificationCodeMutation = () => {
  const {
    mutate: sendVerificationCode,
    isPending: isPendingSendVerificationCode,
  } = useMutation<
    SendVerificationCodeResponse,
    ApiError,
    SendVerificationCodeRequest
  >({
    mutationFn: sendVerificationCodeApi,
  });

  return { sendVerificationCode, isPendingSendVerificationCode };
};

export const useVerifyCodeMutation = () => {
  const { mutate: verifyCode, isPending: isPendingVerifyCode } = useMutation<
    VerifyCodeResponse,
    ApiError,
    VerifyCodeRequest
  >({
    mutationFn: verifyCodeApi,
  });

  return { verifyCode, isPendingVerifyCode };
};

export const useRegisterMutation = () => {
  const { mutate: register, isPending: isPendingRegister } = useMutation<
    RegisterResponse,
    ApiError,
    RegisterRequest
  >({
    mutationFn: registerApi,
  });

  return { register, isPendingRegister };
};
