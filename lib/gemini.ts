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
  },
  required: ['summary', 'stats', 'chartData'],
};

export async function analyzeTradeQuery(query: string): Promise<TradeData> {
  try {
    const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    const result = await genAI.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: `
                You are an expert Indian Trade Analyst. 
                Analyze the following query about India's trade: "${query}".
                
                Use the google_search tool to find the most recent and accurate data for India's trade (Imports/Exports) over the last 15 years (2010-2025).
                Look for specific data points: total volume, peak year, balance, and yearly breakdown.
                
                Provide a realistic analysis based on historical trends.
                Ensure the data is consistent and highlights key trends.
                The 'balance' should clearly state if it is a Surplus or Deficit.

                CRITICAL: In the 'summary', provide a detailed executive summary (approx 3-4 sentences).
                - Explain *why* certain years had peaks or drops (e.g., global recession, policy changes, specific sector growth).
                - Mention key contributing sectors (e.g., Oil, Electronics, Pharma) or global events affecting trade.
                - Connect the data points to tell a coherent story about India's trade evolution.
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
      ]
    };
  }
}
