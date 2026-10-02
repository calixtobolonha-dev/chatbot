// Nome em português de cada ferramenta do atendente, usado nos selos do chat.
// Ferramenta nova: acrescente o nome técnico enviado pelo cérebro e o texto do selo.
const TOOL_LABELS: Record<string, string> = {
  consultar_usuario: "Consultou a conta",
  abrir_chamado: "Abriu chamado",
  resetar_senha: "Enviou link de nova senha",
  consultar_status_sistema: "Verificou o sistema",
  escalar_para_humano: "Chamou um atendente",
};

const UNKNOWN_TOOL_LABEL = "Usou uma ferramenta";

export function toolLabel(name: string): string {
  return TOOL_LABELS[name] ?? UNKNOWN_TOOL_LABEL;
}
