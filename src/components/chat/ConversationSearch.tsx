interface ConversationSearchProps {
  value: string;
  onChange: (value: string) => void;
}

// Campo único para buscar atendimentos por telefone, nome do cliente, email ou protocolo
export function ConversationSearch({ value, onChange }: ConversationSearchProps) {
  return (
    <div className="relative">
      <label htmlFor="conversation-search" className="sr-only">
        Buscar atendimentos por telefone, nome, email ou protocolo
      </label>
      <svg
        viewBox="0 0 24 24"
        className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-tinta-suave"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        aria-hidden="true"
      >
        <circle cx="11" cy="11" r="7" />
        <path strokeLinecap="round" d="M20 20l-3.5-3.5" />
      </svg>
      <input
        id="conversation-search"
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Escape") onChange("");
        }}
        placeholder="Telefone, nome, email ou protocolo"
        autoComplete="off"
        className="w-full rounded-xs border border-borda bg-superficie py-2 pl-9 pr-9 text-sm text-tinta placeholder:text-tinta-suave focus:border-texto-marca/60 [&::-webkit-search-cancel-button]:hidden"
      />
      {value !== "" && (
        <button
          type="button"
          aria-label="Limpar busca"
          onClick={() => onChange("")}
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded-xs p-1 text-tinta-suave hover:text-tinta"
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path strokeLinecap="round" d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>
      )}
    </div>
  );
}
