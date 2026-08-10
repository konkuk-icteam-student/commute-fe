import { Modal } from "@/components/ui";

interface ScheduleErrorModalProps {
  message: string;
  onClose: () => void;
}

// 조회·제출이 실패했을 때 서버가 내려준 문구를 그대로 보여 준다.
// message가 비어 있으면 열리지 않는다.
export default function ScheduleErrorModal({
  message,
  onClose,
}: ScheduleErrorModalProps) {
  return (
    <Modal
      open={message.length > 0}
      title="알림"
      buttonText="확인"
      onButtonClick={onClose}
    >
      <p className="text-center text-sm leading-5 font-medium whitespace-pre-line">
        {message}
      </p>
    </Modal>
  );
}
