"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useSyncExternalStore } from "react";
import { hasUsableStoredSession } from "@/features/auth/utils/session";

interface AuthRouteGuardProps {
  children: React.ReactNode;
  mode: "auth-only" | "guest-only";
}

const LOGIN_ROUTE = "/login";
const HOME_ROUTE = "/";
const subscribe = () => () => {};
const getServerSnapshot = () => null;
const getSessionSnapshot = () => hasUsableStoredSession();

export default function AuthRouteGuard({
  children,
  mode,
}: AuthRouteGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const hasSession = useSyncExternalStore(
    subscribe,
    getSessionSnapshot,
    getServerSnapshot,
  );
  const shouldRedirectToLogin = mode === "auth-only" && hasSession === false;
  const shouldRedirectToHome =
    mode === "guest-only" && hasSession === true && pathname !== HOME_ROUTE;

  useEffect(() => {
    if (shouldRedirectToLogin) {
      router.replace(LOGIN_ROUTE);
      return;
    }

    if (shouldRedirectToHome) {
      router.replace(HOME_ROUTE);
    }
  }, [router, shouldRedirectToHome, shouldRedirectToLogin]);

  if (hasSession === null || shouldRedirectToLogin || shouldRedirectToHome) {
    return null;
  }

  return children;
}
