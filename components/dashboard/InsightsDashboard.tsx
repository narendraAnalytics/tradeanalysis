import React from 'react';
import { TradeData } from '@/lib/gemini';
import { PredictionsChart } from './PredictionsChart';
import { AnomaliesPanel } from './AnomaliesPanel';
import { RiskOpportunityCards } from './RiskOpportunityCards';
import { AIInsightsPanel } from './AIInsightsPanel';

interface InsightsDashboardProps {
  data: TradeData;
}

export function InsightsDashboard({ data }: InsightsDashboardProps) {
  // Check if we have prediction data
  const hasPredictions = data.predictions && data.predictions.length > 0;
  const hasAnomalies = data.anomalies && data.anomalies.length > 0;
  const hasRisks = data.risks && data.risks.length > 0;
  const hasOpportunities = data.opportunities && data.opportunities.length > 0;
  const hasInsights = data.aiInsights !== undefined;

  // If no AI prediction data at all, show a message
  if (!hasPredictions && !hasAnomalies && !hasRisks && !hasOpportunities && !hasInsights) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center p-8">
          <div className="text-6xl mb-4">🤖</div>
          <h3 className="text-2xl font-bold text-slate-700 mb-2">
            AI Predictions Not Available
          </h3>
          <p className="text-slate-500">
            The current dataset doesn't include AI-powered predictions and insights.
            <br />
            Try making a new query to generate fresh predictions.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 w-full max-w-6xl mx-auto p-6">
      {/* Predictions Chart */}
      {hasPredictions && (
        <PredictionsChart
          historicalData={data.chartData}
          predictions={data.predictions}
        />
      )}

      {/* Anomalies Panel */}
      {hasAnomalies && (
        <AnomaliesPanel anomalies={data.anomalies} />
      )}

      {/* Risks & Opportunities Grid */}
      {(hasRisks || hasOpportunities) && (
        <RiskOpportunityCards
          risks={data.risks}
          opportunities={data.opportunities}
        />
      )}

      {/* AI Insights Panel */}
      {hasInsights && (
        <AIInsightsPanel insights={data.aiInsights} />
      )}
    </div>
  );
}
