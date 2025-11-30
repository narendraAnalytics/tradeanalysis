![Indian Trade Analysis Banner](public/images/BannerImage3.png)

# Indian Trade Analysis Agent

A Generative UI platform for querying and visualizing India's import/export data, powered by Google's Gemini models.

## Overview

This project is a "Generative UI" Data Analysis platform that enables users to query India's trade data through a natural language interface. Instead of simple text responses, the agent generates interactive dashboards, charts, and summaries on the fly.

It leverages **Google Search Grounding** to fetch the most recent and accurate trade statistics (2010-2025) and uses **Gemini 2.0/3.0** models to analyze and structure this data.

## Key Features

-   **Generative UI**: Dynamic creation of UI components (charts, stats cards) based on user queries.
-   **AI Intelligence**: Powered by `gemini-3-pro-preview` with high "thinking" capabilities for deep analysis.
-   **Live Data Grounding**: Uses Google Search tool to access real-time and historical trade data, ensuring accuracy beyond the model's training cutoff.
-   **Interactive Visualizations**: Beautiful, responsive charts built with Recharts.
-   **Structured Data**: Enforces strict JSON schemas (Zod) for reliable data parsing and UI rendering.

## Tech Stack

-   **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
-   **Language**: TypeScript
-   **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
-   **Database**: [Neon](https://neon.tech/) - Serverless PostgreSQL
-   **ORM**: [Drizzle ORM](https://orm.drizzle.team/) - Type-safe database queries
-   **Authentication**: [Stack Auth](https://stack-auth.com/) via Neon Auth - Auto-syncing user management
-   **AI SDKs**:
    -   `@google/genai`: Official Google GenAI SDK for Gemini API.
    -   `ai` & `@ai-sdk/google`: Vercel AI SDK for streaming and UI integration.
-   **UI Components**:
    -   `framer-motion`: For smooth animations.
    -   `lucide-react` & `react-icons`: Iconography.
    -   `recharts`: Data visualization.

## Getting Started

### Prerequisites

-   Node.js 18+ installed.
-   A Google Gemini API Key.
-   A Neon account (https://neon.tech).
-   Stack Auth configured via Neon Auth.

### Installation

1.  Clone the repository:
    ```bash
    git clone <repository-url>
    cd indiantradeanalysis
    ```

2.  Install dependencies:
    ```bash
    npm install
    # Installs: Next.js, Drizzle ORM, Neon client, Stack Auth, and all dependencies
    ```

3.  Set up environment variables:
    Create a `.env` file in the root directory and add your configuration:
    ```env
    # Gemini API
    GEMINI_API_KEY=your_gemini_api_key_here

    # Neon Database
    DATABASE_URL=your_neon_database_connection_string

    # Neon Auth (Stack Auth)
    NEXT_PUBLIC_STACK_PROJECT_ID=your_neon_auth_project_id
    NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY=your_neon_auth_publishable_key
    STACK_SECRET_SERVER_KEY=your_neon_auth_secret_key
    ```

4.  Run the development server:
    ```bash
    npm run dev
    ```

5.  Open [http://localhost:3000](http://localhost:3000) with your browser to use the application.

## Project Structure

-   `app/`: Next.js App Router pages and layouts.
-   `components/`: Reusable UI components (Charts, Chat Interface, etc.).
-   `lib/gemini.ts`: Core logic for interacting with the Gemini API, including schema definitions and search grounding configuration.
-   `lib/utils.ts`: Utility functions.

## AI Configuration

The project is currently configured to use the `gemini-3-pro-preview` model. You can modify the model configuration in `lib/gemini.ts`.

```typescript
const result = await genAI.models.generateContent({
  model: 'gemini-3-pro-preview',
  // ... configuration
  tools: [
    { googleSearch: {} }, // Enables Search Grounding
  ],
  thinkingConfig: {
    thinkingLevel: 'HIGH', // Enables advanced reasoning
  },
});
```

## Database & Authentication

### Neon PostgreSQL Database

This project uses **Neon** as its serverless PostgreSQL database with **Drizzle ORM** for type-safe queries.

**Database Schema:**
-   `user_preferences` - User settings and dashboard preferences
-   `saved_analyses` - Saved trade analysis queries and reports
-   `trade_bookmarks` - Bookmarked trade data points
-   `user_activity_log` - User interaction tracking

### Neon Auth (Stack Auth Integration)

User authentication is handled by **Stack Auth** integrated through **Neon Auth**, which automatically synchronizes user data to your PostgreSQL database.

**Key Features:**
-   Automatic user sync to `neon_auth.users_sync` table
-   No manual webhook setup required
-   Foreign key support with cascade deletes
-   Real-time user profile updates

**Setup:**
1.  Enable Neon Auth in your Neon Console
2.  Copy the Auth environment variables to your `.env` file
3.  Run `npx @stackframe/init-stack@latest --no-browser` to set up auth routes
4.  Users automatically appear in your database when they sign up

**Auth Routes:**
-   `/handler/sign-in` - Sign in page
-   `/handler/sign-up` - Sign up page

For detailed setup instructions, see `neuonauth_drizzle.md`.

## License

This project is licensed under the MIT License.
