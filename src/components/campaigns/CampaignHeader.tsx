import Image from "next/image";
import Link from "next/link";
import { ThemeToggle } from "@/components/chat/ThemeToggle";

export function CampaignHeader() {
  return (
    <header className="flex h-16 shrink-0 items-center border-b border-borda bg-superficie-card">
      {/* Faixa roxa da marca: o logo amarelo só pode ficar sobre roxo */}
      <div className="flex h-full items-center bg-roxo px-4">
        <Image
          src="/brand/grupo-lima-horizontal.png"
          alt="Grupo Lima"
          width={2057}
          height={835}
          priority
          className="h-10 w-auto"
        />
      </div>

      <div className="min-w-0 flex-1 px-4">
        <h1 className="truncate text-base font-bold text-tinta">Campanhas</h1>
        <p className="hidden truncate text-xs text-tinta-suave sm:block">
          Escolha os clientes, a imagem e o texto do disparo
        </p>
      </div>

      <div className="flex items-center gap-2 pr-4">
        <Link
          href="/"
          className="rounded-xs border border-borda px-3 py-2 text-sm font-semibold text-tinta transition-colors hover:bg-superficie-suave"
        >
          {/* No celular o texto curto deixa espaço para o título */}
          <span className="sm:hidden">Chat</span>
          <span className="hidden sm:inline">Voltar ao chat</span>
        </Link>
        <ThemeToggle />
      </div>
    </header>
  );
}
