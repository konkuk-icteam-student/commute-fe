import homeActiveIcon from "@/assets/icons/nav/home-active-icon.svg";
import homeIcon from "@/assets/icons/nav/home-icon.svg";
import mypageActiveIcon from "@/assets/icons/nav/mypage-active-icon.svg";
import mypageIcon from "@/assets/icons/nav/mypage-icon.svg";
import tasksActiveIcon from "@/assets/icons/nav/tasks-active-icon.svg";
import tasksIcon from "@/assets/icons/nav/tasks-icon.svg";
import timeActiveIcon from "@/assets/icons/nav/time-active-icon.svg";
import timeIcon from "@/assets/icons/nav/time-icon.svg";

const assetSrc = (asset: string | { src: string }) =>
  typeof asset === "string" ? asset : asset.src;

export const userNavigationItems = [
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
