import { useGetAdminWorkChangeRequestsQuery } from "@/apis/admin/work-change-requests";

interface EditRequestStatusProps {
  year: number;
  month: number;
}

export default function EditRequestStatus({
  year,
  month,
}: EditRequestStatusProps) {
  const {
    adminWorkChangeRequestsData,
    isPendingAdminWorkChangeRequests,
    isErrorAdminWorkChangeRequests,
  } = useGetAdminWorkChangeRequestsQuery({
    year,
    month,
    statusCode: "ALL",
    page: 0,
    size: 1,
  });
  const summary = adminWorkChangeRequestsData?.summary;
  const completedCount = summary
    ? summary.approvedCount + summary.rejectedCount
    : 0;

  return (
    <div className="flex w-full max-w-250 flex-col items-center gap-4 rounded-xl bg-white p-8 shadow-[0_4px_4px_0_rgba(0,0,0,0.25)]">
      <div className="flex w-full">
        <h2 className="text-2xl font-bold">수정요청 현황</h2>
      </div>
      {isPendingAdminWorkChangeRequests ? (
        <p className="py-8 text-base text-[#6B7280]">
          수정요청 현황을 불러오는 중입니다.
        </p>
      ) : isErrorAdminWorkChangeRequests ? (
        <p className="py-8 text-base text-[#FD7171]">
          수정요청 현황을 불러오지 못했습니다.
        </p>
      ) : (
        <div className="flex flex-row items-center gap-10">
          <div className="flex h-35 w-50 flex-col items-center justify-center gap-3 rounded-xl border border-[#B1B8BE]">
            <span className="text-xl font-bold">대기 중인 요청</span>
            <span className="text-3xl font-bold">
              {summary?.pendingCount ?? 0}건
            </span>
          </div>
          <div className="flex h-35 w-50 flex-col items-center justify-center gap-3 rounded-xl border border-[#B1B8BE]">
            <span className="text-xl font-bold text-[#2563EB]">승인완료</span>
            <span className="text-3xl font-bold">
              {summary?.approvedCount ?? 0}건
            </span>
          </div>
          <div className="flex h-35 w-50 flex-col items-center justify-center gap-3 rounded-xl border border-[#B1B8BE]">
            <span className="text-xl font-bold text-[#FD7171]">반려</span>
            <span className="text-3xl font-bold">
              {summary?.rejectedCount ?? 0}건
            </span>
          </div>
          <div className="flex h-35 w-50 flex-col items-center justify-center gap-3 rounded-xl border border-[#B1B8BE]">
            <span className="text-xl font-bold">처리된 요청</span>
            <span className="text-3xl font-bold">{completedCount}건</span>
          </div>
        </div>
      )}
    </div>
  );
}
