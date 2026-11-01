
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";

const grades = [
  { value: "first-prep", label: "الصف الأول الإعدادي" },
  { value: "second-prep", label: "الصف الثاني الإعدادي" },
  { value: "third-prep", label: "الصف الثالث الإعدادي" },
  { value: "first-secondary", label: "الصف الأول الثانوي" },
  { value: "second-secondary", label: "الصف الثاني الثانوي" },
  { value: "third-secondary", label: "الصف الثالث الثانوي" },
];

export default function LoginPage() {
  const router = useRouter();

  const [mode, setMode] = useState<"signup" | "login">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [grade, setGrade] = useState("third-prep");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      if (mode === "signup") {
        if (!name.trim()) {
          setMessage("اكتب اسمك بالكامل.");
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
          "تم إنشاء حسابك بنجاح. اكتب بريدك الإلكتروني وكلمة المرور لتسجيل الدخول."
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
      setMessage(
        error instanceof Error
          ? error.message
          : "حدث خطأ، حاول مرة أخرى."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main
      dir="rtl"
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
              ? "أنشئ حسابك وابدأ رحلتك التعليمية"
              : "أهلاً بك في منصة ديورانت"}
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
            حساب جديد
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
            تسجيل الدخول
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "signup" && (
            <>
              <label className="block">
                <span className="mb-2 block text-sm text-slate-300">
                  الاسم بالكامل
                </span>

                <input
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-800 p-4 outline-none focus:border-yellow-400"
                  placeholder="اكتب اسمك"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm text-slate-300">
                  الصف الدراسي
                </span>

                <select
                  value={grade}
                  onChange={(e) => setGrade(e.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-800 p-4 outline-none focus:border-yellow-400"
                >
                  {grades.map((item) => (
                    <option key={item.value} value={item.value}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </label>
            </>
          )}

          <label className="block">
            <span className="mb-2 block text-sm text-slate-300">
              البريد الإلكتروني
            </span>

            <input
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-800 p-4 outline-none focus:border-yellow-400"
              placeholder="example@email.com"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm text-slate-300">
              كلمة المرور
            </span>

            <div className="relative">
              <input
                required
                type={showPassword ? "text" : "password"}
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-800 p-4 pl-14 outline-none focus:border-yellow-400"
                placeholder="6 أحرف أو أكثر"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-yellow-400"
                aria-label={
                  showPassword
                    ? "إخفاء كلمة المرور"
                    : "إظهار كلمة المرور"
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
              ? "جارٍ التنفيذ..."
              : mode === "signup"
                ? "إنشاء الحساب"
                : "تسجيل الدخول"}
          </button>
        </form>

        <p className="mt-6 text-center text-xs leading-6 text-slate-400">
          منصة DURANT التعليمية
          <br />
          مع مستر أمير عبد الناصر
        </p>
      </div>
    </main>
  );
}
