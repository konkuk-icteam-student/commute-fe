"use client";

import { useMemo, useState } from "react";

import { saveWorkRequestSettings } from "../api";
import type { RequestStatus, WorkRequestFormValues } from "../types";
import {
  createWorkRequestSettingsPayload,
  formatWorkRequestDate,
  getNextWorkRequestMonth,
  initialWorkRequestFormValues,
  isWorkRequestStartReady,
  parseTimeRangeInput,
} from "../utils";

export default function useWorkRequestState() {
  const targetMonth = useMemo(() => getNextWorkRequestMonth(), []);
  const [requestStatus, setRequestStatus] = useState<RequestStatus>("idle");
  const [formValues, setFormValues] = useState<WorkRequestFormValues>(
    initialWorkRequestFormValues,
  );
  const [savedValues, setSavedValues] = useState<WorkRequestFormValues>(
    initialWorkRequestFormValues,
  );
  const [isSaving, setIsSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const isActive = requestStatus === "active";
  const canEditSettings = !isActive || isEditing;
  const isDirty = useMemo(
    () => JSON.stringify(formValues) !== JSON.stringify(savedValues),
    [formValues, savedValues],
  );
  const isStartReady = useMemo(
    () => isWorkRequestStartReady(formValues),
    [formValues],
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

  const saveSettings = async () => {
    setIsSaving(true);

    const payload = createWorkRequestSettingsPayload({
      formValues,
      target: targetMonth,
    });

    try {
      const result = await saveWorkRequestSettings({
        month: targetMonth.month,
        payload,
        year: targetMonth.year,
      });

      if (result.status === "error") {
        return false;
      }

      setSavedValues(formValues);
      setRequestStatus("active");
      setIsEditing(false);
      return true;
    } catch {
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  const startRequest = async () => {
    if (!isStartReady) {
      return false;
    }

    return saveSettings();
  };

  const updateRequest = async () => {
    if (!isDirty) {
      return false;
    }

    return saveSettings();
  };

  const editRequest = () => {
    setIsEditing(true);
  };

  const cancelEditRequest = () => {
    setFormValues(savedValues);
    setIsEditing(false);
  };

  const endRequest = () => {
    setFormValues(initialWorkRequestFormValues);
    setSavedValues(initialWorkRequestFormValues);
    setRequestStatus("ended");
    setIsEditing(false);
  };

  return {
    addUnavailableDate,
    addUnavailableTimeRange,
    cancelEditRequest,
    canEditSettings,
    editRequest,
    endRequest,
    formValues,
    isActive,
    isDirty,
    isEditing,
    isSaving,
    isStartReady,
    removeUnavailableDate,
    removeUnavailableTimeRange,
    startRequest,
    targetMonth,
    updateField,
    updateRequest,
  };
}
