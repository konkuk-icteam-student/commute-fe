import Link from "next/link";
import { Button } from "@/components/ui/button";

export function LoginForm() {
  return (
    <form className="space-y-5">
      <div className="space-y-2">
        <label className="text-sm font-semibold text-gray-800" htmlFor="email">
          Email
        </label>
        <input
          autoComplete="email"
          className="h-11 w-full rounded-md border border-gray-300 bg-white px-3 text-sm text-gray-950 transition-colors outline-none placeholder:text-gray-400 focus:border-gray-950"
          id="email"
          name="email"
          placeholder="student@konkuk.ac.kr"
          type="email"
        />
      </div>
      <div className="space-y-2">
        <label
          className="text-sm font-semibold text-gray-800"
          htmlFor="password"
        >
          Password
        </label>
        <input
          autoComplete="current-password"
          className="h-11 w-full rounded-md border border-gray-300 bg-white px-3 text-sm text-gray-950 transition-colors outline-none placeholder:text-gray-400 focus:border-gray-950"
          id="password"
          name="password"
          placeholder="Enter your password"
          type="password"
        />
      </div>
      <div className="flex items-center justify-between text-sm">
        <label className="flex items-center gap-2 text-gray-600">
          <input className="size-4 rounded border-gray-300" type="checkbox" />
          Remember me
        </label>
        <Link className="font-semibold text-emerald-700" href="/login">
          Forgot password?
        </Link>
      </div>
      <Button className="w-full" type="submit">
        Sign in
      </Button>
    </form>
  );
}
