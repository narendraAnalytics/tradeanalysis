"use client";

import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { TrendingUp } from 'lucide-react';

interface PredictionsChartProps {
  historicalData: {
    year: string;
    exports: number;
    imports: number;
  }[];
  predictions?: {
    year: string;
    exports: number;
    imports: number;
    confidence: number;
  }[];
}

export function PredictionsChart({ historicalData, predictions }: PredictionsChartProps) {
  if (!predictions || predictions.length === 0) {
    return null;
  }

  // Combine historical and predicted data
  const combinedData = [
    ...historicalData.map(d => ({ ...d, type: 'historical' })),
    ...predictions.map(d => ({ ...d, type: 'predicted' }))
  ];

  // Find the split point (last historical year)
  const splitYear = historicalData[historicalData.length - 1].year;

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const dataPoint = payload[0].payload;
      const isPredicted = dataPoint.type === 'predicted';

      return (
        <div className="glass-card p-4 rounded-xl border border-white/60 shadow-xl bg-white/90 backdrop-blur-xl">
          <p className="text-sm font-semibold mb-3 text-slate-700 flex items-center gap-2">
            {label}
            {isPredicted && (
              <span className="px-2 py-0.5 rounded-md bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold">
                Forecast
              </span>
            )}
          </p>
          <div className="space-y-2">
            {payload.map((entry: any, index: number) => (
              <div key={index} className="flex items-center justify-between gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full shadow-sm"
                    style={{ backgroundColor: entry.color }}
                  />
                  <span className="text-slate-500 font-medium">{entry.name}</span>
                </div>
                <span className="font-bold text-slate-800 font-mono">
                  ${entry.value}B
                </span>
              </div>
            ))}
            {isPredicted && dataPoint.confidence && (
              <div className="mt-3 pt-2 border-t border-slate-200">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-medium">Confidence</span>
                  <span className="font-bold text-indigo-600">{dataPoint.confidence}%</span>
                </div>
              </div>
            )}
          </div>
        </div>
      );
    }
    return null;
  };

  const avgConfidence = predictions.reduce((sum, p) => sum + p.confidence, 0) / predictions.length;

  return (
    <div className="w-full h-[500px] glass-card p-8 rounded-3xl relative overflow-hidden group">
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-purple-500/5 to-pink-500/5 rounded-full blur-3xl -z-10 transition-opacity opacity-50 group-hover:opacity-100" />

      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-xl font-bold text-slate-900 flex items-center gap-3">
            <span className="p-2 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-lg">
              <TrendingUp size={20} />
            </span>
            Trade Forecast
          </h3>
          <p className="text-sm text-slate-500 mt-1">
            Historical data (2010-{splitYear}) + AI Predictions ({predictions[0].year}-{predictions[predictions.length - 1].year})
          </p>
        </div>
        <div className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200">
          <div className="text-xs text-slate-500 font-medium">Avg Confidence</div>
          <div className="text-lg font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            {Math.round(avgConfidence)}%
          </div>
        </div>
      </div>

      <ResponsiveContainer width="100%" height="85%">
        <AreaChart
          data={combinedData}
          margin={{
            top: 10,
            right: 10,
            left: 0,
            bottom: 0,
          }}
        >
          <defs>
            {/* Historical gradients */}
            <linearGradient id="colorExportsHistorical" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorImportsHistorical" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
            </linearGradient>

            {/* Predicted gradients (lighter) */}
            <linearGradient id="colorExportsPredicted" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.15} />
              <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorImportsPredicted" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.15} />
              <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
            </linearGradient>
          </defs>

          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" strokeOpacity={0.5} />

          {/* Reference line at the split between historical and predicted */}
          <ReferenceLine
            x={splitYear}
            stroke="#a855f7"
            strokeDasharray="5 5"
            strokeWidth={2}
            label={{
              value: 'Forecast Start',
              position: 'top',
              fill: '#a855f7',
              fontSize: 12,
              fontWeight: 600
            }}
          />

          <XAxis
            dataKey="year"
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#64748b', fontSize: 12, fontWeight: 500 }}
            dy={10}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#64748b', fontSize: 12, fontWeight: 500 }}
            tickFormatter={(value) => `$${value}B`}
            dx={-10}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#a855f7', strokeWidth: 1, strokeDasharray: '4 4' }} />

          {/* Exports - solid for historical, dashed for predicted */}
          <Area
            type="monotone"
            dataKey="exports"
            stroke="#10b981"
            strokeWidth={3}
            fillOpacity={1}
            fill="url(#colorExportsHistorical)"
            name="Exports"
            animationDuration={1500}
            connectNulls
          />

          {/* Imports - solid for historical, dashed for predicted */}
          <Area
            type="monotone"
            dataKey="imports"
            stroke="#f43f5e"
            strokeWidth={3}
            fillOpacity={1}
            fill="url(#colorImportsHistorical)"
            name="Imports"
            animationDuration={1500}
            animationBegin={300}
            connectNulls
          />
        </AreaChart>
      </ResponsiveContainer>

      {/* Legend explaining forecast */}
      <div className="mt-4 flex items-center justify-center gap-6 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-8 h-0.5 bg-emerald-500"></div>
          <span className="text-slate-600 font-medium">Historical Exports</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-0.5 bg-rose-500"></div>
          <span className="text-slate-600 font-medium">Historical Imports</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-0.5 bg-purple-500 opacity-60"></div>
          <span className="text-slate-600 font-medium">Forecasted (Lower Opacity)</span>
        </div>
      </div>
    </div>
  );
}
