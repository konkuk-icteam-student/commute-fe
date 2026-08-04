"use client";

import { useState } from "react";

import { Alert, Modal, Toast } from "@/components/ui";
import {
  createWorkRequestSettingsPayload,
  SettingsPanel,
  SummaryPanel,
  useWorkRequestState,
} from "@/features/admin/work-request";
import { useSaveAdminWorkSchedulesSettingsMutation } from "@/apis/admin-work-schedules";

type WorkRequestAction = "end" | "start" | "update";

const actionAlertContent: Record<
  WorkRequestAction,
  {
    cancelText: string;
    confirmButtonClassName?: string;
    confirmText: string;
    message: string;
    title: string;
  }
> = {
  end: {
    cancelText: "취소",
    confirmButtonClassName: "bg-[#FD7171]",
    confirmText: "종료하기",
    message:
      "신청내용은 다음달 근로시간표로 적용되며\n변경은 ‘근로시간관리’ 화면에서 가능합니다.",
    title: "신청받기를 종료하시겠습니까?",
  },
  start: {
    cancelText: "이전",
    confirmText: "신청받기",
    message: "설정값들은 신청기간 동안 바뀌지 않습니다.",
    title: "근로신청을 받으시겠습니까?",
  },
  update: {
    cancelText: "취소",
    confirmText: "수정하기",
    message:
      "설정이 수정되면, 지금까지 진행되었던\n근로신청은 모두 초기화됩니다.",
    title: "수정하시겠습니까?",
  },
};

const completionMessage: Record<WorkRequestAction, string> = {
  end: "신청이 종료되었습니다.",
  start: "근로신청을 시작했습니다.",
  update: "수정이 완료되었습니다.",
};
const failureMessage = "요청 처리에 실패했습니다.";

export default function AdminWorkRequestScreen() {
  const [pendingAction, setPendingAction] = useState<WorkRequestAction | null>(
    null,
  );

  const [notificationMessage, setNotificationMessage] = useState("");
  const {
    addUnavailableDate,
    addUnavailableTimeRange,
    cancelEditRequest,
    canEditSettings,
    editRequest,
    formValues,
    goToNextMonth,
    goToPreviousMonth,
    isActive,
    isDirty,
    isEditing,
    isSaving,
    isStartReady,
    removeUnavailableDate,
    removeUnavailableTimeRange,
    targetMonth,
    updateField,
  } = useWorkRequestState();

  const {
    saveAdminWorkSchedulesSettings,
    // TODO : 로딩 상태용
    isPendingSaveAdminWorkSchedulesSettings,
  } = useSaveAdminWorkSchedulesSettingsMutation();

  const closeAlert = () => {
    setPendingAction(null);
  };

  const alertContent = pendingAction ? actionAlertContent[pendingAction] : null;

  const handleSaveApplication = (action: WorkRequestAction) => {
    setPendingAction(null);
    // 입력값("4명", "2시간", 시간 단위 숫자, "MM.DD")을 서버 스펙(분 단위 숫자, "YYYY-MM-DD")으로 변환
    const payload = createWorkRequestSettingsPayload({
      formValues,
      target: targetMonth,
    });

    // 유효하지 않은 값이면 요청을 보내지 않는다 (버튼 활성화 조건인 isStartReady에서 이미 걸러짐)
    if (!payload) {
      return;
    }

    saveAdminWorkSchedulesSettings(
      {
        year: targetMonth.year,
        month: targetMonth.month,
        ...payload,
        unavailableDates: payload.unavailableDates ?? [],
        unavailableTimeRanges: payload.unavailableTimeRanges ?? [],
      },
      {
        onSuccess: () => {
          setNotificationMessage(completionMessage[action]);
        },
        onError: () => {
          setNotificationMessage(failureMessage);
        },
      },
    );
  };

  const handleResetNotificationMessage = () => {
    setNotificationMessage("");
  };

  return (
    <div className="flex-1 bg-[#F4F5F7] px-10 py-11.5">
      <div className="mx-auto w-full max-w-373.5">
        <SettingsPanel
          formValues={formValues}
          isEditable={canEditSettings}
          isActive={isActive}
          isDirty={isDirty}
          isEditing={isEditing}
          isSaving={isSaving}
          isStartReady={isStartReady}
          monthLabel={targetMonth.label}
          onAddUnavailableDate={addUnavailableDate}
          onAddUnavailableTimeRange={addUnavailableTimeRange}
          onCancelEdit={cancelEditRequest}
          onEdit={editRequest}
          onEnd={() => setPendingAction("end")}
          onFieldChange={updateField}
          onNextMonth={goToNextMonth}
          onPreviousMonth={goToPreviousMonth}
          onStart={() => setPendingAction("start")}
          onUpdate={() => setPendingAction("update")}
          targetMonth={targetMonth}
        />
        <SummaryPanel
          isActive={isActive}
          isEditing={isEditing}
          onRemoveUnavailableDate={removeUnavailableDate}
          onRemoveUnavailableTimeRange={removeUnavailableTimeRange}
          unavailableDates={formValues.unavailableDates}
          unavailableTimeRanges={formValues.unavailableTimeRanges}
        />
      </div>

      {alertContent ? (
        <Alert
          open
          title={alertContent.title}
          message={alertContent.message}
          cancelText={alertContent.cancelText}
          confirmText={alertContent.confirmText}
          onCancel={closeAlert}
          onConfirm={() => void handleSaveApplication(pendingAction!)}
          panelClassName="w-82.5"
          confirmButtonClassName={alertContent.confirmButtonClassName}
        />
      ) : null}

      <Toast
        open={isPendingSaveAdminWorkSchedulesSettings}
        message="요청 처리 중..."
        duration={0}
        panelClassName="w-82.5"
        contentClassName="min-h-31.5"
      />

      <Modal
        open={notificationMessage.length > 0}
        title="알림"
        buttonText="확인"
        onButtonClick={handleResetNotificationMessage}
        panelClassName="w-82.5 min-w-0"
        titleClassName="text-base"
        contentClassName="min-h-29.25"
        buttonClassName="h-10 min-h-10"
      >
        <p className="text-center text-sm leading-none font-medium">
          {notificationMessage}
        </p>
      </Modal>
    </div>
  );
}
