import Image from "next/image";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui";
import icLeft from "@/assets/icons/common/ic_left.svg";

interface ScheduleHeaderProps {
  mode?: "view" | "edit" | "apply";
  year: number;
  month: number;
  applyTargetMonth?: { year: number; month: number };
  // 신청 기간 조회로 정해진다. 아직 못 받았으면 열지 않는 쪽이 안전하다.
  isApplyAvailable?: boolean;
  isEditAvailable?: boolean;
}

export default function ScheduleHeader({
  mode = "view",
  year,
  month,
  applyTargetMonth,
  isApplyAvailable = false,
  isEditAvailable = false,
}: ScheduleHeaderProps) {
  const router = useRouter();

  const handleToGoBack = () => {
    router.back();
  };

  const handleToEdit = () => {
    router.push("/schedule-edit");
  };
  const handleToApply = () => {
    const query = applyTargetMonth
      ? `?year=${applyTargetMonth.year}&month=${applyTargetMonth.month}`
      : "";

    router.push(`/schedule-apply${query}`);
  };

  return mode === "view" ? (
    <header className="flex flex-col gap-1.5 pl-4">
      <h2 className="text-base leading-5 font-medium text-[#1D4ED8]">
        {year}년 {month}월
      </h2>
      <div className="flex flex-row items-center justify-between">
        <h1 className="text-xl font-bold text-[#1A2236]">근로 시간표</h1>
        <div className="flex flex-row items-center gap-2">
          <Button size="sm" onClick={handleToEdit} disabled={!isEditAvailable}>
            수정 요청
          </Button>
          <Button
            size="sm"
            onClick={handleToApply}
            disabled={!isApplyAvailable}
          >
            근로 신청
          </Button>
        </div>
      </div>
    </header>
  ) : (
    <header className="flex flex-row items-start gap-1.5 pl-1">
      <button className="cursor-pointer" type="button" onClick={handleToGoBack}>
        <Image src={icLeft} alt="이전 페이지" />
      </button>
      <div className="flex flex-col gap-1">
        <h1 className="text-xl leading-5 font-bold text-[#1A2236]">
          {mode === "apply" ? "근로시간 신청" : "근로시간 수정 요청"}
        </h1>
        <h2 className="text-base leading-5 font-medium text-[#1D4ED8]">
          {year}년 {month}월
        </h2>
      </div>
    </header>
  );
}
