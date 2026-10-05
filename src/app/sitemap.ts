import type { MetadataRoute } from "next";
import { tests } from "@/data/tests";
import { absoluteUrl } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return [
    {
      url: absoluteUrl("/"),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1
    },
    {
      url: absoluteUrl("/tests"),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9
    },
    ...tests.map((test) => ({
      url: absoluteUrl(`/tests/${test.slug}`),
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.85
    })),
    {
      url: absoluteUrl("/memes"),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.85
    },
    {
      url: absoluteUrl("/rankings"),
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.8
    },
    {
      url: absoluteUrl("/about"),
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.5
    },
    {
      url: absoluteUrl("/privacidad"),
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3
    }
  ];
}
