import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_BASE_URL ?? "https://cheaperx.ca";
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    { url: `${base}/`,             lastModified: now, changeFrequency: "weekly",  priority: 1.0 },
    { url: `${base}/search`,       lastModified: now, changeFrequency: "daily",   priority: 0.9 },
    { url: `${base}/upgrade`,      lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/submit-price`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/contact`,      lastModified: now, changeFrequency: "yearly",  priority: 0.5 },
    { url: `${base}/signup`,       lastModified: now, changeFrequency: "yearly",  priority: 0.6 },
    { url: `${base}/login`,        lastModified: now, changeFrequency: "yearly",  priority: 0.4 },
    { url: `${base}/privacy`,      lastModified: now, changeFrequency: "yearly",  priority: 0.3 },
    { url: `${base}/terms`,        lastModified: now, changeFrequency: "yearly",  priority: 0.3 },
  ];

  // High-traffic drug searches — helps Google index and rank these pages
  const topDrugs = [
    "Tylenol", "Advil", "Ibuprofen", "Acetaminophen", "Metformin",
    "Atorvastatin", "Lisinopril", "Omeprazole", "Amoxicillin", "Metoprolol",
    "Amlodipine", "Pantoprazole", "Levothyroxine", "Sertraline", "Ramipril",
    "Rosuvastatin", "Plan B", "Flonase", "Voltaren", "Canesten",
    "Nicorette", "Reactine", "Benadryl", "Claritin", "Vyvanse",
    "Symbicort", "Zopiclone", "Synthroid", "Lipitor", "Zoloft",
  ];

  const drugPages: MetadataRoute.Sitemap = topDrugs.map((drug) => ({
    url: `${base}/search?q=${encodeURIComponent(drug)}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  return [...staticPages, ...drugPages];
}
