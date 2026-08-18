import type { AdminWorkScheduleUser } from "@/apis/work-schedules";
import { Alert } from "@/components/ui";

interface WorktimeDeleteMemberAlertProps {
  isOpen: boolean;
  date: string;
  start: string;
  end: string;
  user: AdminWorkScheduleUser | null;
  handleClose: () => void;
  handleDelete: (scheduleId: number) => void;
}

export default function WorktimeDeleteMemberAlert({
  isOpen,
  date,
  start,
  end,
  user,
  handleClose,
  handleDelete,
}: WorktimeDeleteMemberAlertProps) {
  if (!user) return;

  return (
    <Alert
      open={isOpen}
      title="인원을 삭제하시겠습니까?"
      message={`정보 : ${user.userName} / ${date} ${start}~${end}`}
      cancelText="취소"
      confirmText="삭제하기"
      confirmButtonClassName="bg-[#FD7171]"
      onCancel={handleClose}
      onConfirm={() => handleDelete(user.scheduleId)}
    />
  );
}
