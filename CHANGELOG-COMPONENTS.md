# Registro de Alterações - Component Library

## Visão Geral

Esta sessão documenta as alterações realizadas para replicar a página Component Library fielmente conforme o design do Pencil.

---

## 1. Correção de Erro de Chave Duplicada

### Problema
Erro: `Encountered two children with the same key, }`

### Solução
Arquivo: `src/components/ui/code-block-server.tsx:60-62`

```tsx
// Antes (problemático)
const lineKey = line.trim() || `empty-${i}`;
return <span key={lineKey}>{i + 1}</span>;

// Depois (corrigido)
const lineKey = `${i}-${line.slice(0, 10)}`;
return <span key={lineKey}>{i + 1}</span>;
```

---

## 2. Remoção de Bordas Arredondadas

### Problema
Os botões e outros componentes tinham `rounded-[var(--radius-m)]` (cornerRadius: 16), mas o design do Pencil não possui bordas arredondadas (cornerRadius: 0).

### Alterações

#### button.tsx (linha 5)
```tsx
// Antes
base: "inline-flex items-center justify-center whitespace-nowrap rounded-[var(--radius-m)] text-sm font-medium...";

// Depois
base: "inline-flex items-center justify-center whitespace-nowrap text-sm font-medium...";
```

#### code-block.tsx (linha 5)
```tsx
// Antes
base: "w-full rounded-[var(--radius-m)] border border-[var(--border-primary)] bg-[var(--bg-input)] overflow-hidden";

// Depois
base: "w-full border border-[var(--border-primary)] bg-[var(--bg-input)] overflow-hidden";
```

#### code-block-server.tsx (linha 6)
```tsx
// Antes
base: "w-full rounded-[var(--radius-m)] border border-[var(--border-primary)] bg-[var(--bg-input)] overflow-hidden";

// Depois
base: "w-full border border-[var(--border-primary)] bg-[var(--bg-input)] overflow-hidden";
```

#### card.tsx (linha 5)
```tsx
// Antes
base: "w-full rounded-[var(--radius-m)] border border-[var(--border-primary)] bg-transparent p-5";

// Depois
base: "w-full border border-[var(--border-primary)] bg-transparent p-5";
```

---

## 3. Replicação da Página Component Library

