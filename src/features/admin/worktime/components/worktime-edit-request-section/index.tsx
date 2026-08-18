import { useGetAllAdminWorkChangeRequestsQuery } from "@/apis/admin/work-change-requests";

import { toWorktimeEditRequestItems } from "../../utils";
import WorktimeEditRequestHeader from "../worktime-edit-request-header";
import WorktimeEditRequestItem from "../worktime-edit-request-item";

interface WorktimeEditRequestSectionProps {
  userResult: string;
  handleClickRequestCard: (userId: number, name: string) => void;
}

export default function WorktimeEditRequestSection({
  userResult,
  handleClickRequestCard,
}: WorktimeEditRequestSectionProps) {
  const date = new Date();
  const {
    allAdminWorkChangeRequestsData,
    isPendingAllAdminWorkChangeRequests,
    isErrorAllAdminWorkChangeRequests,
  } = useGetAllAdminWorkChangeRequestsQuery({
    year: date.getFullYear(),
    month: date.getMonth() + 1,
    statusCode: "CS01",
    size: 100,
  });
  const editRequests = allAdminWorkChangeRequestsData
    ? toWorktimeEditRequestItems(allAdminWorkChangeRequestsData)
    : [];
  const requestIds = editRequests.map((request) => request.requestId);

  return (
    <div className="flex flex-col gap-4 rounded-xl bg-[#F4F5F6] p-6">
      <WorktimeEditRequestHeader requestIds={requestIds} />
      <div className="flex max-h-200 flex-col gap-4 overflow-auto">
        {isPendingAllAdminWorkChangeRequests ? (
          <p className="py-8 text-center text-base text-[#6B7280]">
            수정 요청을 불러오는 중입니다.
          </p>
        ) : isErrorAllAdminWorkChangeRequests ? (
          <p className="py-8 text-center text-base text-[#FD7171]">
            수정 요청을 불러오지 못했습니다.
          </p>
        ) : editRequests.length === 0 ? (
          <p className="py-8 text-center text-base text-[#6B7280]">
            처리할 요청이 없습니다.
          </p>
        ) : null}
        {editRequests.map((item) => (
          <WorktimeEditRequestItem
            key={item.requestId}
            type="CARD"
            {...item}
            userResult={userResult}
            handleClickRequestCard={handleClickRequestCard}
          />
        ))}
      </div>
    </div>
  );
}
