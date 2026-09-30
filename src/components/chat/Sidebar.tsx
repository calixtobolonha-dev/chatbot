import Image from "next/image";
import type { Conversation } from "@/types/chat";
import { ConversationListItem } from "./ConversationListItem";

interface SidebarProps {
  conversations: Conversation[];
  activeConversationId: string;
  now: Date | null;
  // Só tem efeito no celular, onde a lista vira uma gaveta
  isOpen: boolean;
  onSelectConversation: (conversationId: string) => void;
  onNewConversation: () => void;
  onClose: () => void;
}

export function Sidebar({
  conversations,
  activeConversationId,
  now,
  isOpen,
  onSelectConversation,
  onNewConversation,
  onClose,
}: SidebarProps) {
  return (
    <>
      {/* Fundo escurecido atrás da gaveta no celular; clicar nele fecha a gaveta */}
      {isOpen && (
        <button
          type="button"
          aria-label="Fechar lista de conversas"
          onClick={onClose}
          className="fixed inset-0 z-20 bg-black/70 md:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-30 flex w-80 max-w-[85vw] flex-col border-r border-borda bg-superficie-card transition-transform duration-200 md:static md:z-auto md:max-w-none md:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Faixa roxa da marca: o logo amarelo só pode ficar sobre roxo */}
        <div className="flex h-16 shrink-0 items-center justify-between gap-2 bg-roxo px-4 text-on-roxo">
          <div className="flex items-center gap-3">
            <Image
              src="/brand/grupo-lima-horizontal.png"
              alt="Grupo Lima"
              width={2057}
              height={835}
              priority
              className="h-10 w-auto"
            />
            <span className="border-l border-on-roxo/30 pl-3 text-sm font-semibold">Chatbot GL</span>
          </div>
          <button
            type="button"
            aria-label="Fechar lista de conversas"
            onClick={onClose}
            className="rounded-xs p-1.5 text-on-roxo hover:text-amarelo md:hidden"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path strokeLinecap="round" d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>

        <div className="px-4 py-3">
          <button
            type="button"
            onClick={onNewConversation}
            className="w-full rounded-xs bg-amarelo px-3 py-2.5 text-sm font-semibold text-on-amarelo transition-opacity hover:opacity-90"
          >
            + Nova conversa
          </button>
        </div>

        <nav aria-label="Conversas" className="flex-1 space-y-1 overflow-y-auto px-2 pb-4">
          {conversations.map((conversation) => (
            <ConversationListItem
              key={conversation.id}
              conversation={conversation}
              isActive={conversation.id === activeConversationId}
              now={now}
              onSelect={onSelectConversation}
            />
          ))}
        </nav>
      </aside>
    </>
  );
}
