import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_BASE_URL ?? "https://cheaperrx.ca";

  return [
    { url: `${base}/`, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${base}/search`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${base}/submit-price`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/upgrade`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/login`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.4 },
    { url: `${base}/signup`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.5 },
  ];
}
