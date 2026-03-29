import { MetadataRoute } from "next";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://socialinsight.tech";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      changeFrequency: "daily",
      priority: 1,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/faq`,
      changeFrequency: "monthly",
      priority: 0.9,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/testimonials`,
      changeFrequency: "weekly",
      priority: 0.9,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/services`,
      changeFrequency: "monthly",
      priority: 0.8,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/support`,
      changeFrequency: "monthly",
      priority: 0.7,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/sign-in`,
      changeFrequency: "yearly",
      priority: 0.5,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/sign-up`,
      changeFrequency: "yearly",
      priority: 0.5,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/privacy`,
      changeFrequency: "yearly",
      priority: 0.5,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/terms`,
      changeFrequency: "yearly",
      priority: 0.5,
      lastModified: new Date(),
    },
  ];

  return pages;
}
