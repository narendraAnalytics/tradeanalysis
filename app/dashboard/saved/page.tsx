import { getUserAnalyses } from '@/app/actions/analysis';
import { SavedAnalysisCard } from '@/components/saved/SavedAnalysisCard';
import { History, TrendingUp, BarChart3 } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: 'Saved Analyses | India Trade Agent',
  description: 'View your saved trade analyses',
};

export default async function SavedAnalysesPage() {
  const analyses = await getUserAnalyses();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-3 mb-4">
            <Link
              href="/dashboard"
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </Link>
            <History className="w-8 h-8" />
            <h1 className="text-3xl font-bold">Saved Analyses</h1>
          </div>
          <p className="text-white/90 ml-14">
            View and manage your trade analysis history
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        {analyses.length > 0 ? (
          <>
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="glass-card p-6 rounded-2xl">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-muted-foreground text-sm mb-1">
                      Total Analyses
                    </p>
                    <p className="text-3xl font-bold text-foreground">
                      {analyses.length}
                    </p>
                  </div>
                  <BarChart3 className="w-12 h-12 text-primary opacity-20" />
                </div>
              </div>

              <div className="glass-card p-6 rounded-2xl">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-muted-foreground text-sm mb-1">
                      Total Views
                    </p>
                    <p className="text-3xl font-bold text-foreground">
                      {analyses.reduce((sum, a) => sum + a.viewCount, 0)}
                    </p>
                  </div>
                  <TrendingUp className="w-12 h-12 text-green-500 opacity-20" />
                </div>
              </div>

              <div className="glass-card p-6 rounded-2xl">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-muted-foreground text-sm mb-1">
                      Most Recent
                    </p>
                    <p className="text-lg font-bold text-foreground">
                      {new Date(analyses[0].createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                  <History className="w-12 h-12 text-purple-500 opacity-20" />
                </div>
              </div>
            </div>

            {/* Analyses Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {analyses.map((analysis, index) => (
                <SavedAnalysisCard
                  key={analysis.id}
                  analysis={analysis}
                  index={index}
                />
              ))}
            </div>
          </>
        ) : (
          /* Empty State */
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-24 h-24 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center mb-6">
              <History className="w-12 h-12 text-indigo-600" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-3">
              No Saved Analyses Yet
            </h2>
            <p className="text-muted-foreground text-center max-w-md mb-8">
              Start analyzing India's trade data and your results will automatically be saved here for future reference.
            </p>
            <Link
              href="/dashboard"
              className="px-6 py-3 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white font-semibold rounded-xl hover:shadow-lg transition-all hover:scale-105"
            >
              Start Your First Analysis
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
