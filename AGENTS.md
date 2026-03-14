# DevRoast - Padrões do Projeto

## Arquitetura e Padrões

Este projeto segue padrões específicos documentados em arquivos AGENTS.md nos respectivos diretórios:

| Diretório | Arquivo | Conteúdo |
|-----------|---------|----------|
| `specs/` | `AGENTS.md` | Como criar especificações |
| `src/components/ui/` | `AGENTS.md` | Padrões de componentes UI |
| `src/server/` | `AGENTS.md` | Padrões server-side (tRPC, routers) |

## Stack

- **Next.js 16** (App Router)
- **Tailwind CSS** + tailwind-variants
- **Radix UI** (comportamento)
- **Shiki** (syntax highlighting)
- **tRPC** (API typesafe)
- **Drizzle ORM** (banco de dados)
- **Biome** (lint)

## Comandos

```bash
npm run dev      # Desenvolvimento
npm run build    # Build produção
npm run lint    # Verificar código
```

## Variáveis CSS

Definidas em `src/app/globals.css`:

- `accent-green`, `accent-amber`, `accent-red`
- `bg-page`, `bg-surface`, `bg-input`
- `text-primary`, `text-secondary`, `text-tertiary`
- `border-primary`, `border-secondary`
