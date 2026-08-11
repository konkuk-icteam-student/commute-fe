"use client";

import { useMemo, useState } from "react";

import type { WorkApplicationSettings } from "@/apis/admin/work-application-settings";

import type { WorkRequestFormValues } from "../types";
import {
  formatWorkRequestDate,
  initialWorkRequestFormValues,
  isWorkRequestStartReady,
  parseTimeRangeInput,
  toWorkRequestFormValues,
} from "../utils";

// targetMonth는 조회 쿼리의 파라미터이기도 해서 화면에서 만들어 넘긴다.
// settings는 저장된 설정(isConfigured=true)일 때만 넘어오고,
// 실제로 신청을 받고 있는지는 그와 별개인 applyStarted가 정한다.
export default function useWorkRequestState({
  applyStarted,
  settings,
  targetMonth,
}: {
  applyStarted: boolean;
  settings?: WorkApplicationSettings | null;
  targetMonth: { month: number; year: number };
}) {
  // 저장된 설정은 서버가 기준이다. 저장·수정 뒤 refetch되면 savedValues가 함께 갱신된다.
  const savedValues = useMemo(
    () => (settings ? toWorkRequestFormValues(settings) : null),
    [settings],
  );
  const [isEditing, setIsEditing] = useState(false);

  const baseValues = savedValues ?? initialWorkRequestFormValues;
  const [formValues, setFormValues] =
    useState<WorkRequestFormValues>(baseValues);
  const [syncedValues, setSyncedValues] =
    useState<WorkRequestFormValues>(baseValues);

  // 기준값이 바뀌면 폼을 다시 채운다. 수정 중에는 미뤄 두었다가 수정이 끝난 뒤 반영한다.
  // (렌더 중 상태 조정 — https://react.dev/learn/you-might-not-need-an-effect)
  if (syncedValues !== baseValues && !isEditing) {
    setSyncedValues(baseValues);
    setFormValues(baseValues);
  }

  const isActive = applyStarted;
  const canEditSettings = !isActive || isEditing;
  const isDirty = useMemo(
    () => JSON.stringify(formValues) !== JSON.stringify(baseValues),
    [formValues, baseValues],
  );
  const isStartReady = useMemo(
    () => isWorkRequestStartReady({ formValues, target: targetMonth }),
    [formValues, targetMonth],
  );

  const updateField = <Key extends keyof WorkRequestFormValues>(
    key: Key,
    value: WorkRequestFormValues[Key],
  ) => {
    setFormValues((current) => ({ ...current, [key]: value }));
  };

  const addUnavailableDate = () => {
    const date = formatWorkRequestDate(
      formValues.unavailableDateInput,
      targetMonth,
    );

    if (!date) {
      return;
    }

    setFormValues((current) => ({
      ...current,
      unavailableDateInput: "",
      unavailableDates: Array.from(
        new Set([...current.unavailableDates, date]),
      ),
    }));
  };

  const addUnavailableTimeRange = () => {
    const timeRange = parseTimeRangeInput({
      end: formValues.unavailableTimeRangeEndInput,
      start: formValues.unavailableTimeRangeStartInput,
    });

    if (!timeRange) {
      return;
    }

    setFormValues((current) => ({
      ...current,
      unavailableTimeRangeEndInput: "",
      unavailableTimeRangeStartInput: "",
      unavailableTimeRanges: [...current.unavailableTimeRanges, timeRange],
    }));
  };

  const removeUnavailableDate = (targetIndex: number) => {
    setFormValues((current) => ({
      ...current,
      unavailableDates: current.unavailableDates.filter(
        (_, index) => index !== targetIndex,
      ),
    }));
  };

  const removeUnavailableTimeRange = (targetIndex: number) => {
    setFormValues((current) => ({
      ...current,
      unavailableTimeRanges: current.unavailableTimeRanges.filter(
        (_, index) => index !== targetIndex,
      ),
    }));
  };

  const editRequest = () => {
    setIsEditing(true);
  };

  const cancelEditRequest = () => {
    setFormValues(baseValues);
    setIsEditing(false);
  };

  // 저장에 성공하면 편집 상태를 닫는다. 폼 값은 refetch된 서버 값으로 다시 채워진다.
  const finishEditRequest = () => {
    setIsEditing(false);
  };

  return {
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
  };
}
