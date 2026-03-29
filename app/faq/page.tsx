/**
 * Human-Readable FAQ Page for SEO and Chatbot Understanding
 */
import { Metadata } from "next";
import { baseUrl } from "@/lib/seo-utils";
import Header from "@/components/modern/Header";
import Footer from "@/components/modern/Footer";
import { FAQSchema } from "@/components/StructuredData";

export const metadata: Metadata = {
  title: "FAQ - Frequently Asked Questions | Social Insight.Tech",
  description:
    "Find answers to common questions about Social Insight.Tech, Instagram analytics, how to use our platform, pricing, and more.",
  keywords: [
    "faq",
    "frequently asked questions",
    "help",
    "instagram analytics faq",
    "how to use",
  ],
  openGraph: {
    title: "FAQ | Social Insight.Tech",
    description: "Frequently asked questions about Social Insight.Tech and Instagram analytics.",
    url: `${baseUrl}/faq`,
    type: "website",
  },
  alternates: {
    canonical: `${baseUrl}/faq`,
  },
};

const faqs = [
  {
    question: "What is Social Insight.Tech?",
    answer:
      "Social Insight.Tech is an advanced Instagram analytics platform that provides deep audience insights, engagement metrics, and growth recommendations using AI-powered analysis. We help creators and agencies understand their Instagram performance and optimize their social media strategy.",
  },
  {
    question: "How do I analyze an Instagram profile?",
    answer:
      "Simply enter an Instagram username on our home page and click analyze. Our AI will scan the profile and provide comprehensive insights including audience demographics, engagement rates, content performance, and personalized growth recommendations.",
  },
  {
    question: "Do I need to connect my Instagram account?",
    answer:
      "You can analyze any public Instagram profile without connecting your account. However, for more detailed insights on your own profile, we recommend creating a Social Insight.Tech account.",
  },
  {
    question: "What information can I get from the analytics?",
    answer:
      "With our analytics, you get audience quality scoring, profile strength analysis, content performance metrics, engagement patterns, follower growth trends, and personalized growth recommendations.",
  },
  {
    question: "Is my data secure?",
    answer:
      "Yes, data security is a top priority. We use industry-standard encryption and follow GDPR compliance. We never share your personal data with third parties without your consent.",
  },
  {
    question: "What are the pricing plans?",
    answer:
      "We offer flexible pricing plans to suit different needs - from free basic analysis to premium plans for serious creators and agencies. Visit our Services page to see detailed pricing.",
  },
  {
    question: "Can agencies use Social Insight.Tech for multiple clients?",
    answer:
      "Yes! Our agency plans support multiple client profiles. Contact our sales team for custom enterprise solutions.",
  },
  {
    question: "How often is the data updated?",
    answer:
      "Analytics refresh approximately every 60 seconds. Real-time tracking helps you monitor your performance continuously.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "We accept all major credit cards, PayPal, and other digital payment methods through our secure payment gateway powered by Razorpay.",
  },
  {
    question: "How do I cancel my subscription?",
    answer:
      "You can cancel your subscription anytime from your account settings. You won't be charged for the next billing cycle.",
  },
];

export default function FAQPage() {
  return (
    <>
      <div className="flex min-h-screen flex-col bg-[#050505] selection:bg-indigo-500/30 selection:text-indigo-200">
        <Header />

        <main className="flex-1 pt-32 pb-24 sm:pt-40">
          <div className="mx-auto max-w-4xl px-6 lg:px-8">
            {/* Header */}
            <div className="text-center mb-16">
              <h1 className="text-4xl font-display font-extrabold tracking-tight text-white sm:text-6xl mb-6">
                Frequently Asked <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-400 to-cyan-400">Questions</span>
              </h1>
              <p className="text-lg leading-8 text-zinc-400 max-w-2xl mx-auto">
                Find answers to common questions about Social Insight.Tech and how to get the most out of our Instagram analytics platform.
              </p>
            </div>

            {/* FAQ List */}
            <div className="space-y-6">
              {faqs.map((faq, index) => (
                <div
                  key={index}
                  className="border border-white/10 rounded-lg bg-white/5 p-6 hover:bg-white/8 transition-colors"
                >
                  <h2 className="text-xl font-bold text-white mb-3">
                    {faq.question}
                  </h2>
                  <p className="text-zinc-400 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div className="mt-16 text-center">
              <p className="text-zinc-400 mb-6">
                Couldn&apos;t find what you&apos;re looking for?
              </p>
              <a
                href="/support"
                className="inline-block px-8 py-3 bg-linear-to-r from-indigo-500 to-cyan-500 text-white font-semibold rounded-lg hover:opacity-90 transition-opacity"
              >
                Contact Support
              </a>
            </div>
          </div>
        </main>

        <Footer />
      </div>

      <FAQSchema faqs={faqs} />
    </>
  );
}

