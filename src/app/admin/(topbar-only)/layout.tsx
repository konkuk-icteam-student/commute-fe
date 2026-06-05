import { AdminLayout } from "@/components/layout";

export default function WithoutSidebarAdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AdminLayout showBackButton variant="topbar">
      {children}
    </AdminLayout>
  );
}
