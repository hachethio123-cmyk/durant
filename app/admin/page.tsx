
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import AdminStudentsTable from "./AdminStudentsTable";

export const dynamic = "force-dynamic";

type AdminStudent = {
  id: string;
  full_name: string;
  grade: string;
  created_at: string;
  gold_coins: number;
  xp_points: number;
  student_level: number;
  phone_number: string | null;
  guardian_phone_number: string | null;
};

const gradeOptions = [
  { id: "first-prep", label: "الأول الإعدادي", icon: "📘" },
  { id: "second-prep", label: "الثاني الإعدادي", icon: "📗" },
  { id: "third-prep", label: "الثالث الإعدادي", icon: "📙" },
  { id: "first-secondary", label: "الأول الثانوي", icon: "🎓" },
  { id: "second-secondary", label: "الثاني الثانوي", icon: "📚" },
  { id: "third-secondary", label: "الثالث الثانوي", icon: "🏆" },
];

const numberFormat = new Intl.NumberFormat("ar-EG");

function StatCard({
  icon,
  label,
  value,
  description,
  delay,
  animation = "admin-slide-up",
}: {
  icon: string;
  label: string;
  value: string;
  description: string;
  delay: string;
  animation?: string;
}) {
  return (
    <article
      className={`admin-premium-card ${animation} ${delay} relative overflow-hidden rounded-3xl p-6`}
    >
      <div className="absolute -left-8 -top-8 h-28 w-28 rounded-full bg-blue-50/80" />

      <div className="relative flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-slate-500">{label}</p>
          <p className="mt-3 text-3xl font-black tracking-tight text-[#17213d]">
            {value}
          </p>
          <p className="mt-2 text-xs text-slate-400">{description}</p>
        </div>

        <div className="admin-stat-icon flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-2xl">
          {icon}
        </div>
      </div>
    </article>
  );
}

function SidebarLink({
  href,
  icon,
  children,
  active = false,
}: {
  href: string;
  icon: string;
  children: React.ReactNode;
  active?: boolean;
}) {
  return (
    <a
      href={href}
      className={`admin-sidebar-link ${active ? "active" : ""}`}
    >
      <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/10 text-lg">
        {icon}
      </span>
      <span>{children}</span>
    </a>
  );
}

