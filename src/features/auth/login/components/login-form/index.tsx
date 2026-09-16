"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useMemo, useState } from "react";
import { useLoginMutation } from "@/apis/auth";
import { ROLE_CODE } from "@/apis/token-storage";
import { Button, Input } from "@/components/ui";
import { AuthTitle } from "@/features/auth/components";
import { hasText } from "@/features/auth/utils/validation";

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const { login, isPendingLogin } = useLoginMutation();

  const canSubmit = useMemo(
    () => hasText(email) && hasText(password) && !isPendingLogin,
    [email, isPendingLogin, password],
  );

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!canSubmit) {
      return;
    }

    setErrorMessage("");
    login(
      { email: email.trim(), password },
      {
        onSuccess: (details) => {
          router.replace(details.roleCode === ROLE_CODE.ADMIN ? "/admin" : "/");
        },
        onError: (error) => {
          setErrorMessage(
            error.message || "로그인에 실패했습니다. 다시 시도해 주세요.",
          );
        },
      },
    );
  };

  return (
    <form className="flex flex-col px-6 pt-27.25" onSubmit={handleSubmit}>
      <AuthTitle title="로그인" />

      <div className="flex flex-col gap-3.75">
        <Input
          type="email"
          placeholder="이메일"
          value={email}
          onChange={(event) => {
            setEmail(event.target.value);
            setErrorMessage("");
          }}
          autoComplete="email"
        />

        <Input
          type="password"
          placeholder="비밀번호"
          value={password}
          onChange={(event) => {
            setPassword(event.target.value);
            setErrorMessage("");
          }}
          autoComplete="current-password"
        />
      </div>

      {errorMessage ? (
        <p className="mt-3 text-sm font-medium text-[#FF5B4D]">
          {errorMessage}
        </p>
      ) : null}

      <div className="mt-3 flex items-center justify-between">
        <Link
          href="/signup"
          className="ml-3.5 text-[14px] font-normal tracking-[0.21px] underline underline-offset-2"
          style={{
            color: "rgba(38, 99, 235, 0.8)",
            textDecorationLine: "underline",
            textDecorationColor: "rgba(38, 99, 235, 0.8)",
          }}
        >
          회원가입
        </Link>
        <Button type="submit" disabled={!canSubmit}>
          {isPendingLogin ? "로그인 중" : "로그인"}
        </Button>
      </div>
    </form>
  );
}
