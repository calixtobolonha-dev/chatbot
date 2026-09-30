import type { Conversation } from "@/types/chat";
import { CategoryBadge } from "./CategoryBadge";
import { ThemeToggle } from "./ThemeToggle";

interface ChatHeaderProps {
  conversation: Conversation;
  onOpenSidebar: () => void;
}

export function ChatHeader({ conversation, onOpenSidebar }: ChatHeaderProps) {
  // Nome, email e telefone do cliente, pulando o que não existir
  const contactDetails = [conversation.personName, conversation.personEmail, conversation.personPhone]
    .filter((detail) => detail !== null)
    .join(" · ");

  return (
    <header className="flex h-16 shrink-0 items-center gap-3 border-b border-borda bg-superficie-card px-4">
      {/* Botão de menu: só aparece no celular, para abrir a gaveta de conversas */}
      <button
        type="button"
        aria-label="Abrir lista de conversas"
        onClick={onOpenSidebar}
        className="rounded-xs p-1.5 text-tinta-suave hover:bg-superficie-suave hover:text-tinta md:hidden"
      >
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <path strokeLinecap="round" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <h1 className="truncate text-base font-bold text-tinta">
            {conversation.title}
          </h1>
          {conversation.category && <CategoryBadge category={conversation.category} />}
        </div>
        <p className="truncate text-xs text-tinta-suave">
          {contactDetails}
          {conversation.protocol && (
            <span className="font-mono"> · {conversation.protocol}</span>
          )}
        </p>
      </div>

      <ThemeToggle />
    </header>
  );
}
