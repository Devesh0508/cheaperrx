import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { requireAuth } from "@/lib/auth";
import { CheckoutRedirect } from "./CheckoutRedirect";

export const metadata = { title: "Checkout — CheaperRx" };

export default async function CheckoutPage() {
  await requireAuth();

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main id="main-content" className="flex-1 px-4 sm:px-6 py-20">
        <div className="max-w-md mx-auto">
          <CheckoutRedirect />
        </div>
      </main>
      <Footer />
    </div>
  );
}