export default async function AdminPage() {
  const supabase = await createClient();

  const { data, error: claimsError } =
    await supabase.auth.getClaims();

  if (claimsError || !data?.claims) {
    redirect("/login");
  }

  const { data: isAdmin, error: adminError } =
    await supabase.rpc("is_admin");

  if (adminError || isAdmin !== true) {
    redirect("/dashboard");
  }

  const { data: studentsData, error: studentsError } =
    await supabase.rpc("admin_get_students");

  const students = (studentsData ?? []) as AdminStudent[];

  const totalStudents = students.length;

  const totalGold = students.reduce(
    (sum, student) => sum + (Number(student.gold_coins) || 0),
    0
  );

  const totalXP = students.reduce(
    (sum, student) => sum + (Number(student.xp_points) || 0),
    0
  );

  const averageLevel =
    totalStudents > 0
      ? (
          students.reduce(
            (sum, student) =>
              sum + (Number(student.student_level) || 0),
            0
          ) / totalStudents
        ).toFixed(1)
      : "0";

  const gradeCounts = gradeOptions.map((grade) => ({
    ...grade,
    count: students.filter(
      (student) => student.grade === grade.id
    ).length,
  }));

  const maxGradeCount = Math.max(
    ...gradeCounts.map((grade) => grade.count),
    1
  );

  const recentStudents = [...students]
    .sort(
      (a, b) =>
        new Date(b.created_at).getTime() -
        new Date(a.created_at).getTime()
    )
    .slice(0, 4);

  return (
    <main
      dir="rtl"
      className="admin-page min-h-screen overflow-hidden p-3 md:p-6"
    >
      <div className="mx-auto grid max-w-[1600px] items-start gap-6 lg:grid-cols-[260px_minmax(0,1fr)]">

        {/* Sidebar */}
        <aside className="admin-sidebar z-20 hidden p-5 lg:block">

          {/* Animated DURANT logo */}
          <div className="flex items-center gap-3 border-b border-slate-100 pb-6">
            <div className="admin-logo-morph flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#17213d] text-white shadow-lg">
              <span className="admin-logo-item admin-logo-letter">D</span>
              <span className="admin-logo-item admin-logo-teacher">👨‍🏫</span>
              <span className="admin-logo-item admin-logo-screen">🖥️</span>
            </div>

            <div>
              <h2 className="text-xl font-black tracking-wider text-[#17213d]">
                DURANT
              </h2>
              <p className="mt-1 text-[10px] font-bold tracking-[2px] text-slate-400">
                ADMIN CONTROL
              </p>
            </div>
          </div>

          <div className="mt-7">
            <p className="mb-3 px-3 text-[10px] font-bold tracking-widest text-slate-400">
              WORKSPACE
            </p>

            <nav className="space-y-2">
              <SidebarLink href="#overview" icon="◈" active>
                نظرة عامة
              </SidebarLink>
              <SidebarLink href="#statistics" icon="📊">
                الإحصائيات
              </SidebarLink>
              <SidebarLink href="#distribution" icon="🎓">
                توزيع الطلاب
              </SidebarLink>
              <SidebarLink href="#recent" icon="🕒">
                أحدث التسجيلات
              </SidebarLink>
              <SidebarLink href="#students" icon="👨‍🎓">
                إدارة الطلاب
              </SidebarLink>
            </nav>
          </div>

          <div className="mt-9 rounded-2xl bg-gradient-to-br from-[#17213d] to-[#3157a4] p-4 text-white">
            <div className="text-2xl">✨</div>
            <p className="mt-3 font-bold">مساحة الإدارة</p>
            <p className="mt-2 text-xs leading-6 text-white/70">
              تحكم في بيانات الطلاب وتابع تقدمهم من مكان واحد.
            </p>
            <div className="mt-4 flex items-center gap-2 text-xs font-semibold text-emerald-300">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              النظام متصل
            </div>
          </div>

          <div className="absolute bottom-5 right-5 left-5">
            <div className="flex items-center gap-2 rounded-xl bg-slate-50 p-3">
              <span className="text-xl">🛡️</span>
              <div>
                <p className="text-xs font-bold text-[#17213d]">
                  وصول آمن
                </p>
                <p className="mt-1 text-[10px] text-slate-400">
                  مدير معتمد
                </p>
              </div>
            </div>
          </div>
        </aside>

        {/* Main content */}
        <div className="min-w-0 space-y-7">

          {/* Mobile navigation */}
          <nav className="flex gap-2 overflow-x-auto rounded-2xl border border-slate-200 bg-white p-3 shadow-sm lg:hidden">
            {[
              ["#overview", "الرئيسية"],
              ["#statistics", "الإحصائيات"],
              ["#distribution", "الصفوف"],
              ["#recent", "التسجيلات"],
              ["#students", "الطلاب"],
            ].map(([href, label]) => (
              <a
                key={href}
                href={href}
                className="shrink-0 rounded-xl bg-slate-50 px-4 py-3 text-xs font-bold text-slate-600 transition hover:bg-blue-50 hover:text-blue-700"
              >
                {label}
              </a>
            ))}
          </nav>

          {/* Hero */}
          <header
            id="overview"
            className="admin-hero admin-slide-right relative scroll-mt-6 overflow-hidden rounded-[2rem] p-7 shadow-xl md:p-10"
          >
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
              <span className="admin-float absolute right-[8%] top-8 text-4xl opacity-30">
                📚
              </span>
              <span
                className="admin-float absolute left-[12%] top-12 text-3xl opacity-30"
                style={{ animationDelay: "1s" }}
              >
                🎓
              </span>
              <span
                className="admin-float absolute bottom-8 right-[38%] text-3xl opacity-20"
                style={{ animationDelay: "2s" }}
              >
                🏆
              </span>
              <span className="absolute -left-20 -top-24 h-64 w-64 rounded-full border border-white/10" />
              <span className="absolute -bottom-32 right-1/3 h-72 w-72 rounded-full border border-white/10" />
            </div>

            <div className="relative z-10">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-white backdrop-blur">
                <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
                DURANT · ADMINISTRATION
              </div>

              <h1
                className="text-3xl font-black leading-tight md:text-5xl"
                style={{ color: "#ffffff" }}
              >
                لوحة تحكم المديرين
              </h1>

              <p
                className="mt-4 max-w-2xl text-sm leading-7 md:text-base"
                style={{ color: "rgba(255,255,255,0.78)" }}
              >
                إدارة أذكى، متابعة أسهل، ورؤية واضحة لكل بيانات الطلاب.
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
                <div className="rounded-2xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur">
                  <p className="text-xs text-white/70">حالة النظام</p>
                  <p className="mt-1 font-bold text-white">🟢 متصل وآمن</p>
                </div>

                <div className="rounded-2xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur">
                  <p className="text-xs text-white/70">إجمالي الطلاب</p>
                  <p className="mt-1 font-bold text-white">
                    {numberFormat.format(totalStudents)} طالب
                  </p>
                </div>

                <div className="rounded-2xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur">
                  <p className="text-xs text-white/70">الصلاحيات</p>
                  <p className="mt-1 font-bold text-white">
                    ✓ تم التحقق
                  </p>
                </div>
              </div>
            </div>
          </header>

          {studentsError ? (
            <div className="rounded-3xl border border-red-200 bg-white p-7 text-red-600 shadow-sm">
              <div className="text-3xl">⚠️</div>
              <h2 className="mt-3 text-lg font-bold">
                تعذر تحميل بيانات الطلاب
              </h2>
              <p className="mt-2 text-sm text-slate-500">
                يرجى مراجعة اتصال قاعدة البيانات وإعدادات الصلاحيات.
              </p>
            </div>
          ) : (
            <>
              {/* Statistics */}
              <section id="statistics" className="scroll-mt-6">
                <div className="mb-5 flex items-end justify-between gap-3">
                  <div>
                    <p className="text-xs font-bold tracking-widest text-blue-600">
                      ANALYTICS OVERVIEW
                    </p>
                    <h2 className="mt-2 text-2xl font-black text-[#17213d]">
                      نظرة عامة
                    </h2>
                  </div>
                  <span className="rounded-full bg-white px-4 py-2 text-xs font-bold text-slate-500 shadow-sm">
                    بيانات فعلية
                  </span>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 2xl:grid-cols-4">
                  <StatCard
                    icon="👨‍🎓"
                    label="إجمالي الطلاب"
                    value={numberFormat.format(totalStudents)}
                    description="عدد حسابات الطلاب المسجلة"
                    delay="admin-delay-1"
                    animation="admin-slide-right"
                  />
                  <StatCard
                    icon="🪙"
                    label="إجمالي الذهب"
                    value={numberFormat.format(totalGold)}
                    description="مجموع العملات لدى الطلاب"
                    delay="admin-delay-2"
                    animation="admin-slide-up"
                  />
                  <StatCard
                    icon="⚡"
                    label="إجمالي نقاط XP"
                    value={numberFormat.format(totalXP)}
                    description="مجموع نقاط الخبرة المكتسبة"
                    delay="admin-delay-3"
                    animation="admin-slide-up"
                  />
                  <StatCard
                    icon="🏆"
                    label="متوسط المستوى"
                    value={numberFormat.format(Number(averageLevel))}
                    description="متوسط مستويات الطلاب"
                    delay="admin-delay-4"
                    animation="admin-slide-left"
                  />
                </div>
              </section>

              {/* Distribution and recent students */}
              <section className="grid scroll-mt-6 gap-6 xl:grid-cols-5">
                <div
                  id="distribution"
                  className="admin-premium-card admin-slide-right scroll-mt-6 rounded-3xl p-6 xl:col-span-3"
                >
                  <p className="text-xs font-bold tracking-widest text-blue-600">
                    STUDENT DISTRIBUTION
                  </p>
                  <h2 className="mt-2 text-xl font-black text-[#17213d]">
                    توزيع الطلاب على الصفوف
                  </h2>
                  <p className="mt-1 text-sm text-slate-400">
                    أعداد الطلاب في كل صف دراسي
                  </p>

                  <div className="mt-7 space-y-5">
                    {gradeCounts.map((grade) => {
                      const percentage =
                        totalStudents > 0
                          ? (grade.count / totalStudents) * 100
                          : 0;

                      return (
                        <div key={grade.id}>
                          <div className="mb-2 flex items-center justify-between gap-3">
                            <span className="text-sm font-bold text-slate-700">
                              {grade.icon} {grade.label}
                            </span>
                            <span className="text-sm font-black text-[#17213d]">
                              {numberFormat.format(grade.count)}
                            </span>
                          </div>

                          <div className="h-3 overflow-hidden rounded-full bg-slate-100">
                            <div
                              className="h-full rounded-full bg-gradient-to-l from-blue-700 to-cyan-400 transition-all duration-1000"
                              style={{
                                width: `${(grade.count / maxGradeCount) * 100}%`,
                              }}
                            />
                          </div>

                          <p className="mt-1 text-left text-xs text-slate-400">
                            {numberFormat.format(Math.round(percentage))}٪
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div
                  id="recent"
                  className="admin-premium-card admin-slide-left scroll-mt-6 rounded-3xl p-6 xl:col-span-2"
                >
                  <p className="text-xs font-bold tracking-widest text-blue-600">
                    RECENT REGISTRATIONS
                  </p>
                  <h2 className="mt-2 text-xl font-black text-[#17213d]">
                    أحدث التسجيلات
                  </h2>
                  <p className="mt-1 text-sm text-slate-400">
                    آخر الطلاب الذين انضموا للمنصة
                  </p>

                  {recentStudents.length > 0 ? (
                    <div className="mt-6 space-y-4">
                      {recentStudents.map((student, index) => {
                        const grade = gradeOptions.find(
                          (item) => item.id === student.grade
                        );

                        return (
                          <div
                            key={student.id}
                            className="flex items-center gap-3 rounded-2xl bg-slate-50 p-3 transition-all duration-300 hover:-translate-x-1 hover:bg-blue-50"
                          >
                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-xl shadow-sm">
                              {["👨‍🎓", "📘", "🎓", "⭐"][index]}
                            </div>

                            <div className="min-w-0 flex-1">
                              <p className="truncate text-sm font-bold text-[#17213d]">
                                {student.full_name}
                              </p>
                              <p className="mt-1 text-xs text-slate-400">
                                {grade?.label ?? "صف غير محدد"}
                              </p>
                            </div>

                            <div className="text-left">
                              <p className="text-xs font-semibold text-slate-500">
                                {new Intl.DateTimeFormat("ar-EG", {
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric",
                                }).format(new Date(student.created_at))}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="mt-8 rounded-2xl bg-slate-50 p-6 text-center">
                      <div className="text-3xl">👨‍🎓</div>
                      <p className="mt-3 text-sm text-slate-500">
                        لا يوجد طلاب مسجلون حتى الآن.
                      </p>
                    </div>
                  )}
                </div>
              </section>

              {/* Student management */}
              <section
                id="students"
                className="admin-slide-up scroll-mt-6"
              >
                <div className="mb-5">
                  <p className="text-xs font-bold tracking-widest text-blue-600">
                    STUDENT MANAGEMENT
                  </p>
                  <h2 className="mt-2 text-2xl font-black text-[#17213d]">
                    إدارة الطلاب
                  </h2>
                  <p className="mt-2 text-sm text-slate-500">
                    البحث في بيانات الطلاب ومتابعة مستواهم التعليمي.
                  </p>
                </div>

                <AdminStudentsTable students={students} />
              </section>
            </>
          )}

          <footer className="border-t border-slate-200 py-5 text-center text-xs text-slate-400">
            DURANT ADMINISTRATION · منصة ديورانت التعليمية
          </footer>
        </div>
      </div>
    </main>
  );
}
