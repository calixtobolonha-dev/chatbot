import { CAMPAIGN_TEXT_MAX_LENGTH, validateCampaignImage } from "@/lib/campaign-rules";
import { sendCampaignToCustomer } from "@/lib/campaign-sender";
import { CUSTOMERS } from "@/lib/customers";
import type { CampaignResult } from "@/types/campaign";

/*
  Rota do disparo de campanhas (roda só no servidor).
  Recebe um formulário (multipart/form-data) com:
  - text: texto da mensagem;
  - image: imagem opcional (JPG, PNG ou WEBP);
  - customerIds: lista de ids dos clientes, em JSON.
  Valida tudo de novo (a tela pode ser burlada) e envia para cada cliente.
  Erros chegam como JSON { "message": "..." } com status 400.
*/

export const dynamic = "force-dynamic";

function errorResponse(message: string): Response {
  return Response.json({ message }, { status: 400 });
}

function parseCustomerIds(raw: FormDataEntryValue | null): string[] | null {
  if (typeof raw !== "string") return null;
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed) || !parsed.every((id) => typeof id === "string")) return null;
    // Remove repetidos para ninguém receber a mesma campanha duas vezes
    return [...new Set(parsed)];
  } catch {
    return null;
  }
}

export async function POST(request: Request): Promise<Response> {
  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return errorResponse("Não entendi os dados da campanha. Atualize a página e tente de novo.");
  }

  const rawText = form.get("text");
  const text = typeof rawText === "string" ? rawText.trim() : "";
  if (text === "") return errorResponse("Escreva o texto da campanha.");
  if (text.length > CAMPAIGN_TEXT_MAX_LENGTH) {
    return errorResponse(`O texto passou de ${CAMPAIGN_TEXT_MAX_LENGTH} caracteres.`);
  }

  const rawImage = form.get("image");
  const image = rawImage instanceof File && rawImage.size > 0 ? rawImage : null;
  if (image) {
    const imageError = validateCampaignImage(image);
    if (imageError) return errorResponse(imageError);
  }

  const customerIds = parseCustomerIds(form.get("customerIds"));
  if (!customerIds || customerIds.length === 0) {
    return errorResponse("Selecione pelo menos um cliente.");
  }

  const customers = customerIds.map((id) => CUSTOMERS.find((customer) => customer.id === id));
  if (customers.some((customer) => customer === undefined)) {
    return errorResponse("A lista de clientes mudou. Atualize a página e selecione de novo.");
  }

  // Um envio por vez, para não sobrecarregar o canal quando ele for real
  const deliveries = [];
  for (const customer of customers) {
    if (customer) deliveries.push(await sendCampaignToCustomer(customer, { text, image }));
  }

  const sent = deliveries.filter((delivery) => delivery.ok).length;
  const result: CampaignResult = {
    total: deliveries.length,
    sent,
    failed: deliveries.length - sent,
    deliveries,
  };
  return Response.json(result);
}
