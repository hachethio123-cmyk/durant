
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";

export const metadata: Metadata = {
  title: {
    absolute: "منصة ديورانت التعليمية DURANT | مستر أمير عبد الناصر",
  },
  description:
    "DURANT منصة ديورانت التعليمية المتخصصة في الدراسات الاجتماعية والتاريخ والجغرافيا للمرحلتين الإعدادية والثانوية، مع مستر أمير عبد الناصر.",
  keywords: [
    "منصة ديورانت",
    "DURANT",
    "منصة DURANT التعليمية",
    "مستر أمير عبد الناصر",
    "الدراسات الاجتماعية",
    "التاريخ",
    "الجغرافيا",
  ],
  alternates: {
    canonical: "https://durant-platform.netlify.app/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  openGraph: {
    type: "website",
    locale: "ar_EG",
    url: "https://durant-platform.netlify.app/",
    siteName: "DURANT",
    title: "منصة ديورانت التعليمية | DURANT",
    description:
      "منصة تعليمية متخصصة في الدراسات الاجتماعية مع مستر أمير عبد الناصر.",
    images: [
      {
        url: "/images/ameer-nasser.jpg",
        width: 500,
        height: 700,
        alt: "مستر أمير عبد الناصر - منصة ديورانت",
      },
    ],
  },
};

// الهوية الرسمية لمنصة DURANT لمحركات البحث
const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "منصة ديورانت التعليمية",
  alternateName: ["DURANT", "ديورانت"],
  url: "https://durant-platform.netlify.app/",
};

const grades = [
  "الصف الأول الإعدادي",
  "الصف الثاني الإعدادي",
  "الصف الثالث الإعدادي",
  "الصف الأول الثانوي",
  "الصف الثاني الثانوي",
  "الصف الثالث الثانوي",
];

