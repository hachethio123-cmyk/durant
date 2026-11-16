
"use client";

import { useEffect, useMemo, useState } from "react";
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
  video_url: string | null;
  attachment_url: string | null;
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
  const [openUnits, setOpenUnits] = useState<string[]>([]);
  const [search, setSearch] = useState("");

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
        setOpenUnits([]);
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
            .select("id, unit_id, title_ar, title_en, duration_minutes, sort_order, video_url, attachment_url")
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

        setOpenUnits(loadedUnits[0] ? [loadedUnits[0].id] : []);
      }

      setLoading(false);
    }

    loadSubject();

    return () => {
      active = false;
    };
  }, [gradeSlug, subjectKey, isArabic]);

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

  const totalVideos = lessons.filter((lesson) => !!lesson.video_url).length;
  const totalFiles = lessons.filter((lesson) => !!lesson.attachment_url).length;

  const filteredLessons = useMemo(() => {
    const query = search.trim().toLocaleLowerCase();
    if (!query) return lessons;

    return lessons.filter((lesson) => {
      const title = `${lesson.title_ar} ${lesson.title_en || ""}`.toLocaleLowerCase();
      return title.includes(query);
    });
  }, [lessons, search]);

  const getUnitLessons = (unitId: string) =>
    filteredLessons.filter((lesson) => lesson.unit_id === unitId);

  const toggleUnit = (unitId: string) => {
    setOpenUnits((current) =>
      current.includes(unitId)
        ? current.filter((id) => id !== unitId)
        : [...current, unitId]
    );
  };

  const openAllUnits = () => {
    setOpenUnits(units.map((unit) => unit.id));
  };

  const closeAllUnits = () => {
    setOpenUnits([]);
  };

  const handlePointerMove = (
    event: React.MouseEvent<HTMLElement>,
    intensity = 1
  ) => {
    const element = event.currentTarget;
    const rect = element.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;

    element.style.setProperty("--pointer-x", `${x * 100}%`);
    element.style.setProperty("--pointer-y", `${y * 100}%`);
    element.style.setProperty("--tilt-x", `${(0.5 - y) * 7 * intensity}deg`);
    element.style.setProperty("--tilt-y", `${(x - 0.5) * 7 * intensity}deg`);
  };

  const resetPointer = (event: React.MouseEvent<HTMLElement>) => {
    const element = event.currentTarget;
    element.style.setProperty("--tilt-x", "0deg");
    element.style.setProperty("--tilt-y", "0deg");
    element.style.setProperty("--pointer-x", "50%");
    element.style.setProperty("--pointer-y", "50%");
  };

  if (!grade) return null;

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
      className="durant-subject-page flex min-h-screen min-w-0 flex-col bg-[#f1f3fb] text-[#17213d] lg:block"
    >
      <style jsx global>{`
        .durant-subject-page {
          --navy: #17213d;
          --blue: #315caa;
          --soft-blue: #edf3ff;
        }

        .subject-reveal {
          animation: subjectReveal 0.7s cubic-bezier(.2,.8,.2,1) both;
        }

        .subject-delay-1 { animation-delay: .08s; }
        .subject-delay-2 { animation-delay: .16s; }
        .subject-delay-3 { animation-delay: .24s; }

        @keyframes subjectReveal {
          from { opacity: 0; transform: translateY(22px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .subject-hero {
          isolation: isolate;
          background:
            radial-gradient(circle at var(--pointer-x, 80%) var(--pointer-y, 30%), rgba(111,166,255,.24), transparent 28%),
            linear-gradient(125deg, #17213d 0%, #202e50 52%, #30466c 100%);
          transition: background-position .2s ease;
        }

        .subject-hero::before {
          content: "";
          position: absolute;
          inset: -50%;
          z-index: -1;
          pointer-events: none;
          background: linear-gradient(115deg, transparent 40%, rgba(255,255,255,.055) 50%, transparent 60%);
          transform: translateX(-30%);
          animation: heroShimmer 9s ease-in-out infinite;
        }

        @keyframes heroShimmer {
          0%, 100% { transform: translateX(-30%) rotate(0deg); }
          50% { transform: translateX(30%) rotate(0deg); }
        }

        .hero-orbit {
          animation: orbitFloat 7s ease-in-out infinite;
        }

        .hero-orbit-two {
          animation: orbitFloat 9s ease-in-out infinite reverse;
        }

        @keyframes orbitFloat {
          0%, 100% { transform: translate3d(0,0,0) rotate(0deg); }
          50% { transform: translate3d(0,-12px,0) rotate(5deg); }
        }

        .unit-card {
          transform:
            perspective(1000px)
            rotateX(var(--tilt-x, 0deg))
            rotateY(var(--tilt-y, 0deg));
          transform-style: preserve-3d;
          transition:
            transform .22s ease,
            box-shadow .3s ease,
            border-color .3s ease;
          will-change: transform;
        }

        .unit-card::after {
          content: "";
          position: absolute;
          inset: 0;
          border-radius: inherit;
          pointer-events: none;
          opacity: 0;
          background: radial-gradient(
            circle at var(--pointer-x, 50%) var(--pointer-y, 50%),
            rgba(83,132,220,.12),
            transparent 48%
          );
          transition: opacity .3s ease;
        }

        .unit-card:hover {
          border-color: #c6d5f3;
          box-shadow: 0 22px 55px rgba(23,33,61,.11);
        }

        .unit-card:hover::after { opacity: 1; }

        .unit-number {
          transition: transform .35s cubic-bezier(.2,.8,.2,1), background .3s ease;
        }

        .unit-card:hover .unit-number {
          transform: translateY(-3px) rotate(-5deg) scale(1.06);
          background: #e0eaff;
        }

        .lesson-row {
          transition: transform .22s ease, background .22s ease, box-shadow .22s ease;
        }

        .lesson-row:hover {
          transform: translateX(var(--lesson-shift, 4px));
          background: #edf3ff;
          box-shadow: 0 5px 18px rgba(35,65,120,.06);
        }

        .lesson-action {
          transition: transform .2s ease, background .2s ease;
        }

        .lesson-action:hover { transform: translateY(-2px) scale(1.04); }

        .stat-card {
          transition: transform .25s ease, box-shadow .25s ease;
        }

        .stat-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 14px 32px rgba(23,33,61,.08);
        }

        .unit-content {
          display: grid;
          grid-template-rows: 0fr;
          opacity: 0;
          transition: grid-template-rows .38s ease, opacity .3s ease;
        }

        .unit-content.is-open {
          grid-template-rows: 1fr;
          opacity: 1;
        }

        .unit-content-inner { overflow: hidden; }

        .unit-chevron {
          transition: transform .3s ease;
        }

        .unit-chevron.is-open { transform: rotate(180deg); }

        @media (prefers-reduced-motion: reduce) {
          .durant-subject-page *,
          .durant-subject-page *::before,
          .durant-subject-page *::after {
            animation-duration: .01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: .01ms !important;
            scroll-behavior: auto !important;
          }

          .unit-card { transform: none !important; }
        }
      `}</style>

      <StudentSidebar />

      <section className={`min-w-0 w-full px-3 pb-8 pt-20 sm:px-5 sm:py-7 md:px-6 lg:px-7 xl:px-8 lg:w-[calc(100%-18rem)] ${isArabic ? "lg:mr-72" : "lg:ml-72"}`}>
        <div className="mx-auto w-full max-w-[1200px]">

          <div className="subject-reveal mb-5 flex flex-wrap items-center justify-between gap-3">
            <Link
              href={`/grades/${gradeSlug}`}
              className="group inline-flex min-h-10 items-center gap-2 rounded-xl border border-[#e5e8f5] bg-white px-4 py-2.5 text-xs font-bold text-[#17213d] shadow-sm transition duration-300 hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md sm:text-sm"
            >
              <span className="transition-transform duration-300 group-hover:-translate-x-1">
                {isArabic ? "→" : "←"}
              </span>
              {t("العودة إلى مواد الصف", "Back to Grade")}
            </Link>

            <span className="text-sm font-black tracking-widest">DURANT</span>
          </div>

          {/* Interactive Hero */}
          <section
            onMouseMove={(event) => handlePointerMove(event, 0.5)}
            onMouseLeave={resetPointer}
            className="subject-hero subject-reveal subject-delay-1 relative overflow-hidden rounded-3xl p-6 text-white shadow-lg sm:p-9"
          >
            <div className="hero-orbit pointer-events-none absolute -end-12 -top-16 h-64 w-64 rounded-full border-[30px] border-white/[0.045]" />
            <div className="hero-orbit-two pointer-events-none absolute end-20 bottom-[-100px] h-52 w-52 rounded-full border border-white/[0.08]" />
            <div className="pointer-events-none absolute end-[35%] top-8 h-2 w-2 rounded-full bg-blue-200/60 blur-[1px]" />
            <div className="pointer-events-none absolute end-[18%] bottom-12 h-3 w-3 rounded-full bg-white/20 blur-[1px]" />

            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.08] px-3 py-1.5">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-blue-300" />
                <p className="text-[10px] font-black tracking-[0.18em] text-blue-100">
                  {t("رحلتك التعليمية", "YOUR LEARNING JOURNEY")}
                </p>
              </div>

              <div className="mt-6 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <p className="text-sm text-blue-100">
                    {isArabic ? grade.ar : grade.en}
                  </p>

                  <h1 className="mt-2 text-3xl font-black leading-tight sm:text-4xl">
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

                  <a
                    href="#subject-units"
                    className="group mt-7 inline-flex min-h-11 items-center justify-center gap-3 rounded-xl bg-white px-6 py-3 text-sm font-black text-[#17213d] shadow-lg shadow-black/10 transition duration-300 hover:-translate-y-1 hover:bg-blue-50 hover:shadow-xl"
                  >
                    {t("ابدأ التعلم", "Start Learning")}
                    <span className="transition-transform duration-300 group-hover:translate-y-1">↓</span>
                  </a>
                </div>

                <div className="hero-orbit flex h-28 w-28 shrink-0 items-center justify-center self-center rounded-[2rem] border border-white/15 bg-white/[0.09] text-6xl shadow-inner shadow-white/10 backdrop-blur-sm sm:h-36 sm:w-36 sm:text-7xl">
                  {subject?.icon || subjectIcons[subjectKey]}
                </div>
              </div>
            </div>
          </section>

          {/* Live content statistics */}
          {!loading && subject && !error && (
            <section className="subject-reveal subject-delay-2 mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[
                {
                  icon: "📚",
                  value: units.length,
                  label: t("الوحدات", "Units"),
                  color: "bg-blue-50 text-blue-700",
                },
                {
                  icon: "📖",
                  value: lessons.length,
                  label: t("الدروس", "Lessons"),
                  color: "bg-indigo-50 text-indigo-700",
                },
                {
                  icon: "🎥",
                  value: totalVideos,
                  label: t("الفيديوهات", "Videos"),
                  color: "bg-sky-50 text-sky-700",
                },
                {
                  icon: "📎",
                  value: totalFiles,
                  label: t("الملفات", "Files"),
                  color: "bg-slate-100 text-slate-700",
                },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="stat-card rounded-2xl border border-[#e5e8f5] bg-white p-4 shadow-sm sm:p-5"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className={`flex h-10 w-10 items-center justify-center rounded-xl text-lg ${stat.color}`}>
                      {stat.icon}
                    </span>
                    <span className="text-2xl font-black tabular-nums text-[#17213d]">
                      {stat.value}
                    </span>
                  </div>
                  <p className="mt-3 text-xs font-bold text-slate-500">{stat.label}</p>
                </div>
              ))}
            </section>
          )}

          {/* Course content */}
          <section id="subject-units" className="subject-reveal subject-delay-3 mt-9 scroll-mt-6">
            <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
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

              {!loading && units.length > 0 && (
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={openAllUnits}
                    className="rounded-xl border border-[#e2e8f4] bg-white px-3 py-2 text-xs font-bold text-[#315caa] transition hover:border-blue-200 hover:bg-blue-50"
                  >
                    {t("فتح الكل", "Expand all")}
                  </button>
                  <button
                    type="button"
                    onClick={closeAllUnits}
                    className="rounded-xl border border-[#e2e8f4] bg-white px-3 py-2 text-xs font-bold text-slate-500 transition hover:bg-slate-50"
                  >
                    {t("إغلاق الكل", "Collapse all")}
                  </button>
                </div>
              )}
            </div>

            {/* Search */}
            {!loading && !error && units.length > 0 && (
              <div className="mb-5 flex items-center gap-3 rounded-2xl border border-[#e5e8f5] bg-white px-4 py-3 shadow-sm transition focus-within:border-blue-300 focus-within:shadow-md">
                <span className="text-lg">⌕</span>
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder={t("ابحث عن درس...", "Search for a lesson...")}
                  className="min-w-0 flex-1 bg-transparent text-sm font-medium text-[#17213d] outline-none placeholder:text-slate-400"
                />
                {search && (
                  <button
                    type="button"
                    onClick={() => setSearch("")}
                    className="rounded-lg px-2 py-1 text-xs font-bold text-blue-600 hover:bg-blue-50"
                  >
                    {t("مسح", "Clear")}
                  </button>
                )}
              </div>
            )}

            {loading ? (
              <div className="rounded-2xl border border-[#e5e8f5] bg-white p-10 text-center shadow-sm">
                <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />
                <p className="mt-4 text-sm font-medium text-slate-500">
                  {t("جاري تحميل المحتوى...", "Loading course content...")}
                </p>
              </div>
            ) : error ? (
              <div className="rounded-2xl border border-red-100 bg-white p-8 text-center shadow-sm">
                <div className="text-3xl">⚠️</div>
                <p className="mt-3 font-bold text-red-500">{error}</p>
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
              <div className="grid items-start gap-4 md:grid-cols-2">
                {units.map((unit, index) => {
                  const unitLessons = getUnitLessons(unit.id);
                  const isOpen = openUnits.includes(unit.id);
                  const originalCount = lessons.filter(
                    (lesson) => lesson.unit_id === unit.id
                  ).length;

                  return (
                    <article
                      key={unit.id}
                      onMouseMove={(event) => handlePointerMove(event, 0.7)}
                      onMouseLeave={resetPointer}
                      className="unit-card relative overflow-hidden rounded-2xl border border-[#e5e8f5] bg-white p-5 shadow-sm sm:p-6"
                      style={{ animationDelay: `${index * 90}ms` }}
                    >
                      <button
                        type="button"
                        onClick={() => toggleUnit(unit.id)}
                        aria-expanded={isOpen}
                        className="relative z-10 flex w-full items-center gap-4 text-start"
                      >
                        <div className="unit-number flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-2xl font-black text-[#17213d]">
                          {String(index + 1).padStart(2, "0")}
                        </div>

                        <div className="min-w-0 flex-1">
                          <p className="text-[10px] font-black tracking-widest text-blue-600">
                            {t("الوحدة الدراسية", "STUDY UNIT")} {index + 1}
                          </p>
                          <h3 className="mt-1 text-base font-black leading-6 text-[#17213d] sm:text-lg">
                            {isArabic ? unit.title_ar : unit.title_en || unit.title_ar}
                          </h3>
                          <p className="mt-1 text-xs text-slate-400">
                            {originalCount} {t("درس", "lessons")}
                          </p>
                        </div>

                        <div className={`unit-chevron flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-50 text-slate-500 ${isOpen ? "is-open" : ""}`}>
                          <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" stroke="currentColor" strokeWidth="2">
                            <path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </div>
                      </button>

                      {(isArabic ? unit.description_ar : unit.description_en || unit.description_ar) && (
                        <p className="relative z-10 mt-4 text-sm leading-7 text-slate-500">
                          {isArabic ? unit.description_ar : unit.description_en || unit.description_ar}
                        </p>
                      )}

                      <div className={`unit-content relative z-10 ${isOpen ? "is-open" : ""}`}>
                        <div className="unit-content-inner">
                          <div className="mt-5 border-t border-slate-100 pt-4">
                            <div className="mb-3 flex items-center justify-between gap-2">
                              <p className="text-sm font-black text-[#17213d]">
                                {t("دروس الوحدة", "Unit Lessons")}
                              </p>
                              <span className="rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-700">
                                {unitLessons.length} {t("درس", "Lessons")}
                              </span>
                            </div>

                            {unitLessons.length === 0 ? (
                              <p className="rounded-xl bg-slate-50 px-4 py-3 text-xs leading-6 text-slate-500">
                                {search
                                  ? t("لا توجد دروس تطابق البحث في هذه الوحدة.", "No lessons match your search in this unit.")
                                  : t("لا توجد دروس منشورة في هذه الوحدة حاليا.", "No published lessons in this unit yet.")}
                              </p>
                            ) : (
                              <div className="space-y-2">
                                {unitLessons.map((lesson, lessonIndex) => (
                                  <div
                                    key={lesson.id}
                                    className="lesson-row flex items-center gap-3 rounded-xl bg-slate-50 px-3 py-3"
                                    style={{ "--lesson-shift": isArabic ? "-4px" : "4px" } as React.CSSProperties}
                                  >
                                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-xs font-black text-blue-600 shadow-sm">
                                      {lessonIndex + 1}
                                    </span>

                                    <div className="min-w-0 flex-1">
                                      <p className="text-sm font-bold leading-6 text-[#17213d]">
                                        {isArabic ? lesson.title_ar : lesson.title_en || lesson.title_ar}
                                      </p>

                                      <div className="mt-1 flex flex-wrap items-center gap-2">
                                        {lesson.duration_minutes != null && (
                                          <span className="text-[10px] text-slate-400">
                                            ◷ {lesson.duration_minutes} {t("دقيقة", "min")}
                                          </span>
                                        )}

                                        <span className={`rounded-md px-2 py-0.5 text-[10px] font-bold ${lesson.video_url ? "bg-blue-50 text-blue-700" : "bg-slate-100 text-slate-400"}`}>
                                          🎥 {lesson.video_url ? t("فيديو متاح", "Video available") : t("لا يوجد فيديو", "No video")}
                                        </span>

                                        <span className={`rounded-md px-2 py-0.5 text-[10px] font-bold ${lesson.attachment_url ? "bg-indigo-50 text-indigo-700" : "bg-slate-100 text-slate-400"}`}>
                                          📎 {lesson.attachment_url ? t("ملف متاح", "File available") : t("لا يوجد ملف", "No file")}
                                        </span>
                                      </div>
                                    </div>

                                    <div className="flex shrink-0 items-center gap-1">
                                      {lesson.video_url && (
                                        <a
                                          href={lesson.video_url}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          aria-label={t("فتح فيديو الدرس", "Open lesson video")}
                                          title={t("مشاهدة الفيديو", "Watch video")}
                                          className="lesson-action flex h-9 w-9 items-center justify-center rounded-xl bg-[#17213d] text-sm text-white shadow-sm hover:bg-blue-800"
                                        >
                                          ▶
                                        </a>
                                      )}

                                      {lesson.attachment_url && (
                                        <a
                                          href={lesson.attachment_url}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          aria-label={t("فتح ملف الدرس", "Open lesson attachment")}
                                          title={t("فتح الملف", "Open attachment")}
                                          className="lesson-action flex h-9 w-9 items-center justify-center rounded-xl bg-white text-sm text-blue-700 shadow-sm hover:bg-blue-50"
                                        >
                                          ↗
                                        </a>
                                      )}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => toggleUnit(unit.id)}
                        className="relative z-10 mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-[#e8edf7] bg-white py-2.5 text-xs font-bold text-[#315caa] transition hover:border-blue-200 hover:bg-blue-50"
                      >
                        {isOpen ? t("إخفاء الدروس", "Hide lessons") : t("استكشف دروس الوحدة", "Explore unit lessons")}
                        <span className={`transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}>⌄</span>
                      </button>
                    </article>
                  );
                })}
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
