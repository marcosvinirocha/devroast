"server-only";

export interface RoastIssue {
  title: string;
  description: string;
  severity: "critical" | "warning" | "info";
}

export interface RoastResponse {
  score: number;
  quote: string;
  verdict: string;
  issues: RoastIssue[];
  suggestedFix: string;
}

interface OpenRouterMessage {
  role: "system" | "user";
  content: string;
}

interface OpenRouterChoice {
  message: {
    content: string;
  };
}

interface OpenRouterResponse {
  choices: OpenRouterChoice[];
}

function buildPrompt(code: string, language: string, mode: string): string {
  const modeInstructions = {
    brutal:
      "Sea muito crítico, sarcástico e implacável. Use tons de humor negro. Nossos usuários querem o roast mais brutal possível.",
    balanced:
      "Sea construtivo mas direto. Balance humor com críticas úteis. O objetivo é ajudar mas com algum tempero.",
    friendly:
      "Sea gentil e encorajador. Foque em feedback positivo primeiro, depois pequenas sugestões. Use humor leve.",
  };

  return `You are a code reviewer AI. Analyze the following code and provide a roast.

Language: ${language}
Roast Mode: ${mode}
${modeInstructions[mode as keyof typeof modeInstructions]}

Code to review:
\`\`\`${language}
${code}
\`\`\`

Respond with a JSON object only, no other text. Use this exact structure:
{
  "score": number (0-10, where 0 is worst and 10 is best),
  "quote": "A short sarcastic/funny one-liner about the code (max 100 chars)",
  "verdict": "A short label for the score like 'needs_help', 'critical', 'okay', 'decent', 'good'",
  "issues": [
    {
      "title": "Short issue title",
      "description": "Brief description of the problem",
      "severity": "critical" | "warning" | "info"
    }
  ],
  "suggestedFix": "A better version of the code, rewritten with improvements"
}

Respond ONLY with valid JSON, no markdown, no explanation.`;
}

export async function generateRoast(
  code: string,
  language: string,
  mode: string,
): Promise<RoastResponse> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  const apiUrl =
    process.env.OPENROUTER_API_URL ||
    "https://openrouter.ai/api/v1/chat/completions";

  if (!apiKey) {
    throw new Error("OPENROUTER_API_KEY is not configured");
  }

  const prompt = buildPrompt(code, language, mode);

  const messages: OpenRouterMessage[] = [
    {
      role: "system",
      content:
        "You are a code reviewer that provides sarcastic and humorous feedback. Always respond with valid JSON.",
    },
    {
      role: "user",
      content: prompt,
    },
  ];

  const response = await fetch(apiUrl, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "HTTP-Referer": "https://devroast.dev",
      "X-Title": "DevRoast",
    },
    body: JSON.stringify({
      model: "z-ai/glm-4.5-air:free",
      messages,
      temperature: 0.7,
      max_tokens: 2000,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`OpenRouter API error: ${response.status} - ${errorText}`);
  }

  const data: OpenRouterResponse = await response.json();

  const content = data.choices[0]?.message?.content;

  if (!content) {
    throw new Error("No response content from OpenRouter");
  }

  try {
    const cleanedContent = content
      .replace(/```json\n?/g, "")
      .replace(/```\n?$/g, "")
      .trim();
    const parsed = JSON.parse(cleanedContent) as RoastResponse;

    return {
      score: Math.max(
        0,
        Math.min(10, typeof parsed.score === "number" ? parsed.score : 5),
      ),
      quote: String(parsed.quote || "Code needs improvement").slice(0, 100),
      verdict: String(parsed.verdict || "needs_review")
        .toLowerCase()
        .replace(/\s+/g, "_"),
      issues: Array.isArray(parsed.issues)
        ? parsed.issues.map((i) => ({
            title: String(i.title || "Issue found"),
            description: String(i.description || ""),
            severity: ["critical", "warning", "info"].includes(i.severity)
              ? i.severity
              : "warning",
          }))
        : [],
      suggestedFix: String(parsed.suggestedFix || ""),
    };
  } catch (parseError) {
    console.error("Failed to parse AI response:", content);
    throw new Error("Failed to parse AI response");
  }
}
