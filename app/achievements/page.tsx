
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { useLanguage } from "@/components/ThemeProvider";
import StudentSidebar from "@/components/StudentSidebar";

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

export default function AchievementsPage() {
  const router = useRouter();
  const { language, languageReady } = useLanguage();

  const isArabic = language === "ar";
  const direction = isArabic ? "rtl" : "ltr";

  const t = (ar: string, en: string) => (isArabic ? ar : en);

  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [earnedIds, setEarnedIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadAchievements() {
      setLoading(true);
      setError("");

      try {
        const { data: authData, error: authError } =
          await supabase.auth.getUser();

        if (!active) return;

        if (authError || !authData.user) {
          router.replace("/login");
          return;
        }

        const userId = authData.user.id;

        const [achievementsResult, earnedResult] = await Promise.all([
          supabase
            .from("achievements")
            .select(
              "id, code, name_ar, name_en, description_ar, description_en, icon, xp_reward"
            )
            .order("xp_reward", { ascending: true }),

          supabase
            .from("student_achievements")
            .select("achievement_id")
            .eq("student_id", userId),
        ]);

        if (!active) return;

        if (achievementsResult.error) {
          console.error("Achievements loading error:", achievementsResult.error);
          setError(
            t(
              "تعذر تحميل قائمة الإنجازات. حاول مرة أخرى.",
              "Unable to load achievements. Please try again."
            )
          );
          return;
        }

        if (earnedResult.error) {
          console.error("Earned achievements loading error:", earnedResult.error);
          setError(
            t(
              "تعذر تحميل الإنجازات التي حققتها.",
              "Unable to load your earned achievements."
            )
          );
          return;
        }

        setAchievements(achievementsResult.data ?? []);
        setEarnedIds(
          (earnedResult.data ?? []).map((item) => item.achievement_id)
        );
      } catch (err) {
        console.error("Achievements page error:", err);
        if (active) {
          setError(
            t(
              "حدث خطأ أثناء تحميل الصفحة.",
              "An error occurred while loading the page."
            )
          );
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    loadAchievements();

    return () => {
      active = false;
    };
  }, [router, isArabic]);

  const earnedCount = achievements.filter((item) =>
    earnedIds.includes(item.id)
  ).length;

  const totalCount = achievements.length;

  const progress =
    totalCount > 0
      ? Math.round((earnedCount / totalCount) * 100)
      : 0;

  const totalXP = achievements
    .filter((item) => earnedIds.includes(item.id))
    .reduce((sum, item) => sum + (Number(item.xp_reward) || 0), 0);

  if (!languageReady || loading) {
    return (
      <main
        dir={direction}
        className="flex min-h-screen items-center justify-center bg-[#f1f3fb] px-4"
      >
        <div className="text-center">
          <h1 className="text-3xl font-black tracking-wider text-[#17213d]">
            DURANT
          </h1>

          <div className="mx-auto mt-5 h-9 w-9 animate-spin rounded-full border-4 border-slate-200 border-t-amber-400" />

          <p className="mt-4 text-sm font-medium text-slate-500">
            {t("جاري تحميل إنجازاتك...", "Loading your achievements...")}
          </p>
        </div>
      </main>
    );
  }

  return (
    <div
      dir={direction}
      className="flex min-h-screen w-full bg-[#f1f3fb] text-[#17213d]"
    >
      {/* Sidebar */}
      <div className="w-0 shrink-0 lg:w-72">
        <StudentSidebar />
      </div>

      {/* Main content */}
      <main className="min-h-screen min-w-0 flex-1 px-4 py-6 sm:px-7 lg:px-9">
        <div className="mx-auto w-full max-w-6xl">

          {/* Header */}
          <header className="mb-8 flex flex-wrap items-center justify-between gap-4 pt-14 lg:pt-2">
            <div>
              <p className="mb-1 text-sm font-semibold tracking-wide text-slate-500">
                DURANT PLATFORM
              </p>

              <h1 className="text-2xl font-black sm:text-3xl">
                {t("إنجازاتي", "My Achievements")}
              </h1>

              <p className="mt-2 text-sm text-slate-500">
                {t(
                  "تابع إنجازاتك واجمع المزيد من نقاط الخبرة.",
                  "Track your achievements and earn more experience points."
                )}
              </p>
            </div>

            <Link
              href="/dashboard"
              className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-[#17213d] shadow-sm transition hover:border-amber-400 hover:text-amber-600"
            >
              {t("العودة للوحة الطالب", "Back to Dashboard")}
            </Link>
          </header>

          {error ? (
            <section className="rounded-2xl border border-red-200 bg-white p-8 text-center shadow-sm">
              <div className="mb-3 text-4xl">⚠️</div>

              <p className="font-bold text-red-600">{error}</p>

              <button
                type="button"
                onClick={() => window.location.reload()}
                className="mt-5 rounded-xl bg-[#17213d] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#26365d]"
              >
                {t("إعادة المحاولة", "Try Again")}
              </button>
            </section>
          ) : (
            <>
              {/* Statistics */}
              <section className="mb-7 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">

                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-slate-500">
                        {t("الإنجازات المكتسبة", "Earned Achievements")}
                      </p>

                      <p className="mt-3 text-3xl font-black">
                        {earnedCount}
                        <span className="mx-2 text-lg font-semibold text-slate-400">
                          / {totalCount}
                        </span>
                      </p>
                    </div>

                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-amber-50 text-3xl">
                      🏆
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-slate-500">
                        {t("نسبة الإنجاز", "Completion Rate")}
                      </p>

                      <p className="mt-3 text-3xl font-black">
                        {progress}%
                      </p>
                    </div>

                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-3xl">
                      📊
                    </div>
                  </div>

                  <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-amber-400 transition-all duration-700"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-slate-500">
                        {t("نقاط XP من الإنجازات", "Achievement XP")}
                      </p>

                      <p className="mt-3 text-3xl font-black">
                        {totalXP}
                        <span className="ms-2 text-sm font-bold text-amber-500">
                          XP
                        </span>
                      </p>
                    </div>

                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-amber-50 text-3xl">
                      ⚡
                    </div>
                  </div>
                </div>
              </section>

              {/* Section heading */}
              <section className="mb-5 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="text-xl font-black">
                    {t("قائمة الإنجازات", "Achievement Collection")}
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    {t(
                      "كل إنجاز يقربك خطوة من التفوق.",
                      "Every achievement brings you closer to excellence."
                    )}
                  </p>
                </div>

                <span className="rounded-full bg-[#17213d] px-4 py-2 text-xs font-bold text-white">
                  {earnedCount} / {totalCount}
                </span>
              </section>

              {/* Achievement cards */}
              {achievements.length === 0 ? (
                <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
                  <div className="mb-3 text-5xl">🏆</div>

                  <h3 className="font-black">
                    {t("لا توجد إنجازات حتى الآن", "No achievements yet")}
                  </h3>

                  <p className="mt-2 text-sm text-slate-500">
                    {t(
                      "ستظهر الإنجازات هنا عندما تتم إضافتها إلى المنصة.",
                      "Achievements will appear here when they are added to the platform."
                    )}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {achievements.map((achievement) => {
                    const earned = earnedIds.includes(achievement.id);

                    return (
                      <article
                        key={achievement.id}
                        className={`relative overflow-hidden rounded-2xl border bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-md ${
                          earned
                            ? "border-amber-200"
                            : "border-slate-200"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div
                            className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl text-3xl ${
                              earned
                                ? "bg-amber-50"
                                : "bg-slate-100 grayscale"
                            }`}
                          >
                            {achievement.icon || "🏅"}
                          </div>

                          <span
                            className={`rounded-full px-3 py-1.5 text-xs font-bold ${
                              earned
                                ? "bg-green-50 text-green-700"
                                : "bg-slate-100 text-slate-500"
                            }`}
                          >
                            {earned
                              ? t("مكتسب ✓", "Earned ✓")
                              : t("مقفول 🔒", "Locked 🔒")}
                          </span>
                        </div>

                        <h3 className="mt-5 text-lg font-black">
                          {isArabic
                            ? achievement.name_ar
                            : achievement.name_en}
                        </h3>

                        <p className="mt-2 min-h-12 text-sm leading-6 text-slate-500">
                          {isArabic
                            ? achievement.description_ar
                            : achievement.description_en}
                        </p>

                        <div className="mt-5 flex items-center justify-between gap-2 border-t border-slate-100 pt-4">
                          <span className="text-xs font-semibold text-slate-400">
                            {t("مكافأة الإنجاز", "Achievement Reward")}
                          </span>

                          <span className="font-black text-amber-600">
                            +{achievement.xp_reward} XP
                          </span>
                        </div>

                        {earned && (
                          <div className="absolute bottom-0 start-0 h-1 w-full bg-amber-400" />
                        )}
                      </article>
                    );
                  })}
                </div>
              )}

              {/* Encouragement */}
              <section className="mt-8 overflow-hidden rounded-2xl bg-[#17213d] p-6 text-white shadow-sm sm:p-8">
                <div className="flex flex-col items-center justify-between gap-5 sm:flex-row">
                  <div>
                    <p className="text-sm font-bold text-amber-400">
                      DURANT ACHIEVEMENTS
                    </p>

                    <h2 className="mt-2 text-xl font-black sm:text-2xl">
                      {t(
                        "استمر في التعلم وحقق إنجازات جديدة!",
                        "Keep Learning and Unlock New Achievements!"
                      )}
                    </h2>

                    <p className="mt-2 text-sm text-slate-300">
                      {t(
                        "كل درس وكل اختبار هو فرصة جديدة للتقدم.",
                        "Every lesson and quiz is a new opportunity to progress."
                      )}
                    </p>
                  </div>

                  <Link
                    href="/dashboard"
                    className="shrink-0 rounded-xl bg-amber-400 px-6 py-3 font-black text-[#17213d] transition hover:bg-amber-300"
                  >
                    {t("ابدأ التعلم", "Start Learning")}
                  </Link>
                </div>
              </section>
            </>
          )}

          <footer className="mt-8 pb-5 text-center text-xs text-slate-400">
            DURANT Platform ©{" "}
            {t("جميع الحقوق محفوظة", "All Rights Reserved")}
          </footer>
        </div>
      </main>
    </div>
  );
}
