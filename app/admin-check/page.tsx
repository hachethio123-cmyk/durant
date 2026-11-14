"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function AdminCheckPage() {
  const [result, setResult] = useState("جاري الفحص...");

  useEffect(() => {
    async function checkAdmin() {
      const { data: userData, error: userError } =
        await supabase.auth.getUser();

      if (userError || !userData.user) {
        setResult("لا توجد جلسة مستخدم نشطة");
        return;
      }

      const { data, error } = await supabase.rpc("is_admin");

      if (error) {
        setResult("خطأ في فحص الصلاحية: " + error.message);
        return;
      }

      setResult(
        "البريد: " + userData.user.email +
        "\nصلاحية المدير: " + String(data)
      );
    }

    checkAdmin();
  }, []);

  return (
    <main style={{ padding: 30, whiteSpace: "pre-wrap", direction: "rtl" }}>
      <h1>فحص صلاحيات المدير</h1>
      <p>{result}</p>
    </main>
  );
}
