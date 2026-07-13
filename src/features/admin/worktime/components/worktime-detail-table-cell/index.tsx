import { ChangeEvent, useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

import type { WorktimeDetailTableCellType } from "../../types";
import { DUMMY_WORKTIME_DETAIL_SEARCH_TO_ADD } from "../../constants";

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
  const [isOpenSearch, setIsOpenSearch] = useState(false);
  const [shouldOpenUpward, setShouldOpenUpward] = useState(false);
  const [searchText, setSearchText] = useState("");
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

  // TODO: 추후 파라미터 수정
  const handleAdd = (name: string) => {
    console.log(name, " 추가");
    setIsOpenSearch(false);
  };

  const handleDelete = (userId: string) => {
    // TODO: 확인 팝업 띄우기
    console.log(userId, " 삭제");
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

  const handleChangeSearchText = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
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
                onClick={() => handleDelete(user.userId)}
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
            <div
              className={cn(
                "absolute left-1/2 z-20 flex -translate-x-1/2 flex-col gap-1.5 rounded-xl border border-[#E5E5EA] bg-white p-2 shadow-[0_10px_25px_0_rgba(0,0,0,0.12),0_3px_10px_0_rgba(0,0,0,0.04)]",
                shouldOpenUpward ? "bottom-0" : "top-0",
              )}
            >
              <input
                type="text"
                className="w-40 rounded-md border border-[hsl(240,11%,91%)] bg-[#F2F2F7] px-2.5 py-2 text-xs font-medium"
                value={searchText}
                onChange={handleChangeSearchText}
                placeholder="이름을 입력하세요."
              />
              {searchText.trim() !== "" && (
                <div className="flex flex-col gap-0.5">
                  {DUMMY_WORKTIME_DETAIL_SEARCH_TO_ADD.map((user) => (
                    <button
                      key={user.userId}
                      type="button"
                      className="cursor-pointer rounded-md px-2.5 py-1.5 text-start text-xs font-medium hover:bg-[#E9F2FF] hover:text-[#2D81FF]"
                      onClick={() => handleAdd(user.name)}
                    >
                      {user.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
