import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 text-center space-y-3">
        <p className="text-gray-600 text-lg">
          <Link href="/" className="font-semibold text-[#1a1a2e] hover:text-[#0891B2]">
            CheaperRx
          </Link>{" "}
          &copy; {new Date().getFullYear()}{" "}
          <span className="mx-2 text-gray-300">|</span>
          <Link href="/privacy" className="hover:text-[#0891B2] transition-colors">
            Privacy Policy
          </Link>
          <span className="mx-2 text-gray-300">|</span>
          <Link href="/contact" className="hover:text-[#0891B2] transition-colors">
            Contact Us
          </Link>
        </p>
        <p className="text-gray-500 text-lg">Made in Canada 🍁</p>
        <p className="text-gray-500 text-lg">
          Questions? Email us:{" "}
          <a
            href="mailto:help@cheaperrx.ca"
            className="text-[#0891B2] hover:underline font-medium"
          >
            help@cheaperrx.ca
          </a>
        </p>
      </div>
    </footer>
  );
}
