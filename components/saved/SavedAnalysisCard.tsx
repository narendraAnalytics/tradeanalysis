'use client';

import { SavedTradeAnalysis } from '@/types/analysis';
import { motion } from 'framer-motion';
import { Calendar, TrendingUp, Globe, Eye, Trash2, ChevronRight } from 'lucide-react';
import { deleteAnalysis } from '@/app/actions/analysis';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface SavedAnalysisCardProps {
  analysis: SavedTradeAnalysis;
  index: number;
}

export function SavedAnalysisCard({ analysis, index }: SavedAnalysisCardProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();

    if (!confirm('Are you sure you want to delete this analysis?')) {
      return;
    }

    setIsDeleting(true);
    try {
      await deleteAnalysis(analysis.id);
      router.refresh();
    } catch (error) {
      console.error('Failed to delete:', error);
      alert('Failed to delete analysis');
      setIsDeleting(false);
    }
  };

  const handleCardClick = () => {
    router.push(`/dashboard/saved/${analysis.id}`);
  };

  // Format date
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      onClick={handleCardClick}
      className="glass-card p-6 rounded-2xl cursor-pointer hover:shadow-lg transition-all group"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
            {analysis.title}
          </h3>
          {analysis.description && (
            <p className="text-sm text-muted-foreground line-clamp-2">
              {analysis.description}
            </p>
          )}
        </div>

        {/* Delete Button */}
        <button
          onClick={handleDelete}
          disabled={isDeleting}
          className="ml-4 p-2 rounded-lg hover:bg-red-50 text-muted-foreground hover:text-red-600 transition-colors disabled:opacity-50"
          title="Delete analysis"
        >
          {isDeleting ? (
            <div className="w-5 h-5 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
          ) : (
            <Trash2 className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* Metadata */}
      <div className="flex flex-wrap gap-3 mb-4">
        {/* Date */}
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <Calendar className="w-4 h-4" />
          <span>{formatDate(analysis.createdAt)}</span>
        </div>

        {/* View Count */}
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <Eye className="w-4 h-4" />
          <span>{analysis.viewCount} views</span>
        </div>

        {/* Trade Type Badge */}
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTradeTypeBadge()}`}>
          {analysis.queryParams.tradeType.toUpperCase()}
        </span>
      </div>

      {/* Query Parameters */}
      <div className="space-y-2 mb-4">
        {/* Year Range */}
        <div className="flex items-center gap-2 text-sm">
          <TrendingUp className="w-4 h-4 text-primary" />
          <span className="text-muted-foreground">
            {analysis.queryParams.fromYear} - {analysis.queryParams.toYear}
          </span>
        </div>

        {/* Countries */}
        {analysis.queryParams.countries.length > 0 && (
          <div className="flex items-start gap-2 text-sm">
            <Globe className="w-4 h-4 text-primary mt-0.5" />
            <div className="flex flex-wrap gap-1">
              {analysis.queryParams.countries.slice(0, 3).map((country, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded-full text-xs"
                >
                  {country}
                </span>
              ))}
              {analysis.queryParams.countries.length > 3 && (
                <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded-full text-xs">
                  +{analysis.queryParams.countries.length - 3} more
                </span>
              )}
            </div>
          </div>
        )}

        {/* Sectors */}
        {analysis.queryParams.sectors.length > 0 && (
          <div className="flex items-start gap-2 text-sm">
            <div className="w-4 h-4 mt-0.5" /> {/* Spacer for alignment */}
            <div className="flex flex-wrap gap-1">
              {analysis.queryParams.sectors.slice(0, 3).map((sector, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 bg-purple-50 text-purple-700 rounded-full text-xs"
                >
                  {sector}
                </span>
              ))}
              {analysis.queryParams.sectors.length > 3 && (
                <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded-full text-xs">
                  +{analysis.queryParams.sectors.length - 3} more
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Summary Preview */}
      {analysis.results?.executiveSummary && (
        <div className="mb-3 p-3 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg">
          <p className="text-sm text-slate-700 line-clamp-2">
            {analysis.results.executiveSummary.overview}
          </p>
        </div>
      )}

      {/* Footer - View Details */}
      <div className="flex items-center justify-end text-primary text-sm font-medium group-hover:gap-2 transition-all">
        <span>View Details</span>
        <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
      </div>
    </motion.div>
  );
}
