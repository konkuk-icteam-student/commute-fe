import { Alert } from "@/components/ui";

interface EditMemberInfoAlertProps {
  isOpen: boolean;
  handleEdit: () => void;
  handleClose: () => void;
  handleOpenModal: () => void;
  handleModalText: (text: string) => void;
}

export default function EditMemberInfoAlert({
  isOpen,
  handleEdit,
  handleClose,
  handleOpenModal,
  handleModalText,
}: EditMemberInfoAlertProps) {
  const handleConfirm = () => {
    handleClose();
    handleEdit();
    // TODO: 서버 api 연동 후 요청 성공 시와 실패 시 text 설정
    handleOpenModal();
    handleModalText("사용자 정보가 수정되었습니다.");
  };

  return (
    <Alert
      open={isOpen}
      title="정보를 수정하시겠습니까?"
      message="수정된 정보는 시스템 전체에 적용됩니다."
      cancelText="이전"
      confirmText="수정하기"
      onCancel={handleClose}
      onConfirm={handleConfirm}
    />
  );
}
