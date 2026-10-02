// Categorias aceitas pelo TimeTrack ao abrir um chamado (ver docs/timetrack-api.md)
export type Category =
  | "acesso"
  | "dados"
  | "integracao"
  | "duvida"
  | "bug"
  | "feature";

// Ferramenta que o atendente usou durante a resposta, mostrada como selo acima do texto
export interface ToolUse {
  // Nome técnico enviado pelo cérebro, ex.: "consultar_usuario"
  name: string;
  // true se a ferramenta funcionou; false se deu erro
  ok: boolean;
}

// Quem escreveu a mensagem: o cliente ou o atendente (bot)
export type MessageAuthor = "user" | "assistant";

export interface Message {
  id: string;
  author: MessageAuthor;
  text: string;
  // Data em formato ISO, para ser fácil de serializar
  sentAt: string;
  // Mensagem de erro do atendimento, mostrada com fundo avermelhado e fora do histórico enviado
  isError?: boolean;
  // Ferramentas usadas pelo atendente nesta resposta, na ordem em que chegaram
  tools?: ToolUse[];
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
