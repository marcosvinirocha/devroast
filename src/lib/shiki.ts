import { createHighlighter, type Highlighter } from "shiki";

let highlighter: Highlighter | null = null;

export async function getShikiHighlighter(): Promise<Highlighter> {
  if (!highlighter) {
    highlighter = await createHighlighter({
      themes: ["vesper"],
      langs: [
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
      ],
    });
  }
  return highlighter;
}

export async function codeToHtml(
  code: string,
  lang: string = "javascript",
): Promise<string> {
  const shiki = await getShikiHighlighter();
  return shiki.codeToHtml(code, {
    lang,
    theme: "vesper",
  });
}
