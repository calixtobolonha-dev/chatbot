import type { Category } from "@/types/chat";

interface CategoryStyle {
  label: string;
  // Classes completas (sem montar strings), para o Tailwind encontrar na hora do build.
  // As cores vêm de tokens que mudam com o tema, para manter o contraste nos dois.
  className: string;
}

export const CATEGORY_STYLES: Record<Category, CategoryStyle> = {
  acesso: {
    label: "acesso",
    className: "bg-etiqueta-acesso/10 text-etiqueta-acesso ring-etiqueta-acesso/30",
  },
  dados: {
    label: "dados",
    className: "bg-etiqueta-dados/10 text-etiqueta-dados ring-etiqueta-dados/30",
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
