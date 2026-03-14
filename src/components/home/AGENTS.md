# Padrões de Componentes de Feature

Este documento define padrões para componentes de feature em `src/components/home/` e similares.

## Estrutura

```
src/components/home/
├── Metrics.tsx           # Server/Client boundary com Suspense
├── MetricsContent.tsx    # Componente com hooks + animação
└── AGENTS.md
```

## Padrão: Server Component com Suspense

Quando um componente precisa de dados do banco (via tRPC), usar padrão com Suspense:

```tsx
// src/components/home/Metrics.tsx
import { Suspense } from 'react';
import { trpc } from '@/trpc';

function MetricsFetcher() {
  const stats = trpc.metrics.getRoastStats.useQuery({ status: 'completed' });

  if (stats.isLoading) {
    return <Skeleton />;
  }

  return <MetricsContent totalRoasts={stats.data?.totalRoasts ?? 0} />;
}

export function Metrics() {
  return (
    <Suspense
      fallback={
        <div>Loading...</div>
      }
    >
      <MetricsFetcher />
    </Suspense>
  );
}
```

## Padrão: AnimatedNumber

Para animação de números (ex: counter de zero até valor final), usar componente com useState + useEffect:

```tsx
// src/components/home/AnimatedNumber.tsx
'use client';

import { useEffect, useState } from 'react';

interface AnimatedNumberProps {
  value: number;
  decimals?: number;
}

export function AnimatedNumber({ value, decimals = 0 }: AnimatedNumberProps) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const duration = 1000;
    const steps = 30;
    const increment = value / steps;
    let current = 0;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      current = Math.min(current + increment, value);
      setDisplayValue(Number(current.toFixed(decimals)));

      if (step >= steps) {
        clearInterval(timer);
        setDisplayValue(value);
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [value, decimals]);

  return <span>{displayValue.toLocaleString(undefined, { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}</span>;
}
```

## Regras

1. **Separar concerns**: Componente de UI (Content) ≠ Componente de Fetching (Fetcher)
2. **Skeleton/Fallback**: Sempre ter estados de loading
3. **Animações em client**: Componentes com animação devem ser `'use client'`
4. **useQuery options**: Preferir `.queryOptions()` ao invés de `.useQuery()`
