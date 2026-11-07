
"use client";

import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "@/components/ThemeProvider";

const content = {
  ar: {
    login: "تسجيل الدخول",
    signup: "إنشاء حساب",
    welcome: "مستقبلك الدراسي",
    begins: "يبدأ من هنا",
    platform: "منصة ديورانت التعليمية",
    description:
      "بيئة تعليمية متكاملة لدراسة التاريخ والجغرافيا والدراسات الاجتماعية، ومتابعة الدروس والامتحانات والإنجازات، مع مستر أمير عبد الناصر.",
    enter: "دخول المنصة",
    newAccount: "إنشاء حساب جديد",
    teacher: "مستر أمير عبد الناصر",
    teacherQuote: "معًا نحو التفوق والنجاح",
    about: "اكتشف عالم DURANT",
    aboutDescription:
      "منصة تعليمية تساعد الطالب على تنظيم رحلته الدراسية ومتابعة تعلمه في مكان واحد.",
    features: [
      {
        icon: "📚",
        title: "المحتوى الدراسي",
        description: "تنظيم المواد والوحدات والدروس في مساحة تعليمية واحدة.",
      },
      {
        icon: "📝",
        title: "الامتحانات والتقييم",
        description: "مساحة مخصصة للاختبارات وقياس مستوى التحصيل الدراسي.",
      },
      {
        icon: "🏆",
        title: "الإنجازات والمنافسة",
        description:
          "متابعة التقدم والعملات الذهبية والترتيب بين طلاب الصف الواحد.",
      },
    ],
    gradesTitle: "المراحل الدراسية",
    gradesDescription: "محتوى مخصص للصفوف الإعدادية والثانوية.",
    social: "الدراسات الاجتماعية",
    history: "التاريخ والجغرافيا",
    start: "ابدأ رحلتك مع DURANT",
    footer: "منصة ديورانت التعليمية مع مستر أمير عبد الناصر",
    rights: "© 2026 DURANT — جميع الحقوق محفوظة",
    grades: [
      "الصف الأول الإعدادي",
      "الصف الثاني الإعدادي",
      "الصف الثالث الإعدادي",
      "الصف الأول الثانوي",
      "الصف الثاني الثانوي",
      "الصف الثالث الثانوي",
    ],
  },
  en: {
    login: "Log in",
    signup: "Create Account",
    welcome: "Your academic future",
    begins: "Starts right here",
    platform: "DURANT Educational Platform",
    description:
      "An integrated learning environment for studying history, geography and social studies, following lessons, exams and achievements with Mr. Amir Abdel Nasser.",
    enter: "Enter Platform",
    newAccount: "Create a New Account",
    teacher: "Mr. Amir Abdel Nasser",
    teacherQuote: "Together towards excellence and success",
    about: "Discover the World of DURANT",
    aboutDescription:
      "An educational platform that helps students organize their learning journey and follow their progress in one place.",
    features: [
      {
        icon: "📚",
        title: "Learning Content",
        description: "Organized subjects, units and lessons in one learning space.",
      },
      {
        icon: "📝",
        title: "Exams and Assessment",
        description: "A dedicated space for tests and measuring academic progress.",
      },
      {
        icon: "🏆",
        title: "Achievements and Competition",
        description: "Track progress, gold coins and rankings among classmates.",
      },
    ],
    gradesTitle: "Academic Grades",
    gradesDescription: "Content designed for preparatory and secondary students.",
    social: "Social Studies",
    history: "History and Geography",
    start: "Start Your Journey with DURANT",
    footer: "DURANT Educational Platform with Mr. Amir Abdel Nasser",
    rights: "© 2026 DURANT — All Rights Reserved",
    grades: [
      "First Preparatory Grade",
      "Second Preparatory Grade",
      "Third Preparatory Grade",
      "First Secondary Grade",
      "Second Secondary Grade",
      "Third Secondary Grade",
    ],
  },
};

