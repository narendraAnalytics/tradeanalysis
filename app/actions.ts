"use server";

import { analyzeTradeQuery, TradeData, generateQueryFromFilters, FilterValues } from "@/lib/gemini";
import { nanoid } from "nanoid";
import { saveTradeAnalysis } from "@/app/actions/analysis";
import { TradeAnalysisResults, TradeAnalysisQueryParams } from "@/types/analysis";

export type Message = {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    data?: TradeData;
};

export type ChatState = {
    messages: Message[];
};

export async function analyzeTradeData(prevState: ChatState, formData: FormData): Promise<ChatState> {
    const query = formData.get('query') as string;
    const filtersJson = formData.get('filters') as string | null;

    if (!query || query.trim() === '') {
        return prevState;
    }

    const userMessage: Message = {
        id: nanoid(),
        role: 'user',
        content: query,
    };

    // Parse filters if provided
    let filters = null;
    if (filtersJson) {
        try {
            filters = JSON.parse(filtersJson);
        } catch (e) {
            console.error('Failed to parse filters:', e);
        }
    }

    // Optimistic update could be handled in client, but here we return the new state
    // actually useActionState waits for the server. useOptimistic is for immediate UI.

    try {
        const data = await analyzeTradeQuery(query, filters);

        // Auto-save analysis to database (non-blocking)
        try {
            await saveAnalysisToDatabase(query, data, filters);
        } catch (saveError) {
            console.error('Failed to save analysis to database:', saveError);
            // Continue even if save fails - user still sees results
        }

        const aiMessage: Message = {
            id: nanoid(),
            role: 'assistant',
            content: "Here is the analysis based on your query.",
            data: data,
        };

        return {
            messages: [...prevState.messages, userMessage, aiMessage],
        };
    } catch (error) {
        console.error(error);
        const errorMessage: Message = {
            id: nanoid(),
            role: 'assistant',
            content: "I'm sorry, I couldn't analyze that data right now. Please try again.",
        };
        return {
            messages: [...prevState.messages, userMessage, errorMessage],
        };
    }
}

/**
 * Server action to generate a natural language query from filter selections
 */
export async function generateQueryFromFiltersAction(filters: FilterValues): Promise<string> {
    try {
        const query = await generateQueryFromFilters(filters);
        return query;
    } catch (error) {
        console.error("Error in generateQueryFromFiltersAction:", error);
        return "Show me India's trade data";
    }
}

/**
 * Helper function to save analysis results to database
 * Maps TradeData from Gemini to our database schema
 */
async function saveAnalysisToDatabase(
    query: string,
    data: TradeData,
    filters: any
): Promise<void> {
    // Generate a descriptive title from the query/filters
    let title = query;
    if (title.length > 100) {
        title = title.substring(0, 97) + '...';
    }

    // Build query parameters
    const queryParams: TradeAnalysisQueryParams = {
        tradeType: filters?.tradeType === 'imports' ? 'import' :
                   filters?.tradeType === 'exports' ? 'export' : 'both',
        fromYear: parseInt(filters?.yearFrom || '2010'),
        toYear: parseInt(filters?.yearTo || '2025'),
        countries: filters?.countries || [],
        sectors: filters?.sectors || [],
    };

    // Map TradeData to TradeAnalysisResults
    const results: TradeAnalysisResults = {
        executiveSummary: {
            overview: data.summary,
            keyFindings: data.aiInsights?.marketTrends ?
                [data.aiInsights.marketTrends] : [],
            totalTradeValue: parseFloat(data.stats.totalVolume.replace(/[^0-9.]/g, '')) || 0,
            periodCovered: `${queryParams.fromYear}-${queryParams.toYear}`,
            topSector: data.topSectors?.[0] ? {
                name: data.topSectors[0].name,
                value: data.topSectors[0].value,
                percentage: data.topSectors[0].percentage,
            } : undefined,
            yearOverYearGrowth: data.growthRate ?
                parseFloat(data.growthRate.replace(/[^0-9.-]/g, '')) : undefined,
        },
        pieCharts: data.topSectors?.map((sector, index) => ({
            id: `sector-${index}`,
            title: 'Top Sectors by Trade Volume',
            data: data.topSectors!.map(s => ({
                name: s.name,
                value: s.value,
                percentage: s.percentage,
            })),
            totalValue: data.topSectors!.reduce((sum, s) => sum + s.value, 0),
            unit: 'USD Billion',
        })).slice(0, 1) || [], // Just one pie chart for sectors
        timeSeriesCharts: [{
            id: 'yearly-trade',
            title: 'Yearly Trade Data',
            type: 'line' as const,
            data: data.chartData.map(d => ({
                label: d.year,
                value: d.exports + d.imports,
            })),
            xAxisLabel: 'Year',
            yAxisLabel: 'Trade Value (USD Billion)',
        }],
        aiPredictions: data.predictions?.map((pred, index) => ({
            id: `prediction-${index}`,
            category: 'growth' as const,
            title: `${pred.year} Trade Forecast`,
            description: `Predicted exports: $${pred.exports}B, Imports: $${pred.imports}B`,
            confidence: pred.confidence,
            timeframe: pred.year,
            impact: pred.confidence > 80 ? 'high' as const :
                    pred.confidence > 60 ? 'medium' as const : 'low' as const,
        })) || [],
        aiInsights: data.aiInsights ? [
            data.aiInsights.marketTrends,
            data.aiInsights.strategicRecommendations,
            data.aiInsights.comparativeAnalysis,
        ].filter(Boolean) : [],
        generatedAt: new Date().toISOString(),
    };

    // Add risks and opportunities as predictions if available
    if (data.risks) {
        data.risks.forEach((risk, index) => {
            results.aiPredictions.push({
                id: `risk-${index}`,
                category: 'risk' as const,
                title: risk.title,
                description: risk.description,
                confidence: risk.severity === 'High' ? 85 : risk.severity === 'Medium' ? 65 : 45,
                timeframe: risk.timeframe,
                impact: risk.severity.toLowerCase() as 'high' | 'medium' | 'low',
            });
        });
    }

    if (data.opportunities) {
        data.opportunities.forEach((opp, index) => {
            results.aiPredictions.push({
                id: `opportunity-${index}`,
                category: 'opportunity' as const,
                title: opp.title,
                description: opp.description,
                confidence: 75,
                timeframe: opp.timeframe,
                impact: 'high' as const,
            });
        });
    }

    // Save to database
    await saveTradeAnalysis({
        title,
        description: `Generated from: ${query}`,
        queryParams,
        results,
        isPublic: false,
    });
}
