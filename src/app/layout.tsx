import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Voyage — Smart Travel Assistant & AI Planner",
  description: "AI-powered travel assistant for discovering the best destinations across India and easy visa getaways. Built with Gemini AI, real-time weather, and IRCTC advance booking rules.",
  keywords: ["travel assistant", "India travel", "AI itinerary", "Goa", "Kerala", "Kashmir", "backpacker hostels"],
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  themeColor: "#070a13",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full bg-[#070a13] antialiased">
      <body className="min-h-full flex flex-col bg-[#070a13] text-slate-100">
        {children}
      </body>
    </html>
  );
}
