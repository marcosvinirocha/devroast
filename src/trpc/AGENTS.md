# Padrões tRPC Client-Side

Este documento define padrões para uso do tRPC em componentes cliente.

## Setup (já configurado)

O `TRPCProvider` já está configurado no layout raiz (`src/app/layout.tsx`).

## Usar tRPC em Componentes

### useQuery

```tsx
import { trpc } from '@/trpc';

function Component() {
  const query = trpc.rota.procedure.useQuery({ input: 'valor' });
  
  if (query.isLoading) return <Skeleton />;
  if (query.error) return <Error message={query.error.message} />;
  
  return <div>{query.data}</div>;
}
```

### useMutation

```tsx
import { trpc } from '@/trpc';

function Component() {
  const mutation = trpc.rota.mutation.useMutation({
    onSuccess: (data) => {
      // callback de sucesso
    },
    onError: (error) => {
      // callback de erro
    },
  });

  const handleClick = () => {
    mutation.mutate({ input: 'valor' });
  };

  return <button onClick={handleClick} disabled={mutation.isPending}>Enviar</button>;
}
```

### queryOptions (preferível)

```tsx
import { trpc } from '@/trpc';
import { useQuery } from '@tanstack/react-query';

function Component() {
  const query = useQuery(
    trpc.rota.procedure.queryOptions({ input: 'valor' })
  );
  
  return <div>{query.data}</div>;
}
```

## Padrão com Suspense

Para Server Components que precisam de dados:

```tsx
// src/components/home/Metrics.tsx
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

1. **Nunca importar de `@/trpc/server`** - isso inclui código server-only no bundle
2. **Sempre usar `trpc.createClient`** no Provider (já configurado)
3. **Verificar `isLoading` e `isPending`** antes de acessar `.data`
4. **Query key automática** - tRPC gera keys automaticamente baseado na procedure

## Exports de `@/trpc`

| Export | Uso |
|--------|-----|
| `trpc` | Hooks (useQuery, useMutation) |
| `TRPCProvider` | Provider (já no layout) |
| `AppRouter` | Tipo do router |
