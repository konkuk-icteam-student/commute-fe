import { Modal } from "@/components/ui";

import { formatScheduleChangeHistorySlot } from "../../utils";

interface ApplyResultModalProps {
  open: boolean;
  handleClose: () => void;
  successList: { start: string; end: string }[];
  failureList: { start: string; end: string }[];
}

export default function ApplyResultModal({
  open,
  handleClose,
  successList,
  failureList,
}: ApplyResultModalProps) {
  return (
    <Modal open={open} title="신청 결과" onButtonClick={handleClose}>
      {/* TODO: 추후 더미 데이터 대신 서버 응답으로 수정 */}
      <div className="mt-4 flex w-full flex-col gap-6">
        {successList.length > 0 && (
          <section className="flex w-full flex-col gap-3">
            <h3 className="text-sm font-bold text-[#51A8FF]">
              신청 성공 {successList.length}건
            </h3>
            <div className="flex max-h-20 flex-col gap-2 overflow-auto">
              {successList.map((item, index) => (
                <span
                  key={`${item}-${index}`}
                  className="text-sm font-medium text-[#1A2236]"
                >
                  •{" "}
                  {formatScheduleChangeHistorySlot({
                    start: item.start,
                    end: item.end,
                  })}
                </span>
              ))}
            </div>
          </section>
        )}
        {failureList.length > 0 && (
          <section className="flex w-full flex-col gap-3">
            <h3 className="text-sm font-bold text-[#FD7171]">
              신청 실패 {failureList.length}건
            </h3>
            <div className="flex max-h-20 flex-col gap-2 overflow-auto">
              {failureList.map((item, index) => (
                <span
                  key={`${item}-${index}`}
                  className="text-sm font-medium text-[#1A2236]"
                >
                  •{" "}
                  {formatScheduleChangeHistorySlot({
                    start: item.start,
                    end: item.end,
                  })}
                </span>
              ))}
            </div>
          </section>
        )}
      </div>
    </Modal>
  );
}
