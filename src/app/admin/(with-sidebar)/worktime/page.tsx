// 시간표에 대해서 일반 사용자에서는 schedule이고 관리자에서는 work time으로 네이밍함. 추후 하나로 통일 예정

import WorktimeScreen from "@/screens/admin/worktime";

export default function WorktimePage() {
  return (
    <div className="flex-1 py-8">
      <WorktimeScreen />
    </div>
  );
}
