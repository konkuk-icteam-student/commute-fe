import { AuthMode } from "../types";

interface AuthHeaderProps {
  authMode: AuthMode;
  handleChangeForm: (authMode: AuthMode) => void;
}

export default function AuthHeader({
  authMode,
  handleChangeForm,
}: AuthHeaderProps) {
  return (
    <header className="flex h-40 w-full items-center justify-center bg-[rgba(81,168,255,0.07)]">
      AuthHeader
    </header>
  );
}
