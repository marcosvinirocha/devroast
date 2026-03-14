"use client";

import {
  forwardRef,
  type HTMLAttributes,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import { ShikiHighlighter } from "react-shiki";
import { tv, type VariantProps } from "tailwind-variants";
import { detectLanguage } from "@/lib/language-detector";

const AVAILABLE_LANGUAGES = [
  "javascript",
  "typescript",
  "jsx",
  "tsx",
  "python",
  "rust",
  "go",
  "java",
  "c",
  "cpp",
  "csharp",
  "ruby",
  "php",
  "swift",
  "kotlin",
  "scala",
  "html",
  "css",
  "scss",
  "json",
  "yaml",
  "markdown",
  "bash",
  "shell",
  "sql",
];

const codeEditorVariants = tv({
  base: "overflow-hidden rounded-md border border-border-primary",
  variants: {},
});

export interface CodeEditorProps {
  value?: string;
  language?: string;
  readOnly?: boolean;
  onLanguageDetected?: (language: string) => void;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  className?: string;
  children?: React.ReactNode;
}

export const CodeEditorRoot = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={codeEditorVariants({ className })}
      style={{ minHeight: 200, height: "auto" }}
      {...props}
    >
      {children}
    </div>
  );
});
CodeEditorRoot.displayName = "CodeEditorRoot";

const codeEditorHeaderVariants = tv({
  base: "flex items-center gap-3 h-8 md:h-10 px-3 md:px-4 border-b border-border-primary bg-bg-surface rounded-t-md",
});

export interface CodeEditorHeaderProps extends HTMLAttributes<HTMLDivElement> {}

export const CodeEditorHeader = forwardRef<
  HTMLDivElement,
  CodeEditorHeaderProps
>(({ className, children, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={codeEditorHeaderVariants({ className })}
      {...props}
    >
      {children}
    </div>
  );
});
CodeEditorHeader.displayName = "CodeEditorHeader";

const codeEditorDotVariants = tv({
  base: "rounded-full",
  variants: {
    color: {
      red: "bg-[#EF4444]",
      amber: "bg-[#F59E0B]",
      green: "bg-[#10B981]",
    },
  },
});

export interface CodeEditorDotProps
  extends VariantProps<typeof codeEditorDotVariants> {
  className?: string;
}

export const CodeEditorDot = forwardRef<HTMLSpanElement, CodeEditorDotProps>(
  ({ className, color, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={codeEditorDotVariants({ color, className })}
        {...props}
      />
    );
  },
);
CodeEditorDot.displayName = "CodeEditorDot";

const codeEditorBodyVariants = tv({
  base: "flex h-[200px] md:h-[280px] lg:h-[360px] bg-bg-input overflow-hidden",
});

export interface CodeEditorBodyProps extends HTMLAttributes<HTMLDivElement> {}

export const CodeEditorBody = forwardRef<HTMLDivElement, CodeEditorBodyProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={codeEditorBodyVariants({ className })}
        {...props}
      >
        {children}
      </div>
    );
  },
);
CodeEditorBody.displayName = "CodeEditorBody";

const codeEditorLineNumbersVariants = tv({
  base: "flex flex-col gap-1.5 py-2 md:py-3 pr-2 md:pr-3 pl-3 md:pl-4 border-r border-border-primary text-right font-mono text-[11px] md:text-[12px] text-text-tertiary min-w-8 md:min-w-12 overflow-hidden",
});

export interface CodeEditorLineNumbersProps
  extends HTMLAttributes<HTMLDivElement> {
  count: number;
}

export const CodeEditorLineNumbers = forwardRef<
  HTMLDivElement,
  CodeEditorLineNumbersProps
>(({ className, count, ...props }, ref) => {
  const lineKeys = useMemo(() => {
    return Array.from({ length: count }, (_, i) => `ln-${i + 1}`);
  }, [count]);

  return (
    <div
      ref={ref}
      className={codeEditorLineNumbersVariants({ className })}
      {...props}
    >
      {lineKeys.map((key) => (
        <span key={key}>{Number(key.split("-")[1])}</span>
      ))}
    </div>
  );
});
CodeEditorLineNumbers.displayName = "CodeEditorLineNumbers";

const codeEditorContentVariants = tv({
  base: "flex-1 p-3 md:p-4 font-mono text-[11px] md:text-[12px] text-text-primary bg-transparent outline-none resize-none leading-[1.5] overflow-auto",
});

export interface CodeEditorContentProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

export const CodeEditorContent = forwardRef<
  HTMLTextAreaElement,
  CodeEditorContentProps
>(({ className, ...props }, ref) => {
  return (
    <textarea
      ref={ref}
      className={codeEditorContentVariants({ className })}
      placeholder="paste your code here..."
      spellCheck={false}
      {...props}
    />
  );
});
CodeEditorContent.displayName = "CodeEditorContent";

const languageSelectorVariants = tv({
  base: "ml-auto flex items-center gap-2 text-xs md:text-sm",
});

