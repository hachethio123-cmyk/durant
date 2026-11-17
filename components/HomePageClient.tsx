
"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "@/components/ThemeProvider";

const timeline = [
  {
    year: "3100 ق.م",
    ar: "بداية التاريخ المصري القديم",
    en: "The beginning of Ancient Egyptian history",
    detailAr: "رحلة إلى بدايات واحدة من أعظم الحضارات في التاريخ.",
    detailEn: "Explore the beginnings of one of history's greatest civilizations.",
    icon: "𓂀",
  },
  {
    year: "332 ق.م",
    ar: "دخول الإسكندر الأكبر مصر",
    en: "Alexander the Great enters Egypt",
    detailAr: "حدث مهم غيّر مسار التاريخ المصري.",
    detailEn: "An important event that changed the course of Egyptian history.",
    icon: "⚔️",
  },
  {
    year: "1798",
    ar: "الحملة الفرنسية على مصر",
    en: "The French campaign in Egypt",
    detailAr: "محطة تاريخية تركت أثرًا كبيرًا في مصر الحديثة.",
    detailEn: "A historical milestone that influenced modern Egypt.",
    icon: "📜",
  },
];

const questions = [
  {
    ar: "ما النهر الذي ارتبط بقيام الحضارة المصرية القديمة؟",
    en: "Which river was associated with the rise of Ancient Egyptian civilization?",
    answersAr: ["نهر النيل", "نهر الأمازون", "نهر دجلة"],
    answersEn: ["The Nile", "The Amazon", "The Tigris"],
    correct: 0,
    explanationAr: "نهر النيل كان أساس الزراعة والاستقرار وقيام الحضارة المصرية القديمة.",
    explanationEn: "The Nile supported agriculture, settlement and the rise of Ancient Egyptian civilization.",
  },
  {
    ar: "في أي قارة تقع مصر؟",
    en: "On which continent is Egypt located?",
    answersAr: ["أوروبا", "أفريقيا", "أمريكا الجنوبية"],
    answersEn: ["Europe", "Africa", "South America"],
    correct: 1,
    explanationAr: "تقع مصر في شمال شرق قارة أفريقيا، وتمتد شبه جزيرة سيناء إلى آسيا.",
    explanationEn: "Egypt is in northeastern Africa, with the Sinai Peninsula extending into Asia.",
  },
];

