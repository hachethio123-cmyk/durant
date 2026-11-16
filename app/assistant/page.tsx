
"use client";

import {
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type ChangeEvent,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/components/ThemeProvider";
import { supabase } from "@/lib/supabase";
import StudentSidebar from "@/components/StudentSidebar";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

type Conversation = {
  id: string;
  title: string;
  messages: Message[];
  updated_at: string;
};

const suggestions = [
  {
    icon: "book",
    ar: "اشرح لي درسًا في التاريخ بطريقة سهلة",
    en: "Explain a history lesson simply",
    descriptionAr: "شرح واضح خطوة بخطوة",
    descriptionEn: "Clear step-by-step explanations",
  },
  {
    icon: "brain",
    ar: "اختبرني في الدراسات الاجتماعية",
    en: "Quiz me on social studies",
    descriptionAr: "اختبر معلوماتك وتعلّم من أخطائك",
    descriptionEn: "Test your knowledge and learn",
  },
  {
    icon: "target",
    ar: "اعمل لي خطة للمراجعة",
    en: "Create a revision plan",
    descriptionAr: "نظّم وقتك واستعد لامتحانك",
    descriptionEn: "Organize your study time",
  },
  {
    icon: "sparkles",
    ar: "إيه نظام النقاط والإنجازات في DURANT؟",
    en: "How do points and achievements work?",
    descriptionAr: "اكتشف نظام التقدم في المنصة",
    descriptionEn: "Discover your platform progress",
  },
];

function AssistantIcon({
  name,
  size = 20,
}: {
  name: string;
  size?: number;
}) {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  switch (name) {
    case "book":
      return (
        <svg {...common}>
          <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v16H6.5A2.5 2.5 0 0 0 4 21z" />
          <path d="M4 5.5v15M8 7h8M8 11h7" />
        </svg>
      );

    case "brain":
      return (
        <svg {...common}>
          <path d="M12 5a4 4 0 0 0-7.5 2A4 4 0 0 0 4 14a4 4 0 0 0 4 6h4z" />
          <path d="M12 5a4 4 0 0 1 7.5 2 4 4 0 0 1 .5 7 4 4 0 0 1-4 6h-4z" />
          <path d="M8 9c2 0 2 2 2 3M16 9c-2 0-2 2-2 3M8 16c1.5 0 2 .5 2 2M16 16c-1.5 0-2 .5-2 2M12 5v16" />
        </svg>
      );

    case "target":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9" />
          <circle cx="12" cy="12" r="5" />
          <circle cx="12" cy="12" r="1.5" />
        </svg>
      );

    case "sparkles":
      return (
        <svg {...common}>
          <path d="m12 3 1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z" />
          <path d="m19 14 .9 2.1L22 17l-2.1.9L19 20l-.9-2.1L16 17l2.1-.9z" />
        </svg>
      );

    case "send":
      return (
        <svg {...common}>
          <path d="m22 2-7 20-4-9-9-4z" />
          <path d="M22 2 11 13" />
        </svg>
      );

    case "copy":
      return (
        <svg {...common}>
          <rect x="8" y="8" width="13" height="13" rx="2" />
          <path d="M16 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h3" />
        </svg>
      );

    case "plus":
      return (
        <svg {...common}>
          <path d="M12 5v14M5 12h14" />
        </svg>
      );

    case "menu":
      return (
        <svg {...common}>
          <path d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      );

    case "edit":
      return (
        <svg {...common}>
          <path d="m16 4 4 4M4 20l4-.8L19 8a2.1 2.1 0 0 0-3-3L5 16z" />
        </svg>
      );

    case "trash":
      return (
        <svg {...common}>
          <path d="M3 6h18M8 6V4h8v2m3 0-1 14H6L5 6m4 4v6m6-6v6" />
        </svg>
      );

    case "arrow":
      return (
        <svg {...common}>
          <path d="M5 12h14M13 6l6 6-6 6" />
        </svg>
      );

    default:
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9" />
        </svg>
      );
  }
}

