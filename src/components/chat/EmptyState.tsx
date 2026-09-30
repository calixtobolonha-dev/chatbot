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
      <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-500 text-lg font-bold text-zinc-950">
        GL
      </span>
      <h2 className="mt-4 text-2xl font-semibold text-zinc-100">Como posso ajudar?</h2>
      <p className="mt-1 text-sm text-zinc-500">Escolha uma sugestão ou escreva sua mensagem.</p>

      <div className="mt-8 grid w-full gap-3 sm:grid-cols-2">
        {SUGGESTIONS.map((suggestion) => (
          <button
            key={suggestion}
            type="button"
            onClick={() => onSelectSuggestion(suggestion)}
            className="rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-left text-sm text-zinc-300 transition-colors hover:border-teal-500/50 hover:bg-zinc-800 hover:text-zinc-100"
          >
            {suggestion}
          </button>
        ))}
      </div>
    </div>
  );
}
