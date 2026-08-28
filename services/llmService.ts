import { AI_CONFIG, aiFetch } from "./aiConfig";

export type ChatMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

type ChatCompletionResponse = {
  choices?: Array<{
    message?: {
      content?: string;
      reasoning_content?: string;
    };
  }>;
  error?: string | { message?: string };
};

const REASONING_MARKERS = [
  /we need to/i,
  /thinking process/i,
  /analyze the request/i,
  /system prompt/i,
  /no markdown/i,
  /1[–-]3 sentences/i,
  /dictionary has/i,
  /could say/i,
  /that's \d+ sentences/i,
  /язык ответа/i,
  /формат:/i,
  /запрещено:/i,
  /словарь для практики/i,
];

const BANNED_EXACT = new Set([
  "только русский",
  "только русским",
  "язык ответа",
  "ок",
  "хорошо",
  "понял",
]);

const stripModelNoise = (raw: string) =>
  raw
    .replace(/<think>[\s\S]*?<\/think>/gi, "")
    .replace(/<\/?think>/gi, "")
    .replace(/^["'«]+|["'»]+$/g, "")
    .trim();

const looksLikeReasoning = (text: string) => {
  if (!text) return true;
  if (text.length > 320) return true;
  return REASONING_MARKERS.some((marker) => marker.test(text));
};

const isWeakReply = (text: string) => {
  const normalized = text.toLowerCase().replace(/[.!?…]+$/g, "").trim();
  if (normalized.length < 18) return true;
  if (BANNED_EXACT.has(normalized)) return true;
  if (/^только\s+русск/i.test(normalized)) return true;
  if (!/[А-Яа-яЁё]{4,}/.test(text)) return true;
  return false;
};

const collectMatches = (raw: string, pattern: RegExp): string[] => {
  const result: string[] = [];
  const regex = new RegExp(pattern.source, pattern.flags.includes("g") ? pattern.flags : `${pattern.flags}g`);
  let match: RegExpExecArray | null;
  while ((match = regex.exec(raw)) !== null) {
    if (match[1]) result.push(match[1]);
  }
  return result;
};

const extractQuotedRussian = (raw: string): string => {
  const matches = [
    ...collectMatches(raw, /"([^"\n]{12,220})"/g),
    ...collectMatches(raw, /«([^»\n]{12,220})»/g),
  ]
    .map((chunk) => stripModelNoise(chunk))
    .filter(
      (text) =>
        /[А-Яа-яЁё]/.test(text) &&
        !looksLikeReasoning(text) &&
        !isWeakReply(text)
    );

  return matches.length ? matches[matches.length - 1] : "";
};

const limitSentences = (text: string, max = 3) => {
  const parts = text
    .split(/(?<=[.!?…])\s+/)
    .map((part) => part.trim())
    .filter(Boolean);
  return parts.slice(0, max).join(" ");
};

export const sanitizeSpokenReply = (raw: string): string => {
  const cleaned = stripModelNoise(raw);
  if (!cleaned || looksLikeReasoning(cleaned) || isWeakReply(cleaned)) {
    return "";
  }
  return limitSentences(cleaned, 3);
};

const pickAssistantText = (message?: {
  content?: string;
  reasoning_content?: string;
}) => {
  const fromContent = sanitizeSpokenReply(message?.content || "");
  if (fromContent) return fromContent;

  return sanitizeSpokenReply(
    extractQuotedRussian(message?.reasoning_content || "")
  );
};

const requestCompletion = async (messages: ChatMessage[]) => {
  const response = await aiFetch(
    `${AI_CONFIG.llmBaseUrl}/chat/completions`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: AI_CONFIG.llmModel,
        messages,
        temperature: 0.6,
        max_tokens: AI_CONFIG.maxReplyTokens,
        stream: false,
        enable_thinking: false,
        chat_template_kwargs: { enable_thinking: false },
      }),
    },
    AI_CONFIG.llmTimeoutMs
  );

  if (!response.ok) {
    let detail = `LLM error ${response.status}`;
    try {
      const data = await response.json();
      detail =
        (typeof data.error === "string"
          ? data.error
          : data.error?.message) || detail;
    } catch {
      // ignore
    }
    throw new Error(detail);
  }

  const data = (await response.json()) as ChatCompletionResponse;
  return pickAssistantText(data.choices?.[0]?.message);
};

export const chatWithLocalLlm = async (
  messages: ChatMessage[]
): Promise<string> => {
  let content = await requestCompletion(messages);

  if (!content) {
    content = await requestCompletion([
      ...messages,
      {
        role: "user",
        content:
          "Предыдущий ответ был слишком коротким или служебным. Ответь полноценной репликой репетитора студенту: минимум 10 слов, по-русски, с вопросом по слову из словаря.",
      },
    ]);
  }

  if (!content) {
    throw new Error("Empty LLM response");
  }

  return content;
};
