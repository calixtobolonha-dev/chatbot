# CLAUDE.md

## Sobre o projeto

Chatbot de suporte do TimeTrack (sistema fictício de controle de ponto), feito no curso
Desenvolvimento Web com Claude.

## Stack

- Next.js 15 (App Router).
- TypeScript estrito: nunca usar `any`.
- Tailwind CSS puro: não usar bibliotecas de componentes.

## Visual

- Segue o design system Grupo Lima (tema escuro): roxo é a marca, amarelo é a ação, fonte Sora.
- Os tokens ficam em `src/app/globals.css` (`@theme`). Use as classes geradas (`bg-roxo`,
  `text-tinta`, `rounded-xs`...), nunca cores hex soltas nem a paleta padrão do Tailwind.
- Botões de ação: `bg-amarelo text-on-amarelo rounded-xs`. Nunca texto branco sobre amarelo.
- O logo (em `public/brand/`) é amarelo e só pode ficar sobre fundo roxo.

## Idioma

- Textos da tela: português do Brasil.
- Código (nomes de variáveis, funções, arquivos, tipos): inglês.
- Comentários: português.

## TimeTrack

O TimeTrack é um sistema EXTERNO, documentado em `docs/timetrack-api.md`.
Sempre leia esse arquivo antes de programar qualquer coisa ligada ao TimeTrack ou ao Claude.

## Regras

- Nunca colocar chaves, senhas ou tokens no código. Use variáveis de ambiente.
- Escreva o código pensando que outras pessoas vão ler e complementar o sistema:
  nomes claros, responsabilidades bem separadas e sem truques difíceis de entender.
- Nunca usar emoji nem travessão (—) nos textos do frontend.

## Git

- Todo commit segue a skill `.claude/skills/commits/SKILL.md`: leia antes de fazer qualquer commit.
- Sempre que o usuário autorizar uma alteração, depois do commit e push no branch de trabalho,
  levar o commit também para a `main` (fast-forward, sem commit de merge).
- Se a `main` tiver recebido alterações por fora, parar e avisar o usuário antes de qualquer coisa.
