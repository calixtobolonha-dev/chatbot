import { formatRelativeTime } from "@/lib/format-relative-time";
import type { Conversation } from "@/types/chat";
import { CategoryBadge } from "./CategoryBadge";

interface ConversationListItemProps {
  conversation: Conversation;
  isActive: boolean;
  // Nulo até a tela carregar no navegador (evita diferença entre servidor e navegador)
  now: Date | null;
  onSelect: (conversationId: string) => void;
}

export function ConversationListItem({
  conversation,
  isActive,
  now,
  onSelect,
}: ConversationListItemProps) {
  const lastMessage = conversation.messages.at(-1);
  const preview = lastMessage?.text ?? "Sem mensagens ainda";
  const lastActivity = lastMessage?.sentAt ?? conversation.createdAt;

  return (
    <button
      type="button"
      onClick={() => onSelect(conversation.id)}
      aria-current={isActive ? "true" : undefined}
      className={`w-full rounded-lg border px-3 py-3 text-left transition-colors ${
        isActive
          ? "border-teal-500/40 bg-teal-500/10"
          : "border-transparent hover:bg-zinc-800/60"
      }`}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="truncate text-sm font-medium text-zinc-100">
          {conversation.personName}
        </span>
        <span className="shrink-0 text-xs text-zinc-500">
          {now ? formatRelativeTime(lastActivity, now) : ""}
        </span>
      </div>
      <p className="mt-1 truncate text-sm text-zinc-400">{preview}</p>
      {conversation.category && (
        <div className="mt-2">
          <CategoryBadge category={conversation.category} />
        </div>
      )}
    </button>
  );
}
