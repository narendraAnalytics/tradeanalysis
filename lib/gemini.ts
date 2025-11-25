import { GoogleGenAI, Type } from '@google/genai';
import { z } from 'zod';

// Define the schema for the trade data analysis (keeping Zod for type inference)
export const TradeDataSchema = z.object({
  summary: z.string().describe('A brief executive summary of the trade data'),
  stats: z.object({
    totalVolume: z.string().describe('Total trade volume in USD Billions'),
    peakYear: z.string().describe('The year with the highest trade volume'),
    balance: z.string().describe('Trade balance (Surplus/Deficit) in USD Billions'),
  }),
  chartData: z.array(z.object({
    year: z.string(),
    exports: z.number().describe('Export value in USD Billions'),
    imports: z.number().describe('Import value in USD Billions'),
  })).describe('Yearly data for the last 15 years'),
  // Optional fields for enhanced visualizations
  topSectors: z.array(z.object({
    name: z.string().describe('Sector name (e.g., Electronics, Oil, Pharma)'),
    value: z.number().describe('Trade value in USD Billions'),
    percentage: z.number().describe('Percentage of total trade'),
  })).optional().describe('Top 5-6 sectors by trade volume'),
  growthRate: z.string().optional().describe('Overall trade growth rate (e.g., "+12.5%")'),
  yearOverYearChange: z.array(z.object({
    year: z.string(),
    change: z.number().describe('Percentage change from previous year'),
  })).optional().describe('Year-over-year growth rates'),
});

export type TradeData = z.infer<typeof TradeDataSchema>;

const jsonSchema = {
  type: Type.OBJECT,
  properties: {
    summary: { type: Type.STRING, description: 'A brief executive summary of the trade data' },
    stats: {
      type: Type.OBJECT,
      properties: {
        totalVolume: { type: Type.STRING, description: 'Total trade volume in USD Billions' },
        peakYear: { type: Type.STRING, description: 'The year with the highest trade volume' },
        balance: { type: Type.STRING, description: 'Trade balance (Surplus/Deficit) in USD Billions' },
      },
      required: ['totalVolume', 'peakYear', 'balance'],
    },
    chartData: {
      type: Type.ARRAY,
      description: 'Yearly data for the last 15 years',
      items: {
        type: Type.OBJECT,
        properties: {
          year: { type: Type.STRING },
          exports: { type: Type.NUMBER, description: 'Export value in USD Billions' },
          imports: { type: Type.NUMBER, description: 'Import value in USD Billions' },
        },
        required: ['year', 'exports', 'imports'],
      },
    },
    // Optional fields for enhanced visualizations
    topSectors: {
      type: Type.ARRAY,
      description: 'Top 5-6 sectors by trade volume',
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING, description: 'Sector name (e.g., Electronics, Oil, Pharma)' },
          value: { type: Type.NUMBER, description: 'Trade value in USD Billions' },
          percentage: { type: Type.NUMBER, description: 'Percentage of total trade' },
        },
        required: ['name', 'value', 'percentage'],
      },
    },
    growthRate: { type: Type.STRING, description: 'Overall trade growth rate (e.g., "+12.5%")' },
    yearOverYearChange: {
      type: Type.ARRAY,
      description: 'Year-over-year growth rates',
      items: {
        type: Type.OBJECT,
        properties: {
          year: { type: Type.STRING },
          change: { type: Type.NUMBER, description: 'Percentage change from previous year' },
        },
        required: ['year', 'change'],
      },
    },
  },
  required: ['summary', 'stats', 'chartData'],
};

