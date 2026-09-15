interface AuthShellProps {
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export default function AuthShell({ children, footer }: AuthShellProps) {
  return (
    <main className="flex min-h-screen flex-col pb-5.75">
      <section className="flex min-h-full flex-1 flex-col">{children}</section>
      {footer ? <div className="pt-6">{footer}</div> : null}
    </main>
  );
}
