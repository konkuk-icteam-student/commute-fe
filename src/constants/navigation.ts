import homeActiveIcon from "@/assets/icons/nav/home-active-icon.svg";
import homeIcon from "@/assets/icons/nav/home-icon.svg";
import mypageActiveIcon from "@/assets/icons/nav/mypage-active-icon.svg";
import mypageIcon from "@/assets/icons/nav/mypage-icon.svg";
import tasksActiveIcon from "@/assets/icons/nav/tasks-active-icon.svg";
import tasksIcon from "@/assets/icons/nav/tasks-icon.svg";
import timeActiveIcon from "@/assets/icons/nav/time-active-icon.svg";
import timeIcon from "@/assets/icons/nav/time-icon.svg";
import dashboardActiveIcon from "@/assets/icons/admin-nav/ic_dashboard_active.svg";
import dashboardIcon from "@/assets/icons/admin-nav/ic_dashboard.svg";
import memberActiveIcon from "@/assets/icons/admin-nav/ic_member_management_active.svg";
import memberIcon from "@/assets/icons/admin-nav/ic_member_management.svg";
import taskActiveIcon from "@/assets/icons/admin-nav/ic_task_management_active.svg";
import taskIcon from "@/assets/icons/admin-nav/ic_task_management.svg";
import workRequestActiveIcon from "@/assets/icons/admin-nav/ic_work_request_active.svg";
import workRequestIcon from "@/assets/icons/admin-nav/ic_work_request.svg";
import worktimeActiveIcon from "@/assets/icons/admin-nav/ic_worktime_active.svg";
import worktimeIcon from "@/assets/icons/admin-nav/ic_worktime.svg";

const assetSrc = (asset: string | { src: string }) =>
  typeof asset === "string" ? asset : asset.src;

export const USER_NAVIGATION_ITEMS = [
  {
    label: "홈",
    href: "/",
    icon: assetSrc(homeIcon),
    iconSize: { width: 16, height: 18 },
    activeIcon: assetSrc(homeActiveIcon),
    activeIconSize: { width: 16, height: 18 },
  },
  {
    label: "근로시간",
    href: "/schedule",
    icon: assetSrc(timeIcon),
    iconSize: { width: 17, height: 17 },
    activeIcon: assetSrc(timeActiveIcon),
    activeIconSize: { width: 17, height: 17 },
  },
  {
    label: "업무관리",
    href: "/daily-tasks",
    icon: assetSrc(tasksIcon),
    iconSize: { width: 15, height: 19 },
    activeIcon: assetSrc(tasksActiveIcon),
    activeIconSize: { width: 15, height: 19 },
  },
  {
    label: "마이페이지",
    href: "/my-page",
    icon: assetSrc(mypageIcon),
    iconSize: { width: 17, height: 21 },
    activeIcon: assetSrc(mypageActiveIcon),
    activeIconSize: { width: 16, height: 20 },
  },
] as const;

export const ADMIN_NAVIGATION_ITEMS = [
  {
    label: "메인 대시보드",
    href: "/admin",
    icon: assetSrc(dashboardIcon),
    activeIcon: assetSrc(dashboardActiveIcon),
    iconSize: { width: 32, height: 32 },
  },
  {
    label: "근로시간 관리",
    href: "/admin/worktime",
    icon: assetSrc(worktimeIcon),
    activeIcon: assetSrc(worktimeActiveIcon),
    iconSize: { width: 32, height: 32 },
  },
  {
    label: "근로신청 관리",
    href: "/admin/work-request",
    icon: assetSrc(workRequestIcon),
    activeIcon: assetSrc(workRequestActiveIcon),
    iconSize: { width: 32, height: 32 },
  },
  {
    label: "인원 관리",
    href: "/admin/members",
    icon: assetSrc(memberIcon),
    activeIcon: assetSrc(memberActiveIcon),
    iconSize: { width: 32, height: 32 },
  },
  {
    label: "업무 관리",
    href: "/admin/manage-tasks",
    icon: assetSrc(taskIcon),
    activeIcon: assetSrc(taskActiveIcon),
    iconSize: { width: 26, height: 32 },
  },
] as const;

export const ADMIN_ROUTE_META = [
  {
    href: "/admin/worktime/detail",
    label: "근로시간 관리 - 근로시간표",
    showBackButton: true,
  },
  {
    href: "/admin/worktime/edit",
    label: "근로시간 관리 - 근로시간표",
    showBackButton: true,
  },
  {
    href: "/admin/work-request/review",
    label: "근로신청 관리 - 근로시간 수정요청",
    showBackButton: true,
  },
] as const;
