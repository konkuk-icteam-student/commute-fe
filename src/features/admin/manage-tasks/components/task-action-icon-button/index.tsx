import Image from "next/image";

export default function TaskActionIconButton({
  defaultIcon,
  hoverIcon,
  label,
  onClick,
}: {
  defaultIcon: string;
  hoverIcon: string;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      className="group relative flex h-6 w-6 items-center justify-center"
      onClick={onClick}
    >
      <Image
        src={defaultIcon}
        alt=""
        width={24}
        height={24}
        className="h-6 w-6 shrink-0 group-hover:opacity-0"
      />
      <Image
        src={hoverIcon}
        alt=""
        width={24}
        height={24}
        className="absolute h-6 w-6 shrink-0 opacity-0 group-hover:opacity-100"
      />
    </button>
  );
}
