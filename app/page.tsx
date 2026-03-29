import { Metadata } from "next";
import { baseUrl } from "@/lib/seo-utils";
import HomeClient from "./HomeClient";

export const metadata: Metadata = {
  title: "Instagram Analytics & Growth Tools | Social Insight.Tech",
  description:
    "Analyze Instagram profiles in real-time with AI-powered analytics. Get audience insights, engagement metrics, and growth recommendations. Start free analysis now.",
  keywords: [
    "instagram analyzer",
    "instagram metrics",
    "social media analytics",
    "instagram insights",
    "follower analysis",
    "engagement tracking",
  ],
  openGraph: {
    title: "Instagram Analytics & Growth Tools | Social Insight.Tech",
    description:
      "Analyze Instagram profiles in real-time with AI-powered analytics. Get audience insights and growth metrics.",
    url: baseUrl,
    type: "website",
    images: [
      {
        url: `${baseUrl}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "Social Insight.Tech Analytics Dashboard",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Instagram Analytics & Growth Tools",
    description: "Analyze Instagram profiles with AI-powered analytics",
    images: [`${baseUrl}/og-image.png`],
  },
  alternates: {
    canonical: baseUrl,
  },
};

export default function Home() {
  return <HomeClient />;
}
