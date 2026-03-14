# Code Editor com Syntax Highlighting - Especificação

## Visão Geral

Implementar um editor de código que permite aos usuários colarem trechos de código e aplicar syntax highlighting com base na linguagem detectada automaticamente ou selecionada manualmente pelo usuário.

## Requisitos Funcionais

1. **Aceitar entrada de código**: O editor deve permitir que usuários cole ou digitem código
2. **Detecção automática de linguagem**: Identificar automaticamente a linguagem do código colado
3. **Seleção manual de linguagem**: Permitir que usuários sobrescrevam a detecção automática
4. **Syntax highlighting**: Aplicar cores e estilos apropriados baseado na linguagem
5. **Numero de linhas**: Mostrar numeração de linhas ao lado do código
6. **Tema consistente**: Usar o tema "vesper" do Shiki (já existente no projeto)

## Arquitetura e Tecnologias

### Bibliotecas Selecionadas

1. **Shiki** (via `react-shiki`)
   - Já está sendo usado no projeto para server-side highlighting
   - Oferece excelente qualidade de syntax highlighting
   - Suporta dezenas de linguagens
   - Tem bom desempenho no client-side com bundle otimizado

2. **guesslang-js**
   - Biblioteca JavaScript para detecção automática de linguagem de código
   - Funciona no navegador (client-side)
   - Baseada em machine learning
   - Leve e sem dependências

### Estrutura de Componentes

Vamos estender o existente `CodeEditor` para incluir syntax highlighting:

```
CodeEditorRoot
├── CodeEditorHeader
│   ├── LanguageSelector (novo)
│   └── ColorDots (existente)
├── CodeEditorBody
│   ├── CodeEditorLineNumbers (existente)
│   └── SyntaxHighlightedContent (novo)
```

### Fluxo de Dados

1. Usuário cola/código no textarea
2. On change:
   - Atualiza estado interno do valor
   - Dispara detecção de linguagem (se não tiver seleção manual)
   - Gera HTML destacado via Shiki
   - Atualiza display do código destacado

## Implementação Detalhada

### Novos Componentes

#### 1. LanguageSelector
Componente para seleção manual de linguagem, integrado ao header do editor.

#### 2. SyntaxHighlightedContent
Substitui o simples textarea de exibição por um componente que mostra o código com syntax highlighting usando react-shiki.

### Modificações no CodeEditor Existente

Adicionaremos:
- Estado para linguagem detectada/selecionada
- Integração com guesslang-js para detecção automática
- Uso do react-shiki para rendering destacado
- Controle para modo de exibição (edit vs preview)

### Linguagens Suportadas

Inicialmente suportaremos as mesmas linguagens já configuradas no shiki.ts:
- javascript, typescript, jsx, tsx
- python, rust, go, java, c, cpp, csharp
- ruby, php, swift, kotlin, scala
- html, css, scss, json, yaml, markdown
- bash, shell, sql

## API do Componente

### Props Adicionais

```typescript
interface CodeEditorProps extends HTMLAttributes<HTMLDivElement>, VariantProps<typeof codeEditorVariants> {
  // Valor inicial (já existente)
  value?: string;
  
  // Linguagem fixa (opcional, sobrescreve detecção)
  language?: string;
  
  // Se verdadeiro, mostra apenas o código destacado (modo visualização)
  readOnly?: boolean;
  
  // Callback quando a linguagem detectada muda
  onLanguageDetected?: (language: string) => void;
}
```

### Estado Interno

```typescript
const [code, setCode] = useState(initialValue || "");
const [detectedLanguage, setDetectedLanguage] = useState<string | null>(null);
const [selectedLanguage, setSelectedLanguage] = useState<string | null>(languageProp || null);
const [highlightedHtml, setHighlightedHtml] = useState<string>("");
```

## Implementação Passo a Passo

### 1. Instalar Dependências

```bash
npm install react-shiki guesslang-js
```

### 2. Criar Utilitário de Detecção de Linguagem

```typescript
// src/lib/language-detector.ts
import { GuessLang } from 'guesslang-js';

const guessLang = new GuessLang();

export async function detectLanguage(code: string): Promise<string | null> {
  try {
    // guesslang-js retorna uma promise com a linguagem detectada
    const result = await guessLang.runModel(code);
    return result.language || null;
  } catch (error) {
    console.error('Language detection failed:', error);
    return null;
  }
}
```

