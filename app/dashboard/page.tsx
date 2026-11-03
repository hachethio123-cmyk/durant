
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import StudentSidebar from "@/components/StudentSidebar";
import DashboardHero from "@/components/DashboardHero";
import { useLanguage } from "@/components/ThemeProvider";

const gradeNames: Record<string, { ar: string; en: string }> = {
  "first-prep": { ar: "الصف الأول الإعدادي", en: "First Preparatory Grade" },
  "second-prep": { ar: "الصف الثاني الإعدادي", en: "Second Preparatory Grade" },
  "third-prep": { ar: "الصف الثالث الإعدادي", en: "Third Preparatory Grade" },
  "first-secondary": { ar: "الصف الأول الثانوي", en: "First Secondary Grade" },
  "second-secondary": { ar: "الصف الثاني الثانوي", en: "Second Secondary Grade" },
  "third-secondary": { ar: "الصف الثالث الثانوي", en: "Third Secondary Grade" },
};

type LeaderboardStudent = {
  rank_number: number;
  student_name: string;
  grade: string;
  gold_coins: number;
};

type Achievement = {
  id: string;
  code: string;
  name_ar: string;
  name_en: string;
  description_ar: string;
  description_en: string;
  icon: string;
  xp_reward: number;
};

const formatNumber = (value: number, locale: string) =>
  Number(value || 0).toLocaleString(locale);

