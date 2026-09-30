# CLAUDE.md

## Sobre o projeto

Chatbot de suporte do TimeTrack (sistema fictício de controle de ponto), feito no curso
Desenvolvimento Web com Claude.

## Stack

- Next.js 15 (App Router).
- TypeScript estrito: nunca usar `any`.
- Tailwind CSS puro: não usar bibliotecas de componentes.

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

- Sempre que o usuário autorizar uma alteração, depois do commit e push no branch de trabalho,
  levar o commit também para a `main` (fast-forward, sem commit de merge).
- Se a `main` tiver recebido alterações por fora, parar e avisar o usuário antes de qualquer coisa.
