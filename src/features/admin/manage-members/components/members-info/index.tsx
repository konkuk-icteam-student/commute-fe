import { ChangeEvent, useState } from "react";
import Image from "next/image";

import { useGetAdminWorkersQuery } from "@/apis/admin/workers";
import { useDebouncedValue } from "@/hooks";
import { formatDateString } from "@/lib/date-formatter";
import icChevronPagination from "@/assets/icons/admin-common/ic_chevron_pagination.svg";

import MembersInfoHeader from "../members-info-header";
import MembersInfoTable from "../members-info-table";
import MemberDetailInfo from "../member-detail-info";

const PAGE_SIZE = 10;

export default function MembersInfo() {
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [detailMemberId, setDetailMemberId] = useState<number | null>(null);

  // 주·월 통계의 기준일. 지금 화면은 오늘이 속한 주와 달만 보여 준다.
  const date = formatDateString(new Date());
  const debouncedSearchText = useDebouncedValue(searchText);

  // 검색어가 바뀌면 결과가 통째로 달라지므로 첫 페이지로 되돌린다.
  const [lastSearchedText, setLastSearchedText] = useState(debouncedSearchText);

  if (lastSearchedText !== debouncedSearchText) {
    setLastSearchedText(debouncedSearchText);
    setCurrentPage(1);
  }

  const {
    adminWorkersData,
    isFetchingAdminWorkers,
    isErrorAdminWorkers,
    adminWorkersError,
  } = useGetAdminWorkersQuery({
    date,
    keyword: debouncedSearchText.trim(),
    page: currentPage - 1,
    size: PAGE_SIZE,
  });

  // 응답이 오기 전에는 페이지 이동을 막아 두려고 최소 1페이지로 둔다.
  const totalPage = Math.max(adminWorkersData?.totalPages ?? 1, 1);
  // 입력이 멎기 전에는 아직 조회 전이라 이전 결과가 남아 있다. 없음이 아니라 로딩으로 본다.
  const isLoading =
    isFetchingAdminWorkers || debouncedSearchText !== searchText;

  const handleChangeSearchText = (e: ChangeEvent<HTMLInputElement>) =>
    setSearchText(e.target.value);

  const handlePrevPage = () => {
    if (currentPage === 1) return;
    setCurrentPage((prev) => prev - 1);
  };

  const handleNextPage = () => {
    if (currentPage === totalPage) return;
    setCurrentPage((prev) => prev + 1);
  };

  const handleDetailOpen = (id: number) => {
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
      <MembersInfoTable
        workers={adminWorkersData?.workers ?? []}
        isLoading={isLoading}
        isError={isErrorAdminWorkers}
        errorMessage={adminWorkersError?.message}
        handleDetailOpen={handleDetailOpen}
      />
      <div className="flex flex-row items-center gap-2 self-end">
        <button
          type="button"
          className="cursor-pointer"
          onClick={handlePrevPage}
        >
          <Image src={icChevronPagination} alt="이전" />
        </button>
        <span className="text-xl font-bold">
          {currentPage}/{totalPage}
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
        date={date}
        handleCloseDetailInfo={handleDetailClose}
      />
    </div>
  );
}