export default function HomePageClient() {
  const { language, setLanguage, languageReady } = useLanguage();
  const [activeEra, setActiveEra] = useState(0);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);

  if (!languageReady) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#101a32]">
        <div className="text-center">
          <p className="text-4xl font-black tracking-[0.25em] text-white">DURANT</p>
          <div className="mx-auto mt-5 h-1 w-16 animate-pulse rounded-full bg-amber-400" />
        </div>
      </main>
    );
  }

  const ar = language === "ar";
  const q = questions[questionIndex];

  const nextQuestion = () => {
    setQuestionIndex((current) => (current + 1) % questions.length);
    setSelectedAnswer(null);
    setShowAnswer(false);
  };

  return (
    <main
      dir={ar ? "rtl" : "ltr"}
      lang={language}
      className="min-h-screen overflow-hidden bg-[#f5f7fc] text-[#17213d] selection:bg-amber-200"
    >
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b border-white/70 bg-white/90 shadow-sm backdrop-blur-2xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-5 py-3">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#17213d] text-xl font-black text-amber-400 shadow-lg shadow-[#17213d]/20">
              D
            </div>
            <div>
              <p className="text-xl font-black tracking-[0.16em] text-[#17213d]">DURANT</p>
              <p className="text-[9px] font-bold tracking-[0.2em] text-slate-400">LEARN · EXPLORE · ACHIEVE</p>
            </div>
          </Link>

          <div className="hidden items-center gap-7 text-sm font-bold text-slate-600 md:flex">
            <a href="#discover" className="transition hover:text-amber-600">{ar ? "اكتشف المنصة" : "Discover"}</a>
            <a href="#timeline" className="transition hover:text-amber-600">{ar ? "آلة الزمن" : "Time Machine"}</a>
            <a href="#challenge" className="transition hover:text-amber-600">{ar ? "التحدي" : "Challenge"}</a>
          </div>

          <div className="flex items-center gap-2">
            <select
              aria-label="Choose language"
              value={language}
              onChange={(e) => setLanguage(e.target.value as "ar" | "en")}
              className="rounded-xl border border-slate-200 bg-slate-50 px-2 py-2 text-xs font-bold outline-none"
            >
              <option value="ar">العربية</option>
              <option value="en">English</option>
            </select>
            <Link
              href="/login"
              className="hidden rounded-xl border border-[#17213d]/15 px-4 py-2.5 text-sm font-bold transition hover:border-amber-400 sm:inline-flex"
            >
              {ar ? "تسجيل الدخول" : "Log in"}
            </Link>
            <Link
              href="/login"
              className="rounded-xl bg-[#17213d] px-4 py-2.5 text-sm font-black text-white shadow-lg shadow-[#17213d]/15 transition hover:-translate-y-0.5 hover:bg-[#26375e]"
            >
              {ar ? "ابدأ الآن" : "Get Started"}
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative isolate overflow-hidden bg-[#101a32] text-white">
        <div className="pointer-events-none absolute inset-0 opacity-20" style={{
          backgroundImage: "radial-gradient(#d9b76b 0.8px, transparent 0.8px)",
          backgroundSize: "27px 27px",
        }} />
        <div className="pointer-events-none absolute -right-40 top-0 h-[500px] w-[500px] rounded-full bg-blue-500/20 blur-[110px]" />
        <div className="pointer-events-none absolute -bottom-52 left-0 h-[500px] w-[500px] rounded-full bg-amber-400/10 blur-[110px]" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-5 py-16 md:grid-cols-[1.1fr_0.9fr] md:py-24">
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-300/30 bg-white/[0.07] px-4 py-2 text-xs font-bold text-amber-200 backdrop-blur">
              <span className="h-2 w-2 animate-pulse rounded-full bg-amber-400" />
              {ar ? "عالم جديد من التعلم يبدأ هنا" : "A new world of learning starts here"}
            </div>

            <h1 className="mt-7 text-4xl font-black leading-[1.45] sm:text-5xl lg:text-6xl">
              {ar ? "التاريخ مش مجرد" : "History is more than"}
              <span className="block bg-gradient-to-l from-amber-200 via-yellow-400 to-amber-500 bg-clip-text text-transparent">
                {ar ? "صفحات في كتاب..." : "pages in a book..."}
              </span>
              <span className="block text-white">
                {ar ? "دي رحلة تعيشها!" : "It's a journey to experience!"}
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-base leading-9 text-slate-300 sm:text-lg">
              {ar
                ? "اكتشف الحضارات، واستكشف العالم، واختبر معلوماتك. تجربة تعليمية تجمع بين المتعة والتقدم الحقيقي مع مستر أمير عبد الناصر."
                : "Discover civilizations, explore the world and test your knowledge. An educational experience combining fun and real progress with Mr. Amir Abdel Nasser."}
            </p>

            <div className="mt-9 flex flex-wrap gap-3">
              <Link
                href="/login"
                className="group inline-flex items-center gap-3 rounded-2xl bg-gradient-to-r from-amber-300 to-yellow-500 px-7 py-4 font-black text-[#17213d] shadow-xl shadow-amber-500/20 transition duration-300 hover:-translate-y-1 hover:shadow-amber-400/30"
              >
                {ar ? "ابدأ رحلتك التعليمية" : "Start your learning journey"}
                <span className="text-xl transition group-hover:translate-x-1">{ar ? "←" : "→"}</span>
              </Link>
              <a
                href="#discover"
                className="inline-flex items-center gap-2 rounded-2xl border border-white/20 bg-white/[0.06] px-6 py-4 font-bold text-white backdrop-blur transition hover:bg-white/10"
              >
                <span>✦</span>
                {ar ? "اكتشف عالم DURANT" : "Explore DURANT"}
              </a>
            </div>

            <div className="mt-10 flex flex-wrap gap-x-7 gap-y-3 text-xs font-bold text-slate-400">
              <span>✦ {ar ? "تعلم تفاعلي" : "Interactive learning"}</span>
              <span>✦ {ar ? "تقدم وإنجازات" : "Progress & achievements"}</span>
              <span>✦ {ar ? "تاريخ وجغرافيا" : "History & Geography"}</span>
            </div>
          </div>

          {/* Teacher visual */}
          <div className="relative mx-auto w-full max-w-[440px]">
            <div className="absolute -inset-5 rounded-[3rem] bg-gradient-to-br from-amber-300/30 via-blue-400/10 to-transparent blur-2xl" />
            <div className="absolute -inset-1 rounded-[2.5rem] border border-amber-300/20" />
            <div className="relative overflow-hidden rounded-[2.3rem] border border-white/10 bg-gradient-to-br from-[#26385e] to-[#17213d] p-3 shadow-2xl shadow-black/40">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(245,190,75,0.18),transparent_50%)]" />
              <div className="relative flex min-h-[390px] items-end justify-center overflow-hidden rounded-[1.8rem] bg-gradient-to-b from-[#34486d] to-[#17213d] pt-8 sm:min-h-[490px]">
                <div className="absolute left-5 top-5 z-20 rounded-full border border-white/15 bg-black/20 px-4 py-2 text-[10px] font-black tracking-[0.18em] text-amber-200 backdrop-blur">
                  DURANT EDUCATION
                </div>
                <div className="pointer-events-none absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full border border-amber-300/15" />
                <div className="pointer-events-none absolute left-1/2 top-1/2 h-60 w-60 -translate-x-1/2 -translate-y-1/2 rounded-full border border-amber-300/10" />
                <Image
                  src="/images/ameer-nasser.jpg"
                  alt={ar ? "مستر أمير عبد الناصر" : "Mr. Amir Abdel Nasser"}
                  width={500}
                  height={700}
                  priority
                  className="relative z-10 max-h-[430px] w-auto object-contain drop-shadow-2xl"
                />
                <div className="absolute inset-x-3 bottom-3 z-20 rounded-2xl border border-white/15 bg-[#101a32]/85 p-4 text-center shadow-xl backdrop-blur-xl">
                  <p className="text-lg font-black">{ar ? "مستر أمير عبد الناصر" : "Mr. Amir Abdel Nasser"}</p>
                  <p className="mt-1 text-xs text-amber-200">{ar ? "معًا نحو التفوق والنجاح" : "Together towards excellence and success"}</p>
                </div>
              </div>
            </div>

            <div className="absolute -left-5 top-20 hidden rounded-2xl border border-white/10 bg-[#243657]/90 p-4 shadow-xl backdrop-blur-xl sm:block">
              <span className="text-2xl">🏆</span>
              <p className="mt-1 text-xs font-black text-white">{ar ? "كل إنجاز له قيمة" : "Every achievement matters"}</p>
            </div>
            <div className="absolute -right-5 bottom-24 hidden rounded-2xl border border-white/10 bg-[#243657]/90 p-4 shadow-xl backdrop-blur-xl sm:block">
              <span className="text-2xl">🌍</span>
              <p className="mt-1 text-xs font-black text-white">{ar ? "العالم بين يديك" : "The world is yours to explore"}</p>
            </div>
          </div>
        </div>

        <div className="relative mx-auto max-w-7xl px-5 pb-8">
          <div className="h-px bg-gradient-to-r from-transparent via-amber-300/40 to-transparent" />
          <div className="grid grid-cols-3 gap-3 py-6 text-center">
            <div>
              <p className="text-xl font-black text-amber-300">01</p>
              <p className="mt-1 text-xs text-slate-400">{ar ? "اكتشف" : "Discover"}</p>
            </div>
            <div className="border-x border-white/10">
              <p className="text-xl font-black text-amber-300">02</p>
              <p className="mt-1 text-xs text-slate-400">{ar ? "تعلّم" : "Learn"}</p>
            </div>
            <div>
              <p className="text-xl font-black text-amber-300">03</p>
              <p className="mt-1 text-xs text-slate-400">{ar ? "تفوّق" : "Achieve"}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Discover */}
      <section id="discover" className="relative px-5 py-20 md:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-black tracking-[0.25em] text-amber-600">THE WORLD OF DURANT</p>
            <h2 className="mt-4 text-3xl font-black sm:text-4xl">
              {ar ? "مش مجرد منصة... ده عالم تكتشفه" : "More than a platform... a world to explore"}
            </h2>
            <p className="mt-4 leading-8 text-slate-500">
              {ar
                ? "كل قسم يفتح لك بابًا جديدًا للفهم والاستكشاف والتعلم."
                : "Every section opens a new door to understanding, discovery and learning."}
            </p>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-3">
            <Link href="/login" className="group relative min-h-[300px] overflow-hidden rounded-[2rem] bg-[#17213d] p-7 text-white shadow-xl transition duration-500 hover:-translate-y-2 hover:shadow-2xl">
              <div className="absolute -right-10 -top-10 h-48 w-48 rounded-full bg-amber-400/20 blur-3xl transition group-hover:scale-150" />
              <div className="relative flex h-full flex-col">
                <span className="text-5xl">🏺</span>
                <p className="mt-8 text-xs font-black tracking-widest text-amber-300">HISTORY</p>
                <h3 className="mt-2 text-2xl font-black">{ar ? "عُد بالزمن إلى الماضي" : "Travel back in time"}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-300">{ar ? "اكتشف الحضارات والأحداث والشخصيات التي صنعت التاريخ." : "Discover civilizations, events and people who shaped history."}</p>
                <span className="mt-auto pt-7 text-sm font-black text-amber-300">{ar ? "اكتشف التاريخ ←" : "Explore history →"}</span>
              </div>
            </Link>

            <Link href="/login" className="group relative min-h-[300px] overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#dceafa] to-[#b9d4f0] p-7 text-[#17213d] shadow-xl transition duration-500 hover:-translate-y-2 hover:shadow-2xl">
              <div className="absolute -right-8 -top-8 h-48 w-48 rounded-full bg-blue-400/30 blur-3xl transition group-hover:scale-150" />
              <div className="relative flex h-full flex-col">
                <span className="text-5xl">🌍</span>
                <p className="mt-8 text-xs font-black tracking-widest text-blue-700">GEOGRAPHY</p>
                <h3 className="mt-2 text-2xl font-black">{ar ? "اكتشف كوكبك" : "Explore your planet"}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">{ar ? "افهم الخرائط والظواهر الطبيعية وتوزيع السكان والموارد." : "Understand maps, natural phenomena, population and resources."}</p>
                <span className="mt-auto pt-7 text-sm font-black text-blue-800">{ar ? "اكتشف الجغرافيا ←" : "Explore geography →"}</span>
              </div>
            </Link>

            <Link href="/login" className="group relative min-h-[300px] overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#f8e9c9] to-[#f2d9a7] p-7 text-[#17213d] shadow-xl transition duration-500 hover:-translate-y-2 hover:shadow-2xl">
              <div className="absolute -right-8 -top-8 h-48 w-48 rounded-full bg-amber-400/30 blur-3xl transition group-hover:scale-150" />
              <div className="relative flex h-full flex-col">
                <span className="text-5xl">📚</span>
                <p className="mt-8 text-xs font-black tracking-widest text-amber-800">SOCIAL STUDIES</p>
                <h3 className="mt-2 text-2xl font-black">{ar ? "اربط الماضي بالحاضر" : "Connect past and present"}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">{ar ? "تعلّم الدراسات الاجتماعية بطريقة تجمع المعرفة والفهم." : "Learn social studies through knowledge and understanding."}</p>
                <span className="mt-auto pt-7 text-sm font-black text-amber-900">{ar ? "ابدأ الاكتشاف ←" : "Start exploring →"}</span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Time machine */}
      <section id="timeline" className="overflow-hidden bg-[#101a32] px-5 py-20 text-white md:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="grid items-center gap-12 md:grid-cols-[0.8fr_1.2fr]">
            <div>
              <p className="text-xs font-black tracking-[0.25em] text-amber-300">THE TIME MACHINE</p>
              <h2 className="mt-4 text-3xl font-black leading-relaxed sm:text-4xl">
                {ar ? "افتح بوابة الزمن..." : "Open the time portal..."}
                <span className="block text-amber-300">{ar ? "واكتشف حكاية التاريخ" : "and discover history's story"}</span>
              </h2>
              <p className="mt-5 leading-8 text-slate-300">
                {ar ? "اختار محطة تاريخية، وشوف لمحة عن الحدث. دي مجرد بداية لرحلة تفاعلية داخل عالم التاريخ." : "Choose a historical milestone and preview the event. This is just the beginning of an interactive journey through history."}
              </p>
              <div className="mt-8 flex items-center gap-3 text-sm font-bold text-amber-200">
                <span className="text-2xl">⌛</span>
                {ar ? "كل عصر له حكاية تستحق الاكتشاف" : "Every era has a story worth discovering"}
              </div>
            </div>

            <div className="relative rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 shadow-2xl backdrop-blur-xl sm:p-8">
              <div className="absolute left-8 top-8 h-24 w-24 rounded-full bg-amber-400/10 blur-3xl" />
              <div className="relative">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-xs font-black tracking-widest text-amber-300">{ar ? "محطات عبر الزمن" : "MILESTONES THROUGH TIME"}</p>
                  <span className="rounded-full border border-white/10 px-3 py-1 text-[10px] text-slate-400">{String(activeEra + 1).padStart(2, "0")} / 03</span>
                </div>

                <div className="mt-7 flex gap-2">
                  {timeline.map((item, index) => (
                    <button
                      key={item.year}
                      onClick={() => setActiveEra(index)}
                      aria-label={`${item.year}`}
                      className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${activeEra === index ? "bg-amber-300" : "bg-white/15 hover:bg-white/30"}`}
                    />
                  ))}
                </div>

                <div className="mt-8 flex min-h-[230px] flex-col justify-center">
                  <div className="text-6xl">{timeline[activeEra].icon}</div>
                  <p className="mt-5 text-sm font-black text-amber-300">{timeline[activeEra].year}</p>
                  <h3 className="mt-2 text-2xl font-black">
                    {ar ? timeline[activeEra].ar : timeline[activeEra].en}
                  </h3>
                  <p className="mt-3 leading-7 text-slate-400">
                    {ar ? timeline[activeEra].detailAr : timeline[activeEra].detailEn}
                  </p>
                </div>

                <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-5">
                  <button
                    onClick={() => setActiveEra((activeEra + timeline.length - 1) % timeline.length)}
                    className="rounded-xl border border-white/15 px-4 py-2 text-sm font-bold transition hover:bg-white/10"
                  >
                    {ar ? "السابق" : "Previous"}
                  </button>
                  <button
                    onClick={() => setActiveEra((activeEra + 1) % timeline.length)}
                    className="rounded-xl bg-amber-300 px-5 py-2 text-sm font-black text-[#17213d] transition hover:bg-amber-200"
                  >
                    {ar ? "المحطة التالية ←" : "Next milestone →"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Geography feature */}
      <section className="px-5 py-20 md:py-28">
        <div className="mx-auto grid max-w-7xl items-center gap-12 md:grid-cols-2">
          <div className="relative mx-auto flex aspect-square w-full max-w-[440px] items-center justify-center">
            <div className="absolute inset-5 rounded-full border border-blue-200" />
            <div className="absolute inset-12 rounded-full border border-dashed border-blue-300" />
            <div className="absolute inset-[4.5rem] animate-pulse rounded-full bg-blue-400/10 blur-2xl" />
            <div className="relative flex h-[260px] w-[260px] items-center justify-center rounded-full border border-blue-200 bg-gradient-to-br from-[#d8efff] via-[#7eb8e8] to-[#24568d] shadow-[0_25px_80px_rgba(37,99,160,0.25)] sm:h-[310px] sm:w-[310px]">
              <div className="absolute inset-3 rounded-full border border-white/40" />
              <div className="absolute left-8 top-14 h-16 w-24 rotate-[-25deg] rounded-[50%] bg-emerald-300/80 blur-[1px]" />
              <div className="absolute right-10 top-20 h-24 w-16 rotate-[30deg] rounded-[50%] bg-emerald-300/80 blur-[1px]" />
              <div className="absolute bottom-12 left-20 h-20 w-16 rotate-[20deg] rounded-[50%] bg-emerald-300/80 blur-[1px]" />
              <span className="relative text-7xl drop-shadow-lg">🌍</span>
              <span className="absolute -right-3 top-16 rounded-xl border border-white bg-white px-3 py-2 text-xs font-black text-blue-900 shadow-lg">Explore</span>
              <span className="absolute -bottom-2 left-5 rounded-xl border border-white bg-white px-3 py-2 text-xs font-black text-blue-900 shadow-lg">Discover</span>
            </div>
          </div>

          <div>
            <p className="text-xs font-black tracking-[0.25em] text-blue-700">GEOGRAPHY EXPLORER</p>
            <h2 className="mt-4 text-3xl font-black leading-relaxed sm:text-4xl">
              {ar ? "مشاهدة الخريطة شيء..." : "Looking at a map is one thing..."}
              <span className="block text-blue-700">{ar ? "واكتشاف العالم شيء تاني!" : "exploring the world is another!"}</span>
            </h2>
            <p className="mt-5 leading-9 text-slate-500">
              {ar
                ? "الجغرافيا مش مجرد أسماء أماكن. افهم شكل الأرض، وتوزيع القارات، والبيئات، والعلاقة بين الإنسان والمكان."
                : "Geography is more than place names. Understand the Earth, continents, environments and the relationship between people and places."}
            </p>
            <Link href="/login" className="mt-8 inline-flex items-center gap-3 rounded-xl bg-[#17213d] px-6 py-4 font-black text-white shadow-lg transition hover:-translate-y-1 hover:bg-[#26375e]">
              {ar ? "ابدأ رحلة الاستكشاف" : "Start exploring"}
              <span>↗</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Challenge */}
      <section id="challenge" className="bg-gradient-to-br from-[#f1e6ce] via-[#fbf8f0] to-[#e9eef8] px-5 py-20 md:py-24">
        <div className="mx-auto max-w-5xl">
          <div className="text-center">
            <p className="text-xs font-black tracking-[0.25em] text-amber-700">THE DAILY BRAIN CHALLENGE</p>
            <h2 className="mt-4 text-3xl font-black sm:text-4xl">
              {ar ? "ورّينا شطارتك!" : "Show us what you know!"}
            </h2>
            <p className="mt-3 text-slate-500">{ar ? "سؤال سريع... هل تعرف الإجابة؟" : "A quick question... do you know the answer?"}</p>
          </div>

          <div className="relative mt-10 overflow-hidden rounded-[2rem] border border-white bg-white/80 p-6 shadow-xl shadow-[#17213d]/5 backdrop-blur-xl sm:p-10">
            <div className="absolute -left-16 -top-16 h-48 w-48 rounded-full bg-amber-300/20 blur-3xl" />
            <div className="relative">
              <div className="flex items-center justify-between gap-3">
                <span className="rounded-full bg-[#17213d] px-4 py-2 text-xs font-black text-white">{ar ? "اختبر معلوماتك" : "Test your knowledge"}</span>
                <span className="text-2xl">🧠</span>
              </div>

              <h3 className="mt-8 text-xl font-black leading-9 sm:text-2xl">
                {ar ? q.ar : q.en}
              </h3>

              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                {(ar ? q.answersAr : q.answersEn).map((answer, index) => {
                  const isCorrect = index === q.correct;
                  const isSelected = selectedAnswer === index;
                  let style = "border-slate-200 bg-white hover:border-amber-400 hover:bg-amber-50";
                  if (showAnswer && isCorrect) style = "border-emerald-400 bg-emerald-50 text-emerald-800";
                  else if (showAnswer && isSelected && !isCorrect) style = "border-rose-300 bg-rose-50 text-rose-800";
                  else if (isSelected) style = "border-amber-400 bg-amber-50";

                  return (
                    <button
                      key={answer}
                      disabled={showAnswer}
                      onClick={() => setSelectedAnswer(index)}
                      className={`rounded-2xl border p-4 text-sm font-black transition ${style}`}
                    >
                      <span className="me-2 inline-flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100 text-xs">{String.fromCharCode(65 + index)}</span>
                      {answer}
                    </button>
                  );
                })}
              </div>

              {showAnswer && (
                <div className={`mt-5 rounded-2xl p-4 text-sm leading-7 ${selectedAnswer === q.correct ? "bg-emerald-50 text-emerald-800" : "bg-amber-50 text-amber-900"}`}>
                  <p className="font-black">{selectedAnswer === q.correct ? (ar ? "إجابة صحيحة! أحسنت 👏" : "Correct! Well done 👏") : (ar ? "مش مشكلة، اتعلم معلومة جديدة!" : "No worries, learn something new!")}</p>
                  <p className="mt-1">{ar ? q.explanationAr : q.explanationEn}</p>
                </div>
              )}

              <div className="mt-7 flex flex-wrap items-center justify-between gap-3">
                <p className="text-xs font-medium text-slate-400">{ar ? "التحدي للتجربة والتعلم، وليس اختبارًا رسميًا." : "A fun learning activity, not an official exam."}</p>
                {!showAnswer ? (
                  <button
                    disabled={selectedAnswer === null}
                    onClick={() => setShowAnswer(true)}
                    className="rounded-xl bg-[#17213d] px-7 py-3 font-black text-white transition hover:bg-[#26375e] disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    {ar ? "تحقق من إجابتي" : "Check my answer"}
                  </button>
                ) : (
                  <button onClick={nextQuestion} className="rounded-xl bg-amber-400 px-7 py-3 font-black text-[#17213d] transition hover:bg-amber-300">
                    {ar ? "سؤال جديد ←" : "Next question →"}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Learning journey */}
      <section className="px-5 py-20 md:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-black tracking-[0.25em] text-amber-600">YOUR JOURNEY</p>
            <h2 className="mt-4 text-3xl font-black sm:text-4xl">{ar ? "كل خطوة تقرّبك من التفوق" : "Every step takes you closer to success"}</h2>
            <p className="mt-4 leading-8 text-slate-500">{ar ? "رحلتك التعليمية مش مجرد مشاهدة دروس، دي رحلة تقدم وإنجاز." : "Your learning journey is more than watching lessons. It's a journey of progress and achievement."}</p>
          </div>

          <div className="relative mt-14 grid gap-5 md:grid-cols-4">
            {[
              { icon: "📖", n: "01", ar: "تعلّم", en: "Learn", descAr: "تابع دروسك وافهم المعلومة.", descEn: "Follow lessons and understand." },
              { icon: "✍️", n: "02", ar: "اختبر نفسك", en: "Practice", descAr: "تدرّب واكتشف مستواك.", descEn: "Practice and assess yourself." },
              { icon: "⭐", n: "03", ar: "اجمع الإنجازات", en: "Achieve", descAr: "احصل على مكافآت تقدمك الحقيقية.", descEn: "Earn rewards for real progress." },
              { icon: "🏆", n: "04", ar: "تفوّق", en: "Excel", descAr: "طوّر مستواك وواصل التقدم.", descEn: "Improve and keep progressing." },
            ].map((step) => (
              <div key={step.n} className="group relative rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-2 hover:border-amber-300 hover:shadow-xl">
                <div className="flex items-center justify-between">
                  <span className="text-4xl">{step.icon}</span>
                  <span className="text-xs font-black tracking-widest text-amber-600">{step.n}</span>
                </div>
                <h3 className="mt-7 text-xl font-black">{ar ? step.ar : step.en}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-500">{ar ? step.descAr : step.descEn}</p>
                <div className="mt-6 h-1 w-10 rounded-full bg-amber-400 transition-all duration-300 group-hover:w-full" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-5 pb-20">
        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[2.5rem] bg-[#17213d] px-6 py-14 text-center text-white shadow-2xl sm:px-12 md:py-20">
          <div className="pointer-events-none absolute -left-20 -top-28 h-72 w-72 rounded-full bg-amber-400/20 blur-[80px]" />
          <div className="pointer-events-none absolute -bottom-32 -right-20 h-80 w-80 rounded-full bg-blue-400/20 blur-[90px]" />
          <div className="relative">
            <span className="text-5xl">🚀</span>
            <p className="mt-6 text-xs font-black tracking-[0.25em] text-amber-300">YOUR STORY STARTS HERE</p>
            <h2 className="mx-auto mt-4 max-w-3xl text-3xl font-black leading-relaxed sm:text-5xl">
              {ar ? "مستقبلك مش هيتكتب لوحده..." : "Your future won't write itself..."}
              <span className="block text-amber-300">{ar ? "ابدأ رحلتك مع DURANT" : "Start your journey with DURANT"}</span>
            </h2>
            <p className="mx-auto mt-5 max-w-xl leading-8 text-slate-300">
              {ar ? "خطوتك الأولى ممكن تكون بداية إنجاز كبير. مكانك مستنيك." : "Your first step could be the beginning of something great. Your place is waiting."}
            </p>
            <Link href="/login" className="mt-9 inline-flex items-center gap-3 rounded-2xl bg-gradient-to-r from-amber-300 to-yellow-500 px-9 py-4 font-black text-[#17213d] shadow-xl transition duration-300 hover:-translate-y-1 hover:shadow-amber-400/20">
              {ar ? "انضم إلى DURANT الآن" : "Join DURANT now"}
              <span>↗</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#101a32] px-5 py-12 text-center text-white">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-amber-300/30 bg-white/5 text-2xl font-black text-amber-300">D</div>
          <p className="mt-4 text-3xl font-black tracking-[0.2em]">DURANT</p>
          <p className="mt-3 text-sm text-slate-400">{ar ? "منصة ديورانت التعليمية مع مستر أمير عبد الناصر" : "DURANT Educational Platform with Mr. Amir Abdel Nasser"}</p>
          <div className="mx-auto mt-7 h-px max-w-xs bg-gradient-to-r from-transparent via-amber-300/40 to-transparent" />
          <p className="mt-6 text-xs text-slate-500">© 2026 DURANT — {ar ? "جميع الحقوق محفوظة" : "All Rights Reserved"}</p>
        </div>
      </footer>
    </main>
  );
}
