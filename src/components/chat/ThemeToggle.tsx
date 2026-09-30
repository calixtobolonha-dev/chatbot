"use client";

import { useTheme } from "@/lib/use-theme";

// Botão que alterna entre o tema escuro e o tema claro
export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme !== "light";
  const label = isDark ? "Ativar tema claro" : "Ativar tema escuro";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={label}
      title={label}
      className="shrink-0 rounded-xs p-2 text-tinta-suave transition-colors hover:bg-superficie-suave hover:text-tinta"
    >
      {/* Antes de saber o tema, o espaço fica reservado sem ícone, para não piscar o ícone errado */}
      {theme === null ? (
        <span className="block h-5 w-5" />
      ) : isDark ? (
        // Sol: mostra que o clique leva ao tema claro
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <circle cx="12" cy="12" r="4" />
          <path strokeLinecap="round" d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
        </svg>
      ) : (
        // Lua: mostra que o clique leva ao tema escuro
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      )}
    </button>
  );
}
