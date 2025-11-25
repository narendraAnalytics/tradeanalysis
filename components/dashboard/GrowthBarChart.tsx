"use client";

import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, ReferenceLine } from 'recharts';

interface GrowthData {
    year: string;
    change: number;
}

interface GrowthBarChartProps {
    data: GrowthData[];
}

export function GrowthBarChart({ data }: GrowthBarChartProps) {
    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            const value = payload[0].value;
            const isPositive = value >= 0;
            return (
                <div className="glass-card p-4 rounded-xl border border-white/60 shadow-xl bg-white/90 backdrop-blur-xl">
                    <p className="text-sm font-semibold mb-2 text-slate-700">{label}</p>
                    <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-500 font-medium">Growth</span>
                        <span className={`font-bold font-mono text-sm ${
                            isPositive ? 'text-emerald-600' : 'text-rose-600'
                        }`}>
                            {isPositive ? '+' : ''}{value.toFixed(1)}%
                        </span>
                    </div>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="w-full h-[400px] glass-card p-6 rounded-3xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-emerald-500/5 to-rose-500/5 rounded-full blur-3xl -z-10 transition-opacity opacity-50 group-hover:opacity-100" />

            <div className="mb-4">
                <h3 className="text-xl font-bold text-slate-900">Year-over-Year Growth</h3>
                <p className="text-sm text-slate-500">Annual trade volume change (%)</p>
            </div>

            <ResponsiveContainer width="100%" height="85%">
                <BarChart
                    data={data}
                    margin={{
                        top: 10,
                        right: 10,
                        left: 0,
                        bottom: 0,
                    }}
                >
                    <defs>
                        <linearGradient id="colorPositive" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.9} />
                            <stop offset="95%" stopColor="#10b981" stopOpacity={0.6} />
                        </linearGradient>
                        <linearGradient id="colorNegative" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.6} />
                            <stop offset="95%" stopColor="#f43f5e" stopOpacity={0.9} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" strokeOpacity={0.5} />
                    <XAxis
                        dataKey="year"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#64748b', fontSize: 11, fontWeight: 500 }}
                        angle={-45}
                        textAnchor="end"
                        height={70}
                    />
                    <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#64748b', fontSize: 12, fontWeight: 500 }}
                        tickFormatter={(value) => `${value}%`}
                        dx={-10}
                    />
                    <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(99, 102, 241, 0.05)' }} />
                    <ReferenceLine y={0} stroke="#94a3b8" strokeWidth={2} strokeDasharray="3 3" />
                    <Bar
                        dataKey="change"
                        radius={[8, 8, 0, 0]}
                        maxBarSize={40}
                        animationDuration={1200}
                        animationBegin={200}
                    >
                        {data.map((entry, index) => (
                            <Cell
                                key={`cell-${index}`}
                                fill={entry.change >= 0 ? 'url(#colorPositive)' : 'url(#colorNegative)'}
                                className="hover:opacity-80 transition-opacity cursor-pointer"
                            />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
