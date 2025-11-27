import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-purple-50/30">
      {/* Navigation */}
      <Navbar />

      {/* Main Content - Hero Section merged with Navbar */}
      <main className="min-h-screen flex items-center justify-center pt-20">
        <div className="text-center space-y-6 px-4">
          <h1 className="text-6xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            India Trade Analysis
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            AI-Powered Trade Intelligence Platform
          </p>
          <div className="pt-8">
            <a
              href="/dashboard"
              className="inline-block px-8 py-4 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all hover:scale-105"
            >
              Launch Dashboard
            </a>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
