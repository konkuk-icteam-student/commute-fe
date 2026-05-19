import Image from "next/image";
import homeRefreshIcon from "@/assets/icons/home-refresh-icon.svg";

type DateRefreshButtonProps = {
  currentDateTime: string;
  onRefresh: () => void;
};

export default function DateRefreshButton({
  currentDateTime,
  onRefresh,
}: DateRefreshButtonProps) {
  return (
    <button
      className="mt-5.5 ml-1.25 inline-flex h-6.5 w-fit min-w-51.25 max-w-full cursor-pointer items-center justify-center gap-1 rounded-[20px] border border-[#DDE3EF] bg-[#F0F2F8] px-3 text-[12px] leading-5 font-bold text-[#8892A6]"
      onClick={onRefresh}
      type="button"
    >
      <Image
        alt=""
        aria-hidden="true"
        className="shrink-0"
        src={homeRefreshIcon}
        width={12}
        height={12}
      />
      <span className="min-w-0 truncate">{currentDateTime}</span>
    </button>
  );
}
