"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, TrendingUp, BarChart3, Package, FileText, LineChart } from 'lucide-react';

const features = [
  {
    icon: Sparkles,
    title: "AI-Powered Insights",
    description: "Advanced analytics powered by Google Gemini AI for intelligent trade predictions"
  },
  {
    icon: TrendingUp,
    title: "Real-Time Analysis",
    description: "Live trade data tracking with instant updates and comprehensive monitoring"
  },
  {
    icon: LineChart,
    title: "Predictive Analytics",
    description: "Future trend forecasting using machine learning and historical data patterns"
  },
  {
    icon: Package,
    title: "Export/Import Tracking",
    description: "Comprehensive monitoring of trade flows across multiple sectors and countries"
  },
  {
    icon: FileText,
    title: "Custom Reports",
    description: "Generate detailed PDF reports and interactive dashboards with one click"
  },
  {
    icon: BarChart3,
    title: "Trade Visualization",
    description: "Beautiful interactive charts and graphs for deep data insights"
  }
];

export function FeaturesSection() {
  return (
    <section id="features" className="relative -mt-35 py-24 px-8 bg-gradient-to-b from-white via-slate-50 to-indigo-50/30">
      {/* Section Title */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center mb-16"
      >
        <h2 className="text-5xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
          Powerful Features
        </h2>
        <p className="text-xl text-slate-600 max-w-2xl mx-auto">
          Everything you need to analyze and understand India's trade landscape
        </p>
      </motion.div>

      {/* Features Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.05, y: -5 }}
              className="group relative p-8 rounded-3xl bg-white/60 backdrop-blur-md border border-indigo-100/50 shadow-lg hover:shadow-xl hover:shadow-indigo-500/20 transition-all cursor-pointer"
            >
              {/* Gradient Border Glow on Hover */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-indigo-500/0 via-purple-500/0 to-pink-500/0 group-hover:from-indigo-500/20 group-hover:via-purple-500/20 group-hover:to-pink-500/20 transition-all duration-500" />

              {/* Icon */}
              <div className="relative mb-6">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Icon size={32} className="text-white" strokeWidth={2.5} />
                </div>
              </div>

              {/* Content */}
              <h3 className="relative text-2xl font-bold text-slate-800 mb-3 group-hover:text-indigo-600 transition-colors">
                {feature.title}
              </h3>
              <p className="relative text-slate-600 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
