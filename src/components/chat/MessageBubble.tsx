import type { Message } from "@/types/chat";

interface MessageBubbleProps {
  message: Message;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.author === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[85%] whitespace-pre-wrap break-words rounded-lg px-4 py-2.5 text-sm leading-relaxed sm:max-w-[70%] ${
          isUser
            ? "rounded-br-xs bg-roxo text-on-roxo"
            : "rounded-bl-xs border border-borda bg-black text-tinta"
        }`}
      >
        {message.text}
      </div>
    </div>
  );
}
