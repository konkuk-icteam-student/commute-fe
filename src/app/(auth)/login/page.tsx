import Link from "next/link";
import { LoginForm } from "@/features/auth/components/login-form";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen bg-gray-50">
      <section className="hidden w-1/2 border-r border-gray-200 bg-gray-950 px-12 py-10 text-white lg:flex lg:flex-col lg:justify-between">
        <Link className="text-lg font-bold" href="/">
          Commute
        </Link>
        <div className="max-w-lg">
          <p className="mb-4 text-sm font-semibold tracking-wide text-emerald-300 uppercase">
            Campus attendance
          </p>
          <h1 className="text-5xl leading-tight font-bold">
            Manage daily commute records with less friction.
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-300">
            Keep student check-ins, locations, and late arrivals easy to review
            from one focused dashboard.
          </p>
        </div>
        <p className="text-sm text-gray-400">Konkuk ICTeam Student</p>
      </section>

      <section className="flex flex-1 items-center justify-center px-5 py-12">
        <div className="w-full max-w-md rounded-lg border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="mb-8">
            <Link
              className="mb-8 inline-block text-base font-bold lg:hidden"
              href="/"
            >
              Commute
            </Link>
            <h2 className="text-2xl font-bold text-gray-950">Sign in</h2>
            <p className="mt-2 text-sm leading-6 text-gray-600">
              Use your account to continue to the commute dashboard.
            </p>
          </div>
          <LoginForm />
        </div>
      </section>
    </main>
  );
}
