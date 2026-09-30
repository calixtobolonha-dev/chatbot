import type { Category } from "@/types/chat";

interface CategoryStyle {
  label: string;
  // Classes completas (sem montar strings), para o Tailwind encontrar na hora do build.
  // Cores claras sobre fundo translúcido, para manter contraste no tema escuro.
  className: string;
}

export const CATEGORY_STYLES: Record<Category, CategoryStyle> = {
  acesso: {
    label: "acesso",
    className: "bg-amarelo/10 text-amarelo ring-amarelo/30",
  },
  dados: {
    label: "dados",
    className: "bg-sky-300/10 text-sky-300 ring-sky-300/30",
  },
  integracao: {
    label: "integração",
    className: "bg-texto-marca/10 text-texto-marca ring-texto-marca/30",
  },
  duvida: {
    label: "dúvida",
    className: "bg-tinta-suave/10 text-tinta-suave ring-tinta-suave/30",
  },
  bug: {
    label: "bug",
    className: "bg-perigo/10 text-perigo ring-perigo/30",
  },
  feature: {
    label: "feature",
    className: "bg-sucesso/10 text-sucesso ring-sucesso/30",
  },
};