export default function Home() {
  return (
    <main
      dir="rtl"
      className="min-h-screen overflow-hidden bg-slate-950 text-white"
    >
      {/* بيانات هوية الموقع لمحركات البحث */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(websiteJsonLd).replace(/</g, "\\u003c"),
        }}
      />

      {/* الشريط العلوي */}
      <nav className="border-b border-yellow-400/20 bg-slate-950/95">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-5 py-5">
          <Link
            href="/"
            className="text-3xl font-black tracking-widest text-yellow-400"
          >
            DURANT
          </Link>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="rounded-xl border border-yellow-400/40 px-4 py-2 text-sm font-bold text-yellow-400 transition hover:bg-yellow-400/10"
            >
              تسجيل الدخول
            </Link>

            <Link
              href="/login"
              className="rounded-xl bg-yellow-400 px-4 py-2 text-sm font-black text-slate-950 transition hover:bg-yellow-300"
            >
              إنشاء حساب
            </Link>
          </div>
        </div>
      </nav>

      {/* الواجهة الرئيسية */}
      <section className="relative">
        <div className="pointer-events-none absolute -left-40 top-10 h-96 w-96 rounded-full bg-yellow-400/10 blur-3xl" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-5 py-14 md:grid-cols-2 md:py-24">
          <div>
            <p className="text-sm font-black tracking-[0.2em] text-yellow-400">
              WELCOME TO DURANT
            </p>

            <h1 className="mt-6 text-4xl font-black leading-relaxed sm:text-5xl lg:text-6xl">
              مستقبلك الدراسي
              <span className="block text-yellow-400">
                يبدأ من هنا
              </span>
            </h1>

            <div className="my-6 h-1 w-24 rounded-full bg-yellow-400" />

            <h2 className="text-xl font-black sm:text-2xl">
              منصة ديورانت التعليمية
            </h2>

            <p className="mt-5 max-w-xl text-base leading-9 text-slate-300">
              بيئة تعليمية متكاملة لدراسة التاريخ والجغرافيا والدراسات
              الاجتماعية، ومتابعة الدروس والامتحانات والإنجازات،
              مع مستر أمير عبد الناصر.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/dashboard"
                className="rounded-xl bg-yellow-400 px-7 py-4 font-black text-slate-950 transition hover:bg-yellow-300"
              >
                دخول المنصة ←
              </Link>

              <Link
                href="/login"
                className="rounded-xl border border-yellow-400/40 px-7 py-4 font-bold text-yellow-400 transition hover:bg-yellow-400/10"
              >
                إنشاء حساب جديد
              </Link>
            </div>
          </div>

          <div className="relative mx-auto flex min-h-[340px] w-full max-w-md items-end justify-center overflow-hidden rounded-3xl border border-yellow-400/30 bg-gradient-to-br from-yellow-900/30 to-slate-900 px-5 pt-8 shadow-2xl shadow-yellow-950/20 md:min-h-[480px]">
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-yellow-500/10 to-transparent" />

            <Image
              src="/images/ameer-nasser.jpg"
              alt="مستر أمير عبد الناصر"
              width={500}
              height={700}
              priority
              className="relative z-10 max-h-[450px] w-auto object-contain"
            />

            <div className="absolute bottom-5 left-4 right-4 z-20 rounded-xl border border-yellow-400/20 bg-slate-950/90 p-4 text-center backdrop-blur">
              <p className="font-black text-yellow-400">
                مستر أمير عبد الناصر
              </p>
              <p className="mt-1 text-xs text-slate-300">
                معًا نحو التفوق والنجاح
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* عن المنصة */}
      <section className="border-y border-slate-800 bg-slate-900/60 px-5 py-16">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <p className="text-sm font-bold tracking-widest text-yellow-400">
              ABOUT DURANT
            </p>

            <h2 className="mt-3 text-3xl font-black">
              اكتشف عالم DURANT
            </h2>

            <p className="mx-auto mt-4 max-w-2xl leading-8 text-slate-400">
              منصة تعليمية تساعد الطالب على تنظيم رحلته الدراسية
              ومتابعة تعلمه في مكان واحد.
            </p>
          </div>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <article className="rounded-2xl border border-yellow-400/20 bg-slate-950 p-6">
              <div className="text-4xl">📚</div>
              <h3 className="mt-5 text-xl font-black text-yellow-400">
                المحتوى الدراسي
              </h3>
              <p className="mt-3 text-sm leading-8 text-slate-400">
                تنظيم المواد والوحدات والدروس في مساحة تعليمية واحدة.
              </p>
            </article>

            <article className="rounded-2xl border border-yellow-400/20 bg-slate-950 p-6">
              <div className="text-4xl">📝</div>
              <h3 className="mt-5 text-xl font-black text-yellow-400">
                الامتحانات والتقييم
              </h3>
              <p className="mt-3 text-sm leading-8 text-slate-400">
                مساحة مخصصة للاختبارات وقياس مستوى التحصيل الدراسي.
              </p>
            </article>

            <article className="rounded-2xl border border-yellow-400/20 bg-slate-950 p-6">
              <div className="text-4xl">🏆</div>
              <h3 className="mt-5 text-xl font-black text-yellow-400">
                الإنجازات والمنافسة
              </h3>
              <p className="mt-3 text-sm leading-8 text-slate-400">
                متابعة التقدم والعملات الذهبية والترتيب بين طلاب الصف الواحد.
              </p>
            </article>
          </div>
        </div>
      </section>

      {/* الصفوف الدراسية */}
      <section className="mx-auto max-w-7xl px-5 py-16">
        <div className="text-center">
          <p className="text-sm font-bold tracking-widest text-yellow-400">
            ACADEMIC GRADES
          </p>

          <h2 className="mt-3 text-3xl font-black">
            المراحل الدراسية
          </h2>

          <p className="mt-4 text-slate-400">
            محتوى مخصص للصفوف الإعدادية والثانوية.
          </p>
        </div>

        <div className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {grades.map((grade, index) => (
            <article
              key={grade}
              className="rounded-2xl border border-yellow-400/20 bg-slate-900 p-6 transition hover:border-yellow-400/60"
            >
              <div className="text-3xl">🎓</div>
              <h3 className="mt-4 font-black text-yellow-400">
                {grade}
              </h3>
              <p className="mt-2 text-sm text-slate-400">
                الدراسات الاجتماعية
                {index >= 3 ? " - التاريخ والجغرافيا" : ""}
              </p>
            </article>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/login"
            className="inline-block rounded-xl bg-yellow-400 px-8 py-4 font-black text-slate-950 transition hover:bg-yellow-300"
          >
            ابدأ رحلتك مع DURANT
          </Link>
        </div>
      </section>

      {/* التذييل */}
      <footer className="border-t border-slate-800 bg-slate-900 px-5 py-9 text-center">
        <p className="text-3xl font-black tracking-widest text-yellow-400">
          DURANT
        </p>

        <p className="mt-3 text-sm text-slate-400">
          منصة ديورانت التعليمية مع مستر أمير عبد الناصر
        </p>

        <p className="mt-5 text-xs text-slate-500">
          © 2026 DURANT — جميع الحقوق محفوظة
        </p>
      </footer>
    </main>
  );
}
