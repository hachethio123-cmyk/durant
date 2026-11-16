
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
  const [loggingOut, setLoggingOut] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    let active = true;

    async function checkAdmin() {
      try {
        const {
          data: userData,
          error: userError,
        } = await supabase.auth.getUser();

        if (userError || !userData.user) {
          if (active) setIsAdmin(false);
          return;
        }

        const { data, error } = await supabase.rpc("is_admin");

        if (active) {
          setIsAdmin(!error && data === true);
        }
      } catch {
        if (active) setIsAdmin(false);
      }
    }

    void checkAdmin();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_OUT" || !session) {
        setIsAdmin(false);
      } else if (
        event === "SIGNED_IN" ||
        event === "TOKEN_REFRESHED" ||
        event === "USER_UPDATED"
      ) {
        Promise.resolve().then(() => {
          if (active) void checkAdmin();
        });
      }
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

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
      label: "DURANT AI",
      icon: "✦",
      href: "/assistant",
      description: isArabic
        ? "مساعدك الذكي الشخصي"
        : "Your AI assistant",
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

    try {
      const { error } = await supabase.auth.signOut();

      if (error) {
        setLoggingOut(false);
        return;
      }

      setIsAdmin(false);
      router.replace("/login");
      router.refresh();
    } catch {
      setLoggingOut(false);
    }
  }

  function closeMobile() {
    setMobileOpen(false);
  }

  if (!languageReady) return null;

  const navItemClass =
    "group relative flex min-h-[43px] items-center gap-3 overflow-hidden rounded-xl px-3 py-1.5 transition-all duration-200 ease-out";

  function isMenuActive(href: string) {
    if (href === "/dashboard#grades") {
      return false;
    }

    if (href === "/dashboard") {
      return pathname === "/dashboard";
    }

    if (href === "/achievements") {
      return pathname.startsWith("/achievements");
    }

    return pathname === href || pathname.startsWith(href + "/");
  }

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
        <span>{mobileOpen ? "✕" : "☰"}</span>
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
        className={`fixed inset-y-0 z-50 flex h-dvh w-72 max-w-[calc(100vw-2rem)] shrink-0 flex-col overflow-hidden border-slate-200 bg-white px-4 py-3 shadow-2xl transition-transform duration-300 ease-in-out lg:fixed lg:inset-y-0 lg:h-dvh lg:max-w-none lg:translate-x-0 lg:shadow-none xl:w-72 ${
          isArabic ? "right-0 border-l" : "left-0 border-r"
        } ${
          mobileOpen
            ? "translate-x-0"
            : isArabic
              ? "translate-x-full"
              : "-translate-x-full"
        }`}
      >
        {/* Background decoration */}
        <div className="pointer-events-none absolute -right-20 -top-20 h-40 w-40 rounded-full bg-blue-50/80 blur-3xl" />

        {/* Brand */}
        <div className="relative shrink-0 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#263d70] to-[#17213d] text-2xl font-black text-white shadow-lg shadow-blue-950/15 transition-transform duration-300 hover:rotate-6 hover:scale-105">
              D
            </div>

            <div className="min-w-0">
              <h1 className="text-2xl font-black tracking-[0.16em] text-[#17213d]">
                DURANT
              </h1>
              <p className="text-[10px] font-medium text-slate-400">
                {isArabic
                  ? "منصة ديورانت التعليمية"
                  : "Educational Platform"}
              </p>
            </div>
          </div>

          <div className="mt-3 flex items-center gap-2 rounded-lg border border-blue-50 bg-blue-50/60 px-3 py-2">
            <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
            <span className="text-[11px] font-bold text-[#263d70]">
              {isArabic
                ? "رحلتك التعليمية مستمرة"
                : "Your learning journey"}
            </span>
            <span className="ms-auto text-xs text-blue-400">✦</span>
          </div>
        </div>

        {/* All navigation items - always visible */}
        <nav className="relative flex min-h-0 flex-1 flex-col gap-1 overflow-hidden pt-3">
          {/* Main menu heading */}
          <div className="mb-1 flex shrink-0 items-center justify-between px-2">
            <p className="text-[10px] font-black tracking-widest text-slate-400">
              {isArabic ? "القائمة الرئيسية" : "MAIN MENU"}
            </p>

            <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[9px] font-bold text-slate-400">
              01
            </span>
          </div>

          {/* Main links */}
          {menuItems.map((item) => {
            const active = isMenuActive(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={closeMobile}
                aria-current={active ? "page" : undefined}
                className={`${navItemClass} shrink-0 ${
                  active
                    ? "bg-[#edf1f9] text-[#17213d] shadow-sm"
                    : "text-slate-600 hover:bg-slate-50 hover:text-[#17213d]"
                }`}
              >
                {active && (
                  <span
                    className={`absolute inset-y-2 w-1 rounded-full bg-[#263d70] ${
                      isArabic ? "right-0" : "left-0"
                    }`}
                  />
                )}

                <span
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-lg transition-all duration-200 group-hover:scale-110 ${
                    active
                      ? "bg-[#17213d] text-white shadow-md shadow-blue-950/15"
                      : "bg-slate-100 text-slate-500 group-hover:bg-blue-50 group-hover:text-[#263d70]"
                  }`}
                >
                  {item.icon}
                </span>

                <span className="min-w-0 flex-1">
                  <span className="block text-[13px] font-extrabold">
                    {item.label}
                  </span>
                  <span className="block text-[9px] font-medium text-slate-400">
                    {item.description}
                  </span>
                </span>

                <span
                  className={`text-sm transition-all duration-200 ${
                    active
                      ? "opacity-100 text-[#263d70]"
                      : "opacity-0 group-hover:opacity-100"
                  }`}
                >
                  {isArabic ? "‹" : "›"}
                </span>
              </Link>
            );
          })}

          {/* Admin link */}
          {isAdmin && (
            <Link
              href="/admin"
              onClick={closeMobile}
              aria-current={
                pathname.startsWith("/admin") ? "page" : undefined
              }
              className={`${navItemClass} shrink-0 ${
                pathname.startsWith("/admin")
                  ? "bg-[#edf1f9] text-[#17213d] shadow-sm"
                  : "text-slate-600 hover:bg-slate-50 hover:text-[#17213d]"
              }`}
            >
              {pathname.startsWith("/admin") && (
                <span
                  className={`absolute inset-y-2 w-1 rounded-full bg-[#263d70] ${
                    isArabic ? "right-0" : "left-0"
                  }`}
                />
              )}

              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-lg text-slate-600">
                ⚙
              </span>

              <span className="min-w-0 flex-1">
                <span className="block text-[13px] font-extrabold">
                  {isArabic ? "المديرين" : "Administration"}
                </span>
                <span className="block text-[9px] text-slate-400">
                  {isArabic
                    ? "إدارة المنصة والطلاب"
                    : "Manage platform and students"}
                </span>
              </span>

              <span className="text-sm text-[#263d70]">
                {isArabic ? "‹" : "›"}
              </span>
            </Link>
          )}

          {/* Settings divider */}
          <div className="my-1 flex shrink-0 items-center gap-2 px-2">
            <div className="h-px flex-1 bg-slate-100" />
            <span className="text-[9px] font-black tracking-widest text-slate-300">
              DURANT
            </span>
            <div className="h-px flex-1 bg-slate-100" />
          </div>

          {/* Settings heading */}
          <Link
            href="/settings"
            onClick={closeMobile}
            aria-current={pathname === "/settings" ? "page" : undefined}
            className={`flex min-h-[38px] shrink-0 items-center gap-3 rounded-xl px-3 py-1.5 transition-all duration-200 ${
              pathname === "/settings"
                ? "bg-[#edf1f9] text-[#17213d]"
                : "text-slate-700 hover:bg-slate-50"
            }`}
          >
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-lg text-slate-600">
              ⚙
            </span>

            <span className="text-[13px] font-extrabold">
              {isArabic ? "الإعدادات" : "Settings"}
            </span>
          </Link>

          {/* All settings links - permanently visible */}
          <div
            className={`flex min-h-0 flex-col gap-0.5 ${
              isArabic ? "mr-5 border-r-2 pr-2" : "ml-5 border-l-2 pl-2"
            } border-slate-200`}
          >
            {settingsItems.map((item) => {
              const active =
                pathname === "/settings" &&
                typeof window !== "undefined" &&
                window.location.search.includes(
                  `section=${item.section}`
                );

              return (
                <Link
                  key={item.section}
                  href={`/settings?section=${item.section}`}
                  onClick={closeMobile}
                  aria-current={active ? "page" : undefined}
                  className={`group flex min-h-[31px] shrink-0 items-center gap-2 rounded-lg px-2 py-1 text-[11px] font-bold transition-all duration-200 ${
                    active
                      ? "bg-blue-50 text-[#17213d]"
                      : "text-slate-500 hover:bg-slate-50 hover:text-[#263d70]"
                  }`}
                >
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-slate-100 text-xs text-slate-500 transition-colors group-hover:bg-blue-50 group-hover:text-[#263d70]">
                    {item.icon}
                  </span>

                  <span className="min-w-0">
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Bottom section */}
        <div className="relative shrink-0 border-t border-slate-100 pt-2">
          <button
            type="button"
            onClick={handleLogout}
            disabled={loggingOut}
            className="group flex min-h-10 w-full items-center justify-center gap-2 rounded-xl border border-red-100 bg-red-50/70 px-3 py-2 text-xs font-extrabold text-red-600 transition-all duration-200 hover:border-red-200 hover:bg-red-100 hover:shadow-sm disabled:cursor-not-allowed disabled:opacity-50"
          >
            <span className="text-base transition-transform duration-200 group-hover:-translate-x-1">
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

          <p className="mt-2 text-center text-[9px] font-medium tracking-wide text-slate-400">
            © DURANT — {isArabic ? "منصة تعليمية" : "Educational Platform"}
          </p>
        </div>
      </aside>
    </div>
  );
}
