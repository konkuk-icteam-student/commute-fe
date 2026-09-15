import { AuthShell } from "@/features/auth";
import { SignupForm } from "@/features/auth/signup";

const SIGNUP_FORM_ID = "signup-form";

export default function SignupScreen() {
  return (
    <AuthShell>
      <SignupForm id={SIGNUP_FORM_ID} />
    </AuthShell>
  );
}
