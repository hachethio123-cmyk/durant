
"use client";

type DurantWelcomeProps = {
  onEnter: () => void;
  language: "ar" | "en";
};

export default function DurantWelcome({
  onEnter,
  language,
}: DurantWelcomeProps) {
  const isArabic = language === "ar";

  const features = [
    {
      icon: "📚",
      ar: "دروس تعليمية",
      en: "Learning Lessons",
      descAr: "رحلة منظمة في التاريخ والدراسات الاجتماعية",
      descEn: "Explore history and social studies",
    },
    {
      icon: "🏆",
      ar: "الإنجازات والمستويات",
      en: "Achievements & Levels",
      descAr: "اجمع XP وارتقِ بمستواك التعليمي",
      descEn: "Earn XP and level up your journey",
    },
    {
      icon: "🪙",
      ar: "العملات الذهبية",
      en: "Gold Coins",
      descAr: "احصل على مكافآت مقابل تقدمك",
      descEn: "Get rewards as you make progress",
    },
    {
      icon: "📊",
      ar: "متابعة التقدم",
      en: "Learning Progress",
      descAr: "تابع إنجازاتك وتطور مستواك باستمرار",
      descEn: "Track your progress and achievements",
    },
    {
      icon: "📝",
      ar: "الاختبارات والتقييم",
      en: "Tests & Assessment",
      descAr: "اختبر معلوماتك واكتشف مستواك",
      descEn: "Test your knowledge and discover your level",
    },
    {
      icon: "🎓",
      ar: "تجربة تعليمية مميزة",
      en: "A Better Learning Experience",
      descAr: "تعلم بطريقة تفاعلية ومحفزة",
      descEn: "Learn through an interactive experience",
    },
  ];

  return (
    <main
      dir={isArabic ? "rtl" : "ltr"}
      className="durant-welcome fixed inset-0 z-[99999] flex min-h-screen items-center justify-center overflow-x-hidden overflow-y-auto bg-[#101a34] px-4 py-8 text-white"
    >
      <div className="welcome-stars" aria-hidden="true">
        {Array.from({ length: 18 }, (_, i) => (
          <span key={i} className={`welcome-star star-${i + 1}`}>
            ✦
          </span>
        ))}
      </div>

      <div className="welcome-orbit orbit-one" />
      <div className="welcome-orbit orbit-two" />
      <div className="welcome-glow glow-one" />
      <div className="welcome-glow glow-two" />

      <div className="relative z-10 mx-auto w-full max-w-5xl">
        <div className="welcome-content text-center">

          {/* Logo */}
          <div className="welcome-logo mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-[1.7rem] border border-[#d5ad5b]/50 bg-[#d5ad5b]/10 shadow-[0_0_65px_rgba(213,173,91,0.2)] sm:h-24 sm:w-24">
            <span className="text-6xl font-black text-[#e8c77e]">
              D
            </span>
          </div>

          <p className="text-[10px] font-bold tracking-[0.5em] text-[#d5ad5b] sm:text-xs">
            THE WORLD OF
          </p>

          <h1 className="mt-2 text-5xl font-black tracking-[0.18em] text-white sm:text-7xl">
            DURANT
          </h1>

          <div className="mx-auto mt-5 flex max-w-xs items-center gap-3">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent to-[#d5ad5b]" />
            <span className="text-xl text-[#e8c77e]">✦</span>
            <div className="h-px flex-1 bg-gradient-to-l from-transparent to-[#d5ad5b]" />
          </div>

          {/* Welcome Message */}
          <h2 className="mt-6 text-xl font-black leading-relaxed text-white sm:text-3xl">
            {isArabic
              ? "هنا تبدأ رحلة التميز"
              : "Your Journey to Excellence Begins Here"}
          </h2>

          <p className="mx-auto mt-3 max-w-xl text-sm leading-8 text-white/65 sm:text-base">
            {isArabic
              ? "كل إنجاز عظيم يبدأ بخطوة... وأنت الآن في بداية رحلتك."
              : "Every great achievement begins with a step. Your journey starts now."}
          </p>

          {/* Platform Features */}
          <section className="mt-9">
            <div className="mb-5">
              <p className="text-[10px] font-bold tracking-[0.3em] text-[#d5ad5b]">
                {isArabic ? "اكتشف عالم DURANT" : "DISCOVER DURANT"}
              </p>

              <h3 className="mt-2 text-xl font-black text-white sm:text-2xl">
                {isArabic ? "كل ما تحتاجه لرحلة تعليمية أفضل" : "Everything for a Better Learning Journey"}
              </h3>

              <p className="mt-2 text-xs text-white/45 sm:text-sm">
                {isArabic
                  ? "تعلم، أنجز، اجمع المكافآت، واصنع نجاحك."
                  : "Learn, achieve, earn rewards, and build your success."}
              </p>
            </div>

            <div className="grid grid-cols-1 gap-3 text-start sm:grid-cols-2 lg:grid-cols-3">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="welcome-feature group flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.045] p-4 text-start backdrop-blur-md transition duration-300 hover:-translate-y-1 hover:border-[#d5ad5b]/45 hover:bg-[#d5ad5b]/[0.07]"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-[#d5ad5b]/20 bg-[#d5ad5b]/10 text-2xl transition duration-300 group-hover:scale-110">
                    {feature.icon}
                  </div>

                  <div className="min-w-0">
                    <h4 className="text-sm font-black text-[#f1d89f]">
                      {isArabic ? feature.ar : feature.en}
                    </h4>
                    <p className="mt-1 text-[11px] leading-6 text-white/55">
                      {isArabic ? feature.descAr : feature.descEn}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Creator & Dedication */}
          <div className="welcome-credit mx-auto mt-9 max-w-2xl overflow-hidden rounded-3xl border border-[#d5ad5b]/35 bg-gradient-to-b from-white/[0.075] to-white/[0.025] px-5 py-7 shadow-[0_15px_70px_rgba(0,0,0,0.25)] backdrop-blur-xl sm:px-10 sm:py-9">

            <p className="text-[10px] font-bold tracking-[0.3em] text-[#d5ad5b] sm:text-xs">
              {isArabic ? "إبداع وتعليم" : "EDUCATION & EXCELLENCE"}
            </p>

            <div className="mt-6">
              <p className="text-xs font-semibold text-white/55 sm:text-sm">
                {isArabic ? "تصميم وبرمجة المنصة" : "PLATFORM DESIGN & DEVELOPMENT"}
              </p>

              <h3 className="creator-name mt-3 text-3xl font-black leading-relaxed text-[#f5d58e] sm:text-5xl">
                {isArabic ? "محمد سامح فريد" : "Mohamed Sameh Farid"}
              </h3>

              <div className="mx-auto mt-3 flex max-w-xs items-center justify-center gap-3">
                <div className="h-px flex-1 bg-gradient-to-r from-transparent to-[#d5ad5b]/70" />
                <span className="text-lg text-[#e8c77e]">✦</span>
                <div className="h-px flex-1 bg-gradient-to-l from-transparent to-[#d5ad5b]/70" />
              </div>

              <p className="mt-3 text-[10px] font-bold tracking-[0.2em] text-white/35">
                {isArabic ? "الطالب المبرمج وصاحب فكرة التطوير" : "STUDENT DEVELOPER"}
              </p>
            </div>

            <div className="mx-auto my-7 h-px w-32 bg-gradient-to-r from-transparent via-[#d5ad5b]/60 to-transparent" />

            <div>
              <p className="text-xs font-semibold text-white/55 sm:text-sm">
                {isArabic ? "إهداء وتقدير إلى" : "DEDICATED TO"}
              </p>

              <p className="mt-3 text-xl font-black text-white sm:text-3xl">
                {isArabic ? "مستر أمير عبد الناصر" : "Mr. Amir Abdel Nasser"}
              </p>

              <p className="mt-2 text-xs text-white/40">
                {isArabic
                  ? "تقديرًا لجهوده في التعليم"
                  : "With appreciation for his educational efforts"}
              </p>
            </div>

            <div className="mt-6 text-2xl text-[#d5ad5b]">
              ✨ 🎓 ✨
            </div>
          </div>

          {/* Enter Dashboard */}
          <button
            type="button"
            onClick={onEnter}
            className="welcome-enter group relative mt-9 inline-flex min-h-16 w-full max-w-sm items-center justify-center gap-4 overflow-hidden rounded-2xl border border-[#f1d89f]/80 bg-gradient-to-r from-[#c49a4d] via-[#f1d89f] to-[#c49a4d] px-8 py-4 text-base font-black text-[#17213d] shadow-[0_10px_40px_rgba(213,173,91,0.25)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_15px_55px_rgba(213,173,91,0.4)] sm:text-lg"
          >
            <span className="relative z-10">
              {isArabic ? "ابدأ التعلّم الآن" : "START LEARNING NOW"}
            </span>

            <span className="relative z-10 text-2xl transition-transform duration-300 group-hover:-translate-x-1">
              {isArabic ? "←" : "→"}
            </span>

            <span className="welcome-button-shine" />
          </button>

          <p className="mt-5 text-[9px] font-bold tracking-[0.35em] text-white/35">
            A NEW JOURNEY BEGINS
          </p>

          <p className="mt-2 text-[10px] text-white/25">
            © DURANT
          </p>
        </div>
      </div>

      <style jsx global>{`
        .durant-welcome {
          isolation: isolate;
          scrollbar-width: thin;
          scrollbar-color: rgba(213,173,91,.45) transparent;
        }

        .welcome-content {
          animation: welcomeReveal 1.2s cubic-bezier(.2,.8,.2,1) both;
        }

        .welcome-glow {
          position: absolute;
          width: 330px;
          height: 330px;
          border-radius: 50%;
          background: rgba(213,173,91,.12);
          filter: blur(100px);
          pointer-events: none;
        }

        .glow-one {
          top: -150px;
          right: -100px;
          animation: welcomeGlow 9s ease-in-out infinite alternate;
        }

        .glow-two {
          bottom: -180px;
          left: -100px;
          animation: welcomeGlow 11s ease-in-out infinite alternate-reverse;
        }

        .welcome-orbit {
          position: fixed;
          top: 50%;
          left: 50%;
          width: min(85vw, 650px);
          aspect-ratio: 1;
          border: 1px solid rgba(213,173,91,.10);
          border-radius: 50%;
          pointer-events: none;
          transform: translate(-50%, -50%);
        }

        .orbit-one {
          animation: welcomeRotate 50s linear infinite;
        }

        .orbit-two {
          width: min(65vw, 480px);
          border-color: rgba(255,255,255,.06);
          animation: welcomeRotate 65s linear infinite reverse;
        }

        .welcome-stars span {
          position: fixed;
          color: #e8c77e;
          opacity: .35;
          animation: welcomeTwinkle 3s ease-in-out infinite alternate;
          pointer-events: none;
        }

        ${Array.from({ length: 18 }, (_, i) => {
          const positions = [
            ["8%", "15%"], ["85%", "12%"], ["15%", "75%"],
            ["90%", "80%"], ["50%", "8%"], ["72%", "25%"],
            ["25%", "25%"], ["92%", "45%"], ["5%", "48%"],
            ["60%", "90%"], ["38%", "12%"], ["80%", "65%"],
            ["18%", "90%"], ["95%", "20%"], ["45%", "85%"],
            ["30%", "60%"], ["68%", "78%"], ["12%", "35%"]
          ];
          const [top, left] = positions[i];
          return `.star-${i + 1} { top: ${top}; left: ${left}; animation-delay: ${i * 0.3}s !important; }`;
        }).join("\n")}

        .welcome-logo {
          animation: logoFloat 4s ease-in-out infinite;
        }

        .welcome-feature {
          animation: featureReveal .7s ease both;
          animation-delay: .15s;
        }

        .welcome-credit {
          animation: creditReveal 1s ease both;
          animation-delay: .3s;
        }

        .creator-name {
          text-shadow: 0 0 18px rgba(213,173,91,.2);
          animation: creatorGlow 3s ease-in-out infinite alternate;
        }

        .welcome-enter {
          animation: welcomeButton 3s ease-in-out infinite;
        }

        .welcome-button-shine {
          position: absolute;
          top: -50%;
          left: -80%;
          width: 35%;
          height: 200%;
          transform: rotate(25deg);
          background: rgba(255,255,255,.35);
          filter: blur(10px);
          animation: buttonShine 4s ease-in-out infinite;
        }

        @keyframes welcomeReveal {
          from {
            opacity: 0;
            transform: translateY(30px) scale(.97);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes creditReveal {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes featureReveal {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes logoFloat {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-7px); }
        }

        @keyframes creatorGlow {
          from { text-shadow: 0 0 12px rgba(213,173,91,.15); }
          to { text-shadow: 0 0 28px rgba(213,173,91,.5); }
        }

        @keyframes welcomeGlow {
          from { transform: scale(.85) translate(0,0); }
          to { transform: scale(1.2) translate(35px,20px); }
        }

        @keyframes welcomeRotate {
          to { transform: translate(-50%, -50%) rotate(360deg); }
        }

        @keyframes welcomeTwinkle {
          from { opacity: .15; transform: scale(.8) rotate(0deg); }
          to { opacity: .8; transform: scale(1.3) rotate(35deg); }
        }

        @keyframes welcomeButton {
          0%, 100% { box-shadow: 0 10px 40px rgba(213,173,91,.15); }
          50% { box-shadow: 0 10px 55px rgba(213,173,91,.4); }
        }

        @keyframes buttonShine {
          0%, 35% { left: -80%; }
          65%, 100% { left: 150%; }
        }

        @media (max-width: 480px) {
          .welcome-orbit {
            width: 115vw;
          }

          .welcome-feature {
            padding: 12px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .welcome-content,
          .welcome-glow,
          .welcome-orbit,
          .welcome-stars span,
          .welcome-enter,
          .welcome-logo,
          .welcome-feature,
          .welcome-credit,
          .creator-name,
          .welcome-button-shine {
            animation: none !important;
            transition: none !important;
          }
        }
      `}</style>
    </main>
  );
}
