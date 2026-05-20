"use client";

import { useState } from "react";

import { Alert, Button, Modal, Toast, Toggle } from "@/components/ui";

type DemoOverlay = "alert" | "modal" | "toast" | null;

export default function HomeScreen() {
  const [isChecked, setIsChecked] = useState(false);
  const [activeOverlay, setActiveOverlay] = useState<DemoOverlay>(null);

  const closeOverlay = () => setActiveOverlay(null);

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

      <div className="grid gap-3">
        <Button size="lg" onClick={() => setActiveOverlay("alert")}>
          Alert 예시 보기
        </Button>
        <Button size="lg" onClick={() => setActiveOverlay("modal")}>
          Modal 예시 보기
        </Button>
        <Button size="lg" onClick={() => setActiveOverlay("toast")}>
          Toast 예시 보기
        </Button>
      </div>

      <Alert
        open={activeOverlay === "alert"}
        title="페이지를 나가시겠습니까?"
        message={
          "작성 중인 내용은 저장되지 않으며,\n변경 사항이 모두 사라집니다."
        }
        cancelText="나가기"
        confirmText="계속 작성하기"
        onCancel={closeOverlay}
        onConfirm={closeOverlay}
      />

      <Modal
        open={activeOverlay === "modal"}
        title="신청 결과"
        buttonText="확인"
        onButtonClick={closeOverlay}
      >
        <div className="mt-8">
          <div>
            <p className="align-middle text-sm leading-none font-medium tracking-[0.21px] text-[#51A8FF]">
              신청 성공 6건
            </p>
            <ul className="mt-4.75 flex min-h-16.75 w-60.75 flex-col gap-2 text-sm leading-5 font-medium tracking-[0.21px]">
              <li>4월 6일(월) 13:00 - 14:30 (1.5h)</li>
              <li>4월 6일(월) 13:00 - 14:30 (1.5h)</li>
              <li>4월 6일(월) 13:00 - 14:30 (1.5h)</li>
              <li>4월 6일(월) 13:00 - 14:30 (1.5h)</li>
              <li>4월 6일(월) 13:00 - 14:30 (1.5h)</li>
              <li>4월 6일(월) 13:00 - 14:30 (1.5h)</li>
              <li>4월 6일(월) 13:00 - 14:30 (1.5h)</li>
            </ul>
          </div>

          <div className="mt-8">
            <p className="align-middle text-sm leading-none font-medium tracking-[0.21px] text-[#F24822]">
              신청 실패 2건
            </p>
            <ul className="mt-4.75 flex min-h-16.75 w-60.75 flex-col gap-2 text-sm leading-5 font-medium tracking-[0.21px]">
              <li>4월 6일(월) 13:00 - 14:30 (1.5h)</li>
              <li>4월 6일(월) 13:00 - 14:30 (1.5h)</li>
            </ul>
          </div>
        </div>
      </Modal>

      <Toast
        open={activeOverlay === "toast"}
        message="제출이 완료되었습니다."
        onDismiss={closeOverlay}
        onClick={closeOverlay}
      />
    </div>
  );
}
