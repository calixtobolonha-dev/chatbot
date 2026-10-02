import type { Conversation } from "@/types/chat";

// Salva as conversas no navegador (localStorage), para não sumirem ao recarregar a página.
// Fica só neste navegador: outro computador ou janela anônima não vê as mesmas conversas.

const STORAGE_KEY = "chatbot-gl-conversas";

function isStoredConversation(value: unknown): value is Conversation {
  if (typeof value !== "object" || value === null) return false;
  const conversation = value as Record<string, unknown>;
  return (
    typeof conversation.id === "string" &&
    typeof conversation.title === "string" &&
    typeof conversation.createdAt === "string" &&
    Array.isArray(conversation.messages)
  );
}

// Devolve null se não houver nada salvo, se o conteúdo estiver estragado ou se o navegador bloquear o acesso
export function loadConversations(): Conversation[] | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw === null) return null;

    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed) || !parsed.every(isStoredConversation)) return null;

    // Remove balões vazios que ficaram de uma resposta interrompida pelo recarregamento da página
    return parsed.map((conversation) => ({
      ...conversation,
      messages: conversation.messages.filter((message) => message.text !== ""),
    }));
  } catch {
    return null;
  }
}

export function saveConversations(conversations: Conversation[]): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(conversations));
  } catch {
    // Sem espaço ou acesso bloqueado: a conversa continua na tela, só não fica salva
  }
}