function SectionTitle({
  eyebrow,
  title,
  icon,
  action,
}: {
  eyebrow: string;
  title: string;
  icon: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-5 flex min-w-0 flex-wrap items-center justify-between gap-3">
      <div className="min-w-0">
        <p className="text-[9px] font-black tracking-[0.15em] text-blue-600 sm:text-[10px] sm:tracking-[0.2em]">
          {eyebrow}
        </p>
        <h2 className="mt-1 flex min-w-0 items-center gap-2 text-base font-black text-[#17213d] sm:text-xl">
          <span className="shrink-0 text-xl sm:text-2xl">{icon}</span>
          <span className="min-w-0">{title}</span>
        </h2>
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

function getRankStyle(rank: number) {
  if (rank === 1) return "bg-amber-100 text-amber-700 border-amber-200";
  if (rank === 2) return "bg-slate-100 text-slate-600 border-slate-200";
  if (rank === 3) return "bg-orange-100 text-orange-700 border-orange-200";
  return "bg-blue-50 text-blue-600 border-blue-100";
}

export default function Dashboard() {
  const router = useRouter();
  const { language, languageReady } = useLanguage();

  const isArabic = language === "ar";
  const direction = isArabic ? "rtl" : "ltr";
  const locale = isArabic ? "ar-EG" : "en-US";
  const t = (ar: string, en: string) => (isArabic ? ar : en);

  const [loading, setLoading] = useState(true);
  const [studentName, setStudentName] = useState("طالب ديورانت");
  const [gradeSlug, setGradeSlug] = useState("");
  const [loadError, setLoadError] = useState("");

  const [goldCoins, setGoldCoins] = useState(0);
  const [xpPoints, setXpPoints] = useState(0);
  const [studentLevel, setStudentLevel] = useState(1);

  const [leaderboard, setLeaderboard] = useState<LeaderboardStudent[]>([]);
  const [leaderboardLoading, setLeaderboardLoading] = useState(true);
  const [leaderboardError, setLeaderboardError] = useState("");

  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [earnedAchievementIds, setEarnedAchievementIds] = useState<string[]>([]);

  useEffect(() => {
    let active = true;

    async function loadStudent() {
      try {
        const { data: authData, error: authError } =
          await supabase.auth.getUser();

        if (!active) return;

        if (authError || !authData.user) {
          router.replace("/login");
          return;
        }

        const studentId = authData.user.id;

        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("full_name, grade, gold_coins, xp_points, student_level")
          .eq("id", studentId)
          .maybeSingle();

        if (!active) return;

        if (profileError || !profile) {
          setLoadError("تعذر تحميل بيانات حسابك. حاول تحديث الصفحة.");
          setLoading(false);
          setLeaderboardLoading(false);
          return;
        }

        setStudentName(profile.full_name || "طالب ديورانت");
        setGoldCoins(Number(profile.gold_coins ?? 0));
        setXpPoints(Number(profile.xp_points ?? 0));
        setStudentLevel(Number(profile.student_level ?? 1));

        const studentGrade =
          profile.grade && gradeNames[profile.grade] ? profile.grade : "";

        setGradeSlug(studentGrade);

        const [achievementResult, earnedResult, rankingResult] =
          await Promise.all([
            supabase
              .from("achievements")
              .select(
                "id, code, name_ar, name_en, description_ar, description_en, icon, xp_reward"
              )
              .order("xp_reward", { ascending: true }),

            supabase
              .from("student_achievements")
              .select("achievement_id")
              .eq("student_id", studentId),

            studentGrade
              ? supabase.rpc("get_student_leaderboard", {
                  p_grade: studentGrade,
                })
              : Promise.resolve({ data: [], error: null }),
          ]);

        if (!active) return;

        if (!achievementResult.error) {
          setAchievements((achievementResult.data ?? []) as Achievement[]);
        }

        if (!earnedResult.error) {
          setEarnedAchievementIds(
            (earnedResult.data ?? []).map((item) => item.achievement_id)
          );
        }

        if (rankingResult.error) {
          setLeaderboardError("تعذر تحميل ترتيب صفك الدراسي حاليًا.");
          setLeaderboard([]);
        } else {
          setLeaderboard((rankingResult.data ?? []) as LeaderboardStudent[]);
        }

        setLeaderboardLoading(false);
        setLoading(false);
      } catch {
        if (!active) return;
        setLoadError("حدث خطأ أثناء تحميل بياناتك. حاول تحديث الصفحة.");
        setLeaderboardLoading(false);
        setLoading(false);
      }
    }

    loadStudent();

    return () => {
      active = false;
    };
  }, [router]);

  if (!languageReady || loading) {
    return (
      <main
        dir={direction}
        className="flex min-h-screen items-center justify-center bg-[#f2f4fb] px-4"
      >
        <div className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#17213d] text-3xl font-black text-amber-400">
            D
          </div>
          <h1 className="mt-3 text-3xl font-black tracking-widest text-[#17213d]">
            DURANT
          </h1>
          <p className="mt-3 text-sm text-slate-500">
            {t("جاري تجهيز لوحة التحكم...", "Preparing your dashboard...")}
          </p>
        </div>
      </main>
    );
  }

  const gradeName =
    gradeNames[gradeSlug]?.[isArabic ? "ar" : "en"] ??
    t("طالب ديورانت", "DURANT Student");

  const isPrep = gradeSlug.includes("prep");
  const xpProgress = xpPoints % 100;

  const subjects = isPrep
    ? [
        {
          title: t("الدراسات الاجتماعية", "Social Studies"),
          subtitle: t("التاريخ والجغرافيا", "History & Geography"),
          icon: "🌍",
          visual: "from-sky-400 via-blue-500 to-[#17213d]",
        },
      ]
    : [
        {
          title: t("التاريخ", "History"),
          subtitle: t("الأحداث والحضارات والشخصيات", "Events, civilizations and people"),
          icon: "🏛️",
          visual: "from-amber-300 via-orange-400 to-[#17213d]",
        },
        {
          title: t("الجغرافيا", "Geography"),
          subtitle: t("الموقع والسكان والبيئة والعالم", "Places, people and the world"),
          icon: "🌍",
          visual: "from-sky-300 via-blue-500 to-[#17213d]",
        },
      ];

  const earnedCount = earnedAchievementIds.length;

  return (
    <main
      dir={direction}
      className="flex min-h-screen min-w-0 flex-col bg-[#f1f3fb] text-[#17213d] lg:flex-row"
    >
      <StudentSidebar />

      <section className="min-w-0 w-full flex-1 px-3 pb-8 pt-20 sm:px-5 sm:pb-10 md:px-6 md:py-7 lg:px-7 xl:px-8">
        <div className="mx-auto w-full min-w-0 max-w-[1500px]">
          {/* Top navigation */}
          <header className="mb-5 flex min-w-0 flex-col gap-4 sm:mb-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="order-2 flex min-h-11 w-full min-w-0 items-center gap-3 rounded-full border border-[#e2e6f5] bg-white px-4 py-3 shadow-sm sm:order-1 sm:w-auto sm:max-w-[360px] sm:flex-1 sm:px-5">
              <span className="shrink-0 text-xl text-slate-400">⌕</span>
              <span className="truncate text-sm text-slate-400">
                {t("ابحث عن أي محتوى...", "Search for any content...")}
              </span>
            </div>

            <div className="order-1 flex min-w-0 items-center justify-between gap-2 sm:order-2 sm:justify-end sm:gap-3">
              <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-xl shadow-sm sm:h-11 sm:w-11">
                🔔
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-black text-white">
                  3
                </span>
              </div>

              <Link
                href="/profile"
                className="flex min-w-0 max-w-[calc(100%-3.5rem)] items-center gap-2 rounded-2xl px-2 py-1 transition hover:bg-white sm:gap-3"
              >
                <div className="min-w-0 text-end">
                  <p className="truncate text-xs font-black text-[#17213d] sm:text-sm">
                    {t("مرحبًا", "Hello")} {studentName}
                  </p>
                  <p className="mt-1 truncate text-[10px] text-slate-500 sm:text-xs">
                    {gradeName}
                  </p>
                </div>
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-blue-200 bg-gradient-to-br from-sky-100 to-blue-200 text-xl sm:h-12 sm:w-12 sm:text-2xl">
                  👨🏻‍🎓
                </div>
              </Link>
            </div>
          </header>

          {loadError ? (
            <div className="break-words rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-600 sm:p-6 sm:text-base">
              {t(loadError, "Unable to load your account data. Please try again.")}
            </div>
          ) : !gradeSlug ? (
            <div className="rounded-3xl border border-amber-200 bg-white p-5 text-center shadow-sm sm:p-10">
              <div className="text-5xl">🎓</div>
              <h2 className="mt-4 text-lg font-black sm:text-xl">
                {t("لم يتم تحديد الصف الدراسي", "No Grade Selected")}
              </h2>
              <p className="mt-3 text-sm leading-7 text-slate-500">
                {t(
                  "تواصل مع إدارة المنصة لتحديث بيانات صفك الدراسي.",
                  "Contact the platform administration to update your grade."
                )}
              </p>
            </div>
          ) : (
            <>
              {/* Main hero and level */}
              <section className="grid min-w-0 grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1fr)_265px] xl:gap-5">
                <div className="min-w-0 overflow-hidden rounded-2xl">
                  <DashboardHero
                    gradeName={gradeName}
                    gradeSlug={gradeSlug}
                    isArabic={isArabic}
                  />
                </div>

                <div className="flex min-h-[250px] min-w-0 flex-col items-center justify-between rounded-2xl bg-gradient-to-br from-[#252d4d] to-[#111a32] p-5 text-center text-white shadow-lg sm:min-h-[270px] sm:p-6 xl:min-h-[285px]">
                  <div className="flex w-full items-center justify-between gap-2">
                    <h2 className="text-sm font-black sm:text-base">
                      {t("مستواك الحالي", "Current Level")}
                    </h2>
                    <span className="shrink-0 text-2xl text-amber-400">♛</span>
                  </div>

                  <div className="my-2 flex h-20 w-20 items-center justify-center rounded-full border-[6px] border-amber-300 bg-gradient-to-br from-yellow-200 to-amber-500 text-4xl shadow-[0_0_30px_rgba(245,184,55,.25)] sm:h-24 sm:w-24 sm:text-5xl">
                    🏅
                  </div>

                  <p className="text-lg font-black sm:text-xl">
                    {t("المستوى", "Level")} {formatNumber(studentLevel, locale)}
                  </p>

                  <div className="w-full">
                    <div className="h-3 overflow-hidden rounded-full bg-white/15">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-amber-300 to-yellow-500 transition-all"
                        style={{ width: `${xpProgress}%` }}
                      />
                    </div>
                    <p className="mt-3 break-words text-xs text-blue-100">
                      {formatNumber(xpPoints, locale)} /{" "}
                      {formatNumber(Math.floor(xpPoints / 100) * 100 + 100, locale)} XP
                    </p>
                  </div>
                </div>
              </section>

              {/* Four summary cards */}
              <section className="mt-5 grid min-w-0 grid-cols-1 gap-3 min-[420px]:grid-cols-2 sm:mt-6 sm:gap-4 xl:grid-cols-4">
                <div className="flex min-w-0 items-center gap-3 rounded-2xl border border-[#e5e8f5] bg-white p-4 shadow-sm sm:gap-4 sm:p-5">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-violet-100 text-2xl text-violet-600 sm:h-14 sm:w-14 sm:text-3xl">
                    🏆
                  </div>
                  <div className="min-w-0">
                    <p className="text-xl font-black sm:text-2xl">
                      {formatNumber(earnedCount, locale)}
                    </p>
                    <p className="mt-1 break-words text-xs text-slate-500 sm:text-sm">
                      {t("إنجاز مكتمل", "Achievements Earned")}
                    </p>
                  </div>
                </div>

                <div className="flex min-w-0 items-center gap-3 rounded-2xl border border-[#e5e8f5] bg-white p-4 shadow-sm sm:gap-4 sm:p-5">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-2xl sm:h-14 sm:w-14 sm:text-3xl">
                    📗
                  </div>
                  <div className="min-w-0">
                    <p className="text-xl font-black sm:text-2xl">
                      {formatNumber(subjects.length, locale)}
                    </p>
                    <p className="mt-1 break-words text-xs text-slate-500 sm:text-sm">
                      {t("مواد دراسية", "Subjects")}
                    </p>
                  </div>
                </div>

                <div className="flex min-w-0 items-center gap-3 rounded-2xl border border-[#e5e8f5] bg-white p-4 shadow-sm sm:gap-4 sm:p-5">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-blue-100 text-2xl sm:h-14 sm:w-14 sm:text-3xl">
                    ⭐
                  </div>
                  <div className="min-w-0">
                    <p className="text-xl font-black sm:text-2xl">
                      {formatNumber(xpPoints, locale)}
                    </p>
                    <p className="mt-1 break-words text-xs text-slate-500 sm:text-sm">
                      {t("نقاط الخبرة", "Experience Points")}
                    </p>
                  </div>
                </div>

                <div className="flex min-w-0 items-center gap-3 rounded-2xl border border-amber-100 bg-[#fffdfa] p-4 shadow-sm sm:gap-4 sm:p-5">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-amber-100 text-2xl sm:h-14 sm:w-14 sm:text-3xl">
                    🪙
                  </div>
                  <div className="min-w-0">
                    <p className="text-xl font-black sm:text-2xl">
                      {formatNumber(goldCoins, locale)}
                    </p>
                    <p className="mt-1 break-words text-xs text-slate-500 sm:text-sm">
                      {t("عملة ذهبية", "Gold Coins")}
                    </p>
                  </div>
                </div>
              </section>

              {/* Subjects and learning progress */}
              <section
                id="grades"
                className="mt-5 grid min-w-0 grid-cols-1 gap-4 sm:mt-6 sm:gap-5 xl:grid-cols-2"
              >
                <div className="min-w-0 rounded-2xl border border-[#e5e8f5] bg-white p-4 sm:p-6">
                  <SectionTitle
                    eyebrow="YOUR SUBJECTS"
                    title={t("موادك الدراسية", "Your Subjects")}
                    icon="📚"
                    action={
                      <Link
                        href={`/grades/${gradeSlug}`}
                        className="text-[11px] font-bold text-blue-600 hover:text-blue-800 sm:text-xs"
                      >
                        {t("عرض الكل ←", "View All →")}
                      </Link>
                    }
                  />

                  <div
                    className={`grid min-w-0 gap-4 ${
                      subjects.length > 1 ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-1"
                    }`}
                  >
                    {subjects.map((subject) => (
                      <Link
                        key={subject.title}
                        href={`/grades/${gradeSlug}`}
                        className="group relative flex min-h-[210px] min-w-0 flex-col justify-end overflow-hidden rounded-xl bg-[#17213d] p-4 text-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl sm:min-h-[235px] sm:p-5"
                      >
                        <div
                          className={`absolute inset-0 bg-gradient-to-br ${subject.visual} opacity-95 transition group-hover:scale-105`}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#101a35] via-[#101a35]/20 to-transparent" />
                        <div className="relative z-10 mb-auto flex h-20 items-center justify-center text-6xl drop-shadow-xl sm:h-24 sm:text-7xl">
                          {subject.icon}
                        </div>
                        <div className="relative z-10 min-w-0 text-center">
                          <h3 className="break-words text-lg font-black sm:text-xl">
                            {subject.title}
                          </h3>
                          <p className="mt-1 break-words text-xs leading-6 text-blue-100">
                            {subject.subtitle}
                          </p>
                          <span className="mx-auto mt-3 inline-flex max-w-full rounded-full bg-white/10 px-5 py-2 text-xs font-bold sm:px-6">
                            {t("ابدأ التعلم ←", "Start Learning →")}
                          </span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>

                <div className="min-w-0 rounded-2xl border border-[#e5e8f5] bg-white p-4 sm:p-6">
                  <SectionTitle
                    eyebrow="YOUR LEARNING JOURNEY"
                    title={t("رحلتك التعليمية", "Your Learning Journey")}
                    icon="📊"
                  />

                  <div className="flex min-h-[235px] min-w-0 flex-col items-center justify-center gap-6 sm:flex-row sm:justify-around">
                    <div
                      className="relative flex h-40 w-40 shrink-0 items-center justify-center rounded-full p-3 sm:h-44 sm:w-44 sm:p-[13px]"
                      style={{
                        background: `conic-gradient(#20b77b ${xpProgress * 3.6}deg, #e8ebf6 0deg)`,
                      }}
                    >
                      <div className="flex h-full w-full flex-col items-center justify-center rounded-full bg-white">
                        <p className="text-3xl font-black text-[#17213d] sm:text-4xl">
                          {xpProgress}%
                        </p>
                        <p className="mt-1 text-center text-[10px] font-bold text-slate-400 sm:text-xs">
                          {t("تقدم المستوى", "Level Progress")}
                        </p>
                      </div>
                    </div>

                    <div className="w-full min-w-0 max-w-[280px] space-y-4 sm:space-y-5">
                      <div className="flex min-w-0 items-center gap-3">
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                          ✓
                        </span>
                        <div className="min-w-0">
                          <p className="break-words text-sm font-bold">
                            {t("رحلتك التعليمية", "Learning Journey")}
                          </p>
                          <p className="mt-1 break-words text-xs text-slate-400">
                            {t("حسابك جاهز للتعلم", "Your account is ready")}
                          </p>
                        </div>
                      </div>

                      <div className="flex min-w-0 items-center gap-3">
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-600">
                          ⭐
                        </span>
                        <div className="min-w-0">
                          <p className="break-words text-sm font-bold">
                            {t("المستوى الحالي", "Current Level")}
                          </p>
                          <p className="mt-1 break-words text-xs text-slate-400">
                            {t(`المستوى ${studentLevel}`, `Level ${studentLevel}`)}
                          </p>
                        </div>
                      </div>

                      <div className="flex min-w-0 items-center gap-3">
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                          ⚡
                        </span>
                        <div className="min-w-0">
                          <p className="break-words text-sm font-bold">
                            {t("نقاط الخبرة", "Experience Points")}
                          </p>
                          <p className="mt-1 break-words text-xs text-slate-400">
                            {formatNumber(xpPoints, locale)} XP
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Achievements and leaderboard */}
              <section className="mt-5 grid min-w-0 grid-cols-1 gap-4 sm:mt-6 sm:gap-5 xl:grid-cols-2">
                <div className="min-w-0 rounded-2xl border border-[#e5e8f5] bg-white p-4 sm:p-6">
                  <SectionTitle
                    eyebrow="YOUR ACHIEVEMENTS"
                    title={t("إنجازاتك", "Your Achievements")}
                    icon="🏆"
                    action={
                      <span className="text-[11px] font-bold text-blue-600 sm:text-xs">
                        {t("عرض الكل ←", "View All →")}
                      </span>
                    }
                  />

                  {achievements.length === 0 ? (
                    <p className="rounded-xl bg-slate-50 p-5 text-center text-sm text-slate-500 sm:p-6">
                      {t("لا توجد إنجازات متاحة حاليًا.", "No achievements available yet.")}
                    </p>
                  ) : (
                    <div className="grid grid-cols-2 gap-2 min-[480px]:grid-cols-4 sm:gap-3">
                      {achievements.slice(0, 4).map((achievement) => {
                        const earned = earnedAchievementIds.includes(achievement.id);

                        return (
                          <div
                            key={achievement.id}
                            className={`min-w-0 rounded-xl border p-3 text-center sm:p-4 ${
                              earned
                                ? "border-amber-200 bg-amber-50/60"
                                : "border-slate-100 bg-slate-50 opacity-60"
                            }`}
                          >
                            <div className="text-3xl sm:text-4xl">
                              {achievement.icon}
                            </div>
                            <p className="mt-2 line-clamp-2 break-words text-[10px] font-black text-[#17213d] sm:mt-3 sm:text-xs">
                              {isArabic ? achievement.name_ar : achievement.name_en}
                            </p>
                            <p className="mt-2 text-[9px] font-bold text-slate-400 sm:text-[10px]">
                              {earned ? t("مكتسب", "Earned") : t("مقفل", "Locked")}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                <div className="min-w-0 rounded-2xl border border-[#e5e8f5] bg-white p-4 sm:p-6">
                  <SectionTitle
                    eyebrow="DURANT LEADERBOARD"
                    title={t("ترتيب الطلاب", "Student Leaderboard")}
                    icon="👥"
                    action={
                      <span className="text-[10px] font-bold text-blue-600 sm:text-xs">
                        TOP 10
                      </span>
                    }
                  />

                  {leaderboardLoading ? (
                    <p className="p-5 text-center text-sm text-slate-500 sm:p-6">
                      {t("جاري تحميل الترتيب...", "Loading leaderboard...")}
                    </p>
                  ) : leaderboardError ? (
                    <p className="break-words p-5 text-center text-sm text-red-500 sm:p-6">
                      {t(leaderboardError, "Unable to load leaderboard.")}
                    </p>
                  ) : leaderboard.length === 0 ? (
                    <p className="p-5 text-center text-sm text-slate-500 sm:p-6">
                      {t("لا يوجد ترتيب متاح حاليًا.", "No ranking available yet.")}
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {leaderboard.slice(0, 5).map((student) => (
                        <div
                          key={student.rank_number}
                          className="flex min-w-0 items-center justify-between gap-2 rounded-xl border border-[#e8ebf5] bg-[#f8f9fd] px-2 py-3 sm:gap-3 sm:px-3"
                        >
                          <div className="flex min-w-0 items-center gap-2 sm:gap-3">
                            <span
                              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-xs font-black sm:h-9 sm:w-9 sm:text-sm ${getRankStyle(student.rank_number)}`}
                            >
                              {student.rank_number <= 3
                                ? ["🥇", "🥈", "🥉"][student.rank_number - 1]
                                : student.rank_number}
                            </span>

                            <div className="min-w-0">
                              <p className="truncate text-xs font-black sm:text-sm">
                                {student.student_name}
                              </p>
                              <p className="truncate text-[9px] text-slate-400 sm:text-[10px]">
                                {gradeNames[student.grade]?.[isArabic ? "ar" : "en"] ??
                                  student.grade}
                              </p>
                            </div>
                          </div>

                          <p className="shrink-0 text-[11px] font-black text-[#17213d] sm:text-sm">
                            {formatNumber(Number(student.gold_coins), locale)} 🪙
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </section>

              {/* Learning center */}
              <section className="mt-5 min-w-0 rounded-2xl border border-[#e5e8f5] bg-white p-4 sm:mt-6 sm:p-6">
                <SectionTitle
                  eyebrow="LEARNING CENTER"
                  title={t("مركز التعلم", "Learning Center")}
                  icon="🎓"
                />

                <div className="grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 xl:grid-cols-3">
                  <Link
                    href={`/grades/${gradeSlug}`}
                    className="min-w-0 rounded-xl border border-blue-100 bg-blue-50/50 p-4 transition hover:-translate-y-1 hover:shadow-md sm:p-5"
                  >
                    <span className="text-3xl">📚</span>
                    <h3 className="mt-3 break-words font-black">
                      {t("الوحدات والدروس", "Units & Lessons")}
                    </h3>
                    <p className="mt-2 break-words text-xs leading-6 text-slate-500">
                      {t("استكشف محتوى صفك الدراسي.", "Explore your grade content.")}
                    </p>
                  </Link>

                  <div className="min-w-0 rounded-xl border border-violet-100 bg-violet-50/50 p-4 sm:p-5">
                    <span className="text-3xl">📝</span>
                    <h3 className="mt-3 break-words font-black">
                      {t("الامتحانات", "Exams")}
                    </h3>
                    <p className="mt-2 break-words text-xs leading-6 text-slate-500">
                      {t("اختباراتك وتقييم مستواك الدراسي.", "Test your knowledge and progress.")}
                    </p>
                    <span className="mt-3 inline-block text-[10px] font-black text-violet-600">
                      {t("قيد التطوير", "Coming Soon")}
                    </span>
                  </div>

                  <div className="min-w-0 rounded-xl border border-emerald-100 bg-emerald-50/50 p-4 sm:p-5">
                    <span className="text-3xl">🤖</span>
                    <h3 className="mt-3 break-words font-black">
                      {t("مساعد ديورانت الذكي", "DURANT AI Assistant")}
                    </h3>
                    <p className="mt-2 break-words text-xs leading-6 text-slate-500">
                      {t("مساعدك لفهم الدروس والتدرب.", "Your learning and practice assistant.")}
                    </p>
                    <span className="mt-3 inline-block text-[10px] font-black text-emerald-600">
                      {t("قيد التطوير", "Coming Soon")}
                    </span>
                  </div>
                </div>
              </section>
            </>
          )}

          <footer className="mt-8 border-t border-[#e1e5f1] pt-5 text-center sm:mt-9 sm:pt-6">
            <p className="font-black tracking-[0.25em] text-[#17213d]">
              DURANT
            </p>
            <p className="mt-2 break-words text-[10px] text-slate-400 sm:text-xs">
              {t(
                "منصة ديورانت التعليمية — جميع الحقوق محفوظة",
                "DURANT Educational Platform — All Rights Reserved"
              )}
            </p>
          </footer>
        </div>
      </section>
    </main>
  );
}
