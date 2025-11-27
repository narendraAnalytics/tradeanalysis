"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import Image from 'next/image';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-r from-slate-900 via-indigo-900 to-purple-900 text-white">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-xl">
                <Image
                  src="/images/tradeicon.png"
                  alt="Trade Icon"
                  width={24}
                  height={24}
                  className="opacity-90"
                />
              </div>
              <h3 className="text-xl font-bold">India Trade Analysis</h3>
            </div>
            <p className="text-slate-300 text-sm leading-relaxed">
              AI-powered platform for comprehensive trade data analysis and predictions.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-bold text-white">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-slate-300 hover:text-indigo-400 transition-colors text-sm">
                  Features
                </a>
              </li>
              <li>
                <a href="#" className="text-slate-300 hover:text-indigo-400 transition-colors text-sm">
                  About Us
                </a>
              </li>
              <li>
                <a href="/dashboard" className="text-slate-300 hover:text-indigo-400 transition-colors text-sm">
                  Dashboard
                </a>
              </li>
            </ul>
          </div>

          {/* Tech Stack */}
          <div className="space-y-4">
            <h4 className="text-lg font-bold text-white">Powered By</h4>
            <div className="space-y-2 text-sm text-slate-300">
              <p>Google Gemini AI</p>
              <p>Next.js 16</p>
              <p>TensorFlow.js</p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-8 border-t border-slate-700/50">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-slate-400">
              © {currentYear} India Trade Analysis. All rights reserved.
            </p>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex items-center gap-2 text-sm text-slate-400"
            >
              Made with <Heart size={14} className="text-pink-500 fill-pink-500 animate-pulse" /> in India
            </motion.div>
          </div>
        </div>
      </div>
    </footer>
  );
}
