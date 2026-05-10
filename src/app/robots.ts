import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const base = process.env.NEXT_PUBLIC_BASE_URL ?? "https://cheaperrx.ca";

  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/search", "/submit-price", "/upgrade", "/login", "/signup"],
        disallow: ["/admin", "/dashboard", "/medications", "/family", "/alerts", "/settings", "/insurance", "/api/"],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
  };
}
