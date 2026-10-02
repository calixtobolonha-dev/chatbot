import { readFileSync } from "node:fs";
import path from "node:path";

// Arquivo com as instruções do atendente. Ele é incluído na publicação da Vercel pelo
// outputFileTracingIncludes do next.config.ts; se mudar de lugar, atualize os dois.
const SYSTEM_PROMPT_FILE = path.join(process.cwd(), "prompts", "system.md");

const FALLBACK_SYSTEM_PROMPT =
  "Você é o atendente de suporte do TimeTrack, um sistema de ponto eletrônico. " +
  "Responda em português, com educação e frases curtas. Para problemas de acesso, peça o email. " +
  "Nunca informe preços: ofereça um atendente humano. Recuse assuntos fora do TimeTrack.";

let cachedSystemPrompt: string | null = null;

// Lê o prompt do arquivo uma única vez; se o arquivo não existir ou estiver vazio, usa o texto padrão
export function getSystemPrompt(): string {
  if (cachedSystemPrompt !== null) return cachedSystemPrompt;

  try {
    const content = readFileSync(SYSTEM_PROMPT_FILE, "utf-8").trim();
    cachedSystemPrompt = content !== "" ? content : FALLBACK_SYSTEM_PROMPT;
  } catch {
    cachedSystemPrompt = FALLBACK_SYSTEM_PROMPT;
  }

  return cachedSystemPrompt;
}
