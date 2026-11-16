"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { useLanguage } from "@/components/ThemeProvider";
import StudentSidebar from "@/components/StudentSidebar";

type SubjectData = {
  id: string;
  name_ar: string;
  name_en: string;
  description_ar: string | null;
  description_en: string | null;
  icon: string | null;
};

type UnitData = {
  id: string;
  title_ar: string;
  title_en: string | null;
  description_ar: string | null;
  description_en: string | null;
  sort_order: number;
};

type LessonData = {
  id: string;
  unit_id: string;
  title_ar: string;
  title_en: string | null;
  duration_minutes: number | null;
  sort_order: number;
};

const gradeNames: Record<string, { ar: string; en: string }> = {
  "first-prep": { ar: "الصف الأول الإعدادي", en: "First Preparatory Grade" },
  "second-prep": { ar: "الصف الثاني الإعدادي", en: "Second Preparatory Grade" },
  "third-prep": { ar: "الصف الثالث الإعدادي", en: "Third Preparatory Grade" },
  "first-secondary": { ar: "الصف الأول الثانوي", en: "First Secondary Grade" },
  "second-secondary": { ar: "الصف الثاني الثانوي", en: "Second Secondary Grade" },
  "third-secondary": { ar: "الصف الثالث الثانوي", en: "Third Secondary Grade" },
};

const subjectIcons: Record<string, string> = {
  social_studies: "🌍",
  history: "🏛️",
  geography: "🌍",
};

