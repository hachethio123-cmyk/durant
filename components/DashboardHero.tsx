
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

type Props = {
  gradeName: string;
  gradeSlug: string;
  isArabic: boolean;
};

const slides = [
  {
    id: 1,
    eyebrow: "DURANT EDUCATIONAL PLATFORM",
    arTitle: "رحلتك نحو التفوق تبدأ هنا",
    enTitle: "Your Journey to Excellence Starts Here",
    arText: "مع مستر أمير عبد الناصر، اجعل التعلم طريقك إلى النجاح.",
    enText: "Learn, grow and achieve your goals with DURANT.",
    arButton: "ابدأ رحلتك",
    enButton: "Start Learning",
    style: "from-[#101a35] via-[#23375d] to-[#17213d]",
    visual: "teacher",
  },
  {
    id: 2,
    eyebrow: "LEARN EVERY DAY",
    arTitle: "كل يوم فرصة جديدة للنجاح",
    enTitle: "Every Day Is a New Chance",
    arText: "خطوة صغيرة في التعلم اليوم تصنع فرقًا كبيرًا غدًا.",
    enText: "Small steps today lead to great achievements tomorrow.",
    arButton: "واصل التعلم",
    enButton: "Keep Learning",
    style: "from-[#102c43] via-[#176b83] to-[#17213d]",
    visual: "student",
  },
  {
    id: 3,
    eyebrow: "HISTORY & GEOGRAPHY",
    arTitle: "اكتشف العالم وافهم التاريخ",
    enTitle: "Discover the World",
    arText: "رحلة ممتعة بين الحضارات والأماكن والأحداث.",
    enText: "Explore civilizations, places and important events.",
    arButton: "اكتشف موادك",
    enButton: "Explore Subjects",
    style: "from-[#352449] via-[#75502e] to-[#17213d]",
    visual: "world",
  },
  {
    id: 4,
    eyebrow: "DREAM • WORK • ACHIEVE",
    arTitle: "لا تتوقف حتى تصل إلى حلمك",
    enTitle: "Never Stop Chasing Your Dreams",
    arText: "اجتهد اليوم، وافتخر بنفسك غدًا.",
    enText: "Work hard today and make yourself proud tomorrow.",
    arButton: "ابدأ الآن",
    enButton: "Get Started",
    style: "from-[#17213d] via-[#344b72] to-[#8b642e]",
    visual: "motivation",
  },
  {
    id: 5,
    eyebrow: "WELCOME TO DURANT",
    arTitle: "ديورانت.. طريقك نحو التميّز",
    enTitle: "DURANT — Your Path to Excellence",
    arText: "هنا تبدأ الحكاية، وبالعلم نصنع المستقبل. تعلّم، اجتهد، وتألق.",
    enText: "Learn, work hard and shine. Your future starts here.",
    arButton: "انطلق نحو النجاح",
    enButton: "Start Your Journey",
    style: "from-[#101a35] via-[#263b61] to-[#17213d]",
    visual: "logo",
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
      className="group relative min-h-[320px] overflow-hidden rounded-[28px] bg-[#17213d] text-white shadow-[0_18px_50px_rgba(23,33,61,0.18)] sm:min-h-[350px] lg:min-h-[370px]"
    >
      {slides.map((item, index) => (
        <div
          key={item.id}
          aria-hidden={activeIndex !== index}
          className={`absolute inset-0 bg-gradient-to-br ${item.style} transition-opacity duration-700 ${
            activeIndex === index
              ? "z-10 opacity-100"
              : "z-0 opacity-0"
          }`}
        >
          {item.visual === "teacher" && (
            <>
              <div className="absolute bottom-0 left-0 top-0 w-[48%]">
                <Image
                  src="/images/ameer-nasser.jpg"
                  alt="مستر أمير عبد الناصر"
                  fill
                  priority
                  sizes="(max-width: 768px) 45vw, 48vw"
                  className="object-cover object-top opacity-90"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#17213d]/20 to-[#17213d]" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-l from-[#17213d]/20 via-transparent to-transparent" />
            </>
          )}

          {item.visual === "student" && (
            <div className="absolute bottom-0 left-4 flex h-full w-[40%] items-end justify-center">
              <div className="mb-10 flex h-52 w-52 items-center justify-center rounded-full border border-white/10 bg-white/10 text-[105px] shadow-2xl backdrop-blur-sm sm:h-64 sm:w-64 sm:text-[130px]">
                📖
              </div>
              <span className="absolute bottom-12 left-5 text-4xl text-amber-300">✦</span>
              <span className="absolute left-12 top-16 text-3xl text-white/60">✧</span>
            </div>
          )}

          {item.visual === "world" && (
            <div className="absolute bottom-0 left-3 flex h-full w-[42%] items-center justify-center">
              <div className="relative flex h-52 w-52 items-center justify-center rounded-full border border-amber-200/30 bg-white/5 text-8xl shadow-2xl backdrop-blur-sm sm:h-64 sm:w-64 sm:text-9xl">
                🌍
                <span className="absolute -right-2 top-5 text-5xl">🏛️</span>
                <span className="absolute -bottom-2 left-1 text-4xl">📜</span>
              </div>
            </div>
          )}

          {item.visual === "motivation" && (
            <div className="absolute bottom-0 left-0 flex h-full w-[42%] items-center justify-center">
              <div className="relative flex h-52 w-52 items-center justify-center rounded-full border-[2px] border-amber-300/40 bg-amber-300/10 text-8xl shadow-[0_0_80px_rgba(245,184,55,0.18)] sm:h-64 sm:w-64 sm:text-9xl">
                🏆
                <span className="absolute -right-2 top-3 text-4xl text-amber-200">✦</span>
                <span className="absolute -bottom-1 left-2 text-3xl text-amber-200">✧</span>
              </div>
            </div>
          )}

          {item.visual === "logo" && (
            <div className="absolute bottom-0 left-0 flex h-full w-[42%] items-center justify-center">
              <div className="flex h-52 w-52 flex-col items-center justify-center rounded-full border-2 border-amber-300/50 bg-white/5 shadow-[0_0_70px_rgba(245,184,55,0.15)] backdrop-blur-sm sm:h-64 sm:w-64">
                <span className="text-8xl font-black text-amber-300 sm:text-9xl">D</span>
                <span className="mt-1 text-xs font-black tracking-[0.35em] text-white">
                  DURANT
                </span>
                <span className="mt-2 text-2xl">📚 🎓</span>
              </div>
            </div>
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-[#101a35]/45 to-transparent" />
        </div>
      ))}

      <div className="relative z-20 flex min-h-[320px] items-center px-6 py-10 sm:min-h-[350px] sm:px-10 lg:min-h-[370px] lg:px-12">
        <div className="max-w-[680px]">
          <p className="text-[10px] font-black tracking-[0.24em] text-amber-300 sm:text-xs">
            {slide.eyebrow}
          </p>

          <h1 className="mt-5 max-w-[620px] text-3xl font-black leading-[1.55] sm:text-4xl lg:text-[43px]">
            {isArabic ? slide.arTitle : slide.enTitle}
          </h1>

          <p className="mt-3 max-w-[520px] text-sm leading-8 text-blue-100 sm:text-base">
            {isArabic ? slide.arText : slide.enText}
          </p>

          <p className="mt-3 text-xs font-bold text-amber-200/90">
            {gradeName}
          </p>

          <Link
            href={`/grades/${gradeSlug}`}
            className="mt-6 inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-amber-300 to-yellow-500 px-7 py-3 text-sm font-black text-[#17213d] shadow-lg shadow-black/20 transition duration-300 hover:-translate-y-1 hover:shadow-amber-300/30"
          >
            {isArabic ? slide.arButton : slide.enButton}
            <span aria-hidden="true">{isArabic ? "←" : "→"}</span>
          </Link>
        </div>
      </div>

      <div className="absolute bottom-5 end-6 z-30 flex items-center gap-2 sm:end-10">
        {slides.map((item, index) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setActiveIndex(index)}
            aria-label={
              isArabic
                ? `الشريحة ${index + 1}`
                : `Slide ${index + 1}`
            }
            aria-current={activeIndex === index}
            className={`h-2 rounded-full transition-all duration-300 ${
              activeIndex === index
                ? "w-8 bg-amber-300"
                : "w-2 bg-white/50 hover:bg-white"
            }`}
          />
        ))}
      </div>

      <div className="absolute bottom-4 start-5 z-30 flex gap-2 opacity-100 transition sm:opacity-0 sm:group-hover:opacity-100">
        <button
          type="button"
          onClick={() => changeSlide(-1)}
          aria-label={isArabic ? "الشريحة السابقة" : "Previous slide"}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-black/20 text-lg text-white backdrop-blur-sm transition hover:bg-white/20"
        >
          {isArabic ? "→" : "←"}
        </button>
        <button
          type="button"
          onClick={() => changeSlide(1)}
          aria-label={isArabic ? "الشريحة التالية" : "Next slide"}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-black/20 text-lg text-white backdrop-blur-sm transition hover:bg-white/20"
        >
          {isArabic ? "←" : "→"}
        </button>
      </div>
    </section>
  );
}
