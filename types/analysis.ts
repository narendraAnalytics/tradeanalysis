/**
 * Trade Analysis Types
 *
 * Type definitions for storing and retrieving trade analysis queries and results
 */

// =============================================================================
// Query Parameters Types
// =============================================================================

/**
 * Trade analysis query parameters
 * These are the filters/inputs the user selects in the dashboard
 */
export interface TradeAnalysisQueryParams {
  // Trade type selection
  tradeType: 'import' | 'export' | 'both';

  // Time range
  fromYear: number;
  toYear: number;

  // Geographic filters
  countries: string[]; // Array of country names/codes
  regions?: string[]; // Optional: regions like "Asia", "Europe"

  // Sector/Industry filters
  sectors: string[]; // Array of sector names
  categories?: string[]; // Optional: specific product categories

  // Advanced filters (optional)
  minValue?: number; // Minimum trade value
  maxValue?: number; // Maximum trade value
  currency?: string; // USD, INR, etc.
  includeServicesTraded?: boolean;

  // Additional metadata
  searchQuery?: string; // Free text search
  sortBy?: 'value' | 'volume' | 'growth' | 'country';
  sortOrder?: 'asc' | 'desc';
}

// =============================================================================
// Analysis Results Types
// =============================================================================

/**
 * Pie chart data structure
 */
export interface PieChartData {
  id: string;
  title: string;
  description?: string;
  data: Array<{
    name: string;
    value: number;
    percentage: number;
    color?: string;
  }>;
  totalValue: number;
  unit: string; // e.g., "USD Million", "Tonnes"
}

/**
 * Bar/Line chart data structure
 */
export interface ChartData {
  id: string;
  title: string;
  type: 'bar' | 'line' | 'area';
  data: Array<{
    label: string;
    value: number;
    additionalData?: Record<string, any>;
  }>;
  xAxisLabel: string;
  yAxisLabel: string;
}

/**
 * Executive Summary
 */
export interface ExecutiveSummary {
  overview: string; // Main summary paragraph
  keyFindings: string[]; // Array of bullet points
  totalTradeValue: number;
  totalTradeVolume?: number;
  topCountry?: {
    name: string;
    value: number;
    percentage: number;
  };
  topSector?: {
    name: string;
    value: number;
    percentage: number;
  };
  yearOverYearGrowth?: number; // Percentage
  periodCovered: string; // e.g., "2020-2024"
}

/**
 * AI Predictions
 */
export interface AIPrediction {
  id: string;
  category: 'growth' | 'trend' | 'risk' | 'opportunity';
  title: string;
  description: string;
  confidence: number; // 0-100
  timeframe: string; // e.g., "Next 12 months", "2025-2026"
  impact: 'high' | 'medium' | 'low';
  relatedCountries?: string[];
  relatedSectors?: string[];
}

/**
 * Complete analysis results
 */
export interface TradeAnalysisResults {
  // Summary
  executiveSummary: ExecutiveSummary;

  // Charts
  pieCharts: PieChartData[];
  timeSeriesCharts?: ChartData[];
  comparisonCharts?: ChartData[];

  // AI-generated insights
  aiPredictions: AIPrediction[];
  aiInsights?: string[]; // Additional AI-generated insights

  // Raw data reference (optional)
  dataSourceInfo?: {
    source: string;
    lastUpdated: string;
    recordCount: number;
  };

  // Generation metadata
  generatedAt: string; // ISO timestamp
  processingTime?: number; // milliseconds
}

// =============================================================================
// Complete Saved Analysis Type
// =============================================================================

/**
 * Complete saved analysis structure
 * This matches what's stored in the database
 */
export interface SavedTradeAnalysis {
  id: string;
  userId: string;
  title: string;
  description?: string;
  queryParams: TradeAnalysisQueryParams;
  results?: TradeAnalysisResults;
  isPublic: boolean;
  viewCount: number;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Input for creating a new saved analysis
 */
export interface CreateAnalysisInput {
  title: string;
  description?: string;
  queryParams: TradeAnalysisQueryParams;
  results?: TradeAnalysisResults;
  isPublic?: boolean;
}

/**
 * Input for updating an existing analysis
 */
export interface UpdateAnalysisInput {
  id: string;
  title?: string;
  description?: string;
  results?: TradeAnalysisResults;
  isPublic?: boolean;
}
