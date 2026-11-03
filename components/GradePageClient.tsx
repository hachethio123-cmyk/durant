"use client";

import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "@/components/ThemeProvider";

type Subject = {
  title: string;
  subtitle: string;
  icon: string;
};

const gradeNames: Record<string, { ar: string; en: string }> = {
  "first-prep": {
    ar: "الصف الأول الإعدادي",
    en: "First Preparatory Grade",
  },
  "second-prep": {
    ar: "الصف الثاني الإعدادي",
    en: "Second Preparatory Grade",
  },
  "third-prep": {
    ar: "الصف الثالث الإعدادي",
    en: "Third Preparatory Grade",
  },
  "first-secondary": {
    ar: "الصف الأول الثانوي",
    en: "First Secondary Grade",
  },
  "second-secondary": {
    ar: "الصف الثاني الثانوي",
    en: "Second Secondary Grade",
  },
  "third-secondary": {
    ar: "الصف الثالث الثانوي",
    en: "Third Secondary Grade",
  },
};

function ProgressCard({
  subject,
  isArabic,
}: {
  subject: Subject;
  isArabic: boolean;
}) {
  const progress = 0;

  return (
    <article className="rounded-2xl border border-yellow-400/20 bg-slate-900 p-5 sm:p-6">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-yellow-400/10 text-2xl">
            {subject.icon}
          </div>

          <div>
            <h3 className="font-black text-white">{subject.title}</h3>
            <p className="mt-1 text-xs text-slate-400">
              {subject.subtitle}
            </p>
          </div>
        </div>

        <span className="text-xl font-black text-yellow-400">
          {progress}%
        </span>
      </div>

      <div className="mt-5 h-3 overflow-hidden rounded-full bg-slate-800">
        <div
          className="h-full rounded-full bg-gradient-to-l from-yellow-600 to-yellow-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      <p className="mt-3 text-xs text-slate-500">
        {isArabic
          ? "سيتم احتساب تقدمك بعد تفعيل متابعة إكمال الدروس."
          : "Your progress will be calculated once lesson completion tracking is enabled."}
      </p>
    </article>
  );
}

function SubjectCard({
  subject,
  number,
  isArabic,
}: {
  subject: Subject;
  number: number;
  isArabic: boolean;
}) {
  return (
    <article className="group rounded-2xl border border-yellow-400/20 bg-slate-900 p-6 transition duration-300 hover:-translate-y-1 hover:border-yellow-400/60">
      <div className="flex items-center justify-between">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-yellow-400/20 bg-yellow-400/10 text-4xl">
          {subject.icon}
        </div>

        <span className="rounded-lg border border-slate-700 px-3 py-2 text-xs font-bold text-slate-400">
          {isArabic ? `مادة ${number}` : `Subject ${number}`}
        </span>
      </div>

      <h3 className="mt-6 text-xl font-black text-yellow-400">
        {subject.title}
      </h3>

      <p className="mt-2 text-sm leading-7 text-slate-400">
        {subject.subtitle}
      </p>

      <div className="mt-6 flex items-center justify-between border-t border-slate-800 pt-4">
        <span className="text-sm font-bold text-slate-300">
          {isArabic ? "المحتوى الدراسي" : "Study Materials"}
        </span>

        <span className="text-yellow-400 transition group-hover:-translate-x-1">
          {isArabic ? "←" : "→"}
        </span>
      </div>
    </article>
  );
}

