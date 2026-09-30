"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { createSampleConversations } from "@/lib/conversas-exemplo";
import { filterConversations } from "@/lib/filter-conversations";
import type { Conversation, Message, MessageAuthor } from "@/types/chat";
import { ChatHeader } from "./ChatHeader";
import { EmptyState } from "./EmptyState";
import { MessageInput } from "./MessageInput";
import { MessageList } from "./MessageList";
import { Sidebar } from "./Sidebar";

// Resposta fixa enquanto o chatbot ainda não tem inteligência artificial
const PLACEHOLDER_REPLY = "Ainda estou aprendendo a responder. No Dia 4 eu ganho um cérebro!";
const REPLY_DELAY_MS = 500;
const NEW_CONVERSATION_TITLE = "Nova conversa";
const TITLE_MAX_LENGTH = 40;
const CLOCK_REFRESH_MS = 60 * 1000;

function createId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

function createMessage(author: MessageAuthor, text: string): Message {
  return { id: createId(), author, text, sentAt: new Date().toISOString() };
}

function lastActivityTime(conversation: Conversation): number {
  const lastMessage = conversation.messages.at(-1);
  return new Date(lastMessage?.sentAt ?? conversation.createdAt).getTime();
}

// Usa o começo da primeira mensagem como título de uma conversa nova
function titleFromFirstMessage(text: string): string {
  const singleLine = text.replace(/\s+/g, " ");
  return singleLine.length > TITLE_MAX_LENGTH
    ? `${singleLine.slice(0, TITLE_MAX_LENGTH).trimEnd()}...`
    : singleLine;
}

export function ChatApp() {
  const [conversations, setConversations] = useState<Conversation[]>(() =>
    createSampleConversations(new Date()),
  );
  const [activeConversationId, setActiveConversationId] = useState<string>(
    () => conversations[0].id,
  );
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  // Texto do campo de busca de atendimentos (telefone, nome ou protocolo)
  const [searchQuery, setSearchQuery] = useState("");
  // Conversas que estão aguardando a resposta do atendente
  const [typingConversationIds, setTypingConversationIds] = useState<Set<string>>(
    () => new Set(),
  );
  // Relógio da tela: só existe no navegador, para o "há quanto tempo" não divergir do servidor
  const [now, setNow] = useState<Date | null>(null);
  const replyTimeoutsRef = useRef<number[]>([]);

  useEffect(() => {
    setNow(new Date());
    const intervalId = window.setInterval(() => setNow(new Date()), CLOCK_REFRESH_MS);
    return () => window.clearInterval(intervalId);
  }, []);

  // Cancela respostas pendentes se o componente sair da tela
  useEffect(() => {
    const timeouts = replyTimeoutsRef.current;
    return () => timeouts.forEach((timeoutId) => window.clearTimeout(timeoutId));
  }, []);

  const sortedConversations = useMemo(
    () => [...conversations].sort((a, b) => lastActivityTime(b) - lastActivityTime(a)),
    [conversations],
  );

  const visibleConversations = useMemo(
    () => filterConversations(sortedConversations, searchQuery),
    [sortedConversations, searchQuery],
  );

  const activeConversation =
    conversations.find((conversation) => conversation.id === activeConversationId) ??
    conversations[0];

  function appendMessage(conversationId: string, message: Message) {
    setConversations((current) =>
      current.map((conversation) => {
        if (conversation.id !== conversationId) return conversation;

        const isFirstMessage = conversation.messages.length === 0;
        return {
          ...conversation,
          title:
            isFirstMessage && message.author === "user"
              ? titleFromFirstMessage(message.text)
              : conversation.title,
          messages: [...conversation.messages, message],
        };
      }),
    );
  }

  function setTyping(conversationId: string, isTyping: boolean) {
    setTypingConversationIds((current) => {
      const next = new Set(current);
      if (isTyping) next.add(conversationId);
      else next.delete(conversationId);
      return next;
    });
  }

  function handleSend(text: string) {
    const conversationId = activeConversation.id;
    appendMessage(conversationId, createMessage("user", text));
    setTyping(conversationId, true);

    const timeoutId = window.setTimeout(() => {
      appendMessage(conversationId, createMessage("assistant", PLACEHOLDER_REPLY));
      setTyping(conversationId, false);
    }, REPLY_DELAY_MS);
    replyTimeoutsRef.current.push(timeoutId);
  }

  function handleNewConversation() {
    // Reaproveita uma conversa nova que ainda está vazia, em vez de criar outra
    const existingEmpty = conversations.find(
      (conversation) => conversation.messages.length === 0,
    );

    if (existingEmpty) {
      setActiveConversationId(existingEmpty.id);
    } else {
      const newConversation: Conversation = {
        id: createId(),
        title: NEW_CONVERSATION_TITLE,
        personName: "Você",
        personEmail: null,
        personPhone: null,
        protocol: null,
        category: null,
        messages: [],
        createdAt: new Date().toISOString(),
      };
      setConversations((current) => [newConversation, ...current]);
      setActiveConversationId(newConversation.id);
    }

    setIsSidebarOpen(false);
  }

  function handleSelectConversation(conversationId: string) {
    setActiveConversationId(conversationId);
    setIsSidebarOpen(false);
  }

  const hasMessages = activeConversation.messages.length > 0;

  return (
    <div className="flex h-dvh overflow-hidden bg-superficie text-tinta">
      <Sidebar
        conversations={visibleConversations}
        searchQuery={searchQuery}
        onSearchQueryChange={setSearchQuery}
        activeConversationId={activeConversation.id}
        now={now}
        isOpen={isSidebarOpen}
        onSelectConversation={handleSelectConversation}
        onNewConversation={handleNewConversation}
        onClose={() => setIsSidebarOpen(false)}
      />

      <main className="flex min-w-0 flex-1 flex-col">
        <ChatHeader
          conversation={activeConversation}
          onOpenSidebar={() => setIsSidebarOpen(true)}
        />

        <div className="flex-1 overflow-y-auto">
          {hasMessages ? (
            <MessageList
              messages={activeConversation.messages}
              isAssistantTyping={typingConversationIds.has(activeConversation.id)}
            />
          ) : (
            <EmptyState onSelectSuggestion={handleSend} />
          )}
        </div>

        <MessageInput onSend={handleSend} />
      </main>
    </div>
  );
}
