import { useState } from "react";

import { useUpdateAdminWorkerMutation } from "@/apis/admin/workers";
import { Modal } from "@/components/ui";

import GradeDropdown, { type Grade, normalizeGrade } from "./grade-dropdown";
import EditMemberInfoAlert from "./edit-member-info-alert";

// 아직 채우지 않은 정보는 서버가 null로 준다.
// input의 value에 null이 들어가면 제어 컴포넌트가 아니게 되므로 빈 문자열로 바꿔 둔다.
interface EditMemberInfoProps {
  userId: number;
  name: string;
  studentNumber: string | null;
  department: string | null;
  grade: number | null;
  phoneNumber: string | null;
  handleCloseEdit: () => void;
}

export default function EditMemberInfo({
  userId,
  name,
  studentNumber,
  department,
  grade,
  phoneNumber,
  handleCloseEdit,
}: EditMemberInfoProps) {
  const initialName = name ?? "";
  const initialStudentNumber = studentNumber ?? "";
  const initialDepartment = department ?? "";
  const initialPhoneNumber = phoneNumber ?? "";
  const initialGrade = normalizeGrade(grade);

  const [inputName, setInputName] = useState<string>(initialName);
  const [inputStudentNumber, setInputStudentNumber] =
    useState<string>(initialStudentNumber);
  const [selectedGrade, setSelectedGrade] = useState<Grade | null>(
    initialGrade,
  );
  const [inputDepartment, setInputDepartment] = useState(initialDepartment);
  const [inputPhoneNumber, setInputPhoneNumber] = useState(initialPhoneNumber);

  const [isEditMemeberInfoOpen, setIsEditMemberInfoOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalText, setModalText] = useState("");
  // 실패했을 때는 입력값을 그대로 두고 다시 시도할 수 있어야 하므로 성공한 경우만 닫는다.
  const [isEditSucceeded, setIsEditSucceeded] = useState(false);

  const { updateAdminWorker, isPendingUpdateAdminWorker } =
    useUpdateAdminWorkerMutation();

  // 바뀐 항목만 보낸다. 서버가 부분 수정을 받는다.
  // 학년을 '선택 안 함'으로 되돌리는 것은 이 api로 할 수 없어 변경으로 세지 않는다.
  const changedFields = {
    ...(inputName !== initialName ? { name: inputName } : {}),
    ...(inputStudentNumber !== initialStudentNumber
      ? { studentId: inputStudentNumber }
      : {}),
    ...(selectedGrade !== null && selectedGrade !== initialGrade
      ? { grade: selectedGrade }
      : {}),
    ...(inputDepartment !== initialDepartment
      ? { department: inputDepartment }
      : {}),
    ...(inputPhoneNumber !== initialPhoneNumber
      ? { phoneNumber: inputPhoneNumber }
      : {}),
  };

  const handleEdit = () => {
    updateAdminWorker(
      { userId, ...changedFields },
      {
        onSuccess: () => {
          setIsEditSucceeded(true);
          setModalText("사용자 정보가 수정되었습니다.");
          setIsModalOpen(true);
        },
        onError: (error) => {
          setIsEditSucceeded(false);
          setModalText(error.message);
          setIsModalOpen(true);
        },
      },
    );
  };

  const handleOpenEditMemberInfo = () => {
    setIsEditMemberInfoOpen(true);
  };

  const handleCloseEditMemeberInfo = () => {
    setIsEditMemberInfoOpen(false);
  };

  const handleCloseModal = () => {
    setModalText("");
    setIsModalOpen(false);

    if (isEditSucceeded) {
      handleCloseEdit();
    }
  };

  const disabledToEdit = Object.keys(changedFields).length === 0;

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
                disabled={disabledToEdit || isPendingUpdateAdminWorker}
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
