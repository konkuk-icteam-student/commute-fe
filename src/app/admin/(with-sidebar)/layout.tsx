import { AdminLayout } from "@/components/layout";
import { ADMIN_HEADER_USER } from "@/constants/admin";

export default function WithSidebarAdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AdminLayout adminUser={ADMIN_HEADER_USER} variant="with-sidebar">
      {children}
    </AdminLayout>
  );
}
