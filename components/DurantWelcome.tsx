
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

  return (
    <main
      dir={isArabic ? "rtl" : "ltr"}
      className="durant-welcome fixed inset-0 z-[99999] flex min-h-screen items-center justify-center overflow-hidden bg-[#101a34] px-4 py-8 text-white"
    >
      <div className="welcome-stars" aria-hidden="true">
        {Array.from({ length: 18 }, (_, i) => (
          <span
            key={i}
            className={`welcome-star star-${i + 1}`}
          >
            ✦
          </span>
        ))}
      </div>

      <div className="welcome-orbit orbit-one" />
      <div className="welcome-orbit orbit-two" />
      <div className="welcome-glow glow-one" />
      <div className="welcome-glow glow-two" />

      <div className="relative z-10 mx-auto w-full max-w-4xl">
        <div className="welcome-content text-center">

          <div className="mx-auto mb-7 flex h-24 w-24 items-center justify-center rounded-[2rem] border border-[#d5ad5b]/50 bg-[#d5ad5b]/10 shadow-[0_0_65px_rgba(213,173,91,0.15)]">
            <span className="text-6xl font-black text-[#e8c77e]">
              D
            </span>
          </div>

          <p className="text-xs font-bold tracking-[0.5em] text-[#d5ad5b]">
            THE WORLD OF
          </p>

          <h1 className="mt-3 text-5xl font-black tracking-[0.18em] text-white sm:text-7xl">
            DURANT
          </h1>

          <div className="mx-auto mt-6 flex max-w-xs items-center gap-3">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent to-[#d5ad5b]" />
            <span className="text-xl text-[#e8c77e]">✦</span>
            <div className="h-px flex-1 bg-gradient-to-l from-transparent to-[#d5ad5b]" />
          </div>

          <h2 className="mt-7 text-xl font-black leading-relaxed text-white sm:text-3xl">
            {isArabic
              ? "هنا تبدأ رحلة التميز"
              : "Your Journey to Excellence Begins Here"}
          </h2>

          <p className="mx-auto mt-3 max-w-xl text-sm leading-8 text-white/60 sm:text-base">
            {isArabic
              ? "كل إنجاز عظيم يبدأ بخطوة... وأنت الآن في بداية رحلتك."
              : "Every great achievement begins with a step. Your journey starts now."}
          </p>

          <div className="mx-auto mt-10 max-w-2xl rounded-3xl border border-[#d5ad5b]/35 bg-white/[0.045] px-5 py-7 shadow-[0_15px_70px_rgba(0,0,0,0.2)] backdrop-blur-xl sm:px-10">
            <p className="text-xs font-bold tracking-[0.25em] text-[#d5ad5b]">
              {isArabic ? "إبداع وتعليم" : "EDUCATION & EXCELLENCE"}
            </p>

            <h3 className="mt-5 text-sm font-semibold text-white/65 sm:text-base">
              {isArabic ? "إنشاء وتطوير" : "CREATED & DEVELOPED BY"}
            </h3>

            <p className="mt-3 text-2xl font-black leading-relaxed text-[#f1d89f] sm:text-4xl">
              {isArabic
                ? "مستر أمير عبد الناصر"
                : "Mr. Amir Abdel Nasser"}
            </p>

            <div className="mx-auto my-6 h-px w-24 bg-gradient-to-r from-transparent via-[#d5ad5b] to-transparent" />

            <p className="text-sm font-medium text-white/65">
              {isArabic
                ? "تطوير وبرمجة الطالب"
                : "STUDENT DEVELOPER"}
            </p>

            <p className="mt-3 text-xl font-black text-white sm:text-3xl">
              {isArabic
                ? "محمد سامح فريد"
                : "Mohamed Sameh Farid"}
            </p>

            <div className="mt-5 text-2xl text-[#d5ad5b]">
              ✨ 🎓 ✨
            </div>
          </div>

          <button
            type="button"
            onClick={onEnter}
            className="welcome-enter group relative mt-9 inline-flex min-h-14 items-center justify-center gap-3 overflow-hidden rounded-2xl border border-[#f1d89f]/70 bg-gradient-to-r from-[#c49a4d] via-[#f1d89f] to-[#c49a4d] px-10 py-4 text-base font-black text-[#17213d] shadow-[0_10px_40px_rgba(213,173,91,0.2)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_15px_55px_rgba(213,173,91,0.35)]"
          >
            <span>
              {isArabic
                ? "ابدأ رحلتك التعليمية"
                : "START YOUR JOURNEY"}
            </span>
            <span className="text-xl transition-transform duration-300 group-hover:translate-x-1">
              {isArabic ? "←" : "→"}
            </span>
          </button>

          <p className="mt-7 text-[9px] font-bold tracking-[0.35em] text-white/35">
            A NEW JOURNEY BEGINS
          </p>
        </div>
      </div>

      <style jsx global>{`
        .durant-welcome {
          isolation: isolate;
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
          position: absolute;
          width: min(85vw, 650px);
          aspect-ratio: 1;
          border: 1px solid rgba(213,173,91,.10);
          border-radius: 50%;
          pointer-events: none;
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
          position: absolute;
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

        .welcome-enter {
          animation: welcomeButton 3s ease-in-out infinite;
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

        @keyframes welcomeGlow {
          from { transform: scale(.85) translate(0,0); }
          to { transform: scale(1.2) translate(35px,20px); }
        }

        @keyframes welcomeRotate {
          to { transform: rotate(360deg); }
        }

        @keyframes welcomeTwinkle {
          from { opacity: .15; transform: scale(.8) rotate(0deg); }
          to { opacity: .8; transform: scale(1.3) rotate(35deg); }
        }

        @keyframes welcomeButton {
          0%, 100% { box-shadow: 0 10px 40px rgba(213,173,91,.15); }
          50% { box-shadow: 0 10px 55px rgba(213,173,91,.35); }
        }

        @media (max-width: 480px) {
          .welcome-orbit {
            width: 115vw;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .welcome-content,
          .welcome-glow,
          .welcome-orbit,
          .welcome-stars span,
          .welcome-enter {
            animation: none !important;
            transition: none !important;
          }
        }
      `}</style>
    </main>
  );
}
