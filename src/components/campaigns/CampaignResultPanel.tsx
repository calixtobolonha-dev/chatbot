import type { CampaignResult } from "@/types/campaign";

interface CampaignResultPanelProps {
  result: CampaignResult;
  onNewCampaign: () => void;
}

// Resumo do disparo: quantos foram, quantos falharam e a situação de cada cliente
export function CampaignResultPanel({ result, onNewCampaign }: CampaignResultPanelProps) {
  return (
    <section aria-labelledby="result-title" className="space-y-4 rounded-lg border border-borda bg-superficie-card p-5 shadow-card">
      <div className="flex flex-wrap items-center gap-3">
        <h2 id="result-title" className="flex-1 text-lg font-bold text-tinta">
          Campanha disparada
        </h2>
        <button
          type="button"
          onClick={onNewCampaign}
          className="rounded-xs bg-amarelo px-5 py-2 text-sm font-semibold text-on-amarelo transition-opacity hover:opacity-90"
        >
          Nova campanha
        </button>
      </div>

      <p className="text-sm text-tinta-suave">
        <span className="font-semibold text-sucesso">{result.sent} enviadas</span>
        {result.failed > 0 && <span className="font-semibold text-perigo"> · {result.failed} não enviadas</span>}
        {" "}de {result.total} clientes.
      </p>

      <ul className="divide-y divide-borda rounded-md border border-borda">
        {result.deliveries.map((delivery) => (
          <li key={delivery.customerId} className="flex items-center gap-3 px-3 py-2.5">
            <span className="min-w-0 flex-1 truncate text-sm text-tinta">{delivery.customerName}</span>
            <span
              className={`shrink-0 rounded-xs border px-2 py-0.5 text-[11px] font-medium ${
                delivery.ok ? "border-sucesso/40 bg-sucesso/10 text-sucesso" : "border-perigo/40 bg-perigo/10 text-perigo"
              }`}
            >
              {delivery.detail}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
