import Link from "next/link";
import { signUp } from "@/lib/actions/auth";
import { GoogleButton } from "@/components/auth/GoogleButton";

const PROVINCES = [
  { value: "AB", label: "Alberta" },
  { value: "BC", label: "British Columbia" },
  { value: "MB", label: "Manitoba" },
  { value: "NB", label: "New Brunswick" },
  { value: "NL", label: "Newfoundland and Labrador" },
  { value: "NS", label: "Nova Scotia" },
  { value: "NT", label: "Northwest Territories" },
  { value: "NU", label: "Nunavut" },
  { value: "ON", label: "Ontario" },
  { value: "PE", label: "Prince Edward Island" },
  { value: "QC", label: "Quebec" },
  { value: "SK", label: "Saskatchewan" },
  { value: "YT", label: "Yukon" },
];

const CITIES: Record<string, string[]> = {
  AB: ["Calgary", "Edmonton", "Red Deer", "Lethbridge", "Medicine Hat", "Grande Prairie", "Airdrie", "Spruce Grove"],
  BC: ["Vancouver", "Victoria", "Kelowna", "Abbotsford", "Kamloops", "Nanaimo", "Prince George"],
  ON: ["Toronto", "Ottawa", "Mississauga", "Brampton", "Hamilton", "London", "Markham", "Kitchener"],
  QC: ["Montreal", "Quebec City", "Laval", "Gatineau", "Longueuil", "Sherbrooke"],
  SK: ["Saskatoon", "Regina", "Prince Albert", "Moose Jaw"],
  MB: ["Winnipeg", "Brandon", "Steinbach"],
};

interface SignupPageProps {
  searchParams: { error?: string };
}

export default function SignupPage({ searchParams }: SignupPageProps) {
  const error = searchParams.error;

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
        <div className="w-full max-w-lg">

          {/* Card */}
          <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-8 sm:p-10">

            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-[#1a1a2e] mb-2">
                Create your free account
              </h1>
              <p className="text-xl text-gray-500">
                Takes less than a minute. No credit card needed.
              </p>
            </div>

            {/* Error message */}
            {error && (
              <div
                role="alert"
                className="mb-6 bg-amber-50 border border-amber-200 rounded-xl p-4 text-amber-800 text-lg"
              >
                {error === "already_registered"
                  ? "That email is already registered. Try logging in instead."
                  : "Something went wrong. Please try again."}
              </div>
            )}

            {/* Google sign-in */}
            <GoogleButton />

            {/* Divider */}
            <div className="relative my-6" aria-hidden="true">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-white px-4 text-gray-400 text-lg">or sign up with email</span>
              </div>
            </div>

            {/* Sign-up form */}
            <form action={signUp} className="space-y-5" noValidate>
              {/* Full Name */}
              <div>
                <label htmlFor="fullName" className="block text-lg font-semibold text-[#1a1a2e] mb-2">
                  Your full name
                </label>
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  autoComplete="name"
                  required
                  placeholder="e.g. Margaret Smith"
                  className="input-field"
                />
              </div>

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
                <label htmlFor="password" className="block text-lg font-semibold text-[#1a1a2e] mb-2">
                  Choose a password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  placeholder="At least 8 characters"
                  className="input-field"
                  minLength={8}
                />
                <p className="text-gray-400 text-base mt-1">
                  Tip: tap the eye icon in your keyboard to see what you&apos;re typing
                </p>
              </div>

              {/* Province + City row */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="province" className="block text-lg font-semibold text-[#1a1a2e] mb-2">
                    Province
                  </label>
                  <select
                    id="province"
                    name="province"
                    required
                    defaultValue="AB"
                    className="input-field bg-white cursor-pointer"
                    aria-label="Select your province"
                  >
                    {PROVINCES.map(({ value, label }) => (
                      <option key={value} value={value}>{label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="city" className="block text-lg font-semibold text-[#1a1a2e] mb-2">
                    City
                  </label>
                  <select
                    id="city"
                    name="city"
                    required
                    defaultValue="Calgary"
                    className="input-field bg-white cursor-pointer"
                    aria-label="Select your city"
                  >
                    {(CITIES.AB).map((city) => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Submit */}
              <button type="submit" className="btn-primary w-full mt-2">
                Create My Free Account →
              </button>
            </form>

            {/* Terms */}
            <p className="text-center text-gray-400 text-base mt-5 leading-relaxed">
              By signing up you agree to our{" "}
              <Link href="/terms" className="underline hover:text-[#0891B2]">Terms of Service</Link>.
              <br />
              We never sell your information. Ever.
            </p>
          </div>

          {/* Already have account */}
          <p className="text-center text-xl text-gray-500 mt-6">
            Already have an account?{" "}
            <Link href="/login" className="text-[#0891B2] font-semibold hover:underline">
              Log in here →
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
