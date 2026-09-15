import { AuthShell } from "@/features/auth";
import { LoginForm } from "@/features/auth/login";

export default function LoginScreen() {
  return (
    <AuthShell>
      <LoginForm />
    </AuthShell>
  );
}
