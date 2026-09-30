"use client";

import { useEffect, useRef } from "react";
import type { Message } from "@/types/chat";
import { MessageBubble } from "./MessageBubble";

interface MessageListProps {
  messages: Message[];
  isAssistantTyping: boolean;
}

export function MessageList({ messages, isAssistantTyping }: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  // Rola até a mensagem mais recente sempre que chega algo novo
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages.length, isAssistantTyping]);

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-3 px-4 py-6">
      {messages.map((message) => (
        <MessageBubble key={message.id} message={message} />
      ))}

      {isAssistantTyping && (
        <div className="flex justify-start" aria-live="polite">
          <div className="flex items-center gap-1 rounded-2xl rounded-bl-sm border border-zinc-800 bg-black px-4 py-3">
            <span className="sr-only">O atendente está digitando</span>
            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-zinc-400 [animation-delay:-0.3s]" />
            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-zinc-400 [animation-delay:-0.15s]" />
            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-zinc-400" />
          </div>
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  );
}
