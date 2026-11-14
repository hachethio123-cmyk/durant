
"use client";

import { useState, type FormEvent } from "react";
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
  const t = (ar: string, en: string) => (isArabic ? ar : en);

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
        "يرجى تأكيد بريدك الإلكتروني أولًا.",
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

    return t(
      "حدث خطأ، حاول مرة أخرى.",
      "Something went wrong. Please try again."
    );
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
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
      <main
        dir={direction}
        className="flex min-h-screen items-center justify-center bg-[#f4f6fb] text-[#17213d]"
      >
        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#17213d] text-2xl font-black text-white shadow-lg">
            D
          </div>
          <p className="mt-4 text-sm font-semibold text-[#64748b]">
            {t("جارٍ التحميل...", "Loading...")}
          </p>
        </div>
      </main>
    );
  }

  return (
    <main
      dir={direction}
      className="flex min-h-screen items-center justify-center bg-[#f4f6fb] px-4 py-6 text-[#17213d] sm:px-6 sm:py-10"
    >
      <div className="grid w-full max-w-6xl overflow-hidden rounded-[28px] border border-[#e7eaf1] bg-white shadow-[0_24px_80px_rgba(23,33,61,0.10)] lg:min-h-[720px] lg:grid-cols-2">

        {/* Brand panel */}
        <section className="relative hidden overflow-hidden bg-[#17213d] px-10 py-12 text-white lg:flex lg:flex-col lg:justify-between xl:px-14">
          <div className="pointer-events-none absolute -left-28 -top-28 h-80 w-80 rounded-full border border-white/10" />
          <div className="pointer-events-none absolute -bottom-40 -right-24 h-[430px] w-[430px] rounded-full border border-white/10" />
          <div className="pointer-events-none absolute bottom-10 left-10 h-40 w-40 rounded-full bg-white/[0.035] blur-2xl" />

          <div className="relative z-10 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/15 bg-white/10 text-2xl font-black">
              D
            </div>
            <div>
              <p className="text-xl font-black tracking-[0.18em]">
                DURANT
              </p>
              <p className="mt-0.5 text-xs text-white/60">
                {t("منصة ديورانت التعليمية", "DURANT Educational Platform")}
              </p>
            </div>
          </div>

          <div className="relative z-10 max-w-md py-12">
            <div className="mb-6 inline-flex items-center rounded-full border border-white/15 bg-white/[0.07] px-4 py-2 text-xs font-semibold tracking-wide text-white/75">
              {t("رحلتك التعليمية تبدأ هنا", "YOUR LEARNING JOURNEY STARTS HERE")}
            </div>

            <h1 className="text-4xl font-black leading-[1.35] xl:text-5xl">
              {t(
                "كل خطوة تقرّبك من هدفك.",
                "Every step brings you closer to your goals."
              )}
            </h1>

            <p className="mt-6 max-w-sm text-base leading-8 text-white/65">
              {t(
                "سجّل الدخول لمتابعة دروسك وتقدّمك، أو أنشئ حسابًا جديدًا وابدأ رحلتك مع ديورانت.",
                "Sign in to continue your lessons and track your progress, or create an account and begin your journey with DURANT."
              )}
            </p>
          </div>

          <div className="relative z-10 flex items-center justify-between border-t border-white/10 pt-6 text-xs text-white/50">
            <span>
              {t("تعلّم • تدرب • تقدّم", "LEARN • PRACTICE • PROGRESS")}
            </span>
            <span>© DURANT</span>
          </div>
        </section>

        {/* Form panel */}
        <section className="flex min-w-0 flex-col justify-center px-5 py-8 sm:px-10 sm:py-12 xl:px-16">
          <div className="mx-auto w-full max-w-md">

            <div className="mb-8 flex items-center gap-3 lg:hidden">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#17213d] text-xl font-black text-white">
                D
              </div>
              <div>
                <p className="text-lg font-black tracking-[0.16em] text-[#17213d]">
                  DURANT
                </p>
                <p className="text-xs text-[#718096]">
                  {t("منصة ديورانت التعليمية", "DURANT Educational Platform")}
                </p>
              </div>
            </div>

            <div className="mb-8">
              <p className="mb-3 text-sm font-bold text-[#64748b]">
                {t("أهلًا بك في ديورانت", "WELCOME TO DURANT")}
              </p>

              <h2 className="text-3xl font-black tracking-tight text-[#17213d] sm:text-4xl">
                {mode === "signup"
                  ? t("أنشئ حسابك", "Create your account")
                  : t("مرحبًا بعودتك", "Welcome back")}
              </h2>

              <p className="mt-3 text-sm leading-7 text-[#718096]">
                {mode === "signup"
                  ? t(
                      "أنشئ حسابك وابدأ رحلتك التعليمية.",
                      "Create your account and start your learning journey."
                    )
                  : t(
                      "سجّل الدخول للعودة إلى رحلتك التعليمية.",
                      "Sign in to continue your learning journey."
                    )}
              </p>
            </div>

            <div className="mb-7 grid grid-cols-2 gap-1.5 rounded-2xl bg-[#f1f4f9] p-1.5">
              <button
                type="button"
                onClick={() => {
                  setMode("login");
                  setMessage("");
                }}
                className={`rounded-xl px-3 py-3 text-sm font-bold transition-all ${
                  mode === "login"
                    ? "bg-white text-[#17213d] shadow-sm"
                    : "text-[#718096] hover:text-[#17213d]"
                }`}
              >
                {t("تسجيل الدخول", "Sign in")}
              </button>

              <button
                type="button"
                onClick={() => {
                  setMode("signup");
                  setMessage("");
                }}
                className={`rounded-xl px-3 py-3 text-sm font-bold transition-all ${
                  mode === "signup"
                    ? "bg-white text-[#17213d] shadow-sm"
                    : "text-[#718096] hover:text-[#17213d]"
                }`}
              >
                {t("حساب جديد", "Create account")}
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {mode === "signup" && (
                <>
                  <label className="block">
                    <span className="mb-2 block text-sm font-semibold text-[#334155]">
                      {t("الاسم بالكامل", "Full name")}
                    </span>

                    <input
                      required
                      autoComplete="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full rounded-xl border border-[#dfe5ef] bg-white px-4 py-3.5 text-[#17213d] outline-none transition placeholder:text-[#a0aabc] focus:border-[#26385f] focus:ring-4 focus:ring-[#17213d]/[0.07]"
                      placeholder={t("اكتب اسمك بالكامل", "Enter your full name")}
                    />
                  </label>

                  <label className="block">
                    <span className="mb-2 block text-sm font-semibold text-[#334155]">
                      {t("الصف الدراسي", "School grade")}
                    </span>

                    <select
                      value={grade}
                      onChange={(e) => setGrade(e.target.value)}
                      className="w-full rounded-xl border border-[#dfe5ef] bg-white px-4 py-3.5 text-[#17213d] outline-none transition focus:border-[#26385f] focus:ring-4 focus:ring-[#17213d]/[0.07]"
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
                <span className="mb-2 block text-sm font-semibold text-[#334155]">
                  {t("البريد الإلكتروني", "Email address")}
                </span>

                <input
                  required
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  dir="ltr"
                  className="w-full rounded-xl border border-[#dfe5ef] bg-white px-4 py-3.5 text-left text-[#17213d] outline-none transition placeholder:text-[#a0aabc] focus:border-[#26385f] focus:ring-4 focus:ring-[#17213d]/[0.07]"
                  placeholder="example@email.com"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-[#334155]">
                  {t("كلمة المرور", "Password")}
                </span>

                <div className="relative">
                  <input
                    required
                    type={showPassword ? "text" : "password"}
                    minLength={6}
                    autoComplete={
                      mode === "signup" ? "new-password" : "current-password"
                    }
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    dir="ltr"
                    className={`w-full rounded-xl border border-[#dfe5ef] bg-white px-4 py-3.5 text-[#17213d] outline-none transition placeholder:text-[#a0aabc] focus:border-[#26385f] focus:ring-4 focus:ring-[#17213d]/[0.07] ${
                      isArabic ? "pl-14 text-right" : "pr-14 text-left"
                    }`}
                    placeholder={t("6 أحرف أو أكثر", "6 characters or more")}
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((value) => !value)}
                    className={`absolute top-1/2 -translate-y-1/2 rounded-lg p-2 text-[#718096] transition hover:bg-[#f1f4f9] hover:text-[#17213d] ${
                      isArabic ? "left-2" : "right-2"
                    }`}
                    aria-label={
                      showPassword
                        ? t("إخفاء كلمة المرور", "Hide password")
                        : t("إظهار كلمة المرور", "Show password")
                    }
                  >
                    {showPassword ? (
                      <svg
                        viewBox="0 0 24 24"
                        className="h-5 w-5"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M3 3l18 18M10.6 10.6a2 2 0 002.8 2.8"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M9.9 5.2A10.8 10.8 0 0112 5c5.2 0 8.7 4.7 9.5 6-.3.5-1.3 2.1-3.4 3.7M6.2 6.2C3.8 7.7 2.5 10 2.5 11c.8 1.3 4.3 6 9.5 6 1 0 1.9-.2 2.7-.5"
                        />
                      </svg>
                    ) : (
                      <svg
                        viewBox="0 0 24 24"
                        className="h-5 w-5"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6z"
                        />
                        <circle cx="12" cy="12" r="2.5" />
                      </svg>
                    )}
                  </button>
                </div>
              </label>

              {message && (
                <p
                  role="status"
                  aria-live="polite"
                  className="rounded-xl border border-[#d9e3f2] bg-[#f3f7fc] px-4 py-3 text-sm leading-7 text-[#26385f]"
                >
                  {message}
                </p>
              )}

              <button
                disabled={loading}
                type="submit"
                className="w-full rounded-xl bg-[#17213d] px-5 py-4 text-sm font-extrabold text-white shadow-[0_8px_20px_rgba(23,33,61,0.16)] transition hover:bg-[#243456] hover:shadow-[0_10px_24px_rgba(23,33,61,0.20)] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading
                  ? t("جارٍ التنفيذ...", "Please wait...")
                  : mode === "signup"
                    ? t("إنشاء الحساب", "Create account")
                    : t("تسجيل الدخول", "Sign in")}
              </button>
            </form>

            <p className="mt-8 text-center text-xs leading-6 text-[#94a0b2]">
              {t(
                "منصة ديورانت التعليمية",
                "DURANT Educational Platform"
              )}
              <span className="mx-2 text-[#c3cad5]">•</span>
              {t("مع مستر أمير عبد الناصر", "With Mr. Amir Abdel Nasser")}
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
