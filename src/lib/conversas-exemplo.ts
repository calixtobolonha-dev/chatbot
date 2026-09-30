import type { Category, Conversation, MessageAuthor } from "@/types/chat";

// Conversas fictícias para a tela funcionar antes da integração com o TimeTrack.
// Pessoas e emails vêm da lista de usuários de teste em docs/timetrack-api.md.

interface SampleMessage {
  author: MessageAuthor;
  text: string;
  minutesAgo: number;
}

interface SampleConversation {
  id: string;
  title: string;
  personName: string;
  personEmail: string;
  personPhone: string;
  protocol: string;
  category: Category;
  messages: SampleMessage[];
}

const SAMPLE_CONVERSATIONS: SampleConversation[] = [
  {
    id: "conv-joao",
    title: "Não consigo entrar no sistema",
    personName: "João Pereira",
    personEmail: "joao@empresa.com",
    personPhone: "(27) 99812-3456",
    protocol: "TT-2026-001523",
    category: "acesso",
    messages: [
      { author: "user", text: "Oi, não consigo logar desde hoje cedo.", minutesAgo: 9 },
      { author: "assistant", text: "Olá, João! Pode me informar o email da sua conta?", minutesAgo: 8 },
      { author: "user", text: "É joao@empresa.com. Aparece que a conta está bloqueada.", minutesAgo: 5 },
    ],
  },
  {
    id: "conv-maria",
    title: "Horas de março com diferença",
    personName: "Maria Costa",
    personEmail: "maria.costa@techcorp.com",
    personPhone: "(27) 98845-1207",
    protocol: "TT-2026-001518",
    category: "dados",
    messages: [
      { author: "user", text: "O banco de horas de março mostra 12 horas a menos para a minha equipe.", minutesAgo: 70 },
      { author: "assistant", text: "Entendi, Maria. Vou verificar os registros de março da sua empresa.", minutesAgo: 68 },
    ],
  },
  {
    id: "conv-rafael",
    title: "Integração com a folha de pagamento",
    personName: "Rafael Souza",
    personEmail: "rafael.souza@logistica-sul.com.br",
    personPhone: "(28) 99931-7740",
    protocol: "TT-2026-001502",
    category: "integracao",
    messages: [
      { author: "user", text: "A exportação para o sistema de folha parou de funcionar ontem à noite.", minutesAgo: 60 * 5 },
      { author: "assistant", text: "Obrigado pelo aviso, Rafael. Qual mensagem de erro aparece?", minutesAgo: 60 * 5 - 2 },
      { author: "user", text: "Diz apenas que o arquivo não pôde ser gerado.", minutesAgo: 60 * 4 },
    ],
  },
  {
    id: "conv-pedro",
    title: "Email de confirmação não chegou",
    personName: "Pedro Santos",
    personEmail: "pedro@startup.io",
    personPhone: "(33) 98712-5589",
    protocol: "TT-2026-001487",
    category: "duvida",
    messages: [
      { author: "user", text: "Criei minha conta mas o email de confirmação nunca chegou. O que faço?", minutesAgo: 60 * 26 },
      { author: "assistant", text: "Olá, Pedro! Já conferiu a caixa de spam?", minutesAgo: 60 * 26 - 1 },
    ],
  },
  {
    id: "conv-marina",
    title: "Aplicativo fecha sozinho",
    personName: "Marina Costa",
    personEmail: "marina@empresa.com",
    personPhone: "(27) 99654-0031",
    protocol: "TT-2026-001455",
    category: "bug",
    messages: [
      { author: "user", text: "O app fecha sozinho quando tento bater o ponto de saída.", minutesAgo: 60 * 24 * 2 },
      { author: "assistant", text: "Sinto muito pelo transtorno, Marina. Em qual celular isso acontece?", minutesAgo: 60 * 24 * 2 - 3 },
      { author: "user", text: "Num Android, versão 14.", minutesAgo: 60 * 24 * 2 - 10 },
    ],
  },
  {
    id: "conv-lucas",
    title: "Exportar relatório em planilha",
    personName: "Lucas Martins",
    personEmail: "lucas.martins@supermercadobom.com.br",
    personPhone: "(33) 99108-2264",
    protocol: "TT-2026-001431",
    category: "feature",
    messages: [
      { author: "user", text: "Seria ótimo poder exportar o relatório mensal direto para planilha.", minutesAgo: 60 * 24 * 4 },
    ],
  },
];

function minutesBefore(now: Date, minutes: number): string {
  return new Date(now.getTime() - minutes * 60 * 1000).toISOString();
}

// Monta as conversas com horários relativos ao momento atual,
// para que "há quanto tempo" faça sentido sempre que a tela abrir.
export function createSampleConversations(now: Date): Conversation[] {
  return SAMPLE_CONVERSATIONS.map((sample) => {
    const messages = sample.messages.map((message, index) => ({
      id: `${sample.id}-msg-${index}`,
      author: message.author,
      text: message.text,
      sentAt: minutesBefore(now, message.minutesAgo),
    }));

    return {
      id: sample.id,
      title: sample.title,
      personName: sample.personName,
      personEmail: sample.personEmail,
      personPhone: sample.personPhone,
      protocol: sample.protocol,
      category: sample.category,
      messages,
      createdAt: messages[0]?.sentAt ?? now.toISOString(),
    };
  });
}
