import { AdminLayout } from "@/components/layout";
import { ROLE_CODE } from "@/apis/token-storage";
import { AuthRouteGuard } from "@/features/auth/components";

export default function WithSidebarAdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthRouteGuard mode="auth-only" requiredRole={ROLE_CODE.ADMIN}>
      <AdminLayout variant="with-sidebar">{children}</AdminLayout>
    </AuthRouteGuard>
  );
}