export default function HomePageClient() {
  const { language, setLanguage, languageReady } = useLanguage();

  if (!languageReady) {
    return (
      <main
        className="flex min-h-screen items-center justify-center bg-[#f1f3fb]"
        aria-busy="true"
      >
        <div className="text-center">
          <p className="text-3xl font-black tracking-widest text-[#17213d]">
            DURANT
          </p>
          <div className="mx-auto mt-5 h-1 w-16 animate-pulse rounded-full bg-amber-400" />
        </div>
      </main>
    );
  }

  const t = content[language];
  const isArabic = language === "ar";

  return (
    <main
      dir={isArabic ? "rtl" : "ltr"}
      lang={language}
      className="min-h-screen overflow-hidden bg-[#f1f3fb] text-[#17213d]"
    >
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/95 shadow-sm backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-5 py-4">
          <Link
            href="/"
            className="flex items-center gap-3 text-2xl font-black tracking-widest text-[#17213d] sm:text-3xl"
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#17213d] text-xl text-amber-400 shadow-md">
              D
            </span>
            DURANT
          </Link>

          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <select
              aria-label="Choose language"
              value={language}
              onChange={(e) => setLanguage(e.target.value as "ar" | "en")}
              className="rounded-xl border border-slate-200 bg-[#f7f8fc] px-3 py-2.5 text-sm font-bold text-[#17213d] outline-none transition focus:border-amber-400"
            >
              <option value="ar">العربية</option>
              <option value="en">English</option>
            </select>

            <Link
              href="/login"
              className="rounded-xl border border-[#17213d]/15 px-4 py-2.5 text-sm font-bold text-[#17213d] transition hover:border-amber-400 hover:bg-amber-50"
            >
              {t.login}
            </Link>

            <Link
              href="/login"
              className="rounded-xl bg-[#17213d] px-4 py-2.5 text-sm font-black text-white shadow-md transition hover:bg-[#26375e]"
            >
              {t.signup}
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute -left-32 top-10 h-80 w-80 rounded-full bg-amber-300/20 blur-3xl" />
        <div className="pointer-events-none absolute -right-32 bottom-0 h-96 w-96 rounded-full bg-blue-200/30 blur-3xl" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-5 py-14 md:grid-cols-2 md:py-20 lg:py-24">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-300/60 bg-white px-4 py-2 shadow-sm">
              <span className="h-2 w-2 rounded-full bg-amber-400" />
              <span className="text-xs font-black tracking-widest text-[#17213d]">
                WELCOME TO DURANT
              </span>
            </div>

            <h1 className="mt-7 text-4xl font-black leading-relaxed text-[#17213d] sm:text-5xl lg:text-6xl">
              {t.welcome}
              <span className="block text-[#c18b25]">{t.begins}</span>
            </h1>

            <div className="my-6 h-1 w-24 rounded-full bg-amber-400" />

            <h2 className="text-xl font-black text-[#17213d] sm:text-2xl">
              {t.platform}
            </h2>

            <p className="mt-5 max-w-xl text-base leading-9 text-slate-600">
              {t.description}
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/dashboard"
                className="rounded-xl bg-[#17213d] px-7 py-4 font-black text-white shadow-lg shadow-slate-900/15 transition hover:-translate-y-0.5 hover:bg-[#26375e]"
              >
                {t.enter} {isArabic ? "←" : "→"}
              </Link>

              <Link
                href="/login"
                className="rounded-xl border border-[#17213d]/20 bg-white px-7 py-4 font-bold text-[#17213d] transition hover:border-amber-400 hover:bg-amber-50"
              >
                {t.newAccount}
              </Link>
            </div>

            <div className="mt-9 flex flex-wrap items-center gap-6 text-sm font-bold text-slate-500">
              <span className="flex items-center gap-2">
                <span className="text-amber-500">✦</span>
                {isArabic ? "رحلة تعليمية منظمة" : "Organized Learning"}
              </span>
              <span className="flex items-center gap-2">
                <span className="text-amber-500">✦</span>
                {isArabic ? "متابعة التقدم" : "Progress Tracking"}
              </span>
            </div>
          </div>

          {/* Teacher image */}
          <div className="relative mx-auto w-full max-w-md">
            <div className="absolute -inset-3 rounded-[2rem] bg-gradient-to-br from-amber-300/50 to-[#17213d]/10 blur-xl" />

            <div className="relative flex min-h-[360px] items-end justify-center overflow-hidden rounded-[2rem] border border-white bg-gradient-to-br from-[#e7eaf3] to-[#dce2ef] px-5 pt-8 shadow-xl shadow-slate-900/10 md:min-h-[480px]">
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#17213d]/10 to-transparent" />

              <div className="absolute right-5 top-5 z-20 rounded-xl border border-white/80 bg-white/80 px-4 py-2 shadow-sm backdrop-blur">
                <p className="text-xs font-black text-[#17213d]">
                  DURANT EDUCATION
                </p>
              </div>

              <Image
                src="/images/ameer-nasser.jpg"
                alt={t.teacher}
                width={500}
                height={700}
                priority
                className="relative z-10 max-h-[450px] w-auto object-contain"
              />

              <div className="absolute bottom-5 left-4 right-4 z-20 rounded-2xl border border-white/70 bg-white/90 p-4 text-center shadow-lg backdrop-blur">
                <p className="font-black text-[#17213d]">{t.teacher}</p>
                <p className="mt-1 text-xs font-medium text-slate-500">
                  {t.teacherQuote}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About and features */}
      <section className="border-y border-slate-200 bg-white px-5 py-16 md:py-20">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <p className="text-xs font-black tracking-[0.2em] text-[#c18b25]">
              ABOUT DURANT
            </p>

            <h2 className="mt-3 text-3xl font-black text-[#17213d]">
              {t.about}
            </h2>

            <p className="mx-auto mt-4 max-w-2xl leading-8 text-slate-500">
              {t.aboutDescription}
            </p>
          </div>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {t.features.map((feature, index) => (
              <article
                key={feature.title}
                className="group rounded-2xl border border-slate-100 bg-[#f8f9fd] p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-amber-300 hover:shadow-lg"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#17213d] text-3xl shadow-md transition group-hover:bg-[#26375e]">
                  {feature.icon}
                </div>

                <h3 className="mt-5 text-xl font-black text-[#17213d]">
                  {feature.title}
                </h3>

                <p className="mt-3 text-sm leading-8 text-slate-500">
                  {feature.description}
                </p>

                <div
                  className={`mt-5 h-1 w-12 rounded-full ${
                    index === 1 ? "bg-[#17213d]" : "bg-amber-400"
                  }`}
                />
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Academic grades */}
      <section className="mx-auto max-w-7xl px-5 py-16 md:py-20">
        <div className="text-center">
          <p className="text-xs font-black tracking-[0.2em] text-[#c18b25]">
            ACADEMIC GRADES
          </p>

          <h2 className="mt-3 text-3xl font-black text-[#17213d]">
            {t.gradesTitle}
          </h2>

          <p className="mt-4 text-slate-500">{t.gradesDescription}</p>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {t.grades.map((grade, index) => (
            <article
              key={grade}
              className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-amber-300 hover:shadow-lg"
            >
              <div className="absolute -left-8 -top-8 h-24 w-24 rounded-full bg-amber-300/10 transition group-hover:bg-amber-300/20" />

              <div className="relative flex items-center justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#17213d] text-2xl">
                  🎓
                </div>
                <span className="text-xs font-black text-amber-600">
                  {String(index + 1).padStart(2, "0")}
                </span>
              </div>

              <h3 className="relative mt-5 font-black text-[#17213d]">
                {grade}
              </h3>

              <p className="relative mt-2 text-sm text-slate-500">
                {index < 3 ? t.social : t.history}
              </p>

              <div className="mt-5 h-1 w-full overflow-hidden rounded-full bg-slate-100">
                <div className="h-full w-1/3 rounded-full bg-amber-400 transition-all group-hover:w-2/3" />
              </div>
            </article>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/login"
            className="inline-flex items-center justify-center rounded-xl bg-[#17213d] px-8 py-4 font-black text-white shadow-lg shadow-slate-900/15 transition hover:-translate-y-0.5 hover:bg-[#26375e]"
          >
            {t.start} {isArabic ? "←" : "→"}
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#17213d] px-5 py-10 text-center text-white">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-amber-400/30 bg-white/5 text-2xl font-black text-amber-400">
            D
          </div>

          <p className="mt-4 text-3xl font-black tracking-widest text-white">
            DURANT
          </p>

          <div className="mx-auto mt-4 h-1 w-16 rounded-full bg-amber-400" />

          <p className="mt-4 text-sm text-slate-300">{t.footer}</p>

          <p className="mt-6 text-xs text-slate-400">{t.rights}</p>
        </div>
      </footer>
    </main>
  );
}
