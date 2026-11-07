
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useLanguage } from "@/components/ThemeProvider";

export default function StudentSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const { language, languageReady } = useLanguage();
  const isArabic = language === "ar";

  const [mobileOpen, setMobileOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(
    pathname === "/settings"
  );
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    if (!mobileOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setMobileOpen(false);
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [mobileOpen]);

  useEffect(() => {
    setMobileOpen(false);

    if (pathname === "/settings") {
      setSettingsOpen(true);
    }
  }, [pathname]);

  const menuItems = [
    {
      label: isArabic ? "الرئيسية" : "Home",
      icon: "🏠",
      href: "/dashboard",
    },
    {
      label: isArabic ? "الصفوف الدراسية" : "School Grades",
      icon: "📚",
      href: "/dashboard#grades",
    },
    {
      label: isArabic ? "الإنجازات" : "Achievements",
      icon: "🏆",
      href: "/achievements",
    },
    {
      label: isArabic ? "الملف الشخصي" : "Profile",
      icon: "👤",
      href: "/profile",
    },
  ];

  const settingsItems = [
    {
      label: isArabic ? "المظهر والألوان" : "Appearance & Colors",
      icon: "🎨",
      section: "appearance",
    },
    {
      label: isArabic ? "الإشعارات" : "Notifications",
      icon: "🔔",
      section: "notifications",
    },
    {
      label: isArabic ? "اللغة وحجم الخط" : "Language & Font Size",
      icon: "🌐",
      section: "language",
    },
    {
      label: isArabic ? "الخصوصية والأمان" : "Privacy & Security",
      icon: "🔐",
      section: "security",
    },
    {
      label: isArabic ? "الأجهزة والجلسات" : "Devices & Sessions",
      icon: "📱",
      section: "devices",
    },
    {
      label: isArabic ? "المساعدة والدعم" : "Help & Support",
      icon: "💬",
      section: "support",
    },
    {
      label: isArabic ? "حول المنصة" : "About",
      icon: "ℹ️",
      section: "about",
    },
  ];

  async function handleLogout() {
    if (loggingOut) return;

    setLoggingOut(true);

    const { error } = await supabase.auth.signOut();

    if (error) {
      setLoggingOut(false);
      return;
    }

    router.replace("/login");
    router.refresh();
  }

  function closeMobile() {
    setMobileOpen(false);
  }

  if (!languageReady) {
    return null;
  }

  return (
    <div dir={isArabic ? "rtl" : "ltr"}>
      {/* Mobile menu button */}
      <button
        type="button"
        onClick={() => setMobileOpen((current) => !current)}
        className={`fixed top-4 z-[60] flex h-12 w-12 items-center justify-center rounded-xl border border-slate-700 bg-slate-900 text-xl text-white shadow-lg transition hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-yellow-400 lg:hidden ${
          isArabic ? "right-4" : "left-4"
        }`}
        aria-label={isArabic ? "فتح القائمة" : "Open menu"}
        aria-expanded={mobileOpen}
        aria-controls="durant-student-sidebar"
      >
        {mobileOpen ? "✕" : "☰"}
      </button>

      {/* Background overlay */}
      {mobileOpen && (
        <button
          type="button"
          aria-label={isArabic ? "إغلاق القائمة" : "Close menu"}
          onClick={closeMobile}
          className="fixed inset-0 z-40 cursor-default bg-black/60 backdrop-blur-[2px] lg:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        id="durant-student-sidebar"
        aria-label={isArabic ? "القائمة الرئيسية" : "Main navigation"}
        className={`fixed inset-y-0 z-50 flex h-dvh w-72 max-w-[calc(100vw-2rem)] shrink-0 flex-col border-slate-800 bg-slate-950 p-5 shadow-2xl transition-transform duration-300 ease-in-out lg:sticky lg:top-0 lg:h-screen lg:max-w-none lg:translate-x-0 lg:shadow-none xl:w-72 ${
          isArabic ? "right-0 border-l" : "left-0 border-r"
        } ${
          mobileOpen
            ? "translate-x-0"
            : isArabic
              ? "translate-x-full"
              : "-translate-x-full"
        }`}
      >
        {/* Brand */}
        <div className="shrink-0 border-b border-slate-800 pb-6 text-center">
          <h1 className="text-3xl font-black tracking-wider text-yellow-400">
            DURANT
          </h1>

          <p className="mt-2 text-sm text-slate-400">
            {isArabic
              ? "منصة ديورانت التعليمية"
              : "DURANT Educational Platform"}
          </p>

          <div className="mx-auto mt-4 h-1 w-16 rounded-full bg-yellow-400" />
        </div>

        {/* Navigation */}
        <nav className="mt-7 min-h-0 flex-1 space-y-2 overflow-y-auto overscroll-contain pb-4">
          <p className="mb-3 px-3 text-xs font-bold text-slate-500">
            {isArabic ? "القائمة الرئيسية" : "MAIN MENU"}
          </p>

          {menuItems.map((item) => {
            const active =
              item.href === "/dashboard#grades"
                ? false
                : pathname === item.href ||
                  (item.href === "/achievements" &&
                    pathname.startsWith("/achievements"));

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={closeMobile}
                aria-current={active ? "page" : undefined}
                className={`flex min-h-12 items-center gap-3 rounded-xl px-4 py-3 font-bold transition ${
                  active
                    ? "bg-yellow-400 text-slate-950 shadow-lg shadow-yellow-400/10"
                    : "text-slate-300 hover:bg-slate-800 hover:text-yellow-400"
                }`}
              >
                <span className="shrink-0 text-xl">
                  {item.icon}
                </span>
                <span className="min-w-0">{item.label}</span>
              </Link>
            );
          })}

          <div className="my-5 border-t border-slate-800" />

          {/* Settings */}
          <button
            type="button"
            onClick={() => setSettingsOpen((current) => !current)}
            className={`flex min-h-12 w-full items-center justify-between rounded-xl px-4 py-3 font-bold transition ${
              pathname === "/settings"
                ? "bg-yellow-400 text-slate-950"
                : "text-slate-300 hover:bg-slate-800 hover:text-yellow-400"
            }`}
            aria-expanded={settingsOpen}
          >
            <span className="flex min-w-0 items-center gap-3">
              <span className="shrink-0 text-xl">⚙️</span>
              <span>{isArabic ? "الإعدادات" : "Settings"}</span>
            </span>

            <span className="shrink-0 text-sm">
              {settingsOpen ? "⌄" : isArabic ? "‹" : "›"}
            </span>
          </button>

          {settingsOpen && (
            <div
              className={`space-y-1 border-slate-700 ${
                isArabic
                  ? "mr-4 border-r-2 pr-3"
                  : "ml-4 border-l-2 pl-3"
              }`}
            >
              {settingsItems.map((item) => (
                <Link
                  key={item.section}
                  href={`/settings?section=${item.section}`}
                  onClick={closeMobile}
                  className="flex min-h-10 items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-400 transition hover:bg-slate-800 hover:text-yellow-400"
                >
                  <span className="shrink-0">{item.icon}</span>
                  <span className="min-w-0">{item.label}</span>
                </Link>
              ))}
            </div>
          )}
        </nav>

        {/* Logout and footer */}
        <div className="shrink-0 border-t border-slate-800 pt-4">
          <button
            type="button"
            onClick={handleLogout}
            disabled={loggingOut}
            className="min-h-12 w-full rounded-xl border border-red-500/30 px-4 py-3 font-bold text-red-400 transition hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loggingOut
              ? isArabic
                ? "جارٍ تسجيل الخروج..."
                : "Logging out..."
              : isArabic
                ? "🚪 تسجيل الخروج"
                : "🚪 Log out"}
          </button>

          <p className="mt-5 text-center text-xs text-slate-600">
            © DURANT —{" "}
            {isArabic ? "منصة تعليمية" : "Educational Platform"}
          </p>
        </div>
      </aside>
    </div>
  );
}
