import { ChangeEvent } from "react";
import Image from "next/image";

import icSearch from "@/assets/icons/common/ic_search.svg";

interface MembersInfoHeaderProps {
  searchText: string;
  handleChangeSearchText: (e: ChangeEvent<HTMLInputElement>) => void;
}

export default function MembersInfoHeader({
  searchText,
  handleChangeSearchText,
}: MembersInfoHeaderProps) {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-center text-2xl font-bold">근무인원 정보</h1>
      <div className="flex h-12 w-100 flex-row items-center gap-2 rounded-lg border border-[#DDE3EF] px-4">
        <input
          className="w-full"
          value={searchText}
          onChange={handleChangeSearchText}
          placeholder="이름을 검색하세요."
        />
        <Image src={icSearch} alt="검색" aria-hidden="true" />
      </div>
    </div>
  );
}
