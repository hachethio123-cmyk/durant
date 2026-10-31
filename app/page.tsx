
const grades = [
  { title: "الصف الأول الإعدادي", icon: "📘", slug: "first-prep" },
  { title: "الصف الثاني الإعدادي", icon: "📗", slug: "second-prep" },
  { title: "الصف الثالث الإعدادي", icon: "🎓", slug: "third-prep" },
  { title: "الصف الأول الثانوي", icon: "📙", slug: "first-secondary" },
  { title: "الصف الثاني الثانوي", icon: "📕", slug: "second-secondary" },
  { title: "الصف الثالث الثانوي", icon: "🏆", slug: "third-secondary" },
];

export default function Home() {
  return (
    <main dir="rtl" className="min-h-screen bg-slate-950 text-white">
      <header className="border-b border-yellow-500/20 bg-slate-900">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <div>
            <h1 className="text-3xl font-black text-yellow-400">DURANT</h1>
            <p className="text-sm text-slate-300">منصة ديورانت التعليمية</p>
          </div>
          <a href="#courses" className="rounded-xl bg-yellow-400 px-5 py-3 font-bold text-slate-950">
            اختر صفك
          </a>
        </div>
      </header>

      <section className="mx-auto grid max-w-7xl items-center gap-10 px-6 py-20 md:grid-cols-2">
        <div>
          <p className="mb-4 text-yellow-400">التعليم بشكل مختلف</p>
          <h2 className="text-4xl font-black leading-tight md:text-6xl">
            افهم دروسك،
            <br />
            <span className="text-yellow-400">وحقق هدفك</span>
          </h2>
          <p className="mt-6 max-w-xl text-lg leading-9 text-slate-300">
            أهلاً بك في منصة ديورانت مع مستر أمير عبد الناصر.
            شرح ومراجعات وامتحانات تساعدك على التفوق.
          </p>
          <a href="#courses" className="mt-8 inline-block rounded-xl bg-yellow-400 px-7 py-4 font-bold text-slate-950">
            اكتشف الكورسات ←
          </a>
        </div>

        <div className="rounded-3xl border border-yellow-400/20 bg-slate-900 p-10 text-center">
          <div className="text-7xl">🎓</div>
          <h3 className="mt-5 text-4xl font-black text-yellow-400">DURANT</h3>
          <p className="mt-3 text-slate-300">طريقك للتفوق يبدأ من هنا</p>
          <div className="mt-8 grid grid-cols-3 gap-3">
            <div className="rounded-xl bg-slate-800 p-4">6<br />صفوف</div>
            <div className="rounded-xl bg-slate-800 p-4">📚<br />دروس</div>
            <div className="rounded-xl bg-slate-800 p-4">📝<br />امتحانات</div>
          </div>
        </div>
      </section>

      <section id="courses" className="bg-slate-900 px-6 py-16">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 text-center">
            <p className="font-bold text-yellow-400">الكورسات المتاحة</p>
            <h2 className="mt-3 text-3xl font-black">اختار صفك وابدأ رحلتك</h2>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {grades.map((grade) => (
              <article key={grade.slug} className="rounded-2xl border border-slate-700 bg-slate-950 p-6 transition hover:-translate-y-1 hover:border-yellow-400">
                <div className="text-5xl">{grade.icon}</div>
                <h3 className="mt-5 text-xl font-bold text-yellow-300">{grade.title}</h3>
                <p className="mt-3 text-slate-300">شرح المنهج ومراجعات وتدريبات وامتحانات.</p>
                <a href={`/grades/${grade.slug}`} className="mt-6 inline-block rounded-lg bg-yellow-400 px-5 py-3 font-bold text-slate-950 hover:bg-yellow-300">
                  دخول الصف ←
                </a>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-16 text-center">
        <div className="mx-auto max-w-3xl rounded-3xl border border-yellow-400/20 bg-slate-900 p-10">
          <div className="text-5xl">👨‍🏫</div>
          <p className="mt-4 text-yellow-400">مدرس المنصة</p>
          <h2 className="mt-3 text-3xl font-black">مستر أمير عبد الناصر</h2>
          <p className="mt-4 leading-8 text-slate-300">
            هدفنا إنك تفهم المعلومة وتتدرب وتتابع تقدمك الدراسي من مكان واحد.
          </p>
        </div>
      </section>

      <footer className="border-t border-slate-800 px-6 py-8 text-center text-slate-400">
        © {new Date().getFullYear()} DURANT — جميع الحقوق محفوظة
      </footer>
    </main>
  );
}
