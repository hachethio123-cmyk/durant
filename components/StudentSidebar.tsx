
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
      if (event.key === "Escape") setMobileOpen(false);
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
      icon: "⌂",
      href: "/dashboard",
      description: isArabic ? "لوحة التحكم" : "Dashboard",
    },
    {
      label: isArabic ? "الصفوف الدراسية" : "School Grades",
      icon: "▤",
      href: "/dashboard#grades",
      description: isArabic ? "موادك الدراسية" : "Your subjects",
    },
    {
      label: isArabic ? "الإنجازات" : "Achievements",
      icon: "♜",
      href: "/achievements",
      description: isArabic ? "إنجازاتك ومكافآتك" : "Your rewards",
    },
    {
      label: isArabic ? "الملف الشخصي" : "Profile",
      icon: "♙",
      href: "/profile",
      description: isArabic ? "بيانات حسابك" : "Your account",
    },
  ];

  const settingsItems = [
    {
      label: isArabic ? "المظهر والألوان" : "Appearance & Colors",
      icon: "◐",
      section: "appearance",
    },
    {
      label: isArabic ? "الإشعارات" : "Notifications",
      icon: "♧",
      section: "notifications",
    },
    {
      label: isArabic ? "اللغة وحجم الخط" : "Language & Font Size",
      icon: "文",
      section: "language",
    },
    {
      label: isArabic ? "الخصوصية والأمان" : "Privacy & Security",
      icon: "◇",
      section: "security",
    },
    {
      label: isArabic ? "الأجهزة والجلسات" : "Devices & Sessions",
      icon: "▣",
      section: "devices",
    },
    {
      label: isArabic ? "المساعدة والدعم" : "Help & Support",
      icon: "?",
      section: "support",
    },
    {
      label: isArabic ? "حول المنصة" : "About",
      icon: "ⓘ",
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

  if (!languageReady) return null;

  const navItemClass =
    "group relative flex min-h-[58px] items-center gap-3 overflow-hidden rounded-2xl px-3 py-2.5 transition-all duration-300 ease-out";

  return (
    <div dir={isArabic ? "rtl" : "ltr"}>
      {/* Mobile menu button */}
      <button
        type="button"
        onClick={() => setMobileOpen((current) => !current)}
        className={`fixed top-4 z-[60] flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-200 bg-white text-xl text-[#17213d] shadow-lg transition-all duration-300 hover:scale-105 hover:border-slate-300 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-400 active:scale-95 lg:hidden ${
          isArabic ? "right-4" : "left-4"
        }`}
        aria-label={isArabic ? "فتح القائمة" : "Open menu"}
        aria-expanded={mobileOpen}
        aria-controls="durant-student-sidebar"
      >
        <span className="transition-transform duration-300">
          {mobileOpen ? "✕" : "☰"}
        </span>
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <button
          type="button"
          aria-label={isArabic ? "إغلاق القائمة" : "Close menu"}
          onClick={closeMobile}
          className="fixed inset-0 z-40 cursor-default bg-slate-950/35 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        id="durant-student-sidebar"
        aria-label={isArabic ? "القائمة الرئيسية" : "Main navigation"}
        className={`fixed inset-y-0 z-50 flex h-dvh w-72 max-w-[calc(100vw-2rem)] shrink-0 flex-col overflow-hidden border-slate-200 bg-white p-5 shadow-2xl transition-transform duration-300 ease-in-out lg:sticky lg:top-0 lg:h-screen lg:max-w-none lg:translate-x-0 lg:shadow-none xl:w-72 ${
          isArabic ? "right-0 border-l" : "left-0 border-r"
        } ${
          mobileOpen
            ? "translate-x-0"
            : isArabic
              ? "translate-x-full"
              : "-translate-x-full"
        }`}
      >
        {/* Decorative background details */}
        <div className="pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full bg-blue-50/80 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-20 h-48 w-48 rounded-full bg-slate-100 blur-3xl" />

        {/* Brand */}
        <div className="relative shrink-0 border-b border-slate-100 pb-6">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#263d70] to-[#17213d] text-2xl font-black text-white shadow-lg shadow-blue-950/15 transition-transform duration-300 hover:rotate-6 hover:scale-105">
              D
            </div>

            <div className="min-w-0">
              <h1 className="text-2xl font-black tracking-[0.16em] text-[#17213d]">
                DURANT
              </h1>
              <p className="mt-1 text-[11px] font-medium text-slate-400">
                {isArabic
                  ? "منصة ديورانت التعليمية"
                  : "Educational Platform"}
              </p>
            </div>
          </div>

          <div className="mt-5 flex items-center gap-2 rounded-xl border border-blue-50 bg-blue-50/60 px-3 py-2.5">
            <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
            <span className="text-xs font-semibold text-[#263d70]">
              {isArabic ? "رحلتك التعليمية مستمرة" : "Your learning journey"}
            </span>
            <span className="ms-auto text-xs text-blue-400">✦</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="relative mt-7 min-h-0 flex-1 space-y-2 overflow-y-auto overscroll-contain pb-4">
          <div className="mb-4 flex items-center justify-between px-2">
            <p className="text-[11px] font-black tracking-widest text-slate-400">
              {isArabic ? "القائمة الرئيسية" : "MAIN MENU"}
            </p>
            <span className="rounded-md bg-slate-100 px-2 py-1 text-[10px] font-bold text-slate-400">
              01
            </span>
          </div>

          {menuItems.map((item, index) => {
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
                className={`${navItemClass} ${
                  active
                    ? "bg-gradient-to-r from-[#edf1f9] to-[#f5f7fc] text-[#17213d] shadow-sm"
                    : "text-slate-600 hover:translate-x-0.5 hover:bg-slate-50 hover:text-[#17213d]"
                }`}
              >
                {active && (
                  <span
                    className={`absolute inset-y-3 w-1 rounded-full bg-[#263d70] ${
                      isArabic ? "right-0" : "left-0"
                    }`}
                  />
                )}

                <span
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-xl transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 ${
                    active
                      ? "bg-[#17213d] text-white shadow-md shadow-blue-950/15"
                      : "bg-slate-100 text-slate-500 group-hover:bg-blue-50 group-hover:text-[#263d70]"
                  }`}
                >
                  {item.icon}
                </span>

                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-bold">
                    {item.label}
                  </span>
                  <span
                    className={`mt-0.5 block text-[10px] ${
                      active ? "text-slate-500" : "text-slate-400"
                    }`}
                  >
                    {item.description}
                  </span>
                </span>

                <span
                  className={`text-sm transition-all duration-300 ${
                    active
                      ? "translate-x-0 opacity-100 text-[#263d70]"
                      : "-translate-x-1 opacity-0 group-hover:translate-x-0 group-hover:opacity-100"
                  }`}
                >
                  {isArabic ? "‹" : "›"}
                </span>
              </Link>
            );
          })}

          <div className="my-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-slate-100" />
            <span className="text-[10px] font-bold tracking-widest text-slate-300">
              DURANT
            </span>
            <div className="h-px flex-1 bg-slate-100" />
          </div>

          {/* Settings */}
          <button
            type="button"
            onClick={() => setSettingsOpen((current) => !current)}
            className={`group flex min-h-[58px] w-full items-center justify-between rounded-2xl px-3 py-2.5 transition-all duration-300 ${
              pathname === "/settings"
                ? "bg-[#edf1f9] text-[#17213d]"
                : "text-slate-600 hover:bg-slate-50 hover:text-[#17213d]"
            }`}
            aria-expanded={settingsOpen}
          >
            <span className="flex min-w-0 items-center gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-xl text-slate-500 transition-all duration-300 group-hover:rotate-45 group-hover:bg-blue-50 group-hover:text-[#263d70]">
                ⚙
              </span>
              <span className="text-sm font-bold">
                {isArabic ? "الإعدادات" : "Settings"}
              </span>
            </span>

            <span
              className={`text-sm text-slate-400 transition-transform duration-300 ${
                settingsOpen ? "rotate-180" : ""
              }`}
            >
              ⌄
            </span>
          </button>

          {/* Animated settings submenu */}
          <div
            className={`grid transition-all duration-300 ease-in-out ${
              settingsOpen
                ? "grid-rows-[1fr] opacity-100"
                : "grid-rows-[0fr] opacity-0"
            }`}
          >
            <div className="min-h-0 overflow-hidden">
              <div
                className={`mt-2 space-y-1 border-slate-200 ${
                  isArabic
                    ? "mr-5 border-r-2 pr-3"
                    : "ml-5 border-l-2 pl-3"
                }`}
              >
                {settingsItems.map((item) => (
                  <Link
                    key={item.section}
                    href={`/settings?section=${item.section}`}
                    onClick={closeMobile}
                    className="group flex min-h-10 items-center gap-2 rounded-xl px-2.5 py-2 text-xs font-semibold text-slate-500 transition-all duration-200 hover:translate-x-0.5 hover:bg-slate-50 hover:text-[#17213d]"
                  >
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-sm text-slate-500 transition-colors group-hover:bg-blue-50 group-hover:text-[#263d70]">
                      {item.icon}
                    </span>
                    <span className="min-w-0">{item.label}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </nav>

        {/* Bottom section */}
        <div className="relative shrink-0 border-t border-slate-100 pt-4">
          {/* Learning card */}
          <div className="mb-4 overflow-hidden rounded-2xl bg-gradient-to-br from-[#17213d] to-[#304b80] p-4 text-white shadow-lg shadow-blue-950/10">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-blue-100">
                {isArabic ? "استمر في التقدم" : "Keep progressing"}
              </span>
              <span className="text-lg text-blue-200">✦</span>
            </div>

            <p className="mt-2 text-[11px] leading-5 text-blue-100/80">
              {isArabic
                ? "كل خطوة صغيرة تقربك من هدفك."
                : "Every small step brings you closer to your goal."}
            </p>

            <div className="mt-3 h-1 overflow-hidden rounded-full bg-white/15">
              <div className="h-full w-2/3 rounded-full bg-blue-200" />
            </div>
          </div>

          {/* Logout */}
          <button
            type="button"
            onClick={handleLogout}
            disabled={loggingOut}
            className="group flex min-h-12 w-full items-center justify-center gap-2 rounded-xl border border-red-100 bg-red-50/70 px-4 py-3 text-sm font-bold text-red-600 transition-all duration-300 hover:border-red-200 hover:bg-red-100 hover:shadow-sm disabled:cursor-not-allowed disabled:opacity-50"
          >
            <span className="transition-transform duration-300 group-hover:-translate-x-1">
              ↪
            </span>
            {loggingOut
              ? isArabic
                ? "جارٍ تسجيل الخروج..."
                : "Logging out..."
              : isArabic
                ? "تسجيل الخروج"
                : "Log out"}
          </button>

          <p className="mt-4 text-center text-[10px] font-medium tracking-wide text-slate-400">
            © DURANT — {isArabic ? "منصة تعليمية" : "Educational Platform"}
          </p>
        </div>
      </aside>
    </div>
  );
}
