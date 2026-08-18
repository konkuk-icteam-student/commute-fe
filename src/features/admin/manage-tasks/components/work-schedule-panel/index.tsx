import Image from "next/image";
import Link from "next/link";
import { memo } from "react";

import checkCircleIcon from "@/assets/icons/admin-common/ic_check_circle.svg";
import chevronRightIcon from "@/assets/icons/admin-common/ic_chevron_right_gray.svg";
import { AdminWorkScheduleList, type BadgeVariant } from "@/components/ui";

import type { ManageTaskScheduleGroup } from "../../types";

const workerToneClass: Record<BadgeVariant, string> = {
  "status-working": "bg-[#DBEAFE] text-[#1D4ED8]",
  "status-scheduled": "bg-[#F0F2F8] text-[#8892A6]",
  "status-absent": "bg-[#FFE4E4] text-[#FD7171]",
  "status-completed": "bg-[#DCFCE7] text-[#41C26D]",
  "student-blue": "bg-[#DBEAFE] text-[#5A7BC8]",
  "student-green": "bg-[#D7FAE3] text-[#66C185]",
  "student-red": "bg-[#FFE4E4] text-[#FD7171]",
  "student-orange": "bg-[#FFE8C7] text-[#D79430]",
  "student-cyan": "bg-[#D5EEF1] text-[#50A8B1]",
  "student-pink": "bg-[#FBDDEA] text-[#D8679B]",
  "student-purple": "bg-[#E6DDF5] text-[#8266C3]",
};

function WorkSchedulePanel({
  groups,
  isError = false,
  isLoading = false,
}: {
  groups: ManageTaskScheduleGroup[];
  isError?: boolean;
  isLoading?: boolean;
}) {
  return (
    <section className="rounded-lg border border-[#DDE3EF] bg-white p-4">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2 text-[17px] font-bold text-[#1A2236]">
          <Image src={checkCircleIcon} alt="" width={20} height={20} />
          근로 스케쥴
        </div>
        <Link
          href="/admin/worktime/detail"
          className="flex h-5 w-5 items-center justify-center"
          aria-label="근로 스케쥴 상세"
        >
          <Image src={chevronRightIcon} alt="" width={16} height={16} />
        </Link>
      </div>

      {isLoading ? (
        <p className="py-16 text-center text-[13px] font-bold text-[#8892A6]">
          근로 스케쥴을 불러오는 중입니다.
        </p>
      ) : isError ? (
        <p className="py-16 text-center text-[13px] font-bold text-[#8892A6]">
          근로 스케쥴을 불러오지 못했습니다.
        </p>
      ) : groups.every((group) => group.items.length === 0) ? (
        <p className="py-16 text-center text-[13px] font-bold text-[#8892A6]">
          등록된 근로 스케쥴이 없습니다.
        </p>
      ) : (
        <AdminWorkScheduleList
          groups={groups.map((group) => ({
            title: group.title,
            workerShape: "rounded",
            rows: group.items.map((item) => ({
              countLabel: `${item.students.length}명`,
              time: item.time,
              workers: item.students.map((student) => ({
                className: workerToneClass[student.tone],
                name: student.name,
              })),
            })),
          }))}
          variant="dashboard"
        />
      )}
    </section>
  );
}

export default memo(WorkSchedulePanel);
