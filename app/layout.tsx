import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import SmoothScrollProvider from "@/components/SmoothScrollProvider";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "IG Analyzer — AI-Powered Instagram Profile Analysis",
  description:
    "Get instant AI-powered insights and actionable recommendations to optimize your Instagram profile and drive explosive growth.",
  keywords: ["Instagram", "AI", "profile analysis", "social media", "growth"],
  openGraph: {
    title: "IG Analyzer — AI-Powered Instagram Profile Analysis",
    description:
      "Get instant AI-powered insights and actionable recommendations to optimize your Instagram profile.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} font-sans antialiased`}>
        <SmoothScrollProvider>
          {children}
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
