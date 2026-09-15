import { AdminLayout } from "@/components/layout";
import { AuthRouteGuard } from "@/features/auth/components";

export default function WithSidebarAdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthRouteGuard mode="auth-only">
      <AdminLayout variant="with-sidebar">{children}</AdminLayout>
    </AuthRouteGuard>
  );
}
