
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

type XPStudent = {
  rank_number: number;
  student_name: string;
  grade: string;
  xp_points: number;
};

export default function XPPodium({
  gradeSlug,
  isArabic,
}: {
  gradeSlug: string;
  isArabic: boolean;
}) {
  const [students, setStudents] = useState<XPStudent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let active = true;

    async function loadPodium() {
      setLoading(true);
      setError(false);

      const { data, error: rankingError } = await supabase.rpc(
        "get_student_xp_leaderboard",
        { p_grade: gradeSlug }
      );

      if (!active) return;

      if (rankingError) {
        setError(true);
        setStudents([]);
      } else {
        setStudents((data ?? []) as XPStudent[]);
      }

      setLoading(false);
    }

    if (gradeSlug) loadPodium();

    return () => {
      active = false;
    };
  }, [gradeSlug]);

  const format = (value: number) =>
    Number(value || 0).toLocaleString(isArabic ? "ar-EG" : "en-US");

  const firstThree = [
    students.find((student) => student.rank_number === 2),
    students.find((student) => student.rank_number === 1),
    students.find((student) => student.rank_number === 3),
  ];

  const podiumStyles = [
    {
      title: isArabic ? "المركز الثاني" : "2ND PLACE",
      medal: "🥈",
      color: "border-slate-200 bg-gradient-to-b from-slate-50 to-white",
      medalBg: "bg-slate-100",
      number: "text-slate-600",
    },
    {
      title: isArabic ? "المركز الأول" : "1ST PLACE",
      medal: "👑",
      color: "border-amber-300 bg-gradient-to-b from-amber-50 via-yellow-50 to-white shadow-[0_12px_35px_rgba(217,164,35,0.13)]",
      medalBg: "bg-amber-100",
      number: "text-amber-600",
    },
    {
      title: isArabic ? "المركز الثالث" : "3RD PLACE",
      medal: "🥉",
      color: "border-orange-200 bg-gradient-to-b from-orange-50 to-white",
      medalBg: "bg-orange-100",
      number: "text-orange-700",
    },
  ];

  return (
    <div className="relative mt-6 overflow-hidden rounded-[22px] border border-[#e7eaf3] bg-gradient-to-br from-[#f9faff] via-white to-[#f7f8fd] p-4 sm:p-5">
      <div className="pointer-events-none absolute -end-12 -top-16 h-40 w-40 rounded-full bg-amber-100/60 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 -start-12 h-40 w-40 rounded-full bg-blue-100/60 blur-3xl" />

      <div className="relative flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-[9px] font-black tracking-[0.2em] text-amber-600">
            DURANT XP CHAMPIONS
          </p>
          <h3 className="mt-1.5 text-base font-black text-[#17213d] sm:text-lg">
            {isArabic ? "منصة أبطال الخبرة" : "XP Champions Podium"}
          </h3>
          <p className="mt-1 text-[10px] text-slate-400">
            {isArabic
              ? "أعلى 3 طلاب في صفك حسب نقاط الخبرة"
              : "Top 3 students in your grade by experience points"}
          </p>
        </div>

        <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-amber-200 bg-amber-50 text-2xl shadow-sm">
          🏆
        </div>
      </div>

      {loading ? (
        <div className="mt-5 grid grid-cols-3 gap-2">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="h-36 animate-pulse rounded-2xl bg-slate-100"
            />
          ))}
        </div>
      ) : error ? (
        <div className="mt-5 rounded-2xl border border-red-100 bg-red-50 p-4 text-center text-xs text-red-600">
          {isArabic
            ? "تعذر تحميل ترتيب الخبرة حاليًا."
            : "Could not load the XP ranking."}
        </div>
      ) : students.length === 0 ? (
        <div className="mt-5 rounded-2xl border border-dashed border-slate-200 bg-white/70 p-5 text-center">
          <p className="text-2xl">🏅</p>
          <p className="mt-2 text-xs font-bold text-slate-500">
            {isArabic
              ? "لا يوجد ترتيب متاح حتى الآن."
              : "No ranking available yet."}
          </p>
        </div>
      ) : (
        <div className="relative mt-5 grid grid-cols-3 items-end gap-2 sm:gap-3">
          {firstThree.map((student, index) => {
            const style = podiumStyles[index];

            return (
              <div
                key={index}
                className={`relative flex min-w-0 flex-col items-center justify-between rounded-2xl border p-2.5 text-center transition duration-300 hover:-translate-y-1 sm:p-4 ${
                  style.color
                } ${index === 1 ? "min-h-[172px]" : "min-h-[150px]"}`}
              >
                <span
                  className={`flex h-10 w-10 items-center justify-center rounded-2xl text-2xl ${style.medalBg}`}
                >
                  {style.medal}
                </span>

                <div className="mt-3 w-full min-w-0">
                  <p className="text-[9px] font-black text-slate-400 sm:text-[10px]">
                    {style.title}
                  </p>

                  <p className="mt-2 truncate text-[10px] font-black text-[#17213d] sm:text-xs">
                    {student?.student_name ??
                      (isArabic ? "بانتظار بطل" : "Waiting for champion")}
                  </p>

                  <p className={`mt-2 text-sm font-black sm:text-base ${style.number}`}>
                    {student ? format(student.xp_points) : "—"}
                  </p>

                  <p className="text-[8px] font-black tracking-widest text-slate-400">
                    XP
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <Link
        href="/leaderboard"
        className="group relative mt-4 flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-[#17213d] px-4 py-3.5 text-xs font-black text-white shadow-lg shadow-blue-950/10 transition duration-300 hover:-translate-y-0.5 hover:bg-[#24365f] hover:shadow-xl"
      >
        <span>🏆</span>
        <span>
          {isArabic ? "عرض ترتيب أفضل 10 طلاب" : "View Top 10 Students"}
        </span>
        <span className="transition-transform duration-300 group-hover:-translate-x-1">
          {isArabic ? "←" : "→"}
        </span>
      </Link>
    </div>
  );
}
