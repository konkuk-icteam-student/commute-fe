export interface ModalActionsOptions {
  confirmText?: string;
  onConfirmClick?: () => void;
  cancelText?: string;
  onCancelClick?: () => void;
}

export interface ModalAction {
  key: "cancel" | "confirm";
  text: string;
  onClick?: () => void;
}

export function getModalActions({
  cancelText,
  onCancelClick,
  confirmText,
  onConfirmClick,
}: ModalActionsOptions): ModalAction[] {
  const actions: ModalAction[] = [];

  if (cancelText) {
    actions.push({
      key: "cancel",
      text: cancelText,
      onClick: onCancelClick,
    });
  }

  if (confirmText) {
    actions.push({
      key: "confirm",
      text: confirmText,
      onClick: onConfirmClick,
    });
  }

  return actions;
}
