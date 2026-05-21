import { useRouter } from "next/navigation";

import { Button } from "@/components/ui";
import icLeft from "@/assets/icons/common/ic_left.svg";
import Image from "next/image";

interface ScheduleHeaderProps {
  type?: "view" | "edit" | "apply";
  year: number;
  month: number;
}

export default function ScheduleHeader({
  type = "view",
  year,
  month,
}: ScheduleHeaderProps) {
  const router = useRouter();

  const handleToGoBack = () => {
    router.push("/schedule");
  };

  const handleToEdit = () => {
    router.push("/schedule-edit");
  };
  const handleToApply = () => {
    router.push("/schedule-apply");
  };

  return type === "view" ? (
    <header className="flex flex-col gap-1.5 pl-4">
      <h2 className="text-base leading-5 font-medium text-[#1D4ED8]">
        {year}년 {month}월
      </h2>
      <div className="flex flex-row items-center justify-between">
        <h1 className="text-xl font-bold text-[#1A2236]">근로 시간표</h1>
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
  ) : (
    <header className="flex flex-row items-start gap-1.5 pl-1">
      <button className="cursor-pointer" type="button" onClick={handleToGoBack}>
        <Image src={icLeft} alt="이전 페이지" />
      </button>
      <div className="flex flex-col gap-1">
        <h1 className="text-xl leading-5 font-bold text-[#1A2236]">
          {type === "apply" ? "근로시간 신청" : "근로시간 수정 요청"}
        </h1>
        <h2 className="text-base leading-5 font-medium text-[#1D4ED8]">
          {year}년 {month}월
        </h2>
      </div>
    </header>
  );
}
