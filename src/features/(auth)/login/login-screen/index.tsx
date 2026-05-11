import LoginForm from "../login-form";

export default function LoginScreen() {
  return (
    <main className="flex min-h-screen w-full flex-col gap-8 p-6">
      <section className="mt-25 flex flex-col gap-4">
        <span className="font text-xs text-[#8892A6]">
          건국대학교 정보운영팀
        </span>
        <h1 className="text-2xl font-bold text-[#434343]">로그인</h1>
      </section>
      <LoginForm />
    </main>
  );
}
