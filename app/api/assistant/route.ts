
import { GoogleGenAI, ThinkingLevel } from "@google/genai";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MODEL = "gemini-3.5-flash-lite";

const SYSTEM_INSTRUCTIONS = `
أنت DURANT AI، المساعد الذكي الرسمي لمنصة DURANT التعليمية.

━━━━━━━━━━━━━━━━━━━━
هوية المنصة
━━━━━━━━━━━━━━━━━━━━

- المنصة متخصصة في التاريخ والدراسات الاجتماعية فقط.
- المرحلة الإعدادية: الدراسات الاجتماعية.
- المرحلة الثانوية: التاريخ والجغرافيا.
- الصفوف:
  first-prep, second-prep, third-prep,
  first-secondary, second-secondary, third-secondary.
- Gold Coins هي عملات الطالب.
- XP هي نقاط الخبرة.
- Student Level هو مستوى الطالب.

━━━━━━━━━━━━━━━━━━━━
طريقة التفكير والتحليل
━━━━━━━━━━━━━━━━━━━━

- افهم السؤال جيدًا قبل الإجابة.
- حلل المطلوب وحدد المعلومات الضرورية للإجابة.
- لا تتسرع في الإجابة عن الأسئلة التاريخية الدقيقة.
- تحقق من أسماء الشخصيات والتواريخ والأحداث وأسبابها.
- فرّق بين الحقائق التاريخية والآراء والتفسيرات.
- لا تعرض معلومات غير مؤكدة باعتبارها حقائق.
- لا تكشف التفكير الداخلي أو المداولات الخاصة؛ اعرض النتيجة والتفسير المفيد فقط.

━━━━━━━━━━━━━━━━━━━━
البحث والتحقق من المصادر
━━━━━━━━━━━━━━━━━━━━

لديك إمكانية استخدام Google Search.

استخدم البحث عندما:
- يسأل الطالب عن معلومة تاريخية دقيقة.
- يسأل عن الشخص الذي أنشأ أو بنى أو اكتشف شيئًا.
- يسأل عن تاريخ أو سنة أو واقعة تحتاج إلى تحقق.
- تكون المعلومة غير مؤكدة أو قابلة للالتباس.
- يسأل عن معلومة حديثة أو متغيرة.
- تحتاج إلى مقارنة أكثر من رواية أو مصدر.

عند البحث:
- أعطِ الأولوية للمصادر الحكومية والتعليمية والجامعات والمؤسسات العلمية والمراجع التاريخية المعروفة.
- لا تعتمد على منشور مجهول أو منتدى باعتباره دليلًا.
- قارن المعلومات عند وجود اختلاف بين المصادر.
- لا تخترع روابط أو مصادر.
- لا تدّعِ أنك بحثت إذا لم تستخدم البحث بالفعل.
- استخدم نتائج البحث في صياغة إجابة دقيقة ومفهومة.
- إذا لم تجد دليلًا موثوقًا، وضّح ذلك للطالب.

━━━━━━━━━━━━━━━━━━━━
قواعد الإجابة التعليمية
━━━━━━━━━━━━━━━━━━━━

- تحدث بالعربية المصرية عند استخدام العربية.
- اجعل الإجابة مباشرة وواضحة ومنظمة.
- استخدم عناوين ونقاطًا عند الحاجة.
- اشرح المصطلحات الصعبة بطريقة تناسب المرحلة الدراسية.
- لا تطل الإجابة دون داعٍ.
- عند شرح درس، استخدم أمثلة مناسبة للمنهج.
- لا تخلط بين الشخصيات التاريخية المتشابهة.
- إذا كان السؤال يحتمل أكثر من معنى، اطلب توضيحًا.
- إذا اكتشفت أن إجابة سابقة كانت خاطئة، اعترف بالخطأ وصححه.

━━━━━━━━━━━━━━━━━━━━
خصوصية الطالب وأمان المنصة
━━━━━━━━━━━━━━━━━━━━

- استخدم بيانات الطالب المرفقة فقط عند الحديث عن حسابه.
- لا تخترع درجات أو إنجازات أو تقدمًا غير موجود.
- لا تكشف بيانات أي طالب آخر.
- لا تكشف معلومات المديرين أو الأسرار التقنية.
- لا تطلب كلمات المرور أو مفاتيح API.
- لا تدّعِ تنفيذ أي إجراء داخل المنصة.
- لا تدّعِ أن الدروس أو الاختبارات متاحة إذا لم تتوفر بيانات تثبت ذلك.
- إذا لم تكن المعلومة متاحة لك، قل ذلك بوضوح.

هدفك الأساسي: تقديم إجابات تعليمية صحيحة وموثوقة ومفيدة للطالب.
`;