export default function SubjectPageClient({
  gradeSlug,
  subjectKey,
}: {
  gradeSlug: string;
  subjectKey: string;
}) {
  const { language, languageReady } = useLanguage();
  const isArabic = language === "ar";
  const direction = isArabic ? "rtl" : "ltr";
  const t = (ar: string, en: string) => isArabic ? ar : en;

  const [subject, setSubject] = useState<SubjectData | null>(null);
  const [units, setUnits] = useState<UnitData[]>([]);
  const [lessons, setLessons] = useState<LessonData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const grade = gradeNames[gradeSlug];

  useEffect(() => {
    let active = true;

    async function loadSubject() {
      setLoading(true);
      setError("");

      const { data: subjectData, error: subjectError } = await supabase
        .from("subjects")
        .select("id, name_ar, name_en, description_ar, description_en, icon")
        .eq("grade_slug", gradeSlug)
        .eq("subject_key", subjectKey)
        .eq("is_published", true)
        .maybeSingle();

      if (!active) return;

      if (subjectError) {
        setError(t("حدث خطأ أثناء تحميل المادة.", "Could not load this subject."));
        setLoading(false);
        return;
      }

      if (!subjectData) {
        setSubject(null);
        setUnits([]);
        setLessons([]);
        setLoading(false);
        return;
      }

      setSubject(subjectData as SubjectData);

      const { data: unitsData, error: unitsError } = await supabase
        .from("units")
        .select("id, title_ar, title_en, description_ar, description_en, sort_order")
        .eq("subject_id", subjectData.id)
        .eq("is_published", true)
        .order("sort_order", { ascending: true });

      if (!active) return;

      if (unitsError) {
        setError(t("تعذر تحميل الوحدات حاليا.", "Could not load the units."));
        setUnits([]);
        setLessons([]);
      } else {
        const loadedUnits = (unitsData ?? []) as UnitData[];
        setUnits(loadedUnits);

        const unitIds = loadedUnits.map((unit) => unit.id);

        if (unitIds.length > 0) {
          const { data: lessonsData, error: lessonsError } = await supabase
            .from("lessons")
            .select("id, unit_id, title_ar, title_en, duration_minutes, sort_order")
            .in("unit_id", unitIds)
            .eq("is_published", true)
            .order("sort_order", { ascending: true });

          if (!active) return;

          if (lessonsError) {
            setError(t("تعذر تحميل الدروس حاليا.", "Could not load the lessons."));
            setLessons([]);
          } else {
            setLessons((lessonsData ?? []) as LessonData[]);
          }
        } else {
          setLessons([]);
        }
      }

      setLoading(false);
    }

    loadSubject();

    return () => {
      active = false;
    };
  }, [gradeSlug, subjectKey, isArabic]);

  if (!grade) return null;

  const subjectName = subject
    ? isArabic ? subject.name_ar : subject.name_en || subject.name_ar
    : subjectKey === "social_studies"
      ? t("الدراسات الاجتماعية", "Social Studies")
      : subjectKey === "history"
        ? t("التاريخ", "History")
        : t("الجغرافيا", "Geography");

  const subjectDescription = subject
    ? isArabic
      ? subject.description_ar
      : subject.description_en || subject.description_ar
    : "";

  if (!languageReady) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f1f3fb]">
        <span className="text-2xl font-black tracking-widest text-[#17213d]">DURANT</span>
      </main>
    );
  }

  return (
    <main
      dir={direction}
      className="flex min-h-screen min-w-0 flex-col bg-[#f1f3fb] text-[#17213d] lg:block"
    >
      <StudentSidebar />

      <section className={`min-w-0 w-full px-3 pb-8 pt-20 sm:px-5 sm:py-7 md:px-6 lg:px-7 xl:px-8 lg:w-[calc(100%-18rem)] ${isArabic ? "lg:mr-72" : "lg:ml-72"}`}>
        <div className="mx-auto w-full max-w-[1200px]">

          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <Link
              href={`/grades/${gradeSlug}`}
              className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-[#e5e8f5] bg-white px-4 py-2.5 text-xs font-bold text-[#17213d] shadow-sm transition hover:border-amber-300 hover:bg-amber-50 sm:text-sm"
            >
              <span>{isArabic ? "→" : "←"}</span>
              {t("العودة إلى مواد الصف", "Back to Grade")}
            </Link>

            <span className="text-sm font-black tracking-widest">DURANT</span>
          </div>

          <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#17213d] via-[#202e50] to-[#30466c] p-6 text-white shadow-lg sm:p-9">
            <div className="absolute -end-12 -top-16 h-56 w-56 rounded-full border-[30px] border-white/5" />
            <div className="relative">
              <p className="text-xs font-bold tracking-widest text-amber-300">
                {t("رحلتك التعليمية", "YOUR LEARNING JOURNEY")}
              </p>

              <div className="mt-5 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <p className="text-sm text-blue-100">{isArabic ? grade.ar : grade.en}</p>
                  <h1 className="mt-2 text-3xl font-black sm:text-4xl">
                    {subject?.icon || subjectIcons[subjectKey]} {subjectName}
                  </h1>
                  {subjectDescription && (
                    <p className="mt-3 max-w-2xl text-sm leading-7 text-blue-100">
                      {subjectDescription}
                    </p>
                  )}
                  <p className="mt-3 text-sm text-blue-100">
                    {t("مع مستر أمير عبد الناصر", "With Mr. Amir Abdel Nasser")}
                  </p>
                </div>

                <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-3xl border border-white/15 bg-white/10 text-5xl">
                  {subject?.icon || subjectIcons[subjectKey]}
                </div>
              </div>

              <a
                href="#subject-units"
                className="mt-7 inline-flex min-h-11 items-center justify-center rounded-xl bg-amber-400 px-6 py-3 text-sm font-black text-[#17213d] transition hover:bg-amber-300"
              >
                {t("ابدأ التعلم", "Start Learning")} ↓
              </a>
            </div>
          </section>

          <section id="subject-units" className="mt-8 scroll-mt-6">
            <div className="mb-5">
              <p className="text-[10px] font-black tracking-[0.18em] text-blue-600">
                COURSE CONTENT
              </p>
              <h2 className="mt-1 text-xl font-black text-[#17213d] sm:text-2xl">
                📚 {t("الوحدات الدراسية", "Course Units")}
              </h2>
              <p className="mt-2 text-sm text-slate-500">
                {t("اختر الوحدة التي تريد دراستها.", "Choose a unit to study.")}
              </p>
            </div>

            {loading ? (
              <div className="rounded-2xl border border-[#e5e8f5] bg-white p-10 text-center shadow-sm">
                <div className="mx-auto h-9 w-9 animate-spin rounded-full border-4 border-slate-200 border-t-amber-500" />
                <p className="mt-4 text-sm text-slate-500">
                  {t("جاري تحميل المحتوى...", "Loading course content...")}
                </p>
              </div>
            ) : error ? (
              <div className="rounded-2xl border border-red-100 bg-white p-8 text-center shadow-sm">
                <p className="font-bold text-red-500">{error}</p>
              </div>
            ) : !subject ? (
              <div className="rounded-2xl border border-[#e5e8f5] bg-white p-8 text-center shadow-sm">
                <div className="text-5xl">📚</div>
                <h3 className="mt-4 text-lg font-black">
                  {t("المادة غير متاحة حاليا", "Subject Not Available")}
                </h3>
                <p className="mt-2 text-sm leading-7 text-slate-500">
                  {t("تأكد من تسجيل الدخول بالصف الدراسي الصحيح أو تواصل مع الإدارة.", "Please check your grade or contact the administration.")}
                </p>
              </div>
            ) : units.length === 0 ? (
              <div className="rounded-2xl border border-[#e5e8f5] bg-white p-8 text-center shadow-sm sm:p-12">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-4xl">
                  📖
                </div>
                <h3 className="mt-4 text-lg font-black">
                  {t("المحتوى قيد التجهيز", "Content Coming Soon")}
                </h3>
                <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-slate-500">
                  {t("تم تجهيز صفحة المادة وسيتم عرض الوحدات هنا بمجرد إضافتها ونشرها من الإدارة.", "The subject page is ready. Units will appear here once they are added and published by the administration.")}
                </p>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {units.map((unit, index) => (
                  <article
                    key={unit.id}
                    className="rounded-2xl border border-[#e5e8f5] bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md sm:p-6"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-2xl font-black text-[#17213d]">
                        {index + 1}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-blue-600">
                          {t("الوحدة", "UNIT")} {index + 1}
                        </p>
                        <h3 className="mt-1 text-lg font-black">
                          {isArabic ? unit.title_ar : unit.title_en || unit.title_ar}
                        </h3>
                      </div>
                    </div>
                    {(isArabic ? unit.description_ar : unit.description_en || unit.description_ar) && (
                      <p className="mt-4 text-sm leading-7 text-slate-500">
                        {isArabic ? unit.description_ar : unit.description_en || unit.description_ar}
                      </p>
                    )}

                    <div className="mt-5 border-t border-slate-100 pt-4">
                      <p className="mb-3 text-sm font-black text-[#17213d]">
                        {t("دروس الوحدة", "Unit Lessons")}
                      </p>

                      {lessons.filter((lesson) => lesson.unit_id === unit.id).length === 0 ? (
                        <p className="rounded-xl bg-slate-50 px-4 py-3 text-xs text-slate-500">
                          {t("لا توجد دروس منشورة في هذه الوحدة حاليا.", "No published lessons in this unit yet.")}
                        </p>
                      ) : (
                        <div className="space-y-2">
                          {lessons
                            .filter((lesson) => lesson.unit_id === unit.id)
                            .map((lesson, lessonIndex) => (
                              <div
                                key={lesson.id}
                                className="flex items-center gap-3 rounded-xl bg-slate-50 px-3 py-3"
                              >
                                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-xs font-black text-blue-600 shadow-sm">
                                  {lessonIndex + 1}
                                </span>
                                <div className="min-w-0 flex-1">
                                  <p className="text-sm font-bold leading-6 text-[#17213d]">
                                    {isArabic ? lesson.title_ar : lesson.title_en || lesson.title_ar}
                                  </p>
                                  {lesson.duration_minutes != null && (
                                    <p className="mt-1 text-xs text-slate-400">
                                      {lesson.duration_minutes} {t("دقيقة", "minutes")}
                                    </p>
                                  )}
                                </div>
                                <span className="text-blue-500">📖</span>
                              </div>
                            ))}
                        </div>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>

          <footer className="mt-10 border-t border-[#e1e5f1] pt-6 text-center">
            <p className="font-black tracking-[0.25em] text-[#17213d]">DURANT</p>
            <p className="mt-2 text-xs text-slate-400">
              {t("منصة ديورانت التعليمية — جميع الحقوق محفوظة", "DURANT Educational Platform — All Rights Reserved")}
            </p>
          </footer>
        </div>
      </section>
    </main>
  );
}
