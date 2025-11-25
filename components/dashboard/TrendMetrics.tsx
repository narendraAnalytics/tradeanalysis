"use client";

import React from 'react';
import { TrendingUp, TrendingDown, Activity, BarChart3 } from 'lucide-react';
import { motion } from 'framer-motion';

interface TrendMetricsProps {
    growthRate?: string;
    yearOverYearData?: { year: string; change: number }[];
    balance?: string;
}

export function TrendMetrics({ growthRate, yearOverYearData, balance }: TrendMetricsProps) {
    // Calculate average YoY change
    const avgChange = yearOverYearData && yearOverYearData.length > 0
        ? yearOverYearData.reduce((sum, item) => sum + item.change, 0) / yearOverYearData.length
        : 0;

    // Calculate volatility (standard deviation)
    const volatility = yearOverYearData && yearOverYearData.length > 0
        ? Math.sqrt(
            yearOverYearData.reduce((sum, item) => sum + Math.pow(item.change - avgChange, 2), 0) / yearOverYearData.length
        )
        : 0;

    // Determine trend direction
    const recentTrend = yearOverYearData && yearOverYearData.length >= 3
        ? yearOverYearData.slice(-3).reduce((sum, item) => sum + item.change, 0) / 3
        : 0;

    const isGrowthPositive = growthRate ? parseFloat(growthRate.replace(/[^0-9.-]/g, '')) > 0 : true;
    const isBalanceSurplus = balance ? balance.toLowerCase().includes('surplus') : false;

    const metrics = [
        {
            title: 'Overall Growth',
            value: growthRate || 'N/A',
            icon: isGrowthPositive ? TrendingUp : TrendingDown,
            color: isGrowthPositive ? 'emerald' : 'rose',
            bgGradient: isGrowthPositive
                ? 'from-emerald-50 to-white border-emerald-100'
                : 'from-rose-50 to-white border-rose-100',
            iconColor: isGrowthPositive ? 'text-emerald-600' : 'text-rose-600',
        },
        {
            title: 'Avg YoY Change',
            value: `${avgChange >= 0 ? '+' : ''}${avgChange.toFixed(1)}%`,
            icon: Activity,
            color: avgChange >= 0 ? 'indigo' : 'orange',
            bgGradient: avgChange >= 0
                ? 'from-indigo-50 to-white border-indigo-100'
                : 'from-orange-50 to-white border-orange-100',
            iconColor: avgChange >= 0 ? 'text-indigo-600' : 'text-orange-600',
        },
        {
            title: 'Volatility Index',
            value: volatility.toFixed(1),
            icon: BarChart3,
            color: 'violet',
            bgGradient: 'from-violet-50 to-white border-violet-100',
            iconColor: 'text-violet-600',
            subtitle: volatility > 15 ? 'High' : volatility > 8 ? 'Medium' : 'Low',
        },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {metrics.map((metric, index) => (
                <motion.div
                    key={metric.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                    className={`glass-card p-5 rounded-2xl bg-gradient-to-br ${metric.bgGradient} border transition-all hover:scale-[1.02] hover:shadow-lg duration-300 group`}
                >
                    <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                                {metric.title}
                            </p>
                            <h3 className="text-2xl font-bold text-slate-900 tracking-tight">
                                {metric.value}
                            </h3>
                            {metric.subtitle && (
                                <p className="text-xs text-slate-500 mt-1 font-medium">
                                    {metric.subtitle}
                                </p>
                            )}
                        </div>
                        <div className={`p-2.5 rounded-xl bg-white border shadow-sm ${metric.iconColor} group-hover:scale-110 transition-transform duration-300`}>
                            <metric.icon size={20} />
                        </div>
                    </div>

                    {/* Mini trend indicator */}
                    {metric.title === 'Overall Growth' && (
                        <div className="flex items-center gap-1.5 mt-2">
                            <motion.div
                                animate={{ y: [0, -3, 0] }}
                                transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                            >
                                {isGrowthPositive ? (
                                    <TrendingUp size={14} className="text-emerald-600" />
                                ) : (
                                    <TrendingDown size={14} className="text-rose-600" />
                                )}
                            </motion.div>
                            <span className={`text-xs font-semibold ${isGrowthPositive ? 'text-emerald-600' : 'text-rose-600'}`}>
                                {isGrowthPositive ? 'Trending Up' : 'Trending Down'}
                            </span>
                        </div>
                    )}

                    {/* Recent trend for Avg YoY */}
                    {metric.title === 'Avg YoY Change' && recentTrend !== 0 && (
                        <div className="mt-2 pt-2 border-t border-slate-200">
                            <div className="flex items-center justify-between text-xs">
                                <span className="text-slate-500 font-medium">Recent Trend</span>
                                <span className={`font-bold ${recentTrend >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                                    {recentTrend >= 0 ? '+' : ''}{recentTrend.toFixed(1)}%
                                </span>
                            </div>
                        </div>
                    )}
                </motion.div>
            ))}
        </div>
    );
}
