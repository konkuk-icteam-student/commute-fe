"use client";

import { Button } from "@/components/ui";

export default function HomeScreen() {
  return (
    <div className="w-full px-5">
      {/* TODO: 버튼 컴포넌트 테스트용 이므로 삭제 예정 */}
      <Button size="lg" handleClick={() => console.log("버튼 클릭")}>
        근로 신청
      </Button>
    </div>
  );
}
