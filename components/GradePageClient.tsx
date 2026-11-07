
"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useLanguage } from "@/components/ThemeProvider";
import StudentSidebar from "@/components/StudentSidebar";
import DashboardHero from "@/components/DashboardHero";

type Subject = {
  title: string;
  subtitle: string;
  icon: string;
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

function SectionTitle({
  eyebrow,
  title,
  icon,
}: {
  eyebrow: string;
  title: string;
  icon: string;
}) {
  return (
    <div className="mb-5">
      <p className="text-[9px] font-black tracking-[0.18em] text-blue-600 sm:text-[10px]">
        {eyebrow}
      </p>

      <h2 className="mt-1 flex items-center gap-2 text-lg font-black text-[#17213d] sm:text-xl">
        <span className="text-2xl">{icon}</span>
        {title}
      </h2>
    </div>
  );
}

function ProgressCard({
  subject,
  isArabic,
}: {
  subject: Subject;
  isArabic: boolean;
}) {
  const progress = 0;

  return (
    <article className="rounded-2xl border border-[#e5e8f5] bg-white p-5 shadow-sm transition hover:shadow-md sm:p-6">
      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-2xl">
            {subject.icon}
          </div>

          <div className="min-w-0">
            <h3 className="font-black text-[#17213d]">
              {subject.title}
            </h3>

            <p className="mt-1 text-xs text-slate-500">
              {subject.subtitle}
            </p>
          </div>
        </div>

        <span className="shrink-0 text-xl font-black text-[#17213d]">
          {progress}%
        </span>
      </div>

      <div className="mt-5 h-2.5 overflow-hidden rounded-full bg-slate-100">
        <div
          className="h-full rounded-full bg-[#42b58b] transition-all"
          style={{ width: `${progress}%` }}
        />
      </div>

      <p className="mt-3 text-xs leading-6 text-slate-400">
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
  gradeSlug,
}: {
  subject: Subject;
  number: number;
  isArabic: boolean;
  gradeSlug: string;
}) {
  return (
    <Link
      href={`/grades/${gradeSlug}`}
      className="group block rounded-2xl border border-[#e5e8f5] bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-amber-200 hover:shadow-lg sm:p-6"
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-50 to-amber-50 text-4xl">
          {subject.icon}
        </div>

        <span className="rounded-lg bg-slate-50 px-3 py-2 text-xs font-bold text-slate-500">
          {isArabic ? `مادة ${number}` : `Subject ${number}`}
        </span>
      </div>

      <h3 className="mt-6 text-xl font-black text-[#17213d] transition group-hover:text-amber-600">
        {subject.title}
      </h3>

      <p className="mt-2 text-sm leading-7 text-slate-500">
        {subject.subtitle}
      </p>

      <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4">
        <span className="text-sm font-bold text-slate-600">
          {isArabic ? "المحتوى الدراسي" : "Study Materials"}
        </span>

        <span className="text-amber-500 transition group-hover:-translate-x-1">
          {isArabic ? "←" : "→"}
        </span>
      </div>
    </Link>
  );
}

export default function GradePageClient({
  slug,
}: {
  slug: string;
}) {
  const router = useRouter();
  const { language, languageReady } = useLanguage();

  const isArabic = language === "ar";
  const direction = isArabic ? "rtl" : "ltr";
  const locale = isArabic ? "ar-EG" : "en-US";

  const t = (ar: string, en: string) =>
    isArabic ? ar : en;

  const [studentName, setStudentName] = useState("طالب ديورانت");
  const [studentId, setStudentId] = useState("");

  const [search, setSearch] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);

  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [notificationsLoading, setNotificationsLoading] = useState(false);
  const [notificationsError, setNotificationsError] = useState("");
  const [markingNotificationId, setMarkingNotificationId] = useState<string | null>(null);

  // تحميل بيانات الطالب
  useEffect(() => {
    let active = true;

    async function loadStudent() {
      const { data: authData, error: authError } =
        await supabase.auth.getUser();

      if (!active) return;

      if (authError || !authData.user) {
        router.replace("/login");
        return;
      }

      setStudentId(authData.user.id);

      const { data: profile, error } = await supabase
        .from("profiles")
        .select("full_name")
        .eq("id", authData.user.id)
        .maybeSingle();

      if (!active) return;

      if (!error && profile?.full_name) {
        setStudentName(profile.full_name);
      }
    }

    loadStudent();

    return () => {
      active = false;
    };
  }, [router]);

  // روابط البحث
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
      href: `/grades/${slug}`,
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

  // تحميل الإشعارات
  const loadNotifications = useCallback(
    async (currentStudentId = studentId) => {
      if (!currentStudentId) return;

      setNotificationsLoading(true);
      setNotificationsError("");

      const { data, error } = await supabase
        .from("notifications")
        .select(
          "id, title_ar, title_en, message_ar, message_en, type, action_url, is_read, created_at"
        )
        .eq("student_id", currentStudentId)
        .order("created_at", { ascending: false })
        .limit(20);

      if (error) {
        setNotificationsError(
          isArabic
            ? "تعذر تحميل الإشعارات حاليًا."
            : "Could not load notifications."
        );
      } else {
        setNotifications((data ?? []) as NotificationItem[]);
      }

      setNotificationsLoading(false);
    },
    [studentId, isArabic]
  );

  // تحديث الإشعارات لحظيًا
  useEffect(() => {
    if (!studentId) return;

    loadNotifications(studentId);

    const channel = supabase
      .channel(`grade-notifications-${studentId}`)
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
  }, [studentId, loadNotifications]);

  // تحديد الإشعار كمقروء
  async function markNotificationAsRead(
    notification: NotificationItem
  ) {
    if (notification.is_read || markingNotificationId) return true;

    setMarkingNotificationId(notification.id);

    const { data, error } = await supabase.rpc(
      "mark_notification_read",
      {
        p_notification_id: notification.id,
      }
    );

    setMarkingNotificationId(null);

    if (error || data !== true) {
      setNotificationsError(
        t("تعذر تحديث الإشعار.", "Could not update this notification.")
      );
      return false;
    }

    setNotifications((current) =>
      current.map((item) =>
        item.id === notification.id
          ? { ...item, is_read: true }
          : item
      )
    );

    return true;
  }

  async function openNotification(
    notification: NotificationItem
  ) {
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

  const unreadNotifications = notifications.filter(
    (item) => !item.is_read
  ).length;

  if (!languageReady) {
    return (
      <main
        dir={direction}
        className="flex min-h-screen items-center justify-center bg-[#f1f3fb]"
      >
        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#17213d] text-3xl font-black text-amber-400">
            D
          </div>

          <h1 className="mt-3 text-2xl font-black tracking-widest text-[#17213d]">
            DURANT
          </h1>
        </div>
      </main>
    );
  }

  const gradeName = gradeNames[slug];

  if (!gradeName) return null;

  const currentGradeName = isArabic
    ? gradeName.ar
    : gradeName.en;

  const isPrep = slug.includes("prep");

  const subjects: Subject[] = isPrep
    ? [
        {
          title: t("الدراسات الاجتماعية", "Social Studies"),
          subtitle: t(
            "التاريخ والجغرافيا",
            "History and Geography"
          ),
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
      className="flex min-h-screen min-w-0 flex-col bg-[#f1f3fb] text-[#17213d] lg:flex-row"
    >
      <StudentSidebar />

      <section className="min-w-0 w-full flex-1 px-3 pb-8 pt-20 sm:px-5 sm:pb-10 md:px-6 md:py-7 lg:px-7 xl:px-8">
        <div className="mx-auto w-full min-w-0 max-w-[1500px]">

          {/* الشريط العلوي المطابق للوحة التحكم */}
          <header className="mb-5 flex min-w-0 flex-col gap-4 sm:mb-6 sm:flex-row sm:items-center sm:justify-between">

            {/* البحث */}
            <div className="order-2 flex w-full min-w-0 flex-1 items-center gap-3 sm:order-1 sm:max-w-[520px]">
              <div className="relative min-w-0 flex-1">
                <div className="flex min-h-11 items-center gap-3 rounded-full border border-[#e2e6f5] bg-white px-4 py-3 shadow-sm sm:px-5">
                  <span className="shrink-0 text-xl text-slate-400">
                    ⌕
                  </span>

                  <input
                    type="search"
                    value={search}
                    onChange={(event) => {
                      setSearch(event.target.value);
                      setSearchOpen(true);
                    }}
                    onFocus={() => setSearchOpen(true)}
                    onKeyDown={(event) => {
                      if (event.key === "Escape") {
                        setSearchOpen(false);
                      }

                      if (event.key === "Enter" && searchResults[0]) {
                        router.push(searchResults[0].href);
                        setSearch("");
                        setSearchOpen(false);
                      }
                    }}
                    placeholder={t(
                      "ابحث عن أي محتوى...",
                      "Search for any content..."
                    )}
                    aria-label={t(
                      "البحث في المنصة",
                      "Search the platform"
                    )}
                    className="min-w-0 flex-1 bg-transparent text-sm text-[#17213d] outline-none placeholder:text-slate-400"
                  />

                  {search && (
                    <button
                      type="button"
                      onClick={() => {
                        setSearch("");
                        setSearchOpen(false);
                      }}
                      aria-label={t("مسح البحث", "Clear search")}
                      className="text-slate-400"
                    >
                      ✕
                    </button>
                  )}
                </div>

                {searchOpen && search.trim() && (
                  <>
                    <button
                      type="button"
                      aria-label={t(
                        "إغلاق نتائج البحث",
                        "Close search results"
                      )}
                      className="fixed inset-0 z-30 cursor-default"
                      onClick={() => setSearchOpen(false)}
                    />

                    <div className="absolute start-0 top-full z-40 mt-2 w-full min-w-[250px] overflow-hidden rounded-2xl border border-[#e5e8f5] bg-white p-2 shadow-xl">
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
                            <span className="text-sm font-black text-[#17213d]">
                              {item.title}
                            </span>

                            <span className="mt-1 text-xs text-slate-500">
                              {item.description}
                            </span>
                          </button>
                        ))
                      ) : (
                        <p className="p-4 text-center text-sm text-slate-500">
                          {t(
                            "لا توجد نتائج مطابقة.",
                            "No matching results."
                          )}
                        </p>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* الإشعارات والملف الشخصي */}
            <div className="order-1 flex min-w-0 items-center justify-between gap-2 sm:order-2 sm:justify-end sm:gap-3">

              {/* الإشعارات */}
              <div className="relative shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    setNotificationsOpen((value) => !value);
                    setSearchOpen(false);

                    if (!notificationsOpen) {
                      loadNotifications();
                    }
                  }}
                  aria-label={t("الإشعارات", "Notifications")}
                  aria-expanded={notificationsOpen}
                  className="relative flex h-10 w-10 items-center justify-center rounded-full bg-white text-xl shadow-sm transition hover:bg-amber-50 sm:h-11 sm:w-11"
                >
                  🔔

                  {unreadNotifications > 0 && (
                    <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-black text-white">
                      {unreadNotifications > 99
                        ? "99+"
                        : unreadNotifications}
                    </span>
                  )}
                </button>

                {notificationsOpen && (
                  <>
                    <button
                      type="button"
                      aria-label={t(
                        "إغلاق الإشعارات",
                        "Close notifications"
                      )}
                      className="fixed inset-0 z-30 cursor-default"
                      onClick={() => setNotificationsOpen(false)}
                    />

                    <div className="absolute end-0 top-full z-40 mt-3 w-[min(350px,calc(100vw-24px))] overflow-hidden rounded-2xl border border-[#e5e8f5] bg-white shadow-2xl">
                      <div className="flex items-center justify-between border-b border-slate-100 px-4 py-4">
                        <h3 className="font-black text-[#17213d]">
                          {t("الإشعارات", "Notifications")}
                        </h3>

                        <span className="rounded-full bg-amber-50 px-2 py-1 text-xs font-bold text-amber-700">
                          {unreadNotifications}{" "}
                          {t("غير مقروء", "unread")}
                        </span>
                      </div>

                      <div className="max-h-[360px] overflow-y-auto">
                        {notificationsLoading ? (
                          <p className="p-6 text-center text-sm text-slate-500">
                            {t(
                              "جاري تحميل الإشعارات...",
                              "Loading notifications..."
                            )}
                          </p>
                        ) : notificationsError ? (
                          <div className="p-5 text-center">
                            <p className="text-sm text-red-500">
                              {notificationsError}
                            </p>

                            <button
                              type="button"
                              onClick={() => loadNotifications()}
                              className="mt-3 text-xs font-bold text-blue-600"
                            >
                              {t("إعادة المحاولة", "Try again")}
                            </button>
                          </div>
                        ) : notifications.length === 0 ? (
                          <p className="p-6 text-center text-sm text-slate-500">
                            {t(
                              "لا توجد إشعارات حتى الآن.",
                              "No notifications yet."
                            )}
                          </p>
                        ) : (
                          notifications.map((notification) => (
                            <button
                              key={notification.id}
                              type="button"
                              disabled={
                                markingNotificationId === notification.id
                              }
                              onClick={() =>
                                openNotification(notification)
                              }
                              className={`flex w-full gap-3 border-b border-slate-50 px-4 py-4 text-start transition hover:bg-blue-50 ${
                                notification.is_read
                                  ? "bg-white"
                                  : "bg-blue-50/60"
                              }`}
                            >
                              <span className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-amber-400" />

                              <span className="min-w-0 flex-1">
                                <span className="block text-sm font-black text-[#17213d]">
                                  {isArabic
                                    ? notification.title_ar
                                    : notification.title_en ||
                                      notification.title_ar}
                                </span>

                                <span className="mt-1 block text-xs leading-6 text-slate-500">
                                  {isArabic
                                    ? notification.message_ar
                                    : notification.message_en ||
                                      notification.message_ar}
                                </span>

                                <span className="mt-2 block text-[10px] text-slate-400">
                                  {new Date(
                                    notification.created_at
                                  ).toLocaleString(locale)}
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
                          {t(
                            "تحديث الإشعارات",
                            "Refresh notifications"
                          )}
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* الملف الشخصي */}
              <Link
                href="/profile"
                className="flex min-w-0 max-w-[calc(100%-3.5rem)] items-center gap-2 rounded-2xl px-2 py-1 transition hover:bg-white sm:gap-3"
              >
                <div className="min-w-0 text-end">
                  <p className="truncate text-xs font-black text-[#17213d] sm:text-sm">
                    {t("مرحبًا", "Hello")} {studentName}
                  </p>

                  <p className="mt-1 truncate text-[10px] text-slate-500 sm:text-xs">
                    {currentGradeName}
                  </p>
                </div>

                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-blue-200 bg-gradient-to-br from-sky-100 to-blue-200 text-xl sm:h-12 sm:w-12 sm:text-2xl">
                  👨🏻‍🎓
                </div>
              </Link>
            </div>
          </header>

          {/* شريط العودة */}
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <Link
              href="/dashboard"
              className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-[#e5e8f5] bg-white px-4 py-2.5 text-xs font-bold text-[#17213d] shadow-sm transition hover:border-amber-300 hover:bg-amber-50 sm:text-sm"
            >
              <span>{isArabic ? "→" : "←"}</span>
              {t("العودة إلى لوحة الطالب", "Back to Dashboard")}
            </Link>

            <span className="text-sm font-black tracking-widest text-[#17213d]">
              DURANT
            </span>
          </div>

          {/* بانر لوحة التحكم الأصلي */}
          <DashboardHero
            gradeName={currentGradeName}
            gradeSlug={slug}
            isArabic={isArabic}
          />

          {/* معلومات الصف */}
          <section className="mt-5 grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
            <div className="rounded-2xl border border-[#e5e8f5] bg-white p-4 shadow-sm sm:p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-2xl">
                  🎓
                </div>

                <div className="min-w-0">
                  <p className="text-xs text-slate-500">
                    {t("الصف الدراسي", "Grade")}
                  </p>

                  <h3 className="mt-1 break-words text-sm font-black text-[#17213d]">
                    {currentGradeName}
                  </h3>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-[#e5e8f5] bg-white p-4 shadow-sm sm:p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-2xl">
                  📚
                </div>

                <div>
                  <p className="text-xs text-slate-500">
                    {t("المواد الدراسية", "Subjects")}
                  </p>

                  <h3 className="mt-1 text-sm font-black text-[#17213d]">
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
              </div>
            </div>

            <div className="rounded-2xl border border-[#e5e8f5] bg-white p-4 shadow-sm sm:p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 text-2xl">
                  👨‍🏫
                </div>

                <div className="min-w-0">
                  <p className="text-xs text-slate-500">
                    {t("مدرس المواد", "Teacher")}
                  </p>

                  <h3 className="mt-1 break-words text-sm font-black text-[#17213d]">
                    {t(
                      "مستر أمير عبد الناصر",
                      "Mr. Amir Abdel Nasser"
                    )}
                  </h3>
                </div>
              </div>
            </div>
          </section>

          {/* المواد الدراسية */}
          <section id="subjects" className="mt-7 scroll-mt-8">
            <SectionTitle
              eyebrow="YOUR SUBJECTS"
              title={t("المواد الدراسية", "Your Subjects")}
              icon="📚"
            />

            <div className="grid min-w-0 gap-4 md:grid-cols-2">
              {subjects.map((subject, index) => (
                <SubjectCard
                  key={subject.title}
                  subject={subject}
                  number={index + 1}
                  isArabic={isArabic}
                  gradeSlug={slug}
                />
              ))}
            </div>
          </section>

          {/* متابعة التقدم */}
          <section className="mt-7">
            <SectionTitle
              eyebrow="YOUR LEARNING JOURNEY"
              title={t("متابعة تقدمك", "Track Your Progress")}
              icon="📊"
            />

            <p className="mb-4 text-xs leading-6 text-slate-500">
              {t(
                "ستُحدّث نسب الإنجاز تلقائيًا بعد ربط إكمال الدروس بحسابك.",
                "Your completion percentages will update automatically once lesson tracking is connected to your account."
              )}
            </p>

            <div className="grid min-w-0 gap-4 md:grid-cols-2">
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
          <section id="curriculum" className="mt-7 scroll-mt-8">
            <SectionTitle
              eyebrow="CURRICULUM"
              title={t("الوحدات والدروس", "Units & Lessons")}
              icon="📖"
            />

            <div className="rounded-2xl border border-[#e5e8f5] bg-white p-5 shadow-sm sm:p-8">
              <div className="flex flex-col items-center text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-4xl">
                  📚
                </div>

                <h3 className="mt-4 text-lg font-black text-[#17213d] sm:text-xl">
                  {t(
                    "مكتبة المحتوى الدراسي",
                    "Study Content Library"
                  )}
                </h3>

                <p className="mt-3 max-w-2xl text-xs leading-7 text-slate-500 sm:text-sm sm:leading-8">
                  {t(
                    "سيتم تنظيم المحتوى هنا حسب المادة والوحدة والدرس، مع إمكانية مشاهدة فيديو الشرح وفتح الملفات وأداء الامتحانات.",
                    "Content will be organized here by subject, unit and lesson, with options to watch explanation videos, open files and take exams."
                  )}
                </p>

                <span className="mt-5 rounded-xl bg-amber-50 px-5 py-3 text-xs font-bold text-amber-700">
                  {t("المحتوى قيد التجهيز", "Content Coming Soon")}
                </span>
              </div>
            </div>
          </section>

          {/* الامتحانات */}
          <section className="mt-7">
            <div className="flex flex-col gap-4 rounded-2xl border border-[#e5e8f5] bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:p-6">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-violet-50 text-3xl">
                📝
              </div>

              <div className="min-w-0 flex-1">
                <h3 className="font-black text-[#17213d]">
                  {t(
                    "الامتحانات والتقييمات",
                    "Exams & Assessments"
                  )}
                </h3>

                <p className="mt-2 text-xs leading-7 text-slate-500 sm:text-sm">
                  {t(
                    "مساحة مخصصة للاختبارات وقياس مستوى الطالب بعد تجهيز المحتوى.",
                    "A dedicated space for tests and measuring student performance once the content is ready."
                  )}
                </p>
              </div>

              <span className="w-fit shrink-0 rounded-lg bg-slate-50 px-3 py-2 text-xs font-bold text-slate-500">
                {t("قيد التجهيز", "Coming Soon")}
              </span>
            </div>
          </section>

          {/* التذييل */}
          <footer className="mt-8 border-t border-[#e1e5f1] pt-5 text-center sm:mt-9 sm:pt-6">
            <p className="font-black tracking-[0.25em] text-[#17213d]">
              DURANT
            </p>

            <p className="mt-2 text-[10px] text-slate-400 sm:text-xs">
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
