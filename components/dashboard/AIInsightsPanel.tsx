"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Brain, TrendingUp, Target, BarChart3 } from 'lucide-react';

interface AIInsights {
  marketTrends: string;
  strategicRecommendations: string;
  comparativeAnalysis: string;
}

interface AIInsightsPanelProps {
  insights?: AIInsights;
}

export function AIInsightsPanel({ insights }: AIInsightsPanelProps) {
  if (!insights) {
    return null;
  }

  const sections = [
    {
      title: 'Market Trends',
      icon: TrendingUp,
      content: insights.marketTrends,
      gradient: 'from-indigo-500 to-purple-500',
      bgGradient: 'from-indigo-50 to-purple-50',
      borderColor: 'border-indigo-200'
    },
    {
      title: 'Strategic Recommendations',
      icon: Target,
      content: insights.strategicRecommendations,
      gradient: 'from-purple-500 to-pink-500',
      bgGradient: 'from-purple-50 to-pink-50',
      borderColor: 'border-purple-200'
    },
    {
      title: 'Comparative Analysis',
      icon: BarChart3,
      content: insights.comparativeAnalysis,
      gradient: 'from-pink-500 to-orange-500',
      bgGradient: 'from-pink-50 to-orange-50',
      borderColor: 'border-pink-200'
    }
  ];

  // Helper function to format numbered lists
  const formatContent = (content: string) => {
    // Check if content has numbered points (e.g., "1. ", "2. ")
    const hasNumberedList = /^\d+\.\s/m.test(content);

    if (hasNumberedList) {
      // Split by numbered points
      const points = content.split(/\d+\.\s/).filter(p => p.trim());
      return (
        <ul className="space-y-3">
          {points.map((point, idx) => (
            <li key={idx} className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 text-white text-xs font-bold flex items-center justify-center mt-0.5">
                {idx + 1}
              </span>
              <span className="flex-1">{point.trim()}</span>
            </li>
          ))}
        </ul>
      );
    }

    // Otherwise, return as paragraph
    return <p className="leading-relaxed">{content}</p>;
  };

  return (
    <div className="w-full glass-card p-8 rounded-3xl">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2.5 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 text-white shadow-lg">
          <Brain size={22} />
        </div>
        <div>
          <h3 className="text-xl font-bold text-slate-900">AI-Powered Insights</h3>
          <p className="text-sm text-slate-500">Advanced analysis from Gemini 3 Pro</p>
        </div>
      </div>

      <div className="space-y-6">
        {sections.map((section, index) => {
          const Icon = section.icon;

          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.15 }}
              className={`p-6 rounded-2xl bg-gradient-to-r ${section.bgGradient} border-2 ${section.borderColor}`}
            >
              {/* Section Header */}
              <div className="flex items-center gap-3 mb-4">
                <div className={`p-2 rounded-lg bg-gradient-to-br ${section.gradient} text-white shadow-md`}>
                  <Icon size={18} />
                </div>
                <h4 className="font-bold text-slate-900 text-lg">{section.title}</h4>
              </div>

              {/* Section Content */}
              <div className="text-sm text-slate-700">
                {formatContent(section.content)}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Footer Badge */}
      <div className="mt-6 pt-6 border-t border-slate-200 flex items-center justify-center">
        <div className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-50 to-purple-50 border-2 border-indigo-200 flex items-center gap-2">
          <Brain size={16} className="text-indigo-600" />
          <span className="text-sm font-bold text-slate-700">
            Powered by Gemini 3 Pro Preview with High Thinking Level
          </span>
        </div>
      </div>
    </div>
  );
}
