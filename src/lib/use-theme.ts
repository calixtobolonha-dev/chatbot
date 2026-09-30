"use client";

import { useEffect, useState } from "react";
import { DEFAULT_THEME, THEME_STORAGE_KEY, type Theme } from "@/lib/theme";

function readCurrentTheme(): Theme {
  const current = document.documentElement.dataset.theme;
  return current === "light" || current === "dark" ? current : DEFAULT_THEME;
}

// Lê e troca o tema da tela. O tema fica no atributo data-theme do <html> e no localStorage.
export function useTheme() {
  // Nulo até a tela carregar no navegador, onde o tema salvo pode ser lido
  const [theme, setTheme] = useState<Theme | null>(null);

  useEffect(() => {
    setTheme(readCurrentTheme());
  }, []);

  function toggleTheme() {
    const nextTheme: Theme = readCurrentTheme() === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = nextTheme;
    try {
      localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
    } catch {
      // Sem localStorage o tema ainda troca, só não fica salvo para a próxima visita
    }
    setTheme(nextTheme);
  }

  return { theme, toggleTheme };
}
