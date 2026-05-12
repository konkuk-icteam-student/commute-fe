"use client";

import { useState } from "react";

import { Button, Toggle } from "@/components/ui";

export default function HomeScreen() {
  const [isChecked, setIsChecked] = useState(false);
  return (
    <div className="flex w-full flex-col gap-5 px-5">
      {/* TODO: 버튼 컴포넌트 테스트용 이므로 삭제 예정 */}
      <Button size="lg" onClick={() => console.log("버튼 클릭")}>
        근로 신청
      </Button>
      <Toggle
        checked={isChecked}
        onCheckedChange={setIsChecked}
        label="테스트"
      />
    </div>
  );
}
