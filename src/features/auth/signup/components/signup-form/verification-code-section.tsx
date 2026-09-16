import { Button, Input } from "@/components/ui";

type InputState = "default" | "active" | "error" | "success";

interface VerificationCodeSectionProps {
  code: string;
  onCodeChange: (code: string) => void;
  codeState: InputState;
  verificationErrorMessage: string;
  canVerifyCode: boolean;
  isPendingVerifyCode: boolean;
  onVerifyCode: () => void;
}

export default function VerificationCodeSection({
  code,
  onCodeChange,
  codeState,
  verificationErrorMessage,
  canVerifyCode,
  isPendingVerifyCode,
  onVerifyCode,
}: VerificationCodeSectionProps) {
  return (
    <div className="mb-3.75 flex flex-col gap-2.5 px-2">
      <Input
        label="인증번호"
        inputMode="numeric"
        placeholder="인증번호를 입력해 주세요"
        value={code}
        onChange={(event) => onCodeChange(event.target.value)}
        state={codeState}
      />
      <div className="flex items-start justify-between gap-3">
        {verificationErrorMessage ? (
          <p className="min-w-0 flex-1 text-[14px] font-medium text-[#FF5B4D]">
            {verificationErrorMessage}
          </p>
        ) : (
          <span className="min-w-0 flex-1" />
        )}
        <Button type="button" disabled={!canVerifyCode} onClick={onVerifyCode}>
          {isPendingVerifyCode ? "확인 중" : "인증 확인"}
        </Button>
      </div>
    </div>
  );
}
