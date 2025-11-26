"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, TrendingDown, TrendingUp, Zap, ChevronDown, ChevronUp } from 'lucide-react';

interface Anomaly {
  year: string;
  title: string;
  type: 'spike' | 'drop' | 'disruption';
  severity: 'Critical' | 'High' | 'Moderate';
  context: string;
  impact: string;
  recovery: string;
}

interface AnomaliesPanelProps {
  anomalies?: Anomaly[];
}

export function AnomaliesPanel({ anomalies }: AnomaliesPanelProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  if (!anomalies || anomalies.length === 0) {
    return null;
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'Critical':
        return 'from-red-500 to-rose-600';
      case 'High':
        return 'from-orange-500 to-amber-600';
      case 'Moderate':
        return 'from-yellow-500 to-orange-500';
      default:
        return 'from-slate-500 to-slate-600';
    }
  };

  const getSeverityBg = (severity: string) => {
    switch (severity) {
      case 'Critical':
        return 'from-red-50 to-rose-50 border-red-200';
      case 'High':
        return 'from-orange-50 to-amber-50 border-orange-200';
      case 'Moderate':
        return 'from-yellow-50 to-orange-50 border-yellow-200';
      default:
        return 'from-slate-50 to-slate-100 border-slate-200';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'spike':
        return <TrendingUp size={18} />;
      case 'drop':
        return <TrendingDown size={18} />;
      case 'disruption':
        return <Zap size={18} />;
      default:
        return <AlertTriangle size={18} />;
    }
  };

  return (
    <div className="w-full glass-card p-8 rounded-3xl">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2.5 rounded-xl bg-gradient-to-br from-red-500 to-orange-500 text-white shadow-lg">
          <AlertTriangle size={22} />
        </div>
        <div>
          <h3 className="text-xl font-bold text-slate-900">Anomaly Detection</h3>
          <p className="text-sm text-slate-500">Historical events that impacted trade patterns</p>
        </div>
      </div>

      <div className="space-y-4">
        {anomalies.map((anomaly, index) => {
          const isExpanded = expandedId === anomaly.year + index;
          const severityColor = getSeverityColor(anomaly.severity);
          const severityBg = getSeverityBg(anomaly.severity);

          return (
            <motion.div
              key={anomaly.year + index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`rounded-2xl border-2 bg-gradient-to-r ${severityBg} overflow-hidden`}
            >
              {/* Header - Always Visible */}
              <button
                onClick={() => setExpandedId(isExpanded ? null : anomaly.year + index)}
                className="w-full p-5 flex items-center justify-between hover:bg-white/30 transition-all"
              >
                <div className="flex items-center gap-4">
                  {/* Year Badge */}
                  <div className={`px-4 py-2 rounded-xl bg-gradient-to-br ${severityColor} text-white font-bold text-sm shadow-lg min-w-[70px] text-center`}>
                    {anomaly.year}
                  </div>

                  {/* Type Icon */}
                  <div className={`p-2 rounded-lg bg-gradient-to-br ${severityColor} text-white`}>
                    {getTypeIcon(anomaly.type)}
                  </div>

                  {/* Title and Severity */}
                  <div className="text-left">
                    <h4 className="font-bold text-slate-900 text-base">{anomaly.title}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`px-2.5 py-0.5 rounded-md bg-gradient-to-r ${severityColor} text-white text-xs font-bold`}>
                        {anomaly.severity}
                      </span>
                      <span className="text-xs text-slate-500 capitalize">
                        {anomaly.type}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Expand Icon */}
                <motion.div
                  animate={{ rotate: isExpanded ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="text-slate-600"
                >
                  <ChevronDown size={24} />
                </motion.div>
              </button>

              {/* Detailed Content - Expandable */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="px-5 pb-5 pt-2 space-y-4 bg-white/50 border-t-2 border-white/60">
                      {/* Context */}
                      <div>
                        <h5 className="text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                          What Happened
                        </h5>
                        <p className="text-sm text-slate-600 leading-relaxed pl-3.5">
                          {anomaly.context}
                        </p>
                      </div>

                      {/* Impact */}
                      <div>
                        <h5 className="text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                          Impact Assessment
                        </h5>
                        <p className="text-sm text-slate-600 leading-relaxed pl-3.5 font-medium">
                          {anomaly.impact}
                        </p>
                      </div>

                      {/* Recovery */}
                      <div>
                        <h5 className="text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                          Recovery Analysis
                        </h5>
                        <p className="text-sm text-slate-600 leading-relaxed pl-3.5">
                          {anomaly.recovery}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>

      {/* Summary Stats */}
      <div className="mt-6 pt-6 border-t border-slate-200 grid grid-cols-3 gap-4">
        <div className="text-center">
          <div className="text-2xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
            {anomalies.filter(a => a.severity === 'Critical').length}
          </div>
          <div className="text-xs text-slate-500 font-medium mt-1">Critical Events</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
            {anomalies.filter(a => a.severity === 'High').length}
          </div>
          <div className="text-xs text-slate-500 font-medium mt-1">High Impact</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
            {anomalies.filter(a => a.severity === 'Moderate').length}
          </div>
          <div className="text-xs text-slate-500 font-medium mt-1">Moderate</div>
        </div>
      </div>
    </div>
  );
}
