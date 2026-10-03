"use client";

import { useEffect, useState } from "react";

// Cria um endereço temporário para mostrar um arquivo escolhido (ex.: prévia da imagem)
// e libera a memória quando o arquivo muda ou a tela fecha.
export function useObjectUrl(file: File | null): string | null {
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!file) {
      setUrl(null);
      return;
    }
    const objectUrl = URL.createObjectURL(file);
    setUrl(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [file]);

  return url;
}
