import { AuthRouteGuard } from "@/features/auth/components";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthRouteGuard mode="guest-only">
      <div className="flex min-h-screen w-full justify-center bg-white">
        <div className="w-full max-w-100">{children}</div>
      </div>
    </AuthRouteGuard>
  );
}
