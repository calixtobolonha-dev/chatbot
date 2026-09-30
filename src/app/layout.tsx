import type { Metadata } from "next";
import { Geist_Mono, Sora } from "next/font/google";
import "./globals.css";

// Tipografia do design system Grupo Lima: Sora para tudo, Geist Mono só para dados
const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Chatbot GL",
  description: "Atendimento de suporte do TimeTrack",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body
        className={`${sora.variable} ${geistMono.variable} font-sans antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
