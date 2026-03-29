/**
 * Structured Data Components for SEO
 */

import { generateOrganizationSchema } from "@/lib/seo-utils";

/**
 * Schema.org JSON-LD Structured Data
 */
export function StructuredData({
  schema,
}: {
  schema: object;
}) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(schema),
      }}
    />
  );
}

/**
 * Organization Schema - adds at root level
 */
export function OrganizationSchema() {
  return (
    <StructuredData
      schema={generateOrganizationSchema()}
    />
  );
}

/**
 * Breadcrumb Navigation Schema
 */
export function BreadcrumbSchema({
  items,
}: {
  items: { name: string; url?: string }[];
}) {
  return (
    <StructuredData
      schema={{
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: items.map((item, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: item.name,
          ...(item.url && { item: item.url }),
        })),
      }}
    />
  );
}

/**
 * FAQ Schema
 */
export function FAQSchema({
  faqs,
}: {
  faqs: { question: string; answer: string }[];
}) {
  return (
    <StructuredData
      schema={{
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faqs.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: faq.answer,
          },
        })),
      }}
    />
  );
}

/**
 * Product/Service Schema
 */
export function ProductSchema({
  name,
  description,
  price,
  rating = 4.8,
  reviewCount = 500,
  image,
  url,
}: {
  name: string;
  description: string;
  price: string;
  rating?: number;
  reviewCount?: number;
  image?: string;
  url?: string;
}) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://socialinsight.tech";
  return (
    <StructuredData
      schema={{
        "@context": "https://schema.org",
        "@type": "Product",
        name,
        description,
        image: image || `${baseUrl}/og-image.png`,
        brand: {
          "@type": "Brand",
          name: "Social Insight.Tech",
        },
        offers: {
          "@type": "Offer",
          url: url || `${baseUrl}/services`,
          priceCurrency: "USD",
          price,
          availability: "https://schema.org/InStock",
        },
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: rating,
          reviewCount,
        },
      }}
    />
  );
}

/**
 * Article Schema
 */
export function ArticleSchema({
  headline,
  description,
  datePublished,
  dateModified,
  author,
  image,
  url,
}: {
  headline: string;
  description: string;
  datePublished: string;
  dateModified?: string;
  author?: string;
  image?: string;
  url?: string;
}) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://socialinsight.tech";
  return (
    <StructuredData
      schema={{
        "@context": "https://schema.org",
        "@type": "Article",
        headline,
        description,
        image: image || `${baseUrl}/og-image.png`,
        datePublished,
        dateModified: dateModified || datePublished,
        author: {
          "@type": "Organization",
          name: author || "Social Insight.Tech",
        },
        publisher: {
          "@type": "Organization",
          name: "Social Insight.Tech",
          logo: {
            "@type": "ImageObject",
            url: `${baseUrl}/og-image.png`,
          },
        },
        url: url || baseUrl,
      }}
    />
  );
}

/**
 * LocalBusiness Schema
 */
export function LocalBusinessSchema() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://socialinsight.tech";
  return (
    <StructuredData
      schema={{
        "@context": "https://schema.org",
        "@type": "LocalBusiness",
        name: "Social Insight.Tech",
        description: "Advanced Instagram Analytics Platform",
        url: baseUrl,
        email: "support@socialinsight.tech",
        sameAs: [
          "https://twitter.com/socialinsight",
          "https://instagram.com/socialinsight",
        ],
        priceRange: "$",
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: 4.8,
          reviewCount: 500,
        },
      }}
    />
  );
}

/**
 * SoftwareApplication Schema
 */
export function SoftwareApplicationSchema() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://socialinsight.tech";
  return (
    <StructuredData
      schema={{
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        name: "Social Insight.Tech",
        description: "Advanced Instagram Analytics and Growth Tools",
        url: baseUrl,
        applicationCategory: "WebApplication",
        offers: {
          "@type": "Offer",
          price: "0.00",
          priceCurrency: "USD",
        },
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: 4.8,
          reviewCount: 500,
        },
      }}
    />
  );
}