interface LanguageSelectorProps extends HTMLAttributes<HTMLDivElement> {
  language: string;
  isEmpty: boolean;
  onLanguageChange: (language: string) => void;
}

export const LanguageSelector = forwardRef<
  HTMLDivElement,
  LanguageSelectorProps
>(({ className, language, isEmpty, onLanguageChange, ...props }, ref) => {
  const displayValue = isEmpty ? "auto-detect" : language;

  return (
    <div
      ref={ref}
      className={languageSelectorVariants({ className })}
      {...props}
    >
      <select
        value={displayValue}
        onChange={(e) => {
          onLanguageChange(e.target.value);
        }}
        className="border border-border-primary bg-bg-input rounded px-2 py-1 text-text-primary font-mono text-xs md:text-sm cursor-pointer hover:border-border-focus transition-colors"
      >
        <option value="auto-detect">Auto-detect</option>
        {AVAILABLE_LANGUAGES.map((lang) => (
          <option key={lang} value={lang}>
            {lang.toUpperCase()}
          </option>
        ))}
      </select>
    </div>
  );
});
LanguageSelector.displayName = "LanguageSelector";

interface SyntaxHighlightedContentProps {
  code: string;
  language: string;
  className?: string;
}

const syntaxHighlightedContentVariants = tv({
  base: "flex-1 p-3 md:p-4 font-mono text-[11px] md:text-[12px] text-text-primary bg-transparent leading-[1.5] overflow-auto",
});

export const SyntaxHighlightedContent = forwardRef<
  HTMLDivElement,
  SyntaxHighlightedContentProps
>(({ className, code, language }, ref) => {
  return (
    <div ref={ref} className={syntaxHighlightedContentVariants({ className })}>
      <ShikiHighlighter language={language} theme="vesper">
        {code}
      </ShikiHighlighter>
    </div>
  );
});
SyntaxHighlightedContent.displayName = "SyntaxHighlightedContent";

export const CodeEditor = forwardRef<HTMLDivElement, CodeEditorProps>(
  (
    {
      value: initialValue = "",
      className,
      language: fixedLanguage,
      readOnly = false,
      onLanguageDetected,
      onChange,
      ...props
    },
    ref,
  ) => {
    const [code, setCode] = useState(initialValue);
    const [detectedLanguage, setDetectedLanguage] = useState<string | null>(
      null,
    );
    const [selectedLanguage, setSelectedLanguage] = useState<string>(
      fixedLanguage || "auto-detect",
    );
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useImperativeHandle(
      ref,
      () => textareaRef.current as unknown as HTMLDivElement,
      [],
    );

    useEffect(() => {
      setCode(initialValue);
    }, [initialValue]);

    useEffect(() => {
      setSelectedLanguage(fixedLanguage || "auto-detect");
    }, [fixedLanguage]);

    useEffect(() => {
      if (code.trim().length === 0) {
        setDetectedLanguage(null);
        return;
      }

      if (!fixedLanguage && code.trim().length > 10) {
        const detectLang = async () => {
          try {
            const lang = await detectLanguage(code);
            if (lang) {
              setDetectedLanguage(lang);
              onLanguageDetected?.(lang);
            }
          } catch (error) {
            console.error("Language detection error:", error);
          }
        };

        const timeoutId = setTimeout(detectLang, 300);
        return () => clearTimeout(timeoutId);
      }
    }, [code, fixedLanguage, onLanguageDetected]);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setCode(e.target.value);
      onChange?.(e);
    };

    const lineCount = useMemo(() => {
      return code.split("\n").length || 1;
    }, [code]);

    const isAutoDetect =
      selectedLanguage === "auto-detect" || !selectedLanguage;
    const activeLanguage = isAutoDetect
      ? detectedLanguage || "javascript"
      : selectedLanguage;

    return (
      <CodeEditorRoot className={className} {...props}>
        <CodeEditorHeader>
          <CodeEditorDot color="red" className="h-2.5 w-2.5 md:h-3 md:w-3" />
          <CodeEditorDot color="amber" className="h-2.5 w-2.5 md:h-3 md:w-3" />
          <CodeEditorDot color="green" className="h-2.5 w-2.5 md:h-3 md:w-3" />
          {!readOnly && (
            <LanguageSelector
              language={activeLanguage}
              isEmpty={!code.trim()}
              onLanguageChange={(lang) => {
                if (lang === "auto-detect") {
                  setSelectedLanguage("auto-detect");
                } else {
                  setSelectedLanguage(lang);
                }
              }}
            />
          )}
        </CodeEditorHeader>
        <CodeEditorBody>
          <CodeEditorLineNumbers count={lineCount} />
          {!readOnly ? (
            <CodeEditorContent
              ref={textareaRef}
              value={code}
              onChange={handleChange}
            />
          ) : (
            <SyntaxHighlightedContent code={code} language={activeLanguage} />
          )}
        </CodeEditorBody>
      </CodeEditorRoot>
    );
  },
);
CodeEditor.displayName = "CodeEditor";
