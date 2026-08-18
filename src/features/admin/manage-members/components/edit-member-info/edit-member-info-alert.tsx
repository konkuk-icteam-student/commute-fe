import { Alert } from "@/components/ui";

interface EditMemberInfoAlertProps {
  isOpen: boolean;
  handleEdit: () => void;
  handleClose: () => void;
}

export default function EditMemberInfoAlert({
  isOpen,
  handleEdit,
  handleClose,
}: EditMemberInfoAlertProps) {
  // 결과 안내는 요청을 보낸 쪽이 성공·실패를 보고 띄운다.
  const handleConfirm = () => {
    handleClose();
    handleEdit();
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
