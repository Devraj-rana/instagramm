import { MetadataRoute } from "next";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://socialinsight.tech";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/admin/", "/sign-in", "/sign-up", "/reset-password", "/update-password"],
      },
      {
        userAgent: "GPTBot",
        allow: "/",
      },
      {
        userAgent: "bingbot",
        allow: "/",
        crawlDelay: 1,
      },
      {
        userAgent: "specific-bad-bot",
        disallow: "/",
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
