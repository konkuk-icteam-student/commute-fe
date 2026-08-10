"use client";

import { useState } from "react";

import { useGetMyPageQuery } from "@/apis/my-page";
import { Alert, Spinner, Toast } from "@/components/ui";
import { MenuCard, UserInfoCard, WorkSummaryCard } from "@/features/my-page";

export default function MyPageScreen() {
  const [openAlert, setOpenAlert] = useState<"logout" | "withdraw" | null>(
    null,
  );
  const [toastMessage, setToastMessage] = useState("");
  const { myPageData, isPendingMyPage } = useGetMyPageQuery();
  const displayedMyPageData = myPageData ?? {
    userName: "-",
    roleName: "-",
    organizationName: "-",
    department: "-",
    studentId: "-",
    week: {
      workedHours: 0,
      limitHours: 0,
    },
    month: {
      workedHours: 0,
      limitHours: 0,
    },
  };
  const workSummaries = [
    {
      title: "이번주 근무 시간",
      currentHours: displayedMyPageData.week.workedHours,
      totalHours: displayedMyPageData.week.limitHours,
    },
    {
      title: "이번달 근무 시간",
      currentHours: displayedMyPageData.month.workedHours,
      totalHours: displayedMyPageData.month.limitHours,
    },
  ];

  const closeAlert = () => {
    setOpenAlert(null);
  };

  const handleLogoutConfirm = () => {
    closeAlert();
    setToastMessage("로그아웃되었습니다.");
  };

  // 회원 탈퇴 관련 주석 처리
  {
    /*const handleWithdrawConfirm = () => {
    closeAlert();
    setToastMessage("회원 탈퇴되었습니다.");
  };*/
  }

  return (
    <section className="min-h-screen w-full bg-white px-4 pt-10.75 pb-20">
      <h1 className="px-3 text-[20px] leading-[19.5px] font-bold text-[#1A2236]">
        마이페이지
      </h1>

      {isPendingMyPage ? (
        <div className="flex h-58 items-center justify-center">
          <Spinner />
        </div>
      ) : (
        <>
          <div className="mt-6">
            <UserInfoCard
              name={displayedMyPageData.userName}
              role={displayedMyPageData.roleName}
              department={displayedMyPageData.organizationName}
              studentId={displayedMyPageData.studentId}
              major={displayedMyPageData.department}
            />
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3">
            {workSummaries.map((summary) => (
              <WorkSummaryCard
                key={summary.title}
                title={summary.title}
                currentHours={summary.currentHours}
                totalHours={summary.totalHours}
              />
            ))}
          </div>
        </>
      )}

      <div className="mt-6">
        <MenuCard onLogout={() => setOpenAlert("logout")} />
      </div>

      {/* <button
        className="mx-auto mt-7 block cursor-pointer text-[10px] leading-4.5 font-medium text-[#FD7171] underline underline-offset-2"
        type="button"
        onClick={() => setOpenAlert("withdraw")}
      >
        회원 탈퇴
      </button>*/}

      <Alert
        open={openAlert === "logout"}
        title="로그아웃"
        message="로그아웃 하시겠습니까?"
        onCancel={closeAlert}
        onConfirm={handleLogoutConfirm}
      />
      {/*<Alert
        open={openAlert === "withdraw"}
        title="탈퇴하시겠습니까?"
        message={"탈퇴 버튼 선택 시, 계정은 삭제되며\n복구되지 않습니다."}
        confirmText="탈퇴"
        onCancel={closeAlert}
        onConfirm={handleWithdrawConfirm}
        confirmButtonClassName="bg-[#FD7171]"
      />*/}
      <Toast
        open={toastMessage.length > 0}
        message={toastMessage}
        onDismiss={() => setToastMessage("")}
      />
    </section>
  );
}