export async function analyzeTradeQuery(query: string, filters?: any): Promise<TradeData> {
  try {
    const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    // Build filter context string
    let filterContext = '';
    if (filters) {
      const filterParts = [];

      if (filters.sectors && filters.sectors.length > 0) {
        filterParts.push(`Focus on these sectors: ${filters.sectors.join(', ')}`);
      }

      if (filters.countries && filters.countries.length > 0) {
        filterParts.push(`Focus on trade with these countries/regions: ${filters.countries.join(', ')}`);
      }

      if (filters.tradeType && filters.tradeType !== 'both') {
        filterParts.push(`Focus ONLY on ${filters.tradeType} (not ${filters.tradeType === 'imports' ? 'exports' : 'imports'})`);
      }

      if (filters.yearFrom && filters.yearTo) {
        if (filters.yearFrom !== '2010' || filters.yearTo !== '2025') {
          filterParts.push(`Analyze data ONLY for the year range ${filters.yearFrom} to ${filters.yearTo}`);
        }
      }

      if (filterParts.length > 0) {
        filterContext = `\n\nAPPLIED FILTERS (MUST RESPECT THESE):\n${filterParts.map((f, i) => `${i + 1}. ${f}`).join('\n')}\n`;
      }
    }

    const result = await genAI.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: `
                You are an expert Indian Trade Analyst with deep knowledge of global economics, trade policies, and India's economic history.

                QUERY: "${query}"
                ${filterContext}
                INSTRUCTIONS:
                1. Use the google_search tool extensively to find the most recent, accurate, and authoritative data for India's trade statistics (2010-2025).
                   - Search for official sources: Ministry of Commerce, RBI, World Bank, IMF, UNCTAD, etc.
                   - Look for sector-specific data, commodity breakdowns, and regional trade patterns.
                   - Cross-verify data points across multiple sources for accuracy.

                2. DATA REQUIREMENTS:
                   - Total trade volume (Imports + Exports) in USD Billions
                   - Peak year with the highest trade activity
                   - Trade balance (clearly state "Surplus ($XXB)" or "Deficit ($XXB)")
                   - Yearly breakdown of imports and exports for 2010-2025
                   - Top 5-6 trading sectors with values and percentages
                   - Year-over-year growth rates for trend analysis
                   - Overall growth rate as a percentage

                3. EXECUTIVE SUMMARY (3-4 compelling sentences):
                   - Explain the *why* behind trends: What drove peaks? What caused declines?
                   - Reference specific events: COVID-19 impact, oil price shocks, policy changes (Make in India, GST), global recessions, trade wars, etc.
                   - Highlight key sectors: Electronics, Petroleum, Gems, Pharma, Engineering, Agriculture
                   - Tell a coherent story of India's trade evolution and positioning in global markets
                   - Use precise data points and percentages to support your narrative

                4. QUALITY STANDARDS:
                   - Ensure all numbers are realistic and consistent across all fields
                   - Verify that imports + exports trends match the stated balance
                   - Make sure sector percentages add up to approximately 70-80% (top sectors)
                   - Year-over-year changes should reflect actual historical events
                   - Growth rates should align with the chart data provided

                5. CONTEXT AWARENESS:
                   - If query mentions specific commodities/sectors, emphasize those in topSectors
                   - If query asks about specific years, highlight those in the summary
                   - Tailor the analysis to answer the user's specific question comprehensively

                OUTPUT: Return structured JSON with all required fields populated based on search findings.
              `
            }
          ]
        }
      ],
      config: {
        responseMimeType: 'application/json',
        responseSchema: jsonSchema,
        tools: [
          {
            googleSearch: {},
          },
        ],
        thinkingConfig: {
          thinkingLevel: 'HIGH' as any,
        },
      }
    });

    const responseText = result.text;
    if (!responseText) {
      throw new Error("No response from Gemini");
    }

    return JSON.parse(responseText) as TradeData;

  } catch (error) {
    console.error("Error analyzing trade data:", error);

    // Fallback to Mock Data as requested
    console.log("Falling back to mock data...");
    return {
      summary: "Due to high demand or API restrictions, we are showing estimated historical data for India's trade. The trend shows consistent growth in both imports and exports, with a widening trade deficit in recent years driven by energy and electronic imports.",
      stats: {
        totalVolume: "$1,100B",
        peakYear: "2024",
        balance: "Deficit ($250B)",
      },
      chartData: [
        { year: "2010", exports: 220, imports: 350 },
        { year: "2011", exports: 300, imports: 460 },
        { year: "2012", exports: 290, imports: 490 },
        { year: "2013", exports: 310, imports: 450 },
        { year: "2014", exports: 320, imports: 460 },
        { year: "2015", exports: 260, imports: 390 },
        { year: "2016", exports: 270, imports: 380 },
        { year: "2017", exports: 300, imports: 460 },
        { year: "2018", exports: 330, imports: 510 },
        { year: "2019", exports: 320, imports: 480 },
        { year: "2020", exports: 290, imports: 370 },
        { year: "2021", exports: 420, imports: 610 },
        { year: "2022", exports: 450, imports: 710 },
        { year: "2023", exports: 430, imports: 680 },
        { year: "2024", exports: 450, imports: 720 },
      ],
      // Optional enhanced data for visualizations
      topSectors: [
        { name: "Petroleum", value: 180, percentage: 24 },
        { name: "Electronics", value: 150, percentage: 20 },
        { name: "Machinery", value: 120, percentage: 16 },
        { name: "Chemicals", value: 90, percentage: 12 },
        { name: "Gems & Jewelry", value: 75, percentage: 10 },
        { name: "Pharmaceuticals", value: 60, percentage: 8 },
      ],
      growthRate: "+8.5%",
      yearOverYearChange: [
        { year: "2011", change: 28.5 },
        { year: "2012", change: 2.5 },
        { year: "2013", change: -5.2 },
        { year: "2014", change: 3.8 },
        { year: "2015", change: -17.5 },
        { year: "2016", change: -0.8 },
        { year: "2017", change: 18.5 },
        { year: "2018", change: 10.5 },
        { year: "2019", change: -4.3 },
        { year: "2020", change: -17.8 },
        { year: "2021", change: 56.1 },
        { year: "2022", change: 12.6 },
        { year: "2023", change: -4.1 },
        { year: "2024", change: 5.9 },
      ],
    };
  }
}
