import { apiClient } from "../api-client";
import {
  setAccessToken,
  setRefreshToken,
  setRoleCode,
  setTokenExpiresAt,
} from "../token-storage";
import { AUTH_URL } from "./auth.endpoint";
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

export const loginApi = async (data: LoginRequest) => {
  const response = await apiClient.post<LoginResponse, LoginRequest>(
    AUTH_URL.LOGIN,
    data,
    { skipAuth: true },
  );
  const details = response.details;

  if (details.accessToken) {
    setAccessToken(details.accessToken);
  }

  if (details.refreshToken) {
    setRefreshToken(details.refreshToken);
  }

  if (details.roleCode) {
    setRoleCode(details.roleCode);
  }

  if (details.tokenExpiresAt !== undefined) {
    setTokenExpiresAt(details.tokenExpiresAt);
  }

  return details;
};

export const logoutApi = async () => {
  const response = await apiClient.post<LogoutResponse>(AUTH_URL.LOGOUT);

  return response.details;
};

export const sendVerificationCodeApi = async (
  data: SendVerificationCodeRequest,
) => {
  const response = await apiClient.post<
    SendVerificationCodeResponse,
    SendVerificationCodeRequest
  >(AUTH_URL.SEND_VERIFICATION_CODE, data, { skipAuth: true });

  return response.details;
};

export const verifyCodeApi = async (data: VerifyCodeRequest) => {
  const response = await apiClient.post<VerifyCodeResponse, VerifyCodeRequest>(
    AUTH_URL.VERIFY_CODE,
    data,
    { skipAuth: true },
  );

  return response.details;
};

export const registerApi = async (data: RegisterRequest) => {
  const response = await apiClient.post<RegisterResponse, RegisterRequest>(
    AUTH_URL.REGISTER,
    data,
    { skipAuth: true },
  );

  return response.details;
};
