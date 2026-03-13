# Padrões de Componentes UI

Este documento define os padrões para criação de componentes de UI no projeto.

## Estrutura de Arquivos

```
src/components/ui/
├── button.tsx
├── AGENTS.md (este arquivo)
└── [novo-componente].tsx
```

## Bibliotecas Utilizadas

### Radix UI
Para componentes com comportamento (toggle, dropdown, dialog, etc), usar **Radix UI**.

```bash
npm install @radix-ui/react-[componente]
```

Exemplo com Switch (Toggle):
```tsx
import * as SwitchPrimitive from "@radix-ui/react-switch";

<SwitchPrimitive.Root>
  <SwitchPrimitive.Thumb />
</SwitchPrimitive.Root>
```

### Shiki
Para componentes de código com syntax highlighting, usar **Shiki** (Server Component).

```bash
npm install shiki
```

Criar utilitário em `src/lib/shiki.ts`:
```tsx
import { createHighlighter } from "shiki";

let highlighter: Highlighter | null = null;

export async function getShikiHighlighter() {
  if (!highlighter) {
    highlighter = await createHighlighter({
      themes: ["vesper"],
      langs: ["javascript", "typescript", ...],
    });
  }
  return highlighter;
}
```

Criar Server Component:
```tsx
// code-block-server.tsx (async!)
export async function CodeBlockServer({ code, language }) {
  const html = await codeToHtml(code, language);
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}
```

## Padrões Obrigatórios

### 1. Named Exports

Sempre usar **named exports**, nunca default exports.

```tsx
// ✅ Correto
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(...)

// ❌ Errado
export default function Button() {}
```

### 2. Extender Props Nativas

Extender as propriedades nativas do elemento HTML.

```tsx
export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}
```

### 3. Usar tailwind-variants

Utilizar `tailwind-variants` (`tv`) para criar variantes do componente.

```tsx
import { tv, type VariantProps } from "tailwind-variants";

const buttonVariants = tv({
  base: "classes-base-do-componente",
  variants: {
    variant: {
      default: "classes-da-variante-default",
      secondary: "classes-da-variante-secondary",
    },
    size: {
      sm: "h-8 px-3",
      default: "h-10 px-6",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
});
```

### 4. Passar className diretamente

**Não usar `twMerge` ou `cn()`** com tailwind-variants. Passar `className` diretamente para a função `tv()`.

```tsx
// ✅ Correto - className direto no tv()
className={buttonVariants({ variant, size, className })}

// ❌ Errado - usando cn() com tv()
className={cn(buttonVariants({ variant, size }), className)}
```

### 5. Usar CSS Variables

Usar variáveis CSS do design system ao invés de valores hardcoded.

```tsx
// ✅ Correto - usar variáveis CSS
variant: {
  default: "bg-[var(--accent-green)] text-[var(--bg-page)]",
}

// ❌ Errado - valores hardcoded
variant: {
  default: "bg-[#10B981] text-[#0A0A0A]",
}
```

### 6. Variáveis CSS Disponíveis

Do design no Pencil:

| Variável | Valor |
|----------|-------|
| `--accent-green` | `#10B981` |
| `--accent-amber` | `#F59E0B` |
| `--accent-red` | `#EF4444` |
| `--border-focus` | `#10B981` |
| `--red-accent` | `#EF4444` |
| `--muted` | `#2E2E2E` |
| `--border` | `#2E2E2E` |
| `--border-primary` | `#2A2A2A` |
| `--border-secondary` | `#252525` |
| `--foreground` | `#F2F3F0` |
| `--bg-page` | `#0A0A0A` |
| `--bg-surface` | `#0F0F0F` |
| `--bg-input` | `#111111` |
| `--text-primary` | `#FAFAFA` |
| `--text-secondary` | `#6B7280` |
| `--text-tertiary` | `#4B5563` |
| `--radius-m` | `16` |

### 7. Fontes

O projeto usa:
- **Mono**: JetBrains Mono (via `next/font/google`) - use `font-mono`
- **Sans**: Fonte padrão do sistema - use `font-sans` ou classe padrão

**Nunca usar** `font-primary` ou `font-secondary`.

```tsx
// ✅ Correto - usar classes nativas do Tailwind
className="font-mono"
className="font-sans"

// ❌ Errado - não usar
className="font-primary"
className="font-secondary"
```

Para texto monospace nos componentes, usar `font-mono`:

```tsx
const buttonVariants = tv({
  base: "font-mono ...", // ✅ Correto
});
```

### 8. Cores Canônicas

Para cores que não precisam de variáveis CSS, usar formas canônicas do Tailwind:

```tsx
// ✅ Correto
text-white
bg-black

// ❌ Errado - não usar variáveis para cores básicas
text-[var(--color-white)]
```

### 9. Estrutura do Componente (Client)

```tsx
import { forwardRef, type HTMLAttributes } from "react";
import { tv, type VariantProps } from "tailwind-variants";

const componentVariants = tv({
  base: "font-mono classes-base",
  variants: {
    variant: {
      default: "classes-variant-default",
      secondary: "classes-variant-secondary",
    },
    size: {
      sm: "h-8",
      default: "h-10",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
});

export interface ComponentProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof componentVariants> {}

export const Component = forwardRef<HTMLDivElement, ComponentProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <div
        className={componentVariants({ variant, size, className })}
        ref={ref}
        {...props}
      />
    );
  },
);

Component.displayName = "Component";
```

### 10. Estrutura do Componente (Server)

Para Server Components com Shiki:

```tsx
import { codeToHtml } from "@/lib/shiki";

export interface CodeBlockServerProps {
  code: string;
  language?: string;
}

export async function CodeBlockServer({
  code,
  language = "javascript",
}: CodeBlockServerProps) {
  const html = await codeToHtml(code, language);
  
  return (
    <div
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
```

### 11. Biome/Lint

Antes de commit/push, rodar:

```bash
npm run lint
```

Corrigir erros automaticamente:

```bash
npx biome check --write
```

### 12. forwardRef e displayName

Sempre usar `forwardRef` para permitir ref forwarding e definir `displayName`.

```tsx
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(...);
Button.displayName = "Button";
```

## Arquivo utils.ts

O arquivo `src/lib/utils.ts` contém a função `cn()` para casos que não usam `tv()`:

```tsx
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

**Nota:** `cn()` só deve ser usado em componentes que **não** usam `tailwind-variants`.

## Componentes Implementados

| Componente | Arquivo | Tipo | Descrição |
|------------|---------|------|-----------|
| Button | `button.tsx` | Client | Botão com variantes |
| Toggle | `toggle.tsx` | Client | Switch usando Radix |
| Badge | `badge.tsx` | Client | Status indicators |
| Card | `card.tsx` | Client | Content containers |
| CodeBlock | `code-block.tsx` | Client | Composição manual |
| CodeBlockServer | `code-block-server.tsx` | Server | Shiki highlighting |
| DiffLine | `diff-line.tsx` | Client | Code diff display |
| TableRow | `table-row.tsx` | Client | Leaderboard row |
| Navbar | `navbar.tsx` | Client | Navigation bar |
| ScoreRing | `score-ring.tsx` | Client | Circular score |
