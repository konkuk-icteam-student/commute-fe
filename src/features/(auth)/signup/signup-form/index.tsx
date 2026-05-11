"use client";

import { ChangeEvent, useState } from "react";

import { Button, InputBar } from "@/components/ui";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function isValidEmail(email: string) {
  return EMAIL_PATTERN.test(email.trim());
}

export default function SignupForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [hasRequestedCode, setHasRequestedCode] = useState(false);

  const handleChangeName = (
    e: ChangeEvent<HTMLInputElement, HTMLInputElement>,
  ) => {
    setName(e.target.value);
  };

  const handleChangeEmail = (
    e: ChangeEvent<HTMLInputElement, HTMLInputElement>,
  ) => {
    setEmail(e.target.value);
  };

  const handleChangeVerificationCode = (
    e: ChangeEvent<HTMLInputElement, HTMLInputElement>,
  ) => {
    setVerificationCode(e.target.value);
  };

  const emailIsValid = isValidEmail(email);
  const requestCodeDisabled = name.trim() === "" || !emailIsValid;
  const verifyCodeDisabled = verificationCode.trim() === "";

  const handleRequestCode = () => {
    if (requestCodeDisabled) return;

    setHasRequestedCode(true);
    console.log("인증번호 받기 버튼 클릭");
  };

  const handleVerifyCode = () => {
    if (verifyCodeDisabled) return;

    console.log("인증 확인 버튼 클릭");
  };

  return (
    <section className="flex flex-col gap-4">
      <div className="flex flex-col gap-3">
        <span className="text-sm font-medium text-[#434343]">
          회원 정보 입력해 주세요
        </span>
        <InputBar
          type="text"
          placeholder="이름"
          value={name}
          onChange={handleChangeName}
        />
        <div className="relative">
          <InputBar
            type="email"
            placeholder="이메일"
            value={email}
            onChange={handleChangeEmail}
            className={emailIsValid ? "pr-12" : undefined}
          />
          {emailIsValid ? (
            <span
              aria-label="올바른 이메일 형식"
              className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-2xl leading-none text-[#2076FF]"
            >
              ✓
            </span>
          ) : null}
        </div>
      </div>

      <div className="flex justify-end">
        <Button onClick={handleRequestCode} disabled={requestCodeDisabled}>
          인증번호 받기
        </Button>
      </div>

      {hasRequestedCode ? (
        <div className="mt-6 flex flex-col gap-3">
          <span className="text-sm font-medium text-[#434343]">
            인증번호를 입력해 주세요
          </span>
          <InputBar
            type="text"
            placeholder="인증번호"
            value={verificationCode}
            onChange={handleChangeVerificationCode}
          />
          <div className="flex justify-end">
            <Button onClick={handleVerifyCode} disabled={verifyCodeDisabled}>
              인증 확인
            </Button>
          </div>
        </div>
      ) : null}
    </section>
  );
}
