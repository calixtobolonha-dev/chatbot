import type { Conversation } from "@/types/chat";
import { CategoryBadge } from "./CategoryBadge";

interface ChatHeaderProps {
  conversation: Conversation;
  onOpenSidebar: () => void;
}

export function ChatHeader({ conversation, onOpenSidebar }: ChatHeaderProps) {
  return (
    <header className="flex items-center gap-3 border-b border-zinc-800 px-4 py-3">
      {/* Botão de menu: só aparece no celular, para abrir a gaveta de conversas */}
      <button
        type="button"
        aria-label="Abrir lista de conversas"
        onClick={onOpenSidebar}
        className="rounded-md p-1.5 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100 md:hidden"
      >
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <path strokeLinecap="round" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <h1 className="truncate text-base font-semibold text-zinc-100">
            {conversation.title}
          </h1>
          {conversation.category && <CategoryBadge category={conversation.category} />}
        </div>
        <p className="truncate text-xs text-zinc-500">
          {conversation.personEmail
            ? `${conversation.personName} · ${conversation.personEmail}`
            : conversation.personName}
        </p>
      </div>
    </header>
  );
}
