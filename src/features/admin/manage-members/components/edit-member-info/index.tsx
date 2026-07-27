import { useState } from "react";

import { Modal } from "@/components/ui";

import GradeDropdown, { type Grade, normalizeGrade } from "./grade-dropdown";
import EditMemberInfoAlert from "./edit-member-info-alert";

interface EditMemberInfoProps {
  name: string;
  studentNumber: string;
  department: string;
  grade: number;
  phoneNumber: string;
  handleCloseEdit: () => void;
}

export default function EditMemberInfo({
  name,
  studentNumber,
  department,
  grade,
  phoneNumber,
  handleCloseEdit,
}: EditMemberInfoProps) {
  const [inputName, setInputName] = useState<string>(name);
  const [inputStudentNumber, setInputStudentNumber] =
    useState<string>(studentNumber);
  const [selectedGrade, setSelectedGrade] = useState<Grade | null>(
    normalizeGrade(grade),
  );
  const [inputDepartment, setInputDepartment] = useState(department);
  const [inputPhoneNumber, setInputPhoneNumber] = useState(phoneNumber);

  const [isEditMemeberInfoOpen, setIsEditMemberInfoOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalText, setModalText] = useState("");

  const handleEdit = () => {
    console.log(
      "바꿀 정보 : ",
      inputName,
      inputStudentNumber,
      selectedGrade,
      inputDepartment,
      inputPhoneNumber,
    );
  };

  const handleOpenEditMemberInfo = () => {
    setIsEditMemberInfoOpen(true);
  };

  const handleCloseEditMemeberInfo = () => {
    setIsEditMemberInfoOpen(false);
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };
  const handleCloseModal = () => {
    setModalText("");
    setIsModalOpen(false);
    handleCloseEdit();
  };

  const disabledToEdit =
    inputName === name &&
    inputStudentNumber === studentNumber &&
    selectedGrade === grade &&
    inputDepartment === department &&
    inputPhoneNumber === phoneNumber;

  return (
    <>
      <div className="absolute right-0 flex h-full w-120 flex-col gap-15 bg-white px-8 py-10">
        <div className="flex flex-row items-center justify-between">
          <h2 className="text-2xl font-bold">근무인원 상세보기</h2>
        </div>
        <div className="flex flex-col gap-10">
          <div className="flex flex-col gap-8">
            <div className="flex flex-row items-center justify-between">
              <div className="flex flex-col">
                <h2 className="text-2xl leading-9 font-bold">{name}</h2>
                <span className="leading-6 text-[#757B88]">정보 수정</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4.5">
            <div className="flex flex-col gap-2">
              <p className="text-[13px] font-bold text-[#8892A6]">이름</p>
              <input
                className="rounded-md border border-[#C6CBD4] bg-[#F8F9FB] p-3 text-[#464A4D]"
                value={inputName}
                onChange={(e) => setInputName(e.target.value)}
              />
            </div>
            <div className="flex flex-row gap-3">
              <div className="flex min-w-0 flex-1 flex-col gap-2">
                <p className="text-[13px] font-bold text-[#8892A6]">학번</p>
                <input
                  className="w-full rounded-md border border-[#C6CBD4] bg-[#F8F9FB] p-3 text-[#464A4D]"
                  value={inputStudentNumber}
                  onChange={(e) => setInputStudentNumber(e.target.value)}
                />
              </div>
              <div className="flex min-w-0 flex-1 flex-col gap-2">
                <p className="text-[13px] font-bold text-[#8892A6]">학년</p>
                <GradeDropdown
                  value={selectedGrade}
                  onChange={setSelectedGrade}
                />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <p className="text-[13px] font-bold text-[#8892A6]">학과</p>
              <input
                className="rounded-md border border-[#C6CBD4] bg-[#F8F9FB] p-3 text-[#464A4D]"
                value={inputDepartment}
                onChange={(e) => setInputDepartment(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-2">
              <p className="text-[13px] font-bold text-[#8892A6]">연락처</p>
              <input
                className="rounded-md border border-[#C6CBD4] bg-[#F8F9FB] p-3 text-[#464A4D]"
                value={inputPhoneNumber}
                onChange={(e) => setInputPhoneNumber(e.target.value)}
              />
            </div>
            <div className="flex flex-row items-center justify-end gap-4">
              <button
                type="button"
                className="h-12 w-28 cursor-pointer rounded-lg border border-[#C6CBD4] bg-white font-bold text-[#464A4D]"
                onClick={handleCloseEdit}
              >
                취소
              </button>
              <button
                type="button"
                className="h-12 w-28 cursor-pointer rounded-lg border border-[#E8EEF2] bg-[#2076FF] font-bold text-white disabled:cursor-not-allowed disabled:bg-[#C6CBD4]"
                onClick={handleOpenEditMemberInfo}
                disabled={disabledToEdit}
              >
                확인
              </button>
            </div>
          </div>
        </div>
      </div>
      <EditMemberInfoAlert
        isOpen={isEditMemeberInfoOpen}
        handleEdit={handleEdit}
        handleClose={handleCloseEditMemeberInfo}
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
    </>
  );
}
