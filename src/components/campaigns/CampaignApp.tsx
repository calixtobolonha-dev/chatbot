"use client";

import { useState } from "react";
import { CAMPAIGN_TEXT_MAX_LENGTH, validateCampaignImage } from "@/lib/campaign-rules";
import { CUSTOMERS } from "@/lib/customers";
import { CampaignSendError, sendCampaign } from "@/lib/send-campaign";
import { useObjectUrl } from "@/lib/use-object-url";
import type { CampaignResult } from "@/types/campaign";
import { CampaignHeader } from "./CampaignHeader";
import { CampaignResultPanel } from "./CampaignResultPanel";
import { CustomerPicker } from "./CustomerPicker";
import { ImagePicker } from "./ImagePicker";

// Etapas do botão de envio: pedir confirmação evita disparar sem querer
type SendStep = "editing" | "confirming" | "sending";

export function CampaignApp() {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(() => new Set());
  const [image, setImage] = useState<File | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);
  const [text, setText] = useState("");
  const [sendStep, setSendStep] = useState<SendStep>("editing");
  const [sendError, setSendError] = useState<string | null>(null);
  const [result, setResult] = useState<CampaignResult | null>(null);
  const imagePreviewUrl = useObjectUrl(image);

  const trimmedText = text.trim();
  const isTextTooLong = trimmedText.length > CAMPAIGN_TEXT_MAX_LENGTH;
  const canSend = selectedIds.size > 0 && trimmedText !== "" && !isTextTooLong;

  // Qualquer mudança na campanha cancela uma confirmação pendente
  function backToEditing() {
    setSendStep("editing");
    setSendError(null);
  }

  function toggleCustomer(customerId: string) {
    setSelectedIds((current) => {
      const next = new Set(current);
      if (next.has(customerId)) next.delete(customerId);
      else next.add(customerId);
      return next;
    });
    backToEditing();
  }

  function selectCustomers(customerIds: string[]) {
    setSelectedIds((current) => new Set([...current, ...customerIds]));
    backToEditing();
  }

  function clearSelection() {
    setSelectedIds(new Set());
    backToEditing();
  }

  function handleImageChange(nextImage: File | null) {
    const error = nextImage ? validateCampaignImage(nextImage) : null;
    setImageError(error);
    // Imagem inválida não fica na campanha
    setImage(error ? null : nextImage);
    backToEditing();
  }

  async function confirmSend() {
    setSendStep("sending");
    setSendError(null);
    try {
      const campaignResult = await sendCampaign({ text: trimmedText, image, customerIds: [...selectedIds] });
      setResult(campaignResult);
      setSendStep("editing");
    } catch (error) {
      setSendError(error instanceof CampaignSendError ? error.message : "Não consegui disparar a campanha agora.");
      setSendStep("editing");
    }
  }

  function startNewCampaign() {
    setSelectedIds(new Set());
    setImage(null);
    setImageError(null);
    setText("");
    setSendStep("editing");
    setSendError(null);
    setResult(null);
  }

  const recipientsLabel = selectedIds.size === 1 ? "1 cliente" : `${selectedIds.size} clientes`;

  return (
    <div className="flex min-h-dvh flex-col bg-superficie text-tinta">
      <CampaignHeader />

      <p className="shrink-0 border-b border-borda bg-superficie-suave px-4 py-1 text-center text-[11px] text-tinta-suave">
        Envio simulado: nenhuma mensagem sai de verdade
      </p>

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6">
        {result ? (
          <CampaignResultPanel result={result} onNewCampaign={startNewCampaign} />
        ) : (
          <div className="grid gap-6 lg:grid-cols-2">
            <section aria-labelledby="customers-title" className="space-y-3 rounded-lg border border-borda bg-superficie-card p-5 shadow-card">
              <h2 id="customers-title" className="text-base font-bold text-tinta">
                1. Clientes
              </h2>
              <CustomerPicker
                customers={CUSTOMERS}
                selectedIds={selectedIds}
                onToggle={toggleCustomer}
                onSelectMany={selectCustomers}
                onClear={clearSelection}
              />
            </section>

            <div className="space-y-6">
              <section aria-labelledby="image-title" className="space-y-3 rounded-lg border border-borda bg-superficie-card p-5 shadow-card">
                <h2 id="image-title" className="text-base font-bold text-tinta">
                  2. Imagem
                </h2>
                <ImagePicker image={image} previewUrl={imagePreviewUrl} error={imageError} onChange={handleImageChange} />
              </section>

              <section aria-labelledby="text-title" className="space-y-3 rounded-lg border border-borda bg-superficie-card p-5 shadow-card">
                <h2 id="text-title" className="text-base font-bold text-tinta">
                  <label htmlFor="campaign-text">3. Texto</label>
                </h2>
                <textarea
                  id="campaign-text"
                  value={text}
                  onChange={(event) => {
                    setText(event.target.value);
                    backToEditing();
                  }}
                  rows={6}
                  placeholder="Escreva a mensagem da campanha..."
                  aria-describedby="campaign-text-count"
                  className="w-full resize-y rounded-md border border-borda bg-superficie-card px-3 py-2 text-sm text-tinta placeholder:text-tinta-suave focus:border-texto-marca/60 focus:outline-none"
                />
                <p id="campaign-text-count" aria-live="polite" className={`text-right text-xs ${isTextTooLong ? "text-perigo" : "text-tinta-suave"}`}>
                  {trimmedText.length} de {CAMPAIGN_TEXT_MAX_LENGTH} caracteres
                </p>

                {(imagePreviewUrl || trimmedText !== "") && (
                  <div>
                    <p className="mb-1 text-xs font-semibold text-tinta-suave">Prévia da mensagem</p>
                    <div className="max-w-xs overflow-hidden rounded-lg rounded-bl-xs border border-borda bg-balao-atendente">
                      {imagePreviewUrl && (
                        // eslint-disable-next-line @next/next/no-img-element -- prévia de arquivo local, o next/image não atende
                        <img src={imagePreviewUrl} alt="" className="max-h-60 w-full object-cover" />
                      )}
                      {trimmedText !== "" && (
                        <p className="whitespace-pre-wrap break-words px-4 py-2.5 text-sm leading-relaxed text-tinta">{trimmedText}</p>
                      )}
                    </div>
                  </div>
                )}
              </section>

              <section aria-label="Envio" className="space-y-3 rounded-lg border border-borda bg-superficie-card p-5 shadow-card">
                {sendStep === "confirming" ? (
                  <>
                    <p className="text-sm text-tinta">
                      Confirma o disparo para <span className="font-semibold">{recipientsLabel}</span>? Depois de
                      enviada, a campanha não pode ser desfeita.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={confirmSend}
                        className="rounded-xs bg-amarelo px-5 py-2 text-sm font-semibold text-on-amarelo transition-opacity hover:opacity-90"
                      >
                        Confirmar disparo
                      </button>
                      <button
                        type="button"
                        onClick={backToEditing}
                        className="rounded-xs border border-borda px-5 py-2 text-sm font-semibold text-tinta transition-colors hover:bg-superficie-suave"
                      >
                        Cancelar
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-wrap items-center gap-3">
                    <p className="flex-1 text-sm text-tinta-suave">
                      {selectedIds.size === 0
                        ? "Selecione pelo menos um cliente."
                        : trimmedText === ""
                          ? "Escreva o texto da campanha."
                          : `Pronta para enviar a ${recipientsLabel}.`}
                    </p>
                    <button
                      type="button"
                      onClick={() => setSendStep("confirming")}
                      disabled={!canSend || sendStep === "sending"}
                      className="rounded-xs bg-amarelo px-5 py-2 text-sm font-semibold text-on-amarelo transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-45"
                    >
                      {sendStep === "sending" ? "Disparando..." : "Disparar campanha"}
                    </button>
                  </div>
                )}

                {sendError && (
                  <p role="alert" className="rounded-xs border border-perigo/40 bg-perigo/10 px-3 py-2 text-sm text-tinta">
                    {sendError}
                  </p>
                )}
              </section>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
