"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, Lightbulb, Clock, Shield, Target, Zap } from 'lucide-react';

interface Risk {
  title: string;
  description: string;
  severity: 'High' | 'Medium' | 'Low';
  timeframe: string;
  mitigation: string;
}

interface Opportunity {
  title: string;
  description: string;
  potential: string;
  timeframe: string;
  action: string;
}

interface RiskOpportunityCardsProps {
  risks?: Risk[];
  opportunities?: Opportunity[];
}

export function RiskOpportunityCards({ risks, opportunities }: RiskOpportunityCardsProps) {
  if ((!risks || risks.length === 0) && (!opportunities || opportunities.length === 0)) {
    return null;
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'High':
        return 'from-red-500 to-rose-600';
      case 'Medium':
        return 'from-orange-500 to-amber-500';
      case 'Low':
        return 'from-yellow-500 to-yellow-600';
      default:
        return 'from-slate-500 to-slate-600';
    }
  };

  const getTimeframeIcon = (timeframe: string) => {
    if (timeframe.toLowerCase().includes('short')) {
      return <Zap size={14} />;
    } else if (timeframe.toLowerCase().includes('medium')) {
      return <Clock size={14} />;
    } else {
      return <Target size={14} />;
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
      {/* RISKS Section */}
      {risks && risks.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-red-500 to-orange-500 text-white shadow-lg">
              <AlertCircle size={22} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900">Identified Risks</h3>
              <p className="text-sm text-slate-500">Potential challenges ahead</p>
            </div>
          </div>

          <div className="space-y-3">
            {risks.map((risk, index) => {
              const severityColor = getSeverityColor(risk.severity);

              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="glass-card p-5 rounded-2xl border-2 border-red-100 hover:border-red-200 hover:shadow-lg transition-all group"
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-3">
                    <h4 className="font-bold text-slate-900 text-base flex-1 pr-2">
                      {risk.title}
                    </h4>
                    <div className={`px-3 py-1 rounded-lg bg-gradient-to-r ${severityColor} text-white text-xs font-bold whitespace-nowrap shadow-sm`}>
                      {risk.severity}
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-slate-600 leading-relaxed mb-3">
                    {risk.description}
                  </p>

                  {/* Timeframe Badge */}
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-100 text-slate-600 text-xs font-medium">
                      {getTimeframeIcon(risk.timeframe)}
                      {risk.timeframe}
                    </div>
                  </div>

                  {/* Mitigation */}
                  <div className="pt-3 border-t border-slate-200">
                    <div className="flex items-start gap-2">
                      <div className="p-1 rounded-md bg-emerald-100 text-emerald-600 mt-0.5">
                        <Shield size={14} />
                      </div>
                      <div className="flex-1">
                        <h5 className="text-xs font-bold text-slate-700 mb-1">Mitigation Strategy</h5>
                        <p className="text-xs text-slate-600 leading-relaxed">
                          {risk.mitigation}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

      {/* OPPORTUNITIES Section */}
      {opportunities && opportunities.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-emerald-500 to-green-500 text-white shadow-lg">
              <Lightbulb size={22} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900">Growth Opportunities</h3>
              <p className="text-sm text-slate-500">Strategic areas for expansion</p>
            </div>
          </div>

          <div className="space-y-3">
            {opportunities.map((opportunity, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="glass-card p-5 rounded-2xl border-2 border-emerald-100 hover:border-emerald-200 hover:shadow-lg transition-all group"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <h4 className="font-bold text-slate-900 text-base flex-1 pr-2">
                    {opportunity.title}
                  </h4>
                </div>

                {/* Description */}
                <p className="text-sm text-slate-600 leading-relaxed mb-3">
                  {opportunity.description}
                </p>

                {/* Potential & Timeframe */}
                <div className="flex items-center gap-2 mb-3 flex-wrap">
                  <div className="px-3 py-1 rounded-lg bg-gradient-to-r from-emerald-500 to-green-500 text-white text-xs font-bold shadow-sm">
                    {opportunity.potential}
                  </div>
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-100 text-slate-600 text-xs font-medium">
                    {getTimeframeIcon(opportunity.timeframe)}
                    {opportunity.timeframe}
                  </div>
                </div>

                {/* Action */}
                <div className="pt-3 border-t border-slate-200">
                  <div className="flex items-start gap-2">
                    <div className="p-1 rounded-md bg-indigo-100 text-indigo-600 mt-0.5">
                      <Target size={14} />
                    </div>
                    <div className="flex-1">
                      <h5 className="text-xs font-bold text-slate-700 mb-1">Recommended Action</h5>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {opportunity.action}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
