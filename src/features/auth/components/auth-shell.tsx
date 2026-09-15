interface AuthShellProps {
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export default function AuthShell({ children, footer }: AuthShellProps) {
  return (
    <main className="flex min-h-screen flex-col px-6 pt-27.25 pb-5.75">
      <section className="flex-1">{children}</section>
      {footer ? <div className="pt-6">{footer}</div> : null}
    </main>
  );
}
