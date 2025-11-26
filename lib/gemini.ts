import { GoogleGenAI, Type } from '@google/genai';
import { z } from 'zod';
import { forecastTradeData } from './forecasting';

// Filter values type (matching FilterPanel)
export type FilterValues = {
  sectors: string[];
  yearFrom: string;
  yearTo: string;
  countries: string[];
  tradeType: 'imports' | 'exports' | 'both';
};

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
  // AI Predictions & Insights fields
  predictions: z.array(z.object({
    year: z.string(),
    exports: z.number().describe('Predicted export value in USD Billions'),
    imports: z.number().describe('Predicted import value in USD Billions'),
    confidence: z.number().describe('Confidence level of prediction (0-100)'),
  })).optional().describe('Forecast for next 2 years (2026-2027)'),
  anomalies: z.array(z.object({
    year: z.string(),
    title: z.string().describe('Anomaly event title'),
    type: z.enum(['spike', 'drop', 'disruption']).describe('Type: spike, drop, disruption'),
    severity: z.enum(['Critical', 'High', 'Moderate']).describe('Severity: Critical, High, Moderate'),
    context: z.string().describe('What happened and why'),
    impact: z.string().describe('Quantified effect on trade'),
    recovery: z.string().describe('Recovery timeline and analysis'),
  })).optional().describe('Detected anomalies with detailed analysis'),
  risks: z.array(z.object({
    title: z.string().describe('Risk title'),
    description: z.string().describe('Detailed risk description'),
    severity: z.enum(['High', 'Medium', 'Low']).describe('High, Medium, Low'),
    timeframe: z.string().describe('Short-term, Medium-term, Long-term'),
    mitigation: z.string().describe('Suggested mitigation strategies'),
  })).optional().describe('Identified risks for future trade'),
  opportunities: z.array(z.object({
    title: z.string().describe('Opportunity title'),
    description: z.string().describe('Detailed opportunity description'),
    potential: z.string().describe('Estimated impact/value'),
    timeframe: z.string().describe('Short-term, Medium-term, Long-term'),
    action: z.string().describe('Recommended actions to capitalize'),
  })).optional().describe('Identified opportunities for growth'),
  aiInsights: z.object({
    marketTrends: z.string().describe('Key patterns and market shifts'),
    strategicRecommendations: z.string().describe('Actionable strategic advice'),
    comparativeAnalysis: z.string().describe('India vs global trade benchmarks'),
  }).optional().describe('Advanced AI-generated insights'),
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
    // AI Predictions & Insights fields
    predictions: {
      type: Type.ARRAY,
      description: 'Forecast for next 2 years (2026-2027)',
      items: {
        type: Type.OBJECT,
        properties: {
          year: { type: Type.STRING },
          exports: { type: Type.NUMBER, description: 'Predicted export value in USD Billions' },
          imports: { type: Type.NUMBER, description: 'Predicted import value in USD Billions' },
          confidence: { type: Type.NUMBER, description: 'Confidence level of prediction (0-100)' },
        },
        required: ['year', 'exports', 'imports', 'confidence'],
      },
    },
    anomalies: {
      type: Type.ARRAY,
      description: 'Detected anomalies with detailed analysis',
      items: {
        type: Type.OBJECT,
        properties: {
          year: { type: Type.STRING },
          title: { type: Type.STRING, description: 'Anomaly event title' },
          type: { type: Type.STRING, description: 'Type: spike, drop, disruption', enum: ['spike', 'drop', 'disruption'] },
          severity: { type: Type.STRING, description: 'Severity: Critical, High, Moderate', enum: ['Critical', 'High', 'Moderate'] },
          context: { type: Type.STRING, description: 'What happened and why' },
          impact: { type: Type.STRING, description: 'Quantified effect on trade' },
          recovery: { type: Type.STRING, description: 'Recovery timeline and analysis' },
        },
        required: ['year', 'title', 'type', 'severity', 'context', 'impact', 'recovery'],
      },
    },
    risks: {
      type: Type.ARRAY,
      description: 'Identified risks for future trade',
      items: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING, description: 'Risk title' },
          description: { type: Type.STRING, description: 'Detailed risk description' },
          severity: { type: Type.STRING, description: 'High, Medium, Low', enum: ['High', 'Medium', 'Low'] },
          timeframe: { type: Type.STRING, description: 'Short-term, Medium-term, Long-term' },
          mitigation: { type: Type.STRING, description: 'Suggested mitigation strategies' },
        },
        required: ['title', 'description', 'severity', 'timeframe', 'mitigation'],
      },
    },
    opportunities: {
      type: Type.ARRAY,
      description: 'Identified opportunities for growth',
      items: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING, description: 'Opportunity title' },
          description: { type: Type.STRING, description: 'Detailed opportunity description' },
          potential: { type: Type.STRING, description: 'Estimated impact/value' },
          timeframe: { type: Type.STRING, description: 'Short-term, Medium-term, Long-term' },
          action: { type: Type.STRING, description: 'Recommended actions to capitalize' },
        },
        required: ['title', 'description', 'potential', 'timeframe', 'action'],
      },
    },
    aiInsights: {
      type: Type.OBJECT,
      description: 'Advanced AI-generated insights',
      properties: {
        marketTrends: { type: Type.STRING, description: 'Key patterns and market shifts' },
        strategicRecommendations: { type: Type.STRING, description: 'Actionable strategic advice' },
        comparativeAnalysis: { type: Type.STRING, description: 'India vs global trade benchmarks' },
      },
      required: ['marketTrends', 'strategicRecommendations', 'comparativeAnalysis'],
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

                4. AI-POWERED PREDICTIONS & INSIGHTS (NEW):
                   a) FORECASTS (predictions field):
                      - Generate data-driven predictions for 2026 and 2027 based on historical trends
                      - Consider recent growth patterns, policy impacts, and global economic outlook
                      - Provide realistic export and import forecasts in USD Billions
                      - Assign confidence levels (0-100) based on trend stability and external factors
                      - Factor in: ongoing trade agreements, sectoral growth, geopolitical situations

                   b) ANOMALY DETECTION (anomalies field):
                      - Identify 3-5 major anomalies in the historical data (2010-2025)
                      - For each anomaly provide:
                        * Year and descriptive title (e.g., "COVID-19 Trade Collapse")
                        * Type: spike, drop, or disruption
                        * Severity: Critical, High, or Moderate
                        * Context: Detailed explanation of what happened and root causes
                        * Impact: Quantified effect on trade volumes (e.g., "-18% drop in total trade")
                        * Recovery: Timeline and analysis of how trade recovered post-event
                      - Focus on: COVID-19, oil crises, global recessions, policy reforms, trade wars

                   c) RISK ANALYSIS (risks field):
                      - Identify 4-6 potential risks for India's future trade
                      - Consider: geopolitical tensions, supply chain vulnerabilities, commodity price volatility,
                        currency fluctuations, protectionism, climate impacts, dependency on specific markets
                      - For each risk:
                        * Clear title and detailed description
                        * Severity: High, Medium, or Low
                        * Timeframe: Short-term (<1 year), Medium-term (1-3 years), Long-term (>3 years)
                        * Mitigation: Concrete strategies to reduce or manage the risk

                   d) OPPORTUNITY IDENTIFICATION (opportunities field):
                      - Identify 4-6 growth opportunities for India's trade
                      - Consider: emerging markets, FTA benefits, sectoral advantages, technology adoption,
                        manufacturing incentives (PLI schemes), sustainability trends, services exports
                      - For each opportunity:
                        * Compelling title and description
                        * Potential: Estimated impact or value (e.g., "$50B potential by 2028")
                        * Timeframe: When the opportunity can be realized
                        * Action: Specific recommended actions to capitalize

                   e) ADVANCED AI INSIGHTS (aiInsights field):
                      - Market Trends: 3-4 key patterns, structural shifts, and emerging dynamics
                      - Strategic Recommendations: 5-6 actionable strategies for policymakers/businesses
                      - Comparative Analysis: India's position vs major economies (China, USA, EU),
                        strengths/weaknesses, competitive advantages

                5. QUALITY STANDARDS:
                   - Ensure all numbers are realistic and consistent across all fields
                   - Verify that imports + exports trends match the stated balance
                   - Make sure sector percentages add up to approximately 70-80% (top sectors)
                   - Year-over-year changes should reflect actual historical events
                   - Growth rates should align with the chart data provided
                   - Predictions should be grounded in data and realistic (not overly optimistic)
                   - Anomalies should be actual historical events with verifiable impacts
                   - Risks and opportunities should be specific, actionable, and well-researched

                6. CONTEXT AWARENESS:
                   - If query mentions specific commodities/sectors, emphasize those in topSectors, predictions, and insights
                   - If query asks about specific years, highlight those in the summary and anomaly detection
                   - Tailor the analysis, risks, and opportunities to the user's specific question
                   - Ensure predictions align with the sectors/regions mentioned in the query

                OUTPUT: Return comprehensive structured JSON with ALL fields (including predictions, anomalies, risks, opportunities, and aiInsights) populated based on extensive search findings and deep analysis.
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

    const geminiData = JSON.parse(responseText) as TradeData;

    // Hybrid Approach: If Gemini didn't provide predictions, generate them with TensorFlow.js
    if (!geminiData.predictions || geminiData.predictions.length === 0) {
      try {
        const tfPredictions = await forecastTradeData(geminiData.chartData, 2);
        geminiData.predictions = tfPredictions;
      } catch (error) {
        console.error('Error generating TensorFlow predictions:', error);
      }
    }

    return geminiData;

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
      // AI Predictions & Insights (Mock Data)
      predictions: [
        { year: "2026", exports: 475, imports: 750, confidence: 78 },
        { year: "2027", exports: 495, imports: 780, confidence: 72 },
      ],
      anomalies: [
        {
          year: "2020",
          title: "COVID-19 Pandemic Trade Collapse",
          type: "drop",
          severity: "Critical",
          context: "The COVID-19 pandemic caused unprecedented global supply chain disruptions, lockdowns, and reduced economic activity. India's trade was severely impacted due to manufacturing shutdowns, logistics challenges, and reduced global demand.",
          impact: "Total trade volume declined by approximately 17.8% year-over-year, with both exports (-9.4%) and imports (-23.5%) falling sharply. This represents a loss of over $150 billion in trade value.",
          recovery: "Recovery began in Q2 2021 with massive fiscal stimulus, pent-up demand, and vaccination rollout. Trade volumes surged 56.1% in 2021, surpassing pre-pandemic levels by Q4 2021. Full normalization achieved by 2022."
        },
        {
          year: "2015",
          title: "Oil Price Crash Impact",
          type: "drop",
          severity: "High",
          context: "Global oil prices collapsed from $100/barrel to $30/barrel due to oversupply and OPEC production decisions. This significantly affected India's petroleum export revenues and overall trade dynamics.",
          impact: "Trade declined by 17.5% year-over-year, primarily driven by reduced petroleum export values despite stable volumes. Import costs also dropped, slightly improving trade deficit.",
          recovery: "Gradual recovery through 2016-2017 as oil prices stabilized around $50-60/barrel. Export diversification into pharmaceuticals and electronics accelerated during this period."
        },
        {
          year: "2021",
          title: "Post-Pandemic Trade Surge",
          type: "spike",
          severity: "High",
          context: "Massive rebound in global trade following pandemic recovery, fueled by pent-up demand, supply chain normalization, stimulus measures, and accelerated digitalization. India benefited from PLI schemes and manufacturing growth.",
          impact: "Exceptional 56.1% year-over-year growth in total trade. Exports jumped 44.8% ($420B) and imports surged 65.0% ($610B), reflecting strong domestic recovery and global demand.",
          recovery: "Growth moderated to sustainable levels in 2022-2023 (averaging 5-7% annually) as the exceptional base effect normalized and global economic conditions stabilized."
        },
        {
          year: "2018",
          title: "US-China Trade War Spillover Benefits",
          type: "spike",
          severity: "Moderate",
          context: "The US-China trade war created opportunities for India in electronics, textiles, and machinery exports as companies diversified supply chains away from China. 'China+1' strategy gained momentum.",
          impact: "Trade growth accelerated to 10.5% year-over-year. Indian exports to US grew 12.6%, and manufacturing exports increased as global buyers sought alternatives to Chinese suppliers.",
          recovery: "Benefits continued through 2019-2020, though partially offset by global economic slowdown. India's position as an alternative manufacturing hub strengthened permanently."
        }
      ],
      risks: [
        {
          title: "Geopolitical Tensions and Trade Fragmentation",
          description: "Rising geopolitical conflicts (Russia-Ukraine, US-China rivalry, Middle East instability) are fragmenting global trade into blocs. India faces risks from reduced access to key markets, supply chain disruptions, and potential sanctions spillover effects.",
          severity: "High",
          timeframe: "Medium-term",
          mitigation: "Diversify trade partnerships through bilateral FTAs, strengthen regional integration (ASEAN, GCC), maintain strategic autonomy, and develop domestic manufacturing capacity for critical goods."
        },
        {
          title: "Oil and Commodity Price Volatility",
          description: "India imports 85% of its oil needs. Sudden spikes in crude oil prices (due to OPEC cuts, Middle East conflicts, or global demand surges) can severely widen the trade deficit and strain foreign reserves.",
          severity: "High",
          timeframe: "Short-term",
          mitigation: "Accelerate renewable energy adoption, increase strategic petroleum reserves, negotiate long-term oil purchase agreements, and hedge commodity exposure through financial instruments."
        },
        {
          title: "Rising Protectionism in Key Markets",
          description: "Major trading partners (US, EU) are increasingly adopting protectionist measures—higher tariffs, stringent standards, carbon border taxes—which could restrict India's export access, especially in steel, textiles, and agriculture.",
          severity: "Medium",
          timeframe: "Medium-term",
          mitigation: "Upgrade product quality and sustainability standards, engage in active trade diplomacy, seek exemptions through FTAs, and develop new markets in Africa, Latin America, and Southeast Asia."
        },
        {
          title: "Currency Fluctuations and Rupee Depreciation",
          description: "Persistent trade deficits and capital outflows can weaken the rupee, making imports costlier (especially energy and electronics) and fueling inflation. This creates a vicious cycle affecting economic stability.",
          severity: "Medium",
          timeframe: "Short-term",
          mitigation: "Boost export competitiveness, attract FDI, build forex reserves, promote rupee-based trade settlements, and implement monetary policies to stabilize the currency."
        },
        {
          title: "Over-dependence on China for Critical Imports",
          description: "India relies heavily on China for electronics, active pharmaceutical ingredients (APIs), telecom equipment, and machinery. Any disruption (sanctions, conflicts, supply chain issues) could cripple key sectors.",
          severity: "High",
          timeframe: "Long-term",
          mitigation: "Implement PLI schemes to boost domestic production, develop alternative suppliers (Vietnam, South Korea, Taiwan), invest in R&D for critical technologies, and reduce import dependency through Make in India."
        },
        {
          title: "Climate Change and Supply Chain Disruptions",
          description: "Extreme weather events (floods, droughts, cyclones) are increasingly disrupting production, logistics, and agricultural exports. Climate-related regulations (carbon taxes, green standards) may also affect trade competitiveness.",
          severity: "Medium",
          timeframe: "Long-term",
          mitigation: "Invest in climate-resilient infrastructure, adopt green manufacturing practices, transition to clean energy, and comply with international sustainability standards to maintain export access."
        }
      ],
      opportunities: [
        {
          title: "Global Supply Chain Diversification (China+1)",
          description: "Companies worldwide are reducing China dependency and seeking alternative manufacturing hubs. India is well-positioned with its large workforce, improving infrastructure, and competitive costs to attract this investment wave.",
          potential: "$150B+ in additional manufacturing exports by 2030",
          timeframe: "Medium-term",
          action: "Accelerate PLI scheme implementation in electronics, EVs, and semiconductors; improve ease of doing business; develop dedicated manufacturing clusters; and fast-track FTA negotiations."
        },
        {
          title: "Electronics and Semiconductor Manufacturing Boom",
          description: "India's electronics production has grown 15% annually. With government incentives (PLI), Apple/Samsung expansion, and global chip shortages, India can become a major electronics and semiconductor exporter, reducing the $70B electronics import bill.",
          potential: "$100B electronics exports by 2028",
          timeframe: "Short-term",
          action: "Expand PLI schemes for semiconductors and electronics; attract global chip manufacturers; develop specialized talent pools; and build robust component ecosystems."
        },
        {
          title: "Green Energy and Sustainability Exports",
          description: "Global demand for solar panels, wind turbines, green hydrogen, and sustainable products is surging. India's renewable energy capacity and manufacturing potential position it as a key supplier in the green transition.",
          potential: "$75B in green energy exports by 2030",
          timeframe: "Medium-term",
          action: "Scale up solar panel and wind turbine manufacturing; invest in green hydrogen production; develop carbon-neutral supply chains; and leverage international climate finance."
        },
        {
          title: "Pharmaceutical and Healthcare Exports Expansion",
          description: "India is the 'pharmacy of the world,' supplying 60% of global vaccines and 20% of generic drugs. Post-pandemic, demand for healthcare products, APIs, and biotech solutions is growing rapidly.",
          potential: "$50B pharmaceutical exports by 2027",
          timeframe: "Short-term",
          action: "Boost API manufacturing to reduce China dependency; invest in biotech R&D; ensure compliance with global quality standards (USFDA, EMA); and expand into high-margin specialty drugs."
        },
        {
          title: "Services Exports Digitalization (IT, GCC, Consulting)",
          description: "India's IT services exports ($200B+) continue to grow with cloud computing, AI, cybersecurity, and digital transformation demand. GCC (Global Capability Centers) are booming, with 1,600+ centers in India employing 1.6M+ people.",
          potential: "$300B services exports by 2028",
          timeframe: "Short-term",
          action: "Upskill workforce in AI, ML, and cloud technologies; attract more GCCs with tax incentives; develop digital infrastructure; and promote India as a global R&D hub."
        },
        {
          title: "FTA Network Expansion (UAE, UK, EU, Australia)",
          description: "India is aggressively pursuing FTAs with major economies. Recent agreements with UAE and Australia have boosted trade. Upcoming FTAs with UK, EU, and Canada can unlock $100B+ in additional trade.",
          potential: "$120B incremental trade by 2030",
          timeframe: "Medium-term",
          action: "Fast-track FTA negotiations; ensure favorable terms for key sectors (textiles, pharma, agriculture); educate exporters on FTA benefits; and establish trade facilitation mechanisms."
        }
      ],
      aiInsights: {
        marketTrends: "India's trade is shifting from commodity-heavy to manufacturing and services-driven growth. Electronics, green energy, and pharmaceuticals are emerging as strategic sectors. The 'China+1' trend and supply chain diversification present historic opportunities. Digital services (IT, GCC, fintech) continue to be a $200B+ strength. Trade deficit remains a concern, driven by energy imports, but improving with export diversification and renewable energy adoption.",
        strategicRecommendations: "1. Prioritize electronics and semiconductor manufacturing through PLI schemes and infrastructure development. 2. Aggressively pursue FTAs with EU, UK, and other major economies to expand market access. 3. Reduce China dependency for critical imports (APIs, electronics) by boosting domestic production and alternative suppliers. 4. Accelerate green energy manufacturing to capitalize on global sustainability trends. 5. Strengthen rupee-based trade settlements to reduce currency risk. 6. Develop dedicated export clusters for high-growth sectors (EVs, solar, biotech).",
        comparativeAnalysis: "India's trade-to-GDP ratio (~45%) lags behind China (38%), Vietnam (200%), and South Korea (85%), indicating significant growth potential. Strengths include IT services dominance, pharmaceutical manufacturing prowess, and a young workforce. Weaknesses include persistent trade deficits, infrastructure gaps, and regulatory complexities. Compared to China, India offers lower geopolitical risk and democratic governance, attracting supply chain diversification. Unlike Vietnam's export-led model, India must balance domestic consumption with export growth. India's services surplus ($150B+) partially offsets merchandise deficit, a unique advantage over manufacturing-only economies."
      },
    };
  }
}

