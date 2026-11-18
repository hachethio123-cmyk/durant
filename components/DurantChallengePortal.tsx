
"use client";

import { useState } from "react";
import {
  Trophy,
  BookOpen,
  Globe2,
  History,
  Target,
  LockKeyhole,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  Layers3,
  Zap,
  ShieldCheck,
} from "lucide-react";

type Props = {
  gradeSlug: string;
  gradeName: string;
  isArabic: boolean;
};

export default function DurantChallengePortal({
  gradeSlug,
  gradeName,
  isArabic,
}: Props) {
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("");

  const isSecondary = gradeSlug.includes("secondary");

  const subjects = isSecondary
    ? [
        {
          id: "history",
          title: isArabic ? "التاريخ" : "History",
          subtitle: isArabic ? "اكتشف أحداث الماضي" : "Explore the past",
          icon: History,
        },
        {
          id: "geography",
          title: isArabic ? "الجغرافيا" : "Geography",
          subtitle: isArabic ? "اكتشف العالم من حولك" : "Explore the world",
          icon: Globe2,
        },
      ]
    : [
        {
          id: "social",
          title: isArabic ? "الدراسات الاجتماعية" : "Social Studies",
          subtitle: isArabic
            ? "التاريخ والجغرافيا في تحدٍ واحد"
            : "History and geography in one challenge",
          icon: BookOpen,
        },
      ];

  const levels = [
    {
      id: "easy",
      title: isArabic ? "سهل" : "Easy",
      subtitle: isArabic ? "ابدأ واختبر معلوماتك" : "Test your basics",
      number: "01",
    },
    {
      id: "medium",
      title: isArabic ? "متوسط" : "Medium",
      subtitle: isArabic ? "ارفع مستوى التحدي" : "Raise the challenge",
      number: "02",
    },
    {
      id: "hard",
      title: isArabic ? "صعب" : "Hard",
      subtitle: isArabic ? "هل أنت مستعد للتحدي؟" : "Ready for the challenge?",
      number: "03",
    },
  ];

  const Arrow = isArabic ? ChevronLeft : ChevronRight;

  return (
    <section
      dir={isArabic ? "rtl" : "ltr"}
      className="relative isolate overflow-hidden rounded-[28px] border border-[#dce1ed] bg-[#f8f9fd] p-4 shadow-[0_12px_40px_rgba(23,33,61,0.07)] sm:p-6 lg:p-7"
    >
      {/* Background decoration */}
      <div className="pointer-events-none absolute -right-24 -top-24 -z-10 h-72 w-72 rounded-full bg-[#d9b45c]/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -left-20 -z-10 h-72 w-72 rounded-full bg-[#17213d]/10 blur-3xl" />

      {/* Hero */}
      <div className="relative overflow-hidden rounded-[24px] bg-[#17213d] p-6 text-white sm:p-8">
        <div className="absolute -right-10 -top-16 h-52 w-52 rounded-full border border-white/10" />
        <div className="absolute -right-3 -top-9 h-36 w-36 rounded-full border border-[#d9b45c]/20" />
        <div className="absolute -bottom-20 left-20 h-48 w-48 rounded-full bg-[#d9b45c]/10 blur-2xl" />

        <div className="relative z-10 flex flex-col justify-between gap-7 md:flex-row md:items-center">
          <div className="max-w-xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#d9b45c]/30 bg-[#d9b45c]/10 px-3 py-1.5 text-xs font-bold tracking-[2px] text-[#e9c879]">
              <Sparkles size={14} />
              DURANT CHALLENGE
            </div>

            <h2 className="text-3xl font-black leading-tight sm:text-4xl">
              {isArabic ? (
                <>
                  حان وقت
                  <span className="text-[#e5bd68]"> التحدي!</span>
                </>
              ) : (
                <>
                  Time to
                  <span className="text-[#e5bd68]"> Challenge!</span>
                </>
              )}
            </h2>

            <p className="mt-3 max-w-lg text-sm leading-7 text-white/65 sm:text-base">
              {isArabic
                ? "اختبر معلوماتك، واكتشف مستواك، واستعد لتجربة تعليمية مختلفة."
                : "Test your knowledge, discover your level, and get ready for a new learning experience."}
            </p>

            <div className="mt-5 flex flex-wrap items-center gap-3 text-xs font-semibold text-white/75">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-2">
                <GraduationCap size={15} className="text-[#e5bd68]" />
                {gradeName}
              </span>
              <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-2">
                <ShieldCheck size={15} className="text-[#e5bd68]" />
                {isArabic ? "تحديات تعليمية" : "Learning challenges"}
              </span>
            </div>
          </div>

          <div className="hidden shrink-0 items-center justify-center md:flex">
            <div className="flex h-36 w-36 items-center justify-center rounded-full border border-[#e5bd68]/30 bg-white/[0.04] shadow-[0_0_50px_rgba(217,180,92,0.12)]">
              <div className="flex h-24 w-24 items-center justify-center rounded-full border border-[#e5bd68]/40 bg-[#d9b45c]/10">
                <Trophy size={48} className="text-[#e5bd68]" strokeWidth={1.5} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Subject selection */}
      <div className="mt-7">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-bold tracking-widest text-[#bd9846]">
              STEP 01
            </p>
            <h3 className="mt-1 text-lg font-black text-[#17213d]">
              {isArabic ? "اختر المادة" : "Choose your subject"}
            </h3>
          </div>
          <span className="rounded-full bg-[#17213d]/5 px-3 py-1.5 text-xs font-bold text-[#68728a]">
            {isArabic ? "المادة" : "Subject"}
          </span>
        </div>

        <div className={`grid gap-3 ${subjects.length === 2 ? "sm:grid-cols-2" : "grid-cols-1"}`}>
          {subjects.map((subject) => {
            const Icon = subject.icon;
            const active = selectedSubject === subject.id;

            return (
              <button
                key={subject.id}
                type="button"
                onClick={() => {
                  setSelectedSubject(subject.id);
                  setSelectedLevel("");
                }}
                className={`group flex min-h-[104px] items-center gap-4 rounded-2xl border p-4 text-start transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${
                  active
                    ? "border-[#d0a94f] bg-[#fffaf0] shadow-[0_5px_20px_rgba(208,169,79,0.13)]"
                    : "border-[#e3e7f0] bg-white hover:border-[#d0a94f]/60"
                }`}
              >
                <span
                  className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl transition-colors ${
                    active
                      ? "bg-[#17213d] text-[#e5bd68]"
                      : "bg-[#17213d]/5 text-[#17213d] group-hover:bg-[#17213d] group-hover:text-[#e5bd68]"
                  }`}
                >
                  <Icon size={27} strokeWidth={1.8} />
                </span>

                <span className="min-w-0 flex-1">
                  <span className="block font-black text-[#17213d]">
                    {subject.title}
                  </span>
                  <span className="mt-1 block text-xs text-[#8790a4]">
                    {subject.subtitle}
                  </span>
                </span>

                <span
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                    active
                      ? "bg-[#d9b45c] text-[#17213d]"
                      : "bg-[#f0f2f7] text-[#8790a4]"
                  }`}
                >
                  <Arrow size={17} />
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Level selection */}
      <div className="mt-8">
        <div className="mb-4">
          <p className="text-xs font-bold tracking-widest text-[#bd9846]">
            STEP 02
          </p>
          <h3 className="mt-1 text-lg font-black text-[#17213d]">
            {isArabic ? "اختر مستوى التحدي" : "Choose your challenge level"}
          </h3>
          <p className="mt-1 text-xs text-[#8790a4]">
            {isArabic
              ? "اختر المستوى الذي يناسب استعدادك"
              : "Choose the level that suits you"}
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          {levels.map((level) => {
            const active = selectedLevel === level.id;

            return (
              <button
                key={level.id}
                type="button"
                disabled={!selectedSubject}
                onClick={() => setSelectedLevel(level.id)}
                className={`relative overflow-hidden rounded-2xl border p-4 text-start transition-all duration-300 ${
                  !selectedSubject
                    ? "cursor-not-allowed border-[#e7e9ef] bg-[#f0f1f5] opacity-60"
                    : active
                    ? "border-[#d0a94f] bg-[#17213d] text-white shadow-lg"
                    : "border-[#e3e7f0] bg-white text-[#17213d] hover:-translate-y-1 hover:border-[#d0a94f]/60 hover:shadow-md"
                }`}
              >
                <span
                  className={`text-xs font-black tracking-widest ${
                    active ? "text-[#e5bd68]" : "text-[#bd9846]"
                  }`}
                >
                  {level.number}
                </span>
                <span className="mt-3 block font-black">{level.title}</span>
                <span
                  className={`mt-1 block text-xs ${
                    active ? "text-white/60" : "text-[#8790a4]"
                  }`}
                >
                  {level.subtitle}
                </span>
                <span
                  className={`absolute bottom-4 ${
                    isArabic ? "left-4" : "right-4"
                  }`}
                >
                  <Zap
                    size={19}
                    className={active ? "text-[#e5bd68]" : "text-[#c6cbd7]"}
                  />
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Coming soon panel */}
      <div className="mt-7 rounded-2xl border border-dashed border-[#d8dce7] bg-white/75 p-5 sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#17213d]/5 text-[#bd9846]">
            {selectedSubject && selectedLevel ? (
              <Layers3 size={24} />
            ) : (
              <LockKeyhole size={23} />
            )}
          </div>

          <div className="min-w-0 flex-1">
            <h4 className="font-black text-[#17213d]">
              {selectedSubject && selectedLevel
                ? isArabic
                  ? "تم اختيار إعدادات التحدي"
                  : "Challenge preferences selected"
                : isArabic
                ? "منطقة التحدي"
                : "Challenge area"}
            </h4>
            <p className="mt-1 text-sm leading-6 text-[#8790a4]">
              {selectedSubject && selectedLevel
                ? isArabic
                  ? "سيتم إضافة الوحدات والدروس والأسئلة في المرحلة التالية."
                  : "Units, lessons, and questions will be added in the next phase."
                : isArabic
                ? "اختر المادة ومستوى التحدي لعرض إعداداتك هنا."
                : "Choose a subject and challenge level to see your selection here."}
            </p>
          </div>

          <span className="inline-flex w-fit shrink-0 items-center gap-2 rounded-full bg-[#fff5df] px-3 py-2 text-xs font-bold text-[#a17b2e]">
            <LockKeyhole size={13} />
            {isArabic ? "قريبًا" : "Coming soon"}
          </span>
        </div>

        {selectedSubject && selectedLevel && (
          <div className="mt-4 flex flex-wrap gap-2 border-t border-[#edf0f5] pt-4">
            <span className="rounded-lg bg-[#17213d]/5 px-3 py-2 text-xs font-bold text-[#17213d]">
              {subjects.find((s) => s.id === selectedSubject)?.title}
            </span>
            <span className="rounded-lg bg-[#d9b45c]/15 px-3 py-2 text-xs font-bold text-[#92702c]">
              {levels.find((l) => l.id === selectedLevel)?.title}
            </span>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="mt-5 flex items-center justify-center gap-2 text-center text-[11px] font-semibold text-[#9aa1b1]">
        <Sparkles size={13} className="text-[#c5a04e]" />
        DURANT — LEARN. CHALLENGE. ACHIEVE.
      </div>
    </section>
  );
}
