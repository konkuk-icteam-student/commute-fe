import TextInput from "../text-input";

export default function TimeRangeInput({
  disabled = false,
  end,
  label,
  onEndChange,
  onStartChange,
  start,
}: {
  disabled?: boolean;
  end: string;
  label: string;
  onEndChange: (value: string) => void;
  onStartChange: (value: string) => void;
  start: string;
}) {
  return (
    <div className="min-w-0 flex-1">
      <p className="mb-2 text-[15px] font-semibold text-[#1A2236]">{label}</p>
      <div className="flex items-center gap-0.5">
        <TextInput
          ariaLabel={`${label} 최소 시간`}
          disabled={disabled}
          icon="none"
          onChange={onStartChange}
          placeholder=""
          suffix="시간"
          textAlign="right"
          value={start}
          widthClassName="w-full max-w-26.25"
        />
        <span className="text-[19px] text-[#1A2236]">~</span>
        <TextInput
          ariaLabel={`${label} 최대 시간`}
          disabled={disabled}
          icon="none"
          onChange={onEndChange}
          placeholder=""
          suffix="시간"
          textAlign="right"
          value={end}
          widthClassName="w-full max-w-26.25"
        />
      </div>
    </div>
  );
}
