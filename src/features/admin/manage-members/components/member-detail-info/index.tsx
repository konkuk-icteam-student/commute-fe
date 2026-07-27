import { useState } from "react";
import Image from "next/image";

import icPencil from "@/assets/icons/admin-member/ic_pencil.svg";
import { Modal } from "@/components/ui";

import { DUMMY_MEMBER_DETAIL_INFO } from "../../constants";
import EditMemberInfo from "../edit-member-info";
import PasswordResetAlert from "./password-reset-alert";
import DeleteAccountAlert from "./delete-account-alert";

interface MemberDetailInfoProps {
  isOpen: boolean;
  id: number | null;
  handleCloseDetailInfo: () => void;
}

const MAX_WEEKLY_HOURS = 7;
const MAX_MONTHLY_HOURS = 27;

export default function MemberDetailInfo({
  isOpen,
  // 추후 id로 서버 api 요청 예정
  // id,
  handleCloseDetailInfo,
}: MemberDetailInfoProps) {
  const [isEdit, setIsEdit] = useState(false);
  const [isPasswordResetOpen, setIsPasswordResetOpen] = useState(false);
  const [isDeleteAccountOpen, setIsDeleteAccountOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalText, setModalText] = useState("");

  // TODO: 서버에서 받아온 값으로 진행
  const {
    userId,
    name,
    studentNumber,
    department,
    grade,
    phoneNumber,
    commuteStartDate,
    weeklyWorkedHours,
    monthlyWorkedHours,
    editRequestCount,
    confirmedRequestCount,
    accountId,
    lastAccessDate,
  } = DUMMY_MEMBER_DETAIL_INFO;

  const handleOpenEdit = () => {
    setIsEdit(true);
  };
  const handleCloseEdit = () => {
    setIsEdit(false);
  };

  const handleOpenPasswordReset = () => {
    setIsPasswordResetOpen(true);
  };

  const handleClosePasswordReset = () => {
    setIsPasswordResetOpen(false);
  };

  const handleOpenDeleteAccount = () => {
    setIsDeleteAccountOpen(true);
  };

  const handleCloseDeleteAccount = () => {
    setIsDeleteAccountOpen(false);
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };
  const handleCloseModal = () => {
    setModalText("");
    setIsModalOpen(false);
  };

  return (
    isOpen && (
      <div className="fixed inset-0 z-50 bg-[rgba(70,76,83,0.30)]">
        {isEdit ? (
          <EditMemberInfo
            name={name}
            studentNumber={studentNumber}
            department={department}
            grade={grade}
            phoneNumber={phoneNumber}
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
            <div className="flex flex-col gap-10">
              <div className="flex flex-col gap-8">
                <div className="flex flex-row items-center justify-between">
                  <div className="flex flex-col">
                    <h2 className="text-2xl leading-9 font-bold">{name}</h2>
                    <span className="leading-6 text-[#757B88]">
                      {studentNumber}・{department}・{grade}학년
                    </span>
                  </div>
                  <button
                    type="button"
                    className="flex cursor-pointer flex-row items-center gap-1 rounded-lg border border-[#C6CBD4] px-3 py-2 hover:bg-[#EEF4FF]"
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
                    <span className="font-semibold">{phoneNumber}</span>
                  </div>
                  <div className="h-full w-px bg-[#DDE3EF]" />
                  <div className="flex flex-1 flex-col gap-1">
                    <span className="text-sm font-medium text-[#8892A6]">
                      근로시작일
                    </span>
                    <span className="font-semibold">{commuteStartDate}</span>
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
                      {weeklyWorkedHours}시간
                    </span>
                    <span className="text-sm text-[#8892A6]">
                      / 최대 {MAX_WEEKLY_HOURS}시간
                    </span>
                  </div>
                  <div className="flex w-full flex-col rounded-xl border border-[#DDE3EF] bg-[#F9FAFC] px-4.5 py-4">
                    <span className="mb-1.5 text-sm font-medium text-[#757B88]">
                      이번달 누적 근무시간
                    </span>
                    <span className="text-lg font-bold">
                      {monthlyWorkedHours}시간
                    </span>
                    <span className="text-sm text-[#8892A6]">
                      / 최대 {MAX_MONTHLY_HOURS}시간
                    </span>
                  </div>
                </div>
                <div className="flex w-full flex-row items-center justify-between rounded-xl border border-[#DDE3EF] bg-[#F9FAFC] px-4.5 py-4">
                  <span className="text-sm font-medium text-[#757B88]">
                    수정 요청 횟수
                  </span>
                  <span className="text-sm font-medium text-[#8892A6]">
                    <span className="text-base font-bold text-black">
                      총 {editRequestCount}회
                    </span>{" "}
                    (승인 {confirmedRequestCount}회)
                  </span>
                </div>
              </div>
              <div className="flex flex-col gap-3">
                <h3 className="font-bold">계정</h3>
                <div className="flex w-full flex-col gap-1 rounded-xl border border-[#DDE3EF] px-4.5 py-4">
                  <div className="flex flex-row items-baseline gap-2">
                    <span className="text-[13px] text-[#757B88]">ID</span>
                    <span className="font-semibold text-[#464C53]">
                      {accountId}
                    </span>
                  </div>
                  <span className="text-[13px] text-[#757B88]">
                    (최근 접속일 : {lastAccessDate})
                  </span>
                </div>
                <div className="mt-1 flex flex-row gap-3">
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
                </div>
              </div>
            </div>
          </div>
        )}
        <PasswordResetAlert
          isOpen={isPasswordResetOpen}
          userId={userId}
          handleClose={handleClosePasswordReset}
          handleOpenModal={handleOpenModal}
          handleModalText={setModalText}
        />
        <DeleteAccountAlert
          isOpen={isDeleteAccountOpen}
          userId={userId}
          handleClose={handleCloseDeleteAccount}
          handleOpenModal={handleOpenModal}
          handleModalText={setModalText}
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
    )
  );
}
