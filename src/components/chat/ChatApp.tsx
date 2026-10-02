"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ChatReplyError, streamChatReply, type ChatHistoryMessage } from "@/lib/chat-stream";
import { loadConversations, saveConversations } from "@/lib/conversation-storage";
import { filterConversations } from "@/lib/filter-conversations";
import type { Conversation, Message, MessageAuthor } from "@/types/chat";
import { ChatHeader } from "./ChatHeader";
import { EmptyState } from "./EmptyState";
import { MessageInput } from "./MessageInput";
import { MessageList } from "./MessageList";
import { Sidebar } from "./Sidebar";

const NEW_CONVERSATION_TITLE = "Nova conversa";
const TITLE_MAX_LENGTH = 40;
const CLOCK_REFRESH_MS = 60 * 1000;

function createId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

function createMessage(author: MessageAuthor, text: string): Message {
  return { id: createId(), author, text, sentAt: new Date().toISOString() };
}

function createEmptyConversation(): Conversation {
  return {
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
}

function lastActivityTime(conversation: Conversation): number {
  const lastMessage = conversation.messages.at(-1);
  return new Date(lastMessage?.sentAt ?? conversation.createdAt).getTime();
}

function sortByLastActivity(conversations: Conversation[]): Conversation[] {
  return [...conversations].sort((a, b) => lastActivityTime(b) - lastActivityTime(a));
}

// Usa o começo da primeira mensagem como título de uma conversa nova
function titleFromFirstMessage(text: string): string {
  const singleLine = text.replace(/\s+/g, " ");
  return singleLine.length > TITLE_MAX_LENGTH
    ? `${singleLine.slice(0, TITLE_MAX_LENGTH).trimEnd()}...`
    : singleLine;
}

// Histórico enviado ao atendente: só mensagens de verdade, sem balões de erro ou vazios
function toChatHistory(messages: Message[]): ChatHistoryMessage[] {
  return messages
    .filter((message) => !message.isError && message.text !== "")
    .map((message) => ({ role: message.author, content: message.text }));
}

export function ChatApp() {
  const [conversations, setConversations] = useState<Conversation[]>(() => [
    createEmptyConversation(),
  ]);
  const [activeConversationId, setActiveConversationId] = useState<string>(
    () => conversations[0].id,
  );
  // Só salva no navegador depois de ler o que já estava salvo, para não apagar nada
  const [isStorageLoaded, setIsStorageLoaded] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  // Texto do campo de busca de atendimentos (telefone, nome, email, protocolo ou tag)
  const [searchQuery, setSearchQuery] = useState("");
  // Conversas em que o atendente está respondendo agora
  const [respondingConversationIds, setRespondingConversationIds] = useState<Set<string>>(
    () => new Set(),
  );
  // Relógio da tela: só existe no navegador, para o "há quanto tempo" não divergir do servidor
  const [now, setNow] = useState<Date | null>(null);
  // Um controle de cancelamento por conversa respondendo (usado pelo botão Parar)
  const abortControllersRef = useRef(new Map<string, AbortController>());

  useEffect(() => {
    setNow(new Date());
    const intervalId = window.setInterval(() => setNow(new Date()), CLOCK_REFRESH_MS);
    return () => window.clearInterval(intervalId);
  }, []);

  // Recupera as conversas salvas no navegador ao abrir a tela
  useEffect(() => {
    const stored = loadConversations();
    if (stored && stored.length > 0) {
      const sorted = sortByLastActivity(stored);
      setConversations(sorted);
      setActiveConversationId(sorted[0].id);
    }
    setIsStorageLoaded(true);
  }, []);

  useEffect(() => {
    if (isStorageLoaded) saveConversations(conversations);
  }, [conversations, isStorageLoaded]);

  // Cancela as respostas em andamento se o componente sair da tela
  useEffect(() => {
    const controllers = abortControllersRef.current;
    return () => controllers.forEach((controller) => controller.abort());
  }, []);

  const sortedConversations = useMemo(() => sortByLastActivity(conversations), [conversations]);

  const visibleConversations = useMemo(
    () => filterConversations(sortedConversations, searchQuery),
    [sortedConversations, searchQuery],
  );

  const activeConversation =
    conversations.find((conversation) => conversation.id === activeConversationId) ??
    conversations[0];

  function updateConversation(conversationId: string, update: (conversation: Conversation) => Conversation) {
    setConversations((current) =>
      current.map((conversation) =>
        conversation.id === conversationId ? update(conversation) : conversation,
      ),
    );
  }

  function updateMessage(conversationId: string, messageId: string, update: (message: Message) => Message) {
    updateConversation(conversationId, (conversation) => ({
      ...conversation,
      messages: conversation.messages.map((message) =>
        message.id === messageId ? update(message) : message,
      ),
    }));
  }

  function setResponding(conversationId: string, isResponding: boolean) {
    setRespondingConversationIds((current) => {
      const next = new Set(current);
      if (isResponding) next.add(conversationId);
      else next.delete(conversationId);
      return next;
    });
  }

  async function handleSend(text: string) {
    const conversationId = activeConversation.id;
    if (respondingConversationIds.has(conversationId)) return;

    const userMessage = createMessage("user", text);
    // Balão do atendente começa vazio e vai sendo preenchido a cada pedaço da resposta
    const assistantMessage = createMessage("assistant", "");
    const history = toChatHistory([...activeConversation.messages, userMessage]);

    updateConversation(conversationId, (conversation) => ({
      ...conversation,
      title:
        conversation.messages.length === 0 ? titleFromFirstMessage(text) : conversation.title,
      messages: [...conversation.messages, userMessage, assistantMessage],
    }));

    const controller = new AbortController();
    abortControllersRef.current.set(conversationId, controller);
    setResponding(conversationId, true);

    try {
      await streamChatReply({
        messages: history,
        signal: controller.signal,
        onText: (chunk) =>
          updateMessage(conversationId, assistantMessage.id, (message) => ({
            ...message,
            text: message.text + chunk,
          })),
      });
    } catch (error) {
      if (controller.signal.aborted) {
        // Parado pela pessoa: mantém o que já chegou e some com o balão se ainda estava vazio
        updateConversation(conversationId, (conversation) => ({
          ...conversation,
          messages: conversation.messages.filter(
            (message) => message.id !== assistantMessage.id || message.text !== "",
          ),
        }));
      } else {
        const errorText =
          error instanceof ChatReplyError
            ? error.message
            : "Não consegui falar com o atendimento agora. Tente de novo em alguns instantes.";
        showReplyError(conversationId, assistantMessage.id, errorText);
      }
    } finally {
      abortControllersRef.current.delete(conversationId);
      setResponding(conversationId, false);
    }
  }

  // Mostra o erro no próprio balão se ele ainda estiver vazio; senão, num balão novo logo abaixo
  function showReplyError(conversationId: string, assistantMessageId: string, errorText: string) {
    updateConversation(conversationId, (conversation) => {
      const assistantMessage = conversation.messages.find((message) => message.id === assistantMessageId);
      const errorMessage: Message = { ...createMessage("assistant", errorText), isError: true };

      if (assistantMessage && assistantMessage.text === "") {
        return {
          ...conversation,
          messages: conversation.messages.map((message) =>
            message.id === assistantMessageId ? { ...errorMessage, id: message.id } : message,
          ),
        };
      }
      return { ...conversation, messages: [...conversation.messages, errorMessage] };
    });
  }

  function handleStop() {
    abortControllersRef.current.get(activeConversation.id)?.abort();
  }

  function handleNewConversation() {
    // Reaproveita uma conversa nova que ainda está vazia, em vez de criar outra
    const existingEmpty = conversations.find(
      (conversation) => conversation.messages.length === 0,
    );

    if (existingEmpty) {
      setActiveConversationId(existingEmpty.id);
    } else {
      const newConversation = createEmptyConversation();
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

        <p className="shrink-0 border-b border-borda bg-superficie-suave px-4 py-1 text-center text-[11px] text-tinta-suave">
          Modo treino: respostas do cérebro de treino do TimeTrack
        </p>

        <div className="flex-1 overflow-y-auto">
          {hasMessages ? (
            <MessageList messages={activeConversation.messages} />
          ) : (
            <EmptyState onSelectSuggestion={handleSend} />
          )}
        </div>

        <MessageInput
          onSend={handleSend}
          onStop={handleStop}
          isResponding={respondingConversationIds.has(activeConversation.id)}
        />
      </main>
    </div>
  );
}
