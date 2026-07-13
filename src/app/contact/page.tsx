import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { sendContactMessage } from "@/lib/actions/contact";

export const metadata = {
  title: "Contact Us — CheaperRx",
  description: "Get in touch with the CheaperRx team. We're here to help with questions about medication prices, your account, or anything else.",
};

export default function ContactPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <main className="flex-1 px-4 sm:px-6 py-12">
        <div className="max-w-5xl mx-auto">

          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-[#1a1a2e] mb-3">Get in touch</h1>
            <p className="text-xl text-gray-500">
              Have a question, found a price error, or want to partner with us? We&apos;d love to hear from you.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

            {/* Left: Contact form */}
            <div className="bg-white rounded-2xl border border-gray-200 p-8">
              <h2 className="text-2xl font-bold text-[#1a1a2e] mb-6">Send us a message</h2>
              <form action={sendContactMessage} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                      First name
                    </label>
                    <input
                      name="first_name"
                      required
                      placeholder="Devesh"
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-base focus:outline-none focus:border-[#0891B2] focus:ring-1 focus:ring-[#0891B2] transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                      Last name
                    </label>
                    <input
                      name="last_name"
                      placeholder="Ojha"
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-base focus:outline-none focus:border-[#0891B2] focus:ring-1 focus:ring-[#0891B2] transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Email address
                  </label>
                  <input
                    name="email"
                    type="email"
                    required
                    placeholder="you@example.com"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-base focus:outline-none focus:border-[#0891B2] focus:ring-1 focus:ring-[#0891B2] transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Subject
                  </label>
                  <select
                    name="subject"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-base focus:outline-none focus:border-[#0891B2] focus:ring-1 focus:ring-[#0891B2] transition-colors bg-white"
                  >
                    <option value="general">General question</option>
                    <option value="price_error">Report a price error</option>
                    <option value="billing">Billing / subscription</option>
                    <option value="missing_drug">Missing medication</option>
                    <option value="missing_pharmacy">Missing pharmacy</option>
                    <option value="partnership">Partnership / business</option>
                    <option value="privacy">Privacy request</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Message
                  </label>
                  <textarea
                    name="message"
                    required
                    rows={5}
                    placeholder="Tell us how we can help..."
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-base focus:outline-none focus:border-[#0891B2] focus:ring-1 focus:ring-[#0891B2] transition-colors resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#0891B2] hover:bg-[#0e7490] text-white font-bold rounded-xl px-6 py-3.5 text-lg transition-colors"
                >
                  Send message →
                </button>
              </form>
            </div>

            {/* Right: Info cards */}
            <div className="space-y-5">

              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <div className="flex items-start gap-4">
                  <span className="text-3xl" aria-hidden="true">📧</span>
                  <div>
                    <h3 className="font-bold text-[#1a1a2e] text-lg mb-1">Email us directly</h3>
                    <p className="text-gray-500 mb-2">We typically respond within 24 hours on business days.</p>
                    <a
                      href="mailto:help@cheaperx.ca"
                      className="text-[#0891B2] font-semibold hover:underline text-lg"
                    >
                      help@cheaperx.ca
                    </a>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <div className="flex items-start gap-4">
                  <span className="text-3xl" aria-hidden="true">💊</span>
                  <div>
                    <h3 className="font-bold text-[#1a1a2e] text-lg mb-1">Missing a medication?</h3>
                    <p className="text-gray-500">
                      If you can&apos;t find a drug in our search, email us its name and strength.
                      We&apos;ll add it to our database within 2 business days.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <div className="flex items-start gap-4">
                  <span className="text-3xl" aria-hidden="true">🏪</span>
                  <div>
                    <h3 className="font-bold text-[#1a1a2e] text-lg mb-1">Missing a pharmacy?</h3>
                    <p className="text-gray-500">
                      Is your local pharmacy not listed? Send us the name, address, and city
                      and we&apos;ll get it added.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <div className="flex items-start gap-4">
                  <span className="text-3xl" aria-hidden="true">🤝</span>
                  <div>
                    <h3 className="font-bold text-[#1a1a2e] text-lg mb-1">Pharmacy partnerships</h3>
                    <p className="text-gray-500">
                      Are you a pharmacy owner who wants to list your prices on CheaperRx?
                      Get in touch — it&apos;s free to be listed.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-[#f0f9ff] border border-[#bae6fd] rounded-2xl p-6">
                <p className="text-[#0369a1] text-sm font-medium">
                  ⚕️ <strong>Medical disclaimer:</strong> CheaperRx is a price comparison tool only.
                  We are not a pharmacy or healthcare provider. Always consult your pharmacist
                  or doctor before making any medication decisions.
                </p>
              </div>

            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
