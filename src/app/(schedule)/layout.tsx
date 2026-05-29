export default function ScheduleLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="relative min-h-screen w-full max-w-150 shadow-[0_0_10px_4px_rgba(0,0,0,0.04)]">
      {children}
    </div>
  );
}
