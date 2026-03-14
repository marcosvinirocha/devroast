# DevRoast

Plataforma para avaliar e ranquear código de forma brutalmente honesta. Envie seu código e receba críticas sarcásticas e úteis da IA.

## Índice

- [Funcionalidades](#funcionalidades)
- [Stack](#stack)
- [Arquitetura](#arquitetura)
- [Pré-requisitos](#pré-requisitos)
- [Configuração](#configuração)
- [Executando o projeto](#executando-o-projeto)
- [Comandos](#comandos)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [API tRPC](#api-trpc)
- [Banco de Dados](#banco-de-dados)
- [Variáveis de Ambiente](#variáveis-de-ambiente)
- [Desenvolvido durante o NLW da Rocketseat](#desenvolvido-durante-o-nlw-da-rocketseat)

## Funcionalidades

- **Envio de Código**: Cole seu código e receba uma avaliação detalhada da IA
- **Modo Roast**: Escolha entre três modos de avaliação:
  - `brutal`: Críticas sarcásticas e implacáveis
  - `balanced`: Construtivo mas direto
  - `friendly`: Gentil e encorajador
- **Pontuação (Score Ring)**: Visualização circular da nota (0-10)
- **Análise Detalhada**: Lista de issues encontrados com severidade
- **Suggested Fix**: Código corrigido pela IA
- **Leaderboard**: Veja os códigos mais criticados da comunidade
- **Preview em Tempo Real**: Syntax highlighting com Shiki
- **Sistema de Metricas**: Total de roasts e média de notas

## Stack

- **Framework**: Next.js 16 (App Router)
- **Estilização**: Tailwind CSS + tailwind-variants
- **UI Componentes**: Radix UI
- **Syntax Highlighting**: Shiki
- **API**: tRPC (type-safe)
- **ORM**: Drizzle ORM
- **Banco de Dados**: PostgreSQL
- **Linting**: Biome

## Arquitetura

### Visão Geral

DevRoast segue uma arquitetura moderna com Next.js App Router e tRPC:

```
┌─────────────────────────────────────────────────────────────┐
│                        Cliente                               │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │ Home Page   │  │ Roast Page  │  │ Leaderboard Page   │  │
│  │ (Client)    │  │ (Server)    │  │ (Client + Server)  │  │
│  └──────┬──────┘  └──────┬──────┘  └──────────┬──────────┘  │
│         │                │                     │             │
│         └────────────────┼─────────────────────┘             │
│                          │                                   │
│                    tRPC (Client)                             │
└──────────────────────────┼───────────────────────────────────┘
                           │
                           ▼
┌──────────────────────────────────────────────────────────────┐
│                       Servidor                               │
│  ┌────────────────────────────────────────────────────────┐   │
│  │                    API tRPC                            │   │
│  │  - submissions.create (mutation)                      │   │
│  │  - submissions.getById (query)                        │   │
│  │  - leaderboard.getShameTop3 (query)                   │   │
│  │  - leaderboard.getAll (query)                          │   │
│  │  - metrics.getRoastStats (query)                       │   │
│  └─────────────────────┬──────────────────────────────────┘   │
│                        │                                      │
│  ┌─────────────────────▼──────────────────────────────────┐   │
│  │              OpenRouter API (AI)                       │   │
│  │        Modelo: z-ai/glm-4.5-air:free                   │   │
│  └────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌─────────────────────▼──────────────────────────────────┐   │
│  │              PostgreSQL (Drizzle ORM)                  │   │
│  │        Tabelas: submissions, roasts, leaderboard       │   │
│  └────────────────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────────┘
```

### Fluxo Principal

1. Usuário cola código na homepage
2. Frontend envia código via tRPC mutation `submissions.create`
3. Servidor salva submission no banco (status: pending)
4. Servidor chama OpenRouter API para gerar roast
5. IA retorna JSON com: score, quote, verdict, issues, suggestedFix
6. Servidor atualiza submission com score (status: completed)
7. Servidor salva roast no banco
8. Frontend redireciona para página `/roast/{id}`
9. Página do roast (Server Component) busca dados diretamente do banco
10. Exibe resultado com CodeBlockServer (Shiki para syntax highlighting)

## Pré-requisitos

- Node.js 18+
- PostgreSQL (local ou cloud)
- Conta no [OpenRouter](https://openrouter.ai/) para chave de API

## Configuração

### 1. Clone o repositório

```bash
git clone <repo-url>
cd devroast
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure as variáveis de ambiente

Crie um arquivo `.env.local` na raiz do projeto:

```bash
# Banco de dados PostgreSQL
DATABASE_URL="postgresql://user:password@localhost:5432/devroast"

# API da OpenRouter (obtenha em https://openrouter.ai/)
OPENROUTER_API_KEY="sk-or-v1-..."
```

### 4. Configure o banco de dados

```bash
# Gere as migrações do Drizzle
npm run db:generate

# Execute as migrações
npm run db:push

# (Opcional) Execute o seed para dados de exemplo
npm run db:seed
```

## Executando o projeto

```bash
npm run dev
```

Acesse: http://localhost:3000

## Comandos

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Inicia o servidor de desenvolvimento |
| `npm run build` | Faz build para produção |
| `npm run start` | Inicia o servidor de produção |
| `npm run lint` | Verifica erros de código com Biome |
| `npm run db:generate` | Gera migrações do Drizzle |
| `npm run db:push` | Executa migrações no banco |
| `npm run db:studio` | Abre o Drizzle Studio (interface visual) |
| `npm run db:seed` | Popula o banco com dados de exemplo |

## Estrutura do Projeto

```
src/
├── app/                        # Next.js App Router
│   ├── page.tsx               # Homepage (formulário de envio)
│   ├── layout.tsx             # Layout principal
│   ├── api/trpc/[trpc]/      # API route do tRPC
│   │   └── route.ts
│   ├── roast/[id]/            # Página de resultado do roast
│   │   └── page.tsx          # Server Component
│   └── leaderboard/           # Página de leaderboard
│       ├── page.tsx
│       └── Metrics.tsx
│
├── components/
│   ├── ui/                   # Componentes de UI reutilizáveis
│   │   ├── button.tsx        # Botão com variantes
│   │   ├── toggle.tsx        # Switch (Radix UI)
│   │   ├── badge.tsx         # Indicadores de status
│   │   ├── card.tsx          # Containers de conteúdo
│   │   ├── score-ring.tsx    # Visualização circular de nota
│   │   ├── code-block.tsx    # Bloco de código (client)
│   │   ├── code-block-server.tsx # Bloco de código (server/Shiki)
│   │   ├── diff-line.tsx      # Linha de diff
│   │   └── table-row.tsx      # Linha de tabela
│   │
│   ├── home/                 # Componentes da homepage
│   │   ├── Leaderboard.tsx   # Mini leaderboard
│   │   ├── LeaderboardRow.tsx
│   │   ├── LeaderboardSkeleton.tsx
│   │   ├── Metrics.tsx        # Estatísticas (c/ Suspense)
│   │   └── MetricsContent.tsx
│   │
│   ├── leaderboard/          # Componentes do leaderboard
│   │   ├── Leaderboard.tsx
│   │   ├── LeaderboardRow.tsx
│   │   └── LeaderboardSkeleton.tsx
│   │
│   ├── code-editor.tsx       # Editor de código com limite
│   └── providers/
│       └── TRPCProvider.tsx  # Provider do tRPC
│
├── server/
│   ├── routers/
│   │   └── _app.ts           # Router principal do tRPC
│   ├── trpc/
│   │   └── index.ts          # Configuração do tRPC server
│   └── context.ts            # Contexto do tRPC
│
├── trpc/
│   ├── index.ts              # Exports: trpc, TRPCProvider
│   ├── react.ts              # createTRPCReact type
│   ├── client.ts             # createTRPCClient
│   └── query-client.ts       # QueryClient factory
│
├── lib/
│   ├── ai.ts                 # Integração OpenRouter API
│   ├── shiki.ts              # Configuração Shiki (highlighter)
│   ├── roast.ts              # Queries diretas ao banco
│   ├── language-detector.ts  # Detecção de linguagem
│   └── utils.ts              # Funções utilitárias (cn)
│
└── db/
    ├── index.ts              # Configuração Drizzle
    ├── schema.ts             # Schema do banco
    └── seed.ts               # Dados de exemplo
```

## API tRPC

### Queries

#### `submissions.getById`
Busca uma submissão pelo ID.

```typescript
// Input
{ id: string }

// Retorno
{
  id: string;
  code: string;
  language: string;
  score: number;
  status: string;
  createdAt: string;
  roast: {
    id: string;
    quote: string;
    verdict: string;
    issues: Array<{
      title: string;
      description: string;
      severity: "critical" | "warning" | "info";
    }>;
    suggestedFix: string;
    roastMode: string;
    createdAt: string;
  } | null;
}
```

#### `leaderboard.getShameTop3`
Busca os 3 piores códigos.

```typescript
// Retorno (sem input)
Array<{
  id: string;
  code: string;
  codeHtml: string;
  language: string;
  score: number;
  createdAt: string;
}>
```

#### `leaderboard.getAll`
Busca todos os códigos ranqueados.

```typescript
// Input
{ limit: number }

// Retorno
Array<{
  id: string;
  rank: number;
  code: string;
  codeHtml: string;
  language: string;
  score: number;
  createdAt: string;
}>
```

#### `metrics.getRoastStats`
Busca estatísticas globais.

```typescript
// Input (opcional)
{ status: "pending" | "processing" | "completed" | "failed" }

// Retorno
{
  totalRoasts: number;
  avgScore: number;
}
```

### Mutations

#### `submissions.create`
Cria uma nova submissão e gera o roast.

```typescript
// Input
{
  code: string;        // Código fonte (max 10000 chars)
  language: string;   // Linguagem (javascript, typescript, etc)
  roastMode: "brutal" | "balanced" | "friendly";
}

// Retorno
{ id: string }  // ID da submissão criada
```

## Banco de Dados

### Schema (Drizzle ORM)

```typescript
// Tabela de submissões
submissions {
  id: uuid (PK)
  code: text
  language: enum (language)
  title: varchar (optional)
  description: text (optional)
  status: enum (submission_status) // pending, processing, completed, failed
  score: integer (0-10)
  createdAt: timestamp
  updatedAt: timestamp
}

// Tabela de roasts
roasts {
  id: uuid (PK)
  submissionId: uuid (FK -> submissions.id)
  content: text (JSON stringified)
  roastMode: enum (roast_mode)
  createdAt: timestamp
}

// Tabela de leaderboard (cache)
leaderboard {
  id: uuid (PK)
  totalScore: integer
  submissionsCount: integer
  averageScore: numeric
  rank: integer
  updatedAt: timestamp
}
```

### Enums

```typescript
// Linguagens suportadas
language: javascript | typescript | jsx | tsx | python | rust | go | java |
          c | cpp | csharp | ruby | php | swift | kotlin | scala |
          html | css | scss | json | yaml | markdown | bash | shell | sql

// Modos de roast
roast_mode: brutal | balanced | friendly

// Status da submissão
submission_status: pending | processing | completed | failed
```

## Variáveis de Ambiente

| Variável | Descrição | Obrigatório |
|----------|-----------|-------------|
| `DATABASE_URL` | String de conexão PostgreSQL | Sim |
| `OPENROUTER_API_KEY` | Chave da API OpenRouter | Sim |

## Design System

### Variáveis CSS

O projeto utiliza variáveis CSS personalizadas definidas em `src/app/globals.css`:

| Variável | Valor | Uso |
|----------|-------|-----|
| `--accent-green` | `#10B981` | Sucesso, highlights positivos |
| `--accent-amber` | `#F59E0B` | Avisos, neutro |
| `--accent-red` | `#EF4444` | Erros, críticas |
| `--bg-page` | `#0A0A0A` | Fundo da página |
| `--bg-surface` | `#0F0F0A` | Superfície de cards |
| `--bg-input` | `#111111` | Campos de input |
| `--text-primary` | `#FAFAFA` | Texto principal |
| `--text-secondary` | `#6B7280` | Texto secundário |
| `--text-tertiary` | `#4B5563` | Texto terciário |
| `--border-primary` | `#2A2A2A` | Bordas principais |
| `--border-secondary` | `#252525` | Bordas secundárias |

### Fontes

- **Mono**: JetBrains Mono (`font-mono`)
- **Sans**: Fonte padrão do sistema (`font-sans`)

## Boas Práticas

1. **Sempre use Named Exports** - Never default exports
2. **Server Components** - Prefira Server Components quando possível
3. **tRPC** - Use tRPC para comunicação client-server type-safe
4. **Radix UI** - Use Radix para componentes interativos
5. **Shiki** - Server-side syntax highlighting
6. **Biome** - Execute `npm run lint` antes de commit

## Licença

MIT

## Desenvolvido durante o NLW da Rocketseat
