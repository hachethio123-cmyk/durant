
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useLanguage } from "@/components/ThemeProvider";

type StudentProfile = {
  id: string;
  full_name: string;
  grade: string;
  created_at: string;
};

const grades: Record<string, { ar: string; en: string }> = {
  "first-prep": { ar: "الصف الأول الإعدادي", en: "First Preparatory" },
  "second-prep": { ar: "الصف الثاني الإعدادي", en: "Second Preparatory" },
  "third-prep": { ar: "الصف الثالث الإعدادي", en: "Third Preparatory" },
  "first-secondary": { ar: "الصف الأول الثانوي", en: "First Secondary" },
  "second-secondary": { ar: "الصف الثاني الثانوي", en: "Second Secondary" },
  "third-secondary": { ar: "الصف الثالث الثانوي", en: "Third Secondary" },
  "not-selected": { ar: "لم يتم تحديد الصف", en: "Grade not selected" },
};

export default function ProfilePage() {
  const router = useRouter();
  const { language, languageReady } = useLanguage();

  const isArabic = language === "ar";
  const direction = isArabic ? "rtl" : "ltr";
  const t = (ar: string, en: string) => (isArabic ? ar : en);

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

        const { data, error } = await supabase
          .from("profiles")
          .select("id, full_name, grade, created_at")
          .eq("id", user.id)
          .single();

        if (!active) return;

        if (error || !data) {
          setMessage(
            t(
              "تعذر تحميل بيانات البروفايل. حاول مرة أخرى.",
              "Unable to load your profile. Please try again."
            )
          );
          setLoading(false);
          return;
        }

        setProfile(data);
        setName(data.full_name ?? "");
        setEmail(user.email ?? "");
        setLoading(false);
      } catch {
        if (active) {
          setMessage(
            t(
              "حدث خطأ أثناء تحميل بياناتك.",
              "An error occurred while loading your information."
            )
          );
          setLoading(false);
        }
      }
    }

    loadProfile();

    return () => {
      active = false;
    };
  }, [router, isArabic]);

  async function saveName(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMessage("");
    setSuccess(false);

    if (!name.trim()) {
      setMessage(t("اكتب اسمك أولاً.", "Please enter your name first."));
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
        setMessage(
          t(
            "لم نتمكن من حفظ الاسم. حاول مرة أخرى.",
            "We couldn't save your name. Please try again."
          )
        );
      } else {
        setProfile(data);
        setName(data.full_name);
        setSuccess(true);
        setMessage(
          t("تم تحديث اسمك بنجاح.", "Your name was updated successfully.")
        );
      }
    } catch {
      setMessage(
        t("حدث خطأ أثناء الحفظ.", "An error occurred while saving.")
      );
    } finally {
      setSaving(false);
    }
  }

  const displayName =
    profile?.full_name?.trim() || t("طالب DURANT", "DURANT Student");

  const initial = displayName.charAt(0).toUpperCase();

  if (!languageReady || loading) {
    return (
      <main
        dir={direction}
        className="flex min-h-screen items-center justify-center bg-[#f1f3f8] text-[#17213d]"
      >
        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#17213d] text-xl font-black text-white shadow-lg">
            D
          </div>
          <p className="mt-5 text-sm font-semibold text-slate-500">
            {t("جاري تحميل بياناتك...", "Loading your information...")}
          </p>
        </div>
      </main>
    );
  }

  if (!profile) {
    return (
      <main
        dir={direction}
        className="flex min-h-screen flex-col items-center justify-center gap-5 bg-[#f1f3f8] px-5 text-center text-[#17213d]"
      >
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-2xl shadow-sm">
          <span aria-hidden="true">!</span>
        </div>

        <h1 className="text-2xl font-black">
          {t("تعذر تحميل البروفايل", "Unable to load profile")}
        </h1>

        <p className="max-w-md text-sm leading-7 text-slate-500">
          {message ||
            t(
              "حدث خطأ أثناء تحميل بياناتك.",
              "An error occurred while loading your information."
            )}
        </p>

        <button
          onClick={() => router.push("/dashboard")}
          className="rounded-xl bg-[#17213d] px-6 py-3 font-bold text-white transition hover:bg-[#263657]"
        >
          {t("العودة للوحة الطالب", "Back to Student Dashboard")}
        </button>
      </main>
    );
  }

  return (
    <main
      dir={direction}
      className="min-h-screen bg-[#f1f3f8] px-4 py-6 text-[#17213d] sm:px-7 sm:py-10"
    >
      <div className="mx-auto max-w-5xl">
        <button
          onMouseEnter={() => router.prefetch("/dashboard")}
          onClick={() => router.push("/dashboard")}
          className="mb-7 inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-bold text-slate-500 transition hover:bg-white hover:text-[#17213d]"
        >
          <span aria-hidden="true">{isArabic ? "→" : "←"}</span>
          {t("العودة إلى لوحة الطالب", "Back to Student Dashboard")}
        </button>

        <div className="mb-7">
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-slate-400">
            DURANT / ACCOUNT
          </p>
          <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
            {t("الملف الشخصي", "My Profile")}
          </h1>
          <p className="mt-2 text-sm text-slate-500 sm:text-base">
            {t(
              "إدارة بياناتك الشخصية ومعلومات حسابك الدراسي.",
              "Manage your personal details and student account information."
            )}
          </p>
        </div>

        <section className="overflow-hidden rounded-[28px] border border-slate-200/80 bg-white shadow-sm">
          <div className="relative overflow-hidden bg-[#17213d] px-6 py-9 text-white sm:px-10 sm:py-11">
            <div className="pointer-events-none absolute -end-16 -top-24 h-64 w-64 rounded-full border-[35px] border-white/[0.04]" />
            <div className="pointer-events-none absolute -bottom-32 -start-10 h-64 w-64 rounded-full bg-white/[0.035]" />

            <div className="relative flex flex-col items-center gap-5 text-center sm:flex-row sm:text-start">
              <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-[28px] border border-white/20 bg-white/10 text-4xl font-black text-white shadow-xl">
                {initial}
              </div>

              <div className="min-w-0">
                <p className="mb-2 text-xs font-bold tracking-widest text-slate-300">
                  {t("حساب الطالب", "STUDENT ACCOUNT")}
                </p>
                <h2 className="break-words text-2xl font-black sm:text-3xl">
                  {displayName}
                </h2>
                <p className="mt-2 text-sm text-slate-300">
                  {t(
                    "مرحباً بك مجدداً في منصة DURANT التعليمية",
                    "Welcome back to the DURANT learning platform"
                  )}
                </p>
              </div>

              <div className="sm:ms-auto">
                <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-bold text-slate-100">
                  <span className="h-2 w-2 rounded-full bg-emerald-400" />
                  {t("حساب نشط", "Active Account")}
                </span>
              </div>
            </div>
          </div>

          <div className="grid gap-8 p-5 sm:p-8 lg:grid-cols-[1.15fr_0.85fr] lg:p-10">
            <section>
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-lg">
                  <span aria-hidden="true">▤</span>
                </div>
                <div>
                  <h3 className="font-black">
                    {t("بيانات الطالب", "Student Information")}
                  </h3>
                  <p className="mt-1 text-xs text-slate-400">
                    {t("معلومات حسابك الأساسية", "Your basic account details")}
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="rounded-2xl border border-slate-100 bg-[#f8f9fc] p-4">
                  <p className="mb-2 text-xs font-semibold text-slate-400">
                    {t("اسم الطالب", "Student Name")}
                  </p>
                  <p className="break-words font-bold text-[#17213d]">
                    {profile.full_name || t("غير محدد", "Not specified")}
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-100 bg-[#f8f9fc] p-4">
                  <p className="mb-2 text-xs font-semibold text-slate-400">
                    {t("الصف الدراسي", "Grade")}
                  </p>
                  <p className="font-bold text-[#17213d]">
                    {grades[profile.grade]
                      ? grades[profile.grade][isArabic ? "ar" : "en"]
                      : t("غير محدد", "Not specified")}
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-100 bg-[#f8f9fc] p-4">
                  <p className="mb-2 text-xs font-semibold text-slate-400">
                    {t("البريد الإلكتروني", "Email Address")}
                  </p>
                  <p
                    dir="ltr"
                    className="break-all text-left font-bold text-[#17213d]"
                  >
                    {email}
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-100 bg-[#f8f9fc] p-4">
                  <p className="mb-2 text-xs font-semibold text-slate-400">
                    {t("تاريخ إنشاء الحساب", "Account Creation Date")}
                  </p>
                  <p className="font-bold text-[#17213d]">
                    {new Date(profile.created_at).toLocaleDateString(
                      isArabic ? "ar-EG" : "en-US",
                      { year: "numeric", month: "long", day: "numeric" }
                    )}
                  </p>
                </div>
              </div>
            </section>

            <section className="h-fit rounded-3xl border border-slate-200 bg-white p-5 sm:p-6">
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#eef1f8] text-lg">
                  <span aria-hidden="true">✎</span>
                </div>
                <div>
                  <h3 className="font-black">
                    {t("تعديل الاسم", "Edit Name")}
                  </h3>
                  <p className="mt-1 text-xs text-slate-400">
                    {t(
                      "حدّث الاسم الظاهر في حسابك",
                      "Update the name displayed on your account"
                    )}
                  </p>
                </div>
              </div>

              <form onSubmit={saveName} className="space-y-4">
                <label
                  htmlFor="profile-name"
                  className="block text-sm font-bold text-slate-600"
                >
                  {t("الاسم الجديد", "New Name")}
                </label>

                <input
                  id="profile-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={t(
                    "اكتب اسمك بالكامل",
                    "Enter your full name"
                  )}
                  maxLength={100}
                  className="w-full rounded-xl border border-slate-200 bg-[#f8f9fc] px-4 py-4 text-[#17213d] outline-none transition placeholder:text-slate-400 focus:border-[#263657] focus:bg-white focus:ring-4 focus:ring-[#17213d]/5"
                />

                <button
                  type="submit"
                  disabled={saving || !name.trim() || name.trim() === profile.full_name}
                  className="w-full rounded-xl bg-[#17213d] px-6 py-4 font-black text-white shadow-sm transition hover:bg-[#263657] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {saving
                    ? t("جاري الحفظ...", "Saving...")
                    : t("حفظ التعديلات", "Save Changes")}
                </button>

                {message && (
                  <p
                    role="status"
                    className={`rounded-xl p-3 text-center text-sm font-semibold ${
                      success
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-red-50 text-red-600"
                    }`}
                  >
                    {message}
                  </p>
                )}
              </form>

              <div className="mt-6 rounded-2xl bg-[#f5f6fa] p-4">
                <p className="text-xs leading-6 text-slate-500">
                  {t(
                    "تأكد من كتابة اسمك بشكل صحيح؛ سيظهر الاسم المحدّث في حسابك على المنصة.",
                    "Make sure your name is correct. Your updated name will appear across your platform account."
                  )}
                </p>
              </div>
            </section>
          </div>
        </section>

        <footer className="py-7 text-center text-xs font-medium text-slate-400">
          DURANT Platform © {t("جميع الحقوق محفوظة", "All Rights Reserved")}
        </footer>
      </div>
    </main>
  );
}
