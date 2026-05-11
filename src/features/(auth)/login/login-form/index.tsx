"use client";

import { ChangeEvent, useState } from "react";
import Link from "next/link";

import { Button, InputBar } from "@/components/ui";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleChangeEmail = (
    e: ChangeEvent<HTMLInputElement, HTMLInputElement>,
  ) => {
    setEmail(e.target.value);
  };

  const handleChangePassword = (
    e: ChangeEvent<HTMLInputElement, HTMLInputElement>,
  ) => {
    setPassword(e.target.value);
  };

  const handleLogin = () => {
    console.log("로그인 버튼 클릭");
  };

  const disabled = email.trim() === "" || password.trim() === "";

  return (
    <section className="flex flex-col gap-4">
      <InputBar
        type="email"
        placeholder="이메일"
        value={email}
        onChange={handleChangeEmail}
      />
      <InputBar
        type="password"
        placeholder="비밀번호"
        value={password}
        onChange={handleChangePassword}
      />
      <div className="flex flex-row items-center justify-between pl-4">
        <Link href={"/signup"}>
          <span className="text-sm text-[#2076FF] underline underline-offset-2">
            회원가입
          </span>
        </Link>
        <Button onClick={handleLogin} disabled={disabled}>
          로그인
        </Button>
      </div>
    </section>
  );
}
