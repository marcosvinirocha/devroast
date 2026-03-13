# DevRoast

## Stack

- Next.js 16 (App Router)
- Tailwind CSS + tailwind-variants
- Radix UI (comportamento)
- Shiki (syntax highlighting)
- Biome (lint)

## Estrutura

```
src/
├── app/           # Next.js App Router
├── components/    # Componentes de feature
└── components/ui/ # Componentes reutilizáveis
```

## Variáveis CSS

Definidas em `src/app/globals.css` (`@theme`):

- `accent-green`, `accent-amber`, `accent-red`
- `bg-page`, `bg-surface`, `bg-input`
- `text-primary`, `text-secondary`, `text-tertiary`
- `border-primary`, `border-secondary`

## Padrões

- **Composição**: Usar sub-componentes (CardRoot, CardHeader, CardTitle)
- **Named exports**: Sempre
- **tailwind-variants**: Para variantes de componentes
- **forwardRef**: Para ref forwarding
- **use client**: Apenas quando necessário (estado, eventos)
- **Lint**: `npm run lint` antes de commit
