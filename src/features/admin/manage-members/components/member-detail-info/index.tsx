import { useEffect, useState } from "react";
import Image from "next/image";

import { useGetAdminWorkerDetailQuery } from "@/apis/admin/workers";
import icPencil from "@/assets/icons/admin-member/ic_pencil.svg";
import { Modal } from "@/components/ui";

import {
  EMPTY_MEMBER_TEXT,
  formatGrade,
  formatMinutesToHours,
} from "../../utils";
import EditMemberInfo from "../edit-member-info";

interface MemberDetailInfoProps {
  isOpen: boolean;
  id: number | null;
  // 주·월 통계의 기준일. 목록과 같은 날짜를 써야 두 화면의 수치가 어긋나지 않는다.
  date: string;
  handleCloseDetailInfo: () => void;
}

export default function MemberDetailInfo({
  isOpen,
  id,
  date,
  handleCloseDetailInfo,
}: MemberDetailInfoProps) {
  const [isEdit, setIsEdit] = useState(false);
  // const [isPasswordResetOpen, setIsPasswordResetOpen] = useState(false);
  // const [isDeleteAccountOpen, setIsDeleteAccountOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalText, setModalText] = useState("");

  const {
    adminWorkerDetailData,
    isFetchingAdminWorkerDetail,
    isErrorAdminWorkerDetail,
    adminWorkerDetailError,
  } = useGetAdminWorkerDetailQuery({
    userId: id ?? 0,
    date,
    enabled: isOpen && id !== null,
  });

  const handleOpenEdit = () => {
    setIsEdit(true);
  };
  const handleCloseEdit = () => {
    setIsEdit(false);
  };

  // const handleOpenPasswordReset = () => {
  //   setIsPasswordResetOpen(true);
  // };

  // const handleClosePasswordReset = () => {
  //   setIsPasswordResetOpen(false);
  // };

  // const handleOpenDeleteAccount = () => {
  //   setIsDeleteAccountOpen(true);
  // };

  // const handleCloseDeleteAccount = () => {
  //   setIsDeleteAccountOpen(false);
  // };

  // const handleOpenModal = () => {
  //   setIsModalOpen(true);
  // };
  const handleCloseModal = () => {
    handleCloseDetailInfo();
    setModalText("");
    setIsModalOpen(false);
  };

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleCloseDetailInfo();
        handleCloseEdit();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, handleCloseDetailInfo]);

  return (
    isOpen && (
      <div
        className="fixed inset-0 z-50 bg-[rgba(70,76,83,0.30)]"
        role="dialog"
        aria-modal="true"
        aria-label="근무인원 상세보기"
      >
        {isEdit && adminWorkerDetailData ? (
          <EditMemberInfo
            userId={adminWorkerDetailData.userId}
            name={adminWorkerDetailData.name}
            studentNumber={adminWorkerDetailData.studentId}
            department={adminWorkerDetailData.department}
            grade={adminWorkerDetailData.grade}
            phoneNumber={adminWorkerDetailData.phoneNumber}
            handleCloseEdit={handleCloseEdit}
          />
        ) : (
          <div className="absolute right-0 flex h-full w-120 flex-col gap-15 bg-white px-8 py-10">
            <div className="flex flex-row items-center justify-between">
              <h2 className="text-2xl font-bold">근무인원 상세보기</h2>
              <button
                type="button"
                className="h-8 w-8 cursor-pointer items-center justify-center rounded-lg border border-[#C6CBD4] hover:bg-[#EEF4FF]"
                onClick={handleCloseDetailInfo}
              >
                X
              </button>
            </div>
            {/* 조회에 실패하면 빈 화면만 남아 장애인지 알 수 없으므로 사유를 적는다. */}
            {!adminWorkerDetailData ? (
              <p
                className={
                  isErrorAdminWorkerDetail
                    ? "text-center text-base text-[#FD7171]"
                    : "text-center text-base text-[#6B7280]"
                }
              >
                {isErrorAdminWorkerDetail
                  ? (adminWorkerDetailError?.message ??
                    "근무인원 정보를 불러오지 못했습니다.")
                  : "근무인원 정보를 불러오는 중입니다."}
              </p>
            ) : (
              <div className="flex flex-col gap-10">
                <div className="flex flex-col gap-8">
                  <div className="flex flex-row items-center justify-between">
                    <div className="flex flex-col">
                      <h2 className="text-2xl leading-9 font-bold">
                        {adminWorkerDetailData.name}
                      </h2>
                      <span className="leading-6 text-[#757B88]">
                        {adminWorkerDetailData.studentId ?? EMPTY_MEMBER_TEXT}・
                        {adminWorkerDetailData.department ?? EMPTY_MEMBER_TEXT}
                        ・{formatGrade(adminWorkerDetailData.grade)}
                      </span>
                    </div>
                    <button
                      type="button"
                      className="flex cursor-pointer flex-row items-center gap-1 rounded-lg border border-[#C6CBD4] px-3 py-2 hover:bg-[#EEF4FF] disabled:cursor-not-allowed disabled:opacity-50"
                      disabled={isFetchingAdminWorkerDetail}
                      onClick={handleOpenEdit}
                    >
                      <Image src={icPencil} alt="수정" />
                      <span className="text-[#757B88]">수정</span>
                    </button>
                  </div>
                  <div className="flex w-full flex-row gap-7 rounded-xl border border-[#DDE3EF] px-4.5 py-4">
                    <div className="flex flex-1 flex-col gap-1">
                      <span className="text-sm font-medium text-[#8892A6]">
                        연락처
                      </span>
                      <span className="font-semibold">
                        {adminWorkerDetailData.phoneNumber ?? EMPTY_MEMBER_TEXT}
                      </span>
                    </div>
                    <div className="h-full w-px bg-[#DDE3EF]" />
                    <div className="flex flex-1 flex-col gap-1">
                      <span className="text-sm font-medium text-[#8892A6]">
                        근로시작일
                      </span>
                      <span className="font-semibold">
                        {adminWorkerDetailData.workStartDate ??
                          EMPTY_MEMBER_TEXT}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <h3 className="font-bold">근태 요약</h3>
                  <div className="flex flex-row gap-3">
                    <div className="flex w-full flex-col rounded-xl border border-[#DDE3EF] bg-[#F9FAFC] px-4.5 py-4">
                      <span className="mb-1.5 text-sm font-medium text-[#757B88]">
                        이번주 누적 근무시간
                      </span>
                      <span className="text-lg font-bold">
                        {formatMinutesToHours(
                          adminWorkerDetailData.weeklyWorkedMinutes,
                        )}
                        시간
                      </span>
                      <span className="text-sm text-[#8892A6]">
                        / 최대{" "}
                        {formatMinutesToHours(
                          adminWorkerDetailData.weeklyLimitMinutes,
                        )}
                        시간
                      </span>
                    </div>
                    <div className="flex w-full flex-col rounded-xl border border-[#DDE3EF] bg-[#F9FAFC] px-4.5 py-4">
                      <span className="mb-1.5 text-sm font-medium text-[#757B88]">
                        이번달 누적 근무시간
                      </span>
                      <span className="text-lg font-bold">
                        {formatMinutesToHours(
                          adminWorkerDetailData.monthlyWorkedMinutes,
                        )}
                        시간
                      </span>
                      <span className="text-sm text-[#8892A6]">
                        / 최대{" "}
                        {formatMinutesToHours(
                          adminWorkerDetailData.monthlyLimitMinutes,
                        )}
                        시간
                      </span>
                    </div>
                  </div>
                  <div className="flex w-full flex-row items-center justify-between rounded-xl border border-[#DDE3EF] bg-[#F9FAFC] px-4.5 py-4">
                    <span className="text-sm font-medium text-[#757B88]">
                      수정 요청 횟수
                    </span>
                    <span className="text-sm font-medium text-[#8892A6]">
                      <span className="text-base font-bold text-black">
                        총 {adminWorkerDetailData.totalChangeRequestCount}회
                      </span>{" "}
                      (승인 {adminWorkerDetailData.approvedChangeRequestCount}
                      회)
                    </span>
                  </div>
                </div>
                <div className="flex flex-col gap-3">
                  <h3 className="font-bold">계정</h3>
                  <div className="flex w-full flex-col gap-1 rounded-xl border border-[#DDE3EF] px-4.5 py-4">
                    <div className="flex flex-row items-baseline gap-2">
                      <span className="text-[13px] text-[#757B88]">ID</span>
                      <span className="font-semibold text-[#464C53]">
                        {adminWorkerDetailData.email ?? EMPTY_MEMBER_TEXT}
                      </span>
                    </div>
                  </div>
                  {/* TODO: 추후 해당 기능 추가. 현재는 불가능하도록 */}
                  {/* <div className="mt-1 flex flex-row gap-3">
                  <button
                    type="button"
                    className="h-10 w-full cursor-pointer rounded-xl border border-[#C6CBD4] text-center text-sm font-semibold text-[#1A2236]"
                    onClick={handleOpenPasswordReset}
                  >
                    비밀번호 초기화
                  </button>
                  <button
                    type="button"
                    className="h-10 w-full cursor-pointer rounded-xl border border-[rgba(253,113,113,0.33)] text-center text-sm font-semibold text-[#F84D4D]"
                    onClick={handleOpenDeleteAccount}
                  >
                    계정 삭제
                  </button>
                </div> */}
                </div>
              </div>
            )}
          </div>
        )}
        {/* <PasswordResetAlert
          isOpen={isPasswordResetOpen}
          userId={userId}
          handleClose={handleClosePasswordReset}
          handleOpenModal={handleOpenModal}
          handleModalText={setModalText}
        /> */}
        {/* <DeleteAccountAlert
          isOpen={isDeleteAccountOpen}
          userId={userId}
          handleClose={handleCloseDeleteAccount}
          handleOpenModal={handleOpenModal}
          handleModalText={setModalText}
        /> */}
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
    )
  );
}
