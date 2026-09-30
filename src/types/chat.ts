// Categorias aceitas pelo TimeTrack ao abrir um chamado (ver docs/timetrack-api.md)
export type Category =
  | "acesso"
  | "dados"
  | "integracao"
  | "duvida"
  | "bug"
  | "feature";

// Quem escreveu a mensagem: o cliente ou o atendente (bot)
export type MessageAuthor = "user" | "assistant";

export interface Message {
  id: string;
  author: MessageAuthor;
  text: string;
  // Data em formato ISO, para ser fácil de serializar
  sentAt: string;
}

export interface Conversation {
  id: string;
  title: string;
  personName: string;
  personEmail: string | null;
  // Telefone formatado para exibição, ex.: "(27) 99812-3456"
  personPhone: string | null;
  // Protocolo do atendimento no TimeTrack, ex.: "TT-2026-001523"
  protocol: string | null;
  // Conversas novas ainda não têm categoria definida
  category: Category | null;
  messages: Message[];
  // Usado quando a conversa ainda não tem mensagens
  createdAt: string;
}
