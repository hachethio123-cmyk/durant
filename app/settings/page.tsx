
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useTheme } from "@/components/ThemeProvider";

const sections = [
  { id: "appearance", title: "المظهر والألوان", icon: "🎨" },
  { id: "notifications", title: "الإشعارات", icon: "🔔" },
  { id: "language", title: "اللغة وحجم الخط", icon: "🌐" },
  { id: "security", title: "الخصوصية والأمان", icon: "🔐" },
  { id: "devices", title: "الأجهزة والجلسات", icon: "📱" },
  { id: "support", title: "المساعدة والدعم", icon: "💬" },
  { id: "about", title: "حول المنصة", icon: "ℹ️" },
];

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();

  const [activeSection, setActiveSection] = useState("appearance");
  const [fontSize, setFontSize] = useState("medium");
  const [notifications, setNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const section = params.get("section");

    if (sections.some((item) => item.id === section)) {
      setActiveSection(section!);
    }
  }, []);

  const activeTitle =
    sections.find((item) => item.id === activeSection)?.title ??
    "الإعدادات";

  return (
    <main
      dir="rtl"
      className="min-h-screen flex-1 bg-slate-950 p-5 pt-20 text-white md:p-8"
    >
      <div className="mx-auto max-w-6xl">

        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm font-bold text-yellow-400">
              DURANT / لوحة التحكم
            </p>
            <h1 className="mt-2 text-3xl font-black">الإعدادات ⚙️</h1>
            <p className="mt-2 text-slate-400">
              تحكم في تجربتك التعليمية واجعل المنصة مناسبة لك.
            </p>
          </div>

          <Link
            href="/dashboard"
            className="rounded-xl border border-yellow-400/40 bg-yellow-400 px-5 py-3 font-bold text-slate-950 transition hover:bg-yellow-300"
          >
            🏠 العودة للصفحة الرئيسية
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-[260px_1fr]">

          <aside className="h-fit rounded-2xl border border-slate-800 bg-slate-900 p-3">
            <p className="px-3 py-3 text-xs font-bold text-slate-500">
              تخصيص حسابك
            </p>

            {sections.map((section) => (
              <button
                key={section.id}
                type="button"
                onClick={() => setActiveSection(section.id)}
                className={`mb-1 flex w-full items-center gap-3 rounded-xl px-4 py-3 text-right font-bold transition ${
                  activeSection === section.id
                    ? "bg-yellow-400 text-slate-950"
                    : "text-slate-300 hover:bg-slate-800"
                }`}
              >
                <span className="text-xl">{section.icon}</span>
                {section.title}
              </button>
            ))}
          </aside>

          <section className="min-h-[420px] rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <h2 className="mb-6 border-b border-slate-800 pb-5 text-2xl font-black">
              {activeTitle}
            </h2>

            {activeSection === "appearance" && (
              <div className="space-y-6">
                <div>
                  <h3 className="font-bold">نظام الألوان</h3>
                  <p className="mt-1 text-sm text-slate-400">
                    اختر الشكل الذي تفضله للمنصة.
                  </p>

                  <div className="mt-4 grid gap-3 sm:grid-cols-3">
                    {[
                      { id: "dark", title: "داكن", icon: "🌙" },
                      { id: "light", title: "فاتح", icon: "☀️" },
                      { id: "system", title: "حسب الجهاز", icon: "💻" },
                    ].map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() =>
                          setTheme(item.id as "dark" | "light" | "system")
                        }
                        className={`rounded-xl border p-5 text-center transition ${
                          theme === item.id
                            ? "border-yellow-400 bg-yellow-400/10 text-yellow-400"
                            : "border-slate-700 hover:border-slate-500"
                        }`}
                      >
                        <span className="block text-3xl">{item.icon}</span>
                        <span className="mt-2 block font-bold">
                          {item.title}
                        </span>
                        {theme === item.id && (
                          <span className="mt-2 block text-xs">
                            ✓ محدد
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                <p className="rounded-xl border border-yellow-400/20 bg-yellow-400/5 p-4 text-sm text-yellow-200">
                  اختيارك محفوظ وسيتم تطبيقه على صفحات المنصة.
                </p>
              </div>
            )}

            {activeSection === "notifications" && (
              <div className="space-y-4">
                <label className="flex cursor-pointer items-center justify-between rounded-xl border border-slate-800 p-4">
                  <span>
                    <span className="block font-bold">إشعارات المنصة</span>
                    <span className="text-sm text-slate-400">
                      تنبيهات الدروس والامتحانات الجديدة.
                    </span>
                  </span>
                  <input
                    type="checkbox"
                    checked={notifications}
                    onChange={(e) => setNotifications(e.target.checked)}
                    className="h-5 w-5 accent-yellow-400"
                  />
                </label>

                <label className="flex cursor-pointer items-center justify-between rounded-xl border border-slate-800 p-4">
                  <span>
                    <span className="block font-bold">
                      إشعارات البريد الإلكتروني
                    </span>
                    <span className="text-sm text-slate-400">
                      استقبال التنبيهات عبر البريد.
                    </span>
                  </span>
                  <input
                    type="checkbox"
                    checked={emailNotifications}
                    onChange={(e) =>
                      setEmailNotifications(e.target.checked)
                    }
                    className="h-5 w-5 accent-yellow-400"
                  />
                </label>
              </div>
            )}

            {activeSection === "language" && (
              <div className="space-y-5">
                <div>
                  <label className="mb-2 block font-bold">
                    لغة المنصة
                  </label>
                  <select
                    defaultValue="ar"
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 p-3 text-white"
                  >
                    <option value="ar">العربية</option>
                    <option value="en">English</option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 block font-bold">
                    حجم الخط
                  </label>
                  <select
                    value={fontSize}
                    onChange={(e) => setFontSize(e.target.value)}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 p-3 text-white"
                  >
                    <option value="small">صغير</option>
                    <option value="medium">متوسط</option>
                    <option value="large">كبير</option>
                  </select>
                </div>
              </div>
            )}

            {activeSection === "security" && (
              <div className="space-y-4">
                <div className="rounded-xl border border-slate-800 p-4">
                  <h3 className="font-bold">كلمة المرور</h3>
                  <p className="mt-2 text-sm text-slate-400">
                    حافظ على سرية كلمة المرور ولا تشاركها مع أحد.
                  </p>
                  <p className="mt-3 text-sm text-yellow-400">
                    تغيير كلمة المرور — سنضيف الوظيفة قريبًا.
                  </p>
                </div>

                <div className="rounded-xl border border-slate-800 p-4">
                  <h3 className="font-bold">خصوصية الحساب</h3>
                  <p className="mt-2 text-sm text-slate-400">
                    بيانات حسابك التعليمية مرتبطة بحسابك الشخصي.
                  </p>
                </div>
              </div>
            )}

            {activeSection === "devices" && (
              <div className="rounded-xl border border-slate-800 p-5">
                <div className="text-3xl">📱</div>
                <h3 className="mt-3 font-bold">الأجهزة والجلسات</h3>
                <p className="mt-2 text-sm text-slate-400">
                  سنضيف هنا عرض الأجهزة المسجل منها الدخول وإدارة الجلسات.
                </p>
              </div>
            )}

            {activeSection === "support" && (
              <div className="rounded-xl border border-slate-800 p-5">
                <div className="text-3xl">💬</div>
                <h3 className="mt-3 font-bold">تحتاج مساعدة؟</h3>
                <p className="mt-2 text-sm text-slate-400">
                  قسم الدعم الفني لمساعدتك في استخدام منصة DURANT.
                </p>
                <p className="mt-3 text-sm text-yellow-400">
                  سنضيف وسيلة التواصل قريبًا.
                </p>
              </div>
            )}

            {activeSection === "about" && (
              <div className="py-8 text-center">
                <h3 className="text-4xl font-black tracking-wider text-yellow-400">
                  DURANT
                </h3>
                <p className="mt-4 text-lg font-bold">
                  منصة ديورانت التعليمية
                </p>
                <p className="mt-2 text-sm text-slate-400">
                  مع مستر أمير عبد الناصر
                </p>
                <p className="mt-6 text-xs text-slate-500">
                  © DURANT — جميع الحقوق محفوظة
                </p>
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
