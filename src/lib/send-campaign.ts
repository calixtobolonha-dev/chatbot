import type { CampaignResult } from "@/types/campaign";

const GENERIC_ERROR = "Não consegui disparar a campanha agora. Tente de novo em alguns instantes.";

// Erro com mensagem já pronta para mostrar na tela
export class CampaignSendError extends Error {}

interface SendCampaignInput {
  text: string;
  image: File | null;
  customerIds: string[];
}

// Envia a campanha para a rota /api/campanhas e devolve o resultado de cada cliente
export async function sendCampaign({ text, image, customerIds }: SendCampaignInput): Promise<CampaignResult> {
  const form = new FormData();
  form.append("text", text);
  form.append("customerIds", JSON.stringify(customerIds));
  if (image) form.append("image", image);

  let response: Response;
  try {
    response = await fetch("/api/campanhas", { method: "POST", body: form });
  } catch {
    throw new CampaignSendError(GENERIC_ERROR);
  }

  const body: unknown = await response.json().catch(() => null);
  if (!response.ok) {
    const message = (body as { message?: unknown } | null)?.message;
    throw new CampaignSendError(typeof message === "string" ? message : GENERIC_ERROR);
  }
  return body as CampaignResult;
}
