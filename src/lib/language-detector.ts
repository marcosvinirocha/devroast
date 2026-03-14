const LANGUAGE_PATTERNS: Record<string, RegExp[]> = {
  javascript: [
    /\bconst\b/,
    /\blet\b/,
    /\bvar\b/,
    /\bfunction\b/,
    /=>\s*[{(]/,
    /\bconsole\.(log|error|warn)\b/,
    /\brequire\s*\(/,
    /\bexport\s+(default|const|function|class)/,
    /\bimport\s+.*\s+from/,
  ],
  typescript: [
    /:\s*(string|number|boolean|any|void|never)\b/,
    /\binterface\b/,
    /\btype\b.*=/,
    /<\s*\w+(\s*,\s*\w+)*\s*>/,
    /\bas\b\s+(string|number|boolean|any)/,
  ],
  python: [
    /\bdef\b\s+\w+\s*\(/,
    /\bclass\b\s+\w+.*:/,
    /\bimport\b\s+\w+/,
    /\bfrom\b\s+\w+\s+import/,
    /\bif\s+__name__\s*==\s*["']__main__["']/,
    /\bprint\s*\(/,
    /\bself\b/,
    /:\s*$/m,
  ],
  rust: [
    /\bfn\b\s+\w+\s*[<(]/,
    /\blet\s+mut\b/,
    /\bimpl\b/,
    /\bstruct\b/,
    /\benum\b/,
    /\bmatch\b/,
    /->\s*\w+/,
    /\bpub\s+(fn|struct|enum|mod)/,
  ],
  go: [
    /\bfunc\b\s+(\(\w+\s+\*?\w+\)\s+)?\w+\s*\(/,
    /\bpackage\b\s+\w+/,
    /\bimport\s+\(/,
    /\btype\b\s+\w+\s+struct\b/,
    /\btype\b\s+\w+\s+interface\b/,
    /:=/,
  ],
  java: [
    /\bpublic\s+(static\s+)?(void|class|interface|enum)/,
    /\bprivate\s+(static\s+)?(void|class|interface|enum)/,
    /\bclass\b\s+\w+\s+(extends|implements)/,
    /\bSystem\.out\.print/,
    /\bnew\b\s+\w+\s*\(/,
  ],
  csharp: [
    /\bnamespace\b\s+\w+/,
    /\busing\s+System/,
    /\bpublic\s+class\b/,
    /\bConsole\.Write/,
    /\bvar\s+\w+\s+=/,
  ],
  cpp: [
    /#include\s*<\w+>/,
    /\bstd::\w+/,
    /\bcout\s*<</,
    /\bcin\s*>>/,
    /\bint\s+main\s*\(/,
    /\bnamespace\b\s+\w+/,
  ],
  c: [
    /#include\s*<\w+\.h>/,
    /\bprintf\s*\(/,
    /\bscanf\s*\(/,
    /\bint\s+main\s*\(/,
    /\bmalloc\s*\(/,
  ],
  ruby: [
    /\bdef\s+\w+/,
    /\bclass\b\s+\w+\s*</,
    /\bend$/m,
    /\battr_(reader|writer|accessor)/,
    /\brequire\s+['"][\w/]+['"]/,
    /\bputs\s+/,
  ],
  php: [
    /<\?php/,
    /\$\w+\s*=/,
    /\bfunction\s+\w+\s*\(/,
    /\becho\s+/,
    /\bpublic\s+function/,
  ],
  swift: [
    /\bfunc\s+\w+\s*\(/,
    /\bvar\s+\w+\s*:/,
    /\blet\s+\w+\s*:/,
    /\bclass\b\s+\w+\s*:/,
    /\bstruct\b\s+\w+/,
    /\bimport\s+Foundation/,
  ],
  kotlin: [
    /\bfun\s+\w+\s*\(/,
    /\bval\s+\w+\s*:/,
    /\bvar\s+\w+\s*:/,
    /\bclass\b\s+\w+\s*[:(]/,
    /\bdata\s+class\b/,
  ],
  html: [
    /<!DOCTYPE\s+html>/i,
    /<html/i,
    /<head>/i,
    /<body/i,
    /<div\s/i,
    /<span\s/i,
  ],
  css: [
    /\{\s*[\w-]+\s*:/,
    /@media\s+/,
    /@import\s+/,
    /\.[\w-]+\s*\{/,
    /#[\w-]+\s*\{/,
  ],
  scss: [/@mixin\b/, /@include\b/, /\$\w+\s*:/, /&\s*{/, /@extend\b/],
  json: [/^\s*\{[\s\S]*"[\w]+"\s*:/, /^\s*\[[\s\S]*\{/],
  yaml: [/^\s*[\w]+:\s*$/m, /^\s*-\s+[\w]+:/m],
  sql: [
    /\bSELECT\s+.*\s+FROM\b/i,
    /\bINSERT\s+INTO\b/i,
    /\bUPDATE\s+.*\s+SET\b/i,
    /\bDELETE\s+FROM\b/i,
    /\bCREATE\s+(TABLE|DATABASE|INDEX)\b/i,
  ],
  bash: [
    /^#!\/bin\/(bash|sh)/m,
    /\becho\s+/,
    /\bif\s+\[\s+/,
    /\bfi\b/,
    /\bfor\s+\w+\s+in\b/,
    /\bdone\b/,
  ],
  shell: [/^#!\/bin\/(bash|sh|zsh)/m, /\becho\s+/, /\bexport\s+\w+=/],
  markdown: [/^#+\s+/m, /^\*\*[\w\s]+\*\*$/m, /^\[[\w\s]+\]\(.*\)$/m, /```\w*/],
  scala: [
    /\bdef\b\s+\w+/,
    /\bval\b\s+\w+/,
    /\bclass\b\s+\w+\s*(extends|\{)/,
    /\bobject\b\s+\w+/,
  ],
  jsx: [
    /<[\w]+\s+[^>]*\{/,
    /\bReact\./,
    /\bexport\s+default\s+function\s+\w+\s*\(/,
    /\{[\w\s]+\.\w+\}/,
  ],
  tsx: [/<[\w]+\s+[^>]*\{/, /\bReact\./, /:\s*(React\.\w+|JSX\.\w+)/],
};

const LANGUAGE_ALIASES: Record<string, string> = {
  js: "javascript",
  ts: "typescript",
  py: "python",
  rb: "ruby",
  rs: "rust",
  cpp: "cpp",
  "c++": "cpp",
  cxx: "cpp",
  "c#": "csharp",
  cs: "csharp",
  sh: "shell",
  yml: "yaml",
  md: "markdown",
  shell: "bash",
  zsh: "bash",
};

export function detectLanguage(code: string): string | null {
  if (!code || code.trim().length < 10) {
    return null;
  }

  const scores: Record<string, number> = {};

  for (const [lang, patterns] of Object.entries(LANGUAGE_PATTERNS)) {
    scores[lang] = 0;
    for (const pattern of patterns) {
      if (pattern.test(code)) {
        scores[lang]++;
      }
    }
  }

  let maxScore = 0;
  let detectedLang: string | null = null;

  for (const [lang, score] of Object.entries(scores)) {
    if (score > maxScore) {
      maxScore = score;
      detectedLang = lang;
    }
  }

  if (maxScore === 0) {
    return "javascript";
  }

  const normalized = detectedLang?.toLowerCase();
  return LANGUAGE_ALIASES[normalized || ""] || detectedLang;
}
