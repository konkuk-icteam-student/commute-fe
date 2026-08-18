"use client";

import Image from "next/image";
import { useState } from "react";

import infoCircleIcon from "@/assets/icons/common/ic_info_circle.svg";
import closeIcon from "@/assets/icons/daily-tasks/ic_close.svg";
import { cn } from "@/lib/utils";

import type { ManageTaskMemo } from "../../types";

type SaveMemoCallbacks = {
  onSuccess?: () => void;
};

export default function HandoverMemoPanel({
  errorMessage,
  isError = false,
  isLoading = false,
  isSaving = false,
  memos,
  onDeleteMemo,
  onSaveMemo,
}: {
  errorMessage?: string;
  isError?: boolean;
  isLoading?: boolean;
  isSaving?: boolean;
  memos: ManageTaskMemo[];
  onDeleteMemo: (memoId: number) => void;
  onSaveMemo: (memo: string, callbacks?: SaveMemoCallbacks) => void;
}) {
  const [memo, setMemo] = useState("");
  const trimmedMemo = memo.trim();
  const canSaveMemo = trimmedMemo.length > 0;
  const canSubmitMemo = canSaveMemo && !isSaving;

  const saveMemo = () => {
    if (!canSubmitMemo) {
      return;
    }

    onSaveMemo(trimmedMemo, {
      onSuccess: () => setMemo(""),
    });
  };

  const deleteMemo = (memoId: number) => {
    onDeleteMemo(memoId);
  };

  return (
    <section className="rounded-2xl border border-[#DDE3EF] bg-white px-4.5 pt-4 pb-6">
      <div className="flex h-5.25 items-center justify-between">
        <h2 className="text-[17px] leading-7 font-bold text-[#000000]">
          인수인계 메모
        </h2>
        <span className="flex h-5.25 min-w-9.25 items-center justify-center rounded-full border border-[#DDE3EF] bg-[#EDF5FF] px-3 text-[11px] font-bold text-[#2563EB]">
          {memos.length}건
        </span>
      </div>

      <div className="mt-5.5 space-y-3">
        {isLoading ? (
          <p className="text-[12px] font-bold text-[#8892A6]">
            인수인계 메모를 불러오는 중입니다.
          </p>
        ) : isError ? (
          <p className="text-[12px] font-bold text-[#8892A6]">
            {errorMessage ?? "인수인계 메모를 불러오지 못했습니다."}
          </p>
        ) : (
          memos.map((handoverMemo) => (
            <article
              className="rounded-xl border border-[#DDE3EF] bg-[#F0F2F8] px-3.5 py-2.75"
              key={handoverMemo.id}
            >
              <div className="flex items-center justify-between gap-1.25">
                <p className="min-w-0 text-[15px] leading-6 font-bold text-[#1A2236]">
                  {handoverMemo.author}
                  <span className="ml-1.25 text-[10px] font-medium text-[#8892A6]">
                    {handoverMemo.createdAt}
                  </span>
                </p>
                <button
                  type="button"
                  aria-label="메모 삭제"
                  className="flex h-6 w-6 shrink-0 cursor-pointer items-center justify-center"
                  onClick={() => deleteMemo(handoverMemo.id)}
                >
                  <Image src={closeIcon} alt="" width={19} height={19} />
                </button>
              </div>
              <p className="mt-1.5 text-[12px] break-all text-[#1A2236]">
                {handoverMemo.content}
              </p>
            </article>
          ))
        )}
      </div>

      <div className="mt-5.5 border-t-[0.5px] border-[#DDE3EF]">
        <label
          className="mt-3.5 mb-2.5 flex items-center pl-1.5 text-base leading-6 font-bold text-[#1A2236]"
          htmlFor="admin-task-memo"
        >
          관리자 메모
        </label>
        <textarea
          id="admin-task-memo"
          className="h-16 w-full resize-none rounded-xl border border-[#F0F2F8] px-4 py-5 text-[12px] leading-5 text-[#1A2236] outline-none placeholder:text-[#8892A6]"
          placeholder="전달할 내용을 입력하세요"
          value={memo}
          onChange={(event) => setMemo(event.target.value)}
        />
        <div className="mt-2 ml-1 flex items-center justify-between">
          <p className="flex items-center gap-1 text-[12px] leading-4 text-[#8892A6]">
            <Image
              src={infoCircleIcon}
              alt=""
              width={10}
              height={10}
              className="mb-0.5"
            />
            모든 근무자에게 공개, 3일 뒤 자동으로 삭제
          </p>
          <button
            type="button"
            className={cn(
              "h-7 rounded-md border px-1.75 text-[14px] font-medium",
              canSubmitMemo
                ? "cursor-pointer border-[#DDE3EF] text-[#1A2236]"
                : "cursor-not-allowed border-[#DDE3EF] text-[#8892A6]",
            )}
            disabled={!canSubmitMemo}
            onClick={saveMemo}
          >
            {isSaving ? "저장 중" : "저장"}
          </button>
        </div>
      </div>
    </section>
  );
}
