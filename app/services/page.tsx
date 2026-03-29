import { Metadata } from "next";
import { baseUrl } from "@/lib/seo-utils";
import Header from "@/components/modern/Header";
import Footer from "@/components/modern/Footer";
import ServicesSection from "@/components/modern/ServicesSection";

export const metadata: Metadata = {
  title: "Pricing & Services | Social Insight.Tech",
  description:
    "Explore our Instagram analytics plans and services. From basic analysis to advanced enterprise solutions. Find the right plan for your social media growth.",
  keywords: [
    "pricing",
    "plans",
    "instagram services",
    "analytics pricing",
    "packages",
  ],
  openGraph: {
    title: "Pricing & Services | Social Insight.Tech",
    description:
      "Choose the perfect plan for your Instagram analytics needs. Flexible pricing for creators and agencies.",
    url: `${baseUrl}/services`,
    type: "website",
    images: [
      {
        url: `${baseUrl}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "Pricing Plans",
      },
    ],
  },
  alternates: {
    canonical: `${baseUrl}/services`,
  },
};

export default function PricingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#050505] selection:bg-indigo-500/30 selection:text-indigo-200">
      <Header />
      <main className="flex-1 pt-20">
        <ServicesSection />
      </main>
      <Footer />
    </div>
  );
}
