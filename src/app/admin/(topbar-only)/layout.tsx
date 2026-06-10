import { AdminLayout } from "@/components/layout";
import { ADMIN_HEADER_USER } from "@/constants/admin";

export default function WithoutSidebarAdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AdminLayout
      adminUser={ADMIN_HEADER_USER}
      showBackButton
      variant="topbar"
    >
      {children}
    </AdminLayout>
  );
}
