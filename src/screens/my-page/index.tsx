import {
  MenuCard,
  MY_PAGE_USER,
  MY_PAGE_WORK_SUMMARIES,
  UserInfoCard,
  WorkSummaryCard,
} from "@/features/my-page";

export default function MyPageScreen() {
  return (
    <section className="min-h-screen w-full bg-white px-4 pt-10.75 pb-20">
      <h1 className="px-3 text-[20px] leading-[19.5px] font-bold text-[#1A2236]">
        마이페이지
      </h1>

      <div className="mt-6">
        <UserInfoCard
          name={MY_PAGE_USER.name}
          role={MY_PAGE_USER.role}
          department={MY_PAGE_USER.department}
          studentId={MY_PAGE_USER.studentId}
          major={MY_PAGE_USER.major}
        />
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3">
        {MY_PAGE_WORK_SUMMARIES.map((summary) => (
          <WorkSummaryCard
            key={summary.title}
            title={summary.title}
            currentHours={summary.currentHours}
            totalHours={summary.totalHours}
          />
        ))}
      </div>

      <div className="mt-6">
        <MenuCard />
      </div>

      <button
        className="mx-auto mt-7 block cursor-pointer text-[10px] leading-4.5 font-medium text-[#FD7171] underline underline-offset-2"
        type="button"
      >
        회원 탈퇴
      </button>
    </section>
  );
}
