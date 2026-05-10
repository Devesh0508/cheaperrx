import Link from "next/link";
import { signIn } from "@/lib/actions/auth";
import { GoogleButton } from "@/components/auth/GoogleButton";

interface LoginPageProps {
  searchParams: { error?: string; redirectTo?: string; success?: string };
}

export default function LoginPage({ searchParams }: LoginPageProps) {
  const { error, redirectTo, success } = searchParams;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex flex-col">

      {/* Simple top bar */}
      <header className="px-4 sm:px-6 py-4 border-b border-gray-100 bg-white">
        <Link href="/" className="flex items-center gap-2 w-fit">
          <span className="text-2xl" aria-hidden="true">💊</span>
          <span className="text-xl font-bold text-[#1a1a2e]">CheaperRx</span>
        </Link>
      </header>

      <main className="flex-1 flex items-start justify-center px-4 py-12">
        <div className="w-full max-w-md">

          <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-8 sm:p-10">

            <div className="text-center mb-8">
              <div className="text-5xl mb-3" aria-hidden="true">👋</div>
              <h1 className="text-3xl font-bold text-[#1a1a2e] mb-2">
                Welcome back!
              </h1>
              <p className="text-xl text-gray-500">
                Log in to see your saved medications and alerts.
              </p>
            </div>

            {/* Success message (e.g. after password reset email sent) */}
            {success === "check_email" && (
              <div role="alert" className="mb-6 bg-green-50 border border-green-200 rounded-xl p-4 text-green-800 text-lg">
                ✅ Check your email — we sent you a link to reset your password.
              </div>
            )}

            {/* Error messages */}
            {error && (
              <div role="alert" className="mb-6 bg-amber-50 border border-amber-200 rounded-xl p-4 text-amber-800 text-lg">
                {error === "invalid_credentials"
                  ? "That email or password doesn't look right. Please try again."
                  : error === "auth_failed"
                  ? "Sign-in didn't work. Please try again."
                  : error === "reset_link_expired"
                  ? "That reset link has expired. Please request a new one below."
                  : "Something went wrong. Please try again."}
              </div>
            )}

            {/* Google */}
            <GoogleButton />

            {/* Divider */}
            <div className="relative my-6" aria-hidden="true">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-white px-4 text-gray-400 text-lg">or use your email</span>
              </div>
            </div>

            {/* Login form */}
            <form action={signIn} className="space-y-5" noValidate>
              {redirectTo && (
                <input type="hidden" name="redirectTo" value={redirectTo} />
              )}

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-lg font-semibold text-[#1a1a2e] mb-2">
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="you@example.com"
                  className="input-field"
                />
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label htmlFor="password" className="text-lg font-semibold text-[#1a1a2e]">
                    Password
                  </label>
                  <Link
                    href="/forgot-password"
                    className="text-[#0891B2] text-base hover:underline"
                  >
                    Forgot your password?
                  </Link>
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  placeholder="Your password"
                  className="input-field"
                />
              </div>

              <button type="submit" className="btn-primary w-full mt-2">
                Log Me In →
              </button>
            </form>

            {/* Forgot password help */}
            <p className="text-center text-gray-500 text-lg mt-5">
              Forgot your password?{" "}
              <Link href="/forgot-password" className="text-[#0891B2] font-semibold hover:underline">
                Click here — we&apos;ll email you a link to reset it.
              </Link>
            </p>
          </div>

          {/* Sign up link */}
          <p className="text-center text-xl text-gray-500 mt-6">
            New to CheaperRx?{" "}
            <Link href="/signup" className="text-[#0891B2] font-semibold hover:underline">
              Create a free account →
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
