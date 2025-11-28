import type { Metadata } from "next";
import { Outfit, Roboto } from "next/font/google";
import "./globals.css";
import { StackProvider, StackTheme } from "@stackframe/stack";
import { stackClientApp } from "../stack/client";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

const roboto = Roboto({
  subsets: ["latin"],
  variable: "--font-roboto",
  weight: ["400", "500", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "India Trade Agent",
  description: "AI-Powered Trade Analysis Dashboard",
  icons: {
    icon: '/images/rupee.png',
  },
};

const customTheme = {
  light: {
    primary: 'hsl(24, 100%, 50%)',           // Bright orange
    primaryForeground: 'hsl(0, 0%, 100%)',   // White text on orange
    card: 'hsl(0, 0%, 100%)',                // Pure white for form
    cardForeground: 'hsl(16, 100%, 50%)',    // Bright orange-red text for headings
    background: 'hsl(0, 0%, 100%)',          // White background
    foreground: 'hsl(24, 100%, 45%)',        // Bright orange text
    secondary: 'hsl(45, 100%, 51%)',         // Bright yellow/amber
    secondaryForeground: 'hsl(0, 0%, 10%)',  // Dark text on yellow
    accent: 'hsl(33, 100%, 50%)',            // Orange accent
    accentForeground: 'hsl(0, 0%, 100%)',    // White on accent
    muted: 'hsl(0, 0%, 96%)',                // Light gray for muted elements
    mutedForeground: 'hsl(30, 100%, 45%)',   // Bright orange for muted text
    border: 'hsl(24, 60%, 60%)',             // Orange-toned border
    input: 'hsl(0, 0%, 90%)',                // Light gray for inputs
    ring: 'hsl(24, 100%, 50%)',              // Orange focus ring
  },
  dark: {
    primary: 'hsl(24, 100%, 55%)',           // Bright orange
    primaryForeground: 'hsl(0, 0%, 100%)',   // White text
    card: 'hsl(222, 47%, 15%)',              // Dark card
    cardForeground: 'hsl(0, 0%, 98%)',       // Light text
    background: 'hsl(222, 47%, 11%)',        // Dark background
    foreground: 'hsl(0, 0%, 98%)',           // Light text
    secondary: 'hsl(45, 100%, 51%)',         // Bright yellow
    secondaryForeground: 'hsl(222, 47%, 11%)', // Dark text
    accent: 'hsl(33, 100%, 50%)',            // Orange accent
    accentForeground: 'hsl(0, 0%, 100%)',    // White
    border: 'hsl(24, 40%, 40%)',             // Orange border
    input: 'hsl(24, 30%, 25%)',              // Dark orange input
    ring: 'hsl(24, 100%, 50%)',              // Orange focus ring
  },
  radius: '12px',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${outfit.variable} ${roboto.variable} antialiased`}
      >
        <StackProvider app={stackClientApp}>
          <StackTheme theme={customTheme}>
            {children}
          </StackTheme>
        </StackProvider>
      </body>
    </html>
  );
}
