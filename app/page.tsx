"use client";

import { useState } from "react";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { FeaturesSection } from "@/components/landing/FeaturesSection";
import { BannerEffects } from "@/components/landing/BannerEffects";
import Image from "next/image";
import { useUser } from "@stackframe/stack";
import { Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export default function LandingPage() {
  const user = useUser();
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="min-h-screen relative">
      {/* Banner Background Image */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <Image
          src="/images/BannerImage.png"
          alt="India Trade Analysis Banner"
          fill
          className="object-contain object-top brightness-95"
          priority
        />
        {/* Subtle overlay to reduce brightness */}
        <div className="absolute inset-0 bg-black/10" />
        {/* Animated lighting effects */}
        <BannerEffects />
      </div>

      {/* Navigation */}
      <Navbar />

      {/* Main Content - Hero Section merged with Navbar */}
      <main className="relative z-10 min-h-screen flex items-end justify-center pb-40">
        <div className="text-center space-y-6 px-4 relative max-w-xl w-full">
          {user ? (
            <div className="bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl p-6 border border-white/50">
              <h1 className="text-3xl font-bold bg-linear-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                Welcome back, {user.displayName || user.primaryEmail?.split('@')[0] || 'User'}!
              </h1>
              <p className="text-base text-slate-700 mb-4">
                Ready to analyze India's trade data?
              </p>
              <a
                href="/dashboard"
                className="inline-block px-8 py-3 bg-linear-to-r from-indigo-500 via-purple-500 to-pink-500 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-105"
              >
                Trade Dashboard
              </a>
            </div>
          ) : (
            <div className="pt-12">
              <motion.a
                href="/handler/sign-in"
                onClick={() => setIsLoading(true)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center gap-2 px-8 py-5 bg-linear-to-r from-indigo-500 via-purple-500 to-pink-500 text-white font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all"
              >
                <motion.div
                  animate={isLoading ? { rotate: 360 } : { rotate: 0 }}
                  transition={{
                    duration: 1,
                    repeat: isLoading ? Infinity : 0,
                    ease: "linear"
                  }}
                >
                  <Sparkles size={20} />
                </motion.div>
                Launch Dashboard
              </motion.a>
            </div>
          )}
        </div>
      </main>

      {/* Features Section */}
      <FeaturesSection />

      {/* Footer */}
      <div className="relative z-10">
        <Footer />
      </div>
    </div>
  );
}
