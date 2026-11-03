
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";
import { useLanguage } from "@/components/ThemeProvider";

const grades = [
  { value: "first-prep", ar: "الصف الأول الإعدادي", en: "First Preparatory Grade" },
  { value: "second-prep", ar: "الصف الثاني الإعدادي", en: "Second Preparatory Grade" },
  { value: "third-prep", ar: "الصف الثالث الإعدادي", en: "Third Preparatory Grade" },
  { value: "first-secondary", ar: "الصف الأول الثانوي", en: "First Secondary Grade" },
  { value: "second-secondary", ar: "الصف الثاني الثانوي", en: "Second Secondary Grade" },
  { value: "third-secondary", ar: "الصف الثالث الثانوي", en: "Third Secondary Grade" },
];

export default function LoginPage() {
  const router = useRouter();
  const { language, languageReady } = useLanguage();

  const isArabic = language === "ar";
  const direction = isArabic ? "rtl" : "ltr";

  const t = (ar: string, en: string) => isArabic ? ar : en;

  const [mode, setMode] = useState<"signup" | "login">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [grade, setGrade] = useState("third-prep");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  function getErrorMessage(error: unknown) {
    const errorText =
      error instanceof Error ? error.message.toLowerCase() : "";

    if (
      errorText.includes("invalid login credentials") ||
      errorText.includes("invalid credentials")
    ) {
      return t(
        "البريد الإلكتروني أو كلمة المرور غير صحيحة.",
        "Incorrect email or password."
      );
    }

    if (errorText.includes("email not confirmed")) {
      return t(
        "يجب تأكيد بريدك الإلكتروني أولاً.",
        "Please confirm your email address first."
      );
    }

    if (errorText.includes("user already registered")) {
      return t(
        "هذا البريد الإلكتروني مسجل بالفعل.",
        "This email address is already registered."
      );
    }

    if (errorText.includes("password should be")) {
      return t(
        "كلمة المرور لا تستوفي شروط الأمان.",
        "Your password does not meet the security requirements."
      );
    }

    return error instanceof Error
      ? error.message
      : t("حدث خطأ، حاول مرة أخرى.", "Something went wrong. Please try again.");
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      if (mode === "signup") {
        if (!name.trim()) {
          setMessage(t("اكتب اسمك بالكامل.", "Please enter your full name."));
          return;
        }

        const { data, error } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: {
            data: {
              full_name: name.trim(),
              grade,
            },
          },
        });

        if (error) throw error;

        // منع الدخول التلقائي بعد إنشاء الحساب
        if (data.session) {
          const { error: signOutError } = await supabase.auth.signOut();
          if (signOutError) throw signOutError;
        }

        setMode("login");
        setPassword("");
        setShowPassword(false);
        setMessage(
          t(
            "تم إنشاء حسابك بنجاح. اكتب بريدك الإلكتروني وكلمة المرور لتسجيل الدخول.",
            "Your account was created successfully. Enter your email and password to log in."
          )
        );
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });

        if (error) throw error;

        router.replace("/dashboard");
      }
    } catch (error) {
      setMessage(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  }

  if (!languageReady) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        <div className="text-center">
          <h1 className="text-4xl font-black tracking-widest text-yellow-400">
            DURANT
          </h1>
          <p className="mt-4 text-slate-300">
            Loading...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main
      dir={direction}
      className="flex min-h-screen items-center justify-center bg-slate-950 px-5 py-12 text-white"
    >
      <div className="w-full max-w-md rounded-3xl border border-yellow-400/20 bg-slate-900 p-8 shadow-2xl">
        <div className="my-7 text-center">
          <div className="text-5xl">🎓</div>

          <h1 className="mt-4 text-4xl font-black text-yellow-400">
            DURANT
          </h1>

          <p className="mt-3 text-slate-300">
            {mode === "signup"
              ? t(
                  "أنشئ حسابك وابدأ رحلتك التعليمية",
                  "Create your account and start your learning journey"
                )
              : t(
                  "أهلاً بك في منصة ديورانت",
                  "Welcome to DURANT"
                )}
          </p>
        </div>

        <div className="mb-6 grid grid-cols-2 gap-2 rounded-xl bg-slate-800 p-1">
          <button
            type="button"
            onClick={() => {
              setMode("signup");
              setMessage("");
            }}
            className={`rounded-lg p-3 font-bold ${
              mode === "signup"
                ? "bg-yellow-400 text-slate-950"
                : "text-slate-300"
            }`}
          >
            {t("حساب جديد", "Create Account")}
          </button>

          <button
            type="button"
            onClick={() => {
              setMode("login");
              setMessage("");
            }}
            className={`rounded-lg p-3 font-bold ${
              mode === "login"
                ? "bg-yellow-400 text-slate-950"
                : "text-slate-300"
            }`}
          >
            {t("تسجيل الدخول", "Log In")}
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "signup" && (
            <>
              <label className="block">
                <span className="mb-2 block text-sm text-slate-300">
                  {t("الاسم بالكامل", "Full Name")}
                </span>

                <input
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-800 p-4 outline-none focus:border-yellow-400"
                  placeholder={t("اكتب اسمك", "Enter your name")}
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm text-slate-300">
                  {t("الصف الدراسي", "School Grade")}
                </span>

                <select
                  value={grade}
                  onChange={(e) => setGrade(e.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-800 p-4 outline-none focus:border-yellow-400"
                >
                  {grades.map((item) => (
                    <option key={item.value} value={item.value}>
                      {isArabic ? item.ar : item.en}
                    </option>
                  ))}
                </select>
              </label>
            </>
          )}

          <label className="block">
            <span className="mb-2 block text-sm text-slate-300">
              {t("البريد الإلكتروني", "Email Address")}
            </span>

            <input
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              dir="ltr"
              className="w-full rounded-xl border border-slate-700 bg-slate-800 p-4 text-left outline-none focus:border-yellow-400"
              placeholder="example@email.com"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm text-slate-300">
              {t("كلمة المرور", "Password")}
            </span>

            <div className="relative">
              <input
                required
                type={showPassword ? "text" : "password"}
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                dir="ltr"
                className={`w-full rounded-xl border border-slate-700 bg-slate-800 p-4 outline-none focus:border-yellow-400 ${
                  isArabic ? "pl-14 text-right" : "pr-14 text-left"
                }`}
                placeholder={t("6 أحرف أو أكثر", "6 characters or more")}
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className={`absolute top-1/2 -translate-y-1/2 text-slate-300 hover:text-yellow-400 ${
                  isArabic ? "left-4" : "right-4"
                }`}
                aria-label={
                  showPassword
                    ? t("إخفاء كلمة المرور", "Hide password")
                    : t("إظهار كلمة المرور", "Show password")
                }
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>
          </label>

          {message && (
            <p className="rounded-xl border border-yellow-400/30 bg-yellow-400/10 p-3 text-sm leading-7 text-yellow-200">
              {message}
            </p>
          )}

          <button
            disabled={loading}
            type="submit"
            className="w-full rounded-xl bg-yellow-400 p-4 font-black text-slate-950 transition hover:bg-yellow-300 disabled:opacity-50"
          >
            {loading
              ? t("جارٍ التنفيذ...", "Please wait...")
              : mode === "signup"
                ? t("إنشاء الحساب", "Create Account")
                : t("تسجيل الدخول", "Log In")}
          </button>
        </form>

        <p className="mt-6 text-center text-xs leading-6 text-slate-400">
          {t("منصة ديورانت التعليمية", "DURANT Educational Platform")}
          <br />
          {t("مع مستر أمير عبد الناصر", "With Mr. Amir Abdel Nasser")}
        </p>
      </div>
    </main>
  );
}
