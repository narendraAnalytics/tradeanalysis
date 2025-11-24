import React from 'react';
import { TradeChart } from './TradeChart';
import { StatCard } from './StatCard';
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

            <TradeChart data={data.chartData} />

            <div className="glass-card p-6 rounded-2xl">
                <h3 className="text-lg font-semibold mb-4">Executive Summary</h3>
                <p className="text-muted-foreground leading-relaxed">
                    {data.summary}
                </p>
            </div>
        </div>
    );
}
