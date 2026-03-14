# Specs

## Formato

Criar arquivo `.md` em `specs/` antes de implementar qualquer feature:

```markdown
# Nome da Feature - Especificação

## Visão Geral
Breve descrição do que resolve.

## Requisitos Funcionais
1. Requisito 1
2. Requisito 2

## Arquitetura e Tecnologias
### Bibliotecas
- Biblioteca X

### Estrutura de Arquivos
```
src/
├── pasta/
│   └── arquivo.ts
```

### Padrões de Código
Incluir exemplos de como o código deve ser escrito.

## Tasks
- [ ] Task 1
- [ ] Task 2
```

## Processo

1. **Criar spec** antes de implementar (sempre)
2. **Revisar spec** antes de codar
3. **Implementar** seguindo a spec
4. **Marcar tasks** quando concluídas
5. **Atualizar spec** se necessário durante implementação

## Exemplo Real

Ver `specs/trpc-implementation.md` para um exemplo completo de spec criada e implementada.
