import Link from "next/link";

export default function WorktimeDetailPage() {
  return (
    <div className="flex-1 px-10 py-8">
      <Link
        href="/admin/worktime/edit"
        className="flex h-10 w-fit items-center justify-center rounded-md bg-[#2874F0] px-5 text-sm font-bold text-white"
      >
        편집하기
      </Link>
    </div>
  );
}
