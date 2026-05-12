import { BottomNav } from "@/components/layout";

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="relative min-h-screen w-full max-w-150">
      {children}
      <BottomNav />
    </div>
  );
}
