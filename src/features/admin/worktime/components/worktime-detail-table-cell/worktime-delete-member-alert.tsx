import { Alert } from "@/components/ui";

interface WorktimeDeleteMemberAlertProps {
  isOpen: boolean;
  date: string;
  start: string;
  end: string;
  user: { userId: string; userName: string } | null;
  handleClose: () => void;
  handleDelete: (userId: string) => void;
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
      message={`정보 : ${user.userName}, ${date} ${start}~${end}`}
      cancelText="이전"
      confirmText="삭제하기"
      confirmButtonClassName="bg-[#FD7171]"
      onCancel={handleClose}
      onConfirm={() => handleDelete(user.userId)}
    />
  );
}
