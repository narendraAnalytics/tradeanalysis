import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import Image from "next/image";

export default function LandingPage() {
  return (
    <div className="min-h-screen relative">
      {/* Banner Background Image */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <Image
          src="/images/BannerImage.png"
          alt="India Trade Analysis Banner"
          fill
          className="object-contain object-top"
          priority
        />
      </div>

      {/* Navigation */}
      <Navbar />

      {/* Main Content - Hero Section merged with Navbar */}
      <main className="relative z-10 min-h-screen flex items-center justify-center pt-20">
        <div className="text-center space-y-6 px-4 relative">
          <h1 className="text-6xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent drop-shadow-lg">
            India Trade Analysis
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto drop-shadow-md">
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
      <div className="relative z-10">
        <Footer />
      </div>
    </div>
  );
}
