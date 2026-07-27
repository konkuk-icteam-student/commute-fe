"use client";

import Image from "next/image";
import { useState } from "react";

import plusIcon from "@/assets/icons/admin-manage-tasks/ic_plus.svg";
import { cn } from "@/lib/utils";

export type TaskPeriod = "오전" | "오후";

export default function TaskAddPanel({
  onAddTask,
}: {
  onAddTask: (task: { period: TaskPeriod; title: string }) => void;
}) {
  const [taskTitle, setTaskTitle] = useState("");
  const [selectedPeriod, setSelectedPeriod] = useState<TaskPeriod>("오후");
  const trimmedTaskTitle = taskTitle.trim();
  const canAddTask = trimmedTaskTitle.length > 0;

  const addTask = () => {
    if (!canAddTask) {
      return;
    }

    onAddTask({
      period: selectedPeriod,
      title: trimmedTaskTitle,
    });
    setTaskTitle("");
  };

  return (
    <section className="rounded-2xl border border-[#DDE3EF] bg-white px-4.5 pt-4 pb-4">
      <h2 className="text-[17px] leading-7 font-bold text-[#000000]">
        업무 추가
      </h2>
      <div className="ml-px">
        <label
          className="mt-5.5 mb-2.5 flex items-center text-base leading-6 font-bold text-[#1A2236]"
          htmlFor="manage-task-name"
        >
          업무 명
        </label>
        <input
          id="manage-task-name"
          type="text"
          className="h-11 w-full rounded-xl border border-[#F0F2F8] px-4 py-3 text-[12px] leading-5 text-[#1A2236] outline-none placeholder:text-[#8892A6]"
          placeholder="추가할 업무를 입력하세요"
          value={taskTitle}
          onChange={(event) => setTaskTitle(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              addTask();
            }
          }}
        />
        <fieldset className="mt-4">
          <legend className="mb-2.5 flex items-center text-base leading-6 font-bold text-[#1A2236]">
            시간대 선택
          </legend>
          <div className="flex gap-1.5">
            {(["오전", "오후"] as const).map((period) => {
              const isSelected = selectedPeriod === period;

              return (
                <button
                  type="button"
                  className={cn(
                    "h-7 rounded-md border px-3 text-[12px] font-bold",
                    isSelected
                      ? "border-[#DDE3EF] bg-[#2076FF] text-white"
                      : "border-[#DDE3EF] bg-white text-[#8892A6]",
                  )}
                  key={period}
                  onClick={() => setSelectedPeriod(period)}
                >
                  {period}
                </button>
              );
            })}
          </div>
        </fieldset>
        <button
          type="button"
          className={cn(
            "mt-4 flex h-9 w-full items-center justify-center gap-1.5 rounded-md text-[12px] font-bold text-white",
            canAddTask
              ? "cursor-pointer bg-[#2076FF]"
              : "cursor-not-allowed bg-[#B4BBC8]",
          )}
          disabled={!canAddTask}
          onClick={addTask}
        >
          <Image src={plusIcon} alt="" width={16} height={16} />
          <span className="mt-0.5">업무 추가</span>
        </button>
        <p className="mt-1.5 text-center text-[10px] text-[#8892A6]">
          추가한 업무는 선택한 시간대의 업무 사항에 등록됩니다
        </p>
      </div>
    </section>
  );
}
