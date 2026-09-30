import type { Category } from "@/types/chat";

interface CategoryStyle {
  label: string;
  // Classes completas (sem montar strings), para o Tailwind encontrar na hora do build
  className: string;
}

export const CATEGORY_STYLES: Record<Category, CategoryStyle> = {
  acesso: {
    label: "acesso",
    className: "bg-amber-500/15 text-amber-300 ring-amber-500/30",
  },
  dados: {
    label: "dados",
    className: "bg-sky-500/15 text-sky-300 ring-sky-500/30",
  },
  integracao: {
    label: "integração",
    className: "bg-violet-500/15 text-violet-300 ring-violet-500/30",
  },
  duvida: {
    label: "dúvida",
    className: "bg-zinc-500/15 text-zinc-300 ring-zinc-500/30",
  },
  bug: {
    label: "bug",
    className: "bg-red-500/15 text-red-300 ring-red-500/30",
  },
  feature: {
    label: "feature",
    className: "bg-emerald-500/15 text-emerald-300 ring-emerald-500/30",
  },
};
