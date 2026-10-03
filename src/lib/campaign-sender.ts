import type { CampaignDelivery, Customer } from "@/types/campaign";

// Conteúdo de uma campanha já validado pela rota /api/campanhas
export interface CampaignMessage {
  text: string;
  image: File | null;
}

/*
  Envio SIMULADO: nenhuma mensagem sai de verdade.
  Para ligar um canal real (WhatsApp, email...), troque o corpo desta função pela chamada
  ao provedor, com a chave em variável de ambiente, e devolva ok: false quando ele recusar.
*/
export async function sendCampaignToCustomer(
  customer: Customer,
  message: CampaignMessage,
): Promise<CampaignDelivery> {
  // A mensagem ainda não é usada porque o envio é simulado
  void message;

  if (customer.phone === null) {
    return { customerId: customer.id, customerName: customer.name, ok: false, detail: "Cliente sem telefone cadastrado" };
  }

  return { customerId: customer.id, customerName: customer.name, ok: true, detail: "Enviado (simulado)" };
}