function FormattedMessage({
  content,
  direction,
}: {
  content: string;
  direction: "rtl" | "ltr";
}) {
  const lines = content.split("\n");

  function renderInline(text: string, prefix: string) {
    return text
      .split(/(\*\*[^*]+\*\*|`[^`]+`|\*[^*]+\*)/g)
      .map((part, i) => {
        const key = `${prefix}-${i}`;

        if (part.startsWith("**") && part.endsWith("**")) {
          return (
            <strong
              key={key}
              className="font-extrabold text-[#172744]"
            >
              {part.slice(2, -2)}
            </strong>
          );
        }

        if (part.startsWith("`") && part.endsWith("`")) {
          return (
            <code
              key={key}
              dir="ltr"
              className="rounded-md bg-[#eef1f6] px-1.5 py-0.5 text-[0.9em] text-[#263e62]"
            >
              {part.slice(1, -1)}
            </code>
          );
        }

        if (part.startsWith("*") && part.endsWith("*")) {
          return <em key={key}>{part.slice(1, -1)}</em>;
        }

        return part;
      });
  }

  const elements: ReactNode[] = [];
  let index = 0;

  while (index < lines.length) {
    const line = lines[index].trim();

    if (!line) {
      index++;
      continue;
    }

    const key = `block-${index}`;
    const heading = line.match(/^(#{1,3})\s+(.+)$/);

    if (heading) {
      const level = heading[1].length;

      elements.push(
        <div
          key={key}
          className={`font-extrabold tracking-tight text-[#172744] ${
            level === 1
              ? "mt-5 mb-3 text-[23px] sm:text-[27px]"
              : level === 2
                ? "mt-5 mb-2.5 text-[20px] sm:text-[23px]"
                : "mt-4 mb-2 text-[18px] sm:text-[20px]"
          }`}
        >
          {renderInline(heading[2], key)}
        </div>
      );

      index++;
      continue;
    }

    const bullet = /^[-*•]\s+/.test(line);
    const numbered = /^\d+[.)]\s+/.test(line);

    if (bullet || numbered) {
      const items: string[] = [];

      while (index < lines.length) {
        const current = lines[index].trim();

        const match = numbered
          ? current.match(/^\d+[.)]\s+(.+)$/)
          : current.match(/^[-*•]\s+(.+)$/);

        if (!match) break;

        items.push(match[1]);
        index++;
      }

      const Tag = numbered ? "ol" : "ul";

      elements.push(
        <Tag
          key={key}
          className={`my-3 space-y-2 ${
            numbered ? "list-decimal" : "list-disc"
          } ${
            direction === "rtl"
              ? "me-5 pe-2"
              : "ms-5 ps-2"
          }`}
        >
          {items.map((item, i) => (
            <li
              key={`${key}-${i}`}
              className="ps-1 font-semibold leading-[2] text-[#34445c]"
            >
              {renderInline(item, `${key}-${i}`)}
            </li>
          ))}
        </Tag>
      );

      continue;
    }

    if (line.startsWith(">")) {
      elements.push(
        <blockquote
          key={key}
          className={`my-4 rounded-xl border-[#c69b43] bg-[#f7f8fb] px-4 py-3 font-semibold leading-[2] text-[#52627a] ${
            direction === "rtl"
              ? "border-r-[3px]"
              : "border-l-[3px]"
          }`}
        >
          {renderInline(line.replace(/^>\s?/, ""), key)}
        </blockquote>
      );

      index++;
      continue;
    }

    if (/^[-*_]{3,}$/.test(line)) {
      elements.push(
        <hr key={key} className="my-5 border-[#e5eaf1]" />
      );

      index++;
      continue;
    }

    const paragraph = [line];
    index++;

    while (
      index < lines.length &&
      lines[index].trim() &&
      !/^(#{1,3})\s+/.test(lines[index].trim()) &&
      !/^[-*•]\s+/.test(lines[index].trim()) &&
      !/^\d+[.)]\s+/.test(lines[index].trim()) &&
      !lines[index].trim().startsWith(">") &&
      !/^[-*_]{3,}$/.test(lines[index].trim())
    ) {
      paragraph.push(lines[index].trim());
      index++;
    }

    elements.push(
      <p
        key={key}
        className="my-2 font-semibold leading-[2] text-[#34445c]"
      >
        {renderInline(paragraph.join(" "), key)}
      </p>
    );
  }

  return (
    <div
      dir={direction}
      className="w-full break-words text-start text-[17px] font-semibold leading-[2] sm:text-[18px]"
    >
      {elements}
    </div>
  );
}

export default function DurantAssistantPage() {
  const router = useRouter();
  const { language, languageReady } = useLanguage();

  const isArabic = language === "ar";
  const direction = isArabic ? "rtl" : "ltr";

  const t = (ar: string, en: string) =>
    isArabic ? ar : en;

  const [messages, setMessages] = useState<Message[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState("");
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [error, setError] = useState("");
  const [copiedId, setCopiedId] = useState("");
  const [historyOpen, setHistoryOpen] = useState(true);
  const [historyLoading, setHistoryLoading] = useState(false);

  const activeConversationRef = useRef("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  function setActiveId(id: string) {
    activeConversationRef.current = id;
    setActiveConversationId(id);
  }

  async function refreshConversations() {
    const { data, error: queryError } = await supabase
      .from("assistant_conversations")
      .select("id,title,messages,updated_at")
      .order("updated_at", { ascending: false });

    if (queryError) {
      console.error("Conversation history error:", queryError);
      return;
    }

    setConversations(
      (data ?? []).map((item) => ({
        id: item.id,
        title: item.title,
        messages: Array.isArray(item.messages)
          ? (item.messages as Message[])
          : [],
        updated_at: item.updated_at,
      }))
    );
  }

  useEffect(() => {
    if (!languageReady) return;

    let active = true;

    async function initialize() {
      const { data, error: authError } =
        await supabase.auth.getUser();

      if (!active) return;

      if (authError || !data.user) {
        router.replace("/login");
        return;
      }

      setHistoryLoading(true);

      const { data: rows, error: rowsError } = await supabase
        .from("assistant_conversations")
        .select("id,title,messages,updated_at")
        .order("updated_at", { ascending: false });

      if (!active) return;

      if (rowsError) {
        console.error("Could not load conversations:", rowsError);

        setError(
          t(
            "تعذر تحميل سجل المحادثات.",
            "Could not load conversation history."
          )
        );
      } else {
        setConversations(
          (rows ?? []).map((item) => ({
            id: item.id,
            title: item.title,
            messages: Array.isArray(item.messages)
              ? (item.messages as Message[])
              : [],
            updated_at: item.updated_at,
          }))
        );
      }

      setHistoryLoading(false);
      setCheckingAuth(false);
    }

    initialize();

    return () => {
      active = false;
    };
  }, [languageReady, router]);

  useEffect(() => {
    const container = scrollContainerRef.current;

    if (!container) return;

    container.scrollTo({
      top: container.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  function startNewChat() {
    if (loading) return;

    setActiveId("");
    setMessages([]);
    setInput("");
    setError("");

    textareaRef.current?.focus();
  }

  async function openConversation(conversation: Conversation) {
    if (loading) return;

    setActiveId(conversation.id);
    setMessages(conversation.messages ?? []);
    setInput("");
    setError("");

    if (window.innerWidth < 1024) {
      setHistoryOpen(false);
    }
  }

  async function renameConversation(conversation: Conversation) {
    const newTitle = window.prompt(
      t(
        "اكتب الاسم الجديد للمحادثة:",
        "Enter the new conversation name:"
      ),
      conversation.title
    );

    if (newTitle === null) return;

    const title = newTitle.trim();

    if (!title) return;

    const { error: updateError } = await supabase
      .from("assistant_conversations")
      .update({
        title,
        updated_at: new Date().toISOString(),
      })
      .eq("id", conversation.id);

    if (updateError) {
      console.error("Rename conversation error:", updateError);

      setError(
        t(
          "تعذر تغيير اسم المحادثة.",
          "Could not rename conversation."
        )
      );

      return;
    }

    setConversations((current) =>
      current.map((item) =>
        item.id === conversation.id
          ? { ...item, title }
          : item
      )
    );
  }

  async function deleteConversation(conversation: Conversation) {
    const confirmed = window.confirm(
      t(
        `هل أنت متأكد من حذف محادثة "${conversation.title}"؟`,
        `Delete "${conversation.title}"?`
      )
    );

    if (!confirmed) return;

    const { error: deleteError } = await supabase
      .from("assistant_conversations")
      .delete()
      .eq("id", conversation.id);

    if (deleteError) {
      console.error("Delete conversation error:", deleteError);

      setError(
        t(
          "تعذر حذف المحادثة.",
          "Could not delete conversation."
        )
      );

      return;
    }

    setConversations((current) =>
      current.filter((item) => item.id !== conversation.id)
    );

    if (activeConversationRef.current === conversation.id) {
      setActiveId("");
      setMessages([]);
    }
  }

  async function saveConversation(
    conversationId: string,
    title: string,
    updatedMessages: Message[]
  ) {
    const { error: saveError } = await supabase
      .from("assistant_conversations")
      .update({
        title,
        messages: updatedMessages,
        updated_at: new Date().toISOString(),
      })
      .eq("id", conversationId);

    if (saveError) {
      console.error("Could not save conversation:", saveError);

      setError(
        t(
          "تعذر حفظ المحادثة. تحقق من اتصالك وحاول مرة أخرى.",
          "Could not save the conversation. Check your connection and try again."
        )
      );

      return false;
    }

    await refreshConversations();

    return true;
  }

  async function sendMessage(text?: string) {
    const message = (text ?? input).trim();

    if (!message || loading || checkingAuth) return;

    const previousMessages = messages;

    const userMessage: Message = {
      id: `${Date.now()}-user`,
      role: "user",
      content: message,
    };

    const assistantId = `${Date.now()}-assistant`;

    const assistantMessage: Message = {
      id: assistantId,
      role: "assistant",
      content: "",
    };

    const nextMessages = [
      ...previousMessages,
      userMessage,
      assistantMessage,
    ];

    const existingConversation = conversations.find(
      (item) => item.id === activeConversationRef.current
    );

    const firstUserMessage = previousMessages.find(
      (item) => item.role === "user"
    );

    const title =
      existingConversation?.title ||
      firstUserMessage?.content.replace(/\s+/g, " ").slice(0, 55) ||
      message.replace(/\s+/g, " ").slice(0, 55) ||
      t("محادثة جديدة", "New conversation");

    setMessages(nextMessages);
    setInput("");
    setError("");
    setLoading(true);

    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }

    let conversationId = activeConversationRef.current;

    try {
      // إنشاء محادثة جديدة عند الحاجة
      if (!conversationId) {
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError || !user) {
          throw new Error(
            t(
              "انتهت جلسة تسجيل الدخول. سجل الدخول مرة أخرى.",
              "Your session has expired. Please sign in again."
            )
          );
        }

        const { data: inserted, error: insertError } =
          await supabase
            .from("assistant_conversations")
            .insert({
              user_id: user.id,
              title,
              messages: nextMessages,
            })
            .select("id")
            .single();

        if (insertError || !inserted) {
          console.error(
            "Conversation insert error:",
            insertError
          );

          throw new Error(
            insertError?.message ||
              t(
                "تعذر إنشاء المحادثة وحفظها.",
                "Could not create and save the conversation."
              )
          );
        }

        conversationId = inserted.id;
        setActiveId(conversationId);

        await refreshConversations();
      }

      // إرسال السؤال إلى DURANT AI
      const response = await fetch("/api/assistant", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message,
          history: previousMessages.map((item) => ({
            role: item.role,
            content: item.content,
          })),
        }),
      });

      if (!response.ok) {
        let errorMessage = t(
          "تعذر إرسال رسالتك. حاول مرة أخرى.",
          "Unable to send your message. Please try again."
        );

        try {
          const data = await response.json();

          if (typeof data.error === "string") {
            errorMessage = data.error;
          }
        } catch {
          // Keep default error
        }

        throw new Error(errorMessage);
      }

      if (!response.body) {
        throw new Error(
          t(
            "المتصفح لم يستقبل تدفق الإجابة.",
            "Your browser could not receive the response stream."
          )
        );
      }

      // استقبال الإجابة تدريجيًا
      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");

      let fullReply = "";

      while (true) {
        const { done, value } = await reader.read();

        if (done) break;

        fullReply += decoder.decode(value, {
          stream: true,
        });

        setMessages((current) =>
          current.map((item) =>
            item.id === assistantId
              ? { ...item, content: fullReply }
              : item
          )
        );
      }

      fullReply += decoder.decode();

      if (!fullReply.trim()) {
        throw new Error(
          t(
            "لم يصل رد من المساعد. حاول مرة أخرى.",
            "The assistant did not return a response."
          )
        );
      }

      const completedMessages = nextMessages.map((item) =>
        item.id === assistantId
          ? { ...item, content: fullReply }
          : item
      );

      setMessages(completedMessages);

      if (conversationId) {
        await saveConversation(
          conversationId,
          title,
          completedMessages
        );
      }
    } catch (err) {
      console.error("DURANT AI send error:", err);

      const errorText =
        err instanceof Error
          ? err.message
          : t(
              "حدث خطأ غير متوقع. حاول مرة أخرى.",
              "An unexpected error occurred."
            );

      setError(errorText);

      // الاحتفاظ بسؤال الطالب وأي جزء وصل من الإجابة
      const safeMessages = nextMessages.filter(
        (item) =>
          item.id !== assistantId || item.content.trim()
      );

      setMessages(safeMessages);

      if (conversationId) {
        await saveConversation(
          conversationId,
          title,
          safeMessages
        );
      }
    } finally {
      setLoading(false);
      textareaRef.current?.focus();
    }
  }

  function handleKeyDown(
    event: KeyboardEvent<HTMLTextAreaElement>
  ) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  }

  function resizeTextarea(
    event: ChangeEvent<HTMLTextAreaElement>
  ) {
    setInput(event.target.value);

    const element = event.target;

    element.style.height = "auto";

    element.style.height = `${Math.min(
      element.scrollHeight,
      160
    )}px`;
  }

  async function copyMessage(message: Message) {
    try {
      await navigator.clipboard.writeText(message.content);

      setCopiedId(message.id);

      window.setTimeout(() => {
        setCopiedId((current) =>
          current === message.id ? "" : current
        );
      }, 1800);
    } catch {
      setError(t("تعذر نسخ الإجابة.", "Unable to copy the response."));
    }
  }

  if (!languageReady || checkingAuth) {
    return (
      <div
        dir={direction}
        className="flex h-dvh items-center justify-center overflow-hidden bg-[#f5f7fb]"
      >
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-[3px] border-[#dce3ef] border-t-[#172744]" />

          <p className="mt-5 text-sm font-semibold text-[#64748b]">
            {t(
              "جاري تجهيز DURANT AI...",
              "Preparing DURANT AI..."
            )}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      dir={direction}
      className="fixed inset-0 flex h-[100dvh] min-h-0 w-full overflow-hidden bg-[#f5f7fb] text-[#172744]"
    >
      <div className="w-0 shrink-0 lg:w-72">
        <StudentSidebar />
      </div>

      <main className="flex h-dvh min-h-0 min-w-0 flex-1 overflow-hidden">
        {/* سجل المحادثات */}
        <aside
          className={`relative z-30 flex h-full shrink-0 flex-col overflow-hidden border-[#e5eaf1] bg-white transition-all duration-300 ${
            historyOpen
              ? "w-[280px] border-e"
              : "w-0 border-e-0"
          }`}
        >
          <div className="flex h-[76px] shrink-0 items-center justify-between border-b border-[#edf0f5] px-4">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#172744] text-lg font-black text-white">
                D
              </div>

              <span className="text-sm font-extrabold text-[#172744]">
                {t("محادثاتك", "Your chats")}
              </span>
            </div>

            <button
              onClick={() => setHistoryOpen(false)}
              className="rounded-lg p-2 text-[#8491a4] transition hover:bg-[#f1f4f8] hover:text-[#172744]"
              aria-label={t("إغلاق السجل", "Close history")}
            >
              <AssistantIcon name="menu" size={19} />
            </button>
          </div>

          <div className="p-3">
            <button
              onClick={startNewChat}
              disabled={loading}
              className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#172744] px-3 text-sm font-bold text-white transition hover:bg-[#263e62] disabled:opacity-50"
            >
              <AssistantIcon name="plus" size={17} />
              {t("محادثة جديدة", "New chat")}
            </button>
          </div>

          <div className="px-4 pb-2 pt-1 text-[11px] font-extrabold text-[#9aa5b5]">
            {t("الأخيرة", "Recent")}
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto px-2 pb-4">
            {historyLoading ? (
              <div className="px-3 py-5 text-center text-xs font-semibold text-[#94a0b1]">
                {t(
                  "جاري تحميل المحادثات...",
                  "Loading conversations..."
                )}
              </div>
            ) : conversations.length === 0 ? (
              <div className="px-3 py-8 text-center">
                <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-[#f1f4f8] text-[#8090a7]">
                  <AssistantIcon name="book" size={20} />
                </div>

                <p className="text-xs font-bold text-[#718096]">
                  {t(
                    "لا توجد محادثات بعد",
                    "No conversations yet"
                  )}
                </p>

                <p className="mt-1 text-[11px] leading-5 text-[#a0aaba]">
                  {t(
                    "ابدأ محادثة جديدة وستظهر هنا.",
                    "Start a new chat and it will appear here."
                  )}
                </p>
              </div>
            ) : (
              <div className="space-y-1">
                {conversations.map((conversation) => (
                  <div
                    key={conversation.id}
                    className={`group flex items-center gap-1 rounded-xl px-2 py-2 transition ${
                      activeConversationId === conversation.id
                        ? "bg-[#edf1f7]"
                        : "hover:bg-[#f5f7fa]"
                    }`}
                  >
                    <button
                      onClick={() =>
                        openConversation(conversation)
                      }
                      disabled={loading}
                      className="min-w-0 flex-1 text-start disabled:opacity-50"
                    >
                      <p className="truncate text-[12px] font-bold text-[#34445c]">
                        {conversation.title}
                      </p>

                      <p className="mt-1 text-[10px] text-[#9aa5b5]">
                        {new Date(
                          conversation.updated_at
                        ).toLocaleDateString(
                          isArabic ? "ar-EG" : "en-US"
                        )}
                      </p>
                    </button>

                    <div className="flex shrink-0 items-center opacity-100 sm:opacity-0 sm:group-hover:opacity-100">
                      <button
                        onClick={() =>
                          renameConversation(conversation)
                        }
                        title={t("إعادة التسمية", "Rename")}
                        className="rounded-lg p-1.5 text-[#8794a7] hover:bg-white hover:text-[#172744]"
                      >
                        <AssistantIcon name="edit" size={14} />
                      </button>

                      <button
                        onClick={() =>
                          deleteConversation(conversation)
                        }
                        title={t("حذف المحادثة", "Delete")}
                        className="rounded-lg p-1.5 text-[#a0aaba] hover:bg-white hover:text-red-600"
                      >
                        <AssistantIcon name="trash" size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="shrink-0 border-t border-[#edf0f5] px-4 py-3">
            <p className="text-center text-[10px] font-semibold text-[#a0aaba]">
              DURANT AI · {t("محادثاتك محفوظة", "Your chats are saved")}
            </p>
          </div>
        </aside>

        {/* محتوى المساعد */}
        <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
          <header className="sticky top-0 z-20 flex h-[76px] shrink-0 items-center justify-between border-b border-[#e8edf4] bg-white/95 px-3 backdrop-blur-xl sm:px-7 lg:px-8">
            <div className="flex min-w-0 items-center gap-3">
              {!historyOpen && (
                <button
                  onClick={() => setHistoryOpen(true)}
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#e3e8f0] bg-white text-[#344967] transition hover:bg-[#f3f5f9]"
                  aria-label={t(
                    "فتح سجل المحادثات",
                    "Open chat history"
                  )}
                >
                  <AssistantIcon name="menu" size={19} />
                </button>
              )}

              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[14px] bg-[#172744] text-[21px] font-black text-white shadow-sm">
                D
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h1 className="text-[17px] font-extrabold tracking-tight text-[#172744] sm:text-lg">
                    DURANT AI
                  </h1>

                  <span className="hidden rounded-md border border-[#e5eaf2] bg-[#f7f9fc] px-2 py-0.5 text-[10px] font-bold text-[#66758d] sm:inline">
                    AI ASSISTANT
                  </span>
                </div>

                <div className="mt-0.5 flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#16a36a]" />

                  <p className="text-[11px] font-medium text-[#8995a8]">
                    {t(
                      "مساعدك التعليمي الذكي",
                      "Your intelligent learning assistant"
                    )}
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={startNewChat}
              disabled={loading}
              className="flex h-10 shrink-0 items-center gap-2 rounded-xl border border-[#dfe5ee] bg-white px-3 text-sm font-bold text-[#243957] transition hover:border-[#172744] hover:bg-[#f6f8fb] disabled:opacity-40 sm:px-4"
            >
              <AssistantIcon name="plus" size={17} />

              <span className="hidden sm:inline">
                {t("محادثة جديدة", "New chat")}
              </span>
            </button>
          </header>

          <section className="relative flex min-h-0 flex-1 flex-col overflow-hidden">
            <div
              ref={scrollContainerRef}
              className="min-h-0 flex-1 overflow-x-hidden overflow-y-auto overscroll-contain"
            >
              {messages.length === 0 ? (
                <div className="mx-auto flex min-h-full w-full max-w-5xl flex-col items-center justify-center px-4 py-12 sm:px-8">
                  <div className="mb-7 flex h-[76px] w-[76px] items-center justify-center rounded-[25px] bg-[#172744] text-4xl font-black text-white shadow-xl shadow-[#172744]/15">
                    D
                  </div>

                  <div className="mb-3 flex items-center gap-2 rounded-full border border-[#e2e8f1] bg-white px-3 py-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#16a36a]" />

                    <span className="text-[10px] font-bold tracking-[0.16em] text-[#64748b]">
                      YOUR PERSONAL AI ASSISTANT
                    </span>
                  </div>

                  <h2 className="text-center text-[27px] font-black tracking-tight text-[#172744] sm:text-[38px]">
                    {t(
                      "أهلاً بيك في DURANT AI",
                      "Welcome to DURANT AI"
                    )}
                  </h2>

                  <p className="mt-3 max-w-[560px] text-center text-sm leading-7 text-[#718096] sm:text-[15px]">
                    {t(
                      "مساحتك الذكية للتعلّم. اسأل، افهم، تدرّب، واكتشف معلومات جديدة في التاريخ والدراسات الاجتماعية.",
                      "Your intelligent learning space. Ask questions, understand concepts, practice, and discover more about history and social studies."
                    )}
                  </p>

                  <div className="mt-11 grid w-full max-w-[760px] grid-cols-1 gap-3 sm:grid-cols-2">
                    {suggestions.map((suggestion) => (
                      <button
                        key={suggestion.icon}
                        onClick={() =>
                          sendMessage(
                            isArabic
                              ? suggestion.ar
                              : suggestion.en
                          )
                        }
                        disabled={loading}
                        className="group flex min-h-[112px] items-start gap-4 rounded-2xl border border-[#e4e9f1] bg-white p-5 text-start shadow-[0_2px_12px_rgba(23,39,68,0.025)] transition-all duration-200 hover:-translate-y-1 hover:border-[#9aa9c0] hover:shadow-[0_12px_30px_rgba(23,39,68,0.08)] disabled:opacity-50"
                      >
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#f0f3f8] text-[#263d60] transition-colors group-hover:bg-[#172744] group-hover:text-white">
                          <AssistantIcon
                            name={suggestion.icon}
                            size={21}
                          />
                        </div>

                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-extrabold leading-6 text-[#243957]">
                            {isArabic
                              ? suggestion.ar
                              : suggestion.en}
                          </p>

                          <p className="mt-1 text-xs leading-5 text-[#8a96a8]">
                            {isArabic
                              ? suggestion.descriptionAr
                              : suggestion.descriptionEn}
                          </p>
                        </div>

                        <span className="mt-1 text-[#a6b1c0] transition group-hover:text-[#172744]">
                          <AssistantIcon name="arrow" size={17} />
                        </span>
                      </button>
                    ))}
                  </div>

                  <p className="mt-8 text-center text-[11px] font-medium text-[#a0aaba]">
                    {t(
                      "ابدأ بسؤالك، وسنكمل رحلة التعلّم معًا.",
                      "Start with a question and let's learn together."
                    )}
                  </p>
                </div>
              ) : (
                <div className="mx-auto flex w-full max-w-[850px] flex-col gap-8 px-4 py-8 sm:px-8 sm:py-10">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`group flex w-full gap-3 sm:gap-4 ${
                        message.role === "user"
                          ? "flex-row-reverse"
                          : "flex-row"
                      }`}
                    >
                      <div
                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-sm font-black ${
                          message.role === "assistant"
                            ? "bg-[#172744] text-white"
                            : "border border-[#e0e6ef] bg-white text-[#344967]"
                        }`}
                      >
                        {message.role === "assistant" ? "D" : "U"}
                      </div>

                      <div
                        className={`flex min-w-0 max-w-[92%] flex-col sm:max-w-[90%] ${
                          message.role === "user"
                            ? "items-end"
                            : "items-start"
                        }`}
                      >
                        <div className="mb-1.5 px-1 text-[11px] font-bold text-[#8995a8]">
                          {message.role === "assistant"
                            ? "DURANT AI"
                            : t("أنت", "You")}
                        </div>

                        <div
                          className={`rounded-2xl px-4 py-4 sm:px-5 sm:py-5 ${
                            message.role === "user"
                              ? "rounded-tr-md bg-[#172744] text-[16px] font-semibold leading-[2] text-white shadow-sm sm:text-[17px]"
                              : "rounded-tl-md border border-[#e5eaf1] bg-white text-[17px] font-semibold leading-[2] text-[#34445c] shadow-[0_2px_10px_rgba(23,39,68,0.025)] sm:text-[18px]"
                          }`}
                        >
                          {message.content ? (
                            message.role === "assistant" ? (
                              <FormattedMessage
                                content={message.content}
                                direction={direction}
                              />
                            ) : (
                              <p className="whitespace-pre-wrap break-words font-semibold">
                                {message.content}
                              </p>
                            )
                          ) : message.role === "assistant" && loading ? (
                            <div className="flex items-center gap-2 py-1 text-[#8290a5]">
                              <span className="h-2 w-2 animate-pulse rounded-full bg-[#172744]" />

                              <span className="text-sm font-semibold">
                                {t("جاري التفكير...", "Thinking...")}
                              </span>
                            </div>
                          ) : null}

                          {message.role === "assistant" &&
                            message.content &&
                            !loading && (
                              <button
                                onClick={() =>
                                  copyMessage(message)
                                }
                                className="mt-3 flex items-center gap-1.5 rounded-lg px-2 py-1 text-[11px] font-semibold text-[#8290a5] transition hover:bg-[#f1f4f8] hover:text-[#172744]"
                              >
                                <AssistantIcon
                                  name="copy"
                                  size={13}
                                />

                                {copiedId === message.id
                                  ? t("تم النسخ", "Copied")
                                  : t("نسخ الإجابة", "Copy response")}
                              </button>
                            )}
                        </div>
                      </div>
                    </div>
                  ))}

                  {error && (
                    <div className="mx-12 rounded-xl border border-[#e6caca] bg-white p-4 text-sm text-[#a34c4c] shadow-sm">
                      <p className="leading-6">{error}</p>

                      <button
                        onClick={() => {
                          const lastUserMessage = [...messages]
                            .reverse()
                            .find(
                              (item) => item.role === "user"
                            );

                          if (lastUserMessage) {
                            const retryMessages = messages.filter(
                              (item) =>
                                item.id !== lastUserMessage.id
                            );

                            setMessages(retryMessages);

                            // إعادة المحاولة دون تكرار السؤال
                            window.setTimeout(() => {
                              sendMessage(lastUserMessage.content);
                            }, 0);
                          }
                        }}
                        disabled={loading}
                        className="mt-2 font-bold text-[#263d60] underline underline-offset-4"
                      >
                        {t(
                          "إرسال السؤال مرة أخرى",
                          "Send the question again"
                        )}
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* مربع الكتابة الثابت */}
            <div className="sticky bottom-0 z-50 mt-auto w-full shrink-0 border-t border-[#e8edf4] bg-white px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-4 shadow-[0_-5px_20px_rgba(23,39,68,0.04)] sm:px-8 sm:pb-6">
              <div className="mx-auto max-w-[850px]">
                <div className="flex items-end gap-3 rounded-[20px] border border-[#dfe5ee] bg-[#f8f9fc] p-2.5 shadow-[0_4px_18px_rgba(23,39,68,0.035)] transition-all focus-within:border-[#8292ac] focus-within:bg-white focus-within:shadow-[0_5px_24px_rgba(23,39,68,0.07)]">
                  <textarea
                    ref={textareaRef}
                    value={input}
                    onChange={resizeTextarea}
                    onKeyDown={handleKeyDown}
                    disabled={loading}
                    rows={1}
                    placeholder={t(
                      "اكتب سؤالك لـ DURANT AI...",
                      "Message DURANT AI..."
                    )}
                    className="max-h-40 min-h-[46px] flex-1 resize-none bg-transparent px-3 py-3 text-[15px] font-semibold leading-7 text-[#172744] outline-none placeholder:text-[#9aa5b5] disabled:opacity-60"
                  />

                  <button
                    onClick={() => sendMessage()}
                    disabled={!input.trim() || loading}
                    aria-label={t(
                      "إرسال الرسالة",
                      "Send message"
                    )}
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[14px] bg-[#172744] text-white shadow-sm transition-all hover:bg-[#263e62] active:scale-95 disabled:cursor-not-allowed disabled:bg-[#cbd3df] disabled:shadow-none"
                  >
                    <AssistantIcon name="send" size={18} />
                  </button>
                </div>

                <div className="mt-3 flex items-center justify-between gap-3 px-1">
                  <p className="text-[10px] font-medium text-[#9aa5b5] sm:text-[11px]">
                    {t(
                      "Enter للإرسال • Shift + Enter لسطر جديد",
                      "Enter to send • Shift + Enter for a new line"
                    )}
                  </p>

                  <p className="text-[10px] font-medium text-[#9aa5b5] sm:text-[11px]">
                    DURANT AI
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
