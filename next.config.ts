import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Garante que o prompt do atendente, lido em tempo de execução, vá junto na publicação da Vercel
  outputFileTracingIncludes: {
    "/api/chat": ["./prompts/system.md"],
  },
};

export default nextConfig;
