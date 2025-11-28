import { getAnalysisById, incrementViewCount, deleteAnalysis } from '@/app/actions/analysis';
import { notFound, redirect } from 'next/navigation';
import { ArrowLeft, Calendar, Eye, Globe, TrendingUp, Trash2, Download } from 'lucide-react';
import Link from 'next/link';

export default async function AnalysisDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const analysis = await getAnalysisById(id);

  if (!analysis) {
    notFound();
  }

  // Increment view count
  await incrementViewCount(id);

  // Format date
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Get trade type badge color
  const getTradeTypeBadge = () => {
    const type = analysis.queryParams.tradeType;
    const colors = {
      import: 'bg-blue-100 text-blue-700',
      export: 'bg-green-100 text-green-700',
      both: 'bg-purple-100 text-purple-700',
    };
    return colors[type] || colors.both;
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white py-8">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center gap-3 mb-4">
            <Link
              href="/dashboard/saved"
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-6 h-6" />
            </Link>
            <div className="flex-1">
              <h1 className="text-2xl font-bold mb-2">{analysis.title}</h1>
              {analysis.description && (
                <p className="text-white/90 text-sm">{analysis.description}</p>
              )}
            </div>
          </div>

          {/* Metadata */}
          <div className="flex flex-wrap gap-4 ml-14 text-sm">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>{formatDate(analysis.createdAt)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4" />
              <span>{analysis.viewCount + 1} views</span>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getTradeTypeBadge()} bg-white/20 text-white`}>
              {analysis.queryParams.tradeType.toUpperCase()}
            </span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Query Parameters Card */}
        <div className="glass-card p-6 rounded-2xl mb-8">
          <h2 className="text-xl font-bold text-foreground mb-4">Analysis Parameters</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Trade Type */}
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-2">Trade Type</p>
              <span className={`inline-block px-3 py-1 rounded-lg text-sm font-medium ${getTradeTypeBadge()}`}>
                {analysis.queryParams.tradeType.charAt(0).toUpperCase() + analysis.queryParams.tradeType.slice(1)}
              </span>
            </div>

            {/* Time Period */}
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-2">Time Period</p>
              <div className="flex items-center gap-2 text-foreground">
                <TrendingUp className="w-5 h-5 text-primary" />
                <span className="font-semibold">
                  {analysis.queryParams.fromYear} - {analysis.queryParams.toYear}
                </span>
              </div>
            </div>

            {/* Countries */}
            {analysis.queryParams.countries.length > 0 && (
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">
                  Countries ({analysis.queryParams.countries.length})
                </p>
                <div className="flex flex-wrap gap-2">
                  {analysis.queryParams.countries.map((country, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-lg text-sm font-medium"
                    >
                      {country}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Sectors */}
            {analysis.queryParams.sectors.length > 0 && (
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">
                  Sectors ({analysis.queryParams.sectors.length})
                </p>
                <div className="flex flex-wrap gap-2">
                  {analysis.queryParams.sectors.map((sector, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-purple-50 text-purple-700 rounded-lg text-sm font-medium"
                    >
                      {sector}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Results */}
        {analysis.results && (
          <div className="space-y-8">
            {/* Executive Summary */}
            <div className="glass-card p-6 rounded-2xl">
              <h2 className="text-xl font-bold text-foreground mb-4">Executive Summary</h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                {analysis.results.executiveSummary.overview}
              </p>

              {/* Key Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl">
                  <p className="text-sm text-muted-foreground mb-1">Total Trade Value</p>
                  <p className="text-2xl font-bold text-foreground">
                    ${analysis.results.executiveSummary.totalTradeValue.toFixed(0)}B
                  </p>
                </div>

                {analysis.results.executiveSummary.topSector && (
                  <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl">
                    <p className="text-sm text-muted-foreground mb-1">Top Sector</p>
                    <p className="text-lg font-bold text-foreground">
                      {analysis.results.executiveSummary.topSector.name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {analysis.results.executiveSummary.topSector.percentage}%
                    </p>
                  </div>
                )}

                {analysis.results.executiveSummary.yearOverYearGrowth !== undefined && (
                  <div className="p-4 bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl">
                    <p className="text-sm text-muted-foreground mb-1">Growth Rate</p>
                    <p className="text-2xl font-bold text-foreground">
                      {analysis.results.executiveSummary.yearOverYearGrowth > 0 ? '+' : ''}
                      {analysis.results.executiveSummary.yearOverYearGrowth.toFixed(1)}%
                    </p>
                  </div>
                )}
              </div>

              {/* Key Findings */}
              {analysis.results.executiveSummary.keyFindings.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-foreground mb-3">Key Findings</h3>
                  <ul className="space-y-2">
                    {analysis.results.executiveSummary.keyFindings.map((finding, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                        <span className="text-muted-foreground">{finding}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Charts */}
            {analysis.results.pieCharts.length > 0 && (
              <div className="glass-card p-6 rounded-2xl">
                <h2 className="text-xl font-bold text-foreground mb-4">Trade Distribution</h2>
                {analysis.results.pieCharts.map((chart, idx) => (
                  <div key={idx} className="mb-6 last:mb-0">
                    <h3 className="text-lg font-semibold text-foreground mb-3">{chart.title}</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {chart.data.map((item, i) => (
                        <div
                          key={i}
                          className="p-4 bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl"
                        >
                          <p className="text-sm font-medium text-foreground mb-1">{item.name}</p>
                          <p className="text-xl font-bold text-primary">{item.percentage}%</p>
                          <p className="text-xs text-muted-foreground">${item.value}B</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* AI Predictions */}
            {analysis.results.aiPredictions.length > 0 && (
              <div className="glass-card p-6 rounded-2xl">
                <h2 className="text-xl font-bold text-foreground mb-4">
                  AI Insights & Predictions ({analysis.results.aiPredictions.length})
                </h2>
                <div className="space-y-4">
                  {analysis.results.aiPredictions.map((prediction) => (
                    <div
                      key={prediction.id}
                      className={`p-4 rounded-xl border-l-4 ${
                        prediction.category === 'growth'
                          ? 'bg-green-50 border-green-500'
                          : prediction.category === 'risk'
                          ? 'bg-red-50 border-red-500'
                          : prediction.category === 'opportunity'
                          ? 'bg-blue-50 border-blue-500'
                          : 'bg-yellow-50 border-yellow-500'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-semibold text-foreground">{prediction.title}</h4>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            prediction.impact === 'high'
                              ? 'bg-red-100 text-red-700'
                              : prediction.impact === 'medium'
                              ? 'bg-yellow-100 text-yellow-700'
                              : 'bg-green-100 text-green-700'
                          }`}
                        >
                          {prediction.impact.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{prediction.description}</p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>Confidence: {prediction.confidence}%</span>
                        <span>Timeframe: {prediction.timeframe}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* AI Insights */}
            {analysis.results.aiInsights && analysis.results.aiInsights.length > 0 && (
              <div className="glass-card p-6 rounded-2xl">
                <h2 className="text-xl font-bold text-foreground mb-4">Additional Insights</h2>
                <div className="space-y-3">
                  {analysis.results.aiInsights.map((insight, idx) => (
                    <p key={idx} className="text-muted-foreground leading-relaxed">
                      {insight}
                    </p>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
