import { AdminLayout } from "@/components/layout";
import { ROLE_CODE } from "@/apis/token-storage";
import { AuthRouteGuard } from "@/features/auth/components";

export default function WithoutSidebarAdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthRouteGuard mode="auth-only" requiredRole={ROLE_CODE.ADMIN}>
      <AdminLayout showBackButton variant="topbar">
        {children}
      </AdminLayout>
    </AuthRouteGuard>
  );
}