### Estrutura do Design (Pencil)
- Padding-left: 80px
- Padding-top: 60px
- Gap entre seções: 24px
- Título: "// component_library" (// em verde, texto em branco)

### Reestruturação do page.tsx

O arquivo `src/app/components/page.tsx` foi completamente reescrito para replicar o design:

#### Componente SectionTitle
```tsx
function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-[14px] font-bold font-mono text-[var(--accent-green)]">
        {"//"}
      </span>
      <span className="text-[14px] font-bold font-mono text-[var(--text-primary)]">
        {children}
      </span>
    </div>
  );
}
```

#### Layout Principal
- Container com `px-20 py-[60px]`
- Título com "// component_library"
- 10 seções: typography, buttons, toggle, badge_status, cards, code_block, diff_line, table_row, navbar, score_ring
- Cada seção com `mt-6` de espaçamento

---

## 4. Atualização das Variáveis CSS

### Arquivo: `src/app/globals.css`

#### Valores Alterados

| Variável | Antes | Depois (Pencil) |
|----------|-------|-----------------|
| `--bg-page` | #0A0A0A | #0C0C0C |
| `--bg-surface` | #0F0F0F | #171717 |
| `--border-primary` | #2A2A2A | #1F1F1F |
| `--text-primary` | #FAFAFA | #E5E5E5 |
| `--text-secondary` | #6B7280 | #A3A3A3 |
| `--text-tertiary` | #4B5563 | #737373 |

#### Variáveis Mantidas

| Variável | Valor |
|----------|-------|
| `--accent-green` | #10B981 |
| `--accent-amber` | #F59E0B |
| `--accent-red` | #EF4444 |
| `--bg-input` | #111111 |
| `--border-secondary` | #252525 |
| `--diff-removed` | #1A0A0A |
| `--diff-added` | #0A1A0F |

---

## 6. Migração para Variáveis do Tailwind

### Problema
Os componentes usavam variáveis CSS via `bg-[var(--accent-green)]` ao invés de classes nativas do Tailwind como `bg-accent-green`.

### Solução
Todas as variáveis CSS foram movidas para a diretiva `@theme` do Tailwind no arquivo `globals.css`, e os componentes foram atualizados para usar as classes nativas.

### Arquivo: `src/app/globals.css`

As variáveis foram movidas de `:root` para `@theme`:

```css
@theme {
  --color-accent-green: #10B981;
  --color-accent-amber: #F59E0B;
  --color-accent-red: #EF4444;
  --color-accent-cyan: #06B6D4;
  --color-border-focus: #10B981;
  --color-red-accent: #EF4444;
  --color-muted: #2E2E2E;
  --color-border: #2E2E2E;
  --color-foreground: #F2F3F0;
  --color-bg-page: #0C0C0C;
  --color-bg-surface: #171717;
  --color-bg-input: #111111;
  --color-border-primary: #1F1F1F;
  --color-border-secondary: #252525;
  --color-text-primary: #E5E5E5;
  --color-text-secondary: #A3A3A3;
  --color-text-tertiary: #737373;
  --color-diff-removed: #1A0A0A;
  --color-diff-added: #0A1A0F;
  --color-syn-keyword: #C678DD;
  --color-syn-function: #61AFEF;
  --color-syn-operator: #ABB2BF;
  --color-syn-variable: #E06C75;
  --color-syn-number: #D19A66;
  --color-syn-string: #E5C07B;
  --radius-m: 16px;
  --font-mono: "JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  --font-sans: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
}
```

### Componentes Atualizados

| Arquivo | Antes | Depois |
|---------|-------|--------|
| button.tsx | `bg-[var(--accent-green)]` | `bg-accent-green` |
| badge.tsx | `text-[var(--accent-red)]` | `text-accent-red` |
| card.tsx | `border-[var(--border-primary)]` | `border-border-primary` |
| toggle.tsx | `bg-[var(--accent-green)]` | `bg-accent-green` |
| code-block.tsx | `bg-[var(--bg-input)]` | `bg-bg-input` |
| diff-line.tsx | `bg-[var(--diff-removed)]` | `bg-diff-removed` |
| navbar.tsx | `bg-[var(--bg-page)]` | `bg-bg-page` |
| table-row.tsx | `text-[var(--text-secondary)]` | `text-text-secondary` |
| score-ring.tsx | `text-[var(--text-primary)]` | `text-text-primary` |
| page.tsx | `bg-[var(--bg-page)]` | `bg-bg-page` |

### Variáveis Removidas do :root

O bloco `:root` foi removido completamente, pois todas as variáveis agora estão definidas no `@theme` do Tailwind.

---

## 7. ScoreRing - Tamanho Único

### Verificação
O componente `ScoreRing` já possui apenas um tamanho (180px). Não havia tamanho pequeno para remover.

### Estrutura Atual
```tsx
const SCORE_RING_SIZE = 180;
const STROKE_WIDTH = 4;
```

---

## 8. ScoreRing - Gradiente Angular

### Problema
O gradiente do ScoreRing não estava implementando corretamente o gradiente angular do design do Pencil.

### Design do Pencil
- Gradiente angular (conic-gradient)
- 0% a 35%: accent-green para accent-amber
- 35% a 36%: transparente
- O resto do círculo é transparente

### Implementação
O componente foi refatorado para usar CSS `conic-gradient` com máscara radial:

```tsx
style={{
  background: `conic-gradient(
    from -135deg,
    var(--accent-green) 0deg,
    var(--accent-amber) ${arcDegrees * 0.35}deg,
    transparent ${arcDegrees * 0.36}deg,
    transparent ${arcDegrees}deg
  )`,
  maskImage: `radial-gradient(...)`,
}}
```

### Características
- Usa CSS `conic-gradient` para o gradiente angular
- Usa `maskImage` radial para criar o formato de anel
- Bordas quadradas removidas (border-radius: 0 no Pencil)
- stroke-width: 4px com border-border-primary

---

## Validação

### Lint
```bash
npm run lint
# ✓ Passed - No errors
```

### Build
```bash
npm run build
# ✓ Compiled successfully
# ✓ Route /components generated
```

---

## Arquivos Modificados

1. `src/components/ui/button.tsx` - Variáveis Tailwind + border-radius
2. `src/components/ui/badge.tsx` - Variáveis Tailwind
3. `src/components/ui/card.tsx` - Variáveis Tailwind + border-radius
4. `src/components/ui/toggle.tsx` - Variáveis Tailwind
5. `src/components/ui/code-block.tsx` - Variáveis Tailwind + border-radius
6. `src/components/ui/code-block-server.tsx` - Variáveis Tailwind + border-radius + key
7. `src/components/ui/diff-line.tsx` - Variáveis Tailwind
8. `src/components/ui/navbar.tsx` - Variáveis Tailwind
9. `src/components/ui/table-row.tsx` - Variáveis Tailwind
10. `src/components/ui/score-ring.tsx` - Variáveis Tailwind
11. `src/app/globals.css` - Variáveis no @theme do Tailwind
12. `src/app/components/page.tsx` - Variáveis Tailwind

---

## Referência de Design

O design de referência está no arquivo Pencil: `~/Documentos/devroast.pen`

- Frame: Component Library (Wbm4d)
- Largura do container: 1440px
- Seções: typography, buttons, toggle, badge_status, cards, code_block, diff_line, table_row, navbar, score_ring
