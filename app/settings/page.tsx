
"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import StudentSidebar from "@/components/StudentSidebar";
import { useLanguage, useTheme } from "@/components/ThemeProvider";

type SectionId =
  | "appearance"
  | "notifications"
  | "language"
  | "security"
  | "devices"
  | "support"
  | "about";

const sections: {
  id: SectionId;
  ar: string;
  en: string;
  icon: string;
  descriptionAr: string;
  descriptionEn: string;
}[] = [
  {
    id: "appearance",
    ar: "المظهر والألوان",
    en: "Appearance & Colors",
    icon: "🎨",
    descriptionAr: "خصص شكل المنصة بالطريقة التي تريحك",
    descriptionEn: "Personalize how DURANT looks",
  },
  {
    id: "notifications",
    ar: "الإشعارات",
    en: "Notifications",
    icon: "🔔",
    descriptionAr: "تحكم في تفضيلات التنبيهات",
    descriptionEn: "Manage your notification preferences",
  },
  {
    id: "language",
    ar: "اللغة",
    en: "Language",
    icon: "🌐",
    descriptionAr: "اختر لغة واجهة المنصة",
    descriptionEn: "Choose your interface language",
  },
  {
    id: "security",
    ar: "الأمان والخصوصية",
    en: "Security & Privacy",
    icon: "🛡️",
    descriptionAr: "معلومات حول حماية حسابك",
    descriptionEn: "Information about account protection",
  },
  {
    id: "devices",
    ar: "الأجهزة والجلسات",
    en: "Devices & Sessions",
    icon: "💻",
    descriptionAr: "إدارة الأجهزة المتصلة بحسابك",
    descriptionEn: "Manage devices connected to your account",
  },
  {
    id: "support",
    ar: "المساعدة والدعم",
    en: "Help & Support",
    icon: "💬",
    descriptionAr: "نحن هنا لمساعدتك",
    descriptionEn: "We're here to help",
  },
  {
    id: "about",
    ar: "عن DURANT",
    en: "About DURANT",
    icon: "✨",
    descriptionAr: "تعرف على منصتك التعليمية",
    descriptionEn: "Learn more about your learning platform",
  },
];

const isSectionId = (value: string | null): value is SectionId =>
  sections.some((section) => section.id === value);

