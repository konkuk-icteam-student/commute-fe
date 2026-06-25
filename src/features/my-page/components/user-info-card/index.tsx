interface UserInfoCardProps {
  name: string;
  role: string;
  department: string;
  studentId: string;
  major: string;
}

export default function UserInfoCard({
  name,
  role,
  department,
  studentId,
  major,
}: UserInfoCardProps) {
  return (
    <section className="rounded-[20px] border-[0.5px] border-[#DDE3EF] bg-white px-[11.5px] py-5 shadow-[0_2px_8px_0_#F3F2F2]">
      <div className="flex items-center justify-between px-[9.5px]">
        <div className="flex min-w-0 items-baseline gap-1">
          <strong className="text-base leading-6 font-bold text-[#1A2236]">
            {name}
          </strong>
          <span className="text-xs leading-4 font-medium text-[#8892A6]">
            님
          </span>
        </div>
        <span className="flex h-5.25 w-17.5 shrink-0 items-center justify-center rounded-full bg-[#DBEAFE] text-[11px] font-bold tracking-[0.015em] text-[#5A7BC8]">
          {role}
        </span>
      </div>

      <dl className="mt-3 flex flex-col gap-3 border-t-[0.5px] border-[#DDE3EF] px-3 pt-4.5">
        <div className="flex items-center justify-between">
          <dt className="text-[12px] font-bold text-[#8892A6]">부서</dt>
          <dd className="truncate text-right text-[12px] font-bold text-[#1A2236]">
            {department}
          </dd>
        </div>
        <div className="flex items-center justify-between">
          <dt className="text-[12px] font-bold text-[#8892A6]">학번</dt>
          <dd className="truncate text-right text-[12px] font-bold text-[#1A2236]">
            {studentId}
          </dd>
        </div>
        <div className="mb-2 flex items-center justify-between">
          <dt className="text-[12px] font-bold text-[#8892A6]">학과</dt>
          <dd className="truncate text-right text-[12px] font-bold text-[#1A2236]">
            {major}
          </dd>
        </div>
      </dl>
    </section>
  );
}
