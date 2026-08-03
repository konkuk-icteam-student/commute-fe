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
  return (
    <section className="rounded-xl border border-[#DDE3EF] bg-[#F4F5F7]">
      <DashboardSectionHeader title={title} arrowHref={arrowHref} />
      {children}
    </section>
  );
}
