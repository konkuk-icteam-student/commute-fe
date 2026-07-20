import { ChangeEvent, useState } from "react";
import Image from "next/image";

import icChevronPagination from "@/assets/icons/admin-common/ic_chevron_pagination.svg";

import MembersInfoHeader from "../members-info-header";
import MembersInfoTable from "../members-info-table";
import MemberDetailInfo from "../member-detail-info";

// TODO: 서버에서 받아와야 함
const TOTAL_PAGE = 3;

export default function MembersInfo() {
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [detailMemberId, setDetailMemberId] = useState<number | null>(null);

  // TODO: 디바운싱을 주고, 입력 시마다 검색되도록 구현
  const handleChangeSearchText = (e: ChangeEvent<HTMLInputElement>) =>
    setSearchText(e.target.value);

  const handlePrevPage = () => {
    if (currentPage === 1) return;
    setCurrentPage((prev) => prev - 1);
  };

  const handleNextPage = () => {
    if (currentPage === TOTAL_PAGE) return;
    setCurrentPage((prev) => prev + 1);
  };

  const handleDetailOpen = (id: number) => {
    console.log(id, "번 학생 상세 보기");
    setDetailMemberId(id);
    setIsDetailOpen(true);
  };

  const handleDetailClose = () => {
    setDetailMemberId(null);
    setIsDetailOpen(false);
  };

  return (
    <div className="flex flex-col gap-6 rounded-xl border border-[#D1D1D1] bg-white p-8">
      <MembersInfoHeader
        searchText={searchText}
        handleChangeSearchText={handleChangeSearchText}
      />
      <MembersInfoTable handleDetailOpen={handleDetailOpen} />
      <div className="flex flex-row items-center gap-2 self-end">
        <button
          type="button"
          className="cursor-pointer"
          onClick={handlePrevPage}
        >
          <Image src={icChevronPagination} alt="이전" />
        </button>
        <span className="text-xl font-bold">
          {currentPage}/{TOTAL_PAGE}
        </span>
        <button
          type="button"
          className="cursor-pointer"
          onClick={handleNextPage}
        >
          <Image className="rotate-180" src={icChevronPagination} alt="다음" />
        </button>
      </div>
      <MemberDetailInfo
        isOpen={isDetailOpen}
        id={detailMemberId}
        handleCloseDetailInfo={handleDetailClose}
      />
    </div>
  );
}
