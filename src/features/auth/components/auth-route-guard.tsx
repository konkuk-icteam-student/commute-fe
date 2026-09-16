"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useSyncExternalStore } from "react";
import {
  getRoleCode,
  getTokenExpiresAt,
  type RoleCode,
  subscribeAuthStorageChange,
} from "@/apis/token-storage";
import {
  hasUsableStoredSession,
  normalizeExpiresAt,
} from "@/features/auth/utils/session";

interface AuthRouteGuardProps {
  children: React.ReactNode;
  mode: "auth-only" | "guest-only";
  requiredRole?: RoleCode;
}

const LOGIN_ROUTE = "/login";
const HOME_ROUTE = "/";
const PENDING_SNAPSHOT = "pending:";

const getServerSnapshot = () => PENDING_SNAPSHOT;

const getAuthSnapshot = () => {
  const hasSession = hasUsableStoredSession();

  return `${hasSession ? "authenticated" : "guest"}:${getRoleCode() ?? ""}`;
};

const getSessionExpirationDelay = () => {
  const expiresAt = getTokenExpiresAt();

  if (!expiresAt) {
    return null;
  }

  const expiresAtTime = normalizeExpiresAt(expiresAt);

  if (expiresAtTime === null) {
    return 0;
  }

  return Math.max(expiresAtTime - Date.now(), 0);
};

const subscribe = (onStoreChange: () => void) => {
  let timeoutId: number | null = null;

  const clearExpirationTimer = () => {
    if (timeoutId === null) {
      return;
    }

    window.clearTimeout(timeoutId);
    timeoutId = null;
  };

  const scheduleExpirationTimer = () => {
    clearExpirationTimer();

    const delay = getSessionExpirationDelay();

    if (delay === null) {
      return;
    }

    timeoutId = window.setTimeout(() => {
      timeoutId = null;
      onStoreChange();
    }, delay);
  };

  const handleAuthStorageChange = () => {
    scheduleExpirationTimer();
    onStoreChange();
  };

  const unsubscribeAuthStorageChange =
    subscribeAuthStorageChange(handleAuthStorageChange);
  scheduleExpirationTimer();

  return () => {
    clearExpirationTimer();
    unsubscribeAuthStorageChange();
  };
};

export default function AuthRouteGuard({
  children,
  mode,
  requiredRole,
}: AuthRouteGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const authSnapshot = useSyncExternalStore(
    subscribe,
    getAuthSnapshot,
    getServerSnapshot,
  );
  const [sessionState, roleCode] = authSnapshot.split(":");
  const hasSession =
    sessionState === "pending" ? null : sessionState === "authenticated";
  const shouldRedirectToLogin = mode === "auth-only" && hasSession === false;
  const shouldRedirectToHome =
    mode === "guest-only" && hasSession === true && pathname !== HOME_ROUTE;
  const shouldRedirectByRole =
    mode === "auth-only" &&
    hasSession === true &&
    requiredRole !== undefined &&
    roleCode !== requiredRole;

  useEffect(() => {
    if (shouldRedirectToLogin) {
      router.replace(LOGIN_ROUTE);
      return;
    }

    if (shouldRedirectToHome) {
      router.replace(HOME_ROUTE);
      return;
    }

    if (shouldRedirectByRole) {
      router.replace(HOME_ROUTE);
    }
  }, [
    router,
    shouldRedirectByRole,
    shouldRedirectToHome,
    shouldRedirectToLogin,
  ]);

  if (
    hasSession === null ||
    shouldRedirectToLogin ||
    shouldRedirectToHome ||
    shouldRedirectByRole
  ) {
    return null;
  }

  return children;
}
