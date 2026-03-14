# Padrões Server-Side

Este documento define os padrões para código server-side no projeto.

## tRPC

### Estrutura de Arquivos

```
src/
├── server/
│   ├── trpc/
│   │   └── index.ts          # initTRPC, createTRPCRouter, baseProcedure
│   ├── routers/
│   │   └── _app.ts          # AppRouter principal
│   └── context.ts            # createTRPCContext
├── trpc/
│   ├── query-client.ts       # QueryClient factory
│   ├── react.ts              # createTRPCReact<AppRouter>
│   ├── client.ts             # createTRPCClient (se necessário)
│   └── index.ts              # Exports (TRPCProvider, trpc)
└── app/api/trpc/[trpc]/
    └── route.ts              # fetchRequestHandler
```

### Setup tRPC (Server)

```typescript
// src/server/trpc/index.ts
import { initTRPC } from '@trpc/server';
import { cache } from 'react';

export const createTRPCContext = cache(async () => {
  return {
    userId: null as string | null,
  };
});

const t = initTRPC.create();

export const createTRPCRouter = t.router;
export const createCallerFactory = t.createCallerFactory;
export const baseProcedure = t.procedure;
```

### Router com Procedures

```typescript
// src/server/routers/_app.ts
import { avg, count, eq } from 'drizzle-orm';
import { z } from 'zod';
import { submissions } from '@/db/schema';
import { baseProcedure, createTRPCRouter } from '../trpc';

export const appRouter = createTRPCRouter({
  metrics: createTRPCRouter({
    getRoastStats: baseProcedure
      .input(z.object({ status: z.enum(['completed']).optional() }))
      .query(async ({ input }) => {
        const { db } = await import('@/db');
        
        const [countResult] = await db
          .select({ count: count() })
          .from(submissions)
          .where(input.status ? eq(submissions.status, input.status) : undefined);

        return {
          totalRoasts: countResult?.count ?? 0,
        };
      }),
  }),
});

export type AppRouter = typeof appRouter;
```

### API Route Handler

```typescript
// src/app/api/trpc/[trpc]/route.ts
import { fetchRequestHandler } from '@trpc/server/adapters/fetch';
import { appRouter } from '@/server/routers/_app';
import { createContext } from '@/server/context';

const handler = (req: Request) =>
  fetchRequestHandler({
    endpoint: '/api/trpc',
    req,
    router: appRouter,
    createContext,
  });

export { handler as GET, handler as POST };
```

### Client-Side Setup

```typescript
// src/components/providers/TRPCProvider.tsx
'use client';

import type { QueryClient } from '@tanstack/react-query';
import { QueryClientProvider } from '@tanstack/react-query';
import { httpBatchLink } from '@trpc/client';
import { createTRPCReact } from '@trpc/react-query';
import { useState } from 'react';
import type { AppRouter } from '@/server/routers/_app';
import { makeQueryClient } from '@/trpc/query-client';

export const trpc = createTRPCReact<AppRouter>();

function getUrl() {
  if (typeof window !== 'undefined') return '';
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return 'http://localhost:3000';
}

export function TRPCProvider({ children }: { children: React.ReactNode }) {
  const queryClient = getQueryClient();
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [httpBatchLink({ url: `${getUrl()}/api/trpc` })],
    })
  );

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </trpc.Provider>
  );
}
```

### Usar tRPC em Componentes

```typescript
// Client Component com Suspense
import { Suspense } from 'react';
import { trpc } from '@/trpc';

function MetricsFetcher() {
  const stats = trpc.metrics.getRoastStats.useQuery({ status: 'completed' });
  
  if (stats.isLoading) return <Skeleton />;
  
  return <div>{stats.data?.totalRoasts}</div>;
}

export function Metrics() {
  return (
    <Suspense fallback={<MetricsSkeleton />}>
      <MetricsFetcher />
    </Suspense>
  );
}
```

## Regras

1. **Server-only**: Arquivos em `src/server/` devem ser server-only
2. **Named exports**: Sempre usar named exports
3. **Zod**: Usar Zod para validação de input em procedures
4. **Drizzle**: Queries ao banco devem usar Drizzle ORM
5. **lazy import**: Para imports de DB em runtime, usar `await import('@/db')`
