import { ChangeEvent, useState } from "react";

import { DUMMY_WORKTIME_QUICK_SEARCH_RESULT } from "../../constants";
import { formatWorktimeRequestSlot } from "../../utils";

export default function WorktimeDetailQuickSearch() {
  const [searchText, setSearchText] = useState("");

  const handleChangeSearchText = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
  };

  const trimmedSearchText = searchText.trim();

  return (
    <div className="relative min-w-73 bg-[#F4F5F6]">
      <div className="sticky top-50 right-3 mx-1.5 flex h-fit w-70 flex-col gap-3 rounded-2xl border border-[#E5E5EA] bg-white p-7 shadow-[0_4px_20px_0_rgba(0,0,0,0.04)]">
        <h3 className="mb-3 text-lg font-bold">🔍 빠른 찾기</h3>
        <input
          type="search"
          aria-label="빠른 찾기 이름 검색"
          className="rounded-xl border border-[#E5E5EA] bg-[#F2F2F7] px-4 py-3.5"
          value={searchText}
          onChange={handleChangeSearchText}
          placeholder="이름을 입력하여 시간 확인"
        />
        {trimmedSearchText !== "" && (
          <div className="flex flex-col gap-3">
            {/* TODO: api를 통한 검색 결과 보여주기 */}
            {DUMMY_WORKTIME_QUICK_SEARCH_RESULT.map((item) => (
              <span key={item.id} className="font-bold text-[#2D81FF]">
                {formatWorktimeRequestSlot(item)}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
