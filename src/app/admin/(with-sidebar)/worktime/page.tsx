import Link from "next/link";

export default function WorktimePage() {
  return (
    <div className="flex-1 px-10 py-8">
      <div className="flex gap-3">
        <Link
          href="/admin/worktime/detail"
          className="flex h-10 items-center justify-center rounded-md bg-[#2874F0] px-5 text-sm font-bold text-white"
        >
          시간표 자세히 보기
        </Link>
        <Link
          href="/admin/worktime/review"
          className="flex h-10 items-center justify-center rounded-md border border-[#2874F0] bg-white px-5 text-sm font-bold text-[#2874F0]"
        >
          근로시간 수정요청
        </Link>
      </div>
    </div>
  );
}
