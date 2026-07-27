import { Alert } from "@/components/ui";

interface PasswordResetAlertProps {
  isOpen: boolean;
  userId: number;
  handleClose: () => void;
  handleOpenModal: () => void;
  handleModalText: (text: string) => void;
}

export default function PasswordResetAlert({
  isOpen,
  userId,
  handleClose,
  handleOpenModal,
  handleModalText,
}: PasswordResetAlertProps) {
  const handleConfirm = () => {
    console.log(userId, "번 비밀번호 초기화");
    handleClose();
    // TODO: 서버 api 연동 후 요청 성공 시와 실패 시 text 설정
    handleOpenModal();
    handleModalText(`비밀번호가 초기화 되었습니다.\n(새 비밀번호 : awad1029)`);
  };

  return (
    <Alert
      open={isOpen}
      title="비밀번호를 초기화 하시겠습니까?"
      message={`기존의 비밀번호가 삭제되며\n새로운 비밀번호가 발급됩니다.`}
      cancelText="이전"
      confirmText="초기화하기"
      onCancel={handleClose}
      onConfirm={handleConfirm}
    />
  );
}
