import type { Message } from "@/types/chat";

interface MessageBubbleProps {
  message: Message;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.author === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[85%] whitespace-pre-wrap break-words rounded-2xl px-4 py-2.5 text-sm leading-relaxed sm:max-w-[70%] ${
          isUser
            ? "rounded-br-sm bg-teal-500 text-zinc-950"
            : "rounded-bl-sm border border-zinc-800 bg-black text-zinc-100"
        }`}
      >
        {message.text}
      </div>
    </div>
  );
}
