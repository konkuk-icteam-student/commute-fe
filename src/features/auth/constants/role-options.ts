import { ROLE_CODE } from "@/apis/token-storage";

export const ROLE_OPTIONS = [
  { label: "학생", value: ROLE_CODE.USER },
  { label: "관리자", value: ROLE_CODE.ADMIN },
] as const;
