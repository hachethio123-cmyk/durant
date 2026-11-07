
"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useLanguage } from "@/components/ThemeProvider";

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

type Props = {
  gradeSlug: string;
};

export default function DashboardInteractions({ gradeSlug }: Props) {
  const router = useRouter();
  const { language } = useLanguage();
  const isArabic = language === "ar";

  const [search, setSearch] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [notificationsLoading, setNotificationsLoading] = useState(true);
  const [notificationError, setNotificationError] = useState("");
  const [markingId, setMarkingId] = useState<string | null>(null);

  const t = (ar: string, en: string) => isArabic ? ar : en;

  const searchItems = useMemo(() => [
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
      keywords: "grades subjects الصفوف المواد دروس",
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
  ], [gradeSlug, isArabic]);

  const searchResults = search.trim()
    ? searchItems.filter((item) =>
        `${item.title} ${item.description} ${item.keywords}`
          .toLowerCase()
          .includes(search.trim().toLowerCase())
      )
    : [];

  async function loadNotifications(studentId?: string) {
    setNotificationsLoading(true);
    setNotificationError("");

    let id = studentId;

    if (!id) {
      const { data, error } = await supabase.auth.getUser();

      if (error || !data.user) {
        setNotifications([]);
        setNotificationsLoading(false);
        setNotificationError(t("تعذر التحقق من الحساب.", "Unable to verify your account."));
        return;
      }

      id = data.user.id;
    }

    const { data, error } = await supabase
      .from("notifications")
      .select(
        "id, title_ar, title_en, message_ar, message_en, type, action_url, is_read, created_at"
      )
      .eq("student_id", id)
      .order("created_at", { ascending: false })
      .limit(20);

    if (error) {
      setNotificationError(
        t("تعذر تحميل الإشعارات حاليًا.", "Could not load notifications.")
      );
      setNotifications([]);
    } else {
      setNotifications((data ?? []) as NotificationItem[]);
    }

    setNotificationsLoading(false);
  }

  useEffect(() => {
    let channel: ReturnType<typeof supabase.channel> | null = null;
    let active = true;

    async function initialize() {
      const { data } = await supabase.auth.getUser();

      if (!active || !data.user) return;

      await loadNotifications(data.user.id);

      if (!active) return;

      channel = supabase
        .channel(`student-notifications-${data.user.id}`)
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "notifications",
            filter: `student_id=eq.${data.user.id}`,
          },
          () => {
            if (active) loadNotifications(data.user.id);
          }
        )
        .subscribe();
    }

    initialize();

    return () => {
      active = false;
      if (channel) supabase.removeChannel(channel);
    };
  }, []);

  async function markAsRead(notification: NotificationItem) {
    if (notification.is_read || markingId) return;

    setMarkingId(notification.id);

    const { data, error } = await supabase.rpc(
      "mark_notification_read",
      { p_notification_id: notification.id }
    );

    if (error || data !== true) {
      setNotificationError(
        t("لم نتمكن من تحديث الإشعار.", "Could not update this notification.")
      );
      setMarkingId(null);
      return;
    }

    setNotifications((current) =>
      current.map((item) =>
        item.id === notification.id
          ? { ...item, is_read: true }
          : item
      )
    );

    setMarkingId(null);
  }

  async function openNotification(notification: NotificationItem) {
    await markAsRead(notification);

    const destination = notification.action_url;

    setNotificationsOpen(false);

    if (destination && destination.startsWith("/") && !destination.startsWith("//")) {
      router.push(destination);
    }
  }

  const unreadCount = notifications.filter((item) => !item.is_read).length;

  return (
    <div className="flex min-w-0 flex-1 items-center gap-3">
      {/* Search */}
      <div className="relative min-w-0 flex-1 sm:max-w-[360px]">
        <div className="flex min-h-11 items-center gap-3 rounded-full border border-[#e2e6f5] bg-white px-4 py-3 shadow-sm sm:px-5">
          <span className="shrink-0 text-xl text-slate-400">⌕</span>

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
            placeholder={t("ابحث عن أي محتوى...", "Search for any content...")}
            aria-label={t("البحث في المنصة", "Search the platform")}
            className="min-w-0 flex-1 bg-transparent text-sm text-[#17213d] outline-none placeholder:text-slate-400"
          />

          {search.length > 0 && (
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setSearchOpen(false);
              }}
              className="text-slate-400 hover:text-slate-700"
              aria-label={t("مسح البحث", "Clear search")}
            >
              ✕
            </button>
          )}
        </div>

        {searchOpen && search.trim() && (
          <>
            <button
              type="button"
              aria-label={t("إغلاق نتائج البحث", "Close search results")}
              className="fixed inset-0 z-30 cursor-default"
              onClick={() => setSearchOpen(false)}
            />

            <div className="absolute start-0 top-full z-40 mt-2 w-full min-w-[250px] overflow-hidden rounded-2xl border border-[#e5e8f5] bg-white p-2 shadow-xl">
              {searchResults.length > 0 ? (
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
                  {t("لا توجد نتائج مطابقة.", "No matching results.")}
                </p>
              )}
            </div>
          </>
        )}
      </div>

      {/* Notifications */}
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
          className="relative flex h-10 w-10 items-center justify-center rounded-full bg-white text-xl shadow-sm transition hover:bg-amber-50 sm:h-11 sm:w-11"
        >
          🔔

          {unreadCount > 0 && (
            <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-black text-white">
              {unreadCount > 99 ? "99+" : unreadCount}
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
                <h3 className="font-black text-[#17213d]">
                  {t("الإشعارات", "Notifications")}
                </h3>
                <span className="rounded-full bg-amber-50 px-2 py-1 text-xs font-bold text-amber-700">
                  {unreadCount} {t("غير مقروء", "unread")}
                </span>
              </div>

              <div className="max-h-[360px] overflow-y-auto">
                {notificationsLoading ? (
                  <p className="p-6 text-center text-sm text-slate-500">
                    {t("جاري تحميل الإشعارات...", "Loading notifications...")}
                  </p>
                ) : notificationError ? (
                  <div className="p-5 text-center">
                    <p className="text-sm text-red-500">{notificationError}</p>
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
                    {t("لا توجد إشعارات حتى الآن.", "No notifications yet.")}
                  </p>
                ) : (
                  notifications.map((notification) => (
                    <button
                      key={notification.id}
                      type="button"
                      disabled={markingId === notification.id}
                      onClick={() => openNotification(notification)}
                      className={`flex w-full gap-3 border-b border-slate-50 px-4 py-4 text-start transition hover:bg-blue-50 ${
                        notification.is_read ? "bg-white" : "bg-blue-50/60"
                      }`}
                    >
                      <span className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-amber-400" />

                      <span className="min-w-0 flex-1">
                        <span className="block text-sm font-black text-[#17213d]">
                          {isArabic
                            ? notification.title_ar
                            : notification.title_en || notification.title_ar}
                        </span>

                        <span className="mt-1 block text-xs leading-6 text-slate-500">
                          {isArabic
                            ? notification.message_ar
                            : notification.message_en || notification.message_ar}
                        </span>

                        <span className="mt-2 block text-[10px] text-slate-400">
                          {new Date(notification.created_at).toLocaleString(
                            isArabic ? "ar-EG" : "en-US"
                          )}
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
    </div>
  );
}
