"use client";

import { useMemo, useState } from "react";

import { Alert, Modal, Toast } from "@/components/ui";
import {
  createWorkRequestSettingsPayload,
  getWorkRequestMonth,
  pickConfiguredWorkApplicationSettings,
  SettingsPanel,
  SummaryPanel,
  useWorkRequestState,
} from "@/features/admin/work-request";
import {
  useGetWorkApplicationSettingsQuery,
  useSaveWorkApplicationSettingsMutation,
} from "@/apis/admin/work-application-settings";

type WorkRequestAction = "start" | "update";

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
  start: "근로신청을 시작했습니다.",
  update: "수정이 완료되었습니다.",
};
const failureMessage = "요청 처리에 실패했습니다.";
const invalidInputMessage = "입력값을 다시 확인해주세요.";
const loadFailureMessage = "근로신청 설정을 불러오지 못했습니다.";

// 이번 달을 0으로 두고 다다음 달까지만 다룬다. 지난 달 설정은 바꿀 일이 없다.
const MIN_MONTH_OFFSET = 0;
const MAX_MONTH_OFFSET = 2;
const DEFAULT_MONTH_OFFSET = 1;

export default function AdminWorkRequestScreen() {
  const [pendingAction, setPendingAction] = useState<WorkRequestAction | null>(
    null,
  );

  const [notificationMessage, setNotificationMessage] = useState("");
  // 이번 달을 기준으로 다다음 달까지만 연다. 처음 여는 것은 신청을 받을 다음 달이다.
  const [today] = useState(() => new Date());
  const [monthOffset, setMonthOffset] = useState(DEFAULT_MONTH_OFFSET);
  const targetMonth = useMemo(
    () => getWorkRequestMonth(monthOffset, today),
    [monthOffset, today],
  );
  const summaryTargetDate = useMemo(
    () =>
      `${targetMonth.year}-${String(targetMonth.month).padStart(2, "0")}-01`,
    [targetMonth],
  );

  const {
    workApplicationSettingsData,
    isPendingWorkApplicationSettings,
    isErrorWorkApplicationSettings,
  } = useGetWorkApplicationSettingsQuery({
    year: targetMonth.year,
    month: targetMonth.month,
  });

  const { saveWorkApplicationSettings, isPendingSaveWorkApplicationSettings } =
    useSaveWorkApplicationSettingsMutation();

  // isConfigured=false면 아직 이번 달 설정이 없다는 뜻이라 빈 폼에서 시작한다.
  const savedSettings = pickConfiguredWorkApplicationSettings(
    workApplicationSettingsData,
  );
  const applyStarted = workApplicationSettingsData?.applyStarted ?? false;

  const {
    addUnavailableDate,
    addUnavailableTimeRange,
    cancelEditRequest,
    canEditSettings,
    editRequest,
    finishEditRequest,
    formValues,
    isActive,
    isDirty,
    isEditing,
    isStartReady,
    removeUnavailableDate,
    removeUnavailableTimeRange,
    updateField,
  } = useWorkRequestState({
    applyStarted,
    settings: savedSettings,
    targetMonth,
  });

  // 달을 옮기면 지금 화면의 입력은 다른 달 것이 되므로 수정 중이던 값은 버린다.
  const moveTargetMonth = (offset: number) => {
    cancelEditRequest();
    setMonthOffset((currentOffset) =>
      Math.min(
        Math.max(currentOffset + offset, MIN_MONTH_OFFSET),
        MAX_MONTH_OFFSET,
      ),
    );
  };

  const closeAlert = () => {
    setPendingAction(null);
  };

  const alertContent = pendingAction ? actionAlertContent[pendingAction] : null;

  const handleConfirmAction = (action: WorkRequestAction) => {
    setPendingAction(null);

    // 입력값("4명", "2시간", 시간 단위 숫자, "MM.DD")을 서버 스펙(분 단위 숫자, "YYYY-MM-DD")으로 변환
    const payload = createWorkRequestSettingsPayload({
      formValues,
      target: targetMonth,
    });

    // 버튼 활성화 조건에서 이미 걸러지지만, 여기까지 왔다면 조용히 끝내지 않고 이유를 알린다.
    if (!payload) {
      setNotificationMessage(invalidInputMessage);
      return;
    }

    saveWorkApplicationSettings(
      {
        year: targetMonth.year,
        month: targetMonth.month,
        ...payload,
        unavailableDates: payload.unavailableDates ?? [],
        unavailableTimeRanges: payload.unavailableTimeRanges ?? [],
      },
      {
        onSuccess: () => {
          finishEditRequest();
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
        {isErrorWorkApplicationSettings ? (
          <p className="mb-4 rounded-md bg-white px-4 py-3 text-[15px] font-medium text-[#F84D4D]">
            {loadFailureMessage}
          </p>
        ) : null}
        <SettingsPanel
          formValues={formValues}
          isEditable={canEditSettings && !isPendingWorkApplicationSettings}
          isActive={isActive}
          isDirty={isDirty}
          isEditing={isEditing}
          isSaving={isPendingSaveWorkApplicationSettings}
          isStartReady={isStartReady}
          monthLabel={targetMonth.label}
          onAddUnavailableDate={addUnavailableDate}
          onAddUnavailableTimeRange={addUnavailableTimeRange}
          onCancelEdit={cancelEditRequest}
          onEdit={editRequest}
          onFieldChange={updateField}
          isNextMonthDisabled={monthOffset >= MAX_MONTH_OFFSET}
          isPrevMonthDisabled={monthOffset <= MIN_MONTH_OFFSET}
          onNextMonth={() => moveTargetMonth(1)}
          onPrevMonth={() => moveTargetMonth(-1)}
          onStart={() => setPendingAction("start")}
          onUpdate={() => setPendingAction("update")}
          targetMonth={targetMonth}
        />
        <SummaryPanel
          isActive={isActive}
          isEditing={isEditing}
          monthlyMinMinutes={formValues.monthlyMinMinutes}
          onRemoveUnavailableDate={removeUnavailableDate}
          onRemoveUnavailableTimeRange={removeUnavailableTimeRange}
          targetDate={summaryTargetDate}
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
          onConfirm={() => handleConfirmAction(pendingAction!)}
          panelClassName="w-82.5"
          confirmButtonClassName={alertContent.confirmButtonClassName}
        />
      ) : null}

      <Toast
        open={
          isPendingSaveWorkApplicationSettings ||
          isPendingWorkApplicationSettings
        }
        message={
          isPendingWorkApplicationSettings
            ? "설정을 불러오는 중..."
            : "요청 처리 중..."
        }
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
