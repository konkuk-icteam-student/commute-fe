import { AdminLayout } from "@/components/layout";
import { AuthRouteGuard } from "@/features/auth/components";

export default function WithoutSidebarAdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthRouteGuard mode="auth-only">
      <AdminLayout showBackButton variant="topbar">
        {children}
      </AdminLayout>
    </AuthRouteGuard>
  );
}
