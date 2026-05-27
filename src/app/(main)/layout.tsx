import { BottomNav } from "@/components/layout";

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="relative min-h-screen w-full max-w-150 bg-white shadow-[0_0_10px_4px_rgba(0,0,0,0.04)]">
      {children}
      <BottomNav />
    </div>
  );
}
