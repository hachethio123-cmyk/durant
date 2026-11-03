
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { supabase } from "@/lib/supabase";
import StudentSidebar from "@/components/StudentSidebar";
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

function getRankStyle(rank: number) {
  if (rank === 1) {
    return "bg-amber-50 text-amber-600 border-amber-200";
  }
  if (rank === 2) {
    return "bg-slate-100 text-slate-600 border-slate-200";
  }
  if (rank === 3) {
    return "bg-orange-50 text-orange-600 border-orange-200";
  }
  return "bg-blue-50 text-blue-600 border-blue-100";
}

export default function Dashboard() {
  const router = useRouter();
  const { language, languageReady } = useLanguage();

  const isArabic = language === "ar";
  const direction = isArabic ? "rtl" : "ltr";
  const numberLocale = isArabic ? "ar-EG" : "en-US";

  const t = (ar: string, en: string) => isArabic ? ar : en;

  const getGradeName = (slug: string) =>
    gradeNames[slug]?.[isArabic ? "ar" : "en"] ??
    t("طالب ديورانت", "DURANT Student");

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
          profile.grade && gradeNames[profile.grade]
            ? profile.grade
            : "";

        setGradeSlug(studentGrade);

        const [
          achievementResult,
          earnedResult,
          rankingResult,
        ] = await Promise.all([
          supabase
            .from("achievements")
            .select("id, code, name_ar, name_en, description_ar, description_en, icon, xp_reward")
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
          setLeaderboard(
            (rankingResult.data ?? []) as LeaderboardStudent[]
          );
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
        className="flex min-h-screen items-center justify-center bg-[#f5f7fc] text-slate-800"
      >
        <div className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-600 text-2xl font-black text-white shadow-lg shadow-blue-200">
            D
          </div>
          <h1 className="mt-4 text-3xl font-black tracking-widest text-blue-700">
            DURANT
          </h1>
          <p className="mt-3 text-sm text-slate-500">
            {t("جاري تجهيز لوحة التحكم...", "Preparing your dashboard...")}
          </p>
        </div>
      </main>
    );
  }

  const isPrep = gradeSlug.includes("prep");
  const gradeName = getGradeName(gradeSlug);

  const xpProgress = xpPoints % 100;

  const subjects = isPrep
    ? [
        {
          title: t("الدراسات الاجتماعية", "Social Studies"),
          subtitle: t("التاريخ والجغرافيا", "History & Geography"),
          icon: "🌍",
          color: "bg-blue-50",
          iconColor: "text-blue-600",
        },
      ]
    : [
        {
          title: t("التاريخ", "History"),
          subtitle: t("اكتشف الأحداث والحضارات", "Discover events and civilizations"),
          icon: "🏛️",
          color: "bg-violet-50",
          iconColor: "text-violet-600",
        },
        {
          title: t("الجغرافيا", "Geography"),
          subtitle: t("اكتشف العالم من حولك", "Discover the world around you"),
          icon: "🌍",
          color: "bg-emerald-50",
          iconColor: "text-emerald-600",
        },
      ];

  return (
    <main
      dir={direction}
      className="min-h-screen bg-[#f5f7fc] text-slate-800 md:flex"
    >
      <StudentSidebar />

      <section className="min-w-0 flex-1 px-4 pb-12 pt-20 sm:px-6 md:p-8 lg:p-10">
        <div className="mx-auto max-w-7xl">

          {/* Header */}
          <header className="flex flex-wrap items-center justify-between gap-5">
            <div>
              <p className="text-xs font-black tracking-[0.18em] text-blue-600">
                DURANT STUDENT SPACE
              </p>

              <h1 className="mt-3 text-2xl font-black text-slate-900 md:text-3xl">
                {t("أهلاً بك،", "Welcome,")} {studentName} 👋
              </h1>

              <p className="mt-2 text-sm text-slate-500 md:text-base">
                {t(
                  "جاهز تحقق إنجاز جديد النهارده؟",
                  "Ready to achieve something new today?"
                )}
              </p>
            </div>

            <Link
              href="/profile"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 shadow-sm transition hover:border-blue-300 hover:text-blue-700"
            >
              <span>👤</span>
              {t("حسابي", "My Account")}
            </Link>
          </header>

          {loadError ? (
            <div className="mt-8 rounded-2xl border border-red-200 bg-red-50 p-6 text-red-600">
              {t(loadError, "Unable to load your account data. Please try again.")}
            </div>
          ) : !gradeSlug ? (
            <div className="mt-8 rounded-3xl border border-amber-200 bg-white p-10 text-center shadow-sm">
              <div className="text-5xl">🎓</div>
              <h2 className="mt-4 text-xl font-black text-slate-900">
                {t("لم يتم تحديد الصف الدراسي", "No Grade Selected")}
              </h2>
              <p className="mt-3 text-sm leading-7 text-slate-500">
                {t(
                  "بيانات الصف غير موجودة في حسابك. تواصل مع إدارة المنصة لتحديث بياناتك.",
                  "Your grade is not listed in your account. Contact the platform administration to update your information."
                )}
              </p>
            </div>
          ) : (
            <>
              {/* Welcome Banner */}
              <section className="relative mt-8 overflow-hidden rounded-[28px] bg-gradient-to-l from-[#172554] via-[#1e40af] to-[#4f46e5] text-white shadow-xl shadow-blue-200/50">
                <div className="pointer-events-none absolute -left-20 -top-24 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
                <div className="pointer-events-none absolute -bottom-24 right-1/3 h-64 w-64 rounded-full bg-violet-300/20 blur-3xl" />

                <div className="relative grid items-center md:grid-cols-[1.2fr_0.8fr]">
                  <div className="order-2 p-6 sm:p-9 md:order-1 md:p-10">
                    <span className="inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-bold text-blue-100">
                      {t("مرحباً بك في ديورانت", "WELCOME TO DURANT")}
                    </span>

                    <h2 className="mt-5 text-2xl font-black leading-relaxed sm:text-3xl md:text-4xl">
                      {gradeName}
                    </h2>

                    <h3 className="mt-3 text-lg font-bold text-blue-100">
                      {t("مع مستر أمير عبد الناصر", "With Mr. Amir Abdel Nasser")}
                    </h3>

                    <p className="mt-4 max-w-xl text-sm leading-8 text-blue-100/90">
                      {t(
                        "ابدأ رحلتك التعليمية، اكتشف دروسك، واجمع نقاط الخبرة والإنجازات في طريقك نحو التفوق.",
                        "Start your learning journey, explore your lessons, and collect experience points and achievements on your way to excellence."
                      )}
                    </p>

                    <Link
                      href={`/grades/${gradeSlug}`}
                      className="mt-7 inline-flex items-center gap-3 rounded-xl bg-white px-6 py-3 font-black text-blue-800 shadow-lg transition hover:-translate-y-0.5 hover:bg-blue-50"
                    >
                      {t("ابدأ التعلم", "Start Learning")}
                      <span>{isArabic ? "←" : "→"}</span>
                    </Link>
                  </div>

                  <div className="order-1 flex min-h-[230px] items-end justify-center overflow-hidden px-4 pt-6 md:order-2 md:min-h-[350px]">
                    <Image
                      src="/images/ameer-nasser.jpg"
                      alt="Mr. Amir Abdel Nasser"
                      width={500}
                      height={700}
                      priority
                      className="max-h-[280px] w-auto object-contain md:max-h-[350px]"
                    />
                  </div>
                </div>
              </section>

              {/* XP Card */}
              <section className="mt-7 grid gap-5 lg:grid-cols-[1.35fr_0.65fr]">
                <div className="rounded-3xl border border-blue-100 bg-white p-6 shadow-sm sm:p-7">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <p className="text-xs font-black tracking-widest text-blue-600">
                        DURANT EXPERIENCE
                      </p>
                      <h2 className="mt-2 text-xl font-black text-slate-900">
                        {t("رحلة الخبرة", "Your XP Journey")}
                      </h2>
                    </div>

                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-3xl">
                      ⚡
                    </div>
                  </div>

                  <div className="mt-6 flex flex-wrap items-end justify-between gap-3">
                    <div>
                      <p className="text-sm font-bold text-slate-500">
                        {t("مستواك الحالي", "Current Level")}
                      </p>
                      <p className="mt-1 text-3xl font-black text-blue-700">
                        {t("المستوى", "Level")} {studentLevel}
                      </p>
                    </div>

                    <div className="text-left">
                      <p className="text-2xl font-black tabular-nums text-slate-900">
                        {xpPoints.toLocaleString(numberLocale)}
                        <span className="ms-2 text-sm font-bold text-blue-600">XP</span>
                      </p>
                      <p className="mt-1 text-xs text-slate-400">
                        {t("إجمالي نقاط الخبرة", "Total Experience Points")}
                      </p>
                    </div>
                  </div>

                  <div className="mt-6">
                    <div className="mb-2 flex items-center justify-between text-xs font-bold text-slate-500">
                      <span>{t("التقدم للمستوى التالي", "Progress to next level")}</span>
                      <span className="tabular-nums text-blue-700">
                        {xpProgress.toLocaleString(numberLocale)} / 100 XP
                      </span>
                    </div>

                    <div
                      className="h-3 overflow-hidden rounded-full bg-slate-100"
                      role="progressbar"
                      aria-valuenow={xpProgress}
                      aria-valuemin={0}
                      aria-valuemax={100}
                    >
                      <div
                        className="h-full rounded-full bg-gradient-to-l from-blue-600 to-violet-500 transition-all duration-700"
                        style={{ width: `${xpProgress}%` }}
                      />
                    </div>
                  </div>

                  <p className="mt-4 text-xs leading-6 text-slate-400">
                    {t(
                      "ستحصل على نقاط الخبرة عند تفعيل أنشطة الدروس والامتحانات.",
                      "You will earn experience points as lessons and exams are activated."
                    )}
                  </p>
                </div>

                {/* Gold Wallet */}
                <div className="rounded-3xl border border-amber-100 bg-gradient-to-br from-white to-amber-50 p-6 shadow-sm sm:p-7">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-black tracking-widest text-amber-600">
                        GOLD WALLET
                      </p>
                      <h2 className="mt-2 text-xl font-black text-slate-900">
                        {t("محفظتي الذهبية", "My Gold Wallet")}
                      </h2>
                    </div>
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-100 text-3xl">
                      🪙
                    </div>
                  </div>

                  <p className="mt-7 text-4xl font-black tabular-nums text-amber-600">
                    {goldCoins.toLocaleString(numberLocale)}
                  </p>

                  <p className="mt-2 text-sm font-bold text-slate-500">
                    {t("عملة ذهبية", "Gold Coins")}
                  </p>

                  <div className="mt-6 rounded-xl bg-white/80 p-3 text-xs leading-6 text-slate-500">
                    {t(
                      "رصيدك الحالي من العملات الذهبية.",
                      "Your current gold coin balance."
                    )}
                  </div>
                </div>
              </section>

              {/* Quick Stats */}
              <section className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <div className="rounded-2xl border border-blue-100 bg-white p-5 shadow-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-slate-500">
                      {t("الصف الدراسي", "Your Grade")}
                    </span>
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-xl">🎓</span>
                  </div>
                  <h3 className="mt-4 font-black text-slate-800">{gradeName}</h3>
                </div>

                <div className="rounded-2xl border border-violet-100 bg-white p-5 shadow-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-slate-500">
                      {t("المواد الدراسية", "Subjects")}
                    </span>
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-xl">📚</span>
                  </div>
                  <h3 className="mt-4 font-black text-slate-800">
                    {subjects.length.toLocaleString(numberLocale)} {t("مواد", "Subjects")}
                  </h3>
                </div>

                <div className="rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-slate-500">
                      {t("الإنجازات", "Achievements")}
                    </span>
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-xl">🏆</span>
                  </div>
                  <h3 className="mt-4 font-black text-slate-800">
                    {earnedAchievementIds.length.toLocaleString(numberLocale)} / {achievements.length.toLocaleString(numberLocale)}
                  </h3>
                </div>

                <div className="rounded-2xl border border-amber-100 bg-white p-5 shadow-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-slate-500">
                      {t("مستواك", "Your Level")}
                    </span>
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-xl">⭐</span>
                  </div>
                  <h3 className="mt-4 font-black text-slate-800">
                    {studentLevel.toLocaleString(numberLocale)}
                  </h3>
                </div>
              </section>

              {/* Subjects */}
              <section className="mt-11">
                <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
                  <div>
                    <p className="text-xs font-black tracking-widest text-blue-600">
                      YOUR SUBJECTS
                    </p>
                    <h2 className="mt-2 text-2xl font-black text-slate-900">
                      📚 {t("موادك الدراسية", "Your Subjects")}
                    </h2>
                    <p className="mt-2 text-sm text-slate-500">
                      {t(
                        "اختر المادة لفتح محتوى صفك الدراسي.",
                        "Choose a subject to open your grade content."
                      )}
                    </p>
                  </div>

                  <Link
                    href={`/grades/${gradeSlug}`}
                    className="text-sm font-bold text-blue-700 transition hover:text-blue-900"
                  >
                    {t("عرض محتوى الصف", "View Grade Content")} {isArabic ? "←" : "→"}
                  </Link>
                </div>

                <div className="grid gap-5 md:grid-cols-2">
                  {subjects.map((subject, index) => (
                    <Link
                      key={subject.title}
                      href={`/grades/${gradeSlug}`}
                      className="group rounded-3xl border border-slate-100 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-100/60"
                    >
                      <div className="flex items-center justify-between">
                        <div className={`flex h-16 w-16 items-center justify-center rounded-2xl ${subject.color} text-3xl`}>
                          {subject.icon}
                        </div>
                        <span className="text-2xl text-blue-600 transition group-hover:-translate-x-1">
                          {isArabic ? "←" : "→"}
                        </span>
                      </div>

                      <h3 className="mt-6 text-xl font-black text-slate-900">
                        {subject.title}
                      </h3>

                      <p className="mt-2 text-sm text-slate-500">
                        {subject.subtitle}
                      </p>

                      <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4">
                        <span className="text-sm font-bold text-blue-700">
                          {t("استكشف المادة", "Explore Subject")}
                        </span>
                        <span className="text-xs text-slate-400">
                          {t("مادة", "Subject")} {index + 1}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>

              {/* Achievements */}
              <section className="mt-11">
                <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
                  <div>
                    <p className="text-xs font-black tracking-widest text-violet-600">
                      YOUR ACHIEVEMENTS
                    </p>
                    <h2 className="mt-2 text-2xl font-black text-slate-900">
                      🏆 {t("إنجازاتك وشاراتك", "Your Achievements")}
                    </h2>
                    <p className="mt-2 text-sm text-slate-500">
                      {t(
                        "اجمع الشارات مع تقدمك في رحلتك التعليمية.",
                        "Collect badges as you progress through your learning journey."
                      )}
                    </p>
                  </div>

                  <span className="rounded-full bg-violet-50 px-4 py-2 text-xs font-bold text-violet-700">
                    {earnedAchievementIds.length.toLocaleString(numberLocale)} {t("مكتسبة", "Earned")}
                  </span>
                </div>

                {achievements.length === 0 ? (
                  <div className="rounded-2xl border border-slate-100 bg-white p-8 text-center text-sm text-slate-500">
                    {t("لا توجد إنجازات متاحة حاليًا.", "No achievements are available yet.")}
                  </div>
                ) : (
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {achievements.map((achievement) => {
                      const earned = earnedAchievementIds.includes(achievement.id);

                      return (
                        <div
                          key={achievement.id}
                          className={`rounded-2xl border bg-white p-5 shadow-sm transition ${
                            earned
                              ? "border-emerald-200"
                              : "border-slate-100 opacity-75"
                          }`}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className={`flex h-14 w-14 items-center justify-center rounded-2xl text-3xl ${
                              earned ? "bg-emerald-50" : "bg-slate-100 grayscale"
                            }`}>
                              {achievement.icon}
                            </div>

                            <span className={`rounded-full px-3 py-1 text-xs font-bold ${
                              earned
                                ? "bg-emerald-50 text-emerald-700"
                                : "bg-slate-100 text-slate-500"
                            }`}>
                              {earned
                                ? t("تم الحصول عليها", "Earned")
                                : t("لم تُكتسب بعد", "Locked")}
                            </span>
                          </div>

                          <h3 className="mt-4 font-black text-slate-900">
                            {isArabic ? achievement.name_ar : achievement.name_en}
                          </h3>

                          <p className="mt-2 min-h-10 text-sm leading-6 text-slate-500">
                            {isArabic
                              ? achievement.description_ar
                              : achievement.description_en}
                          </p>

                          <div className="mt-4 border-t border-slate-100 pt-3 text-xs font-bold text-violet-700">
                            ⚡ {Number(achievement.xp_reward).toLocaleString(numberLocale)} XP
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </section>

              {/* Leaderboard */}
              <section className="mt-11">
                <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
                  <div>
                    <p className="text-xs font-black tracking-widest text-amber-600">
                      DURANT GOLD LEAGUE
                    </p>
                    <h2 className="mt-2 text-2xl font-black text-slate-900">
                      🏆 {t("دوري", "League")} {gradeName}
                    </h2>
                    <p className="mt-2 text-sm text-slate-500">
                      {t(
                        "أفضل 10 طلاب في صفك حسب العملات الذهبية.",
                        "The top 10 students in your grade, ranked by gold coins."
                      )}
                    </p>
                  </div>

                  <span className="rounded-full bg-amber-50 px-4 py-2 text-xs font-black text-amber-700">
                    TOP 10
                  </span>
                </div>

                <div className="overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm">
                  <div className="grid grid-cols-[65px_minmax(0,1fr)_minmax(95px,auto)] gap-3 border-b border-slate-100 bg-slate-50 px-4 py-4 text-xs font-bold text-slate-500 sm:grid-cols-[85px_minmax(0,1fr)_minmax(130px,auto)] sm:px-6">
                    <span>{t("المركز", "Rank")}</span>
                    <span>{t("الطالب", "Student")}</span>
                    <span className="text-left">{t("العملات الذهبية", "Gold Coins")}</span>
                  </div>

                  {leaderboardLoading ? (
                    <div className="p-8 text-center text-slate-500">
                      {t("جاري تحميل ترتيب صفك...", "Loading your grade leaderboard...")}
                    </div>
                  ) : leaderboardError ? (
                    <div className="p-8 text-center text-red-500">
                      {t(leaderboardError, "Unable to load your leaderboard right now.")}
                    </div>
                  ) : leaderboard.length === 0 ? (
                    <div className="p-8 text-center">
                      <div className="text-4xl">🏆</div>
                      <p className="mt-3 font-bold text-slate-800">
                        {t("لم يبدأ الترتيب بعد", "The leaderboard has not started yet")}
                      </p>
                      <p className="mt-2 text-sm text-slate-500">
                        {t(
                          "سيظهر طلاب صفك هنا بعد تسجيل النتائج وتجميع العملات.",
                          "Students in your grade will appear here once results and coins are recorded."
                        )}
                      </p>
                    </div>
                  ) : (
                    <div className="divide-y divide-slate-100">
                      {leaderboard.map((student) => (
                        <div
                          key={student.rank_number}
                          className="grid grid-cols-[65px_minmax(0,1fr)_minmax(95px,auto)] items-center gap-3 px-4 py-4 transition hover:bg-blue-50/40 sm:grid-cols-[85px_minmax(0,1fr)_minmax(130px,auto)] sm:px-6"
                        >
                          <span className={`inline-flex min-h-10 min-w-10 items-center justify-center rounded-xl border text-sm font-black ${getRankStyle(student.rank_number)}`}>
                            {student.rank_number <= 3
                              ? ["🥇", "🥈", "🥉"][student.rank_number - 1]
                              : `#${student.rank_number}`}
                          </span>

                          <div className="min-w-0">
                            <h3 className="truncate font-black text-slate-800">
                              {student.student_name}
                            </h3>
                            <p className="mt-1 truncate text-xs text-slate-400">
                              {getGradeName(student.grade)}
                            </p>
                          </div>

                          <div className="flex items-center justify-end gap-2">
                            <span className="text-lg">🪙</span>
                            <span className="font-black tabular-nums text-amber-600">
                              {Number(student.gold_coins).toLocaleString(numberLocale)}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <p className="mt-3 text-xs leading-6 text-slate-400">
                  {t(
                    `هذا الترتيب خاص بطلاب ${gradeName} فقط. يظهر الاسم الأول للطالب حفاظًا على الخصوصية.`,
                    `This leaderboard is only for ${gradeName}. Only the student's first name is displayed for privacy.`
                  )}
                </p>
              </section>

              {/* Learning Center */}
              <section className="mt-11">
                <div className="mb-6">
                  <p className="text-xs font-black tracking-widest text-blue-600">
                    LEARNING CENTER
                  </p>
                  <h2 className="mt-2 text-2xl font-black text-slate-900">
                    ✨ {t("مساحتك التعليمية", "Your Learning Center")}
                  </h2>
                  <p className="mt-2 text-sm text-slate-500">
                    {t(
                      "كل أدوات رحلتك التعليمية في مكان واحد.",
                      "All the tools for your learning journey in one place."
                    )}
                  </p>
                </div>

                <div className="grid gap-5 md:grid-cols-3">
                  <Link
                    href={`/grades/${gradeSlug}`}
                    className="rounded-3xl border border-blue-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg hover:shadow-blue-100/50"
                  >
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-3xl">
                      📖
                    </div>
                    <h3 className="mt-5 font-black text-slate-900">
                      {t("الوحدات والدروس", "Units & Lessons")}
                    </h3>
                    <p className="mt-3 text-sm leading-7 text-slate-500">
                      {t(
                        "انتقل إلى صفك لاستكشاف المحتوى الدراسي والدروس المتاحة.",
                        "Go to your grade to explore the available lessons and study materials."
                      )}
                    </p>
                    <p className="mt-5 text-sm font-bold text-blue-700">
                      {t("فتح المحتوى", "Open Content")} {isArabic ? "←" : "→"}
                    </p>
                  </Link>

                  <div className="rounded-3xl border border-violet-100 bg-white p-6 shadow-sm">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-50 text-3xl">
                      📝
                    </div>
                    <h3 className="mt-5 font-black text-slate-900">
                      {t("الامتحانات والتقييمات", "Exams & Assessments")}
                    </h3>
                    <p className="mt-3 text-sm leading-7 text-slate-500">
                      {t(
                        "مكان مخصص لاختباراتك وتقييم مستواك الدراسي.",
                        "A dedicated space for exams and evaluating your academic progress."
                      )}
                    </p>
                    <span className="mt-5 inline-block rounded-lg bg-violet-50 px-3 py-2 text-xs font-bold text-violet-700">
                      {t("قيد التطوير", "Coming Soon")}
                    </span>
                  </div>

                  <div className="rounded-3xl border border-emerald-100 bg-white p-6 shadow-sm">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-3xl">
                      🤖
                    </div>
                    <h3 className="mt-5 font-black text-slate-900">
                      {t("مساعد ديورانت الذكي", "DURANT AI Assistant")}
                    </h3>
                    <p className="mt-3 text-sm leading-7 text-slate-500">
                      {t(
                        "مساعدك لفهم الدروس والتدرب على الأسئلة.",
                        "Your assistant for understanding lessons and practicing questions."
                      )}
                    </p>
                    <span className="mt-5 inline-block rounded-lg bg-emerald-50 px-3 py-2 text-xs font-bold text-emerald-700">
                      {t("قيد التطوير", "Coming Soon")}
                    </span>
                  </div>
                </div>
              </section>

              {/* Classroom CTA */}
              <section className="mt-11 overflow-hidden rounded-3xl bg-gradient-to-l from-blue-700 to-violet-700 p-6 text-white shadow-xl shadow-blue-200/50 sm:p-8">
                <div className="flex flex-wrap items-center justify-between gap-5">
                  <div>
                    <p className="text-xs font-black tracking-widest text-blue-100">
                      YOUR CLASSROOM
                    </p>
                    <h2 className="mt-3 text-xl font-black sm:text-2xl">
                      {t("مستعد تبدأ المذاكرة؟", "Ready to Start Studying?")}
                    </h2>
                    <p className="mt-2 text-sm text-blue-100">
                      {t(
                        "ادخل إلى صفك وتابع المحتوى الدراسي المتاح.",
                        "Enter your classroom and explore the available study content."
                      )}
                    </p>
                  </div>

                  <Link
                    href={`/grades/${gradeSlug}`}
                    className="rounded-xl bg-white px-6 py-3 font-black text-blue-800 shadow-md transition hover:-translate-y-0.5 hover:bg-blue-50"
                  >
                    {t("دخول الصف", "Enter Classroom")} {isArabic ? "←" : "→"}
                  </Link>
                </div>
              </section>
            </>
          )}

          <footer className="mt-14 border-t border-slate-200 pt-7 text-center text-sm text-slate-400">
            <p className="font-black tracking-widest text-blue-700">
              DURANT
            </p>
            <p className="mt-2">
              {t("منصة ديورانت التعليمية", "DURANT Educational Platform")}
            </p>
            <p className="mt-1">
              {t("جميع الحقوق محفوظة", "All Rights Reserved")} © DURANT
            </p>
          </footer>
        </div>
      </section>
    </main>
  );
}
