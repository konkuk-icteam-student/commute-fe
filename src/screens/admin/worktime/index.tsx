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
  // TODO: 서버에 검색어 조회 요청
  const handleSearch = () => {
    console.log(searchText, "검색");
    setSearchText("");
    setUserResult(searchText);
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
        handleSearch={handleSearch}
        handleReset={handleReset}
      />
      <WorktimeEditRequestSection
        userResult={userResult}
        handleClickRequestCard={handleClickRequestCard}
      />
    </div>
  );
}
