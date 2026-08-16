import { useEffect, useRef, useState } from "react";

import type { AdminSearchedUser } from "@/apis/admin/users";
import {
  useCreateAdminWorkScheduleMutation,
  useDeleteAdminWorkScheduleMutation,
  type AdminWorkScheduleUser,
} from "@/apis/admin/work-schedules";
import { cn } from "@/lib/utils";
import { Modal } from "@/components/ui";

import type { WorktimeDetailTableCellType } from "../../types";
import WorktimeDeleteMemberAlert from "./worktime-delete-member-alert";
import WorktimeDetailMemberSearch from "./worktime-detail-member-search";

interface WorktimeDetailTableCellProps {
  slot: WorktimeDetailTableCellType;
  maxConcurrentWorkers: number;
  isEditMode: boolean;
}

export default function WorktimeDetailTableCell({
  slot,
  maxConcurrentWorkers,
  isEditMode,
}: WorktimeDetailTableCellProps) {
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
  const [deleteUserInfo, setDeleteUserInfo] =
    useState<AdminWorkScheduleUser | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalText, setModalText] = useState("");

  const [isOpenSearch, setIsOpenSearch] = useState(false);
  const [shouldOpenUpward, setShouldOpenUpward] = useState(false);
  const searchAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpenSearch) return;

    const handlePointerdown = (event: PointerEvent) => {
      if (!searchAreaRef.current?.contains(event.target as Node)) {
        setIsOpenSearch(false);
      }
    };

    document.addEventListener("pointerdown", handlePointerdown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerdown);
    };
  }, [isOpenSearch]);

  const { createAdminWorkSchedule, isPendingCreateAdminWorkSchedule } =
    useCreateAdminWorkScheduleMutation();
  const { deleteAdminWorkSchedule } = useDeleteAdminWorkScheduleMutation();

  const handleAdd = (user: AdminSearchedUser) => {
    createAdminWorkSchedule(
      {
        userId: user.userId,
        date: slot.date,
        startTime: slot.start,
        endTime: slot.end,
      },
      {
        // 성공하면 시간표를 다시 받아 인원이 반영되므로 따로 알리지 않는다.
        onSuccess: () => {
          setIsOpenSearch(false);
        },
        onError: (error) => {
          setIsOpenSearch(false);
          handleOpenModal();
          setModalText(error.message);
        },
      },
    );
  };

  const handleOpenDeleteAlert = (user: AdminWorkScheduleUser) => {
    setDeleteUserInfo(user);
    setIsDeleteAlertOpen(true);
  };

  const handleCloseDeleteAlert = () => {
    setIsDeleteAlertOpen(false);
  };

  const handleDelete = (scheduleId: number) => {
    setIsDeleteAlertOpen(false);

    deleteAdminWorkSchedule(
      { scheduleId },
      {
        // 성공하면 시간표를 다시 받아 인원이 빠지므로 따로 알리지 않는다.
        // 출퇴근 기록이 있어 지울 수 없는 경우 등은 서버 메시지를 그대로 보여 준다.
        onError: (error) => {
          handleOpenModal();
          setModalText(error.message);
        },
      },
    );
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };
  const handleCloseModal = () => {
    setModalText("");
    setIsModalOpen(false);
  };

  const handleOpenSearch = () => {
    const searchAreaRect = searchAreaRef.current?.getBoundingClientRect();

    if (searchAreaRect) {
      const spaceAbove = searchAreaRect.top;
      const spaceBelow = window.innerHeight - searchAreaRect.bottom;

      setShouldOpenUpward(spaceBelow < spaceAbove);
    }

    setIsOpenSearch(true);
  };

  const isFull = slot.currentCount >= maxConcurrentWorkers;

  return slot.isUnavailable ? (
    <div className="min-h-28 rounded-xl bg-[#F2F2F7]" />
  ) : (
    <div
      className={cn(
        "flex min-h-25 flex-col gap-1.5 rounded-xl p-2.5",
        isEditMode ? "border-2 border-dashed" : "border",
        isFull
          ? "border-[rgba(255,59,48,0.30)]"
          : isEditMode
            ? "border-[#2D81FF]"
            : "border-[#E5E5EA]",
        isEditMode ? "bg-[#FAFCFF]" : isFull && "bg-[#FFF2F2]",
      )}
    >
      <div
        className={cn(
          "flex flex-row items-center justify-between font-bold",
          isFull ? "text-[#FF3B30]" : "text-[#8E8E93]",
        )}
      >
        <span>배치인원</span>
        <span>
          {slot.currentCount}/{maxConcurrentWorkers}
        </span>
      </div>
      <div className="flex flex-row flex-wrap items-center gap-1.5">
        {slot.users.map((user) => (
          <div
            key={user.userId}
            className="flex flex-row items-center gap-1 rounded-md border border-[rgba(45,129,255,0.08)] bg-[#E9F2FF] px-1.5 py-0.5"
          >
            <span className="font-bold whitespace-nowrap text-[#2D81FF]">
              {user.userName}
            </span>
            {isEditMode && (
              <button
                type="button"
                className="cursor-pointer px-0.5 pb-0.5 font-bold text-[#FF3B30]"
                onClick={() => handleOpenDeleteAlert(user)}
              >
                x
              </button>
            )}
          </div>
        ))}
      </div>
      {isEditMode && (
        <div className="relative mt-auto" ref={searchAreaRef}>
          <button
            type="button"
            className="flex w-full cursor-pointer items-center justify-center rounded-md border-2 border-dashed border-[#2D81FF] py-1 text-xs font-bold text-[#2D81FF]"
            onClick={handleOpenSearch}
          >
            + 추가
          </button>
          {isOpenSearch && (
            <WorktimeDetailMemberSearch
              shouldOpenUpward={shouldOpenUpward}
              isAdding={isPendingCreateAdminWorkSchedule}
              handleAdd={handleAdd}
            />
          )}
        </div>
      )}
      <WorktimeDeleteMemberAlert
        isOpen={isDeleteAlertOpen}
        date={slot.date}
        start={slot.start}
        end={slot.end}
        user={deleteUserInfo}
        handleClose={handleCloseDeleteAlert}
        handleDelete={handleDelete}
      />
      <Modal
        open={isModalOpen}
        title="알림"
        onButtonClick={handleCloseModal}
        panelClassName="w-76.5 whitespace-pre-line text-center leading-none"
        contentClassName="gap-5"
      >
        <span>{modalText}</span>
      </Modal>
    </div>
  );
}
