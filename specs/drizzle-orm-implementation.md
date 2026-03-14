# Especificação - Drizzle ORM com Docker Compose

## Visão Geral

Implementar a camada de persistência utilizando Drizzle ORM com PostgreSQL rodando via Docker Compose.

## Infraestrutura

### Docker Compose

```yaml
# docker-compose.yml
services:
  postgres:
    image: postgres:16-alpine
    container_name: devroast-db
    environment:
      POSTGRES_USER: devroast
      POSTGRES_PASSWORD: devroast_password
      POSTGRES_DB: devroast
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U devroast"]
      interval: 5s
      timeout: 5s
      retries: 5

volumes:
  postgres_data:
```

### Variáveis de Ambiente

```env
# .env.local
DATABASE_URL=postgresql://devroast:devroast_password@localhost:5432/devroast
```

## Estrutura do Banco de Dados

### Enum: Language

```typescript
export const languageEnum = pgEnum('language', [
  'javascript',
  'typescript',
  'jsx',
  'tsx',
  'python',
  'rust',
  'go',
  'java',
  'c',
  'cpp',
  'csharp',
  'ruby',
  'php',
  'swift',
  'kotlin',
  'scala',
  'html',
  'css',
  'scss',
  'json',
  'yaml',
  'markdown',
  'bash',
  'shell',
  'sql',
]);
```

### Enum: RoastMode

```typescript
export const roastModeEnum = pgEnum('roast_mode', [
  'brutal',
  'balanced',
  'friendly',
]);
```

### Enum: SubmissionStatus

```typescript
export const submissionStatusEnum = pgEnum('submission_status', [
  'pending',
  'processing',
  'completed',
  'failed',
]);
```

### Tabela: users

```typescript
export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  username: varchar('username', { length: 50 }).notNull().unique(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  avatarUrl: varchar('avatar_url', { length: 500 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
```

### Tabela: submissions

```typescript
export const submissions = pgTable('submissions', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  code: text('code').notNull(),
  language: languageEnum('language').notNull(),
  title: varchar('title', { length: 200 }),
  description: text('description'),
  status: submissionStatusEnum('status').default('pending').notNull(),
  score: integer('score'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
```

### Tabela: roasts

```typescript
export const roasts = pgTable('roasts', {
  id: uuid('id').primaryKey().defaultRandom(),
  submissionId: uuid('submission_id')
    .references(() => submissions.id)
    .notNull(),
  content: text('content').notNull(),
  roastMode: roastModeEnum('roast_mode').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
```

### Tabela: leaderboard

```typescript
export const leaderboard = pgTable('leaderboard', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  totalScore: integer('total_score').notNull().default(0),
  submissionsCount: integer('submissions_count').notNull().default(0),
  averageScore: numeric('average_score', { precision: 5, scale: 2 }),
  rank: integer('rank'),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
```

## Estrutura de Arquivos

```
src/
├── db/
│   ├── index.ts          # Configuração e conexão
│   ├── schema.ts         # Schema do Drizzle
│   ├── migrations/       # Migrations do banco
│   └── seed/            # Dados iniciais
└── lib/
    └── db.ts            # Instância do banco
```

## To-Dos para Implementação

### Fase 1: Infraestrutura

- [ ] Criar arquivo docker-compose.yml com PostgreSQL
- [ ] Criar arquivo .env.local com DATABASE_URL
- [ ] Criar arquivo Dockerfile para aplicação (se necessário)
- [ ] Configurar docker-compose para development

### Fase 2: Drizzle Setup

- [ ] Instalar dependências: `npm install drizzle-orm postgres dotenv`
- [ ] Instalar devDependencies: `npm install -D drizzle-kit`
- [ ] Criar arquivo `src/db/index.ts` com configuração
- [ ] Criar arquivo `src/db/schema.ts` com schema completo

### Fase 3: Migrations

- [ ] Configurar Drizzle Kit com driver PostgreSQL
- [ ] Criar script `db:generate` para gerar migrations
- [ ] Criar script `db:push` para aplicar migrations
- [ ] Criar script `db:studio` para visualização

### Fase 4: Operações CRUD

- [ ] Implementar repository/users.ts
- [ ] Implementar repository/submissions.ts
- [ ] Implementar repository/roasts.ts
- [ ] Implementar repository/leaderboard.ts

### Fase 5: Integração

- [ ] Criar API routes para CRUD de submissions
- [ ] Criar API routes para roasts
- [ ] Criar API routes para leaderboard
- [ ] Integrar com componentes existentes

### Fase 6: Scripts package.json

```json
{
  "scripts": {
    "db:generate": "drizzle-kit generate",
    "db:push": "drizzle-kit push",
    "db:studio": "drizzle-kit studio",
    "db:migrate": "tsx src/db/migrate.ts"
  }
}
```

## Considerações

1. **Conexão**: Usar connection string do Docker
2. **Migrations**: Usar Drizzle Kit para versionamento
3. **Tipagem**: Usar inference do Drizzle para tipos TypeScript
4. **Transactional**: Para operações que precisam de atomicidade