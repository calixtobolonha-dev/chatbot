// Regras da campanha usadas pela tela e pela rota /api/campanhas, para as duas validarem igual.

export const CAMPAIGN_TEXT_MAX_LENGTH = 1000;

// A Vercel recusa pedidos acima de 4,5 MB; 3 MB deixa folga para o texto e a lista de clientes
export const CAMPAIGN_IMAGE_MAX_BYTES = 3 * 1024 * 1024;

export const CAMPAIGN_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

// Devolve a mensagem de erro da imagem, ou null se ela puder ser enviada
export function validateCampaignImage(image: { type: string; size: number }): string | null {
  if (!CAMPAIGN_IMAGE_TYPES.includes(image.type)) {
    return "Use uma imagem JPG, PNG ou WEBP.";
  }
  if (image.size > CAMPAIGN_IMAGE_MAX_BYTES) {
    return "A imagem passou de 3 MB. Escolha uma imagem menor.";
  }
  return null;
}
