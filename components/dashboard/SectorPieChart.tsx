"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { motion } from 'framer-motion';

interface SectorData {
    name: string;
    value: number;
    percentage: number;
    [key: string]: string | number; // Index signature for Recharts compatibility
}

interface SectorPieChartProps {
    data: SectorData[];
}

const COLORS = [
    '#6366f1', // Indigo
    '#8b5cf6', // Violet
    '#ec4899', // Pink
    '#f43f5e', // Rose
    '#f97316', // Orange
    '#eab308', // Yellow
];

export function SectorPieChart({ data }: SectorPieChartProps) {
    const CustomTooltip = ({ active, payload }: any) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;
            return (
                <div className="glass-card p-4 rounded-xl border border-white/60 shadow-xl bg-white/90 backdrop-blur-xl">
                    <p className="text-sm font-bold mb-2 text-slate-800">{data.name}</p>
                    <div className="space-y-1.5">
                        <div className="flex items-center justify-between gap-4 text-sm">
                            <span className="text-slate-500 font-medium">Value</span>
                            <span className="font-bold text-slate-800 font-mono">${data.value}B</span>
                        </div>
                        <div className="flex items-center justify-between gap-4 text-sm">
                            <span className="text-slate-500 font-medium">Share</span>
                            <span className="font-bold text-indigo-600 font-mono">{data.percentage}%</span>
                        </div>
                    </div>
                </div>
            );
        }
        return null;
    };

    const CustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percentage }: any) => {
        const RADIAN = Math.PI / 180;
        const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
        const x = cx + radius * Math.cos(-midAngle * RADIAN);
        const y = cy + radius * Math.sin(-midAngle * RADIAN);

        if (percentage < 5) return null; // Don't show label if too small

        return (
            <text
                x={x}
                y={y}
                fill="white"
                textAnchor={x > cx ? 'start' : 'end'}
                dominantBaseline="central"
                className="text-xs font-bold drop-shadow-lg"
            >
                {`${percentage}%`}
            </text>
        );
    };

    const CustomLegend = ({ payload }: any) => {
        return (
            <div className="grid grid-cols-2 gap-2 mt-4">
                {payload.map((entry: any, index: number) => (
                    <motion.div
                        key={`legend-${index}`}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center gap-2 text-xs"
                    >
                        <div
                            className={`w-3 h-3 rounded-full shadow-sm sector-color-${index}`}
                        />
                        <span className="text-slate-700 font-medium truncate">{entry.value}</span>
                    </motion.div>
                ))}
            </div>
        );
    };

    return (
        <div className="w-full h-[400px] glass-card p-6 rounded-3xl relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-48 h-48 bg-linear-to-br from-indigo-500/5 to-purple-500/5 rounded-full blur-3xl -z-10 transition-opacity opacity-50 group-hover:opacity-100" />

            <div className="mb-4">
                <h3 className="text-xl font-bold text-slate-900">Sector Breakdown</h3>
                <p className="text-sm text-slate-500">Top trading sectors by volume</p>
            </div>

            <ResponsiveContainer width="100%" height="85%">
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={CustomLabel}
                        outerRadius={110}
                        innerRadius={60}
                        fill="#8884d8"
                        dataKey="value"
                        animationBegin={0}
                        animationDuration={1000}
                    >
                        {data.map((_, index) => (
                            <Cell
                                key={`cell-${index}`}
                                fill={COLORS[index % COLORS.length]}
                                className="hover:opacity-80 transition-opacity cursor-pointer stroke-white stroke-2"
                            />
                        ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend content={<CustomLegend />} />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
}
