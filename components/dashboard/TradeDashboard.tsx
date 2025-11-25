import React from 'react';
import { TradeChart } from './TradeChart';
import { StatCard } from './StatCard';
import { SectorPieChart } from './SectorPieChart';
import { GrowthBarChart } from './GrowthBarChart';
import { TrendMetrics } from './TrendMetrics';
import { TrendingUp, TrendingDown, DollarSign, Activity } from 'lucide-react';
import { TradeData } from '@/lib/gemini';
import { motion } from 'framer-motion';

interface TradeDashboardProps {
    data: TradeData;
}

export function TradeDashboard({ data }: TradeDashboardProps) {
    const isSurplus = data.stats.balance.toLowerCase().includes('surplus');

    return (
        <div className="space-y-6 w-full max-w-6xl mx-auto p-6">
            {/* Existing Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard
                    title="Total Volume"
                    value={data.stats.totalVolume}
                    icon={Activity}
                    trend="+5.2%"
                    trendUp={true}
                />
                <StatCard
                    title="Peak Year"
                    value={data.stats.peakYear}
                    icon={TrendingUp}
                />
                <StatCard
                    title="Trade Balance"
                    value={data.stats.balance}
                    icon={DollarSign}
                    trend={isSurplus ? "Surplus" : "Deficit"}
                    trendUp={isSurplus}
                />
            </div>

            {/* Existing Trade Chart */}
            <TradeChart data={data.chartData} />

            {/* NEW: Trend Metrics */}
            {(data.growthRate || data.yearOverYearChange) && (
                <TrendMetrics
                    growthRate={data.growthRate}
                    yearOverYearData={data.yearOverYearChange}
                    balance={data.stats.balance}
                />
            )}

            {/* NEW: Sector Pie Chart + Growth Bar Chart */}
            {(data.topSectors || data.yearOverYearChange) && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {data.topSectors && (
                        <SectorPieChart data={data.topSectors} />
                    )}
                    {data.yearOverYearChange && (
                        <GrowthBarChart data={data.yearOverYearChange} />
                    )}
                </div>
            )}

            {/* Existing Executive Summary */}
            <div className="glass-card p-6 rounded-2xl">
                <h3 className="text-lg font-semibold mb-4">Executive Summary</h3>
                <p className="text-muted-foreground leading-relaxed">
                    {data.summary}
                </p>
            </div>
        </div>
    );
}
