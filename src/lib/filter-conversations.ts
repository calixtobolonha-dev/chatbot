import type { Conversation } from "@/types/chat";

// Deixa o texto comparável: minúsculas e sem acentos ("João" vira "joao")
function normalizeText(text: string): string {
  return text.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().trim();
}

function onlyDigits(text: string): string {
  return text.replace(/\D/g, "");
}

/*
  Filtra os atendimentos por um único texto de busca, que pode ser:
  - nome do cliente ("joao", "Maria Costa");
  - email do cliente, completo ou em parte ("joao@empresa.com", "techcorp");
  - protocolo, completo ou em parte ("TT-2026-001523", "1523");
  - telefone, com ou sem formatação ("(27) 99812-3456", "998123456").
  Busca só com números compara apenas os dígitos, para ignorar parênteses, espaços e hífens.
*/
export function filterConversations(conversations: Conversation[], query: string): Conversation[] {
  const normalizedQuery = normalizeText(query);
  if (normalizedQuery === "") return conversations;

  const queryDigits = onlyDigits(normalizedQuery);
  const isNumericQuery = queryDigits.length > 0 && !/[a-z]/.test(normalizedQuery);

  return conversations.filter((conversation) => {
    const nameMatches = normalizeText(conversation.personName).includes(normalizedQuery);
    const emailMatches =
      conversation.personEmail !== null &&
      normalizeText(conversation.personEmail).includes(normalizedQuery);
    const protocolMatches =
      conversation.protocol !== null &&
      normalizeText(conversation.protocol).includes(normalizedQuery);

    if (nameMatches || emailMatches || protocolMatches) return true;
    if (!isNumericQuery) return false;

    const phoneDigits = onlyDigits(conversation.personPhone ?? "");
    const protocolDigits = onlyDigits(conversation.protocol ?? "");
    return phoneDigits.includes(queryDigits) || protocolDigits.includes(queryDigits);
  });
}
