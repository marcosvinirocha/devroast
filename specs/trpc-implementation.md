# tRPC Implementation - Especificação

## Visão Geral

Implementar tRPC como camada de API/typesafe backend no projeto Next.js 16 App Router, permitindo chamadas type-safe entre cliente e servidor com integração completa Server Components e React Query.

## Requisitos Funcionais

1. **Configuração do servidor tRPC**: Expor API route handler em `/api/trpc/[trpc]`
2. **Definição de router base**: Criar appRouter com estrutura inicial para procedures
3. **Integração Server Components**: Permitir prefetch de queries em RSCs com HydrationBoundary
4. **Integração Client Components**: Provider tRPC com React Query para hooks client-side
5. **Type-safety end-to-end**: Compartilhar tipo AppRouter entre server e client
6. **Suporte a queries e mutations**: Estrutura base para CRUD operations
7. **Metrics na homepage**: Exibir total de roasts e avg score com animação

## Arquitetura e Tecnologias

### Bibliotecas

- `@trpc/server` - Backend tRPC
- `@trpc/client` - Cliente tRPC
- `@trpc/tanstack-react-query` - Integração React Query
- `@trpc/react-query` - Hooks React para tRPC
- `@tanstack/react-query` - Já existente no projeto

### Estrutura de Arquivos

```
src/
├── server/
│   ├── trpc/
│   │   └── index.ts          # initTRPC, createTRPCRouter
│   ├── routers/
│   │   └── _app.ts          # AppRouter principal
│   └── context.ts            # createTRPCContext
├── trpc/
│   ├── query-client.ts       # QueryClient factory
│   ├── client.ts             # createTRPCClient (client-side)
│   ├── react.ts              # createTRPCReact
│   └── index.ts              # Exports (TRPCProvider, trpc)
├── app/
│   └── api/trpc/[trpc]/
│       └── route.ts          # Route handler fetchRequestHandler
└── components/
    ├── providers/
    │   └── TRPCProvider.tsx  # Provider client-side
    └── home/
        ├── Metrics.tsx       # Componente com Suspense
        └── MetricsContent.tsx # Client com hooks + animação
```

### Padrão Client Components

```typescript
// Client Component (use hook)
import { trpc } from '@/trpc';

export function ClientComponent() {
  const stats = trpc.metrics.getRoastStats.useQuery({ status: 'completed' });
  return <div>{stats.data?.totalRoasts}</div>;
}
```

### Padrão com Suspense

```typescript
import { Suspense } from 'react';

export function Metrics() {
  return (
    <Suspense fallback={<Skeleton />}>
      <MetricsFetcher />
    </Suspense>
  );
}
```

## Tasks

- [x] Instalar dependências @trpc/server @trpc/client @trpc/tanstack-react-query @trpc/react-query
- [x] Criar `src/server/trpc/index.ts` com initTRPC e helpers
- [x] Criar `src/server/context.ts` com createTRPCContext
- [x] Criar `src/server/routers/_app.ts` com AppRouter e metrics.getRoastStats
- [x] Criar `src/app/api/trpc/[trpc]/route.ts` com fetchRequestHandler
- [x] Criar `src/trpc/query-client.ts` com QueryClient factory
- [x] Criar `src/trpc/react.ts` com createTRPCReact
- [x] Criar `src/trpc/index.ts` exports
- [x] Criar `src/components/providers/TRPCProvider.tsx`
- [x] Configurar Provider no layout raiz
- [x] Criar componente Metrics com Suspense e animação
