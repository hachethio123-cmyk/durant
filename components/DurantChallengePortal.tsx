
"use client";

import Link from "next/link";

type DurantChallengePortalProps = {
  gradeSlug: string;
  gradeName: string;
  isArabic: boolean;
};

const challengeSubjects: Record<string, { ar: string; en: string }> = {
  "first-prep": { ar: "الدراسات الاجتماعية", en: "Social Studies" },
  "second-prep": { ar: "الدراسات الاجتماعية", en: "Social Studies" },
  "third-prep": { ar: "الدراسات الاجتماعية", en: "Social Studies" },
  "first-secondary": { ar: "التاريخ", en: "History" },
  "second-secondary": { ar: "التاريخ", en: "History" },
};

export default function DurantChallengePortal({
  gradeSlug,
  gradeName,
  isArabic,
}: DurantChallengePortalProps) {
  const subject = challengeSubjects[gradeSlug];
  const isSupportedGrade = Boolean(subject);
  const t = (ar: string, en: string) => (isArabic ? ar : en);

  return (
    <section
      dir={isArabic ? "rtl" : "ltr"}
      className="group relative isolate overflow-hidden rounded-[28px] border border-[#26385e] bg-[#101a35] p-5 text-white shadow-[0_18px_50px_rgba(15,23,42,0.16)] transition-all duration-500 hover:border-cyan-300/30 sm:p-7"
    >
      {/* Background effects */}
      <div className="pointer-events-none absolute -end-20 -top-28 -z-10 h-80 w-80 rounded-full bg-blue-500/20 blur-[85px] transition-all duration-700 group-hover:bg-blue-400/30" />
      <div className="pointer-events-none absolute -bottom-32 -start-20 -z-10 h-80 w-80 rounded-full bg-violet-500/20 blur-[90px] transition-all duration-700 group-hover:bg-violet-400/30" />
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-[0.08] [background-image:linear-gradient(rgba(255,255,255,.35)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.35)_1px,transparent_1px)] [background-size:28px_28px]" />

      <div className="relative grid gap-7 lg:grid-cols-[minmax(0,1.2fr)_minmax(260px,.8fr)] lg:items-center">
        {/* Main content */}
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1.5 text-[9px] font-black tracking-[0.2em] text-cyan-200">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-300 opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-cyan-300" />
              </span>
              DURANT CHALLENGE
            </span>

            <span className="rounded-full border border-white/10 bg-white/[0.06] px-3 py-1.5 text-[9px] font-bold text-slate-300">
              {t("تحديات حسب منهجك", "CURRICULUM-BASED")}
            </span>
          </div>

          <h2 className="mt-5 text-2xl font-black leading-tight sm:text-3xl">
            {t("مستعد تختبر قوة ذاكرتك؟", "Ready to challenge your mind?")}
          </h2>

          <p className="mt-3 max-w-2xl text-xs leading-7 text-slate-300 sm:text-sm">
            {t(
              "اختَر درسك وتحدَّ نفسك في أسئلة تقيس فهمك للتاريخ والدراسات الاجتماعية، مع شرح للإجابة ومتابعة حقيقية لتقدمك.",
              "Choose a lesson and challenge yourself with questions that test your understanding, with answer explanations and real progress tracking."
            )}
          </p>

          {/* Student information */}
          <div className="mt-5 flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.06] px-3 py-2 text-[10px] font-bold text-slate-200 transition hover:bg-white/10">
              <span>🎓</span>
              {gradeName}
            </span>

            {subject && (
              <span className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.06] px-3 py-2 text-[10px] font-bold text-slate-200 transition hover:bg-white/10">
                <span>📚</span>
                {isArabic ? subject.ar : subject.en}
              </span>
            )}
          </div>

          {/* Action */}
          <div className="mt-6 flex flex-wrap items-center gap-3">
            {isSupportedGrade ? (
              <Link
                href={`/grades/${gradeSlug}`}
                className="group/button relative inline-flex min-h-12 items-center justify-center gap-3 overflow-hidden rounded-2xl bg-gradient-to-r from-cyan-300 via-blue-400 to-violet-400 px-5 py-3 text-xs font-black text-[#101a35] shadow-[0_8px_30px_rgba(59,130,246,.25)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_14px_35px_rgba(59,130,246,.4)] active:translate-y-0"
              >
                <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent transition-transform duration-700 group-hover/button:translate-x-full" />

                <span className="relative">
                  {t("استكشف دروسك", "Explore your lessons")}
                </span>

                <span className="relative text-lg transition-transform duration-300 group-hover/button:-translate-x-1">
                  {isArabic ? "←" : "→"}
                </span>
              </Link>
            ) : (
              <span className="inline-flex min-h-12 items-center rounded-2xl border border-white/10 bg-white/[0.06] px-5 py-3 text-xs font-bold text-slate-400">
                {t(
                  "هذا الصف خارج نطاق التحدي حاليًا",
                  "This grade is outside the current challenge scope"
                )}
              </span>
            )}

            <span className="text-[10px] font-bold text-amber-200/80">
              {t(
                "محتوى موثوق قيد التجهيز",
                "Verified content in preparation"
              )}
            </span>
          </div>
        </div>

        {/* Rewards preview */}
        <div className="relative mx-auto w-full max-w-sm">
          <div className="absolute inset-5 rounded-[32px] bg-blue-400/20 blur-2xl transition-all duration-700 group-hover:bg-violet-400/25" />

          <div className="relative overflow-hidden rounded-[26px] border border-white/10 bg-gradient-to-br from-[#1b2b50] via-[#172443] to-[#111a33] p-5 shadow-2xl transition-transform duration-500 hover:-translate-y-1">
            <div className="pointer-events-none absolute -end-10 -top-10 h-32 w-32 rounded-full border border-white/[0.06]" />
            <div className="pointer-events-none absolute -end-5 -top-5 h-20 w-20 rounded-full border border-white/[0.06]" />

            <div className="relative flex items-center justify-between">
              <span className="text-[9px] font-black tracking-[0.2em] text-blue-200">
                {t("رحلة التحدي", "YOUR CHALLENGE")}
              </span>
              <span className="text-xl transition-transform duration-500 group-hover:rotate-12 group-hover:scale-110">
                ⚡
              </span>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3">
              <div className="group/card rounded-2xl border border-cyan-300/15 bg-cyan-300/[0.07] p-4 transition-all duration-300 hover:-translate-y-1 hover:border-cyan-300/30 hover:bg-cyan-300/[0.12]">
                <div className="text-2xl transition-transform duration-300 group-hover/card:scale-110">
                  ✦
                </div>

                <p className="mt-3 text-sm font-black text-cyan-200">
                  XP
                </p>

                <p className="mt-2 text-[10px] font-bold leading-5 text-slate-300">
                  {t("نقاط خبرة لتطور مستواك", "Experience to grow your level")}
                </p>
              </div>

              <div className="group/card rounded-2xl border border-amber-300/15 bg-amber-300/[0.07] p-4 transition-all duration-300 hover:-translate-y-1 hover:border-amber-300/30 hover:bg-amber-300/[0.12]">
                <div className="text-2xl transition-transform duration-300 group-hover/card:scale-110">
                  🏆
                </div>

                <p className="mt-3 text-sm font-black text-amber-200">
                  {t("إنجازات", "Achievements")}
                </p>

                <p className="mt-2 text-[10px] font-bold leading-5 text-slate-300">
                  {t("تحديات وإنجازات تنتظرك", "Challenges and achievements await")}
                </p>
              </div>
            </div>

            {/* Learning experience */}
            <div className="mt-4 rounded-2xl border border-white/10 bg-black/10 p-4 transition-colors duration-300 hover:bg-black/20">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-rose-400/10 text-xl">
                  💡
                </div>

                <div className="min-w-0">
                  <p className="text-xs font-black text-white">
                    {t(
                      "افهم الإجابة، مش بس احفظها",
                      "Understand, don't just memorize"
                    )}
                  </p>

                  <p className="mt-1 text-[10px] leading-5 text-slate-400">
                    {t(
                      "كل سؤال هيكون معاه تفسير يساعدك تتعلم من أخطائك.",
                      "Questions will include explanations to help you learn from mistakes."
                    )}
                  </p>
                </div>
              </div>
            </div>

            {/* Trust note */}
            <div className="mt-4 flex items-start gap-2 rounded-xl border border-emerald-300/10 bg-emerald-300/[0.04] p-3">
              <span className="mt-0.5 text-sm">🛡️</span>

              <p className="text-[9px] font-bold leading-5 text-slate-400">
                {t(
                  "لن تظهر أسئلة أو تُمنح نقاط قبل اعتماد المحتوى والتحقق من الإجابات.",
                  "No questions or XP are issued before content and answers are verified."
                )}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