export default function SettingsPage() {
  const { language, setLanguage } = useLanguage();
  const { theme, setTheme, fontSize, setFontSize } = useTheme();

  const isArabic = language === "ar";

  const [activeSection, setActiveSection] =
    useState<SectionId>("appearance");

  const [notifications, setNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(false);
  const [sectionVisible, setSectionVisible] = useState(true);

  const t = (ar: string, en: string) => (isArabic ? ar : en);

  const changeSection = useCallback((id: SectionId) => {
    setSectionVisible(false);

    window.setTimeout(() => {
      setActiveSection(id);
      setSectionVisible(true);

      const url = new URL(window.location.href);
      url.searchParams.set("section", id);
      window.history.pushState({ section: id }, "", url);
    }, 120);
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const initialSection = params.get("section");

    if (isSectionId(initialSection)) {
      setActiveSection(initialSection);
    }

    const handlePopState = () => {
      const current = new URLSearchParams(window.location.search);
      const section = current.get("section");

      setActiveSection(
        isSectionId(section) ? section : "appearance"
      );
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  const active = sections.find((item) => item.id === activeSection)!;

  const themeOptions = [
    {
      id: "light",
      icon: "☀️",
      ar: "الوضع الفاتح",
      en: "Light Mode",
      descriptionAr: "واجهة مشرقة ومريحة",
      descriptionEn: "Bright and comfortable interface",
      preview: "bg-white",
    },
    {
      id: "dark",
      icon: "🌙",
      ar: "الوضع الداكن",
      en: "Dark Mode",
      descriptionAr: "ألوان داكنة للراحة أثناء الليل",
      descriptionEn: "Dark colors for nighttime comfort",
      preview: "bg-slate-900",
    },
    {
      id: "system",
      icon: "🖥️",
      ar: "حسب الجهاز",
      en: "System Default",
      descriptionAr: "استخدم إعدادات جهازك تلقائيًا",
      descriptionEn: "Automatically follow your device",
      preview: "bg-gradient-to-r from-white to-slate-900",
    },
  ] as const;

  const fontOptions = [
    { id: "small", ar: "صغير", en: "Small", sample: "أ" },
    { id: "medium", ar: "متوسط", en: "Medium", sample: "أ" },
    { id: "large", ar: "كبير", en: "Large", sample: "أ" },
  ] as const;

  const renderAppearance = () => (
    <div className="space-y-8">
      <SettingCard
        title={t("نمط العرض", "Display Theme")}
        description={t(
          "اختر المظهر الذي يناسبك أثناء استخدام المنصة",
          "Choose the appearance that suits you"
        )}
      >
        <div className="grid gap-4 sm:grid-cols-3">
          {themeOptions.map((option) => {
            const selected = theme === option.id;

            return (
              <button
                key={option.id}
                type="button"
                onClick={() => setTheme(option.id)}
                aria-pressed={selected}
                className={`group rounded-2xl border-2 p-4 text-start transition-all duration-300 hover:-translate-y-1 hover:shadow-lg focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-200 ${
                  selected
                    ? "border-[#c69b43] bg-amber-50/50 shadow-md shadow-amber-100"
                    : "border-slate-100 bg-white hover:border-slate-300"
                }`}
              >
                <div
                  className={`mb-4 flex h-28 items-center justify-center overflow-hidden rounded-xl border border-slate-200 ${option.preview}`}
                >
                  <div className="w-3/4 space-y-2 rounded-lg bg-white/90 p-3 shadow-lg">
                    <div className="h-2 w-1/2 rounded-full bg-[#17213d]" />
                    <div className="h-2 w-full rounded-full bg-slate-200" />
                    <div className="h-2 w-2/3 rounded-full bg-slate-200" />
                  </div>
                </div>

                <div className="flex items-center justify-between gap-2">
                  <span className="font-bold text-[#17213d]">
                    {option.icon} {t(option.ar, option.en)}
                  </span>

                  <span
                    className={`flex h-5 w-5 items-center justify-center rounded-full border text-xs ${
                      selected
                        ? "border-[#c69b43] bg-[#c69b43] text-white"
                        : "border-slate-300 text-transparent"
                    }`}
                  >
                    ✓
                  </span>
                </div>

                <p className="mt-2 text-xs leading-6 text-slate-500">
                  {t(option.descriptionAr, option.descriptionEn)}
                </p>
              </button>
            );
          })}
        </div>
      </SettingCard>

      <SettingCard
        title={t("حجم الخط", "Font Size")}
        description={t(
          "اضبط حجم النصوص لتكون القراءة أكثر راحة",
          "Adjust text size for a more comfortable reading experience"
        )}
      >
        <div className="grid grid-cols-3 gap-3">
          {fontOptions.map((option) => {
            const selected = fontSize === option.id;

            return (
              <button
                key={option.id}
                type="button"
                onClick={() => setFontSize(option.id)}
                aria-pressed={selected}
                className={`rounded-2xl border-2 p-4 transition-all duration-300 hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-200 ${
                  selected
                    ? "border-[#c69b43] bg-amber-50"
                    : "border-slate-100 bg-white hover:border-slate-300"
                }`}
              >
                <div
                  className={`mb-2 font-black text-[#17213d] ${
                    option.id === "small"
                      ? "text-2xl"
                      : option.id === "medium"
                        ? "text-4xl"
                        : "text-5xl"
                  }`}
                >
                  {option.sample}
                </div>

                <span className="text-sm font-bold text-slate-700">
                  {t(option.ar, option.en)}
                </span>

                {selected && (
                  <div className="mt-2 text-xs font-bold text-[#a77b28]">
                    ✓ {t("محدد", "Selected")}
                  </div>
                )}
              </button>
            );
          })}
        </div>

        <div className="mt-5 rounded-xl bg-slate-50 p-4">
          <p className="mb-2 text-xs font-bold text-slate-400">
            {t("معاينة مباشرة", "LIVE PREVIEW")}
          </p>
          <p
            className={`font-semibold text-[#17213d] ${
              fontSize === "small"
                ? "text-sm"
                : fontSize === "large"
                  ? "text-xl"
                  : "text-base"
            }`}
          >
            {t(
              "مرحبًا بك في DURANT — رحلتك نحو التفوق تبدأ هنا.",
              "Welcome to DURANT — your journey to excellence starts here."
            )}
          </p>
        </div>
      </SettingCard>
    </div>
  );

  const renderNotifications = () => (
    <div className="space-y-5">
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
        <div className="flex items-start gap-3">
          <span className="text-2xl">ℹ️</span>
          <div>
            <p className="font-bold text-amber-900">
              {t("إعدادات تجريبية", "Preview Settings")}
            </p>
            <p className="mt-1 text-sm leading-6 text-amber-800">
              {t(
                "يمكنك تغيير الاختيارات هنا، لكن حفظ الإشعارات وإرسالها فعليًا لم يتم تفعيله بعد.",
                "You can change these preferences, but saving and sending notifications has not been enabled yet."
              )}
            </p>
          </div>
        </div>
      </div>

      <SettingCard
        title={t("إشعارات المنصة", "Platform Notifications")}
        description={t(
          "تنبيهات داخل المنصة حول الأنشطة التعليمية",
          "In-platform alerts about learning activities"
        )}
      >
        <ToggleRow
          icon="🔔"
          title={t("الإشعارات داخل المنصة", "In-app Notifications")}
          description={t(
            "تفضيل عرض التنبيهات داخل المنصة",
            "Preference for showing in-app alerts"
          )}
          checked={notifications}
          onChange={setNotifications}
        />

        <div className="my-4 border-t border-slate-100" />

        <ToggleRow
          icon="✉️"
          title={t("إشعارات البريد الإلكتروني", "Email Notifications")}
          description={t(
            "تفضيل تلقي التحديثات عبر البريد الإلكتروني",
            "Preference for receiving updates by email"
          )}
          checked={emailNotifications}
          onChange={setEmailNotifications}
        />
      </SettingCard>
    </div>
  );

  const renderLanguage = () => (
    <SettingCard
      title={t("لغة المنصة", "Platform Language")}
      description={t(
        "اختر اللغة التي تريد استخدامها في واجهة DURANT",
        "Choose the language you want to use across DURANT"
      )}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        {[
          {
            id: "ar",
            flag: "🇪🇬",
            name: "العربية",
            detail: "من اليمين إلى اليسار",
          },
          {
            id: "en",
            flag: "🇬🇧",
            name: "English",
            detail: "Left to right",
          },
        ].map((option) => {
          const selected = language === option.id;

          return (
            <button
              key={option.id}
              type="button"
              onClick={() => setLanguage(option.id as "ar" | "en")}
              aria-pressed={selected}
              className={`flex items-center gap-4 rounded-2xl border-2 p-5 text-start transition-all duration-300 hover:-translate-y-1 hover:shadow-lg focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-200 ${
                selected
                  ? "border-[#c69b43] bg-amber-50/60"
                  : "border-slate-100 bg-white hover:border-slate-300"
              }`}
            >
              <span className="text-4xl">{option.flag}</span>

              <div className="flex-1">
                <p className="font-black text-[#17213d]">
                  {option.name}
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  {option.detail}
                </p>
              </div>

              <span
                className={`flex h-6 w-6 items-center justify-center rounded-full border text-xs ${
                  selected
                    ? "border-[#c69b43] bg-[#c69b43] text-white"
                    : "border-slate-300 text-transparent"
                }`}
              >
                ✓
              </span>
            </button>
          );
        })}
      </div>
    </SettingCard>
  );

  const renderComingSoon = (
    icon: string,
    title: string,
    description: string,
    details: string[]
  ) => (
    <SettingCard title={title} description={description}>
      <div className="rounded-2xl bg-gradient-to-br from-[#17213d] to-[#263b65] p-7 text-white">
        <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-white/15 bg-white/10 text-3xl">
          {icon}
        </div>

        <span className="inline-flex rounded-full border border-amber-300/30 bg-amber-300/10 px-3 py-1 text-xs font-bold text-amber-200">
          {t("قريبًا", "Coming Soon")}
        </span>

        <h3 className="mt-4 text-xl font-black">
          {t("نعمل على تطوير هذا القسم", "We're working on this feature")}
        </h3>

        <p className="mt-2 max-w-xl text-sm leading-7 text-slate-300">
          {t(
            "سيكون هذا القسم متاحًا في تحديث قادم. نحرص على تقديم تجربة آمنة ومتكاملة قبل تفعيل هذه الوظائف.",
            "This section will be available in a future update. We want to ensure a secure and complete experience before enabling these features."
          )}
        </p>
      </div>

      <div className="mt-5 space-y-3">
        {details.map((detail, index) => (
          <div
            key={index}
            className="flex items-center gap-3 rounded-xl bg-slate-50 p-4"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-sm shadow-sm">
              {index + 1}
            </span>
            <span className="text-sm font-medium text-slate-600">
              {detail}
            </span>
          </div>
        ))}
      </div>
    </SettingCard>
  );

  const renderAbout = () => (
    <div className="space-y-5">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#111b35] via-[#1b2b50] to-[#263e69] p-7 text-white shadow-xl sm:p-10">
        <div className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full border border-white/10" />
        <div className="pointer-events-none absolute -right-7 -top-10 h-44 w-44 rounded-full border border-[#c69b43]/30" />

        <div className="relative z-10">
          <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-[#d5ad5b]/40 bg-white/10 text-3xl shadow-lg">
            📘
          </div>

          <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#e1bd72]">
            YOUR LEARNING JOURNEY
          </p>

          <h2 className="mt-3 text-4xl font-black tracking-wide">
            DURANT
          </h2>

          <p className="mt-4 max-w-xl text-sm leading-8 text-slate-300">
            {t(
              "منصة تعليمية تهدف إلى جعل تعلم التاريخ والدراسات الاجتماعية تجربة أكثر تفاعلًا وتنظيمًا وتحفيزًا.",
              "An educational platform designed to make learning history and social studies more interactive, organized, and motivating."
            )}
          </p>

          <div className="mt-7 inline-flex items-center gap-2 rounded-full border border-[#d5ad5b]/30 bg-[#d5ad5b]/10 px-4 py-2 text-sm font-bold text-[#f1d89f]">
            ✦ {t("التعلم يصنع الفرق", "Learning makes the difference")}
          </div>
        </div>
      </div>

      <SettingCard
        title={t("عن المنصة", "About the Platform")}
        description={t(
          "معلومات أساسية عن تجربة DURANT التعليمية",
          "Essential information about the DURANT learning experience"
        )}
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <InfoTile
            icon="👨‍🏫"
            title={t("المعلم", "Teacher")}
            value="أ/ أمير عبد الناصر"
          />
          <InfoTile
            icon="📚"
            title={t("التخصص", "Subject")}
            value={t(
              "التاريخ والدراسات الاجتماعية",
              "History & Social Studies"
            )}
          />
        </div>

        <div className="mt-5 rounded-xl bg-slate-50 p-4">
          <p className="text-sm leading-7 text-slate-600">
            {t(
              "نعمل باستمرار على تطوير المنصة وتحسين تجربة الطلاب، وإضافة أدوات تعليمية تساعدهم على متابعة تقدمهم.",
              "We continuously work to improve the platform and provide students with learning tools that help them follow their progress."
            )}
          </p>
        </div>
      </SettingCard>

      <div className="text-center">
        <p className="text-xs text-slate-400">
          DURANT • {t("منصة تعليمية", "Educational Platform")}
        </p>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeSection) {
      case "appearance":
        return renderAppearance();

      case "notifications":
        return renderNotifications();

      case "language":
        return renderLanguage();

      case "security":
        return renderComingSoon(
          "🛡️",
          t("الأمان والخصوصية", "Security & Privacy"),
          t(
            "نعمل على توفير أدوات إضافية لحماية حسابك وخصوصيتك.",
            "We're working on additional tools to protect your account and privacy."
          ),
          [
            t("إدارة كلمة المرور", "Password management"),
            t("خيارات حماية الحساب", "Account protection options"),
            t("إعدادات الخصوصية", "Privacy settings"),
          ]
        );

      case "devices":
        return renderComingSoon(
          "💻",
          t("الأجهزة والجلسات", "Devices & Sessions"),
          t(
            "ستتمكن مستقبلًا من مراجعة الأجهزة والجلسات المرتبطة بحسابك.",
            "You'll be able to review devices and sessions connected to your account."
          ),
          [
            t("عرض الأجهزة المتصلة", "View connected devices"),
            t("مراجعة الجلسات النشطة", "Review active sessions"),
            t("إدارة تسجيلات الدخول", "Manage sign-ins"),
          ]
        );

      case "support":
        return renderComingSoon(
          "💬",
          t("المساعدة والدعم", "Help & Support"),
          t(
            "نعمل على تجهيز مساحة مخصصة لمساعدتك والإجابة عن استفساراتك.",
            "We're preparing a dedicated space to help answer your questions."
          ),
          [
            t("الأسئلة الشائعة", "Frequently asked questions"),
            t("التواصل مع الدعم", "Contact support"),
            t("الإبلاغ عن مشكلة", "Report a problem"),
          ]
        );

      case "about":
        return renderAbout();

      default:
        return renderAppearance();
    }
  };

  return (
    <div
      dir={isArabic ? "rtl" : "ltr"}
      className="min-h-screen bg-[#f1f3fb] text-[#17213d]"
    >
      <StudentSidebar />

      <main
        className={`min-w-0 flex-1 px-4 py-6 sm:px-6 lg:px-9 lg:py-9 ${
          isArabic ? "lg:pr-72" : "lg:pl-72"
        }`}
      >
        <div className="mx-auto max-w-7xl">
          {/* Header */}
          <div className="settings-hero relative mb-8 overflow-hidden rounded-3xl bg-gradient-to-br from-[#111b35] via-[#1b2b50] to-[#263e69] p-6 text-white shadow-xl sm:p-9">
            <div className="settings-glow pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full bg-[#c69b43]/15 blur-3xl" />
            <div className="settings-ring pointer-events-none absolute -bottom-32 -left-10 h-64 w-64 rounded-full border border-white/10" />
            <div className="pointer-events-none absolute -bottom-20 -left-0 h-44 w-44 rounded-full border border-[#c69b43]/20" />

            <div className="relative z-10 flex flex-col justify-between gap-6 md:flex-row md:items-center">
              <div className="min-w-0 flex-1">
                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#d5ad5b]/30 bg-[#d5ad5b]/10 px-3 py-1.5 text-xs font-bold text-[#f1d89f]">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-[#d5ad5b]" />
                  DURANT PERSONAL SPACE
                </div>

                <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
                  {t("الإعدادات", "Settings")}
                </h1>

                <p className="mt-3 max-w-xl text-sm leading-7 text-slate-300">
                  {t(
                    "تحكم في تجربتك التعليمية وخصص المنصة بالطريقة التي تناسبك.",
                    "Manage your learning experience and personalize the platform your way."
                  )}
                </p>

                {/* Animated Developer Dedication */}
                <div className="dedication-card mt-6" dir="rtl">
                  <span className="dedication-star star-one">✦</span>
                  <span className="dedication-star star-two">✧</span>
                  <span className="dedication-star star-three">✦</span>
                  <span className="dedication-star star-four">✧</span>
                  <span className="dedication-star star-five">✧</span>

                  <div className="dedication-content">
                    <div className="dedication-label">
                      ✨ بكل فخر وامتنان ✨
                    </div>

                    <p className="dedication-intro">
                      إنشاء وتطوير الطالب المبرمج
                    </p>

                    <h2 className="dedication-name">
                      محمد سامح فريد
                    </h2>

                    <div className="dedication-divider" />

                    <div className="dedication-gift">
                      <span className="dedication-cap">🎓</span>

                      <div className="dedication-teacher">
                        <p className="dedication-to">
                          إهداء وتقدير إلى
                        </p>
                        <h3>الأستاذ أمير عبد الناصر</h3>
                      </div>

                      <span className="dedication-trophy">🏆</span>
                    </div>

                    <p className="dedication-footer">
                      صُنع بشغف… ليصنع فرقًا 🤍
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex shrink-0 items-center gap-3 self-start rounded-2xl border border-white/10 bg-white/10 px-4 py-3 backdrop-blur-md md:self-center">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#d5ad5b]/15 text-2xl">
                  ⚙️
                </div>
                <div>
                  <p className="text-xs text-slate-300">
                    {t("القسم الحالي", "Current Section")}
                  </p>
                  <p className="mt-1 font-bold">
                    {t(active.ar, active.en)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick status */}
          <div className="mb-7 grid grid-cols-1 gap-3 sm:grid-cols-3">
            <StatusCard
              icon="🎨"
              label={t("المظهر", "Theme")}
              value={
                theme === "dark"
                  ? t("داكن", "Dark")
                  : theme === "light"
                    ? t("فاتح", "Light")
                    : t("حسب الجهاز", "System")
              }
            />
            <StatusCard
              icon="🌐"
              label={t("اللغة", "Language")}
              value={isArabic ? "العربية" : "English"}
            />
            <StatusCard
              icon="🔠"
              label={t("حجم الخط", "Font Size")}
              value={
                fontSize === "small"
                  ? t("صغير", "Small")
                  : fontSize === "large"
                    ? t("كبير", "Large")
                    : t("متوسط", "Medium")
              }
            />
          </div>

          {/* Main layout */}
          <div className="grid items-start gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
            {/* Navigation */}
            <aside className="settings-nav rounded-3xl border border-slate-200/70 bg-white p-3 shadow-sm lg:sticky lg:top-6">
              <div className="px-3 pb-3 pt-2">
                <p className="text-xs font-black tracking-wider text-slate-400">
                  {t("إعدادات الحساب", "ACCOUNT SETTINGS")}
                </p>
              </div>

              <nav className="grid grid-cols-2 gap-2 lg:grid-cols-1">
                {sections.map((item, index) => {
                  const selected = activeSection === item.id;

                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => changeSection(item.id)}
                      aria-current={selected ? "page" : undefined}
                      className={`settings-nav-item group relative flex min-w-0 items-center gap-3 overflow-hidden rounded-2xl p-3 text-start transition-all duration-300 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-200 ${
                        selected
                          ? "bg-[#17213d] text-white shadow-lg shadow-[#17213d]/15"
                          : "text-slate-600 hover:bg-slate-50 hover:text-[#17213d]"
                      }`}
                      style={{ animationDelay: `${index * 45}ms` }}
                    >
                      {selected && (
                        <span className="absolute inset-y-3 start-0 w-1 rounded-e-full bg-[#d5ad5b]" />
                      )}

                      <span
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-lg transition-transform duration-300 group-hover:scale-110 ${
                          selected
                            ? "bg-white/10"
                            : "bg-slate-100 group-hover:bg-white"
                        }`}
                      >
                        {item.icon}
                      </span>

                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-xs font-bold sm:text-sm">
                          {t(item.ar, item.en)}
                        </span>
                        <span
                          className={`mt-1 hidden truncate text-[10px] sm:block ${
                            selected ? "text-slate-300" : "text-slate-400"
                          }`}
                        >
                          {t(item.descriptionAr, item.descriptionEn)}
                        </span>
                      </span>

                      <span
                        className={`hidden text-xs transition-transform duration-300 lg:block ${
                          selected
                            ? "translate-x-0 text-[#d5ad5b]"
                            : "opacity-0 group-hover:translate-x-0 group-hover:opacity-100"
                        }`}
                      >
                        {isArabic ? "←" : "→"}
                      </span>
                    </button>
                  );
                })}
              </nav>

              <div className="mt-4 hidden rounded-2xl bg-slate-50 p-4 lg:block">
                <div className="mb-2 flex items-center gap-2">
                  <span className="text-lg">💡</span>
                  <span className="text-xs font-bold text-[#17213d]">
                    {t("نصيحة", "TIP")}
                  </span>
                </div>
                <p className="text-xs leading-6 text-slate-500">
                  {t(
                    "خصص المظهر وحجم الخط لتحصل على تجربة قراءة مريحة.",
                    "Customize your theme and font size for a comfortable reading experience."
                  )}
                </p>
              </div>
            </aside>

            {/* Content */}
            <section className="min-w-0">
              <div
                className={`mb-5 flex items-center gap-3 transition-all duration-300 ${
                  sectionVisible
                    ? "translate-y-0 opacity-100"
                    : "translate-y-2 opacity-0"
                }`}
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[#e8d7b5] bg-white text-2xl shadow-sm">
                  {active.icon}
                </div>

                <div className="min-w-0">
                  <h2 className="text-xl font-black text-[#17213d]">
                    {t(active.ar, active.en)}
                  </h2>
                  <p className="mt-1 text-xs text-slate-500">
                    {t(active.descriptionAr, active.descriptionEn)}
                  </p>
                </div>
              </div>

              <div
                key={activeSection}
                className={`settings-content space-y-5 transition-all duration-300 ${
                  sectionVisible
                    ? "translate-y-0 opacity-100"
                    : "translate-y-2 opacity-0"
                }`}
              >
                {renderContent()}
              </div>

              <div className="mt-7 flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 pt-5">
                <p className="text-xs text-slate-400">
                  DURANT © {new Date().getFullYear()}
                </p>

                <Link
                  href="/dashboard"
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-[#17213d] transition-all hover:-translate-y-0.5 hover:border-[#c69b43] hover:shadow-md"
                >
                  {t("العودة للوحة التحكم", "Back to Dashboard")}
                  <span>{isArabic ? "←" : "→"}</span>
                </Link>
              </div>
            </section>
          </div>
        </div>
      </main>

      <style jsx global>{`
        .settings-hero {
          isolation: isolate;
        }

        .settings-glow {
          animation: settingsGlow 8s ease-in-out infinite alternate;
        }

        .settings-ring {
          animation: settingsRotate 35s linear infinite;
        }

        .settings-nav-item {
          animation: settingsEnter 0.4s both ease-out;
        }

        .settings-content {
          animation: settingsEnter 0.35s both ease-out;
        }

        @keyframes settingsGlow {
          from {
            transform: translate3d(0, 0, 0) scale(1);
            opacity: 0.6;
          }
          to {
            transform: translate3d(-18px, 15px, 0) scale(1.15);
            opacity: 1;
          }
        }

        @keyframes settingsRotate {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes settingsEnter {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* =========================================
           DURANT - PREMIUM DEVELOPER DEDICATION
        ========================================= */

        .dedication-card {
          position: relative;
          isolation: isolate;
          overflow: hidden;
          width: 100%;
          max-width: 530px;
          padding: 23px 20px;
          border: 2px solid transparent;
          border-radius: 23px;
          background:
            linear-gradient(#fff, #fff) padding-box,
            linear-gradient(
                120deg,
                #fff,
                #d6ad56,
                #fff4d4,
                #d6ad56,
                #fff
              )
              border-box;
          color: #17213d;
          box-shadow: 0 12px 35px rgba(0, 0, 0, 0.18);
          animation: dedication-appear 1s cubic-bezier(.2, .8, .2, 1) both;
        }

        .dedication-card::after {
          content: "";
          position: absolute;
          z-index: 0;
          top: 0;
          bottom: 0;
          left: -75%;
          width: 45%;
          pointer-events: none;
          background: linear-gradient(
            110deg,
            transparent,
            rgba(214, 173, 86, 0.2),
            rgba(255, 255, 255, 0.8),
            transparent
          );
          transform: skewX(-18deg);
          animation: dedication-shine 5s ease-in-out infinite;
        }

        .dedication-content {
          position: relative;
          z-index: 2;
          text-align: center;
          animation: dedication-content-appear 1.2s ease both;
          animation-delay: 0.2s;
        }

        .dedication-star {
          position: absolute;
          z-index: 1;
          color: #c99b37;
          pointer-events: none;
          animation: dedication-star-float 3.5s ease-in-out infinite;
        }

        .star-one {
          top: 13px;
          left: 18px;
          font-size: 21px;
        }

        .star-two {
          top: 50px;
          right: 17px;
          font-size: 23px;
          animation-delay: 0.7s;
        }

        .star-three {
          bottom: 18px;
          left: 35px;
          font-size: 17px;
          animation-delay: 1.3s;
        }

        .star-four {
          bottom: 40px;
          right: 25px;
          font-size: 19px;
          animation-delay: 1.8s;
        }

        .star-five {
          top: 17px;
          right: 48%;
          font-size: 14px;
          animation-delay: 2.2s;
        }

        .dedication-label {
          color: #a77b28;
          font-size: 15px;
          font-weight: 900;
          margin-bottom: 12px;
        }

        .dedication-intro {
          color: #475569;
          font-size: 16px;
          font-weight: 800;
          margin: 0;
        }

        .dedication-name {
          display: inline-block;
          margin: 8px 0;
          color: #17213d;
          font-size: clamp(27px, 4vw, 36px);
          font-weight: 1000;
          line-height: 1.5;
          cursor: default;
          transition:
            color 0.3s ease,
            text-shadow 0.3s ease,
            transform 0.3s ease;
        }

        .dedication-name:hover {
          color: #b88628;
          text-shadow: 0 0 10px rgba(214, 168, 63, 0.55);
          transform: scale(1.05);
        }

        .dedication-divider {
          width: 65%;
          height: 2px;
          margin: 13px auto;
          border-radius: 20px;
          background: linear-gradient(
            90deg,
            transparent,
            #d6ad56,
            #f5dfa8,
            #d6ad56,
            transparent
          );
        }

        .dedication-gift {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 14px;
          margin-top: 13px;
        }

        .dedication-cap {
          display: inline-block;
          font-size: 34px;
          animation: dedication-cap-bounce 2.2s ease-in-out infinite;
        }

        .dedication-teacher {
          text-align: center;
        }

        .dedication-to {
          margin: 0 0 5px;
          color: #64748b;
          font-size: 14px;
          font-weight: 800;
        }

        .dedication-gift h3 {
          margin: 0;
          color: #17213d;
          font-size: clamp(18px, 3vw, 22px);
          font-weight: 950;
        }

        .dedication-trophy {
          font-size: 27px;
          animation: dedication-trophy-glow 2.5s ease-in-out infinite;
        }

        .dedication-footer {
          margin: 16px 0 0;
          color: #64748b;
          font-size: 14px;
          font-weight: 800;
        }

        @keyframes dedication-appear {
          from {
            opacity: 0;
            transform: translateY(25px) scale(0.96);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes dedication-content-appear {
          from {
            opacity: 0;
            transform: translateY(13px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes dedication-star-float {
          0%,
          100% {
            opacity: 0.35;
            transform: translateY(0) rotate(0deg) scale(0.9);
          }
          50% {
            opacity: 1;
            transform: translateY(-9px) rotate(25deg) scale(1.15);
          }
        }

        @keyframes dedication-cap-bounce {
          0%,
          100% {
            transform: translateY(0) rotate(0);
          }
          40% {
            transform: translateY(-8px) rotate(-9deg);
          }
          65% {
            transform: translateY(0) rotate(5deg);
          }
        }

        @keyframes dedication-trophy-glow {
          0%,
          100% {
            filter: drop-shadow(0 0 0 transparent);
          }
          50% {
            filter: drop-shadow(0 0 8px rgba(214, 168, 63, 0.7));
          }
        }

        @keyframes dedication-shine {
          0%,
          15% {
            left: -75%;
          }
          55%,
          100% {
            left: 140%;
          }
        }

        @media (max-width: 640px) {
          .dedication-card {
            padding: 22px 12px;
          }

          .dedication-name {
            font-size: 28px;
          }

          .dedication-gift {
            gap: 9px;
          }

          .dedication-cap {
            font-size: 29px;
          }

          .dedication-trophy {
            font-size: 23px;
          }

          .dedication-star {
            animation-duration: 3s;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .settings-glow,
          .settings-ring,
          .settings-nav-item,
          .settings-content,
          .dedication-card,
          .dedication-card::after,
          .dedication-content,
          .dedication-star,
          .dedication-cap,
          .dedication-trophy {
            animation: none !important;
            transition: none !important;
          }

          .dedication-name {
            transition: none !important;
          }
        }
      `}</style>
    </div>
  );
}

function SettingCard({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-3xl border border-slate-200/70 bg-white p-5 shadow-sm transition-shadow duration-300 hover:shadow-md sm:p-6">
      <div className="mb-5">
        <h3 className="text-base font-black text-[#17213d]">
          {title}
        </h3>
        <p className="mt-1 text-xs leading-6 text-slate-500">
          {description}
        </p>
      </div>
      {children}
    </div>
  );
}

function ToggleRow({
  icon,
  title,
  description,
  checked,
  onChange,
}: {
  icon: string;
  title: string;
  description: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex min-w-0 items-center gap-3">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-50 text-xl">
          {icon}
        </span>
        <div className="min-w-0">
          <p className="text-sm font-bold text-[#17213d]">{title}</p>
          <p className="mt-1 text-xs leading-5 text-slate-500">
            {description}
          </p>
        </div>
      </div>

      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative h-7 w-12 shrink-0 rounded-full transition-colors duration-300 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-200 ${
          checked ? "bg-[#17213d]" : "bg-slate-300"
        }`}
      >
        <span
          className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow-sm transition-all duration-300 ${
            checked ? "start-6" : "start-1"
          }`}
        />
      </button>
    </div>
  );
}

function StatusCard({
  icon,
  label,
  value,
}: {
  icon: string;
  label: string;
  value: string;
}) {
  return (
    <div className="group flex items-center gap-3 rounded-2xl border border-slate-200/70 bg-white p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-50 text-xl transition-transform duration-300 group-hover:scale-110">
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-xs text-slate-400">{label}</p>
        <p className="mt-1 truncate text-sm font-black text-[#17213d]">
          {value}
        </p>
      </div>
      <span className="ms-auto h-2 w-2 shrink-0 rounded-full bg-emerald-400" />
    </div>
  );
}

function InfoTile({
  icon,
  title,
  value,
}: {
  icon: string;
  title: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-white p-4">
      <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-50 text-xl">
        {icon}
      </span>
      <div className="min-w-0">
        <p className="text-xs text-slate-400">{title}</p>
        <p className="mt-1 text-sm font-bold text-[#17213d]">{value}</p>
      </div>
    </div>
  );
}
