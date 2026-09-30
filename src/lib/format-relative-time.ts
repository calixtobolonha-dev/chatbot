const MINUTE_MS = 60 * 1000;
const HOUR_MS = 60 * MINUTE_MS;
const DAY_MS = 24 * HOUR_MS;

// Converte uma data ISO em texto curto como "há 5 min" ou "há 2 dias"
export function formatRelativeTime(isoDate: string, now: Date): string {
  const elapsedMs = now.getTime() - new Date(isoDate).getTime();

  if (elapsedMs < MINUTE_MS) return "agora";
  if (elapsedMs < HOUR_MS) return `há ${Math.floor(elapsedMs / MINUTE_MS)} min`;
  if (elapsedMs < DAY_MS) return `há ${Math.floor(elapsedMs / HOUR_MS)} h`;

  const days = Math.floor(elapsedMs / DAY_MS);
  return days === 1 ? "há 1 dia" : `há ${days} dias`;
}
