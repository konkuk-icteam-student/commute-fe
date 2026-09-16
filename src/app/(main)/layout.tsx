import { BottomNav } from "@/components/layout";
import { AuthRouteGuard } from "@/features/auth/components";

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthRouteGuard mode="auth-only">
      <div className="relative min-h-screen w-full max-w-150 bg-white shadow-[0_0_10px_4px_rgba(0,0,0,0.04)]">
        {children}
        <BottomNav />
      </div>
    </AuthRouteGuard>
  );
}
