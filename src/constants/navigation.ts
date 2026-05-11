export const navigationItems = [
  { label: "Dashboard", href: "/" },
  { label: "Records", href: "/" },
  { label: "Members", href: "/" },
  { label: "Settings", href: "/" },
];

export const userNavigationItems = [
  {
    label: "홈",
    href: "/",
    icon: "/icons/nav/home-icon.svg",
    activeIcon: "/icons/nav/home-active-icon.svg",
  },
  {
    label: "근로시간",
    href: "/work-hours",
    icon: "/icons/nav/time-icon.svg",
    activeIcon: "/icons/nav/time-active-icon.svg",
  },
  {
    label: "업무관리",
    href: "/daily-tasks",
    icon: "/icons/nav/tasks-icon.svg",
    activeIcon: "/icons/nav/tasks-active-icon.svg",
  },
  {
    label: "마이페이지",
    href: "/my-page",
    icon: "/icons/nav/mypage-icon.svg",
    activeIcon: "/icons/nav/mypage-active-icon.svg",
  },
] as const;
