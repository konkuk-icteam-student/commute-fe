"use client";

import { ChangeEvent, useState } from "react";

import {
  WorktimeEditRequestSection,
  WorktimeScheduleSection,
} from "@/features/admin/worktime";

export default function WorktimeScreen() {
  const [searchText, setSearchText] = useState("");
  const [userResult, setUserResult] = useState("");

  const handleChangeText = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
  };
  // TODO: 서버에 특정 인원의 시간표 조회 요청
  const handleGetMemberSchedule = (name: string) => {
    console.log(name, "의 시간표 조회");
    setSearchText("");
    setUserResult(name);
  };

  const handleReset = () => {
    setSearchText("");
    setUserResult("");
    console.log("서버에 빈 스트링으로 요청");
  };

  const handleClickRequestCard = (name: string) => {
    setUserResult(name);
  };

  return (
    <div className="flex justify-center gap-6">
      <WorktimeScheduleSection
        searchText={searchText}
        userResult={userResult}
        handleChangeText={handleChangeText}
        handleGetMemberSchedule={handleGetMemberSchedule}
        handleReset={handleReset}
      />
      <WorktimeEditRequestSection
        userResult={userResult}
        handleClickRequestCard={handleClickRequestCard}
      />
    </div>
  );
}
