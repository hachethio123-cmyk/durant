
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

function getRankStyle(rank: number) {
  if (rank === 1) {
    return {
      icon: "🥇",
      border: "border-yellow-400/50",
      background: "bg-yellow-400/10",
      text: "text-yellow-300",
    };
  }

  if (rank === 2) {
    return {
      icon: "🥈",
      border: "border-slate-300/30",
      background: "bg-slate-300/5",
      text: "text-slate-200",
    };
  }

  if (rank === 3) {
    return {
      icon: "🥉",
      border: "border-orange-500/30",
      background: "bg-orange-500/5",
      text: "text-orange-300",
    };
  }

  return {
    icon: `#${rank}`,
    border: "border-slate-700",
    background: "bg-slate-900",
    text: "text-slate-300",
  };
}

export default function Dashboard() {
  const router = useRouter();
  const { language, languageReady } = useLanguage();

  const isArabic = language === "ar";
  const direction = isArabic ? "rtl" : "ltr";
  const numberLocale = isArabic ? "ar-EG" : "en-US";

  const t = (ar: string, en: string) => isArabic ? ar : en;

  const getGradeName = (slug: string) =>
    gradeNames[slug]?.[isArabic ? "ar" : "en"] ?? t("طالب ديورانت", "DURANT Student");

  const [loading, setLoading] = useState(true);
  const [studentName, setStudentName] = useState("طالب ديورانت");
  const [gradeSlug, setGradeSlug] = useState("");
  const [loadError, setLoadError] = useState("");

  const [goldCoins, setGoldCoins] = useState(0);
  const [leaderboard, setLeaderboard] = useState<LeaderboardStudent[]>([]);
  const [leaderboardLoading, setLeaderboardLoading] = useState(true);
  const [leaderboardError, setLeaderboardError] = useState("");

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

        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("full_name, grade, gold_coins")
          .eq("id", authData.user.id)
          .maybeSingle();

        if (!active) return;

        if (profileError || !profile) {
          setLoadError("تعذر تحميل بيانات حسابك. حاول تحديث الصفحة.");
          setLoading(false);
          setLeaderboardLoading(false);
          return;
        }

        if (profile.full_name) {
          setStudentName(profile.full_name);
        }

        const studentGrade =
          profile.grade && gradeNames[profile.grade]
            ? profile.grade
            : "";

        setGradeSlug(studentGrade);
        setGoldCoins(Number(profile.gold_coins ?? 0));

        if (studentGrade) {
          const {
            data: rankingData,
            error: rankingFetchError,
          } = await supabase.rpc("get_student_leaderboard", {
            p_grade: studentGrade,
          });

          if (!active) return;

          if (rankingFetchError) {
            setLeaderboardError("تعذر تحميل ترتيب صفك الدراسي حاليًا.");
            setLeaderboard([]);
          } else {
            setLeaderboard(
              (rankingData ?? []) as LeaderboardStudent[]
            );
          }
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
        className="flex min-h-screen items-center justify-center bg-slate-950 text-white"
      >
        <div className="text-center">
          <h1 className="text-4xl font-black tracking-widest text-yellow-400">
            DURANT
          </h1>
          <p className="mt-4 text-slate-300">
            {t("جاري تجهيز لوحة التحكم...", "Preparing your dashboard...")}
          </p>
        </div>
      </main>
    );
  }

  const isPrep = gradeSlug.includes("prep");
  const gradeName = getGradeName(gradeSlug);

  const subjects = isPrep
    ? [
        {
          title: t("الدراسات الاجتماعية", "Social Studies"),
          subtitle: t("التاريخ والجغرافيا", "History & Geography"),
          icon: "🌍",
        },
      ]
    : [
        {
          title: t("التاريخ", "History"),
          subtitle: t("اكتشف الأحداث والحضارات", "Discover events and civilizations"),
          icon: "🏛️",
        },
        {
          title: t("الجغرافيا", "Geography"),
          subtitle: t("اكتشف العالم من حولك", "Discover the world around you"),
          icon: "🌍",
        },
      ];

  return (
    <main
      dir={direction}
      className="min-h-screen bg-slate-950 text-white md:flex"
    >
      <StudentSidebar />

      <section className="min-w-0 flex-1 px-4 pb-10 pt-20 sm:px-6 md:p-10">
        <div className="mx-auto max-w-7xl">
          <header className="flex flex-wrap items-center justify-between gap-5">
            <div>
              <p className="text-sm font-bold tracking-wider text-yellow-400">
                DURANT STUDENT AREA
              </p>

              <h1 className="mt-3 text-2xl font-black md:text-3xl">
                {t("أهلاً بك،", "Welcome,")} {studentName} 👋
              </h1>

              <p className="mt-2 text-sm text-slate-400 md:text-base">
                {t("رحلتك نحو التفوق تبدأ من هنا.", "Your journey to excellence starts here.")}
              </p>
            </div>

            <Link
              href="/profile"
              className="rounded-xl border border-yellow-400/30 bg-slate-900 px-5 py-3 font-bold text-yellow-400 transition hover:border-yellow-400 hover:bg-slate-800"
            >
              👤 {t("حسابي", "My Account")}
            </Link>
          </header>

          {loadError ? (
            <div className="mt-10 rounded-2xl border border-red-500/30 bg-red-500/10 p-6 text-red-300">
              {t(loadError, "Unable to load your account data. Please try again.")}
            </div>
          ) : !gradeSlug ? (
            <div className="mt-10 rounded-2xl border border-yellow-400/30 bg-slate-900 p-8 text-center">
              <div className="text-5xl">🎓</div>
              <h2 className="mt-4 text-xl font-black text-yellow-400">
                {t("لم يتم تحديد الصف الدراسي", "No Grade Selected")}
              </h2>
              <p className="mt-3 text-slate-300">
                {t(
                  "بيانات الصف غير موجودة في حسابك. تواصل مع إدارة المنصة لتحديث بياناتك.",
                  "Your grade is not listed in your account. Contact the platform administration to update your information."
                )}
              </p>
            </div>
          ) : (
            <>
              <section className="relative mt-9 overflow-hidden rounded-3xl border border-yellow-400/30 bg-gradient-to-bl from-slate-900 via-slate-900 to-yellow-950/30 shadow-2xl shadow-yellow-950/10">
                <div className="pointer-events-none absolute -left-16 -top-20 h-64 w-64 rounded-full bg-yellow-400/10 blur-3xl" />

                <div className="relative grid items-center md:grid-cols-2">
                  <div className="order-2 p-6 sm:p-8 md:order-1 md:p-10">
                    <p className="text-xs font-black tracking-[0.2em] text-yellow-400 sm:text-sm">
                      WELCOME TO DURANT
                    </p>

                    <h2 className="mt-4 text-3xl font-black leading-relaxed text-yellow-400 md:text-4xl">
                      {gradeName}
                    </h2>

                    <div className="my-5 h-1 w-20 rounded-full bg-yellow-400" />

                    <h3 className="text-xl font-black sm:text-2xl">
                      {t("مع مستر أمير عبد الناصر", "With Mr. Amir Abdel Nasser")}
                    </h3>

                    <p className="mt-4 max-w-xl text-sm leading-8 text-slate-300 sm:text-base">
                      {t(
                        "أهلاً بك في منصتك التعليمية. اكتشف موادك الدراسية، وتابع دروسك، واستعد لتحقيق أفضل النتائج.",
                        "Welcome to your learning platform. Explore your subjects, follow your lessons, and get ready to achieve your best results."
                      )}
                    </p>

                    <Link
                      href={`/grades/${gradeSlug}`}
                      className="mt-7 inline-flex items-center gap-3 rounded-xl bg-yellow-400 px-6 py-3 font-black text-slate-950 transition hover:bg-yellow-300"
                    >
                      {t("ابدأ رحلتك التعليمية", "Start Learning")}
                      <span>{isArabic ? "←" : "→"}</span>
                    </Link>
                  </div>

                  <div className="order-1 flex min-h-[270px] items-end justify-center overflow-hidden bg-gradient-to-br from-yellow-900/20 to-slate-950/70 px-4 pt-6 md:order-2 md:min-h-[390px]">
                    <Image
                      src="/images/ameer-nasser.jpg"
                      alt="Mr. Amir Abdel Nasser"
                      width={500}
                      height={700}
                      priority
                      className="max-h-[350px] w-auto object-contain md:max-h-[430px]"
                    />
                  </div>
                </div>
              </section>

              <section className="mt-8 overflow-hidden rounded-3xl border border-yellow-400/40 bg-gradient-to-l from-yellow-950/50 via-slate-900 to-slate-900 p-6 shadow-xl shadow-yellow-950/10 sm:p-8">
                <div className="flex flex-wrap items-center justify-between gap-6">
                  <div>
                    <p className="text-xs font-black tracking-[0.2em] text-yellow-400">
                      DURANT GOLD WALLET
                    </p>

                    <h2 className="mt-3 text-2xl font-black sm:text-3xl">
                      {t("محفظتي الذهبية", "My Gold Wallet")}
                    </h2>

                    <p className="mt-2 text-sm leading-7 text-slate-300">
                      {t(
                        "اجمع العملات الذهبية من تفوقك في الامتحانات.",
                        "Earn gold coins through your exam achievements."
                      )}
                    </p>

                    <div className="mt-6 flex items-center gap-3">
                      <span className="text-4xl">🪙</span>
                      <span className="text-4xl font-black tabular-nums text-yellow-300">
                        {goldCoins.toLocaleString(numberLocale)}
                      </span>
                      <span className="font-bold text-yellow-400">
                        {t("عملة ذهبية", "Gold Coins")}
                      </span>
                    </div>
                  </div>

                  <div className="flex h-28 w-28 items-center justify-center rounded-full border-2 border-yellow-400/40 bg-yellow-400/10 text-6xl shadow-inner shadow-yellow-400/20">
                    🪙
                  </div>
                </div>

                <div className="mt-7 rounded-xl border border-yellow-400/20 bg-black/20 p-4">
                  <p className="text-sm leading-7 text-yellow-100/80">
                    {t(
                      "كلما ارتفعت درجتك في الامتحان، زادت العملات التي تحصل عليها. سيتم تفعيل إضافة العملات تلقائيًا عند تجهيز نظام الامتحانات.",
                      "The higher your exam score, the more coins you earn. Automatic coin rewards will be activated when the exam system is ready."
                    )}
                  </p>
                </div>
              </section>

              <section className="mt-10">
                <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
                  <div>
                    <p className="text-xs font-black tracking-[0.2em] text-yellow-400">
                      DURANT GOLD LEAGUE
                    </p>

                    <h2 className="mt-2 text-2xl font-black">
                      🏆 {t("دوري", "League")} {gradeName}
                    </h2>

                    <p className="mt-2 text-sm text-slate-400">
                      {t(
                        "أفضل 10 طلاب في صفك فقط، حسب العملات الذهبية.",
                        "The top 10 students in your grade, ranked by gold coins."
                      )}
                    </p>
                  </div>

                  <span className="rounded-xl border border-yellow-400/20 bg-yellow-400/10 px-4 py-2 text-xs font-bold text-yellow-400">
                    TOP 10
                  </span>
                </div>

                <div className="overflow-hidden rounded-2xl border border-yellow-400/20 bg-slate-900">
                  <div className="grid grid-cols-[65px_minmax(0,1fr)_minmax(95px,auto)] gap-3 border-b border-slate-800 bg-slate-950/70 px-4 py-4 text-xs font-bold text-slate-400 sm:grid-cols-[85px_minmax(0,1fr)_minmax(130px,auto)] sm:px-6">
                    <span>{t("المركز", "Rank")}</span>
                    <span>{t("الطالب", "Student")}</span>
                    <span className="text-left">{t("العملات الذهبية", "Gold Coins")}</span>
                  </div>

                  {leaderboardLoading ? (
                    <div className="p-8 text-center text-slate-400">
                      {t("جاري تحميل ترتيب صفك...", "Loading your grade leaderboard...")}
                    </div>
                  ) : leaderboardError ? (
                    <div className="p-8 text-center text-red-300">
                      {t(leaderboardError, "Unable to load your leaderboard right now.")}
                    </div>
                  ) : leaderboard.length === 0 ? (
                    <div className="p-8 text-center">
                      <div className="text-4xl">🏆</div>
                      <p className="mt-3 font-bold text-yellow-400">
                        {t("لم يبدأ الترتيب بعد", "The leaderboard has not started yet")}
                      </p>
                      <p className="mt-2 text-sm text-slate-400">
                        {t(
                          "سيظهر طلاب صفك هنا بعد تسجيل النتائج وتجميع العملات.",
                          "Students in your grade will appear here once results and coins are recorded."
                        )}
                      </p>
                    </div>
                  ) : (
                    <div className="divide-y divide-slate-800">
                      {leaderboard.map((student) => {
                        const style = getRankStyle(student.rank_number);

                        return (
                          <div
                            key={student.rank_number}
                            className={`grid grid-cols-[65px_minmax(0,1fr)_minmax(95px,auto)] items-center gap-3 px-4 py-4 transition hover:bg-slate-800/60 sm:grid-cols-[85px_minmax(0,1fr)_minmax(130px,auto)] sm:px-6 ${style.background}`}
                          >
                            <div>
                              <span
                                className={`inline-flex min-h-10 min-w-10 items-center justify-center rounded-xl border ${style.border} ${style.text} text-sm font-black`}
                              >
                                {style.icon}
                              </span>
                            </div>

                            <div className="min-w-0">
                              <h3 className="truncate font-black text-white">
                                {student.student_name}
                              </h3>
                              <p className="mt-1 truncate text-xs text-slate-500">
                                {getGradeName(student.grade)}
                              </p>
                            </div>

                            <div className="flex items-center justify-end gap-2">
                              <span className="text-lg">🪙</span>
                              <span className="font-black tabular-nums text-yellow-300">
                                {Number(student.gold_coins).toLocaleString(numberLocale)}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                <p className="mt-3 text-xs leading-6 text-slate-500">
                  {t(
                    `هذا الترتيب خاص بطلاب ${gradeName} فقط. يظهر الاسم الأول للطالب حفاظًا على الخصوصية.`,
                    `This leaderboard is only for ${gradeName}. Only the student's first name is displayed for privacy.`
                  )}
                </p>
              </section>

              <section className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <div className="rounded-2xl border border-yellow-400/20 bg-slate-900 p-5">
                  <div className="text-2xl">🎓</div>
                  <p className="mt-4 text-sm text-slate-400">
                    {t("صفك الدراسي", "Your Grade")}
                  </p>
                  <h3 className="mt-2 font-black text-yellow-400">
                    {gradeName}
                  </h3>
                </div>

                <div className="rounded-2xl border border-yellow-400/20 bg-slate-900 p-5">
                  <div className="text-2xl">📚</div>
                  <p className="mt-4 text-sm text-slate-400">
                    {t("نظام الدراسة", "Study Program")}
                  </p>
                  <h3 className="mt-2 font-black">
                    {isPrep
                      ? t("الدراسات الاجتماعية", "Social Studies")
                      : t("التاريخ والجغرافيا", "History & Geography")}
                  </h3>
                </div>

                <div className="rounded-2xl border border-yellow-400/20 bg-slate-900 p-5 sm:col-span-2 lg:col-span-1">
                  <div className="text-2xl">👨‍🏫</div>
                  <p className="mt-4 text-sm text-slate-400">
                    {t("المدرس", "Teacher")}
                  </p>
                  <h3 className="mt-2 font-black">
                    {t("مستر أمير عبد الناصر", "Mr. Amir Abdel Nasser")}
                  </h3>
                </div>
              </section>

              <section className="mt-12">
                <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
                  <div>
                    <p className="text-xs font-bold tracking-widest text-yellow-400">
                      YOUR SUBJECTS
                    </p>
                    <h2 className="mt-2 text-2xl font-black">
                      📚 {t("موادك الدراسية", "Your Subjects")}
                    </h2>
                    <p className="mt-2 text-sm text-slate-400">
                      {t(
                        "اختر المادة لفتح محتوى صفك الدراسي.",
                        "Choose a subject to open your grade content."
                      )}
                    </p>
                  </div>

                  <Link
                    href={`/grades/${gradeSlug}`}
                    className="text-sm font-bold text-yellow-400 transition hover:text-yellow-300"
                  >
                    {t("عرض محتوى الصف", "View Grade Content")} {isArabic ? "←" : "→"}
                  </Link>
                </div>

                <div className="grid gap-5 md:grid-cols-2">
                  {subjects.map((subject, index) => (
                    <Link
                      key={subject.title}
                      href={`/grades/${gradeSlug}`}
                      className="group rounded-2xl border border-yellow-400/20 bg-slate-900 p-6 transition duration-300 hover:-translate-y-1 hover:border-yellow-400/60 hover:bg-slate-900/80"
                    >
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-yellow-400/20 bg-yellow-400/10 text-3xl">
                          {subject.icon}
                        </div>

                        <span className="text-2xl text-yellow-400 transition group-hover:-translate-x-1">
                          {isArabic ? "←" : "→"}
                        </span>
                      </div>

                      <h3 className="mt-6 text-xl font-black text-yellow-400">
                        {subject.title}
                      </h3>

                      <p className="mt-2 text-sm text-slate-400">
                        {subject.subtitle}
                      </p>

                      <div className="mt-6 flex items-center justify-between border-t border-slate-800 pt-4">
                        <span className="text-sm font-bold text-slate-300">
                          {t("استكشف المادة", "Explore Subject")}
                        </span>
                        <span className="text-xs text-slate-500">
                          {t("مادة", "Subject")} {index + 1}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>

              <section className="mt-12">
                <div className="mb-6">
                  <p className="text-xs font-bold tracking-widest text-yellow-400">
                    LEARNING CENTER
                  </p>
                  <h2 className="mt-2 text-2xl font-black">
                    ✨ {t("مساحتك التعليمية", "Your Learning Center")}
                  </h2>
                  <p className="mt-2 text-sm text-slate-400">
                    {t(
                      "كل أدوات رحلتك التعليمية في مكان واحد.",
                      "All the tools for your learning journey in one place."
                    )}
                  </p>
                </div>

                <div className="grid gap-5 md:grid-cols-3">
                  <Link
                    href={`/grades/${gradeSlug}`}
                    className="rounded-2xl border border-yellow-400/20 bg-slate-900 p-6 transition hover:border-yellow-400/60 hover:bg-slate-800"
                  >
                    <div className="text-3xl">📖</div>
                    <h3 className="mt-5 font-black text-yellow-400">
                      {t("الوحدات والدروس", "Units & Lessons")}
                    </h3>
                    <p className="mt-3 text-sm leading-7 text-slate-400">
                      {t(
                        "انتقل إلى صفك لاستكشاف المحتوى الدراسي والدروس المتاحة.",
                        "Go to your grade to explore the available lessons and study materials."
                      )}
                    </p>
                    <p className="mt-5 text-sm font-bold text-white">
                      {t("فتح المحتوى", "Open Content")} {isArabic ? "←" : "→"}
                    </p>
                  </Link>

                  <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
                    <div className="text-3xl">📝</div>
                    <h3 className="mt-5 font-black text-yellow-400">
                      {t("الامتحانات والتقييمات", "Exams & Assessments")}
                    </h3>
                    <p className="mt-3 text-sm leading-7 text-slate-400">
                      {t(
                        "مكان مخصص لاختباراتك وتقييم مستواك الدراسي.",
                        "A dedicated space for exams and evaluating your academic progress."
                      )}
                    </p>
                    <span className="mt-5 inline-block rounded-lg border border-yellow-400/20 bg-yellow-400/10 px-3 py-2 text-xs font-bold text-yellow-400">
                      {t("قيد التجهيز", "Coming Soon")}
                    </span>
                  </div>

                  <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
                    <div className="text-3xl">🏆</div>
                    <h3 className="mt-5 font-black text-yellow-400">
                      {t("إنجازاتك وتقدمك", "Your Achievements")}
                    </h3>
                    <p className="mt-3 text-sm leading-7 text-slate-400">
                      {t(
                        "ستظهر هنا نسبة إكمال دروسك وإنجازاتك بعد تجهيز نظام متابعة التعلم.",
                        "Your lesson completion and achievements will appear here once the learning progress system is ready."
                      )}
                    </p>
                    <span className="mt-5 inline-block rounded-lg border border-yellow-400/20 bg-yellow-400/10 px-3 py-2 text-xs font-bold text-yellow-400">
                      {t("قيد التجهيز", "Coming Soon")}
                    </span>
                  </div>
                </div>
              </section>

              <section className="mt-12 overflow-hidden rounded-2xl border border-yellow-400/30 bg-gradient-to-l from-yellow-950/40 to-slate-900 p-6 sm:p-8">
                <div className="flex flex-wrap items-center justify-between gap-5">
                  <div>
                    <p className="text-sm font-bold text-yellow-400">
                      YOUR CLASSROOM
                    </p>
                    <h2 className="mt-3 text-xl font-black sm:text-2xl">
                      {t("مستعد تبدأ المذاكرة؟", "Ready to Start Studying?")}
                    </h2>
                    <p className="mt-2 text-sm text-slate-400">
                      {t(
                        "ادخل إلى صفك وتابع المحتوى الدراسي المتاح.",
                        "Enter your classroom and explore the available study content."
                      )}
                    </p>
                  </div>

                  <Link
                    href={`/grades/${gradeSlug}`}
                    className="rounded-xl bg-yellow-400 px-6 py-3 font-black text-slate-950 transition hover:bg-yellow-300"
                  >
                    {t("دخول الصف", "Enter Classroom")} {isArabic ? "←" : "→"}
                  </Link>
                </div>
              </section>
            </>
          )}

          <footer className="mt-14 border-t border-slate-800 pt-6 text-center text-sm text-slate-500">
            <p className="font-bold tracking-widest text-yellow-400">
              DURANT
            </p>
            <p className="mt-2">{t("منصة ديورانت التعليمية", "DURANT Educational Platform")}</p>
            <p className="mt-1">
              {t("جميع الحقوق محفوظة", "All Rights Reserved")} © DURANT
            </p>
          </footer>
        </div>
      </section>
    </main>
  );
}
