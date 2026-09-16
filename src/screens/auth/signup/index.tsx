"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { FormEvent, useMemo, useState } from "react";
import {
  useRegisterMutation,
  useSendVerificationCodeMutation,
  useVerifyCodeMutation,
} from "@/apis/auth";
import leftIcon from "@/assets/icons/common/ic_left.svg";
import { useGetOrganizationsQuery } from "@/apis/organization";
import { ROLE_CODE, type RoleCode } from "@/apis/token-storage";
import { BottomActionButton } from "@/components/ui";
import { AuthShell } from "@/features/auth";
import { AuthTitle } from "@/features/auth/components";
import {
  MemberInfoSection,
  PasswordSection,
  VerificationCodeSection,
} from "@/features/auth/signup/components";
import {
  getSendVerificationCodeErrorMessage,
  getVerificationErrorMessage,
} from "@/features/auth/utils/verification-error";
import {
  hasText,
  isValidEmail,
  isValidVerificationCode,
} from "@/features/auth/utils/validation";
import { useDebouncedValue } from "@/hooks";

const SIGNUP_FORM_ID = "signup-form";

export default function SignupScreen() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [organizationId, setOrganizationId] = useState("");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [roleCode, setRoleCode] = useState<RoleCode>(ROLE_CODE.USER);
  const [isOrganizationDropdownOpen, setIsOrganizationDropdownOpen] =
    useState(false);
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [isCodeVerified, setIsCodeVerified] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [emailFeedbackMessage, setEmailFeedbackMessage] = useState("");
  const [emailErrorMessage, setEmailErrorMessage] = useState("");
  const [verificationErrorMessage, setVerificationErrorMessage] = useState("");
  const { sendVerificationCode, isPendingSendVerificationCode } =
    useSendVerificationCodeMutation();
  const { verifyCode, isPendingVerifyCode } = useVerifyCodeMutation();
  const { register, isPendingRegister } = useRegisterMutation();
  const { organizationsData, isPendingOrganizations, isErrorOrganizations } =
    useGetOrganizationsQuery();
  const organizations = organizationsData?.organizations ?? [];
  const debouncedEmail = useDebouncedValue(email, 500);

  const isEmailFilled = hasText(email);
  const isEmailValid = isValidEmail(email);
  const isDebouncedEmailFilled = hasText(debouncedEmail);
  const isDebouncedEmailValid = isValidEmail(debouncedEmail);
  const selectedOrganizationId = Number(organizationId);
  const isOrganizationSelected =
    organizationId.length > 0 && Number.isInteger(selectedOrganizationId);
  const canRequestCode = isEmailValid && !isPendingSendVerificationCode;
  const canVerifyCode =
    isCodeSent &&
    hasText(code) &&
    !isCodeVerified &&
    !isPendingVerifyCode;
  const isPasswordMatched =
    password.length > 0 &&
    passwordConfirm.length > 0 &&
    password === passwordConfirm;
  const canSubmit = useMemo(
    () =>
      hasText(name) &&
      isOrganizationSelected &&
      isCodeVerified &&
      isPasswordMatched &&
      !isPendingRegister,
    [
      isCodeVerified,
      isOrganizationSelected,
      isPasswordMatched,
      isPendingRegister,
      name,
    ],
  );

  const emailState = !isEmailFilled
    ? "default"
    : emailErrorMessage
      ? "error"
      : isEmailValid
        ? "success"
        : isDebouncedEmailFilled && !isDebouncedEmailValid
          ? "error"
          : "active";
  const passwordConfirmState =
    passwordConfirm.length === 0
      ? "default"
      : isPasswordMatched
        ? "success"
        : "error";
  const codeState = verificationErrorMessage
    ? "error"
    : isCodeVerified
      ? "success"
      : code
        ? "active"
        : "default";

  const clearMessages = () => {
    setFeedbackMessage("");
    setErrorMessage("");
    setEmailFeedbackMessage("");
    setEmailErrorMessage("");
    setVerificationErrorMessage("");
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
          setEmailFeedbackMessage("인증번호를 전송했습니다.");
        },
        onError: (error) => {
          setEmailErrorMessage(
            getSendVerificationCodeErrorMessage(error.message),
          );
        },
      },
    );
  };

  const handleVerifyCode = () => {
    if (!canVerifyCode) return;

    clearMessages();

    if (!isValidVerificationCode(code.trim())) {
      setVerificationErrorMessage("인증번호는 6자리 숫자여야 합니다.");
      return;
    }

    verifyCode(
      { email: email.trim(), code: code.trim() },
      {
        onSuccess: () => {
          setIsCodeVerified(true);
        },
        onError: (error) => {
          setIsCodeVerified(false);
          setVerificationErrorMessage(
            getVerificationErrorMessage(error.message),
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
        roleCode,
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
    <AuthShell>
      <div className="flex flex-1 flex-col">
        <form
          id={SIGNUP_FORM_ID}
          className="flex flex-col px-4 pt-4.5 pb-24"
          onSubmit={handleSubmit}
        >
          <button
            type="button"
            aria-label="이전 페이지"
            onClick={() => router.back()}
            className="mb-7.5 flex h-7 w-7 cursor-pointer items-center justify-center"
          >
            <Image
              alt=""
              aria-hidden="true"
              height={20}
              src={leftIcon}
              unoptimized
              width={20}
            />
          </button>

          <AuthTitle title="회원가입" className="mb-8.5 ml-2.25" />

          <MemberInfoSection
            roleCode={roleCode}
            onRoleCodeChange={setRoleCode}
            name={name}
            onNameChange={(nextName) => {
              setName(nextName);
              clearMessages();
            }}
            organizationId={organizationId}
            onOrganizationIdChange={(nextOrganizationId) => {
              setOrganizationId(nextOrganizationId);
              clearMessages();
            }}
            organizations={organizations}
            isPendingOrganizations={isPendingOrganizations}
            isErrorOrganizations={isErrorOrganizations}
            isOrganizationDropdownOpen={isOrganizationDropdownOpen}
            onOrganizationDropdownOpenChange={setIsOrganizationDropdownOpen}
            email={email}
            onEmailChange={(nextEmail) => {
              setEmail(nextEmail);
              setIsCodeSent(false);
              setIsCodeVerified(false);
              clearMessages();
            }}
            emailState={emailState}
            emailErrorMessage={emailErrorMessage}
            emailFeedbackMessage={emailFeedbackMessage}
            canRequestCode={canRequestCode}
            isPendingSendVerificationCode={isPendingSendVerificationCode}
            isCodeSent={isCodeSent}
            onRequestCode={handleRequestCode}
          />

          <VerificationCodeSection
            code={code}
            onCodeChange={(nextCode) => {
              setCode(nextCode);
              setIsCodeVerified(false);
              clearMessages();
            }}
            codeState={codeState}
            verificationErrorMessage={verificationErrorMessage}
            canVerifyCode={canVerifyCode}
            isPendingVerifyCode={isPendingVerifyCode}
            onVerifyCode={handleVerifyCode}
          />

          {isCodeVerified ? (
            <PasswordSection
              password={password}
              onPasswordChange={(nextPassword) => {
                setPassword(nextPassword);
                clearMessages();
              }}
              passwordConfirm={passwordConfirm}
              onPasswordConfirmChange={(nextPasswordConfirm) => {
                setPasswordConfirm(nextPasswordConfirm);
                clearMessages();
              }}
              passwordConfirmState={passwordConfirmState}
            />
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

        <BottomActionButton
          type="submit"
          form={SIGNUP_FORM_ID}
          disabled={!canSubmit}
          fixed
        >
          {isPendingRegister ? "가입 중" : "가입하기"}
        </BottomActionButton>
      </div>
    </AuthShell>
  );
}