### 3. Modificar CodeEditor.tsx

```typescript
"use client";

import {
  forwardRef,
  type HTMLAttributes,
  useEffect,
  useMemo,
  useState,
} from "react";
import { tv, type VariantProps } from "tailwind-variants";
import { ShikiHighlighter } from "react-shiki";
import { detectLanguage } from "@/lib/language-detector";

const codeEditorVariants = tv({
  base: "",
  variants: {},
});

export interface CodeEditorProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof codeEditorVariants> {
  value?: string;
  language?: string;
  readOnly?: boolean;
  onLanguageDetected?: (language: string) => void;
}

export const CodeEditorRoot = forwardRef<HTMLDivElement, CodeEditorProps>(
  // ... (mantém implementação existente)
);

// ... (mantém componentes existentes: CodeEditorHeader, CodeEditorDot, etc.)

const codeEditorBodyVariants = tv({
  base: "flex h-[200px] md:h-[280px] lg:h-[360px] bg-bg-input border border-border-primary border-t-0",
});

export interface CodeEditorBodyProps extends HTMLAttributes<HTMLDivElement> {}

export const CodeEditorBody = forwardRef<HTMLDivElement, CodeEditorBodyProps>(
  // ... (mantém implementação existente)
);

// ... (mantém componentes existentes: CodeEditorLineNumbers, CodeEditorContent)

// NOVO: SyntaxHighlightedContent
const syntaxHighlightedContentVariants = tv({
  base: "flex-1 p-3 md:p-4 font-mono text-[11px] md:text-[12px] text-text-primary bg-transparent leading-[1.5]",
});

interface SyntaxHighlightedContentProps {
  code: string;
  language: string;
  className?: string;
}

export const SyntaxHighlightedContent = forwardRef<
  HTMLDivElement,
  SyntaxHighlightedContentProps
>(({ className, code, language, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={syntaxHighlightedContentVariants({ className })}
      {...props}
    >
      <ShikiHighlighter
        language={language}
        code={code}
        theme="vesper"
        // Opções adicionais podem ser adicionadas aqui
      />
    </div>
  );
});
SyntaxHighlightedContent.displayName = "SyntaxHighlightedContent";

// NOVO: LanguageSelector
const languageSelectorVariants = tv({
  base: "ml-auto flex items-center gap-2 text-sm font-mono text-text-tertiary",
  variants: {},
});

interface LanguageSelectorProps {
  language: string | null;
  onLanguageChange: (language: string) => void;
  availableLanguages: string[];
}

export const LanguageSelector = forwardRef<
  HTMLDivElement,
  LanguageSelectorProps
>(({ className, language, onLanguageChange, availableLanguages, ...props }, ref) => {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onLanguageChange(e.target.value);
  };

  return (
    <div
      ref={ref}
      className={languageSelectorVariants({ className })}
      {...props}
    >
      <label htmlFor="language-select" className="mr-2">
        Language:
      </label>
      <select
        id="language-select"
        value={language || "auto"}
        onChange={handleChange}
        className="border border-border-primary bg-bg-input rounded px-2 py-1 text-text-primary"
      >
        <option value="auto">Auto-detect</option>
        {availableLanguages.map((lang) => (
          <option key={lang} value={lang}>
            {lang.toUpperCase()}
          </option>
        ))}
      </select>
    </div>
  );
});
LanguageSelector.displayName = "LanguageSelector";

// MODIFICADO: CodeEditor (agora com lógica de highlight)
export const CodeEditor = forwardRef<
  HTMLTextAreaElement,
  CodeEditorWithValueProps & Omit<CodeEditorContentProps, "value">
>(({ value: initialValue = "", className, language: fixedLanguage, readOnly = false, onLanguageDetected, ...props }, ref) => {
  const [code, setCode] = useState(initialValue || "");
  const [detectedLanguage, setDetectedLanguage] = useState<string | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(fixedLanguage || null);
  const [highlightedHtml, setHighlightedHtml] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  const activeLanguage = selectedLanguage || detectedLanguage || "javascript";
  
  // Detectar linguagem quando o código mudar (se não houver linguagem fixa)
  useEffect(() => {
    if (!fixedLanguage && code.trim().length > 10) { // Só detectar se houver código suficiente
      const detectLang = async () => {
        setIsLoading(true);
        try {
          const lang = await detectLanguage(code);
          if (lang) {
            setDetectedLanguage(lang);
            onLanguageDetected?.(lang);
          }
        } catch (error) {
          console.error('Language detection error:', error);
        } finally {
          setIsLoading(false);
        }
      };
      
      detectLang();
    }
  }, [code, fixedLanguage, onLanguageDetected]);
  
  // Atualizar destacado quando código ou linguagem mudar
  useEffect(() => {
    if (code && activeLanguage) {
      const updateHighlight = async () => {
        try {
          const shiki = await getShikiHighlighter(); // Reutilizando utilitário existente
          const html = await shiki.codeToHtml(code, {
            lang: activeLanguage,
            theme: "vesper",
          });
          setHighlightedHtml(html);
        } catch (error) {
          console.error('Highlighting error:', error);
          // Fallback para exibição simples
          setHighlightedHtml(`<pre>${code.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</pre>`);
        }
      };
      
      updateHighlight();
    }
  }, [code, activeLanguage]);
  
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCode(e.target.value);
  };
  
  const lineCount = useMemo(() => {
    return code.split("\n").length || 1;
  }, [code]);
  
  return (
    <CodeEditorRoot className={className}>
      <CodeEditorHeader>
        <CodeEditorDot color="red" className="h-2.5 w-2.5 md:h-3 md:w-3" />
        <CodeEditorDot color="amber" className="h-2.5 w-2.5 md:h-3 md:w-3" />
        <CodeEditorDot color="green" className="h-2.5 w-2.5 md:h-3 md:w-3" />
        {!readOnly && (
          <LanguageSelector
            language={selectedLanguage}
            onLanguageChange={setSelectedLanguage}
            availableLanguages={[
              "javascript", "typescript", "jsx", "tsx",
              "python", "rust", "go", "java", "c", "cpp", "csharp",
              "ruby", "php", "swift", "kotlin", "scala",
              "html", "css", "scss", "json", "yaml", "markdown",
              "bash", "shell", "sql"
            ]}
          />
        )}
      </CodeEditorHeader>
      <CodeEditorBody>
        <CodeEditorLineNumbers count={lineCount} />
        {!readOnly ? (
          <CodeEditorContent
            ref={ref}
            value={code}
            onChange={handleChange}
            {...props}
          />
        ) : (
          <div
            ref={ref}
            className="flex-1 p-3 md:p-4"
            dangerouslySetInnerHTML={{ __html: highlightedHtml }}
          />
        )}
      </CodeEditorBody>
    </CodeEditorRoot>
  );
});
```

## Considerações de Performance

1. **Debounce na detecção de linguagem**: Para evitar detecções frequentes durante digitação
2. **Cache de resultados**: Armazenar resultados de detecção para mesmos trechos de código
3. **Lazy loading de linguagens**: O react-shiki já carrega apenas linguagens usadas
4. **Threshold mínimo**: Só detectar linguagem quando houver código suficiente (>10 caracteres)

## Acessibilidade

1. Contraste adequado no tema vesper
2. Labels adequados para controles de seleção
3. Suporte à navegação por teclado
4. Texto alternativo descritivo para elementos visuais

## Testes

1. Test unitário para detecção de linguagem
2. Test de integração para fluxo completo (input → detecção → highlight)
3. Test visual para diferentes linguagens e temas
4. Test de performance com códigos grandes

## Integração com Design System

- Usar variáveis CSS existentes para cores (`--text-primary`, `--bg-input`, etc.)
- Manter consistência com espaçamento e tipografia do projeto
- Seguir padrões de named exports e forwardRef
- Utilizar tailwind-variants para estilização

## Próximos Passos

1. Implementar o componente LanguageSelector
2. Modificar o CodeEditor existente conforme especificação
3. Criar utilitário de detecção de linguagem
4. Adicionar testes
5. Documentar uso em AGENTS.md ou README