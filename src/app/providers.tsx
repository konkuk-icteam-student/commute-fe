"use client";

import { useState, type ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { AuthNoticeModal } from "@/components/layout";

interface ProvidersProps {
  children: ReactNode;
}

export default function Providers({ children }: ProvidersProps) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* 인증·권한 안내는 화면과 무관하게 뜬다. 어느 경로에서든 보이도록 루트에 둔다. */}
      <AuthNoticeModal />
    </QueryClientProvider>
  );
}
