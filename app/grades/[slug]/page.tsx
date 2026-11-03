import { notFound } from "next/navigation";
import GradePageClient from "@/components/GradePageClient";

const gradeNames: Record<string, string> = {
  "first-prep": "الصف الأول الإعدادي",
  "second-prep": "الصف الثاني الإعدادي",
  "third-prep": "الصف الثالث الإعدادي",
  "first-secondary": "الصف الأول الثانوي",
  "second-secondary": "الصف الثاني الثانوي",
  "third-secondary": "الصف الثالث الثانوي",
};

export function generateStaticParams() {
  return Object.keys(gradeNames).map((slug) => ({ slug }));
}

export default async function GradePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  if (!gradeNames[slug]) {
    notFound();
  }

  return <GradePageClient slug={slug} />;
}