import { Modal } from "@/components/ui";

import { formatScheduleChangeHistorySlot } from "../../utils";

interface ApplyResultModalProps {
  open: boolean;
  handleClose: () => void;
  // 전부 실패하면 서버가 구간 목록 없이 메시지만 내려준다. 그때는 이 문구만 보여준다.
  message?: string;
  successList: { start: string; end: string }[];
  failureList: { start: string; end: string }[];
}

export default function ApplyResultModal({
  open,
  handleClose,
  message,
  successList,
  failureList,
}: ApplyResultModalProps) {
  if (message) {
    return (
      <Modal open={open} title="신청 결과" onButtonClick={handleClose}>
        <span className="mt-4 text-center text-sm font-medium text-[#1A2236]">
          {message}
        </span>
      </Modal>
    );
  }

  return (
    <Modal open={open} title="신청 결과" onButtonClick={handleClose}>
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
