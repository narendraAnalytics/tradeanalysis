import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
    title: string;
    value: string;
    icon: LucideIcon;
    trend?: string;
    trendUp?: boolean;
}

export function StatCard({ title, value, icon: Icon, trend, trendUp }: StatCardProps) {
    return (
        <div className="glass-card p-6 rounded-2xl flex flex-col justify-between h-full transition-all hover:scale-[1.02] hover:shadow-xl hover:shadow-indigo-500/5 duration-300 group">
            <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-semibold text-slate-500 uppercase tracking-wider">{title}</span>
                <div className="p-2.5 rounded-xl bg-gradient-to-br from-indigo-50 to-white border border-indigo-100 text-indigo-600 shadow-sm group-hover:scale-110 transition-transform duration-300">
                    <Icon size={20} />
                </div>
            </div>

            <div>
                <h3 className="text-3xl font-bold text-slate-900 tracking-tight mb-2">{value}</h3>
                {trend && (
                    <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-semibold ${trendUp
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                            : 'bg-rose-50 text-rose-700 border border-rose-100'
                        }`}>
                        {trendUp ? '↑' : '↓'} {trend}
                    </div>
                )}
            </div>
        </div>
    );
}
