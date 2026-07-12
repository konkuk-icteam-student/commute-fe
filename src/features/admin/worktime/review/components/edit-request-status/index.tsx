interface EditRequestStatusProps {
  year: number;
  month: number;
}

// TODO: 추후 서버 api를 통해 받아옴
const DUMMY_STATUS = {
  pending: 12,
  confirmed: 4,
  rejected: 5,
  completed: 9,
};

export default function EditRequestStatus({
  year,
  month,
}: EditRequestStatusProps) {
  console.log(year, month, "로 서버에 요청");

  return (
    <div className="flex w-full max-w-250 flex-col items-center gap-4 rounded-xl bg-white p-8 shadow-[0_4px_4px_0_rgba(0,0,0,0.25)]">
      <div className="flex w-full">
        <h2 className="text-2xl font-bold">수정요청 현황</h2>
      </div>
      <div className="flex flex-row items-center gap-10">
        <div className="flex h-35 w-50 flex-col items-center justify-center gap-3 rounded-xl border border-[#B1B8BE]">
          <span className="text-xl font-bold">대기 중인 요청</span>
          <span className="text-3xl font-bold">{DUMMY_STATUS.pending}건</span>
        </div>
        <div className="flex h-35 w-50 flex-col items-center justify-center gap-3 rounded-xl border border-[#B1B8BE]">
          <span className="text-xl font-bold text-[#2563EB]">승인완료</span>
          <span className="text-3xl font-bold">{DUMMY_STATUS.confirmed}건</span>
        </div>
        <div className="flex h-35 w-50 flex-col items-center justify-center gap-3 rounded-xl border border-[#B1B8BE]">
          <span className="text-xl font-bold text-[#FD7171]">반려</span>
          <span className="text-3xl font-bold">{DUMMY_STATUS.rejected}건</span>
        </div>
        <div className="flex h-35 w-50 flex-col items-center justify-center gap-3 rounded-xl border border-[#B1B8BE]">
          <span className="text-xl font-bold">처리된 요청</span>
          <span className="text-3xl font-bold">{DUMMY_STATUS.completed}건</span>
        </div>
      </div>
    </div>
  );
}
