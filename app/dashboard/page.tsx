
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { supabase } from "@/lib/supabase";
import StudentSidebar from "@/components/StudentSidebar";

const gradeNames: Record<string, string> = {
  "first-prep": "الصف الأول الإعدادي",
  "second-prep": "الصف الثاني الإعدادي",
  "third-prep": "الصف الثالث الإعدادي",
  "first-secondary": "الصف الأول الثانوي",
  "second-secondary": "الصف الثاني الثانوي",
  "third-secondary": "الصف الثالث الثانوي",
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
          // جلب ترتيب الصف الخاص بالطالب فقط
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

  if (loading) {
    return (
      <main
        dir="rtl"
        className="flex min-h-screen items-center justify-center bg-slate-950 text-white"
      >
        <div className="text-center">
          <h1 className="text-4xl font-black tracking-widest text-yellow-400">
            DURANT
          </h1>
          <p className="mt-4 text-slate-300">
            جاري تجهيز لوحة التحكم...
          </p>
        </div>
      </main>
    );
  }

  const isPrep = gradeSlug.includes("prep");
  const gradeName = gradeNames[gradeSlug];

  const subjects = isPrep
    ? [
        {
          title: "الدراسات الاجتماعية",
          subtitle: "التاريخ والجغرافيا",
          icon: "🌍",
        },
      ]
    : [
        {
          title: "التاريخ",
          subtitle: "اكتشف الأحداث والحضارات",
          icon: "🏛️",
        },
        {
          title: "الجغرافيا",
          subtitle: "اكتشف العالم من حولك",
          icon: "🌍",
        },
      ];

  return (
    <main
      dir="rtl"
      className="min-h-screen bg-slate-950 text-white md:flex"
    >
      <StudentSidebar />

      <section className="min-w-0 flex-1 px-4 pb-10 pt-20 sm:px-6 md:p-10">
        <div className="mx-auto max-w-7xl">

          {/* رأس لوحة التحكم */}
          <header className="flex flex-wrap items-center justify-between gap-5">
            <div>
              <p className="text-sm font-bold tracking-wider text-yellow-400">
                DURANT STUDENT AREA
              </p>

              <h1 className="mt-3 text-2xl font-black md:text-3xl">
                أهلاً بك، {studentName} 👋
              </h1>

              <p className="mt-2 text-sm text-slate-400 md:text-base">
                رحلتك نحو التفوق تبدأ من هنا.
              </p>
            </div>

            <Link
              href="/profile"
              className="rounded-xl border border-yellow-400/30 bg-slate-900 px-5 py-3 font-bold text-yellow-400 transition hover:border-yellow-400 hover:bg-slate-800"
            >
              👤 حسابي
            </Link>
          </header>

          {loadError ? (
            <div className="mt-10 rounded-2xl border border-red-500/30 bg-red-500/10 p-6 text-red-300">
              {loadError}
            </div>
          ) : !gradeSlug ? (
            <div className="mt-10 rounded-2xl border border-yellow-400/30 bg-slate-900 p-8 text-center">
              <div className="text-5xl">🎓</div>
              <h2 className="mt-4 text-xl font-black text-yellow-400">
                لم يتم تحديد الصف الدراسي
              </h2>
              <p className="mt-3 text-slate-300">
                بيانات الصف غير موجودة في حسابك. تواصل مع إدارة المنصة
                لتحديث بياناتك.
              </p>
            </div>
          ) : (
            <>
              {/* الواجهة الرئيسية */}
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
                      مع مستر أمير عبد الناصر
                    </h3>

                    <p className="mt-4 max-w-xl text-sm leading-8 text-slate-300 sm:text-base">
                      أهلاً بك في منصتك التعليمية. اكتشف موادك الدراسية،
                      وتابع دروسك، واستعد لتحقيق أفضل النتائج.
                    </p>

                    <Link
                      href={`/grades/${gradeSlug}`}
                      className="mt-7 inline-flex items-center gap-3 rounded-xl bg-yellow-400 px-6 py-3 font-black text-slate-950 transition hover:bg-yellow-300"
                    >
                      ابدأ رحلتك التعليمية
                      <span>←</span>
                    </Link>
                  </div>

                  <div className="order-1 flex min-h-[270px] items-end justify-center overflow-hidden bg-gradient-to-br from-yellow-900/20 to-slate-950/70 px-4 pt-6 md:order-2 md:min-h-[390px]">
                    <Image
                      src="/images/ameer-nasser.jpg"
                      alt="مستر أمير عبد الناصر"
                      width={500}
                      height={700}
                      priority
                      className="max-h-[350px] w-auto object-contain md:max-h-[430px]"
                    />
                  </div>
                </div>
              </section>

              {/* محفظة العملات الذهبية */}
              <section className="mt-8 overflow-hidden rounded-3xl border border-yellow-400/40 bg-gradient-to-l from-yellow-950/50 via-slate-900 to-slate-900 p-6 shadow-xl shadow-yellow-950/10 sm:p-8">
                <div className="flex flex-wrap items-center justify-between gap-6">
                  <div>
                    <p className="text-xs font-black tracking-[0.2em] text-yellow-400">
                      DURANT GOLD WALLET
                    </p>

                    <h2 className="mt-3 text-2xl font-black sm:text-3xl">
                      محفظتي الذهبية
                    </h2>

                    <p className="mt-2 text-sm leading-7 text-slate-300">
                      اجمع العملات الذهبية من تفوقك في الامتحانات.
                    </p>

                    <div className="mt-6 flex items-center gap-3">
                      <span className="text-4xl">🪙</span>
                      <span className="text-4xl font-black tabular-nums text-yellow-300">
                        {goldCoins.toLocaleString("ar-EG")}
                      </span>
                      <span className="font-bold text-yellow-400">
                        عملة ذهبية
                      </span>
                    </div>
                  </div>

                  <div className="flex h-28 w-28 items-center justify-center rounded-full border-2 border-yellow-400/40 bg-yellow-400/10 text-6xl shadow-inner shadow-yellow-400/20">
                    🪙
                  </div>
                </div>

                <div className="mt-7 rounded-xl border border-yellow-400/20 bg-black/20 p-4">
                  <p className="text-sm leading-7 text-yellow-100/80">
                    كلما ارتفعت درجتك في الامتحان، زادت العملات التي تحصل عليها.
                    سيتم تفعيل إضافة العملات تلقائيًا عند تجهيز نظام الامتحانات.
                  </p>
                </div>
              </section>

              {/* دوري الصف الدراسي */}
              <section className="mt-10">
                <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
                  <div>
                    <p className="text-xs font-black tracking-[0.2em] text-yellow-400">
                      DURANT GOLD LEAGUE
                    </p>

                    <h2 className="mt-2 text-2xl font-black">
                      🏆 دوري {gradeName}
                    </h2>

                    <p className="mt-2 text-sm text-slate-400">
                      أفضل 10 طلاب في صفك فقط، حسب العملات الذهبية.
                    </p>
                  </div>

                  <span className="rounded-xl border border-yellow-400/20 bg-yellow-400/10 px-4 py-2 text-xs font-bold text-yellow-400">
                    TOP 10
                  </span>
                </div>

                <div className="overflow-hidden rounded-2xl border border-yellow-400/20 bg-slate-900">
                  <div className="grid grid-cols-[65px_minmax(0,1fr)_minmax(95px,auto)] gap-3 border-b border-slate-800 bg-slate-950/70 px-4 py-4 text-xs font-bold text-slate-400 sm:grid-cols-[85px_minmax(0,1fr)_minmax(130px,auto)] sm:px-6">
                    <span>المركز</span>
                    <span>الطالب</span>
                    <span className="text-left">العملات الذهبية</span>
                  </div>

                  {leaderboardLoading ? (
                    <div className="p-8 text-center text-slate-400">
                      جاري تحميل ترتيب صفك...
                    </div>
                  ) : leaderboardError ? (
                    <div className="p-8 text-center text-red-300">
                      {leaderboardError}
                    </div>
                  ) : leaderboard.length === 0 ? (
                    <div className="p-8 text-center">
                      <div className="text-4xl">🏆</div>
                      <p className="mt-3 font-bold text-yellow-400">
                        لم يبدأ الترتيب بعد
                      </p>
                      <p className="mt-2 text-sm text-slate-400">
                        سيظهر طلاب صفك هنا بعد تسجيل النتائج وتجميع العملات.
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
                                {gradeNames[student.grade] ?? "طالب ديورانت"}
                              </p>
                            </div>

                            <div className="flex items-center justify-end gap-2">
                              <span className="text-lg">🪙</span>
                              <span className="font-black tabular-nums text-yellow-300">
                                {Number(student.gold_coins).toLocaleString("ar-EG")}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                <p className="mt-3 text-xs leading-6 text-slate-500">
                  هذا الترتيب خاص بطلاب {gradeName} فقط.
                  يظهر الاسم الأول للطالب حفاظًا على الخصوصية.
                </p>
              </section>

              {/* معلومات الطالب */}
              <section className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <div className="rounded-2xl border border-yellow-400/20 bg-slate-900 p-5">
                  <div className="text-2xl">🎓</div>
                  <p className="mt-4 text-sm text-slate-400">
                    صفك الدراسي
                  </p>
                  <h3 className="mt-2 font-black text-yellow-400">
                    {gradeName}
                  </h3>
                </div>

                <div className="rounded-2xl border border-yellow-400/20 bg-slate-900 p-5">
                  <div className="text-2xl">📚</div>
                  <p className="mt-4 text-sm text-slate-400">
                    نظام الدراسة
                  </p>
                  <h3 className="mt-2 font-black">
                    {isPrep ? "الدراسات الاجتماعية" : "التاريخ والجغرافيا"}
                  </h3>
                </div>

                <div className="rounded-2xl border border-yellow-400/20 bg-slate-900 p-5 sm:col-span-2 lg:col-span-1">
                  <div className="text-2xl">👨‍🏫</div>
                  <p className="mt-4 text-sm text-slate-400">
                    المدرس
                  </p>
                  <h3 className="mt-2 font-black">
                    مستر أمير عبد الناصر
                  </h3>
                </div>
              </section>

              {/* المواد الدراسية */}
              <section className="mt-12">
                <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
                  <div>
                    <p className="text-xs font-bold tracking-widest text-yellow-400">
                      YOUR SUBJECTS
                    </p>
                    <h2 className="mt-2 text-2xl font-black">
                      📚 موادك الدراسية
                    </h2>
                    <p className="mt-2 text-sm text-slate-400">
                      اختر المادة لفتح محتوى صفك الدراسي.
                    </p>
                  </div>

                  <Link
                    href={`/grades/${gradeSlug}`}
                    className="text-sm font-bold text-yellow-400 transition hover:text-yellow-300"
                  >
                    عرض محتوى الصف ←
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
                          ←
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
                          استكشف المادة
                        </span>
                        <span className="text-xs text-slate-500">
                          مادة {index + 1}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>

              {/* الخدمات التعليمية */}
              <section className="mt-12">
                <div className="mb-6">
                  <p className="text-xs font-bold tracking-widest text-yellow-400">
                    LEARNING CENTER
                  </p>
                  <h2 className="mt-2 text-2xl font-black">
                    ✨ مساحتك التعليمية
                  </h2>
                  <p className="mt-2 text-sm text-slate-400">
                    كل أدوات رحلتك التعليمية في مكان واحد.
                  </p>
                </div>

                <div className="grid gap-5 md:grid-cols-3">
                  <Link
                    href={`/grades/${gradeSlug}`}
                    className="rounded-2xl border border-yellow-400/20 bg-slate-900 p-6 transition hover:border-yellow-400/60 hover:bg-slate-800"
                  >
                    <div className="text-3xl">📖</div>
                    <h3 className="mt-5 font-black text-yellow-400">
                      الوحدات والدروس
                    </h3>
                    <p className="mt-3 text-sm leading-7 text-slate-400">
                      انتقل إلى صفك لاستكشاف المحتوى الدراسي والدروس المتاحة.
                    </p>
                    <p className="mt-5 text-sm font-bold text-white">
                      فتح المحتوى ←
                    </p>
                  </Link>

                  <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
                    <div className="text-3xl">📝</div>
                    <h3 className="mt-5 font-black text-yellow-400">
                      الامتحانات والتقييمات
                    </h3>
                    <p className="mt-3 text-sm leading-7 text-slate-400">
                      مكان مخصص لاختباراتك وتقييم مستواك الدراسي.
                    </p>
                    <span className="mt-5 inline-block rounded-lg border border-yellow-400/20 bg-yellow-400/10 px-3 py-2 text-xs font-bold text-yellow-400">
                      قيد التجهيز
                    </span>
                  </div>

                  <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
                    <div className="text-3xl">🏆</div>
                    <h3 className="mt-5 font-black text-yellow-400">
                      إنجازاتك وتقدمك
                    </h3>
                    <p className="mt-3 text-sm leading-7 text-slate-400">
                      ستظهر هنا نسبة إكمال دروسك وإنجازاتك بعد تجهيز نظام
                      متابعة التعلم.
                    </p>
                    <span className="mt-5 inline-block rounded-lg border border-yellow-400/20 bg-yellow-400/10 px-3 py-2 text-xs font-bold text-yellow-400">
                      قيد التجهيز
                    </span>
                  </div>
                </div>
              </section>

              {/* دعوة لفتح الصف */}
              <section className="mt-12 overflow-hidden rounded-2xl border border-yellow-400/30 bg-gradient-to-l from-yellow-950/40 to-slate-900 p-6 sm:p-8">
                <div className="flex flex-wrap items-center justify-between gap-5">
                  <div>
                    <p className="text-sm font-bold text-yellow-400">
                      YOUR CLASSROOM
                    </p>
                    <h2 className="mt-3 text-xl font-black sm:text-2xl">
                      مستعد تبدأ المذاكرة؟
                    </h2>
                    <p className="mt-2 text-sm text-slate-400">
                      ادخل إلى صفك وتابع المحتوى الدراسي المتاح.
                    </p>
                  </div>

                  <Link
                    href={`/grades/${gradeSlug}`}
                    className="rounded-xl bg-yellow-400 px-6 py-3 font-black text-slate-950 transition hover:bg-yellow-300"
                  >
                    دخول الصف ←
                  </Link>
                </div>
              </section>
            </>
          )}

          <footer className="mt-14 border-t border-slate-800 pt-6 text-center text-sm text-slate-500">
            <p className="font-bold tracking-widest text-yellow-400">
              DURANT
            </p>
            <p className="mt-2">منصة ديورانت التعليمية</p>
            <p className="mt-1">جميع الحقوق محفوظة © DURANT</p>
          </footer>
        </div>
      </section>
    </main>
  );
}