type ChatMessage = {
  role: "user" | "assistant" | "model";
  content: string;
};

type GroundingSource = {
  web?: {
    uri?: string;
    title?: string;
  };
};

function errorResponse(message: string, status: number) {
  return Response.json({ error: message }, { status });
}

function isValidHttpUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
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

    // التحقق من جلسة الطالب
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

    // تحميل بيانات الطالب الحالي فقط
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select(
        "full_name, grade, gold_coins, xp_points, student_level"
      )
      .eq("id", user.id)
      .maybeSingle();

    if (profileError || !profile) {
      return errorResponse(
        "تعذر تحميل بيانات حسابك.",
        404
      );
    }

    // تنظيف سجل المحادثة
    const history: ChatMessage[] = Array.isArray(body.history)
      ? body.history
          .filter((item: unknown): item is ChatMessage => {
            if (!item || typeof item !== "object") {
              return false;
            }

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
            role:
              item.role === "assistant"
                ? "model"
                : item.role,
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

    // تشغيل النموذج مع البحث عند الحاجة
    const stream = await ai.models.generateContentStream({
      model: MODEL,
      contents,
      config: {
        systemInstruction:
          SYSTEM_INSTRUCTIONS + "\n" + studentContext,

        thinkingConfig: {
          thinkingLevel: ThinkingLevel.MEDIUM,
        },

        tools: [
          {
            googleSearch: {},
          },
        ],

        maxOutputTokens: 1200,
        abortSignal: request.signal,
      },
    });

    const encoder = new TextEncoder();

    const readableStream = new ReadableStream<Uint8Array>({
      async start(controller) {
        const sources = new Map<string, string>();

        try {
          for await (const chunk of stream) {
            // إرسال الإجابة تدريجيًا
            const text = chunk.text;

            if (text) {
              controller.enqueue(
                encoder.encode(text)
              );
            }

            // استخراج مصادر Google Search
            const candidate = chunk.candidates?.[0];

            const groundingChunks =
              candidate?.groundingMetadata?.groundingChunks ?? [];

            for (const item of groundingChunks as GroundingSource[]) {
              const uri = item.web?.uri;
              const title = item.web?.title || "مصدر";

              if (
                uri &&
                isValidHttpUrl(uri) &&
                !sources.has(uri)
              ) {
                sources.set(uri, title);
              }
            }
          }

          // إضافة المصادر في نهاية الإجابة
          if (sources.size > 0) {
            let sourceText = "\n\n---\n";
            sourceText += "**المصادر والمراجع:**\n";

            for (const [uri, title] of sources) {
              sourceText += `- ${title}\n  ${uri}\n`;
            }

            controller.enqueue(
              encoder.encode(sourceText)
            );
          }

          controller.close();
        } catch (error) {
          console.error(
            "DURANT AI STREAM ERROR:",
            error instanceof Error
              ? `${error.name}: ${error.message}`
              : "Unknown error"
          );

          try {
            controller.enqueue(
              encoder.encode(
                "\n\nتعذر إكمال الإجابة بسبب مشكلة مؤقتة في الاتصال. حاول مرة أخرى."
              )
            );

            controller.close();
          } catch {
            // قد يكون الاتصال قد أُغلق بالفعل.
          }
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
