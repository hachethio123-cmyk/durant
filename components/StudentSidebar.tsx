
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { supabase } from "@/lib/supabase";

const menuItems = [
  { label: "الرئيسية", icon: "🏠", href: "/dashboard" },
  { label: "الصفوف الدراسية", icon: "📚", href: "/dashboard#grades" },
  { label: "الملف الشخصي", icon: "👤", href: "/profile" },
];

const settingsItems = [
  { label: "المظهر والألوان", icon: "🎨", section: "appearance" },
  { label: "الإشعارات", icon: "🔔", section: "notifications" },
  { label: "اللغة وحجم الخط", icon: "🌐", section: "language" },
  { label: "الخصوصية والأمان", icon: "🔐", section: "security" },
  { label: "الأجهزة والجلسات", icon: "📱", section: "devices" },
  { label: "المساعدة والدعم", icon: "💬", section: "support" },
  { label: "حول المنصة", icon: "ℹ️", section: "about" },
];

export default function StudentSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(
    pathname === "/settings"
  );
  const [loggingOut, setLoggingOut] = useState(false);

  async function handleLogout() {
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

  return (
    <>
      <button
        type="button"
        onClick={() => setMobileOpen(!mobileOpen)}
        className="fixed right-4 top-4 z-[60] rounded-xl border border-slate-700 bg-slate-900 p-3 text-white shadow-lg md:hidden"
        aria-label="فتح القائمة"
      >
        ☰
      </button>

      {mobileOpen && (
        <button
          type="button"
          aria-label="إغلاق القائمة"
          onClick={closeMobile}
          className="fixed inset-0 z-40 bg-black/60 md:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 right-0 z-50 flex w-72 flex-col border-l border-slate-800 bg-slate-950 p-5 shadow-2xl transition-transform duration-300 md:sticky md:top-0 md:h-screen md:w-64 md:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="border-b border-slate-800 pb-6 text-center">
          <h1 className="text-3xl font-black tracking-wider text-yellow-400">
            DURANT
          </h1>
          <p className="mt-2 text-sm text-slate-400">
            منصة ديورانت التعليمية
          </p>
          <div className="mx-auto mt-4 h-1 w-16 rounded-full bg-yellow-400" />
        </div>

        <nav className="mt-7 flex-1 space-y-2 overflow-y-auto">
          <p className="mb-3 px-3 text-xs font-bold text-slate-500">
            القائمة الرئيسية
          </p>

          {menuItems.map((item) => {
            const active =
              item.href === "/dashboard#grades"
                ? false
                : pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={closeMobile}
                className={`flex items-center gap-3 rounded-xl px-4 py-3 font-bold transition ${
                  active
                    ? "bg-yellow-400 text-slate-950 shadow-lg shadow-yellow-400/10"
                    : "text-slate-300 hover:bg-slate-800 hover:text-yellow-400"
                }`}
              >
                <span className="text-xl">{item.icon}</span>
                {item.label}
              </Link>
            );
          })}

          <div className="my-5 border-t border-slate-800" />

          <button
            type="button"
            onClick={() => setSettingsOpen(!settingsOpen)}
            className={`flex w-full items-center justify-between rounded-xl px-4 py-3 font-bold transition ${
              pathname === "/settings"
                ? "bg-yellow-400 text-slate-950"
                : "text-slate-300 hover:bg-slate-800 hover:text-yellow-400"
            }`}
          >
            <span className="flex items-center gap-3">
              <span className="text-xl">⚙️</span>
              الإعدادات
            </span>
            <span className="text-sm">
              {settingsOpen ? "⌄" : "‹"}
            </span>
          </button>

          {settingsOpen && (
            <div className="mr-4 space-y-1 border-r-2 border-slate-700 pr-3">
              {settingsItems.map((item) => (
                <Link
                  key={item.section}
                  href={`/settings?section=${item.section}`}
                  onClick={closeMobile}
                  className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-400 transition hover:bg-slate-800 hover:text-yellow-400"
                >
                  <span>{item.icon}</span>
                  {item.label}
                </Link>
              ))}
            </div>
          )}
        </nav>

        <div className="border-t border-slate-800 pt-4">
          <button
            type="button"
            onClick={handleLogout}
            disabled={loggingOut}
            className="w-full rounded-xl border border-red-500/30 px-4 py-3 font-bold text-red-400 transition hover:bg-red-500/10 disabled:opacity-50"
          >
            {loggingOut ? "جارٍ تسجيل الخروج..." : "🚪 تسجيل الخروج"}
          </button>

          <p className="mt-5 text-center text-xs text-slate-600">
            © DURANT — منصة تعليمية
          </p>
        </div>
      </aside>
    </>
  );
}
