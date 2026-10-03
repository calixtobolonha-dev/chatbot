"use client";

import { useRef, type ChangeEvent } from "react";
import { CAMPAIGN_IMAGE_TYPES } from "@/lib/campaign-rules";

interface ImagePickerProps {
  image: File | null;
  previewUrl: string | null;
  error: string | null;
  onChange: (image: File | null) => void;
}

function formatSize(bytes: number): string {
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  return `${(bytes / (1024 * 1024)).toLocaleString("pt-BR", { maximumFractionDigits: 1 })} MB`;
}

export function ImagePicker({ image, previewUrl, error, onChange }: ImagePickerProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    onChange(event.target.files?.[0] ?? null);
    // Limpa o campo para que escolher o mesmo arquivo de novo também funcione
    event.target.value = "";
  }

  return (
    <div className="space-y-2">
      <input
        ref={inputRef}
        id="campaign-image"
        type="file"
        accept={CAMPAIGN_IMAGE_TYPES.join(",")}
        onChange={handleFileChange}
        className="sr-only"
      />

      {image && previewUrl ? (
        <div className="flex items-center gap-3 rounded-md border border-borda p-2">
          {/* eslint-disable-next-line @next/next/no-img-element -- prévia de arquivo local, o next/image não atende */}
          <img src={previewUrl} alt="Imagem escolhida para a campanha" className="h-16 w-16 shrink-0 rounded-xs object-cover" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-tinta">{image.name}</p>
            <p className="text-xs text-tinta-suave">{formatSize(image.size)}</p>
          </div>
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="rounded-xs border border-borda px-3 py-1.5 text-sm font-semibold text-tinta transition-colors hover:bg-superficie-suave"
          >
            Trocar
          </button>
          <button
            type="button"
            onClick={() => onChange(null)}
            className="rounded-xs px-3 py-1.5 text-sm font-semibold text-tinta-suave transition-colors hover:text-perigo"
          >
            Remover
          </button>
        </div>
      ) : (
        <label
          htmlFor="campaign-image"
          className="flex cursor-pointer flex-col items-center gap-1 rounded-md border border-dashed border-borda px-4 py-6 text-center transition-colors hover:bg-superficie-suave"
        >
          <span className="text-sm font-semibold text-tinta">Escolher imagem</span>
          <span className="text-xs text-tinta-suave">JPG, PNG ou WEBP, até 3 MB. Opcional.</span>
        </label>
      )}

      {error && (
        <p role="alert" className="text-xs text-perigo">
          {error}
        </p>
      )}
    </div>
  );
}
