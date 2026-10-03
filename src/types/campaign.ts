// Cliente que pode receber uma campanha
export interface Customer {
  id: string;
  name: string;
  // Telefone formatado para exibição, ex.: "(27) 99812-3456"; null se não tiver cadastro
  phone: string | null;
  email: string;
  city: string;
  neighborhood: string;
}

// Resultado do envio da campanha para um cliente
export interface CampaignDelivery {
  customerId: string;
  customerName: string;
  ok: boolean;
  // Explicação curta mostrada na tela, ex.: "Enviado" ou "Cliente sem telefone cadastrado"
  detail: string;
}

// O que a rota /api/campanhas devolve depois de um disparo
export interface CampaignResult {
  total: number;
  sent: number;
  failed: number;
  deliveries: CampaignDelivery[];
}
