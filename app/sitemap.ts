
import type { MetadataRoute } from "next";

const BASE_URL = "https://durant-rose.vercel.app";

const grades = [
  "first-prep",
  "second-prep",
  "third-prep",
  "first-secondary",
  "second-secondary",
  "third-secondary",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: `${BASE_URL}/`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
  ];

  const gradePages: MetadataRoute.Sitemap = grades.map((slug) => ({
    url: `${BASE_URL}/grades/${slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [...staticPages, ...gradePages];
}
