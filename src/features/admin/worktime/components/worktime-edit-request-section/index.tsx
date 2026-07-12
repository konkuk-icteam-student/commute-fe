import { DUMMY_WORKTIME_EDIT_REQUEST } from "../../constants";
import WorktimeEditRequestHeader from "../worktime-edit-request-header";
import WorktimeEditRequestItem from "../worktime-edit-request-item";

interface WorktimeEditRequestSectionProps {
  userResult: string;
  handleClickRequestCard: (name: string) => void;
}

export default function WorktimeEditRequestSection({
  userResult,
  handleClickRequestCard,
}: WorktimeEditRequestSectionProps) {
  return (
    <div className="flex flex-col gap-4 rounded-xl bg-[#F4F5F6] p-6">
      <WorktimeEditRequestHeader />
      {DUMMY_WORKTIME_EDIT_REQUEST.map((item) => (
        <WorktimeEditRequestItem
          key={item.requestId}
          type="CARD"
          {...item}
          userResult={userResult}
          handleClickRequestCard={handleClickRequestCard}
        />
      ))}
    </div>
  );
}
