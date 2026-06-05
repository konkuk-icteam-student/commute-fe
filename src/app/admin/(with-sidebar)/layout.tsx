import { AdminLayout } from "@/components/layout";

export default function WithSidebarAdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <AdminLayout variant="with-sidebar">{children}</AdminLayout>;
}
