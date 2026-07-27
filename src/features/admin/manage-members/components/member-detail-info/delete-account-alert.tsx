import { Alert } from "@/components/ui";

interface DeleteAccountAlertProps {
  isOpen: boolean;
  userId: number;
  handleClose: () => void;
  handleOpenModal: () => void;
  handleModalText: (text: string) => void;
}

export default function DeleteAccountAlert({
  isOpen,
  userId,
  handleClose,
  handleOpenModal,
  handleModalText,
}: DeleteAccountAlertProps) {
  const handleDelete = () => {
    console.log(userId, "번 계정 삭제");
    handleClose();
    // TODO: 서버 api 연동 후 요청 성공 시와 실패 시 text 설정
    handleOpenModal();
    handleModalText("계정이 삭제되었습니다.");
  };

  return (
    <Alert
      open={isOpen}
      title="계정을 삭제하시겠습니까?"
      message={`시간표, 개인정보 등 근무자와 관련한\n정보가 모두 삭제됩니다.`}
      cancelText="이전"
      confirmText="삭제하기"
      confirmButtonClassName="bg-[#FD7171]"
      onCancel={handleClose}
      onConfirm={handleDelete}
    />
  );
}
