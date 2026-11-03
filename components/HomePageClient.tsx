
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
    enter: "دخول المنصة ←",
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
    enter: "Enter Platform →",
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
        className="flex min-h-screen items-center justify-center bg-slate-950"
        aria-busy="true"
      >
        <div className="text-center">
          <p className="text-3xl font-black tracking-widest text-yellow-400">
            DURANT
          </p>
          <div className="mx-auto mt-5 h-1 w-16 animate-pulse rounded-full bg-yellow-400" />
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
      className="min-h-screen overflow-hidden bg-slate-950 text-white"
    >
      <nav className="border-b border-yellow-400/20 bg-slate-950/95">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-5 py-5">
          <Link href="/" className="text-3xl font-black tracking-widest text-yellow-400">
            DURANT
          </Link>

          <div className="flex flex-wrap items-center gap-3">
            <select
              aria-label="Choose language"
              value={language}
              onChange={(e) => setLanguage(e.target.value as "ar" | "en")}
              className="rounded-xl border border-yellow-400/40 bg-slate-900 px-3 py-2 text-sm font-bold text-white outline-none"
            >
              <option value="ar">العربية</option>
              <option value="en">English</option>
            </select>

            <Link
              href="/login"
              className="rounded-xl border border-yellow-400/40 px-4 py-2 text-sm font-bold text-yellow-400 transition hover:bg-yellow-400/10"
            >
              {t.login}
            </Link>

            <Link
              href="/login"
              className="rounded-xl bg-yellow-400 px-4 py-2 text-sm font-black text-slate-950 transition hover:bg-yellow-300"
            >
              {t.signup}
            </Link>
          </div>
        </div>
      </nav>

      <section className="relative">
        <div className="pointer-events-none absolute -left-40 top-10 h-96 w-96 rounded-full bg-yellow-400/10 blur-3xl" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-5 py-14 md:grid-cols-2 md:py-24">
          <div>
            <p className="text-sm font-black tracking-[0.2em] text-yellow-400">
              WELCOME TO DURANT
            </p>

            <h1 className="mt-6 text-4xl font-black leading-relaxed sm:text-5xl lg:text-6xl">
              {t.welcome}
              <span className="block text-yellow-400">{t.begins}</span>
            </h1>

            <div className="my-6 h-1 w-24 rounded-full bg-yellow-400" />

            <h2 className="text-xl font-black sm:text-2xl">{t.platform}</h2>

            <p className="mt-5 max-w-xl text-base leading-9 text-slate-300">
              {t.description}
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/dashboard"
                className="rounded-xl bg-yellow-400 px-7 py-4 font-black text-slate-950 transition hover:bg-yellow-300"
              >
                {t.enter}
              </Link>

              <Link
                href="/login"
                className="rounded-xl border border-yellow-400/40 px-7 py-4 font-bold text-yellow-400 transition hover:bg-yellow-400/10"
              >
                {t.newAccount}
              </Link>
            </div>
          </div>

          <div className="relative mx-auto flex min-h-[340px] w-full max-w-md items-end justify-center overflow-hidden rounded-3xl border border-yellow-400/30 bg-gradient-to-br from-yellow-900/30 to-slate-900 px-5 pt-8 shadow-2xl shadow-yellow-950/20 md:min-h-[480px]">
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-yellow-500/10 to-transparent" />

            <Image
              src="/images/ameer-nasser.jpg"
              alt={t.teacher}
              width={500}
              height={700}
              priority
              className="relative z-10 max-h-[450px] w-auto object-contain"
            />

            <div className="absolute bottom-5 left-4 right-4 z-20 rounded-xl border border-yellow-400/20 bg-slate-950/90 p-4 text-center backdrop-blur">
              <p className="font-black text-yellow-400">{t.teacher}</p>
              <p className="mt-1 text-xs text-slate-300">{t.teacherQuote}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-slate-800 bg-slate-900/60 px-5 py-16">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <p className="text-sm font-bold tracking-widest text-yellow-400">
              ABOUT DURANT
            </p>

            <h2 className="mt-3 text-3xl font-black">{t.about}</h2>

            <p className="mx-auto mt-4 max-w-2xl leading-8 text-slate-400">
              {t.aboutDescription}
            </p>
          </div>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {t.features.map((feature) => (
              <article
                key={feature.title}
                className="rounded-2xl border border-yellow-400/20 bg-slate-950 p-6"
              >
                <div className="text-4xl">{feature.icon}</div>
                <h3 className="mt-5 text-xl font-black text-yellow-400">
                  {feature.title}
                </h3>
                <p className="mt-3 text-sm leading-8 text-slate-400">
                  {feature.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-16">
        <div className="text-center">
          <p className="text-sm font-bold tracking-widest text-yellow-400">
            ACADEMIC GRADES
          </p>

          <h2 className="mt-3 text-3xl font-black">{t.gradesTitle}</h2>

          <p className="mt-4 text-slate-400">{t.gradesDescription}</p>
        </div>

        <div className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {t.grades.map((grade, index) => (
            <article
              key={grade}
              className="rounded-2xl border border-yellow-400/20 bg-slate-900 p-6 transition hover:border-yellow-400/60"
            >
              <div className="text-3xl">🎓</div>
              <h3 className="mt-4 font-black text-yellow-400">{grade}</h3>
              <p className="mt-2 text-sm text-slate-400">
                {t.social}
                {index >= 3 ? ` - ${t.history}` : ""}
              </p>
            </article>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/login"
            className="inline-block rounded-xl bg-yellow-400 px-8 py-4 font-black text-slate-950 transition hover:bg-yellow-300"
          >
            {t.start}
          </Link>
        </div>
      </section>

      <footer className="border-t border-slate-800 bg-slate-900 px-5 py-9 text-center">
        <p className="text-3xl font-black tracking-widest text-yellow-400">
          DURANT
        </p>

        <p className="mt-3 text-sm text-slate-400">{t.footer}</p>

        <p className="mt-5 text-xs text-slate-500">{t.rights}</p>
      </footer>
    </main>
  );
}
