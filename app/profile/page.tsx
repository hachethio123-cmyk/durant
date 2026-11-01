
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

type StudentProfile = {
  id: string;
  full_name: string;
  grade: string;
  created_at: string;
};

const grades: Record<string, string> = {
  "first-prep": "الصف الأول الإعدادي",
  "second-prep": "الصف الثاني الإعدادي",
  "third-prep": "الصف الثالث الإعدادي",
  "first-secondary": "الصف الأول الثانوي",
  "second-secondary": "الصف الثاني الثانوي",
  "third-secondary": "الصف الثالث الثانوي",
  "not-selected": "لم يتم تحديد الصف",
};

export default function ProfilePage() {
  const router = useRouter();

  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    router.prefetch("/dashboard");

    let active = true;

    async function loadProfile() {
      try {
        const { data: authData, error: authError } =
          await supabase.auth.getUser();

        if (!active) return;

        if (authError || !authData.user) {
          router.replace("/login");
          return;
        }

        const user = authData.user;

        const [profileResult] = await Promise.all([
          supabase
            .from("profiles")
            .select("id, full_name, grade, created_at")
            .eq("id", user.id)
            .single(),
        ]);

        if (!active) return;

        if (profileResult.error || !profileResult.data) {
          setMessage("تعذر تحميل بيانات البروفايل. حاول مرة أخرى.");
          setLoading(false);
          return;
        }

        setProfile(profileResult.data);
        setName(profileResult.data.full_name ?? "");
        setEmail(user.email ?? "");
        setLoading(false);
      } catch {
        if (active) {
          setMessage("حدث خطأ أثناء تحميل بياناتك.");
          setLoading(false);
        }
      }
    }

    loadProfile();

    return () => {
      active = false;
    };
  }, [router]);

  async function saveName(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMessage("");
    setSuccess(false);

    if (!name.trim()) {
      setMessage("اكتب اسمك أولاً.");
      return;
    }

    if (!profile || saving) return;

    setSaving(true);

    try {
      const { data, error } = await supabase
        .from("profiles")
        .update({ full_name: name.trim() })
        .eq("id", profile.id)
        .select("id, full_name, grade, created_at")
        .single();

      if (error) {
        setMessage("لم نتمكن من حفظ الاسم. حاول مرة أخرى.");
      } else {
        setProfile(data);
        setName(data.full_name);
        setSuccess(true);
        setMessage("تم تحديث اسمك بنجاح.");
      }
    } catch {
      setMessage("حدث خطأ أثناء الحفظ.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        <div className="text-center">
          <h1 className="text-3xl font-black text-yellow-400">DURANT</h1>
          <p className="mt-4 text-slate-400">جاري تحميل بياناتك...</p>
        </div>
      </main>
    );
  }

  if (!profile) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-5 bg-slate-950 px-5 text-center text-white">
        <h1 className="text-2xl font-bold">تعذر تحميل البروفايل</h1>
        <p className="text-slate-400">{message}</p>
        <button
          onClick={() => router.push("/dashboard")}
          className="rounded-xl bg-yellow-400 px-6 py-3 font-bold text-slate-950"
        >
          العودة للوحة الطالب
        </button>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-10 text-white sm:px-8">
      <div className="mx-auto max-w-3xl">
        <button
          onMouseEnter={() => router.prefetch("/dashboard")}
          onClick={() => router.push("/dashboard")}
          className="mb-8 text-sm text-yellow-400 transition hover:text-yellow-300"
        >
          ← العودة إلى لوحة الطالب
        </button>

        <div className="overflow-hidden rounded-3xl border border-slate-800 bg-slate-900 shadow-2xl">
          <div className="bg-gradient-to-l from-yellow-600 to-yellow-400 px-6 py-10 text-center text-slate-950">
            <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full border-4 border-white/70 bg-slate-950 text-4xl font-black text-yellow-400">
              {profile.full_name?.trim().charAt(0) || "ط"}
            </div>

            <h1 className="text-3xl font-black">الملف الشخصي</h1>
            <p className="mt-2 font-medium opacity-80">
              مرحباً بك في منصة DURANT
            </p>
          </div>

          <div className="space-y-7 p-6 sm:p-9">
            <section>
              <h2 className="mb-5 text-xl font-bold text-yellow-400">
                بيانات الطالب
              </h2>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-slate-700 bg-slate-800/70 p-5">
                  <p className="mb-2 text-sm text-slate-400">اسم الطالب</p>
                  <p className="break-words font-bold">
                    {profile.full_name || "غير محدد"}
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-700 bg-slate-800/70 p-5">
                  <p className="mb-2 text-sm text-slate-400">الصف الدراسي</p>
                  <p className="font-bold">
                    {grades[profile.grade] || "غير محدد"}
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-700 bg-slate-800/70 p-5 sm:col-span-2">
                  <p className="mb-2 text-sm text-slate-400">
                    البريد الإلكتروني
                  </p>
                  <p dir="ltr" className="break-all text-left font-bold">
                    {email}
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-700 bg-slate-800/70 p-5 sm:col-span-2">
                  <p className="mb-2 text-sm text-slate-400">
                    تاريخ إنشاء الحساب
                  </p>
                  <p className="font-bold">
                    {new Date(profile.created_at).toLocaleDateString("ar-EG")}
                  </p>
                </div>
              </div>
            </section>

            <div className="h-px bg-slate-700" />

            <section>
              <h2 className="mb-5 text-xl font-bold text-yellow-400">
                تعديل الاسم
              </h2>

              <form onSubmit={saveName} className="space-y-4">
                <label className="block text-sm text-slate-300">
                  الاسم الجديد
                </label>

                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="اكتب اسمك بالكامل"
                  className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-4 text-white outline-none transition focus:border-yellow-400"
                />

                <button
                  type="submit"
                  disabled={saving}
                  className="w-full rounded-xl bg-yellow-400 px-6 py-4 font-black text-slate-950 transition hover:bg-yellow-300 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {saving ? "جاري الحفظ..." : "حفظ التعديلات"}
                </button>

                {message && (
                  <p className={`rounded-xl p-3 text-center text-sm ${
                    success
                      ? "bg-green-500/10 text-green-400"
                      : "bg-red-500/10 text-red-400"
                  }`}>
                    {message}
                  </p>
                )}
              </form>
            </section>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-slate-500">
          DURANT Platform © جميع الحقوق محفوظة
        </p>
      </div>
    </main>
  );
}
