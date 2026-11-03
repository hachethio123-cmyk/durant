
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useLanguage, useTheme } from "@/components/ThemeProvider";

const sections = [
  { id: "appearance", ar: "المظهر والألوان", en: "Appearance & Colors", icon: "🎨" },
  { id: "notifications", ar: "الإشعارات", en: "Notifications", icon: "🔔" },
  { id: "language", ar: "اللغة وحجم الخط", en: "Language & Font Size", icon: "🌐" },
  { id: "security", ar: "الخصوصية والأمان", en: "Privacy & Security", icon: "🔐" },
  { id: "devices", ar: "الأجهزة والجلسات", en: "Devices & Sessions", icon: "📱" },
  { id: "support", ar: "المساعدة والدعم", en: "Help & Support", icon: "💬" },
  { id: "about", ar: "حول المنصة", en: "About", icon: "ℹ️" },
];

export default function SettingsPage() {
  const { theme, setTheme, fontSize, setFontSize } = useTheme();
  const { language, setLanguage, languageReady } = useLanguage();

  const isArabic = language === "ar";

  const [activeSection, setActiveSection] = useState("appearance");
  const [notifications, setNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const section = params.get("section");

    if (sections.some((item) => item.id === section)) {
      setActiveSection(section!);
    }
  }, []);

  const t = (ar: string, en: string) => (isArabic ? ar : en);

  if (!languageReady) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950">
        <p className="text-2xl font-black text-yellow-400">DURANT</p>
      </main>
    );
  }

  const activeTitle =
    sections.find((item) => item.id === activeSection)?.[
      isArabic ? "ar" : "en"
    ] ?? t("الإعدادات", "Settings");

  return (
    <main
      dir={isArabic ? "rtl" : "ltr"}
      className="min-h-screen flex-1 bg-slate-950 p-5 pt-20 text-white md:p-8"
    >
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm font-bold text-yellow-400">
              DURANT / {t("لوحة التحكم", "Dashboard")}
            </p>

            <h1 className="mt-2 text-3xl font-black">
              {t("الإعدادات ⚙️", "Settings ⚙️")}
            </h1>

            <p className="mt-2 text-slate-400">
              {t(
                "تحكم في تجربتك التعليمية واجعل المنصة مناسبة لك.",
                "Customize your learning experience and make the platform work for you."
              )}
            </p>
          </div>

          <Link
            href="/dashboard"
            className="rounded-xl border border-yellow-400/40 bg-yellow-400 px-5 py-3 font-bold text-slate-950 transition hover:bg-yellow-300"
          >
            🏠 {t("العودة للصفحة الرئيسية", "Back to Dashboard")}
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-[260px_1fr]">
          <aside className="h-fit rounded-2xl border border-slate-800 bg-slate-900 p-3">
            <p className="px-3 py-3 text-xs font-bold text-slate-500">
              {t("تخصيص حسابك", "Customize Your Account")}
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
                {isArabic ? section.ar : section.en}
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
                  <h3 className="font-bold">
                    {t("نظام الألوان", "Color Theme")}
                  </h3>

                  <p className="mt-1 text-sm text-slate-400">
                    {t(
                      "اختر الشكل الذي تفضله للمنصة.",
                      "Choose your preferred platform appearance."
                    )}
                  </p>

                  <div className="mt-4 grid gap-3 sm:grid-cols-3">
                    {[
                      { id: "dark", ar: "داكن", en: "Dark", icon: "🌙" },
                      { id: "light", ar: "فاتح", en: "Light", icon: "☀️" },
                      { id: "system", ar: "حسب الجهاز", en: "System", icon: "💻" },
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
                          {isArabic ? item.ar : item.en}
                        </span>
                        {theme === item.id && (
                          <span className="mt-2 block text-xs">
                            ✓ {t("محدد", "Selected")}
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                <p className="rounded-xl border border-yellow-400/20 bg-yellow-400/5 p-4 text-sm text-yellow-200">
                  {t(
                    "اختيارك محفوظ وسيتم تطبيقه على صفحات المنصة.",
                    "Your preference is saved and will be applied across the platform."
                  )}
                </p>
              </div>
            )}

            {activeSection === "notifications" && (
              <div className="space-y-4">
                <label className="flex cursor-pointer items-center justify-between rounded-xl border border-slate-800 p-4">
                  <span>
                    <span className="block font-bold">
                      {t("إشعارات المنصة", "Platform Notifications")}
                    </span>
                    <span className="text-sm text-slate-400">
                      {t(
                        "تنبيهات الدروس والامتحانات الجديدة.",
                        "Alerts for new lessons and exams."
                      )}
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
                      {t("إشعارات البريد الإلكتروني", "Email Notifications")}
                    </span>
                    <span className="text-sm text-slate-400">
                      {t(
                        "استقبال التنبيهات عبر البريد.",
                        "Receive alerts by email."
                      )}
                    </span>
                  </span>

                  <input
                    type="checkbox"
                    checked={emailNotifications}
                    onChange={(e) => setEmailNotifications(e.target.checked)}
                    className="h-5 w-5 accent-yellow-400"
                  />
                </label>
              </div>
            )}

            {activeSection === "language" && (
              <div className="space-y-5">
                <div>
                  <label className="mb-2 block font-bold">
                    {t("لغة المنصة", "Platform Language")}
                  </label>

                  <select
                    value={language}
                    onChange={(e) =>
                      setLanguage(e.target.value as "ar" | "en")
                    }
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 p-3 text-white"
                  >
                    <option value="ar">العربية</option>
                    <option value="en">English</option>
                  </select>

                  <p className="mt-2 text-sm text-slate-400">
                    {isArabic
                      ? "تم اختيار اللغة العربية."
                      : "English language selected."}
                  </p>
                </div>

                <div>
                  <label className="mb-2 block font-bold">
                    {t("حجم الخط", "Font Size")}
                  </label>

                  <select
                    value={fontSize}
                    onChange={(e) =>
                      setFontSize(
                        e.target.value as "small" | "medium" | "large"
                      )
                    }
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 p-3 text-white"
                  >
                    <option value="small">{t("صغير", "Small")}</option>
                    <option value="medium">{t("متوسط", "Medium")}</option>
                    <option value="large">{t("كبير", "Large")}</option>
                  </select>

                  <p className="mt-2 text-sm text-slate-400">
                    {t(
                      "سيتم حفظ اختيارك وتطبيقه على المنصة.",
                      "Your choice will be saved and applied across the platform."
                    )}
                  </p>
                </div>
              </div>
            )}

            {activeSection === "security" && (
              <div className="space-y-4">
                <div className="rounded-xl border border-slate-800 p-4">
                  <h3 className="font-bold">
                    {t("كلمة المرور", "Password")}
                  </h3>

                  <p className="mt-2 text-sm text-slate-400">
                    {t(
                      "حافظ على سرية كلمة المرور ولا تشاركها مع أحد.",
                      "Keep your password private and never share it."
                    )}
                  </p>

                  <p className="mt-3 text-sm text-yellow-400">
                    {t(
                      "تغيير كلمة المرور — سنضيف الوظيفة قريبًا.",
                      "Change password — coming soon."
                    )}
                  </p>
                </div>

                <div className="rounded-xl border border-slate-800 p-4">
                  <h3 className="font-bold">
                    {t("خصوصية الحساب", "Account Privacy")}
                  </h3>

                  <p className="mt-2 text-sm text-slate-400">
                    {t(
                      "بيانات حسابك التعليمية مرتبطة بحسابك الشخصي.",
                      "Your learning data is linked to your personal account."
                    )}
                  </p>
                </div>
              </div>
            )}

            {activeSection === "devices" && (
              <div className="rounded-xl border border-slate-800 p-5">
                <div className="text-3xl">📱</div>

                <h3 className="mt-3 font-bold">
                  {t("الأجهزة والجلسات", "Devices & Sessions")}
                </h3>

                <p className="mt-2 text-sm text-slate-400">
                  {t(
                    "سنضيف هنا عرض الأجهزة المسجل منها الدخول وإدارة الجلسات.",
                    "Device and session management will be available here soon."
                  )}
                </p>
              </div>
            )}

            {activeSection === "support" && (
              <div className="rounded-xl border border-slate-800 p-5">
                <div className="text-3xl">💬</div>

                <h3 className="mt-3 font-bold">
                  {t("تحتاج مساعدة؟", "Need Help?")}
                </h3>

                <p className="mt-2 text-sm text-slate-400">
                  {t(
                    "قسم الدعم الفني لمساعدتك في استخدام منصة DURANT.",
                    "Technical support to help you use the DURANT platform."
                  )}
                </p>

                <p className="mt-3 text-sm text-yellow-400">
                  {t(
                    "سنضيف وسيلة التواصل قريبًا.",
                    "Contact options coming soon."
                  )}
                </p>
              </div>
            )}

            {activeSection === "about" && (
              <div className="py-8 text-center">
                <h3 className="text-4xl font-black tracking-wider text-yellow-400">
                  DURANT
                </h3>

                <p className="mt-4 text-lg font-bold">
                  {t(
                    "منصة ديورانت التعليمية",
                    "DURANT Educational Platform"
                  )}
                </p>

                <p className="mt-2 text-sm text-slate-400">
                  {t(
                    "مع مستر أمير عبد الناصر",
                    "With Mr. Amir Abdel Nasser"
                  )}
                </p>

                <p className="mt-6 text-xs text-slate-500">
                  © DURANT — {t("جميع الحقوق محفوظة", "All Rights Reserved")}
                </p>
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
