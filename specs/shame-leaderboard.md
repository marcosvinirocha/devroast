# Shame Leaderboard - Especificação

## Visão Geral

Implementar shame leaderboard na homepage mostrando os 3 piores códigos (menor score) com dados reais do banco via tRPC.

## Requisitos Funcionais

1. **Buscar top 3 piores**: Query no banco ordenando por score ASC
2. **Exibir código**: Mostrar até 2-3 linhas do código
3. **Exibir score**: Mostrar score do código
4. **Exibir linguagem**: Mostrar a linguagem detectada
5. **Loading state**: Skeleton enquanto carrega

## Arquitetura

### tRPC Procedure

```typescript
// src/server/routers/_app.ts
leaderboard: createTRPCRouter({
  getShameTop3: baseProcedure
    .query(async () => {
      const result = await db
        .select({ id, code, language, score })
        .from(submissions)
        .where(eq(submissions.status, 'completed'))
        .orderBy(asc(submissions.score))
        .limit(3);
      return result;
    }),
})
```

### Estrutura de Componentes

```
src/components/home/
├── Metrics.tsx           (já existe)
├── Leaderboard.tsx       # Suspense boundary
├── LeaderboardContent.tsx # Componente com hooks
└── LeaderboardSkeleton.tsx # Loading state
```

## Tasks

- [ ] Adicionar procedure `leaderboard.getShameTop3` no tRPC
- [ ] Criar `Leaderboard.tsx` com Suspense
- [ ] Criar `LeaderboardContent.tsx` com dados
- [ ] Criar `LeaderboardSkeleton.tsx` para loading
- [ ] Integrar na homepage
