import type { Message } from "@/types/chat";

interface MessageBubbleProps {
  message: Message;
}

// Três pontinhos animados enquanto o primeiro pedaço da resposta não chega
function TypingDots() {
  return (
    <span className="flex items-center gap-1 py-1.5" aria-live="polite">
      <span className="sr-only">O atendente está digitando</span>
      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-tinta-suave [animation-delay:-0.3s]" />
      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-tinta-suave [animation-delay:-0.15s]" />
      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-tinta-suave" />
    </span>
  );
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.author === "user";
  // Balão do atendente ainda vazio: a resposta está a caminho
  const isWaiting = !isUser && !message.isError && message.text === "";

  let bubbleStyle = "rounded-bl-xs border border-borda bg-balao-atendente text-tinta";
  if (isUser) bubbleStyle = "rounded-br-xs bg-roxo text-on-roxo";
  if (message.isError) bubbleStyle = "rounded-bl-xs border border-perigo/40 bg-perigo/10 text-tinta";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        role={message.isError ? "alert" : undefined}
        className={`max-w-[85%] whitespace-pre-wrap break-words rounded-lg px-4 py-2.5 text-sm leading-relaxed sm:max-w-[70%] ${bubbleStyle}`}
      >
        {isWaiting ? <TypingDots /> : message.text}
      </div>
    </div>
  );
}
