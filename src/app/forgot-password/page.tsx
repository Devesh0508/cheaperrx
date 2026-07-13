import Link from "next/link";
import { resetPassword } from "@/lib/actions/auth";

interface ForgotPasswordPageProps {
  searchParams: { error?: string; success?: string };
}

export default function ForgotPasswordPage({ searchParams }: ForgotPasswordPageProps) {
  const { error, success } = searchParams;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex flex-col">

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
              <div className="text-5xl mb-3" aria-hidden="true">📧</div>
              <h1 className="text-3xl font-bold text-[#1a1a2e] mb-2">
                Reset your password
              </h1>
              <p className="text-xl text-gray-500">
                Enter your email and we&apos;ll send you a link to reset it. No fuss.
              </p>
            </div>

            {success === "check_email" ? (
              <div className="text-center space-y-6">
                <div className="bg-green-50 border border-green-200 rounded-2xl p-6">
                  <p className="text-3xl mb-3">✅</p>
                  <p className="text-xl font-semibold text-green-800 mb-2">
                    Email sent!
                  </p>
                  <p className="text-green-700 text-lg">
                    Check your inbox for a link to reset your password.
                    It may take a minute or two to arrive.
                  </p>
                </div>
                <p className="text-gray-500 text-lg">
                  Didn&apos;t get it? Check your spam folder or{" "}
                  <Link href="/forgot-password" className="text-[#0891B2] font-semibold hover:underline">
                    try again
                  </Link>.
                </p>
              </div>
            ) : (
              <>
                {error && (
                  <div role="alert" className="mb-6 bg-amber-50 border border-amber-200 rounded-xl p-4 text-amber-800 text-lg">
                    Something went wrong. Please try again or email us at help@cheaperx.ca
                  </div>
                )}

                <form action={resetPassword} className="space-y-5" noValidate>
                  <div>
                    <label htmlFor="email" className="block text-lg font-semibold text-[#1a1a2e] mb-2">
                      Your email address
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

                  <button type="submit" className="btn-primary w-full">
                    Send Me a Reset Link →
                  </button>
                </form>
              </>
            )}
          </div>

          <p className="text-center text-xl text-gray-500 mt-6">
            Remembered it?{" "}
            <Link href="/login" className="text-[#0891B2] font-semibold hover:underline">
              Back to Log In →
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
