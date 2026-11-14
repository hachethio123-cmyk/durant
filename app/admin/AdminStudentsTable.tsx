
"use client";

import { useMemo, useState } from "react";

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

type SortOption = "newest" | "oldest" | "name" | "xp" | "level" | "gold";

const gradeNames: Record<string, string> = {
  "first-prep": "الأول الإعدادي",
  "second-prep": "الثاني الإعدادي",
  "third-prep": "الثالث الإعدادي",
  "first-secondary": "الأول الثانوي",
  "second-secondary": "الثاني الثانوي",
  "third-secondary": "الثالث الثانوي",
};

const formatNumber = (value: number) =>
  new Intl.NumberFormat("ar-EG").format(value || 0);

const formatDate = (value: string) => {
  if (!value) return "غير محدد";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "غير محدد";

  return new Intl.DateTimeFormat("ar-EG", {
    dateStyle: "medium",
  }).format(date);
};

export default function AdminStudentsTable({
  students,
}: {
  students: AdminStudent[];
}) {
  const [search, setSearch] = useState("");
  const [selectedGrade, setSelectedGrade] = useState("all");
  const [sortBy, setSortBy] = useState<SortOption>("newest");

  const stats = useMemo(() => {
    return {
      total: students.length,
      totalXP: students.reduce(
        (sum, student) => sum + (student.xp_points || 0),
        0
      ),
      totalGold: students.reduce(
        (sum, student) => sum + (student.gold_coins || 0),
        0
      ),
      missingPhones: students.filter(
        (student) =>
          !student.phone_number || !student.guardian_phone_number
      ).length,
    };
  }, [students]);

  const filteredStudents = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    const result = students.filter((student) => {
      const matchesGrade =
        selectedGrade === "all" || student.grade === selectedGrade;

      const searchableText = [
        student.full_name,
        student.phone_number || "",
        student.guardian_phone_number || "",
        gradeNames[student.grade] || student.grade,
      ]
        .join(" ")
        .toLowerCase();

      const matchesSearch =
        !normalizedSearch || searchableText.includes(normalizedSearch);

      return matchesGrade && matchesSearch;
    });

    return [...result].sort((a, b) => {
      switch (sortBy) {
        case "oldest":
          return (
            new Date(a.created_at).getTime() -
            new Date(b.created_at).getTime()
          );

        case "name":
          return a.full_name.localeCompare(b.full_name, "ar");

        case "xp":
          return (b.xp_points || 0) - (a.xp_points || 0);

        case "level":
          return (b.student_level || 0) - (a.student_level || 0);

        case "gold":
          return (b.gold_coins || 0) - (a.gold_coins || 0);

        case "newest":
        default:
          return (
            new Date(b.created_at).getTime() -
            new Date(a.created_at).getTime()
          );
      }
    });
  }, [students, search, selectedGrade, sortBy]);

  const statCards = [
    {
      title: "إجمالي الطلاب",
      value: stats.total,
      icon: "👨‍🎓",
      description: "عدد حسابات الطلاب",
      color: "from-blue-500/15 to-cyan-500/5",
    },
    {
      title: "إجمالي نقاط XP",
      value: formatNumber(stats.totalXP),
      icon: "⚡",
      description: "مجموع نقاط الخبرة",
      color: "from-amber-500/15 to-yellow-500/5",
    },
    {
      title: "إجمالي الذهب",
      value: formatNumber(stats.totalGold),
      icon: "🪙",
      description: "مجموع العملات",
      color: "from-yellow-500/15 to-orange-500/5",
    },
    {
      title: "بيانات ناقصة",
      value: stats.missingPhones,
      icon: "📋",
      description: "طلاب ينقصهم رقم هاتف",
      color: "from-rose-500/15 to-pink-500/5",
    },
  ];

  return (
    <div className="admin-page space-y-7" dir="rtl">
      {/* Header */}
      <section className="admin-hero admin-entrance relative overflow-hidden rounded-3xl p-6 text-white shadow-xl md:p-8">
        <div className="admin-sidebar-decoration pointer-events-none absolute -left-12 -top-12 h-48 w-48 rounded-full border border-white/10" />

        <div className="relative z-10 flex flex-col justify-between gap-5 md:flex-row md:items-center">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-sm text-white/90">
              <span>🛡️</span>
              <span>لوحة التحكم الإدارية</span>
            </div>

            <h1 className="text-2xl font-extrabold md:text-3xl">
              إدارة الطلاب
            </h1>

            <p className="mt-2 max-w-xl text-sm leading-7 text-white/75">
              تابع حسابات الطلاب وبيانات التواصل ومستويات التقدم في منصة
              DURANT من مكان واحد.
            </p>
          </div>

          <div className="admin-float hidden text-6xl md:block">
            🎓
          </div>
        </div>
      </section>

      {/* Statistics */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statCards.map((card, index) => (
          <div
            key={card.title}
            className={`admin-stat-card admin-entrance rounded-2xl border border-slate-200/80 bg-gradient-to-br ${card.color} p-5 shadow-sm dark:border-slate-700/70 dark:bg-slate-900`}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                  {card.title}
                </p>

                <p className="mt-3 text-2xl font-extrabold text-slate-900 dark:text-white">
                  {formatNumber(Number(card.value) || 0)}
                </p>

                <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                  {card.description}
                </p>
              </div>

              <div className="admin-stat-icon flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/80 text-2xl shadow-sm dark:bg-slate-800">
                {card.icon}
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* Students */}
      <section className="admin-premium-card admin-entrance overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">
        <div className="border-b border-slate-100 p-5 dark:border-slate-800 md:p-6">
          <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
            <div>
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
                قائمة الطلاب
              </h2>

              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                ابحث عن طالب أو حدد الصف أو غيّر طريقة الترتيب.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-700 dark:bg-blue-500/10 dark:text-blue-300">
                {formatNumber(filteredStudents.length)} نتيجة
              </span>

              <span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                من أصل {formatNumber(students.length)}
              </span>
            </div>
          </div>

          {/* Search and filters */}
          <div className="mt-6 grid grid-cols-1 gap-3 md:grid-cols-3">
            <div className="relative md:col-span-1">
              <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-lg">
                🔎
              </span>

              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="ابحث بالاسم أو رقم الهاتف..."
                className="admin-search w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pr-11 pl-4 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>

            <select
              value={selectedGrade}
              onChange={(event) => setSelectedGrade(event.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            >
              <option value="all">جميع الصفوف</option>
              {Object.entries(gradeNames).map(([slug, name]) => (
                <option key={slug} value={slug}>
                  {name}
                </option>
              ))}
            </select>

            <select
              value={sortBy}
              onChange={(event) =>
                setSortBy(event.target.value as SortOption)
              }
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            >
              <option value="newest">الأحدث تسجيلًا</option>
              <option value="oldest">الأقدم تسجيلًا</option>
              <option value="name">الاسم أبجديًا</option>
              <option value="xp">الأعلى في XP</option>
              <option value="level">الأعلى مستوى</option>
              <option value="gold">الأكثر امتلاكًا للذهب</option>
            </select>
          </div>
        </div>

        {/* Table */}
        {filteredStudents.length === 0 ? (
          <div className="px-5 py-16 text-center">
            <div className="mb-4 text-5xl">🔍</div>

            <h3 className="text-lg font-bold text-slate-800 dark:text-white">
              لا توجد نتائج
            </h3>

            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              جرّب تغيير كلمات البحث أو اختيار صف آخر.
            </p>

            <button
              type="button"
              onClick={() => {
                setSearch("");
                setSelectedGrade("all");
                setSortBy("newest");
              }}
              className="mt-5 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-blue-700"
            >
              إعادة ضبط الفلاتر
            </button>
          </div>
        ) : (
          <div className="w-full overflow-x-auto">
            <table className="w-full min-w-[1100px] border-collapse text-right">
              <thead>
                <tr className="bg-slate-50 text-xs font-bold text-slate-500 dark:bg-slate-800/70 dark:text-slate-400">
                  <th className="px-5 py-4">الطالب</th>
                  <th className="px-5 py-4">الصف الدراسي</th>
                  <th className="px-5 py-4">رقم الطالب</th>
                  <th className="px-5 py-4">رقم ولي الأمر</th>
                  <th className="px-5 py-4">الذهب</th>
                  <th className="px-5 py-4">XP</th>
                  <th className="px-5 py-4">المستوى</th>
                  <th className="px-5 py-4">تاريخ التسجيل</th>
                </tr>
              </thead>

              <tbody>
                {filteredStudents.map((student, index) => (
                  <tr
                    key={student.id}
                    className="admin-table-row border-t border-slate-100 transition-colors hover:bg-blue-50/50 dark:border-slate-800 dark:hover:bg-slate-800/60"
                    style={{ animationDelay: `${index * 35}ms` }}
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 font-bold text-white shadow-sm">
                          {student.full_name?.trim()?.charAt(0) || "؟"}
                        </div>

                        <div>
                          <p className="whitespace-nowrap text-sm font-bold text-slate-800 dark:text-white">
                            {student.full_name || "بدون اسم"}
                          </p>

                          <p className="mt-1 text-[11px] text-slate-400">
                            {student.id.slice(0, 8)}...
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <span className="whitespace-nowrap rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-700 dark:bg-blue-500/10 dark:text-blue-300">
                        {gradeNames[student.grade] || student.grade || "غير محدد"}
                      </span>
                    </td>

                    <td className="px-5 py-4 text-sm text-slate-600 dark:text-slate-300">
                      <span dir="ltr" className="whitespace-nowrap">
                        {student.phone_number || "غير مسجل"}
                      </span>
                    </td>

                    <td className="px-5 py-4 text-sm text-slate-600 dark:text-slate-300">
                      <span dir="ltr" className="whitespace-nowrap">
                        {student.guardian_phone_number || "غير مسجل"}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <span className="whitespace-nowrap text-sm font-bold text-amber-600 dark:text-amber-400">
                        🪙 {formatNumber(student.gold_coins)}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <span className="whitespace-nowrap text-sm font-bold text-blue-600 dark:text-blue-400">
                        ⚡ {formatNumber(student.xp_points)}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <span className="inline-flex min-w-9 items-center justify-center rounded-lg bg-violet-50 px-3 py-1.5 text-sm font-extrabold text-violet-700 dark:bg-violet-500/10 dark:text-violet-300">
                        {formatNumber(student.student_level)}
                      </span>
                    </td>

                    <td className="whitespace-nowrap px-5 py-4 text-xs text-slate-500 dark:text-slate-400">
                      {formatDate(student.created_at)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Footer */}
        <div className="flex flex-col justify-between gap-2 border-t border-slate-100 bg-slate-50/70 px-5 py-4 text-xs text-slate-500 dark:border-slate-800 dark:bg-slate-800/30 sm:flex-row sm:items-center">
          <span>
            يتم عرض بيانات الطلاب المسجلة في قاعدة البيانات.
          </span>

          <span>
            DURANT Admin Dashboard
          </span>
        </div>
      </section>
    </div>
  );
}
