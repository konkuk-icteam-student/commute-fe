import { useRouter } from "next/navigation";

import { Button } from "@/components/ui";

interface ScheduleHeaderProps {
  year: number;
  month: number;
}

export default function ScheduleHeader({ year, month }: ScheduleHeaderProps) {
  const router = useRouter();

  const handleToEdit = () => {
    router.push("/schedule-edit");
  };
  const handleToApply = () => {
    router.push("/schedule-apply");
  };

  return (
    <header className="flex flex-col gap-1.5 pl-4">
      <h2 className="text-base leading-5 font-medium text-[#1D4ED8]">
        {year}년 {month}월
      </h2>
      <div className="flex flex-row items-center justify-between">
        <h1 className="text-xl font-bold text-[#253c75]">근로 시간표</h1>
        <div className="flex flex-row items-center gap-2">
          <Button size="sm" onClick={handleToEdit}>
            수정 요청
          </Button>
          {/* TODO: 근로 신청은 신청 기간이 아니면 disabled */}
          <Button size="sm" onClick={handleToApply} disabled={false}>
            근로 신청
          </Button>
        </div>
      </div>
    </header>
  );
}
