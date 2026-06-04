"use client";

import Image from "next/image";
import { useState } from "react";

import closeIcon from "@/assets/icons/close-icon.svg";
import { cn } from "@/lib/utils";

import type { HandoverMemo } from "../../types";

type HandoverMemoPanelProps = {
  handoverMemos: HandoverMemo[];
  memo: string;
  onChangeMemo: (memo: string) => void;
  onDeleteMemo: (memoId: number) => void;
  onSaveMemo: (memo: string) => void;
};

export default function HandoverMemoPanel({
  handoverMemos,
  memo,
  onChangeMemo,
  onDeleteMemo,
  onSaveMemo,
}: HandoverMemoPanelProps) {
  const [deleteMemoId, setDeleteMemoId] = useState<number | null>(null);
  const trimmedMemo = memo.trim();
  const canSaveMemo = trimmedMemo.length > 0;

  const handleSaveMemo = () => {
    if (!canSaveMemo) {
      return;
    }

    onSaveMemo(trimmedMemo);
  };

  const handleDeleteMemo = (memoId: number) => {
    onDeleteMemo(memoId);
    setDeleteMemoId(null);
  };

  return (
    <div>
      {handoverMemos.length > 0 && (
        <div className="border-b-[0.5px] border-[#DDE3EF] bg-[#F0F2F8]">
          {handoverMemos.map((handoverMemo) => (
            <article
              className="border-t-[0.5px] border-[#DDE3EF] px-3 py-2 first:border-t-0"
              key={handoverMemo.id}
            >
              <div className="mb-1 flex items-center justify-between px-1.5">
                <p className="flex h-3 items-center text-xs leading-3 font-bold text-[#1A2236]">
                  {handoverMemo.author}
                  <span className="ml-1 inline-block text-[8px] font-medium text-[#8892A6]">
                    {handoverMemo.createdAt}
                  </span>
                </p>
                {handoverMemo.isMine &&
                  (deleteMemoId === handoverMemo.id ? (
                    <div className="flex items-center gap-1">
                      <button
                        className="h-3.5 w-7.75 cursor-pointer rounded-sm border-[0.5px] border-[#DDE3EF] bg-white px-1.75 text-[9px] font-[350] text-[#1A2236]"
                        type="button"
                        onClick={() => setDeleteMemoId(null)}
                      >
                        취소
                      </button>
                      <button
                        className="h-3.5 w-7.75 cursor-pointer rounded-sm border-[0.5px] border-[#DDE3EF] bg-[#FD7171] px-1.75 text-[9px] font-[350] text-white"
                        type="button"
                        onClick={() => handleDeleteMemo(handoverMemo.id)}
                      >
                        삭제
                      </button>
                    </div>
                  ) : (
                    <button
                      aria-label="메모 삭제"
                      className="flex h-3.5 w-3.5 cursor-pointer items-center justify-center rounded-sm bg-[#DDE3EF]"
                      type="button"
                      onClick={() => setDeleteMemoId(handoverMemo.id)}
                    >
                      <Image
                        alt=""
                        aria-hidden="true"
                        src={closeIcon}
                        width={11}
                        height={11}
                      />
                    </button>
                  ))}
              </div>
              <p className="rounded-lg border border-[#DDE3EF] bg-white px-4 py-3 text-[10px] leading-5.25 text-[#1A2236]">
                {handoverMemo.content}
              </p>
            </article>
          ))}
        </div>
      )}

      <div className="px-4.5 py-3">
        <label
          className="mb-1 flex h-3 items-center pl-1.5 text-xs leading-3 font-bold text-[#1A2236]"
          htmlFor="my-handover-memo"
        >
          나의 메모
        </label>
        <textarea
          className="h-11.25 w-full resize-none overflow-y-auto rounded-lg border border-[#F0F2F8] px-4 py-3.75 text-[10px] leading-3.25 text-[#1A2236] outline-none placeholder:text-[#8892A6]"
          id="my-handover-memo"
          placeholder="전달할 내용을 입력하세요"
          value={memo}
          onChange={(event) => onChangeMemo(event.target.value)}
        />
        <div className="flex items-center justify-between">
          <p className="ml-1 text-[8px] leading-2.75 text-[#8892A6]">
            ⓘ 모든 근무자에게 공개, 3일 뒤 자동으로 삭제
          </p>
          <button
            className={cn(
              "rounded-sm border-[0.5px] px-1.5 py-px text-[10px]",
              canSaveMemo
                ? "cursor-pointer border-[#DDD9D9] text-[#1A2236]"
                : "cursor-not-allowed border-[#DDE3EF] text-[#8892A6]",
            )}
            disabled={!canSaveMemo}
            type="button"
            onClick={handleSaveMemo}
          >
            저장
          </button>
        </div>
      </div>
    </div>
  );
}
