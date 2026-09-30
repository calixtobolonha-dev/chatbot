import Image from "next/image";

const SUGGESTIONS = [
  "Não consigo logar no GL, meu email é joao@empresa.com",
  "Preciso de um relatório de horas do mês passado",
  "O sistema está fora do ar?",
  "Você sabe quem ganhou a eleição?",
];

interface EmptyStateProps {
  onSelectSuggestion: (text: string) => void;
}

export function EmptyState({ onSelectSuggestion }: EmptyStateProps) {
  return (
    <div className="mx-auto flex h-full w-full max-w-2xl flex-col items-center justify-center px-4 py-10">
      {/* Logo vertical sobre roxo, como pede o design system */}
      <div className="flex items-center justify-center rounded-lg bg-roxo px-6 py-4">
        <Image
          src="/brand/grupo-lima-vertical.png"
          alt="Grupo Lima"
          width={3584}
          height={2699}
          priority
          className="h-16 w-auto"
        />
      </div>
      <h2 className="mt-6 text-3xl font-bold leading-tight text-texto-marca">Como posso ajudar?</h2>
      <p className="mt-2 text-sm text-tinta-suave">Escolha uma sugestão ou escreva sua mensagem.</p>

      <div className="mt-8 grid w-full gap-3 sm:grid-cols-2">
        {SUGGESTIONS.map((suggestion) => (
          <button
            key={suggestion}
            type="button"
            onClick={() => onSelectSuggestion(suggestion)}
            className="rounded-md border border-borda bg-superficie-card px-4 py-3 text-left text-sm text-tinta shadow-card transition-colors hover:border-texto-marca/60 hover:bg-superficie-suave"
          >
            {suggestion}
          </button>
        ))}
      </div>
    </div>
  );
}
