/**
 * SEO and Structured Data Utilities
 */

export interface SchemaOrganization {
  "@context": string;
  "@type": string;
  name: string;
  description: string;
  url: string;
  logo: string;
  sameAs: string[];
  contactPoint: {
    "@type": string;
    url: string;
    contactType: string;
  };
}

export interface SchemaBreadcrumb {
  "@context": string;
  "@type": string;
  itemListElement: Array<{
    "@type": string;
    position: number;
    name: string;
    item?: string;
  }>;
}

export interface SchemaFAQ {
  "@context": string;
  "@type": string;
  mainEntity: Array<{
    "@type": string;
    name: string;
    acceptedAnswer: {
      "@type": string;
      text: string;
    };
  }>;
}

export const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://socialinsight.tech";

/**
 * Generate Organization Schema
 */
export function generateOrganizationSchema(): SchemaOrganization {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Social Insight.Tech",
    description: "Advanced Instagram Analytics and Growth Tools",
    url: baseUrl,
    logo: `${baseUrl}/og-image.png`,
    sameAs: [
      "https://twitter.com/socialinsight",
      "https://instagram.com/socialinsight",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      url: `${baseUrl}/support`,
      contactType: "Customer Support",
    },
  };
}

/**
 * Generate Breadcrumb Schema
 */
export function generateBreadcrumbSchema(
  items: { name: string; url?: string }[]
): SchemaBreadcrumb {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      ...(item.url && { item: item.url }),
    })),
  };
}

/**
 * Generate FAQ Schema
 */
export function generateFAQSchema(
  faqs: { question: string; answer: string }[]
): SchemaFAQ {
  return {
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
  };
}

/**
 * Generate Product Schema for Services
 */
export function generateProductSchema(
  name: string,
  description: string,
  price: string,
  rating: number = 4.8,
  reviewCount: number = 500
) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name,
    description,
    image: `${baseUrl}/og-image.png`,
    brand: {
      "@type": "Brand",
      name: "Social Insight.Tech",
    },
    offers: {
      "@type": "Offer",
      url: `${baseUrl}/services`,
      priceCurrency: "USD",
      price,
      availability: "https://schema.org/InStock",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: rating,
      reviewCount,
    },
  };
}

/**
 * Generate WebPage Schema
 */
export function generateWebPageSchema(
  title: string,
  description: string,
  url: string,
  image?: string
) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: title,
    description,
    url,
    image: image || `${baseUrl}/og-image.png`,
    datePublished: new Date().toISOString(),
    publisher: {
      "@type": "Organization",
      name: "Social Insight.Tech",
      logo: {
        "@type": "ImageObject",
        url: `${baseUrl}/og-image.png`,
      },
    },
  };
}

/**
 * Generate LocalBusiness Schema
 */
export function generateLocalBusinessSchema() {
  return {
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
  };
}
