import { toolLabel } from "@/lib/tool-labels";
import type { ToolUse } from "@/types/chat";

interface ToolBadgeProps {
  tool: ToolUse;
}

// Selo pequeno com o que o atendente fez: verde se deu certo, cinza se a ferramenta falhou
export function ToolBadge({ tool }: ToolBadgeProps) {
  const colors = tool.ok
    ? "border-sucesso/40 bg-sucesso/10 text-sucesso"
    : "border-borda bg-superficie-suave text-tinta-suave";

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-xs border px-2 py-0.5 text-[11px] font-medium leading-4 ${colors}`}
      title={tool.ok ? undefined : "A ferramenta não funcionou desta vez"}
    >
      {/* Ícone de ferramenta (chave inglesa) */}
      <svg viewBox="0 0 24 24" className="h-3 w-3 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
      </svg>
      {toolLabel(tool.name)}
    </span>
  );
}
