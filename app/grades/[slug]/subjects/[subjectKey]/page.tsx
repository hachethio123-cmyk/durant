import { notFound } from "next/navigation";
import SubjectPageClient from "@/components/SubjectPageClient";

const validGrades = [
  "first-prep",
  "second-prep",
  "third-prep",
  "first-secondary",
  "second-secondary",
  "third-secondary",
];

const validSubjects = ["social_studies", "history", "geography"];

export default async function SubjectPage({
  params,
}: {
  params: Promise<{ slug: string; subjectKey: string }>;
}) {
  const { slug, subjectKey } = await params;

  if (!validGrades.includes(slug) || !validSubjects.includes(subjectKey)) {
    notFound();
  }

  if (
    (slug.includes("prep") && subjectKey !== "social_studies") ||
    (!slug.includes("prep") && subjectKey === "social_studies")
  ) {
    notFound();
  }

  return (
    <SubjectPageClient
      gradeSlug={slug}
      subjectKey={subjectKey}
    />
  );
}