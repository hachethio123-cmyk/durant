
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import StudentSidebar from "@/components/StudentSidebar";
import DashboardHero from "@/components/DashboardHero";
import XPPodium from "@/components/XPPodium";
import DurantChallengePortal from "@/components/DurantChallengePortal";
import { useLanguage } from "@/components/ThemeProvider";

const gradeNames: Record<string, { ar: string; en: string }> = {
  "first-prep": { ar: "الصف الأول الإعدادي", en: "First Preparatory Grade" },
  "second-prep": { ar: "الصف الثاني الإعدادي", en: "Second Preparatory Grade" },
  "third-prep": { ar: "الصف الثالث الإعدادي", en: "Third Preparatory Grade" },
  "first-secondary": { ar: "الصف الأول الثانوي", en: "First Secondary Grade" },
  "second-secondary": { ar: "الصف الثاني الثانوي", en: "Second Secondary Grade" },
  "third-secondary": { ar: "الصف الثالث الثانوي", en: "Third Secondary Grade" },
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

type NotificationItem = {
  id: string;
  title_ar: string;
  title_en: string | null;
  message_ar: string;
  message_en: string | null;
  type: string;
  action_url: string | null;
  is_read: boolean;
  created_at: string;
};

const formatNumber = (value: number, locale: string) =>
  Number(value || 0).toLocaleString(locale);

function SectionTitle({
  eyebrow,
  title,
  icon,
  action,
  isArabic,
}: {
  eyebrow: string;
  title: string;
  icon: string;
  action?: React.ReactNode;
  isArabic: boolean;
}) {
  return (
    <div className="mb-5 flex min-w-0 flex-wrap items-center justify-between gap-3">
      <div className="min-w-0">
        <p className="text-[9px] font-black tracking-[0.2em] text-blue-600 sm:text-[10px]">
          {eyebrow}
        </p>
        <h2 className="mt-1.5 flex min-w-0 items-center gap-2 text-lg font-black text-[#17213d] sm:text-xl">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#edf1fc] text-lg">
            {icon}
          </span>
          <span>{title}</span>
        </h2>
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

function Panel({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`min-w-0 rounded-[24px] border border-[#e5e9f5] bg-white p-4 shadow-[0_8px_30px_rgba(23,33,61,0.035)] transition-shadow duration-300 hover:shadow-[0_14px_38px_rgba(23,33,61,0.07)] sm:p-5 ${className}`}
    >
      {children}
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  detail,
  tone,
}: {
  icon: string;
  label: string;
  value: string;
  detail: string;
  tone: "blue" | "violet" | "gold" | "green";
}) {
  const tones = {
    blue: "bg-blue-50 text-blue-600 border-blue-100",
    violet: "bg-violet-50 text-violet-600 border-violet-100",
    gold: "bg-amber-50 text-amber-600 border-amber-100",
    green: "bg-emerald-50 text-emerald-600 border-emerald-100",
  };

  return (
    <div className="group relative min-w-0 overflow-hidden rounded-[22px] border border-[#e6eaf4] bg-white p-4 shadow-[0_5px_20px_rgba(23,33,61,0.035)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_15px_32px_rgba(23,33,61,0.09)] sm:p-5">
      <div className="pointer-events-none absolute -end-8 -top-10 h-28 w-28 rounded-full bg-slate-100/70 blur-2xl transition-all group-hover:bg-blue-100/80" />
      <div className="relative flex items-start justify-between gap-2">
        <div className={`flex h-11 w-11 items-center justify-center rounded-2xl border text-2xl ${tones[tone]}`}>
          {icon}
        </div>
        <span className="rounded-full bg-slate-50 px-2.5 py-1 text-[9px] font-black tracking-wider text-slate-400">
          DURANT
        </span>
      </div>
      <div className="relative mt-4">
        <p className="text-2xl font-black tracking-tight text-[#17213d] sm:text-3xl">
          {value}
        </p>
        <p className="mt-1 text-xs font-black text-[#34415f]">{label}</p>
        <p className="mt-1 text-[10px] text-slate-400">{detail}</p>
      </div>
      <div className="absolute bottom-0 start-0 h-1 w-0 bg-gradient-to-r from-blue-500 to-violet-400 transition-all duration-500 group-hover:w-full" />
    </div>
  );
}

function XPProgressCard({
  xpPoints,
  studentLevel,
  xpProgress,
  locale,
  isArabic,
}: {
  xpPoints: number;
  studentLevel: number;
  xpProgress: number;
  locale: string;
  isArabic: boolean;
}) {
  const progress = Math.max(0, Math.min(100, Number(xpProgress) || 0));
  const remaining = 100 - progress;
  const circumference = 2 * Math.PI * 43;
  const dashOffset = circumference - (progress / 100) * circumference;
  const format = (value: number) => value.toLocaleString(locale);

  return (
    <div className="relative mt-5 overflow-hidden rounded-[26px] border border-[#30436c] bg-[#101a35] p-4 text-white shadow-[0_18px_45px_rgba(15,23,42,0.2)] sm:p-5">
      <div className="pointer-events-none absolute -end-16 -top-20 h-52 w-52 rounded-full bg-blue-500/20 blur-[65px]" />
      <div className="pointer-events-none absolute -bottom-24 -start-16 h-52 w-52 rounded-full bg-violet-500/20 blur-[65px]" />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.25) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.25) 1px, transparent 1px)",
          backgroundSize: "26px 26px",
        }}
      />

      <div className="relative z-10">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-xl border border-blue-400/30 bg-blue-400/10 text-blue-300">
                ✦
              </span>
              <span className="text-[10px] font-black tracking-[0.22em] text-blue-200">
                DURANT
              </span>
              <span className="text-[9px] font-bold tracking-widest text-slate-500">
                / LEVEL SYSTEM
              </span>
            </div>
            <h3 className="mt-3 text-lg font-black sm:text-xl">
              {isArabic ? "مركز التطور الشخصي" : "Personal Growth Center"}
            </h3>
            <p className="mt-1 text-[10px] leading-5 text-slate-400 sm:text-xs">
              {isArabic
                ? "كل نقطة خبرة تقربك من إنجاز جديد."
                : "Every XP point takes you closer to a new achievement."}
            </p>
          </div>

          <div className="rounded-2xl border border-amber-400/20 bg-amber-400/10 px-4 py-2">
            <p className="text-[9px] font-bold tracking-widest text-amber-200/70">
              {isArabic ? "مستواك الحالي" : "CURRENT LEVEL"}
            </p>
            <p className="mt-1 text-center text-2xl font-black text-amber-300">
              {format(studentLevel)}
            </p>
          </div>
        </div>

        <div className="mt-6 flex flex-col items-center gap-5 sm:flex-row sm:gap-6">
          <div className="relative flex h-36 w-36 shrink-0 items-center justify-center">
            <div className="absolute inset-0 rounded-full border border-blue-400/10" />
            <div className="absolute inset-2 rounded-full border border-dashed border-blue-300/15" />
            <div className="absolute inset-0 animate-[spin_18s_linear_infinite] rounded-full border border-transparent border-t-blue-300/50" />

            <svg
              viewBox="0 0 100 100"
              className="h-full w-full -rotate-90 overflow-visible"
              role="img"
              aria-label={`${progress}%`}
            >
              <defs>
                <linearGradient id="durantXpGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#67e8f9" />
                  <stop offset="50%" stopColor="#3b82f6" />
                  <stop offset="100%" stopColor="#a78bfa" />
                </linearGradient>
                <filter id="durantXpGlow">
                  <feGaussianBlur stdDeviation="2.5" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>
              <circle cx="50" cy="50" r="43" fill="none" stroke="#263653" strokeWidth="7" />
              <circle
                cx="50"
                cy="50"
                r="43"
                fill="none"
                stroke="url(#durantXpGradient)"
                strokeWidth="7"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={dashOffset}
                filter="url(#durantXpGlow)"
                className="transition-all duration-1000 ease-out"
              />
            </svg>

            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-black text-white">{format(progress)}%</span>
              <span className="mt-1 text-[9px] font-bold tracking-[0.18em] text-blue-200/70">
                {isArabic ? "التقدم" : "PROGRESS"}
              </span>
            </div>
            <div className="absolute -end-0.5 top-3 flex h-7 w-7 items-center justify-center rounded-full border border-[#101a35] bg-gradient-to-br from-cyan-300 to-blue-500 text-xs text-white shadow-lg">
              ✦
            </div>
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full border border-blue-400/20 bg-blue-400/10 px-3 py-1 text-[9px] font-black tracking-wider text-blue-200">
                {isArabic ? "رحلة المستوى" : "LEVEL JOURNEY"}
              </span>
              <span className="rounded-full border border-amber-400/20 bg-amber-400/10 px-3 py-1 text-[9px] font-black text-amber-200">
                ⭐ {isArabic ? `المستوى ${format(studentLevel)}` : `LEVEL ${format(studentLevel)}`}
              </span>
            </div>

            <h4 className="mt-3 text-base font-black leading-7 sm:text-lg">
              {isArabic ? "أنت تصنع تقدمك بنفسك!" : "You're building your own progress!"}
            </h4>
            <p className="mt-1 text-[11px] leading-6 text-slate-400">
              {isArabic
                ? "واصل رحلتك التعليمية واجمع نقاط الخبرة للوصول إلى المستوى التالي."
                : "Continue your learning journey and collect XP to reach the next level."}
            </p>

            <div className="mt-4 grid grid-cols-2 gap-2">
              <div className="rounded-xl border border-white/10 bg-white/[0.05] p-3">
                <p className="text-[9px] font-bold tracking-wider text-slate-400">
                  {isArabic ? "إجمالي الخبرة" : "TOTAL EXPERIENCE"}
                </p>
                <p className="mt-1 text-xl font-black text-white">
                  {format(xpPoints)} <span className="text-[10px] text-cyan-300">XP</span>
                </p>
              </div>
              <div className="rounded-xl border border-violet-400/15 bg-violet-400/[0.07] p-3">
                <p className="text-[9px] font-bold tracking-wider text-slate-400">
                  {isArabic ? "المتبقي للتقدم" : "XP REMAINING"}
                </p>
                <p className="mt-1 text-xl font-black text-white">
                  {format(remaining)} <span className="text-[10px] text-violet-300">XP</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 border-t border-white/10 pt-4">
          <div className="mb-2 flex items-center justify-between gap-2 text-[9px] font-bold tracking-wider text-slate-400">
            <span>{isArabic ? "تقدمك نحو المستوى التالي" : "NEXT LEVEL PROGRESS"}</span>
            <span className="text-cyan-300">{format(progress)} / 100</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-white/10">
            <div
              className="relative h-full rounded-full bg-gradient-to-r from-cyan-300 via-blue-400 to-violet-400 transition-all duration-1000 ease-out"
              style={{ width: `${progress}%` }}
            >
              <div className="absolute inset-0 animate-pulse bg-white/20" />
            </div>
          </div>
          <div className="mt-3 flex items-center justify-between text-[9px] text-slate-500">
            <span>{isArabic ? "استمر، أنت تتقدم!" : "Keep going, you're progressing!"}</span>
            <span className="font-bold text-blue-200">DURANT XP SYSTEM</span>
          </div>
        </div>
      </div>
    </div>
  );
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

  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [earnedAchievementIds, setEarnedAchievementIds] = useState<string[]>([]);
  const [studentId, setStudentId] = useState("");

  const [search, setSearch] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [notificationsLoading, setNotificationsLoading] = useState(false);
  const [notificationsError, setNotificationsError] = useState("");
  const [markingNotificationId, setMarkingNotificationId] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function loadStudent() {
      try {
        const { data: authData, error: authError } = await supabase.auth.getUser();

        if (!active) return;

        if (authError || !authData.user) {
          router.replace("/login");
          return;
        }

        const currentStudentId = authData.user.id;
        setStudentId(currentStudentId);

        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("full_name, grade, gold_coins, xp_points, student_level")
          .eq("id", currentStudentId)
          .maybeSingle();

        if (!active) return;

        if (profileError || !profile) {
          setLoadError("تعذر تحميل بيانات حسابك. حاول تحديث الصفحة.");
          setLoading(false);
          return;
        }

        setStudentName(profile.full_name || "طالب ديورانت");
        setGoldCoins(Number(profile.gold_coins ?? 0));
        setXpPoints(Number(profile.xp_points ?? 0));
        setStudentLevel(Number(profile.student_level ?? 1));

        const studentGrade =
          profile.grade && gradeNames[profile.grade] ? profile.grade : "";

        setGradeSlug(studentGrade);

        const [achievementResult, earnedResult] = await Promise.all([
          supabase
            .from("achievements")
            .select("id, code, name_ar, name_en, description_ar, description_en, icon, xp_reward")
            .order("xp_reward", { ascending: true }),

          supabase
            .from("student_achievements")
            .select("achievement_id")
            .eq("student_id", currentStudentId),
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

        setLoading(false);
      } catch {
        if (!active) return;
        setLoadError("حدث خطأ أثناء تحميل بياناتك. حاول تحديث الصفحة.");
        setLoading(false);
      }
    }

    loadStudent();

    return () => {
      active = false;
    };
  }, [router]);

  const searchItems = [
    {
      title: t("الرئيسية", "Home"),
      description: t("لوحة التحكم الرئيسية", "Main dashboard"),
      href: "/dashboard",
      keywords: "home dashboard الرئيسية",
    },
    {
      title: t("الصفوف الدراسية", "School Grades"),
      description: t("موادك ومحتوى صفك الدراسي", "Your grade and subjects"),
      href: gradeSlug ? `/grades/${gradeSlug}` : "/dashboard#grades",
      keywords: "grades subjects الصفوف المواد الدروس",
    },
    {
      title: t("الملف الشخصي", "Profile"),
      description: t("بيانات حسابك الشخصي", "Your account information"),
      href: "/profile",
      keywords: "profile account الملف الشخصي حساب",
    },
    {
      title: t("الإعدادات", "Settings"),
      description: t("إعدادات المنصة والحساب", "Platform and account settings"),
      href: "/settings",
      keywords: "settings preferences الإعدادات",
    },
  ];

  const searchResults = search.trim()
    ? searchItems.filter((item) =>
        `${item.title} ${item.description} ${item.keywords}`
          .toLowerCase()
          .includes(search.trim().toLowerCase())
      )
    : [];

  async function loadNotifications(currentStudentId = studentId) {
    if (!currentStudentId) return;

    setNotificationsLoading(true);
    setNotificationsError("");

    const { data, error } = await supabase
      .from("notifications")
      .select("id, title_ar, title_en, message_ar, message_en, type, action_url, is_read, created_at")
      .eq("student_id", currentStudentId)
      .order("created_at", { ascending: false })
      .limit(20);

    if (error) {
      setNotificationsError(
        t("تعذر تحميل الإشعارات حاليًا.", "Could not load notifications.")
      );
    } else {
      setNotifications((data ?? []) as NotificationItem[]);
    }

    setNotificationsLoading(false);
  }

  useEffect(() => {
    if (!studentId) return;

    loadNotifications(studentId);

    const channel = supabase
      .channel(`dashboard-notifications-${studentId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "notifications",
          filter: `student_id=eq.${studentId}`,
        },
        () => loadNotifications(studentId)
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [studentId]);

  async function markNotificationAsRead(notification: NotificationItem) {
    if (notification.is_read || markingNotificationId) return true;

    setMarkingNotificationId(notification.id);

    const { data, error } = await supabase.rpc("mark_notification_read", {
      p_notification_id: notification.id,
    });

    setMarkingNotificationId(null);

    if (error || data !== true) {
      setNotificationsError(t("تعذر تحديث الإشعار.", "Could not update this notification."));
      return false;
    }

    setNotifications((current) =>
      current.map((item) =>
        item.id === notification.id ? { ...item, is_read: true } : item
      )
    );

    return true;
  }

  async function openNotification(notification: NotificationItem) {
    const updated = await markNotificationAsRead(notification);
    if (!updated) return;

    setNotificationsOpen(false);

    const destination = notification.action_url;

    if (
      destination &&
      destination.startsWith("/") &&
      !destination.startsWith("//")
    ) {
      router.push(destination);
    }
  }

  const unreadNotifications = notifications.filter((item) => !item.is_read).length;

  if (!languageReady || loading) {
    return (
      <main
        dir={direction}
        className="flex min-h-screen items-center justify-center bg-[#f1f3fb] px-4"
      >
        <div className="text-center">
          <div className="relative mx-auto flex h-20 w-20 items-center justify-center rounded-[26px] bg-[#17213d] text-4xl font-black text-amber-400 shadow-2xl shadow-blue-950/20">
            D
            <span className="absolute -end-1 -top-1 h-5 w-5 animate-ping rounded-full bg-amber-400/60" />
          </div>
          <h1 className="mt-4 text-3xl font-black tracking-[0.25em] text-[#17213d]">
            DURANT
          </h1>
          <p className="mt-3 text-sm text-slate-500">
            {t("جاري تجهيز عالمك التعليمي...", "Preparing your learning world...")}
          </p>
          <div className="mx-auto mt-5 h-1.5 w-40 overflow-hidden rounded-full bg-slate-200">
            <div className="h-full w-1/2 animate-pulse rounded-full bg-gradient-to-r from-blue-500 to-violet-500" />
          </div>
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
          tag: t("رحلة استكشاف", "Explore the world"),
          symbol: "01",
        },
      ]
    : [
        {
          title: t("التاريخ", "History"),
          subtitle: t("الأحداث والحضارات والشخصيات", "Events, civilizations and people"),
          icon: "🏛️",
          visual: "from-amber-300 via-orange-400 to-[#17213d]",
          tag: t("اكتشف الماضي", "Discover the past"),
          symbol: "01",
        },
        {
          title: t("الجغرافيا", "Geography"),
          subtitle: t("الموقع والسكان والبيئة والعالم", "Places, people and the world"),
          icon: "🌍",
          visual: "from-sky-300 via-blue-500 to-[#17213d]",
          tag: t("اكتشف العالم", "Explore the world"),
          symbol: "02",
        },
      ];

  const earnedCount = earnedAchievementIds.length;
  const lockedCount = Math.max(0, achievements.length - earnedCount);

  return (
    <main
      dir={direction}
      className="flex min-h-screen min-w-0 flex-col bg-[#f2f4fa] text-[#17213d] lg:flex-row lg:ps-72"
    >
      <StudentSidebar />

      <section className="min-w-0 w-full flex-1 px-3 pb-8 pt-20 sm:px-5 sm:pb-10 md:px-6 md:py-7 lg:px-7 xl:px-9">
        <div className="mx-auto w-full min-w-0 max-w-[1540px]">

          {/* TOP BAR */}
          <header className="mb-6 flex min-w-0 flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="order-2 flex w-full min-w-0 flex-1 items-center gap-3 sm:order-1 sm:max-w-[560px]">
              <div className="relative min-w-0 flex-1">
                <div className="flex min-h-12 items-center gap-3 rounded-2xl border border-[#e4e8f3] bg-white px-4 shadow-sm transition focus-within:border-blue-300 focus-within:shadow-md">
                  <span className="text-xl text-blue-500">⌕</span>
                  <input
                    type="search"
                    value={search}
                    onChange={(event) => {
                      setSearch(event.target.value);
                      setSearchOpen(true);
                    }}
                    onFocus={() => setSearchOpen(true)}
                    onKeyDown={(event) => {
                      if (event.key === "Escape") setSearchOpen(false);
                      if (event.key === "Enter" && searchResults[0]) {
                        router.push(searchResults[0].href);
                        setSearch("");
                        setSearchOpen(false);
                      }
                    }}
                    placeholder={t("ابحث في عالم ديورانت...", "Search DURANT...")}
                    aria-label={t("البحث في المنصة", "Search the platform")}
                    className="min-w-0 flex-1 bg-transparent py-3 text-sm text-[#17213d] outline-none placeholder:text-slate-400"
                  />
                  {search && (
                    <button
                      type="button"
                      onClick={() => {
                        setSearch("");
                        setSearchOpen(false);
                      }}
                      aria-label={t("مسح البحث", "Clear search")}
                      className="rounded-lg px-2 py-1 text-slate-400 hover:bg-slate-100"
                    >
                      ✕
                    </button>
                  )}
                  <span className="hidden rounded-lg border border-slate-100 bg-slate-50 px-2 py-1 text-[9px] font-bold text-slate-400 sm:inline">
                    ENTER
                  </span>
                </div>

                {searchOpen && search.trim() && (
                  <>
                    <button
                      type="button"
                      aria-label={t("إغلاق نتائج البحث", "Close search results")}
                      className="fixed inset-0 z-30 cursor-default"
                      onClick={() => setSearchOpen(false)}
                    />
                    <div className="absolute start-0 top-full z-40 mt-2 w-full min-w-[250px] overflow-hidden rounded-2xl border border-[#e5e8f5] bg-white p-2 shadow-2xl">
                      {searchResults.length ? (
                        searchResults.map((item) => (
                          <button
                            key={item.href}
                            type="button"
                            onClick={() => {
                              router.push(item.href);
                              setSearch("");
                              setSearchOpen(false);
                            }}
                            className="flex w-full flex-col rounded-xl px-3 py-3 text-start transition hover:bg-blue-50"
                          >
                            <span className="text-sm font-black text-[#17213d]">{item.title}</span>
                            <span className="mt-1 text-xs text-slate-500">{item.description}</span>
                          </button>
                        ))
                      ) : (
                        <p className="p-4 text-center text-sm text-slate-500">
                          {t("لا توجد نتائج مطابقة.", "No matching results.")}
                        </p>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="order-1 flex min-w-0 items-center justify-between gap-2 sm:order-2 sm:justify-end sm:gap-3">
              <div className="relative shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    setNotificationsOpen((value) => !value);
                    setSearchOpen(false);
                    if (!notificationsOpen) loadNotifications();
                  }}
                  aria-label={t("الإشعارات", "Notifications")}
                  aria-expanded={notificationsOpen}
                  className="relative flex h-11 w-11 items-center justify-center rounded-2xl border border-[#e5e9f4] bg-white text-xl shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                >
                  🔔
                  {unreadNotifications > 0 && (
                    <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-black text-white ring-2 ring-[#f2f4fa]">
                      {unreadNotifications > 99 ? "99+" : unreadNotifications}
                    </span>
                  )}
                </button>

                {notificationsOpen && (
                  <>
                    <button
                      type="button"
                      aria-label={t("إغلاق الإشعارات", "Close notifications")}
                      className="fixed inset-0 z-30 cursor-default"
                      onClick={() => setNotificationsOpen(false)}
                    />
                    <div className="absolute end-0 top-full z-40 mt-3 w-[min(350px,calc(100vw-24px))] overflow-hidden rounded-2xl border border-[#e5e8f5] bg-white shadow-2xl">
                      <div className="flex items-center justify-between border-b border-slate-100 px-4 py-4">
                        <div>
                          <h3 className="font-black text-[#17213d]">{t("الإشعارات", "Notifications")}</h3>
                          <p className="mt-1 text-[10px] text-slate-400">{t("آخر تحديثات حسابك", "Your latest updates")}</p>
                        </div>
                        <span className="rounded-full bg-amber-50 px-2 py-1 text-xs font-bold text-amber-700">
                          {unreadNotifications} {t("غير مقروء", "unread")}
                        </span>
                      </div>

                      <div className="max-h-[360px] overflow-y-auto">
                        {notificationsLoading ? (
                          <p className="p-6 text-center text-sm text-slate-500">
                            {t("جاري تحميل الإشعارات...", "Loading notifications...")}
                          </p>
                        ) : notificationsError ? (
                          <div className="p-5 text-center">
                            <p className="text-sm text-red-500">{notificationsError}</p>
                            <button
                              type="button"
                              onClick={() => loadNotifications()}
                              className="mt-3 text-xs font-bold text-blue-600"
                            >
                              {t("إعادة المحاولة", "Try again")}
                            </button>
                          </div>
                        ) : notifications.length === 0 ? (
                          <div className="p-7 text-center">
                            <span className="text-3xl">🔔</span>
                            <p className="mt-3 text-sm text-slate-500">
                              {t("لا توجد إشعارات حتى الآن.", "No notifications yet.")}
                            </p>
                          </div>
                        ) : (
                          notifications.map((notification) => (
                            <button
                              key={notification.id}
                              type="button"
                              disabled={markingNotificationId === notification.id}
                              onClick={() => openNotification(notification)}
                              className={`flex w-full gap-3 border-b border-slate-50 px-4 py-4 text-start transition hover:bg-blue-50 ${
                                notification.is_read ? "bg-white" : "bg-blue-50/60"
                              }`}
                            >
                              <span className={`mt-1 h-2.5 w-2.5 shrink-0 rounded-full ${notification.is_read ? "bg-slate-200" : "bg-amber-400"}`} />
                              <span className="min-w-0 flex-1">
                                <span className="block text-sm font-black text-[#17213d]">
                                  {isArabic ? notification.title_ar : notification.title_en || notification.title_ar}
                                </span>
                                <span className="mt-1 block text-xs leading-6 text-slate-500">
                                  {isArabic ? notification.message_ar : notification.message_en || notification.message_ar}
                                </span>
                                <span className="mt-2 block text-[10px] text-slate-400">
                                  {new Date(notification.created_at).toLocaleString(locale)}
                                </span>
                              </span>
                              {!notification.is_read && (
                                <span className="shrink-0 self-center text-[10px] font-bold text-blue-600">
                                  {t("جديد", "New")}
                                </span>
                              )}
                            </button>
                          ))
                        )}
                      </div>

                      <div className="border-t border-slate-100 p-3">
                        <button
                          type="button"
                          onClick={() => loadNotifications()}
                          className="w-full rounded-xl bg-slate-50 py-2.5 text-xs font-bold text-[#17213d] transition hover:bg-slate-100"
                        >
                          {t("تحديث الإشعارات", "Refresh notifications")}
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>

              <Link
                href="/profile"
                className="flex min-w-0 max-w-[calc(100%-3.5rem)] items-center gap-2 rounded-2xl border border-transparent px-2 py-1.5 transition hover:border-[#e5e9f4] hover:bg-white sm:gap-3"
              >
                <div className="min-w-0 text-end">
                  <p className="truncate text-xs font-black text-[#17213d] sm:text-sm">
                    {t("مرحبًا", "Hello")} {studentName}
                  </p>
                  <p className="mt-1 truncate text-[10px] text-slate-500 sm:text-xs">{gradeName}</p>
                </div>
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-blue-100 bg-gradient-to-br from-sky-100 to-blue-200 text-2xl shadow-sm">
                  👨🏻‍🎓
                </div>
              </Link>
            </div>
          </header>

          {loadError ? (
            <div className="break-words rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-600">
              {t(loadError, "Unable to load your account data. Please try again.")}
            </div>
          ) : !gradeSlug ? (
            <div className="rounded-[28px] border border-amber-200 bg-white p-6 text-center shadow-sm sm:p-12">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-amber-50 text-5xl">🎓</div>
              <h2 className="mt-5 text-xl font-black">{t("لم يتم تحديد الصف الدراسي", "No Grade Selected")}</h2>
              <p className="mx-auto mt-3 max-w-lg text-sm leading-7 text-slate-500">
                {t("تواصل مع إدارة المنصة لتحديث بيانات صفك الدراسي.", "Contact the platform administration to update your grade.")}
              </p>
            </div>
          ) : (
            <>
              {/* WELCOME / HERO */}
              <section className="relative min-w-0">
                <div className="pointer-events-none absolute -inset-2 -z-10 rounded-[30px] bg-gradient-to-r from-blue-200/40 via-violet-100/50 to-amber-100/40 blur-xl" />
                <div className="min-w-0 overflow-hidden rounded-[24px] shadow-[0_15px_45px_rgba(23,33,61,0.09)]">
                  <DashboardHero
                    gradeName={gradeName}
                    gradeSlug={gradeSlug}
                    isArabic={isArabic}
                  />
                </div>
              </section>

              {/* DASHBOARD INTRO */}
              <section className="mt-6 flex flex-wrap items-end justify-between gap-3">
                <div>
                  <p className="text-[10px] font-black tracking-[0.22em] text-blue-600">
                    {t("مساحتك التعليمية", "YOUR LEARNING SPACE")}
                  </p>
                  <h1 className="mt-1 text-2xl font-black tracking-tight text-[#17213d] sm:text-3xl">
                    {t("لوحة إنجازاتك", "Your Command Center")}
                  </h1>
                  <p className="mt-2 text-xs leading-6 text-slate-500 sm:text-sm">
                    {t("كل شيء يخص رحلتك التعليمية في مكان واحد.", "Everything about your learning journey, all in one place.")}
                  </p>
                </div>
                <div className="flex items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-2">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                  </span>
                  <span className="text-[10px] font-black text-emerald-700">
                    {t("مساحتك جاهزة", "SPACE ACTIVE")}
                  </span>
                </div>
              </section>

              {/* LIVE STATS */}
              <section className="mt-5 grid min-w-0 grid-cols-2 gap-3 xl:grid-cols-4">
                <StatCard
                  icon="🏆"
                  label={t("الإنجازات المكتملة", "Achievements Earned")}
                  value={formatNumber(earnedCount, locale)}
                  detail={t(`${lockedCount} إنجاز متاح للاستكشاف`, `${lockedCount} achievements to explore`)}
                  tone="violet"
                />
                <StatCard
                  icon="📚"
                  label={t("موادك الدراسية", "Your Subjects")}
                  value={formatNumber(subjects.length, locale)}
                  detail={t("محتوى صفك الدراسي", "Your grade content")}
                  tone="green"
                />
                <StatCard
                  icon="⚡"
                  label={t("نقاط الخبرة", "Experience Points")}
                  value={formatNumber(xpPoints, locale)}
                  detail={t(`المستوى ${studentLevel}`, `Level ${studentLevel}`)}
                  tone="blue"
                />
                <StatCard
                  icon="🪙"
                  label={t("رصيدك الذهبي", "Gold Balance")}
                  value={formatNumber(goldCoins, locale)}
                  detail={t("عملاتك الذهبية", "Your gold coins")}
                  tone="gold"
                />
              </section>

              {/* SUBJECTS */}
              <section id="grades" className="mt-7 grid min-w-0 grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1.45fr)_minmax(280px,0.75fr)]">
                <Panel>
                  <SectionTitle
                    eyebrow="EXPLORE YOUR WORLD"
                    title={t("بوابة المواد الدراسية", "Your Learning Worlds")}
                    icon="🧭"
                    isArabic={isArabic}
                    action={
                      <Link
                        href={`/grades/${gradeSlug}`}
                        className="rounded-full border border-blue-100 bg-blue-50 px-3 py-2 text-[10px] font-black text-blue-700 transition hover:bg-blue-100 sm:text-xs"
                      >
                        {t("كل المواد ←", "All Subjects →")}
                      </Link>
                    }
                  />

                  <div className={`grid min-w-0 gap-3 ${subjects.length > 1 ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-1"}`}>
                    {subjects.map((subject) => (
                      <Link
                        key={subject.title}
                        href={`/grades/${gradeSlug}`}
                        className="group relative flex min-h-[245px] min-w-0 flex-col justify-between overflow-hidden rounded-[22px] bg-[#17213d] p-5 text-white shadow-lg transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl"
                      >
                        <div className={`absolute inset-0 bg-gradient-to-br ${subject.visual} opacity-95 transition duration-700 group-hover:scale-110`} />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#101a35] via-[#101a35]/20 to-transparent" />
                        <div className="absolute -end-8 -top-12 h-44 w-44 rounded-full border border-white/10 transition duration-700 group-hover:scale-125" />
                        <div className="absolute -end-2 -top-6 h-32 w-32 rounded-full border border-white/10" />

                        <div className="relative z-10 flex items-start justify-between gap-3">
                          <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-[9px] font-black tracking-wider backdrop-blur-sm">
                            {subject.tag}
                          </span>
                          <span className="text-xs font-black text-white/50">{subject.symbol}</span>
                        </div>

                        <div className="relative z-10 flex flex-1 flex-col items-center justify-center py-3">
                          <div className="flex h-24 w-24 items-center justify-center rounded-[28px] border border-white/20 bg-white/10 text-6xl shadow-2xl backdrop-blur-md transition duration-500 group-hover:rotate-6 group-hover:scale-110">
                            {subject.icon}
                          </div>
                        </div>

                        <div className="relative z-10">
                          <h3 className="text-center text-xl font-black sm:text-2xl">{subject.title}</h3>
                          <p className="mt-1 text-center text-xs leading-6 text-blue-100">{subject.subtitle}</p>
                          <div className="mt-4 flex items-center justify-between rounded-xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur-sm transition group-hover:bg-white/20">
                            <span className="text-xs font-black">{t("ادخل إلى المادة", "Enter Subject")}</span>
                            <span className="text-lg transition-transform group-hover:-translate-x-1">←</span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>

                  {/* XP CHAMPIONS PODIUM - PRESERVED */}
                  <div className="mt-6 border-t border-slate-100 pt-6">
                    <XPPodium
                      gradeSlug={gradeSlug}
                      isArabic={isArabic}
                    />
                  </div>
                </Panel>

                {/* JOURNEY */}
                <Panel className="relative overflow-hidden">
                  <div className="pointer-events-none absolute -end-16 -top-16 h-40 w-40 rounded-full bg-blue-50 blur-3xl" />
                  <div className="relative">
                    <SectionTitle
                      eyebrow="YOUR JOURNEY"
                      title={t("خريطة رحلتك", "Your Journey")}
                      icon="🗺️"
                      isArabic={isArabic}
                    />

                    <div className="relative space-y-5">
                      <div className="absolute bottom-5 start-[17px] top-5 w-px bg-gradient-to-b from-emerald-300 via-blue-200 to-amber-200" />

                      <div className="relative flex gap-3">
                        <div className="z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-emerald-100 bg-emerald-50 text-sm text-emerald-600">✓</div>
                        <div className="min-w-0 pt-1">
                          <p className="text-xs font-black">{t("حسابك التعليمي", "Your Student Account")}</p>
                          <p className="mt-1 text-[10px] leading-5 text-slate-400">{t("تم تحميل بيانات حسابك بنجاح.", "Your account data has loaded.")}</p>
                        </div>
                        <span className="ms-auto shrink-0 rounded-full bg-emerald-50 px-2 py-1 text-[9px] font-black text-emerald-600">{t("جاهز", "READY")}</span>
                      </div>

                      <div className="relative flex gap-3">
                        <div className="z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-blue-100 bg-blue-50 text-sm text-blue-600">📚</div>
                        <div className="min-w-0 pt-1">
                          <p className="text-xs font-black">{t("عالم المواد", "Your Subjects")}</p>
                          <p className="mt-1 text-[10px] leading-5 text-slate-400">{formatNumber(subjects.length, locale)} {t("مواد متاحة في صفك.", "subjects available in your grade.")}</p>
                        </div>
                        <span className="ms-auto shrink-0 rounded-full bg-blue-50 px-2 py-1 text-[9px] font-black text-blue-600">{t("متاح", "OPEN")}</span>
                      </div>

                      <div className="relative flex gap-3">
                        <div className="z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-amber-100 bg-amber-50 text-sm text-amber-600">⭐</div>
                        <div className="min-w-0 pt-1">
                          <p className="text-xs font-black">{t("مستواك الحالي", "Your Current Level")}</p>
                          <p className="mt-1 text-[10px] leading-5 text-slate-400">{t(`المستوى ${studentLevel} · ${formatNumber(xpPoints, locale)} نقطة خبرة`, `Level ${studentLevel} · ${formatNumber(xpPoints, locale)} XP`)}</p>
                        </div>
                        <span className="ms-auto shrink-0 rounded-full bg-amber-50 px-2 py-1 text-[9px] font-black text-amber-700">{t("مستمر", "ACTIVE")}</span>
                      </div>
                    </div>

                    <XPProgressCard
                      xpPoints={xpPoints}
                      studentLevel={studentLevel}
                      xpProgress={xpProgress}
                      locale={locale}
                      isArabic={isArabic}
                    />
                  </div>
                </Panel>
              </section>

              {/* ACHIEVEMENTS + WALLET */}
              <section className="mt-5 grid min-w-0 grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1.4fr)_minmax(280px,0.7fr)]">
                <Panel>
                  <SectionTitle
                    eyebrow="YOUR TROPHY ROOM"
                    title={t("قاعة إنجازاتك", "Your Trophy Room")}
                    icon="🏆"
                    isArabic={isArabic}
                    action={
                      <span className="rounded-full bg-amber-50 px-3 py-2 text-[10px] font-black text-amber-700">
                        {formatNumber(earnedCount, locale)} / {formatNumber(achievements.length, locale)}
                      </span>
                    }
                  />

                  {achievements.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-7 text-center">
                      <span className="text-3xl">🏅</span>
                      <p className="mt-3 text-sm text-slate-500">
                        {t("لا توجد إنجازات متاحة حاليًا.", "No achievements available yet.")}
                      </p>
                    </div>
                  ) : (
                    <>
                      <div className="mb-4 flex items-center justify-between gap-3">
                        <p className="text-[10px] text-slate-400">
                          {t("إنجازات حصلت عليها وإنجازات تنتظرك.", "Achievements earned and waiting for you.")}
                        </p>
                        <span className="text-[10px] font-black text-emerald-600">
                          {achievements.length ? Math.round((earnedCount / achievements.length) * 100) : 0}%
                        </span>
                      </div>
                      <div className="mb-5 h-2 overflow-hidden rounded-full bg-slate-100">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-amber-300 to-orange-400 transition-all duration-700"
                          style={{ width: `${achievements.length ? Math.min(100, (earnedCount / achievements.length) * 100) : 0}%` }}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2 min-[480px]:grid-cols-3 sm:grid-cols-4">
                        {achievements.map((achievement) => {
                          const earned = earnedAchievementIds.includes(achievement.id);
                          return (
                            <div
                              key={achievement.id}
                              title={isArabic ? achievement.description_ar : achievement.description_en}
                              className={`group relative min-w-0 overflow-hidden rounded-2xl border p-3 text-center transition-all duration-300 hover:-translate-y-1 ${
                                earned
                                  ? "border-amber-200 bg-gradient-to-b from-amber-50 to-white shadow-sm"
                                  : "border-slate-100 bg-slate-50/80 opacity-70 hover:opacity-100"
                              }`}
                            >
                              {earned && <div className="absolute -end-5 -top-5 h-12 w-12 rounded-full bg-amber-200/40 blur-xl" />}
                              <div className={`relative mx-auto flex h-14 w-14 items-center justify-center rounded-2xl text-3xl transition duration-300 group-hover:scale-110 ${earned ? "bg-white shadow-sm" : "bg-slate-100 grayscale"}`}>
                                {achievement.icon}
                              </div>
                              <p className="relative mt-3 line-clamp-2 break-words text-[10px] font-black leading-5 text-[#17213d] sm:text-xs">
                                {isArabic ? achievement.name_ar : achievement.name_en}
                              </p>
                              <p className={`relative mt-2 text-[9px] font-black ${earned ? "text-emerald-600" : "text-slate-400"}`}>
                                {earned ? t("✓ مكتسب", "✓ Earned") : t("🔒 لم يكتسب بعد", "🔒 Locked")}
                              </p>
                            </div>
                          );
                        })}
                      </div>
                    </>
                  )}
                </Panel>

                <Panel className="relative overflow-hidden">
                  <div className="pointer-events-none absolute -end-16 -top-16 h-48 w-48 rounded-full bg-amber-100/70 blur-3xl" />
                  <div className="relative">
                    <SectionTitle
                      eyebrow="DURANT GOLD WALLET"
                      title={t("خزنتك الذهبية", "Gold Vault")}
                      icon="🪙"
                      isArabic={isArabic}
                    />

                    <div className="relative overflow-hidden rounded-[22px] border border-amber-200 bg-gradient-to-br from-[#fff9e9] via-[#fffdf6] to-[#fff1cf] p-5 text-center">
                      <div className="absolute -end-8 -top-8 h-28 w-28 rounded-full border border-amber-300/40" />
                      <div className="absolute -end-3 -top-3 h-16 w-16 rounded-full border border-amber-300/30" />
                      <div className="relative mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-amber-200 bg-white/80 text-5xl shadow-[0_8px_25px_rgba(180,120,20,0.12)]">
                        🪙
                      </div>
                      <p className="relative mt-4 text-[10px] font-black tracking-[0.2em] text-amber-700">
                        {t("إجمالي رصيدك", "TOTAL BALANCE")}
                      </p>
                      <p className="relative mt-1 text-4xl font-black tracking-tight text-[#17213d]">
                        {formatNumber(goldCoins, locale)}
                      </p>
                      <p className="relative mt-2 text-xs font-bold text-amber-700">
                        {t("عملة ذهبية", "Gold Coins")}
                      </p>
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-2">
                      <div className="rounded-2xl border border-slate-100 bg-slate-50 p-3">
                        <p className="text-[9px] font-bold text-slate-400">{t("مستواك", "LEVEL")}</p>
                        <p className="mt-1 text-xl font-black text-[#17213d]">{formatNumber(studentLevel, locale)}</p>
                      </div>
                      <div className="rounded-2xl border border-slate-100 bg-slate-50 p-3">
                        <p className="text-[9px] font-bold text-slate-400">{t("نقاط الخبرة", "EXPERIENCE")}</p>
                        <p className="mt-1 text-xl font-black text-[#17213d]">{formatNumber(xpPoints, locale)} <span className="text-[9px] text-blue-600">XP</span></p>
                      </div>
                    </div>
                    <p className="mt-4 text-center text-[10px] leading-6 text-slate-400">
                      {t("اجمع العملات من خلال إنجازاتك التعليمية.", "Collect coins through your learning achievements.")}
                    </p>
                  </div>
                </Panel>
              </section>

              {/* DURANT CHALLENGE PORTAL */}
              <section className="mt-5">
                <DurantChallengePortal
                  gradeSlug={gradeSlug}
                  gradeName={gradeName}
                  isArabic={isArabic}
                />
              </section>

              {/* LEARNING CENTER */}
              <section className="mt-6">
                <SectionTitle
                  eyebrow="YOUR LEARNING TOOLS"
                  title={t("مركز التعلم", "Learning Center")}
                  icon="🎓"
                  isArabic={isArabic}
                />

                <div className="grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
                  <Link
                    href={`/grades/${gradeSlug}`}
                    className="group relative min-w-0 overflow-hidden rounded-[22px] border border-blue-100 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                  >
                    <div className="absolute -end-8 -top-8 h-28 w-28 rounded-full bg-blue-50 transition-transform duration-500 group-hover:scale-150" />
                    <div className="relative">
                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-3xl transition group-hover:rotate-6">📚</div>
                      <h3 className="mt-4 text-base font-black">{t("الوحدات والدروس", "Units & Lessons")}</h3>
                      <p className="mt-2 text-xs leading-6 text-slate-500">
                        {t("ادخل إلى محتوى صفك واستكشف دروسك التعليمية.", "Explore your grade content and lessons.")}
                      </p>
                      <span className="mt-4 inline-flex items-center gap-2 text-[10px] font-black text-blue-600">
                        {t("استكشف الدروس", "Explore Lessons")} <span>←</span>
                      </span>
                    </div>
                  </Link>

                  <div className="relative min-w-0 overflow-hidden rounded-[22px] border border-violet-100 bg-white p-5 shadow-sm">
                    <div className="absolute -end-8 -top-8 h-28 w-28 rounded-full bg-violet-50" />
                    <div className="relative">
                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-50 text-3xl">📝</div>
                      <h3 className="mt-4 text-base font-black">{t("الامتحانات", "Exams")}</h3>
                      <p className="mt-2 text-xs leading-6 text-slate-500">
                        {t("اختبر معلوماتك وتابع تقييم مستواك الدراسي.", "Test your knowledge and track your academic progress.")}
                      </p>
                      <span className="mt-4 inline-flex rounded-full border border-violet-100 bg-violet-50 px-3 py-1.5 text-[9px] font-black text-violet-600">
                        {t("قيد التطوير", "COMING SOON")}
                      </span>
                    </div>
                  </div>

                  <div className="relative min-w-0 overflow-hidden rounded-[22px] border border-emerald-100 bg-white p-5 shadow-sm sm:col-span-2 xl:col-span-1">
                    <div className="absolute -end-8 -top-8 h-28 w-28 rounded-full bg-emerald-50" />
                    <div className="relative">
                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-3xl">🤖</div>
                      <h3 className="mt-4 text-base font-black">{t("مساعد ديورانت الذكي", "DURANT AI Assistant")}</h3>
                      <p className="mt-2 text-xs leading-6 text-slate-500">
                        {t("مساعدك لفهم الدروس والتدرب على المعلومات.", "Your assistant for understanding lessons and practicing.")}
                      </p>
                      <span className="mt-4 inline-flex rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1.5 text-[9px] font-black text-emerald-600">
                        {t("قيد التطوير", "COMING SOON")}
                      </span>
                    </div>
                  </div>
                </div>
              </section>
            </>
          )}

          {/* FOOTER */}
          <footer className="mt-9 border-t border-[#e1e5f1] pt-6 text-center">
            <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-[#17213d] text-xl font-black text-amber-400 shadow-md">
              D
            </div>
            <p className="mt-3 font-black tracking-[0.3em] text-[#17213d]">DURANT</p>
            <p className="mt-2 text-[10px] text-slate-400 sm:text-xs">
              {t(
                "منصة ديورانت التعليمية — جميع الحقوق محفوظة",
                "DURANT Educational Platform — All Rights Reserved"
              )}
            </p>
            <p className="mt-2 text-[9px] font-bold tracking-widest text-slate-300">
              LEARN • ACHIEVE • EVOLVE
            </p>
          </footer>
        </div>
      </section>
    </main>
  );
}
