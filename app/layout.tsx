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
  title: "Social Insight.Tech — Advanced Social Analytics",
  description:
    "Unlock deep audience insights and growth metrics with AI-powered social analysis.",
};

import SmoothScrolling from "@/components/modern/SmoothScrolling";
import IntroAnimation from "@/components/modern/IntroAnimation";
import CustomCursor from "@/components/modern/CustomCursor";
import { Providers } from "@/components/Providers";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${manrope.variable} ${outfit.variable} antialiased selection:bg-indigo-500/30 selection:text-indigo-200 bg-[#050505] text-zinc-100 flex flex-col min-h-screen grainy-overlay`}>
        <Providers>
          <IntroAnimation>
            <SmoothScrolling>
              <CustomCursor />
              {children}
            </SmoothScrolling>
          </IntroAnimation>
        </Providers>
      </body>
    </html>
  );
}
