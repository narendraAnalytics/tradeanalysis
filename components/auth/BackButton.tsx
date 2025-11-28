"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";

export function BackButton() {
  const router = useRouter();

  return (
    <motion.button
      onClick={() => router.push("/")}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      whileHover={{
        scale: 1.05,
        boxShadow: "0 0 25px rgba(99, 102, 241, 0.6), 0 0 50px rgba(168, 85, 247, 0.4)"
      }}
      whileTap={{ scale: 0.95 }}
      className="fixed top-6 left-6 z-50 px-6 py-3 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 text-white font-bold rounded-xl shadow-lg hover:shadow-2xl transition-all flex items-center gap-2 group"
    >
      <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
      <span className="text-white drop-shadow-lg">Back to Home</span>
    </motion.button>
  );
}
