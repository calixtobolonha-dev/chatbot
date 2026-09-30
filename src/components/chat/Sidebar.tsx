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
          className="fixed inset-0 z-20 bg-black/60 md:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-30 flex w-80 max-w-[85vw] flex-col border-r border-zinc-800 bg-zinc-900 transition-transform duration-200 md:static md:z-auto md:max-w-none md:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between gap-2 border-b border-zinc-800 px-4 py-4">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-500 text-sm font-bold text-zinc-950">
              GL
            </span>
            <span className="text-base font-semibold text-zinc-100">Chatbot GL</span>
          </div>
          <button
            type="button"
            aria-label="Fechar lista de conversas"
            onClick={onClose}
            className="rounded-md p-1.5 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100 md:hidden"
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
            className="w-full rounded-lg bg-teal-500 px-3 py-2 text-sm font-semibold text-zinc-950 transition-colors hover:bg-teal-400"
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
