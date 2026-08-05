import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// 조건부 클래스를 합치고, 같은 속성끼리 부딪히면 뒤에 온 것만 남긴다.
// 단순히 이어 붙이면 "cursor-pointer cursor-not-allowed"처럼 둘 다 남아
// 인자 순서가 아니라 생성된 css 순서가 승자를 정해 버린다.
export function cn(...classes: ClassValue[]) {
  return twMerge(clsx(classes));
}
