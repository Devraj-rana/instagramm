import type { Metadata } from "next";
import { Outfit, Manrope } from "next/font/google";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const outfit = Outfit({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "IG Analyzer — Professional Instagram Profile Analysis",
  description:
    "Get instant AI-powered insights and actionable recommendations to optimize your Instagram profile.",
};

import SmoothScrolling from "@/components/modern/SmoothScrolling";
import IntroAnimation from "@/components/modern/IntroAnimation";
import CustomCursor from "@/components/modern/CustomCursor";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${manrope.variable} ${outfit.variable} antialiased selection:bg-indigo-500/30 selection:text-indigo-200 bg-[#0A0A0A] text-zinc-100 flex flex-col min-h-screen`}>
        <IntroAnimation>
          <SmoothScrolling>
            <CustomCursor />
            {children}
          </SmoothScrolling>
        </IntroAnimation>
      </body>
    </html>
  );
}
