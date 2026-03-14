"server-only";

import { eq } from "drizzle-orm";
import { db } from "@/db";
import { roasts, submissions } from "@/db/schema";
import { codeToHtml } from "@/lib/shiki";

export async function getRoastById(id: string) {
  const [submission] = await db
    .select({
      id: submissions.id,
      code: submissions.code,
      language: submissions.language,
      score: submissions.score,
      status: submissions.status,
      createdAt: submissions.createdAt,
    })
    .from(submissions)
    .where(eq(submissions.id, id))
    .limit(1);

  if (!submission) {
    return null;
  }

  const [roast] = await db
    .select({
      id: roasts.id,
      content: roasts.content,
      roastMode: roasts.roastMode,
      createdAt: roasts.createdAt,
    })
    .from(roasts)
    .where(eq(roasts.submissionId, submission.id))
    .limit(1);

  const codeHtml = await codeToHtml(submission.code, submission.language);

  let roastData = null;
  if (roast) {
    try {
      roastData = JSON.parse(roast.content);
    } catch {
      roastData = { quote: roast.content, issues: [], suggestedFix: "" };
    }
  }

  return {
    id: submission.id,
    code: submission.code,
    codeHtml,
    language: submission.language,
    score: submission.score ?? 0,
    status: submission.status,
    createdAt: submission.createdAt.toISOString(),
    roast: roastData
      ? {
          id: roast.id,
          quote: roastData.quote || "",
          verdict: roastData.verdict || "",
          issues: roastData.issues || [],
          suggestedFix: roastData.suggestedFix || "",
          roastMode: roast.roastMode,
          createdAt: roast.createdAt.toISOString(),
        }
      : null,
  };
}
