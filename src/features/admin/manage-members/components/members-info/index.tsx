import MembersInfoHeader from "../members-info-header";
import MembersInfoTable from "../members-info-table";

export default function MembersInfo() {
  return (
    <div className="flex flex-col gap-6 rounded-xl border border-[#D1D1D1] bg-white p-8">
      <MembersInfoHeader />
      <MembersInfoTable />
    </div>
  );
}
