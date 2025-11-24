Implementation Plan - India Trade Analysis Platform
Goal Description
Build a "Generative UI" Data Analysis platform named india-trade-agent using Next.js 16, React 19, and Tailwind CSS 4. The app will allow users to query India's Import/Export data via a chat interface and receive rich, interactive dashboards.

User Review Required
IMPORTANT

Gemini API Key: The user will need to provide a Google Vertex AI/Gemini API key for the AI features to work.
Tailwind 4: We are using the new CSS-first configuration.
Next.js 16: Using the latest canary or RC if 16.0.1 is not strictly available as stable yet, or standard latest if it covers the requirements.
Proposed Changes
Initialization
Create india-trade-agent using create-next-app.
Install lucide-react, tabler-icons-react, react-icons, recharts, framer-motion, ai, @ai-sdk/google.
Upgrade/Configure Tailwind CSS 4.
Design System
Theme: "Corporate Neo-Glass" (White, Blue/Violet Gradients, Glassmorphism).
Layout: Sidebar (Chat) + Canvas (Dashboard).
Components
[NEW] components/chat/TradeChat.tsx
Chat interface with input and message history.
Handles user input and displays AI responses.
[NEW] components/dashboard/TradeChart.tsx
Recharts wrapper for Area/Bar charts.
Animated and responsive.
[NEW] components/dashboard/StatCard.tsx
Simple card for key metrics (Total Volume, Peak Year, etc.).
[NEW] components/dashboard/TradeDashboard.tsx
Container for the visualization deck.
Business Logic
[NEW] lib/gemini.ts
Configuration for Google Vertex AI / Gemini.
Function to generate structured data from natural language queries.
[NEW] app/actions.ts
Server Actions for fetching/generating data.
Main Page
[MODIFY] app/page.tsx
Main layout implementation.
State management using React 19 hooks (useActionState).
Verification Plan
Automated Tests
Run npm run build to ensure type safety and build success.
Check for linting errors.
Manual Verification
Verify the chat interface responsiveness.
Verify the chart rendering with mock/real data.
Check the "Neo-Glass" aesthetic.