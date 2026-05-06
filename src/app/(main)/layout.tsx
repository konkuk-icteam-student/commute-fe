export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="w-full max-w-150 shadow-[0_0_10px_4px_rgba(0,0,0,0.04)]">
      {children}
    </div>
  );
}
