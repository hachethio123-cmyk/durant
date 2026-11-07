
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Props = {
  gradeName: string;
  gradeSlug: string;
  isArabic: boolean;
};

const slides = [
  {
    id: 1,
    arTitle: "استمر في التعلم.. فالمستقبل ينتظرك!",
    enTitle: "Keep Learning... Your Future Awaits!",
    arButton: "ابدأ الآن",
    enButton: "Start Now",
    visual: "🎓",
    accent: "from-[#111b35] via-[#26395e] to-[#17213d]",
  },
  {
    id: 2,
    arTitle: "كل يوم فرصة جديدة للنجاح",
    enTitle: "Every Day Is a New Chance",
    arButton: "واصل التعلم",
    enButton: "Keep Learning",
    visual: "📚",
    accent: "from-[#10243d] via-[#294d69] to-[#17213d]",
  },
  {
    id: 3,
    arTitle: "اكتشف العالم وافهم التاريخ",
    enTitle: "Discover the World and History",
    arButton: "اكتشف موادك",
    enButton: "Explore Subjects",
    visual: "🌍",
    accent: "from-[#202443] via-[#554b4c] to-[#17213d]",
  },
  {
    id: 4,
    arTitle: "لا تتوقف حتى تصل إلى حلمك",
    enTitle: "Never Stop Chasing Your Dreams",
    arButton: "ابدأ الآن",
    enButton: "Get Started",
    visual: "🏆",
    accent: "from-[#17213d] via-[#354969] to-[#78603d]",
  },
  {
    id: 5,
    arTitle: "ديورانت.. طريقك نحو التميّز",
    enTitle: "DURANT — Your Path to Excellence",
    arButton: "انطلق نحو النجاح",
    enButton: "Start Your Journey",
    visual: "✨",
    accent: "from-[#101a35] via-[#293d61] to-[#17213d]",
  },
];

export default function DashboardHero({
  gradeName,
  gradeSlug,
  isArabic,
}: Props) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % slides.length);
    }, 5000);

    return () => window.clearInterval(timer);
  }, []);

  const slide = slides[activeIndex];

  function changeSlide(direction: number) {
    setActiveIndex(
      (current) => (current + direction + slides.length) % slides.length
    );
  }

  return (
    <section
      dir={isArabic ? "rtl" : "ltr"}
      aria-label={isArabic ? "بانر لوحة التحكم" : "Dashboard banner"}
      className={`group relative isolate h-[145px] w-full overflow-hidden rounded-[14px] bg-gradient-to-r ${slide.accent} text-white shadow-[0_8px_25px_rgba(23,33,61,0.13)] sm:h-[170px] lg:h-[185px]`}
    >
      {/* خلفية زخرفية */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -left-12 -top-20 h-52 w-52 rounded-full bg-blue-300/10 blur-3xl" />
        <div className="absolute -right-8 -bottom-24 h-56 w-56 rounded-full bg-amber-300/15 blur-3xl" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#101a35]/35 to-transparent" />
      </div>

      {/* الجانب المصور */}
      <div
        key={slide.id}
        className="absolute bottom-0 right-0 top-0 flex w-[43%] items-center justify-center"
      >
        <div className="absolute inset-0 bg-gradient-to-l from-transparent via-amber-100/5 to-transparent" />

        <div className="relative flex h-full w-full items-center justify-center">
          {/* إضاءة خلفية */}
          <div className="absolute h-28 w-28 rounded-full bg-amber-200/20 blur-2xl sm:h-40 sm:w-40" />

          {/* العنصر الرئيسي */}
          <span className="relative z-10 select-none text-[76px] drop-shadow-[0_12px_12px_rgba(0,0,0,0.35)] transition-transform duration-700 group-hover:scale-105 sm:text-[100px] lg:text-[112px]">
            {slide.visual}
          </span>

          {/* عناصر تعليمية صغيرة */}
          <span className="absolute bottom-5 left-[12%] rotate-[-12deg] text-2xl opacity-90 sm:text-3xl">
            ✏️
          </span>

          <span className="absolute right-[10%] top-4 text-xl text-amber-200 sm:text-3xl">
            ✧
          </span>

          <span className="absolute bottom-8 right-[12%] text-lg text-amber-200 sm:text-2xl">
            ✦
          </span>

          <span className="absolute left-[28%] top-5 text-lg text-white/70 sm:text-2xl">
            ✧
          </span>
        </div>
      </div>

      {/* طبقة فصل النص عن الصورة */}
      <div className="pointer-events-none absolute inset-y-0 right-[34%] w-[25%] bg-gradient-to-l from-transparent to-[#17213d]/25" />

      {/* النص والزر */}
      <div className="absolute inset-y-0 left-0 z-20 flex w-[61%] flex-col items-center justify-center px-3 text-center sm:px-5">
        <h1
          key={`${slide.id}-${isArabic}`}
          className="max-w-[390px] animate-[heroFade_.5s_ease-out] text-[18px] font-black leading-[1.55] text-white drop-shadow-sm sm:text-[24px] lg:text-[27px]"
        >
          {isArabic ? slide.arTitle : slide.enTitle}
        </h1>

        {/* الخط الذهبي */}
        <div className="mt-1.5 h-[3px] w-14 rounded-full bg-gradient-to-r from-amber-300 to-yellow-500 sm:mt-2 sm:w-20" />

        <Link
          href={`/grades/${gradeSlug}`}
          className="mt-2.5 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-amber-300 to-yellow-500 px-4 py-1.5 text-[10px] font-black text-[#17213d] shadow-md shadow-black/20 transition duration-300 hover:-translate-y-0.5 hover:shadow-lg sm:mt-3 sm:px-5 sm:py-2 sm:text-xs"
        >
          {isArabic ? slide.arButton : slide.enButton}
          <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#17213d]/10 text-[10px]">
            {isArabic ? "◀" : "▶"}
          </span>
        </Link>

        <span className="sr-only">{gradeName}</span>
      </div>

      {/* نقاط التنقل */}
      <div className="absolute bottom-2 left-1/2 z-30 flex -translate-x-1/2 items-center gap-1.5">
        {slides.map((item, index) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setActiveIndex(index)}
            aria-label={
              isArabic ? `الشريحة ${index + 1}` : `Slide ${index + 1}`
            }
            aria-current={activeIndex === index}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              activeIndex === index
                ? "w-5 bg-amber-300"
                : "w-1.5 bg-white/60 hover:bg-white"
            }`}
          />
        ))}
      </div>

      {/* أزرار السابق والتالي */}
      <div className="absolute bottom-2 left-2 z-30 flex gap-1 opacity-100 transition sm:opacity-0 sm:group-hover:opacity-100">
        <button
          type="button"
          onClick={() => changeSlide(-1)}
          aria-label={isArabic ? "الشريحة السابقة" : "Previous slide"}
          className="flex h-6 w-6 items-center justify-center rounded-full border border-white/20 bg-black/20 text-xs text-white backdrop-blur-sm transition hover:bg-white/20"
        >
          {isArabic ? "→" : "←"}
        </button>

        <button
          type="button"
          onClick={() => changeSlide(1)}
          aria-label={isArabic ? "الشريحة التالية" : "Next slide"}
          className="flex h-6 w-6 items-center justify-center rounded-full border border-white/20 bg-black/20 text-xs text-white backdrop-blur-sm transition hover:bg-white/20"
        >
          {isArabic ? "←" : "→"}
        </button>
      </div>
    </section>
  );
}
