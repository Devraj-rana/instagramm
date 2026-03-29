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

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://socialinsight.tech";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "Social Insight.Tech — Advanced Instagram Analytics & Growth Tools",
    template: "%s | Social Insight.Tech",
  },
  description:
    "Unlock deep audience insights and growth metrics with AI-powered social analysis. Analyze Instagram profiles, track engagement, and grow your presence with advanced analytics.",
  keywords: [
    "Instagram analytics",
    "social media analytics",
    "Instagram engagement tracking",
    "audience insights",
    "Instagram growth tools",
    "social media analysis",
    "follower analytics",
    "contentStrategy",
  ],
  authors: [{ name: "Social Insight.Tech" }],
  creator: "Social Insight.Tech",
  publisher: "Social Insight.Tech",
  formatDetection: {
    email: false,
    telephone: false,
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: baseUrl,
    title: "Social Insight.Tech — Advanced Instagram Analytics",
    description: "Unlock deep audience insights with AI-powered social analytics for Instagram.",
    siteName: "Social Insight.Tech",
    images: [
      {
        url: `${baseUrl}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "Social Insight.Tech - Instagram Analytics Platform",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Social Insight.Tech — Advanced Instagram Analytics",
    description: "Unlock deep audience insights with AI-powered social analytics.",
    images: [`${baseUrl}/og-image.png`],
    creator: "@socialinsight",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  category: "Technology",
  alternates: {
    canonical: baseUrl,
  },
};

import SmoothScrolling from "@/components/modern/SmoothScrolling";
import IntroAnimation from "@/components/modern/IntroAnimation";
import CustomCursor from "@/components/modern/CustomCursor";
import { Providers } from "@/components/Providers";
import {
  OrganizationSchema,
  SoftwareApplicationSchema,
} from "@/components/StructuredData";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <OrganizationSchema />
        <SoftwareApplicationSchema />
      </head>
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
