import { getSystemPrompt } from "@/lib/system-prompt";

/*
  Rota do chat (roda só no servidor).
  Recebe a conversa, aplica as proteções, envia para o cérebro do bot no site de chamados
  (TIMETRACK_API_URL + /api/cerebro) e devolve a resposta aos pedaços, do jeito que ela vier.
  Erros chegam ao navegador como um evento: data: {"type":"error","message":"..."}
*/

export const dynamic = "force-dynamic";
export const maxDuration = 60;

const MAX_MESSAGES = 20;
const MAX_MESSAGE_LENGTH = 4000;
// Um pouco abaixo do maxDuration, para ainda dar tempo de avisar o erro
const UPSTREAM_TIMEOUT_MS = 55_000;
const TEST_MESSAGE = "Não consigo logar";

const FRIENDLY_ERRORS = {
  unavailable: "O atendimento está indisponível no momento. Tente de novo em alguns minutos.",
  upstream: "Não consegui falar com o atendimento agora. Tente de novo em alguns instantes.",
  interrupted: "A resposta foi interrompida. Tente enviar sua mensagem de novo.",
  invalidBody: "Não entendi a mensagem enviada. Atualize a página e tente de novo.",
  noUserMessage: "Escreva uma mensagem para começar o atendimento.",
  tooLong: `Sua mensagem passou de ${MAX_MESSAGE_LENGTH} caracteres. Encurte o texto e envie de novo.`,
};

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

type ContentType = "text/event-stream" | "text/plain";

function errorEvent(message: string): string {
  return `data: ${JSON.stringify({ type: "error", message })}\n\n`;
}

function streamHeaders(contentType: ContentType): HeadersInit {
  return {
    "Content-Type": `${contentType}; charset=utf-8`,
    "Cache-Control": "no-cache, no-transform",
    // Evita que proxies segurem a resposta antes de repassar os pedaços
    "X-Accel-Buffering": "no",
  };
}

function errorResponse(message: string, status: number, contentType: ContentType): Response {
  return new Response(errorEvent(message), { status, headers: streamHeaders(contentType) });
}

function isChatMessage(value: unknown): value is ChatMessage {
  if (typeof value !== "object" || value === null) return false;
  const { role, content } = value as Record<string, unknown>;
  return (role === "user" || role === "assistant") && typeof content === "string";
}

// Mantém só as últimas mensagens e garante que a conversa comece por uma do usuário
function limitConversation(messages: ChatMessage[]): ChatMessage[] {
  const recent = messages.slice(-MAX_MESSAGES);
  const firstUserIndex = recent.findIndex((message) => message.role === "user");
  return firstUserIndex === -1 ? [] : recent.slice(firstUserIndex);
}

/*
  Repassa o corpo do cérebro pedaço por pedaço. Se a conexão cair no meio da resposta,
  acrescenta um evento de erro amigável em vez de deixar a resposta cortada sem aviso.
*/
function relayStream(upstreamBody: ReadableStream<Uint8Array>): ReadableStream<Uint8Array> {
  const reader = upstreamBody.getReader();
  const encoder = new TextEncoder();

  return new ReadableStream<Uint8Array>({
    async pull(controller) {
      try {
        const { done, value } = await reader.read();
        if (done) {
          controller.close();
          return;
        }
        controller.enqueue(value);
      } catch {
        controller.enqueue(encoder.encode(errorEvent(FRIENDLY_ERRORS.interrupted)));
        controller.close();
      }
    },
    cancel(reason) {
      // Quem pediu fechou a página: para de ler o cérebro também
      return reader.cancel(reason);
    },
  });
}

async function answer(messages: ChatMessage[], contentType: ContentType): Promise<Response> {
  const baseUrl = process.env.TIMETRACK_API_URL;
  if (!baseUrl) {
    return errorResponse(FRIENDLY_ERRORS.unavailable, 503, contentType);
  }

  let upstream: Response;
  try {
    upstream = await fetch(`${baseUrl.replace(/\/+$/, "")}/api/cerebro`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages, system: getSystemPrompt() }),
      cache: "no-store",
      signal: AbortSignal.timeout(UPSTREAM_TIMEOUT_MS),
    });
  } catch {
    return errorResponse(FRIENDLY_ERRORS.upstream, 502, contentType);
  }

  if (!upstream.ok || !upstream.body) {
    // Descarta o corpo do erro: detalhes técnicos não vão para o navegador
    await upstream.body?.cancel();
    return errorResponse(FRIENDLY_ERRORS.upstream, 502, contentType);
  }

  return new Response(relayStream(upstream.body), {
    status: 200,
    headers: streamHeaders(contentType),
  });
}

export async function POST(request: Request): Promise<Response> {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return errorResponse(FRIENDLY_ERRORS.invalidBody, 400, "text/event-stream");
  }

  const rawMessages = (body as { messages?: unknown } | null)?.messages;
  if (!Array.isArray(rawMessages) || !rawMessages.every(isChatMessage)) {
    return errorResponse(FRIENDLY_ERRORS.invalidBody, 400, "text/event-stream");
  }

  if (rawMessages.some((message) => message.content.length > MAX_MESSAGE_LENGTH)) {
    return errorResponse(FRIENDLY_ERRORS.tooLong, 400, "text/event-stream");
  }

  const messages = limitConversation(rawMessages);
  if (messages.length === 0) {
    return errorResponse(FRIENDLY_ERRORS.noUserMessage, 400, "text/event-stream");
  }

  return answer(messages, "text/event-stream");
}

// GET /api/chat?teste=1: mesma coisa que um POST com "Não consigo logar", em texto puro,
// para testar direto no navegador
export async function GET(request: Request): Promise<Response> {
  const isTest = new URL(request.url).searchParams.get("teste") === "1";
  if (!isTest) {
    return new Response("Use POST para conversar, ou GET /api/chat?teste=1 para testar.", {
      status: 405,
      headers: { Allow: "POST, GET", "Content-Type": "text/plain; charset=utf-8" },
    });
  }

  return answer([{ role: "user", content: TEST_MESSAGE }], "text/plain");
}
