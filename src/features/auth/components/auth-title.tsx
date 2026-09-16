import { cn } from "@/lib/utils";

interface AuthTitleProps {
  title: string;
  className?: string;
}

export default function AuthTitle({ title, className }: AuthTitleProps) {
  return (
    <div className={cn("mb-7 ml-px", className)}>
      <p className="mb-3.75 text-[12px] font-bold tracking-[0.015em] text-[#8892A6]">
        출근부 시스템
      </p>
      <h1 className="text-2xl font-bold text-[#434343]">{title}</h1>
    </div>
  );
}
