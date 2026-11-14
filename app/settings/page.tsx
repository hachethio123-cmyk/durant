
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useLanguage, useTheme } from "@/components/ThemeProvider";

const sections = [
  { id: "appearance", ar: "المظهر والألوان", en: "Appearance & Colors", icon: "🎨", number: "01" },
  { id: "notifications", ar: "الإشعارات", en: "Notifications", icon: "🔔", number: "02" },
  { id: "language", ar: "اللغة وحجم الخط", en: "Language & Font Size", icon: "🌐", number: "03" },
  { id: "security", ar: "الخصوصية والأمان", en: "Privacy & Security", icon: "🔐", number: "04" },
  { id: "devices", ar: "الأجهزة والجلسات", en: "Devices & Sessions", icon: "📱", number: "05" },
  { id: "support", ar: "المساعدة والدعم", en: "Help & Support", icon: "💬", number: "06" },
  { id: "about", ar: "حول المنصة", en: "About", icon: "ℹ️", number: "07" },
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

  const activeItem = sections.find(
    (item) => item.id === activeSection
  );

  const activeTitle = activeItem
    ? isArabic
      ? activeItem.ar
      : activeItem.en
    : t("الإعدادات", "Settings");

  if (!languageReady) {
    return (
      <main className="flex min-h-screen flex-1 items-center justify-center bg-[#f1f3fb]">
        <div className="text-center">
          <div className="mx-auto flex h-16 w-16 animate-pulse items-center justify-center rounded-2xl bg-[#17213d] text-2xl font-black text-white shadow-xl">
            D
          </div>
          <p className="mt-4 text-sm font-bold tracking-widest text-[#17213d]">
            DURANT
          </p>
        </div>
      </main>
    );
  }

  const panelClass =
    "rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition-all duration-300 hover:shadow-md sm:p-6";

  const labelClass = "block text-sm font-bold text-[#17213d]";

  const descriptionClass = "mt-1.5 text-sm leading-6 text-slate-500";

  const selectClass =
    "mt-3 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-[#17213d] outline-none transition focus:border-[#526b9c] focus:bg-white focus:ring-4 focus:ring-blue-50";

  return (
    <main
      dir={isArabic ? "rtl" : "ltr"}
      className="min-h-screen min-w-0 flex-1 bg-[#f1f3fb] px-4 pb-10 pt-20 text-[#17213d] sm:px-6 md:p-8"
    >
      <div className="mx-auto max-w-6xl">

        {/* Header */}
        <header className="mb-7 animate-in fade-in slide-in-from-bottom-2 duration-500">
          <div className="mb-5 flex flex-wrap items-center gap-2 text-xs font-semibold text-slate-400">
            <Link
              href="/dashboard"
              className="transition hover:text-[#263d70]"
            >
              {t("الرئيسية", "Dashboard")}
            </Link>

            <span>/</span>

            <span className="text-[#263d70]">
              {t("الإعدادات", "Settings")}
            </span>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-5">
            <div>
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#17213d] text-2xl text-white shadow-lg shadow-blue-950/10">
                  ⚙
                </div>

                <div>
                  <p className="text-xs font-bold tracking-widest text-[#526b9c]">
                    DURANT PERSONALIZATION
                  </p>

                  <h1 className="mt-1 text-2xl font-black tracking-tight text-[#17213d] sm:text-3xl">
                    {t("إعدادات حسابك", "Account Settings")}
                  </h1>
                </div>
              </div>

              <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-500">
                {t(
                  "خصص تجربتك التعليمية وتحكم في إعدادات المنصة بالطريقة التي تناسبك.",
                  "Personalize your learning experience and customize the platform to suit you."
                )}
              </p>
            </div>

            <Link
              href="/dashboard"
              className="group inline-flex min-h-11 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-[#17213d] shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-[#526b9c] hover:shadow-md"
            >
              <span className="transition-transform duration-300 group-hover:-translate-x-1">
                {isArabic ? "←" : "→"}
              </span>

              {t("العودة للرئيسية", "Back to Dashboard")}
            </Link>
          </div>
        </header>

        {/* Main Layout */}
        <div className="grid items-start gap-6 md:grid-cols-[245px_minmax(0,1fr)] lg:grid-cols-[265px_minmax(0,1fr)]">

          {/* Settings Navigation */}
          <aside className="h-fit rounded-2xl border border-slate-100 bg-white p-3 shadow-sm">
            <div className="mb-3 px-3 py-3">
              <p className="text-[11px] font-black tracking-widest text-slate-400">
                {t("تخصيص حسابك", "YOUR SETTINGS")}
              </p>

              <p className="mt-1 text-xs text-slate-400">
                {t("اختر القسم الذي تريد تعديله", "Choose a section")}
              </p>
            </div>

            <nav className="grid grid-cols-2 gap-2 md:grid-cols-1">
              {sections.map((section) => {
                const active = activeSection === section.id;

                return (
                  <button
                    key={section.id}
                    type="button"
                    onClick={() => setActiveSection(section.id)}
                    aria-current={active ? "page" : undefined}
                    className={`group relative flex min-h-[58px] items-center gap-2 overflow-hidden rounded-xl px-3 py-3 text-start transition-all duration-300 sm:gap-3 ${
                      active
                        ? "bg-[#edf1f9] text-[#17213d] shadow-sm"
                        : "text-slate-500 hover:bg-slate-50 hover:text-[#17213d]"
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
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-lg transition-all duration-300 group-hover:scale-110 ${
                        active
                          ? "bg-[#17213d] text-white shadow-md"
                          : "bg-slate-100 text-slate-500 group-hover:bg-blue-50"
                      }`}
                    >
                      {section.icon}
                    </span>

                    <span className="min-w-0 flex-1">
                      <span className="block text-xs font-bold sm:text-sm">
                        {isArabic ? section.ar : section.en}
                      </span>
                    </span>

                    <span
                      className={`hidden text-[10px] font-bold sm:block ${
                        active ? "text-[#526b9c]" : "text-slate-300"
                      }`}
                    >
                      {section.number}
                    </span>
                  </button>
                );
              })}
            </nav>

            {/* Sidebar info */}
            <div className="mt-4 overflow-hidden rounded-xl bg-gradient-to-br from-[#17213d] to-[#304b80] p-4 text-white">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold">
                  {t("DURANT", "DURANT")}
                </span>
                <span className="text-lg text-blue-200">✦</span>
              </div>

              <p className="mt-2 text-[11px] leading-5 text-blue-100/80">
                {t(
                  "تجربتك التعليمية تبدأ من اختياراتك.",
                  "Your learning experience starts with your choices."
                )}
              </p>
            </div>
          </aside>

          {/* Content */}
          <section
            key={activeSection}
            className="min-h-[480px] min-w-0 animate-in fade-in slide-in-from-bottom-2 duration-300"
          >
            {/* Section Header */}
            <div className="mb-5 flex items-center gap-3 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm sm:p-6">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#edf1f9] text-2xl">
                {activeItem?.icon}
              </div>

              <div className="min-w-0">
                <p className="text-[10px] font-black tracking-widest text-[#526b9c]">
                  DURANT SETTINGS
                </p>

                <h2 className="mt-1 text-xl font-black text-[#17213d] sm:text-2xl">
                  {activeTitle}
                </h2>

                <p className="mt-1 text-xs text-slate-400">
                  {t(
                    "تحكم في تفضيلاتك وإعداداتك الشخصية.",
                    "Manage your personal preferences."
                  )}
                </p>
              </div>
            </div>

            {/* Appearance */}
            {activeSection === "appearance" && (
              <div className="space-y-5">
                <div className={panelClass}>
                  <div className="mb-5">
                    <h3 className={labelClass}>
                      {t("نظام الألوان", "Color Theme")}
                    </h3>

                    <p className={descriptionClass}>
                      {t(
                        "اختر الشكل المناسب لك أثناء استخدام المنصة.",
                        "Choose the appearance you prefer while using the platform."
                      )}
                    </p>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-3">
                    {[
                      {
                        id: "light",
                        ar: "فاتح",
                        en: "Light",
                        icon: "☀️",
                        descriptionAr: "مظهر مشرق",
                        descriptionEn: "Bright appearance",
                      },
                      {
                        id: "dark",
                        ar: "داكن",
                        en: "Dark",
                        icon: "🌙",
                        descriptionAr: "مريح في الظلام",
                        descriptionEn: "Comfortable at night",
                      },
                      {
                        id: "system",
                        ar: "حسب الجهاز",
                        en: "System",
                        icon: "💻",
                        descriptionAr: "يتبع جهازك",
                        descriptionEn: "Follow your device",
                      },
                    ].map((item) => {
                      const selected = theme === item.id;

                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() =>
                            setTheme(
                              item.id as "dark" | "light" | "system"
                            )
                          }
                          aria-pressed={selected}
                          className={`group relative rounded-2xl border p-4 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-md ${
                            selected
                              ? "border-[#526b9c] bg-[#edf1f9] shadow-sm"
                              : "border-slate-100 bg-slate-50 hover:border-slate-200"
                          }`}
                        >
                          {selected && (
                            <span className="absolute left-3 top-3 flex h-5 w-5 items-center justify-center rounded-full bg-[#17213d] text-[10px] text-white">
                              ✓
                            </span>
                          )}

                          <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-white text-2xl shadow-sm transition-transform duration-300 group-hover:scale-110">
                            {item.icon}
                          </span>

                          <span className="mt-3 block text-sm font-black text-[#17213d]">
                            {isArabic ? item.ar : item.en}
                          </span>

                          <span className="mt-1 block text-[10px] text-slate-400">
                            {isArabic
                              ? item.descriptionAr
                              : item.descriptionEn}
                          </span>

                          {selected && (
                            <span className="mt-3 block text-[10px] font-bold text-[#263d70]">
                              {t("المظهر الحالي", "Current theme")}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="flex items-start gap-3 rounded-2xl border border-blue-100 bg-blue-50/70 p-4">
                  <span className="text-xl">💡</span>
                  <p className="text-xs leading-6 text-[#344d7b]">
                    {t(
                      "سيتم حفظ اختيارك وتطبيقه على صفحات المنصة التي تدعم نظام المظهر.",
                      "Your preference will be saved and applied across platform pages that support theme settings."
                    )}
                  </p>
                </div>
              </div>
            )}

            {/* Notifications */}
            {activeSection === "notifications" && (
              <div className="space-y-4">
                <div className={panelClass}>
                  <div className="mb-5">
                    <h3 className={labelClass}>
                      {t("إدارة التنبيهات", "Notification Preferences")}
                    </h3>
                    <p className={descriptionClass}>
                      {t(
                        "تحكم في التنبيهات التي ترغب في استقبالها.",
                        "Choose which notifications you want to receive."
                      )}
                    </p>
                  </div>

                  {[
                    {
                      title: t("إشعارات المنصة", "Platform Notifications"),
                      desc: t(
                        "تنبيهات الدروس والامتحانات الجديدة.",
                        "Alerts for new lessons and exams."
                      ),
                      checked: notifications,
                      change: setNotifications,
                      icon: "🔔",
                    },
                    {
                      title: t(
                        "إشعارات البريد الإلكتروني",
                        "Email Notifications"
                      ),
                      desc: t(
                        "استقبال التنبيهات عبر البريد الإلكتروني.",
                        "Receive alerts by email."
                      ),
                      checked: emailNotifications,
                      change: setEmailNotifications,
                      icon: "✉️",
                    },
                  ].map((item, index) => (
                    <div
                      key={item.title}
                      className={`flex items-center justify-between gap-4 py-5 ${
                        index === 0 ? "border-b border-slate-100" : ""
                      }`}
                    >
                      <div className="flex min-w-0 items-center gap-3">
                        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-50 text-xl">
                          {item.icon}
                        </span>

                        <span className="min-w-0">
                          <span className="block text-sm font-bold text-[#17213d]">
                            {item.title}
                          </span>
                          <span className="mt-1 block text-xs leading-5 text-slate-400">
                            {item.desc}
                          </span>
                        </span>
                      </div>

                      <button
                        type="button"
                        role="switch"
                        aria-checked={item.checked}
                        aria-label={item.title}
                        onClick={() => item.change(!item.checked)}
                        className={`relative h-7 w-12 shrink-0 rounded-full transition-colors duration-300 ${
                          item.checked
                            ? "bg-[#263d70]"
                            : "bg-slate-200"
                        }`}
                      >
                        <span
                          className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition-all duration-300 ${
                            item.checked
                              ? isArabic
                                ? "right-1"
                                : "left-1"
                              : isArabic
                                ? "right-6"
                                : "left-6"
                          }`}
                        />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="rounded-2xl border border-amber-100 bg-amber-50/70 p-4">
                  <p className="text-xs leading-6 text-amber-800">
                    {t(
                      "ملاحظة: هذه الاختيارات تتحكم حاليًا في حالة المفاتيح داخل الصفحة، ولا يعني ذلك أن إرسال الإشعارات أصبح مفعلًا أو محفوظًا في قاعدة البيانات.",
                      "Note: These controls currently update their local page state. Notification delivery and database persistence are not connected yet."
                    )}
                  </p>
                </div>
              </div>
            )}

            {/* Language and Font */}
            {activeSection === "language" && (
              <div className="space-y-5">
                <div className={panelClass}>
                  <div className="flex items-center gap-3">
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-xl">
                      🌐
                    </span>

                    <div>
                      <h3 className={labelClass}>
                        {t("لغة المنصة", "Platform Language")}
                      </h3>
                      <p className="mt-1 text-xs text-slate-400">
                        {t(
                          "اختر اللغة التي تناسبك.",
                          "Choose your preferred language."
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 grid gap-3 sm:grid-cols-2">
                    <button
                      type="button"
                      onClick={() => setLanguage("ar")}
                      aria-pressed={language === "ar"}
                      className={`flex items-center justify-between rounded-xl border p-4 text-start transition-all duration-300 hover:-translate-y-0.5 ${
                        language === "ar"
                          ? "border-[#526b9c] bg-[#edf1f9]"
                          : "border-slate-100 bg-slate-50 hover:bg-white"
                      }`}
                    >
                      <span>
                        <span className="block text-sm font-black text-[#17213d]">
                          العربية
                        </span>
                        <span className="mt-1 block text-xs text-slate-400">
                          من اليمين إلى اليسار
                        </span>
                      </span>

                      <span className="text-xl">🇪🇬</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setLanguage("en")}
                      aria-pressed={language === "en"}
                      className={`flex items-center justify-between rounded-xl border p-4 text-start transition-all duration-300 hover:-translate-y-0.5 ${
                        language === "en"
                          ? "border-[#526b9c] bg-[#edf1f9]"
                          : "border-slate-100 bg-slate-50 hover:bg-white"
                      }`}
                    >
                      <span>
                        <span className="block text-sm font-black text-[#17213d]">
                          English
                        </span>
                        <span className="mt-1 block text-xs text-slate-400">
                          Left to right
                        </span>
                      </span>

                      <span className="text-xl">🇬🇧</span>
                    </button>
                  </div>

                  <p className="mt-4 text-xs text-slate-400">
                    {t(
                      "يتم تطبيق اختيار اللغة مباشرة على المنصة.",
                      "Your language preference is applied across the platform."
                    )}
                  </p>
                </div>

                <div className={panelClass}>
                  <div className="flex items-center gap-3">
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-xl">
                      Aa
                    </span>

                    <div>
                      <h3 className={labelClass}>
                        {t("حجم الخط", "Font Size")}
                      </h3>
                      <p className="mt-1 text-xs text-slate-400">
                        {t(
                          "اختر الحجم المناسب لقراءة المحتوى.",
                          "Choose a comfortable reading size."
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 grid grid-cols-3 gap-3">
                    {[
                      { id: "small", ar: "صغير", en: "Small", sample: "أ" },
                      { id: "medium", ar: "متوسط", en: "Medium", sample: "أ" },
                      { id: "large", ar: "كبير", en: "Large", sample: "أ" },
                    ].map((item) => {
                      const selected = fontSize === item.id;

                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() =>
                            setFontSize(
                              item.id as "small" | "medium" | "large"
                            )
                          }
                          aria-pressed={selected}
                          className={`rounded-xl border p-3 transition-all duration-300 hover:-translate-y-0.5 ${
                            selected
                              ? "border-[#526b9c] bg-[#edf1f9] text-[#17213d]"
                              : "border-slate-100 bg-slate-50 text-slate-500 hover:bg-white"
                          }`}
                        >
                          <span
                            className={`block font-black ${
                              item.id === "small"
                                ? "text-lg"
                                : item.id === "medium"
                                  ? "text-2xl"
                                  : "text-3xl"
                            }`}
                          >
                            {item.sample}
                          </span>

                          <span className="mt-2 block text-xs font-bold">
                            {isArabic ? item.ar : item.en}
                          </span>

                          {selected && (
                            <span className="mt-2 block text-[10px] font-bold text-[#526b9c]">
                              ✓ {t("محدد", "Selected")}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>

                  <div className="mt-5 rounded-xl border border-slate-100 bg-slate-50 p-4">
                    <p className="text-xs font-bold text-slate-400">
                      {t("معاينة النص", "Text Preview")}
                    </p>

                    <p
                      className={`mt-3 font-semibold leading-8 text-[#17213d] ${
                        fontSize === "small"
                          ? "text-sm"
                          : fontSize === "large"
                            ? "text-xl"
                            : "text-base"
                      }`}
                    >
                      {t(
                        "التعلم المستمر هو طريقك نحو النجاح.",
                        "Continuous learning is your path to success."
                      )}
                    </p>
                  </div>

                  <p className="mt-4 text-xs leading-6 text-slate-400">
                    {t(
                      "تم ربط الاختيار بإعدادات المنصة. ظهور تأثير حجم الخط على كل الصفحات يتطلب دعمها لهذا الإعداد.",
                      "Your font preference is selected. Applying it across every page requires those pages to support the setting."
                    )}
                  </p>
                </div>
              </div>
            )}

            {/* Security */}
            {activeSection === "security" && (
              <div className="space-y-4">
                <div className={panelClass}>
                  <div className="flex items-center gap-3">
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-xl">
                      🔑
                    </span>

                    <div>
                      <h3 className={labelClass}>
                        {t("كلمة المرور", "Password")}
                      </h3>
                      <p className="mt-1 text-xs text-slate-400">
                        {t(
                          "حافظ على سرية كلمة المرور.",
                          "Keep your password private."
                        )}
                      </p>
                    </div>
                  </div>

                  <p className="mt-5 rounded-xl bg-slate-50 p-4 text-sm leading-7 text-slate-500">
                    {t(
                      "لا تشارك كلمة المرور مع أي شخص، واحرص على استخدام كلمة مرور قوية.",
                      "Never share your password and make sure to use a strong password."
                    )}
                  </p>

                  <div className="mt-4 flex items-center gap-2 text-xs font-semibold text-amber-700">
                    <span>ℹ️</span>
                    {t(
                      "إمكانية تغيير كلمة المرور ستتم إضافتها لاحقًا.",
                      "Password changing will be added later."
                    )}
                  </div>
                </div>

                <div className={panelClass}>
                  <h3 className={labelClass}>
                    {t("خصوصية الحساب", "Account Privacy")}
                  </h3>

                  <p className={descriptionClass}>
                    {t(
                      "بياناتك التعليمية مرتبطة بحسابك الشخصي. لا تشارك بيانات تسجيل الدخول مع الآخرين.",
                      "Your educational data is linked to your personal account. Do not share your login details."
                    )}
                  </p>
                </div>
              </div>
            )}

            {/* Devices */}
            {activeSection === "devices" && (
              <div className={panelClass}>
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-3xl">
                  📱
                </div>

                <h3 className="mt-5 text-lg font-black text-[#17213d]">
                  {t("الأجهزة والجلسات", "Devices & Sessions")}
                </h3>

                <p className={descriptionClass}>
                  {t(
                    "هنا ستتمكن مستقبلًا من مشاهدة الأجهزة المسجل منها الدخول وإدارة الجلسات النشطة لحسابك.",
                    "In the future, you will be able to view signed-in devices and manage your active account sessions here."
                  )}
                </p>

                <div className="mt-5 rounded-xl border border-blue-100 bg-blue-50/70 p-4 text-xs leading-6 text-[#344d7b]">
                  {t(
                    "نعمل على تطوير هذه الميزة لتوفير تحكم أفضل في أمان حسابك.",
                    "We are working on this feature to give you better control over account security."
                  )}
                </div>
              </div>
            )}

            {/* Support */}
            {activeSection === "support" && (
              <div className={panelClass}>
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-3xl">
                  💬
                </div>

                <h3 className="mt-5 text-lg font-black text-[#17213d]">
                  {t("تحتاج إلى مساعدة؟", "Need Help?")}
                </h3>

                <p className={descriptionClass}>
                  {t(
                    "قسم المساعدة والدعم مخصص لمساعدتك في استخدام منصة DURANT وحل المشكلات التي قد تواجهك.",
                    "The help and support section is designed to help you use DURANT and resolve issues you may encounter."
                  )}
                </p>

                <div className="mt-5 rounded-xl border border-slate-100 bg-slate-50 p-4 text-xs leading-6 text-slate-500">
                  {t(
                    "سيتم إضافة وسائل التواصل مع الدعم الفني قريبًا.",
                    "Support contact options will be added soon."
                  )}
                </div>
              </div>
            )}

            {/* About */}
            {activeSection === "about" && (
              <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
                <div className="relative overflow-hidden bg-gradient-to-br from-[#17213d] to-[#304b80] px-6 py-12 text-center text-white">
                  <div className="pointer-events-none absolute -right-12 -top-16 h-40 w-40 rounded-full border border-white/10" />
                  <div className="pointer-events-none absolute -bottom-20 -left-12 h-48 w-48 rounded-full border border-white/10" />

                  <div className="relative mx-auto flex h-20 w-20 items-center justify-center rounded-3xl border border-white/20 bg-white/10 text-4xl font-black shadow-xl backdrop-blur-sm">
                    D
                  </div>

                  <h3 className="relative mt-5 text-3xl font-black tracking-[0.2em]">
                    DURANT
                  </h3>

                  <p className="relative mt-2 text-sm text-blue-100">
                    {t(
                      "منصة ديورانت التعليمية",
                      "DURANT Educational Platform"
                    )}
                  </p>
                </div>

                <div className="p-6 text-center">
                  <h4 className="font-black text-[#17213d]">
                    {t(
                      "رحلتك نحو المعرفة والنجاح",
                      "Your Journey to Knowledge and Success"
                    )}
                  </h4>

                  <p className="mt-3 text-sm text-slate-500">
                    {t(
                      "مع مستر أمير عبد الناصر",
                      "With Mr. Amir Abdel Nasser"
                    )}
                  </p>

                  <div className="mx-auto mt-6 h-px max-w-xs bg-slate-100" />

                  <p className="mt-5 text-xs text-slate-400">
                    © DURANT —{" "}
                    {t("جميع الحقوق محفوظة", "All Rights Reserved")}
                  </p>
                </div>
              </div>
            )}
          </section>
        </div>

        {/* Footer */}
        <footer className="mt-8 border-t border-slate-200 pt-5 text-center">
          <p className="text-[11px] font-medium text-slate-400">
            DURANT Educational Platform
          </p>
        </footer>
      </div>
    </main>
  );
}
