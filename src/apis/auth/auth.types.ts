export type LogoutResponse = null;

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken?: string;
  roleCode?: string;
  tokenExpiresAt?: string | number;
  userName?: string;
}

export interface SendVerificationCodeRequest {
  email: string;
}

export type SendVerificationCodeResponse = Record<string, never>;

export interface VerifyCodeRequest {
  email: string;
  code: string;
}

export type VerifyCodeResponse = Record<string, never>;

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
  roleCode: string;
  organizationId: number;
}

export type RegisterResponse = Record<string, never>;

// TODO: accessToken 외 어떤 값이 함께 오는지 확인한다. 오는 값만 스토리지에 반영한다.
// roleCode는 서버가 준 문자열 그대로 둔다. 아는 값인지는 읽는 쪽(getRoleCode)에서 가린다.
export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken?: string;
  roleCode?: string;
  // 숫자인지 문자열인지 확정되지 않았다. 형식을 따지지 않고 그대로 저장한다.
  tokenExpiresAt?: string | number;
}
