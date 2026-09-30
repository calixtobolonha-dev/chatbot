---
name: commits
description: Padrão de mensagens de commit deste projeto. Use sempre que for fazer um commit.
---

# Padrão de commits

Use esta skill sempre que for fazer um commit neste repositório.

## Autor

Todo commit leva **Calixto Bolonha** no topo, como autor. Faça o commit com:

```bash
git commit --author="Calixto Bolonha <EMAIL_DO_CALIXTO>"
```

Troque `EMAIL_DO_CALIXTO` pelo email da conta do Calixto. Não grave o email em arquivos do projeto.

## Formato

```
tipo(escopo opcional): descrição

Uma única frase dizendo o principal ganho desta mudança.
```

- Mensagem em português do Brasil.
- Primeira linha no formato `tipo(escopo): descrição`. O escopo é opcional e fica entre parênteses.
- Descrição em letras minúsculas, sem ponto final, com no máximo 72 caracteres.
- Corpo: uma linha em branco e, em seguida, **uma única frase** com o principal ganho da mudança.
- Linhas de atribuição (como `Co-Authored-By`) podem vir no final, depois de uma linha em branco.

## Tipos

| Tipo | Quando usar |
|---|---|
| `feat` | Funcionalidade nova para quem usa o sistema |
| `fix` | Correção de erro |
| `refactor` | Mudança no código que não altera o comportamento |
| `docs` | Só documentação |
| `test` | Criação ou ajuste de testes |
| `chore` | Configuração, dependências e tarefas de manutenção |
| `style` | Formatação e visual, sem mudar a lógica |

## Exemplos bons

```
feat(chat): adiciona lista de conversas com etiquetas de categoria

Quem atende passa a ver de relance o assunto de cada conversa.
```

```
fix(input): impede envio de mensagem vazia ao apertar enter

Evita balões vazios na conversa quando a pessoa aperta enter sem querer.
```

```
docs: adiciona guia de integração da api do timetrack

A equipe passa a ter num só lugar tudo o que precisa para conectar o chatbot.
```

## Antes de confirmar

- [ ] O tipo está na lista acima.
- [ ] A descrição está em minúsculas, sem ponto final e com até 72 caracteres.
- [ ] O corpo tem uma única frase com o principal ganho.
- [ ] O autor é Calixto Bolonha.