/**
 * Generate a natural language query from filter selections using Gemini Flash
 */
export async function generateQueryFromFilters(filters: FilterValues): Promise<string> {
  try {
    const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    // Build filter description
    const filterParts = [];

    if (filters.sectors && filters.sectors.length > 0) {
      filterParts.push(`Sectors: ${filters.sectors.join(', ')}`);
    }

    if (filters.countries && filters.countries.length > 0) {
      filterParts.push(`Countries: ${filters.countries.join(', ')}`);
    }

    if (filters.tradeType && filters.tradeType !== 'both') {
      filterParts.push(`Trade Type: ${filters.tradeType}`);
    }

    if (filters.yearFrom && filters.yearTo) {
      filterParts.push(`Year Range: ${filters.yearFrom} to ${filters.yearTo}`);
    }

    const filterDescription = filterParts.join('\n');

    const result = await genAI.models.generateContent({
      model: 'gemini-flash-latest',
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: `You are a query generator for an India trade analysis system.

Convert the following filter selections into a natural, concise query for analyzing India's trade data.

FILTER SELECTIONS:
${filterDescription}

Generate a clear, natural language query (10-20 words) that a user would ask to analyze this data.
Examples:
- "Show me petroleum exports to USA from 2018 to 2022"
- "Analyze electronics and machinery imports from China"
- "What are India's pharmaceutical exports to Germany between 2015 and 2020?"

Only return the query text, nothing else.`
            }
          ]
        }
      ],
      config: {
        thinkingConfig: {
          thinkingBudget: -1,
        },
      }
    });

    const queryText = result.text?.trim() || '';
    return queryText;

  } catch (error) {
    console.error("Error generating query from filters:", error);

    // Fallback: Create a simple query from filter values
    const parts = [];

    if (filters.sectors.length > 0) {
      parts.push(filters.sectors.join(', '));
    }

    if (filters.tradeType !== 'both') {
      parts.push(filters.tradeType);
    }

    if (filters.countries.length > 0) {
      parts.push(`to/from ${filters.countries.join(', ')}`);
    }

    if (filters.yearFrom !== '2010' || filters.yearTo !== '2025') {
      parts.push(`${filters.yearFrom}-${filters.yearTo}`);
    }

    return `Show me ${parts.join(' ')}`;
  }
}
