// Conversa com a rota /api/chat e entrega a resposta do atendente aos pedaços.

export interface ChatHistoryMessage {
  role: "user" | "assistant";
  content: string;
}

// Erro com mensagem já pronta para mostrar na tela
export class ChatReplyError extends Error {}

const GENERIC_ERROR = "Não consegui falar com o atendimento agora. Tente de novo em alguns instantes.";
const EMPTY_REPLY_ERROR = "Não recebi resposta do atendimento. Tente enviar de novo.";

// Formato de cada linha "data: {...}" que a rota envia
type ServerEvent =
  | { type: "text"; text: string }
  | { type: "error"; message: string }
  | { type: "done" };

function parseServerEvent(line: string): ServerEvent | null {
  if (!line.startsWith("data:")) return null;

  try {
    const event: unknown = JSON.parse(line.slice("data:".length).trim());
    if (typeof event !== "object" || event === null) return null;

    const { type, text, message } = event as Record<string, unknown>;
    if (type === "text" && typeof text === "string") return { type, text };
    if (type === "error") return { type, message: typeof message === "string" ? message : GENERIC_ERROR };
    if (type === "done") return { type };
  } catch {
    // Linha que não é JSON válido: ignora
  }
  return null;
}

interface StreamChatReplyOptions {
  messages: ChatHistoryMessage[];
  signal: AbortSignal;
  onText: (text: string) => void;
}

/*
  Envia o histórico e chama onText para cada pedaço de texto que chegar.
  Os pedaços da rede podem cortar uma linha no meio, então o texto fica num buffer
  e só é processado quando a linha termina ("\n").
  Lança ChatReplyError com mensagem amigável quando algo dá errado.
  Se o signal for cancelado (botão Parar), o fetch lança AbortError, que o chamador trata.
*/
export async function streamChatReply({ messages, signal, onText }: StreamChatReplyOptions): Promise<void> {
  let response: Response;
  try {
    response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages }),
      signal,
    });
  } catch (error) {
    if (signal.aborted) throw error;
    throw new ChatReplyError(GENERIC_ERROR);
  }

  if (!response.body) throw new ChatReplyError(GENERIC_ERROR);

  const reader = response.body.pipeThrough(new TextDecoderStream()).getReader();
  let buffer = "";
  let receivedText = false;

  function handleLine(line: string) {
    const event = parseServerEvent(line.trim());
    if (event?.type === "text") {
      receivedText = true;
      onText(event.text);
    } else if (event?.type === "error") {
      throw new ChatReplyError(event.message);
    }
  }

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += value;
      const lines = buffer.split("\n");
      // A última parte pode ser uma linha incompleta: fica no buffer até o próximo pedaço
      buffer = lines.pop() ?? "";
      lines.forEach(handleLine);
    }

    // Processa o que sobrou, caso a resposta não termine com quebra de linha
    if (buffer !== "") handleLine(buffer);
  } catch (error) {
    // Para de ler o resto da resposta antes de repassar o erro
    reader.cancel().catch(() => {});
    if (error instanceof ChatReplyError || signal.aborted) throw error;
    throw new ChatReplyError(GENERIC_ERROR);
  }

  if (!receivedText) throw new ChatReplyError(EMPTY_REPLY_ERROR);
}
