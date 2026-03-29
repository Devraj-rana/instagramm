/**
 * SEO Implementation Guide
 * 
 * This guide explains how to use the SEO utilities and structured data
 * components throughout the application.
 */

/**
 * HOW TO USE SEO UTILITIES IN NEW PAGES
 * 
 * 1. Import the metadata type and utilities:
 * ```typescript
 * import { Metadata } from "next";
 * import { baseUrl } from "@/lib/seo-utils";
 * ```
 * 
 * 2. Define metadata for your page:
 * ```typescript
 * export const metadata: Metadata = {
 *   title: "Page Title | Social Insight.Tech",
 *   description: "Page description for search engines and social sharing.",
 *   keywords: ["keyword1", "keyword2", "keyword3"],
 *   openGraph: {
 *     title: "Page Title",
 *     description: "Page description",
 *     url: `${baseUrl}/page-path`,
 *     type: "website",
 *     images: [
 *       {
 *         url: `${baseUrl}/og-image.png`,
 *         width: 1200,
 *         height: 630,
 *         alt: "Image description",
 *       },
 *     ],
 *   },
 *   alternates: {
 *     canonical: `${baseUrl}/page-path`,
 *   },
 * };
 * ```
 * 
 * 3. For pages with structured data, use StructuredData components:
 * ```typescript
 * "use client"; // If needed
 * 
 * import { FAQSchema, ProductSchema } from "@/components/StructuredData";
 * 
 * export default function MyPage() {
 *   const faqs = [
 *     { question: "Q1?", answer: "A1" },
 *     { question: "Q2?", answer: "A2" },
 *   ];
 *   
 *   return (
 *     <>
 *       {/* Your page content */}
 *       <FAQSchema faqs={faqs} />
 *     </>
 *   );
 * }
 * ```
 */

/**
 * BEST PRACTICES
 * 
 * 1. Meta Descriptions:
 *    - Keep between 150-160 characters
 *    - Make them compelling and action-oriented
 *    - Include target keywords naturally
 * 
 * 2. Page Titles:
 *    - Keep under 60 characters for desktop display
 *    - Include main keyword at the beginning
 *    - Use the pattern: "Main Title | Social Insight.Tech"
 * 
 * 3. Keywords:
 *    - Research relevant, high-intent keywords
 *    - Include 3-8 primary keywords per page
 *    - Consider user search intent
 * 
 * 4. Canonical URLs:
 *    - Always include for every page
 *    - Use the correct, preferred URL version
 *    - Prevents duplicate content issues
 * 
 * 5. OpenGraph Tags:
 *    - Use for all public-facing pages
 *    - Include compelling image (1200x630px)
 *    - Test on ogp.me before publishing
 * 
 * 6. Structured Data:
 *    - Use organization and software application schema on every page
 *    - Add specific schemas (FAQ, Product, Article) as appropriate
 *    - Validate at schema.org/validator
 * 
 * 7. Heading Hierarchy:
 *    - Only one H1 per page
 *    - Use H2 for main sections
 *    - Don't skip levels (H1 → H3 is wrong)
 *    - Include primary keywords in headings
 */

/**
 * AVAILABLE SCHEMA COMPONENTS
 * 
 * OrganizationSchema():
 *   - Adds organization details globally
 *   - Company name, contact, social profiles
 * 
 * SoftwareApplicationSchema():
 *   - Describes the application
 *   - Category, pricing, ratings
 * 
 * FAQSchema(faqs):
 *   - For FAQ pages
 *   - Accepts array of {question, answer}
 * 
 * ProductSchema(options):
 *   - For product/service pages
 *   - Includes pricing, ratings, availability
 * 
 * ArticleSchema(options):
 *   - For blog posts or articles
 *   - Date published, author, content type
 * 
 * LocalBusinessSchema():
 *   - For local business information
 *   - Location, contact, ratings
 * 
 * BreadcrumbSchema(items):
 *   - For navigation breadcrumbs
 *   - Helps chatbots understand site structure
 */

/**
 * CHATBOT ACCESSIBILITY TIPS
 * 
 * 1. Use Semantic HTML:
 *    - Use proper heading tags (h1, h2, h3)
 *    - Use nav, main, article, section elements
 *    - Don't use divs when semantic tags exist
 * 
 * 2. Image Alt Text:
 *    - Describe image content, not "Image of..."
 *    - Include relevant keywords naturally
 *    - Keep under 125 characters
 * 
 * 3. Content Structure:
 *    - Start with H1, follow with H2-H3
 *    - Use bullet points for lists
 *    - Short paragraphs (2-3 sentences)
 *    - Clear section breaks
 * 
 * 4. Link Text:
 *    - Use descriptive link text
 *    - Avoid "click here" or "read more"
 *    - Links should be self-explanatory
 * 
 * 5. Metadata:
 *    - Provide accurate, compelling descriptions
 *    - Match page content to meta description
 *    - Use keywords naturally
 * 
 * 6. Structured Data:
 *    - Use JSON-LD format (already implemented)
 *    - Keep schema current and accurate
 *    - Validate regularly with Google's validator
 */

/**
 * MONITORING & MAINTENANCE
 * 
 * Regular Checks:
 * 1. Test sitemap: https://socialinsight.tech/sitemap.xml
 * 2. Check robots.txt: https://socialinsight.tech/robots.txt
 * 3. Validate schema: https://schema.org/validator
 * 4. Test OG tags: https://ogp.me
 * 5. Review Search Console for crawl errors
 * 
 * Tools to Use:
 * - Google Search Console
 * - Google PageSpeed Insights
 * - Bing Webmaster Tools
 * - SEMrush or Ahrefs (for backlinks)
 * - Schema.org Validator
 */

/**
 * CHATBOT-SPECIFIC CONSIDERATIONS
 * 
 * What Chatbots Look For:
 * 1. robots.txt - To understand crawling rules
 * 2. Sitemap.xml - To discover all pages
 * 3. Metadata - Title, description, keywords
 * 4. Structured Data - JSON-LD schemas
 * 5. Canonical URLs - To avoid duplicates
 * 6. Semantic HTML - For content understanding
 * 7. OpenGraph Tags - For social context
 * 8. Heading Hierarchy - For content structure
 * 
 * Current Configuration:
 * - Sitemap includes 9 main pages with priorities
 * - robots.txt allows GPTBot, Bingbot, and standard crawlers
 * - All pages have canonical URLs
 * - Organization and Software Application schemas present
 * - Proper heading hierarchy in all templates
 * - FAQ schema for better AI understanding
 */

export const SEO_GUIDE = {
  baseUrl: process.env.NEXT_PUBLIC_SITE_URL || "https://socialinsight.tech",
  
  // Common keywords by page type
  keywords: {
    homepage: [
      "Instagram analytics",
      "social media analytics",
      "Instagram engagement tracking",
      "audience insights",
      "Instagram growth tools",
    ],
    services: [
      "pricing",
      "plans",
      "instagram services",
      "analytics pricing",
      "packages",
    ],
    testimonials: [
      "testimonials",
      "reviews",
      "user reviews",
      "customer feedback",
      "success stories",
    ],
    faq: [
      "faq",
      "frequently asked questions",
      "help",
      "instagram analytics faq",
      "how to use",
    ],
  },

  // Best practices for descriptions
  descriptionTemplate: (topic: string, length: number = 160) => {
    return `Unlock deep audience insights with AI-powered social analytics. [Topic-specific content] ${length} characters max`;
  },

  // Open Graph image requirements
  ogImage: {
    recommended: "1200 x 630 pixels",
    format: "PNG or JPG",
    maxSize: "300KB",
  },
};
