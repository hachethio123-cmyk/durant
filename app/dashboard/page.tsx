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
        const { data: authData, error: authError } =
          await supabase.auth.getUser();

        if (!active) return;

        if (authError || !authData.user) {
          router.replace("/login");
          return;
        }

        const studentId = authData.user.id;
        setStudentId(studentId);

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
      setNotificationsError(t("تعذر تحميل الإشعارات حاليًا.", "Could not load notifications."));
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
      current.map((item) => item.id === notification.id ? { ...item, is_read: true } : item)
    );
    return true;
  }

  async function openNotification(notification: NotificationItem) {
    const updated = await markNotificationAsRead(notification);
    if (!updated) return;

    setNotificationsOpen(false);
    const destination = notification.action_url;
    if (destination && destination.startsWith("/") && !destination.startsWith("//")) {
      router.push(destination);
    }
  }

  const unreadNotifications = notifications.filter((item) => !item.is_read).length;

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
            <div className="order-2 flex w-full min-w-0 flex-1 items-center gap-3 sm:order-1 sm:max-w-[520px]">
              <div className="relative min-w-0 flex-1">
                <div className="flex min-h-11 items-center gap-3 rounded-full border border-[#e2e6f5] bg-white px-4 py-3 shadow-sm sm:px-5">
                  <span className="shrink-0 text-xl text-slate-400">⌕</span>
                  <input
                    type="search"
                    value={search}
                    onChange={(event) => { setSearch(event.target.value); setSearchOpen(true); }}
                    onFocus={() => setSearchOpen(true)}
                    onKeyDown={(event) => {
                      if (event.key === "Escape") setSearchOpen(false);
                      if (event.key === "Enter" && searchResults[0]) {
                        router.push(searchResults[0].href);
                        setSearch("");
                        setSearchOpen(false);
                      }
                    }}
                    placeholder={t("ابحث عن أي محتوى...", "Search for any content...")}
                    aria-label={t("البحث في المنصة", "Search the platform")}
                    className="min-w-0 flex-1 bg-transparent text-sm text-[#17213d] outline-none placeholder:text-slate-400"
                  />
                  {search && <button type="button" onClick={() => { setSearch(""); setSearchOpen(false); }} aria-label={t("مسح البحث", "Clear search")} className="text-slate-400">✕</button>}
                </div>
                {searchOpen && search.trim() && (
                  <>
                    <button type="button" aria-label={t("إغلاق نتائج البحث", "Close search results")} className="fixed inset-0 z-30 cursor-default" onClick={() => setSearchOpen(false)} />
                    <div className="absolute start-0 top-full z-40 mt-2 w-full min-w-[250px] overflow-hidden rounded-2xl border border-[#e5e8f5] bg-white p-2 shadow-xl">
                      {searchResults.length ? searchResults.map((item) => (
                        <button key={item.href} type="button" onClick={() => { router.push(item.href); setSearch(""); setSearchOpen(false); }} className="flex w-full flex-col rounded-xl px-3 py-3 text-start transition hover:bg-blue-50">
                          <span className="text-sm font-black text-[#17213d]">{item.title}</span>
                          <span className="mt-1 text-xs text-slate-500">{item.description}</span>
                        </button>
                      )) : <p className="p-4 text-center text-sm text-slate-500">{t("لا توجد نتائج مطابقة.", "No matching results.")}</p>}
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="order-1 flex min-w-0 items-center justify-between gap-2 sm:order-2 sm:justify-end sm:gap-3">
              <div className="relative shrink-0">
                <button type="button" onClick={() => { setNotificationsOpen((value) => !value); setSearchOpen(false); if (!notificationsOpen) loadNotifications(); }} aria-label={t("الإشعارات", "Notifications")} aria-expanded={notificationsOpen} className="relative flex h-10 w-10 items-center justify-center rounded-full bg-white text-xl shadow-sm transition hover:bg-amber-50 sm:h-11 sm:w-11">
                  🔔
                  {unreadNotifications > 0 && <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-black text-white">{unreadNotifications > 99 ? "99+" : unreadNotifications}</span>}
                </button>
                {notificationsOpen && (
                  <>
                    <button type="button" aria-label={t("إغلاق الإشعارات", "Close notifications")} className="fixed inset-0 z-30 cursor-default" onClick={() => setNotificationsOpen(false)} />
                    <div className="absolute end-0 top-full z-40 mt-3 w-[min(350px,calc(100vw-24px))] overflow-hidden rounded-2xl border border-[#e5e8f5] bg-white shadow-2xl">
                      <div className="flex items-center justify-between border-b border-slate-100 px-4 py-4">
                        <h3 className="font-black text-[#17213d]">{t("الإشعارات", "Notifications")}</h3>
                        <span className="rounded-full bg-amber-50 px-2 py-1 text-xs font-bold text-amber-700">{unreadNotifications} {t("غير مقروء", "unread")}</span>
                      </div>
                      <div className="max-h-[360px] overflow-y-auto">
                        {notificationsLoading ? <p className="p-6 text-center text-sm text-slate-500">{t("جاري تحميل الإشعارات...", "Loading notifications...")}</p>
                        : notificationsError ? <div className="p-5 text-center"><p className="text-sm text-red-500">{notificationsError}</p><button type="button" onClick={() => loadNotifications()} className="mt-3 text-xs font-bold text-blue-600">{t("إعادة المحاولة", "Try again")}</button></div>
                        : notifications.length === 0 ? <p className="p-6 text-center text-sm text-slate-500">{t("لا توجد إشعارات حتى الآن.", "No notifications yet.")}</p>
                        : notifications.map((notification) => (
                          <button key={notification.id} type="button" disabled={markingNotificationId === notification.id} onClick={() => openNotification(notification)} className={`flex w-full gap-3 border-b border-slate-50 px-4 py-4 text-start transition hover:bg-blue-50 ${notification.is_read ? "bg-white" : "bg-blue-50/60"}`}>
                            <span className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-amber-400" />
                            <span className="min-w-0 flex-1">
                              <span className="block text-sm font-black text-[#17213d]">{isArabic ? notification.title_ar : notification.title_en || notification.title_ar}</span>
                              <span className="mt-1 block text-xs leading-6 text-slate-500">{isArabic ? notification.message_ar : notification.message_en || notification.message_ar}</span>
                              <span className="mt-2 block text-[10px] text-slate-400">{new Date(notification.created_at).toLocaleString(locale)}</span>
                            </span>
                            {!notification.is_read && <span className="shrink-0 self-center text-[10px] font-bold text-blue-600">{t("جديد", "New")}</span>}
                          </button>
                        ))}
                      </div>
                      <div className="border-t border-slate-100 p-3"><button type="button" onClick={() => loadNotifications()} className="w-full rounded-xl bg-slate-50 py-2.5 text-xs font-bold text-[#17213d] transition hover:bg-slate-100">{t("تحديث الإشعارات", "Refresh notifications")}</button></div>
                    </div>
                  </>
                )}
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
              {/* Main hero: full width, matching the approved reference */}
              <section className="min-w-0">
                <div className="min-w-0 overflow-hidden rounded-2xl">
                  <DashboardHero
                    gradeName={gradeName}
                    gradeSlug={gradeSlug}
                    isArabic={isArabic}
                  />
                </div>
              </section>

              {/* Four compact summary cards */}
              <section className="mt-4 grid min-w-0 grid-cols-2 gap-2.5 sm:mt-5 sm:gap-3 xl:grid-cols-4">
                <div className="flex min-w-0 items-center gap-2.5 rounded-xl border border-[#e5e8f5] bg-white px-3 py-3 shadow-sm sm:gap-3 sm:px-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-100 text-xl sm:h-11 sm:w-11 sm:text-2xl">🏆</div>
                  <div className="min-w-0">
                    <p className="text-base font-black sm:text-lg">{formatNumber(earnedCount, locale)}</p>
                    <p className="truncate text-[10px] text-slate-500 sm:text-xs">{t("إنجاز مكتمل", "Achievements")}</p>
                  </div>
                  <span className="ms-auto hidden shrink-0 rounded-full bg-emerald-50 px-2 py-1 text-[9px] font-bold text-emerald-600 sm:inline">+{formatNumber(earnedCount, locale)}</span>
                </div>

                <div className="flex min-w-0 items-center gap-2.5 rounded-xl border border-[#e5e8f5] bg-white px-3 py-3 shadow-sm sm:gap-3 sm:px-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-xl sm:h-11 sm:w-11 sm:text-2xl">📗</div>
                  <div className="min-w-0">
                    <p className="text-base font-black sm:text-lg">{formatNumber(subjects.length, locale)}</p>
                    <p className="truncate text-[10px] text-slate-500 sm:text-xs">{t("مواد دراسية", "Subjects")}</p>
                  </div>
                  <span className="ms-auto hidden shrink-0 rounded-full bg-emerald-50 px-2 py-1 text-[9px] font-bold text-emerald-600 sm:inline">+{formatNumber(subjects.length, locale)}</span>
                </div>

                <div className="flex min-w-0 items-center gap-2.5 rounded-xl border border-[#e5e8f5] bg-white px-3 py-3 shadow-sm sm:gap-3 sm:px-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-xl sm:h-11 sm:w-11 sm:text-2xl">⭐</div>
                  <div className="min-w-0">
                    <p className="text-base font-black sm:text-lg">{formatNumber(xpPoints, locale)}</p>
                    <p className="truncate text-[10px] text-slate-500 sm:text-xs">{t("نقاط الخبرة", "Experience")}</p>
                  </div>
                  <span className="ms-auto hidden shrink-0 rounded-full bg-blue-50 px-2 py-1 text-[9px] font-bold text-blue-600 sm:inline">XP</span>
                </div>

                <div className="flex min-w-0 items-center gap-2.5 rounded-xl border border-amber-100 bg-[#fffdfa] px-3 py-3 shadow-sm sm:gap-3 sm:px-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-xl sm:h-11 sm:w-11 sm:text-2xl">🪙</div>
                  <div className="min-w-0">
                    <p className="text-base font-black sm:text-lg">{formatNumber(goldCoins, locale)}</p>
                    <p className="truncate text-[10px] text-slate-500 sm:text-xs">{t("عملة ذهبية", "Gold Coins")}</p>
                  </div>
                </div>
              </section>

              {/* Subjects and learning checklist area */}
              <section id="grades" className="mt-5 grid min-w-0 grid-cols-1 gap-4 sm:mt-6 xl:grid-cols-[minmax(0,1.35fr)_minmax(280px,0.85fr)]">
                <div className="min-w-0 rounded-2xl border border-[#e5e8f5] bg-white p-3.5 sm:p-5">
                  <SectionTitle
                    eyebrow="YOUR SUBJECTS"
                    title={t("موادك الدراسية", "Your Subjects")}
                    icon="📚"
                    action={<Link href={`/grades/${gradeSlug}`} className="text-[10px] font-bold text-blue-600 hover:text-blue-800 sm:text-xs">{t("عرض الكل ←", "View All →")}</Link>}
                  />
                  <div className={`grid min-w-0 gap-3 ${subjects.length > 1 ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-1 sm:max-w-[360px]"}`}>
                    {subjects.map((subject) => (
                      <Link key={subject.title} href={`/grades/${gradeSlug}`} className="group relative flex min-h-[190px] min-w-0 flex-col justify-end overflow-hidden rounded-xl bg-[#17213d] p-4 text-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg sm:min-h-[210px]">
                        <div className={`absolute inset-0 bg-gradient-to-br ${subject.visual} opacity-95 transition group-hover:scale-105`} />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#101a35] via-[#101a35]/20 to-transparent" />
                        <div className="relative z-10 mb-auto flex h-20 items-center justify-center text-6xl drop-shadow-xl sm:h-24 sm:text-7xl">{subject.icon}</div>
                        <div className="relative z-10 min-w-0 text-center">
                          <h3 className="break-words text-lg font-black sm:text-xl">{subject.title}</h3>
                          <p className="mt-1 break-words text-xs leading-6 text-blue-100">{subject.subtitle}</p>
                          <span className="mx-auto mt-3 inline-flex max-w-full rounded-full bg-white/10 px-5 py-2 text-xs font-bold">{t("ابدأ التعلم ←", "Start Learning →")}</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>

                <div className="min-w-0 rounded-2xl border border-[#e5e8f5] bg-white p-4 sm:p-5">
                  <SectionTitle eyebrow="YOUR DAILY PROGRESS" title={t("رحلتك التعليمية", "Your Learning Journey")} icon="📋" />
                  <div className="space-y-4">
                    <div className="flex items-center justify-between gap-3 border-b border-slate-100 pb-3">
                      <div className="flex min-w-0 items-center gap-3">
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-100 font-black text-emerald-600">✓</span>
                        <div className="min-w-0"><p className="text-xs font-bold sm:text-sm">{t("حسابك جاهز للتعلم", "Your account is ready")}</p><p className="mt-1 text-[10px] text-slate-400">{t("يمكنك استكشاف مواد صفك", "Explore your grade subjects")}</p></div>
                      </div>
                      <span className="shrink-0 text-emerald-600">✓</span>
                    </div>
                    <div className="flex items-center justify-between gap-3 border-b border-slate-100 pb-3">
                      <div className="flex min-w-0 items-center gap-3">
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600">📚</span>
                        <div className="min-w-0"><p className="text-xs font-bold sm:text-sm">{t("المواد الدراسية", "School Subjects")}</p><p className="mt-1 text-[10px] text-slate-400">{formatNumber(subjects.length, locale)} {t("مواد متاحة", "subjects available")}</p></div>
                      </div>
                      <span className="shrink-0 text-emerald-600">✓</span>
                    </div>
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex min-w-0 items-center gap-3">
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-600">⭐</span>
                        <div className="min-w-0"><p className="text-xs font-bold sm:text-sm">{t("مستواك الحالي", "Current Level")}</p><p className="mt-1 text-[10px] text-slate-400">{t(`المستوى ${studentLevel}`, `Level ${studentLevel}`)} · {formatNumber(xpPoints, locale)} XP</p></div>
                      </div>
                      <span className="shrink-0 text-amber-500">★</span>
                    </div>
                  </div>
                  <div className="mt-5 border-t border-slate-100 pt-4">
                    <div className="mb-2 flex items-center justify-between gap-2 text-xs"><span className="font-bold text-slate-600">{t("تقدم المستوى", "Level Progress")}</span><span className="font-black text-[#17213d]">{xpProgress}%</span></div>
                    <div className="h-2.5 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-[#42b58b] transition-all" style={{ width: `${xpProgress}%` }} /></div>
                  </div>
                </div>
              </section>

              {/* Achievements and wallet */}
              <section className="mt-5 grid min-w-0 grid-cols-1 gap-4 sm:mt-6 xl:grid-cols-[minmax(0,1.35fr)_minmax(280px,0.85fr)]">
                <div className="min-w-0 rounded-2xl border border-[#e5e8f5] bg-white p-3.5 sm:p-5">
                  <SectionTitle eyebrow="YOUR ACHIEVEMENTS" title={t("إنجازاتك", "Your Achievements")} icon="🏆" action={<span className="text-[10px] font-bold text-blue-600 sm:text-xs">{t("عرض الكل ←", "View All →")}</span>} />
                  {achievements.length === 0 ? (
                    <p className="rounded-xl bg-slate-50 p-5 text-center text-sm text-slate-500">{t("لا توجد إنجازات متاحة حاليًا.", "No achievements available yet.")}</p>
                  ) : (
                    <div className="grid grid-cols-2 gap-2 min-[480px]:grid-cols-4 sm:gap-3">
                      {achievements.map((achievement) => {
                        const earned = earnedAchievementIds.includes(achievement.id);
                        return <div key={achievement.id} className={`min-w-0 rounded-xl border p-3 text-center sm:p-4 ${earned ? "border-amber-200 bg-amber-50/60" : "border-slate-100 bg-slate-50 opacity-60"}`}>
                          <div className="text-3xl sm:text-4xl">{achievement.icon}</div>
                          <p className="mt-2 line-clamp-2 break-words text-[10px] font-black text-[#17213d] sm:mt-3 sm:text-xs">{isArabic ? achievement.name_ar : achievement.name_en}</p>
                          <p className="mt-2 text-[9px] font-bold text-slate-400 sm:text-[10px]">{earned ? t("مكتسب", "Earned") : t("مقفل", "Locked")}</p>
                        </div>;
                      })}
                    </div>
                  )}
                </div>

                <div className="flex min-w-0 flex-col justify-between rounded-2xl border border-[#e5e8f5] bg-white p-4 sm:p-5">
                  <SectionTitle eyebrow="YOUR WALLET" title={t("رصيدك", "Your Wallet")} icon="🪙" />
                  <div className="rounded-xl border border-amber-100 bg-[#fffaf0] px-4 py-6 text-center">
                    <div className="text-3xl">🪙</div>
                    <p className="mt-2 text-2xl font-black text-[#17213d] sm:text-3xl">{formatNumber(goldCoins, locale)} <span className="text-amber-500">⭐</span></p>
                    <p className="mt-1 text-xs text-slate-500">{t("رصيد العملات الذهبية", "Gold coins balance")}</p>
                  </div>
                  <div className="mt-4 flex items-center justify-between gap-2 text-xs"><span className="text-slate-500">{t("مستواك الحالي", "Current level")}</span><span className="font-black text-[#17213d]">{formatNumber(studentLevel, locale)}</span></div>
                  <div className="mt-2 flex items-center justify-between gap-2 text-xs"><span className="text-slate-500">{t("نقاط الخبرة", "Experience points")}</span><span className="font-black text-[#17213d]">{formatNumber(xpPoints, locale)} XP</span></div>
                </div>
              </section>

              {/* Leaderboard remains available below the reference sections */}
              <section className="mt-5 min-w-0 rounded-2xl border border-[#e5e8f5] bg-white p-4 sm:mt-6 sm:p-6">
                <SectionTitle eyebrow="DURANT LEADERBOARD" title={t("ترتيب الطلاب", "Student Leaderboard")} icon="👥" action={<span className="text-[10px] font-bold text-blue-600 sm:text-xs">TOP 10</span>} />
                {leaderboardLoading ? (
                  <p className="p-5 text-center text-sm text-slate-500">{t("جاري تحميل الترتيب...", "Loading leaderboard...")}</p>
                ) : leaderboardError ? (
                  <p className="break-words p-5 text-center text-sm text-red-500">{t(leaderboardError, "Unable to load leaderboard.")}</p>
                ) : leaderboard.length === 0 ? (
                  <p className="p-5 text-center text-sm text-slate-500">{t("لا يوجد ترتيب متاح حاليًا.", "No ranking available yet.")}</p>
                ) : (
                  <div className="grid min-w-0 grid-cols-1 gap-2 md:grid-cols-2">
                    {leaderboard.slice(0, 5).map((student) => (
                      <div key={student.rank_number} className="flex min-w-0 items-center justify-between gap-2 rounded-xl border border-[#e8ebf5] bg-[#f8f9fd] px-3 py-3">
                        <div className="flex min-w-0 items-center gap-2 sm:gap-3">
                          <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-xs font-black ${getRankStyle(student.rank_number)}`}>{student.rank_number <= 3 ? ["🥇", "🥈", "🥉"][student.rank_number - 1] : student.rank_number}</span>
                          <div className="min-w-0"><p className="truncate text-xs font-black sm:text-sm">{student.student_name}</p><p className="truncate text-[9px] text-slate-400 sm:text-[10px]">{gradeNames[student.grade]?.[isArabic ? "ar" : "en"] ?? student.grade}</p></div>
                        </div>
                        <p className="shrink-0 text-[11px] font-black text-[#17213d] sm:text-sm">{formatNumber(Number(student.gold_coins), locale)} 🪙</p>
                      </div>
                    ))}
                  </div>
                )}
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