export default function GradePageClient({ slug }: { slug: string }) {
  const { language, languageReady } = useLanguage();

  const isArabic = language === "ar";
  const direction = isArabic ? "rtl" : "ltr";

  const t = (ar: string, en: string) => (isArabic ? ar : en);

  if (!languageReady) {
    return (
      <main
        dir="rtl"
        className="flex min-h-screen items-center justify-center bg-slate-950 text-yellow-400"
      >
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-yellow-400/20 border-t-yellow-400" />
          <p className="mt-4 text-sm font-bold">DURANT</p>
        </div>
      </main>
    );
  }

  const gradeName = gradeNames[slug];

  if (!gradeName) {
    return null;
  }

  const currentGradeName = isArabic ? gradeName.ar : gradeName.en;
  const isPrep = slug.includes("prep");

  const subjects: Subject[] = isPrep
    ? [
        {
          title: t("الدراسات الاجتماعية", "Social Studies"),
          subtitle: t("التاريخ والجغرافيا", "History and Geography"),
          icon: "🌍",
        },
      ]
    : [
        {
          title: t("التاريخ", "History"),
          subtitle: t(
            "الأحداث والحضارات والشخصيات التاريخية",
            "Historical Events, Civilizations and Figures"
          ),
          icon: "🏛️",
        },
        {
          title: t("الجغرافيا", "Geography"),
          subtitle: t(
            "الموقع والسكان والبيئة والعالم",
            "Location, Population, Environment and the World"
          ),
          icon: "🌍",
        },
      ];

  return (
    <main
      dir={direction}
      className="min-h-screen bg-slate-950 px-4 py-6 text-white sm:px-6 sm:py-9"
    >
      <div className="mx-auto max-w-7xl">
        {/* شريط العودة */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 rounded-xl border border-yellow-400/30 bg-slate-900 px-5 py-3 text-sm font-bold text-yellow-400 transition hover:bg-yellow-400 hover:text-slate-950"
          >
            <span>{isArabic ? "→" : "←"}</span>
            {t("العودة إلى لوحة الطالب", "Back to Dashboard")}
          </Link>

          <span className="text-sm font-black tracking-widest text-yellow-400">
            DURANT
          </span>
        </div>

        {/* الواجهة الرئيسية */}
        <header className="relative mt-8 overflow-hidden rounded-3xl border border-yellow-400/30 bg-gradient-to-br from-slate-900 via-slate-900 to-yellow-950/30 shadow-2xl shadow-yellow-950/10">
          <div className="pointer-events-none absolute -left-20 -top-20 h-72 w-72 rounded-full bg-yellow-400/10 blur-3xl" />

          <div className="relative grid items-center md:grid-cols-2">
            <div className="order-2 p-6 sm:p-9 md:order-1 md:p-12">
              <p className="text-xs font-black tracking-[0.2em] text-yellow-400 sm:text-sm">
                DURANT EDUCATIONAL PLATFORM
              </p>

              <h1 className="mt-5 text-3xl font-black leading-relaxed text-yellow-400 sm:text-4xl">
                {currentGradeName}
              </h1>

              <div className="my-5 h-1 w-24 rounded-full bg-yellow-400" />

              <h2 className="text-2xl font-black">
                {t("مستر أمير عبد الناصر", "Mr. Amir Abdel Nasser")}
              </h2>

              <p className="mt-4 max-w-xl text-sm leading-8 text-slate-300 sm:text-base">
                {t(
                  "أهلاً بك في فصلك الدراسي داخل DURANT. اكتشف موادك وتابع رحلتك التعليمية خطوة بخطوة.",
                  "Welcome to your classroom at DURANT. Explore your subjects and follow your learning journey step by step."
                )}
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
                <a
                  href="#subjects"
                  className="rounded-xl bg-yellow-400 px-6 py-3 text-sm font-black text-slate-950 transition hover:bg-yellow-300"
                >
                  {t("استكشف المواد ↓", "Explore Subjects ↓")}
                </a>

                <a
                  href="#curriculum"
                  className="rounded-xl border border-yellow-400/40 px-6 py-3 text-sm font-bold text-yellow-400 transition hover:bg-yellow-400/10"
                >
                  {t("الوحدات والدروس", "Units & Lessons")}
                </a>
              </div>
            </div>

            <div className="order-1 flex min-h-[280px] items-end justify-center overflow-hidden bg-gradient-to-br from-yellow-900/20 to-slate-950/70 px-4 pt-6 md:order-2 md:min-h-[430px]">
              <Image
                src="/images/ameer-nasser.jpg"
                alt={t("مستر أمير عبد الناصر", "Mr. Amir Abdel Nasser")}
                width={500}
                height={700}
                priority
                className="max-h-[340px] w-auto object-contain md:max-h-[460px]"
              />
            </div>
          </div>
        </header>

        {/* ملخص الصف */}
        <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-2xl border border-yellow-400/20 bg-slate-900 p-5">
            <div className="text-2xl">🎓</div>
            <p className="mt-4 text-sm text-slate-400">
              {t("الصف الدراسي", "Grade")}
            </p>
            <h3 className="mt-2 font-black text-yellow-400">
              {currentGradeName}
            </h3>
          </div>

          <div className="rounded-2xl border border-yellow-400/20 bg-slate-900 p-5">
            <div className="text-2xl">📚</div>
            <p className="mt-4 text-sm text-slate-400">
              {t("المواد الدراسية", "Subjects")}
            </p>
            <h3 className="mt-2 font-black">
              {subjects.length}{" "}
              {isArabic
                ? isPrep
                  ? "مادة"
                  : "مادتان"
                : subjects.length === 1
                  ? "Subject"
                  : "Subjects"}
            </h3>
          </div>

          <div className="rounded-2xl border border-yellow-400/20 bg-slate-900 p-5 sm:col-span-2 lg:col-span-1">
            <div className="text-2xl">👨‍🏫</div>
            <p className="mt-4 text-sm text-slate-400">
              {t("مدرس المواد", "Teacher")}
            </p>
            <h3 className="mt-2 font-black">
              {t("مستر أمير عبد الناصر", "Mr. Amir Abdel Nasser")}
            </h3>
          </div>
        </section>

        {/* المواد */}
        <section id="subjects" className="mt-12 scroll-mt-8">
          <div className="mb-6">
            <p className="text-xs font-black tracking-widest text-yellow-400">
              YOUR SUBJECTS
            </p>

            <h2 className="mt-2 text-2xl font-black">
              📚 {t("المواد الدراسية", "Your Subjects")}
            </h2>

            <p className="mt-2 text-sm text-slate-400">
              {t(
                "المواد الخاصة بصفك الدراسي.",
                "The subjects available for your grade."
              )}
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            {subjects.map((subject, index) => (
              <SubjectCard
                key={subject.title}
                subject={subject}
                number={index + 1}
                isArabic={isArabic}
              />
            ))}
          </div>
        </section>

        {/* التقدم الدراسي */}
        <section className="mt-12">
          <div className="mb-6">
            <p className="text-xs font-black tracking-widest text-yellow-400">
              YOUR LEARNING JOURNEY
            </p>

            <h2 className="mt-2 text-2xl font-black">
              📊 {t("متابعة تقدمك", "Track Your Progress")}
            </h2>

            <p className="mt-2 text-sm text-slate-400">
              {t(
                "ستُحدّث نسب الإنجاز تلقائيًا بعد ربط إكمال الدروس بحسابك.",
                "Your completion percentages will update automatically once lesson tracking is connected to your account."
              )}
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            {subjects.map((subject) => (
              <ProgressCard
                key={subject.title}
                subject={subject}
                isArabic={isArabic}
              />
            ))}
          </div>
        </section>

        {/* الوحدات والدروس */}
        <section id="curriculum" className="mt-12 scroll-mt-8">
          <div className="mb-6">
            <p className="text-xs font-black tracking-widest text-yellow-400">
              CURRICULUM
            </p>

            <h2 className="mt-2 text-2xl font-black">
              📖 {t("الوحدات والدروس", "Units & Lessons")}
            </h2>

            <p className="mt-2 text-sm text-slate-400">
              {t(
                "مكان منظم للوحدات والدروس وفيديوهات الشرح والملفات.",
                "An organized space for units, lessons, explanation videos and files."
              )}
            </p>
          </div>

          <div className="rounded-3xl border border-yellow-400/20 bg-slate-900 p-6 sm:p-9">
            <div className="flex flex-col items-center text-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-3xl border border-yellow-400/20 bg-yellow-400/10 text-4xl">
                📚
              </div>

              <h3 className="mt-5 text-xl font-black text-yellow-400">
                {t("مكتبة المحتوى الدراسي", "Study Content Library")}
              </h3>

              <p className="mt-3 max-w-2xl text-sm leading-8 text-slate-400">
                {t(
                  "سيتم تنظيم المحتوى هنا حسب المادة والوحدة والدرس، مع إمكانية مشاهدة فيديو الشرح وفتح الملفات وأداء الامتحانات.",
                  "Content will be organized here by subject, unit and lesson, with options to watch explanation videos, open files and take exams."
                )}
              </p>

              <span className="mt-5 rounded-xl border border-yellow-400/20 bg-yellow-400/10 px-5 py-3 text-sm font-bold text-yellow-400">
                {t("المحتوى قيد التجهيز", "Content Coming Soon")}
              </span>
            </div>
          </div>
        </section>

        {/* الامتحانات */}
        <section className="mt-8">
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 sm:p-8">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-yellow-400/10 text-3xl">
                📝
              </div>

              <div className="flex-1">
                <h3 className="font-black text-yellow-400">
                  {t("الامتحانات والتقييمات", "Exams & Assessments")}
                </h3>

                <p className="mt-2 text-sm leading-7 text-slate-400">
                  {t(
                    "مساحة مخصصة للاختبارات وقياس مستوى الطالب بعد تجهيز المحتوى.",
                    "A dedicated space for tests and measuring student performance once the content is ready."
                  )}
                </p>
              </div>

              <span className="rounded-lg border border-slate-700 px-3 py-2 text-xs font-bold text-slate-400">
                {t("قيد التجهيز", "Coming Soon")}
              </span>
            </div>
          </div>
        </section>

        {/* تذييل الصفحة */}
        <footer className="mt-16 border-t border-slate-800 py-8 text-center">
          <p className="font-black tracking-widest text-yellow-400">
            DURANT
          </p>

          <p className="mt-3 text-sm text-slate-500">
            {t(
              "منصة ديورانت التعليمية — جميع الحقوق محفوظة",
              "DURANT Educational Platform — All Rights Reserved"
            )}
          </p>
        </footer>
      </div>
    </main>
  );
}