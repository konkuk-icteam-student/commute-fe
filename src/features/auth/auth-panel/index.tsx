"use client";

import { useState } from "react";

import { AuthMode } from "../types";
import AuthHeader from "../auth-header";
import LoginForm from "../login-form";
import SignupForm from "../signup-form";

export default function AuthPanel() {
  const [authMode, setAuthMode] = useState<AuthMode>("login");

  return (
    <>
      <AuthHeader authMode={authMode} handleChangeForm={setAuthMode} />
      {authMode === "login" ? <LoginForm /> : <SignupForm />}
    </>
  );
}
