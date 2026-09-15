"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useMemo, useState } from "react";
import {
  useRegisterMutation,
  useSendVerificationCodeMutation,
  useVerifyCodeMutation,
} from "@/apis/auth";
import { useGetOrganizationsQuery } from "@/apis/organization";
import { ROLE_CODE } from "@/apis/token-storage";
import { Input } from "@/components/ui";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface SignupFormProps {
  id: string;
}

export default function SignupForm({ id }: SignupFormProps) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [organizationId, setOrganizationId] = useState("");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [isCodeVerified, setIsCodeVerified] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const { sendVerificationCode, isPendingSendVerificationCode } =
    useSendVerificationCodeMutation();
  const { verifyCode, isPendingVerifyCode } = useVerifyCodeMutation();
  const { register, isPendingRegister } = useRegisterMutation();
  const {
    organizationsData,
    isPendingOrganizations,
    isErrorOrganizations,
  } = useGetOrganizationsQuery();
  const organizations = organizationsData?.organizations ?? [];

  const isEmailFilled = email.trim().length > 0;
  const isEmailValid = EMAIL_PATTERN.test(email);
  const selectedOrganizationId = Number(organizationId);
  const isOrganizationSelected =
    organizationId.length > 0 && Number.isInteger(selectedOrganizationId);
  const canRequestCode =
    name.trim().length > 0 &&
    isOrganizationSelected &&
    isEmailValid &&
    !isPendingSendVerificationCode;
  const canVerifyCode =
    isCodeSent && code.trim().length > 0 && !isPendingVerifyCode;
  const isPasswordMatched =
    password.length > 0 &&
    passwordConfirm.length > 0 &&
    password === passwordConfirm;
  const canSubmit = useMemo(
    () =>
      canRequestCode &&
      isCodeVerified &&
      password.length >= 8 &&
      isPasswordMatched &&
      !isPendingRegister,
    [
      canRequestCode,
      isCodeVerified,
      isPasswordMatched,
      isPendingRegister,
      password.length,
    ],
  );

  const emailState = !isEmailFilled
    ? "default"
    : isEmailValid
      ? "success"
      : "error";
  const passwordConfirmState =
    passwordConfirm.length === 0
      ? "default"
      : isPasswordMatched
        ? "success"
        : "error";

  const clearMessages = () => {
    setFeedbackMessage("");
    setErrorMessage("");
  };

  const handleRequestCode = () => {
    if (!canRequestCode) return;

    clearMessages();
    sendVerificationCode(
      { email: email.trim() },
      {
        onSuccess: () => {
          setIsCodeSent(true);
          setIsCodeVerified(false);
          setFeedbackMessage("인증번호를 전송했습니다.");
        },
        onError: (error) => {
          setErrorMessage(
            error.message || "인증번호 전송에 실패했습니다. 다시 시도해 주세요.",
          );
        },
      },
    );
  };

  const handleVerifyCode = () => {
    if (!canVerifyCode) return;

    clearMessages();
    verifyCode(
      { email: email.trim(), code: code.trim() },
      {
        onSuccess: () => {
          setIsCodeVerified(true);
          setFeedbackMessage("인증이 완료되었습니다.");
        },
        onError: (error) => {
          setIsCodeVerified(false);
          setErrorMessage(
            error.message || "인증번호 확인에 실패했습니다. 다시 시도해 주세요.",
          );
        },
      },
    );
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!canSubmit) {
      return;
    }

    clearMessages();
    register(
      {
        email: email.trim(),
        password,
        name: name.trim(),
        roleCode: ROLE_CODE.USER,
        organizationId: selectedOrganizationId,
      },
      {
        onSuccess: () => {
          router.replace("/login");
        },
        onError: (error) => {
          setErrorMessage(
            error.message || "회원가입에 실패했습니다. 다시 시도해 주세요.",
          );
        },
      },
    );
  };

  return (
    <>
      <form id={id} className="flex flex-col" onSubmit={handleSubmit}>
        <div className="mb-7">
          <p className="mb-2 text-sm font-semibold text-[#9AA3B2]">
            출근부 시스템
          </p>
          <h1 className="text-2xl font-bold text-[#303030]">회원가입</h1>
        </div>

        <div className="mb-7 flex flex-col gap-2.5">
          <p className="text-sm font-medium text-[#6B7280]">회원 정보</p>
          <Input
            placeholder="이름"
            value={name}
            onChange={(event) => {
              setName(event.target.value);
              clearMessages();
            }}
            state={name ? "active" : "default"}
            autoComplete="name"
          />
          <label className="block">
            <span className="relative block">
              <select
                className="h-12 w-full appearance-none rounded-lg border border-[#D9D9D9] bg-white px-4 pr-10 text-sm font-medium text-[#303030] outline-none transition-colors invalid:text-[#A4A4A4] focus:border-[#8DB4FF] disabled:bg-[#F5F6F8] disabled:text-[#A4A4A4]"
                value={organizationId}
                onChange={(event) => {
                  setOrganizationId(event.target.value);
                  clearMessages();
                }}
                disabled={isPendingOrganizations || isErrorOrganizations}
                required
              >
                <option value="" disabled>
                  {isPendingOrganizations
                    ? "부서 목록을 불러오는 중"
                    : isErrorOrganizations
                      ? "부서 목록을 불러오지 못했습니다"
                      : "부서명"}
                </option>
                {organizations.map((organization) => (
                  <option
                    key={organization.organizationId}
                    value={organization.organizationId}
                  >
                    {organization.organizationName}
                  </option>
                ))}
              </select>
              <span className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-sm text-[#8892A6]">
                v
              </span>
            </span>
          </label>
          <div>
            <Input
              type="email"
              placeholder="이메일"
              value={email}
              onChange={(event) => {
                setEmail(event.target.value);
                setIsCodeSent(false);
                setIsCodeVerified(false);
                clearMessages();
              }}
              state={emailState}
              autoComplete="email"
            />
            <div className="mt-2 flex justify-end">
              <button
                type="button"
                disabled={!canRequestCode}
                onClick={handleRequestCode}
                className="h-9 min-w-[112px] rounded-lg bg-[#2076FF] px-4 text-sm font-semibold text-white transition-colors disabled:bg-[#C4CAD3]"
              >
                {isPendingSendVerificationCode
                  ? "전송 중"
                  : isCodeSent
                    ? "다시 보내기"
                    : "인증번호 받기"}
              </button>
            </div>
          </div>
        </div>

        <div className="mb-7 flex flex-col gap-2.5">
          <Input
            label="인증번호"
            inputMode="numeric"
            placeholder="인증번호를 입력해 주세요"
            value={code}
            onChange={(event) => {
              setCode(event.target.value);
              setIsCodeVerified(false);
              clearMessages();
            }}
            state={code ? "active" : "default"}
          />
          <div className="flex justify-end">
            <button
              type="button"
              disabled={!canVerifyCode}
              onClick={handleVerifyCode}
              className="h-9 min-w-[112px] rounded-lg bg-[#2076FF] px-4 text-sm font-semibold text-white transition-colors disabled:bg-[#C4CAD3]"
            >
              {isPendingVerifyCode ? "확인 중" : "인증 확인"}
            </button>
          </div>
        </div>

        {isCodeVerified ? (
          <div className="flex flex-col gap-3.5">
            <Input
              label="비밀번호"
              type="password"
              placeholder="비밀번호를 설정해 주세요"
              value={password}
              onChange={(event) => {
                setPassword(event.target.value);
                clearMessages();
              }}
              state={password ? "active" : "default"}
              autoComplete="new-password"
            />
            <Input
              label="비밀번호 확인"
              type="password"
              placeholder="비밀번호를 다시 입력해 주세요"
              value={passwordConfirm}
              onChange={(event) => {
                setPasswordConfirm(event.target.value);
                clearMessages();
              }}
              state={passwordConfirmState}
              autoComplete="new-password"
            />
          </div>
        ) : null}

        {feedbackMessage ? (
          <p className="mt-3 text-sm font-medium text-[#2076FF]">
            {feedbackMessage}
          </p>
        ) : null}
        {errorMessage ? (
          <p className="mt-3 text-sm font-medium text-[#FF5B4D]">
            {errorMessage}
          </p>
        ) : null}
      </form>

      <button
        type="submit"
        form={id}
        disabled={!canSubmit}
        className="h-13 w-full rounded-[46px] bg-[#2076FF] text-base font-semibold text-white transition-colors disabled:bg-[#C4CAD3]"
      >
        {isPendingRegister ? "가입 중" : "가입하기"}
      </button>
    </>
  );
}
