export const instant = false;

const gradeNames: Record<string, string> = {
  "first-prep": "الصف الأول الإعدادي",
  "second-prep": "الصف الثاني الإعدادي",
  "third-prep": "الصف الثالث الإعدادي",
  "first-secondary": "الصف الأول الثانوي",
  "second-secondary": "الصف الثاني الثانوي",
  "third-secondary": "الصف الثالث الثانوي",
};

export default async function GradePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const gradeName = gradeNames[slug];

  if (!gradeName) {
    return <main className="p-10 text-center">الصف غير موجود</main>;
  }

  const isThirdPrep = slug === "third-prep";

  return (
    <main dir="rtl" className="min-h-screen bg-slate-950 px-6 py-10 text-white">
      <div className="mx-auto max-w-6xl">
        <a href="/" className="text-yellow-400">← العودة للرئيسية</a>

        <header className="mt-8 rounded-3xl border border-yellow-400/20 bg-slate-900 p-10 text-center">
          <div className="text-6xl">🎓</div>
          <h1 className="mt-5 text-3xl font-black text-yellow-400">{gradeName}</h1>
          <p className="mt-4 text-slate-300">
            منصة ديورانت مع مستر أمير عبد الناصر
          </p>
        </header>

        <section className="mt-12">
          <h2 className="mb-6 text-2xl font-black text-yellow-400">
            📚 الكورسات المتاحة
          </h2>

          {isThirdPrep ? (
            <article className="rounded-2xl border border-yellow-400/30 bg-slate-900 p-7">
              <div className="text-4xl">🌍</div>
              <h3 className="mt-4 text-2xl font-bold">الدراسات الاجتماعية</h3>
              <p className="mt-3 leading-7 text-slate-300">
                كورس الدراسات الاجتماعية للصف الثالث الإعدادي مع مستر أمير عبد الناصر.
              </p>
              <a
                href="#lessons"
                className="mt-6 inline-block rounded-xl bg-yellow-400 px-6 py-3 font-bold text-slate-950"
              >
                عرض الدروس ↓
              </a>
            </article>
          ) : (
            <div className="rounded-2xl bg-slate-900 p-8 text-center text-slate-300">
              الكورسات الخاصة بهذا الصف سيتم إضافتها قريبًا.
            </div>
          )}
        </section>

        {isThirdPrep && (
          <section id="lessons" className="mt-12">
            <h2 className="mb-6 text-2xl font-black text-yellow-400">
              🎬 دروس الدراسات الاجتماعية
            </h2>

            <div className="rounded-2xl border border-slate-700 bg-slate-900 p-7">
              <h3 className="text-xl font-bold">قائمة الدروس</h3>
              <p className="mt-4 leading-8 text-slate-300">
                سيتم إضافة فيديوهات الشرح والملفات والامتحانات هنا.
              </p>
              <p className="mt-4 text-sm text-yellow-300">
                الكورس قيد التجهيز.
              </p>
            </div>
          </section>
        )}

        <footer className="mt-12 border-t border-slate-800 py-8 text-center text-slate-400">
          © 2026 DURANT — جميع الحقوق محفوظة
        </footer>
      </div>
    </main>
  );
}
