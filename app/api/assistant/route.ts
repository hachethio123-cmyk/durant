
import { GoogleGenAI } from "@google/genai";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MODEL = "gemini-3.5-flash-lite";

const SYSTEM_INSTRUCTIONS = `
أنت DURANT AI، المساعد الذكي الرسمي لمنصة DURANT التعليمية.

معلومات المنصة:
- المنصة مخصصة للتاريخ والدراسات الاجتماعية فقط.
- المرحلة الإعدادية: الدراسات الاجتماعية.
- المرحلة الثانوية: التاريخ والجغرافيا.
- الصفوف:
  first-prep, second-prep, third-prep,
  first-secondary, second-secondary, third-secondary.
- المنصة تحتوي على لوحة الطالب والملف الشخصي والإعدادات والإنجازات.
- Gold Coins هي عملات الطالب.
- XP هي نقاط الخبرة، وStudent Level هو مستوى الطالب.

قواعد:
- تحدث بالعربية المصرية عند استخدام العربية.
- اجعل إجاباتك مباشرة وواضحة وغير طويلة بلا داعٍ.
- ساعد في شرح التاريخ والجغرافيا والدراسات الاجتماعية والتدريب والمراجعة.
- استخدم بيانات الطالب المرفقة فقط عند الحديث عن حسابه.
- لا تخترع درجات أو إنجازات أو تقدمًا غير موجود.
- لا تدّعِ أن الدروس أو الاختبارات متاحة إذا لم تتوفر بيانات تثبت ذلك.
- لا تكشف بيانات أي طالب آخر أو معلومات المديرين أو الأسرار التقنية.
- لا تطلب كلمات المرور أو مفاتيح API.
- لا تدّعِ تنفيذ أي إجراء داخل المنصة.
- إذا سألك الطالب عن شيء غير متاح لك، وضّح ذلك بصراحة.
`;

type ChatMessage = {
  role: "user" | "assistant" | "model";
  content: string;
};

function errorResponse(message: string, status: number) {
  return Response.json({ error: message }, { status });
}

export async function POST(request: Request) {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return errorResponse("المساعد غير مُعدّ حاليًا.", 503);
    }

    let body: {
      message?: unknown;
      history?: unknown;
    };

    try {
      body = await request.json();
    } catch {
      return errorResponse("تعذر قراءة الرسالة المرسلة.", 400);
    }

    const message =
      typeof body.message === "string"
        ? body.message.trim()
        : "";

    if (!message || message.length > 4000) {
      return errorResponse(
        "الرسالة فارغة أو أطول من المسموح.",
        400
      );
    }

    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return errorResponse(
        "يجب تسجيل الدخول لاستخدام DURANT AI.",
        401
      );
    }

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("full_name, grade, gold_coins, xp_points, student_level")
      .eq("id", user.id)
      .maybeSingle();

    if (profileError || !profile) {
      return errorResponse(
        "تعذر تحميل بيانات حسابك.",
        404
      );
    }

    const history: ChatMessage[] = Array.isArray(body.history)
      ? body.history
          .filter((item: unknown): item is ChatMessage => {
            if (!item || typeof item !== "object") return false;

            const candidate = item as Record<string, unknown>;

            return (
              ["user", "assistant", "model"].includes(
                String(candidate.role)
              ) &&
              typeof candidate.content === "string"
            );
          })
          .slice(-8)
          .map((item) => ({
            role: item.role === "assistant" ? "model" : item.role,
            content: item.content.slice(0, 1500),
          }))
      : [];

    const studentContext = `
بيانات الطالب الحالي:
الاسم: ${profile.full_name || "غير محدد"}
الصف: ${profile.grade || "غير محدد"}
Gold Coins: ${profile.gold_coins ?? 0}
XP: ${profile.xp_points ?? 0}
المستوى: ${profile.student_level ?? "غير محدد"}

هذه بيانات صاحب الجلسة الحالية فقط.
لا تستنتج منها بيانات غير موجودة.
`;

    const contents = [
      ...history.map((item) => ({
        role: item.role,
        parts: [{ text: item.content }],
      })),
      {
        role: "user" as const,
        parts: [{ text: message }],
      },
    ];

    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
    });

    const stream = await ai.models.generateContentStream({
      model: MODEL,
      contents,
      config: {
        systemInstruction:
          SYSTEM_INSTRUCTIONS + "\n" + studentContext,
        maxOutputTokens: 700,
      },
    });

    const encoder = new TextEncoder();

    const readableStream = new ReadableStream<Uint8Array>({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            const text = chunk.text;

            if (text) {
              controller.enqueue(encoder.encode(text));
            }
          }

          controller.close();
        } catch (error) {
          console.error(
            "DURANT AI STREAM ERROR:",
            error instanceof Error
              ? `${error.name}: ${error.message}`
              : "Unknown error"
          );

          controller.error(error);
        }
      },
    });

    return new Response(readableStream, {
      status: 200,
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache, no-transform",
        "X-Accel-Buffering": "no",
      },
    });
  } catch (error) {
    console.error(
      "DURANT AI ERROR:",
      error instanceof Error
        ? `${error.name}: ${error.message}`
        : "Unknown error"
    );

    return errorResponse(
      "حدث خطأ أثناء تشغيل DURANT AI. حاول مرة أخرى.",
      500
    );
  }
}
