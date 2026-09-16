import { Input } from "@/components/ui";

type InputState = "default" | "active" | "error" | "success";

interface PasswordSectionProps {
  password: string;
  onPasswordChange: (password: string) => void;
  passwordConfirm: string;
  onPasswordConfirmChange: (passwordConfirm: string) => void;
  passwordConfirmState: InputState;
}

export default function PasswordSection({
  password,
  onPasswordChange,
  passwordConfirm,
  onPasswordConfirmChange,
  passwordConfirmState,
}: PasswordSectionProps) {
  return (
    <div className="flex flex-col gap-3.75 px-2">
      <Input
        label="비밀번호"
        type="password"
        placeholder="비밀번호를 설정해 주세요"
        value={password}
        onChange={(event) => onPasswordChange(event.target.value)}
        state={password ? "active" : "default"}
        autoComplete="new-password"
      />
      <Input
        label="비밀번호 확인"
        type="password"
        placeholder="비밀번호를 다시 입력해 주세요"
        value={passwordConfirm}
        onChange={(event) => onPasswordConfirmChange(event.target.value)}
        state={passwordConfirmState}
        autoComplete="new-password"
      />
    </div>
  );
}
