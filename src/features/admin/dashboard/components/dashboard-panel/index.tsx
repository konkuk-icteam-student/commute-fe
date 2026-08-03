import DashboardSectionHeader from "../dashboard-section-header";

export default function DashboardPanel({
  arrowHref,
  children,
  title,
}: {
  arrowHref: string;
  children: React.ReactNode;
  title: string;
}) {
  const headingId = `${arrowHref.replaceAll("/", "-").replace(/^-/, "")}-heading`;

  return (
    <section
      aria-labelledby={headingId}
      className="rounded-xl border border-[#DDE3EF] bg-[#F4F5F7]"
    >
      <DashboardSectionHeader
        title={title}
        arrowHref={arrowHref}
        headingId={headingId}
      />
      {children}
    </section>
  );
}
