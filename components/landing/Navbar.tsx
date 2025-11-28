"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, LogIn, LogOut } from 'lucide-react';
import Image from 'next/image';
import { useUser } from '@stackframe/stack';

export function Navbar() {
  const user = useUser();
  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="sticky top-0 z-50 border-none shadow-none"
    >
      <div className="w-full px-8 py-4 border-none">
        <div className="flex items-center justify-between relative">
          {/* Logo Section */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-3"
          >
            <Image
              src="/images/logo.png"
              alt="India Trade Logo"
              width={100}
              height={100}
              className="rounded-lg"
            />
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                India Trade
              </h1>
              <p className="text-xs text-slate-500 font-semibold">AI-Powered Analysis</p>
            </div>
          </motion.div>

          {/* Right Side: Navigation Icons + Dashboard */}
          <div className="flex items-center gap-4">
            {/* Navigation Icons */}
            <div className="flex items-center gap-1">
            {/* Home Icon */}
            <motion.a
              href="#"
              whileHover={{ scale: 1.1, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="group relative p-3.5 transition-all cursor-pointer"
            >
              <Image
                src="/images/homeIcon.png"
                alt="Home"
                width={40}
                height={40}
                className="relative z-10"
              />
              <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 bg-gradient-to-r from-cyan-400 via-blue-400 to-orange-500 bg-clip-text text-transparent text-sm font-bold whitespace-nowrap transition-all duration-300 pointer-events-none">
                Home
              </span>
            </motion.a>

            {/* Features Icon */}
            <motion.a
              href="#features"
              whileHover={{ scale: 1.1, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="group relative p-3.5 transition-all cursor-pointer"
            >
              <Image
                src="/images/FeaturesIcon.png"
                alt="Features"
                width={50}
                height={50}
                className="relative z-10"
              />
              <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 bg-gradient-to-r from-cyan-400 via-blue-400 to-orange-500 bg-clip-text text-transparent text-sm font-bold whitespace-nowrap transition-all duration-300 pointer-events-none">
                Features
              </span>
            </motion.a>

            {/* About Icon */}
            <motion.a
              href="#about"
              whileHover={{ scale: 1.1, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="group relative p-3.5 transition-all cursor-pointer"
            >
              <Image
                src="/images/AboutIcon.png"
                alt="About"
                width={50}
                height={50}
                className="relative z-10"
              />
              <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 bg-gradient-to-r from-cyan-400 via-blue-400 to-orange-500 bg-clip-text text-transparent text-sm font-bold whitespace-nowrap transition-all duration-300 pointer-events-none">
                About
              </span>
            </motion.a>

            {/* Contact Icon */}
            <motion.a
              href="#contact"
              whileHover={{ scale: 1.1, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="group relative p-3.5 transition-all cursor-pointer"
            >
              <Image
                src="/images/contactIcon.png"
                alt="Contact"
                width={50}
                height={50}
                className="relative z-10"
              />
              <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 bg-gradient-to-r from-cyan-400 via-blue-400 to-orange-500 bg-clip-text text-transparent text-sm font-bold whitespace-nowrap transition-all duration-300 pointer-events-none">
                Contact
              </span>
            </motion.a>
            </div>

            {/* Conditional Auth Button */}
            {user ? (
              // Show Dashboard and Sign Out buttons when user is logged in
              <div className="flex items-center gap-3">
                <motion.a
                  href="/dashboard"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-2.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all flex items-center gap-2"
                >
                  <Sparkles size={16} />
                  Dashboard
                </motion.a>
                <motion.button
                  onClick={() => user.signOut()}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-2.5 bg-gradient-to-r from-red-500 via-rose-500 to-pink-500 text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all flex items-center gap-2"
                >
                  <LogOut size={16} />
                  Sign Out
                </motion.button>
              </div>
            ) : (
              // Show Sign In button when user is NOT logged in
              <motion.a
                href="/handler/sign-in"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-2.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all flex items-center gap-2"
              >
                <LogIn size={16} />
                Sign In
              </motion.a>
            )}
          </div>
        </div>
      </div>
    </motion.nav>
  );
}
