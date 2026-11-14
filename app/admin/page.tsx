
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const supabase = await createClient();

  // التحقق من جلسة المستخدم على السيرفر
  const { data, error: claimsError } =
    await supabase.auth.getClaims();

  if (claimsError || !data?.claims) {
    redirect("/login");
  }

  // التحقق من صلاحية المدير من قاعدة البيانات
  const { data: isAdmin, error: adminError } =
    await supabase.rpc("is_admin");

  if (adminError || isAdmin !== true) {
    redirect("/dashboard");
  }

  return (
    <main
      dir="rtl"
      className="min-h-screen bg-[#f1f3fb] p-6 md:p-10"
    >
      <div className="mx-auto max-w-6xl">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <p className="mb-2 text-sm font-semibold text-blue-600">
            DURANT ADMINISTRATION
          </p>

          <h1 className="text-3xl font-bold text-[#17213d]">
            لوحة المديرين
          </h1>

          <p className="mt-3 text-slate-500">
            تم التحقق من هويتك وصلاحياتك بنجاح.
            مساحة إدارة المنصة جاهزة للمرحلة التالية.
          </p>
        </div>
      </div>
    </main>
  );
}
