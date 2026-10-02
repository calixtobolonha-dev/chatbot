"use client";

import { useRef, useState, type FormEvent, type KeyboardEvent } from "react";

// Altura máxima do campo antes de aparecer a barra de rolagem
const MAX_TEXTAREA_HEIGHT_PX = 160;
// A partir daqui a tela avisa que o texto está longo
const LONG_TEXT_WARNING_LENGTH = 1000;
// Limite aceito pela rota /api/chat; acima disso o envio fica bloqueado
const MAX_TEXT_LENGTH = 4000;

interface MessageInputProps {
  onSend: (text: string) => void;
  onStop: () => void;
  // Verdadeiro enquanto o atendente responde: o botão Enviar vira Parar
  isResponding: boolean;
}

function formatCount(value: number): string {
  return value.toLocaleString("pt-BR");
}

export function MessageInput({ onSend, onStop, isResponding }: MessageInputProps) {
  const [text, setText] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const trimmedLength = text.trim().length;
  const isTooLong = trimmedLength > MAX_TEXT_LENGTH;
  const canSend = trimmedLength > 0 && !isTooLong && !isResponding;

  // Faz o campo crescer conforme o texto, até o limite
  function resizeTextarea() {
    const textarea = textareaRef.current;
    if (!textarea) return;
    textarea.style.height = "auto";
    textarea.style.height = `${Math.min(textarea.scrollHeight, MAX_TEXTAREA_HEIGHT_PX)}px`;
  }

  function submit() {
    if (!canSend) return;
    onSend(text.trim());
    setText("");
    // Volta à altura de uma linha depois que o texto é limpo
    requestAnimationFrame(resizeTextarea);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    submit();
  }

  // Enter envia; Shift+Enter quebra linha. Ignora Enter durante composição de acentos (IME).
  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing) {
      event.preventDefault();
      submit();
    }
  }

  return (
    <form onSubmit={handleSubmit} className="border-t border-borda bg-superficie px-4 py-3">
      <div className="mx-auto flex w-full max-w-3xl items-end gap-2 rounded-md border border-borda bg-superficie-card p-2 focus-within:border-texto-marca/60">
        <label htmlFor="message-input" className="sr-only">
          Mensagem
        </label>
        <textarea
          id="message-input"
          ref={textareaRef}
          value={text}
          onChange={(event) => {
            setText(event.target.value);
            resizeTextarea();
          }}
          onKeyDown={handleKeyDown}
          rows={1}
          placeholder="Digite sua mensagem..."
          aria-describedby="message-length-warning"
          className="max-h-40 flex-1 resize-none bg-transparent px-2 py-1.5 text-sm text-tinta placeholder:text-tinta-suave focus:outline-none"
        />
        {isResponding ? (
          <button
            type="button"
            onClick={onStop}
            className="rounded-xs border border-borda bg-superficie-suave px-5 py-2 text-sm font-semibold text-tinta transition-colors hover:border-perigo/60 hover:text-perigo"
          >
            Parar
          </button>
        ) : (
          <button
            type="submit"
            disabled={!canSend}
            className="rounded-xs bg-amarelo px-5 py-2 text-sm font-semibold text-on-amarelo transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-45"
          >
            Enviar
          </button>
        )}
      </div>

      <div id="message-length-warning" aria-live="polite" className="mx-auto w-full max-w-3xl px-1">
        {isTooLong ? (
          <p className="mt-1.5 text-xs text-perigo">
            Seu texto tem {formatCount(trimmedLength)} caracteres. O limite é{" "}
            {formatCount(MAX_TEXT_LENGTH)}: encurte para poder enviar.
          </p>
        ) : trimmedLength > LONG_TEXT_WARNING_LENGTH ? (
          <p className="mt-1.5 text-xs text-etiqueta-acesso">
            Seu texto tem {formatCount(trimmedLength)} caracteres. Mensagens curtas costumam ter
            respostas melhores.
          </p>
        ) : (
          <p className="mt-1.5 hidden text-[11px] text-tinta-suave sm:block">
            Enter envia. Shift+Enter quebra a linha.
          </p>
        )}
      </div>
    </form>
  );
}
