import { asc, avg, count, eq } from "drizzle-orm";
import { z } from "zod";
import { roasts, submissions } from "@/db/schema";
import { generateRoast } from "@/lib/ai";
import { baseProcedure, createTRPCRouter } from "../trpc";

export const appRouter = createTRPCRouter({
  metrics: createTRPCRouter({
    getRoastStats: baseProcedure
      .input(
        z.object({
          status: z
            .enum(["pending", "processing", "completed", "failed"])
            .optional(),
        }),
      )
      .query(async ({ input }) => {
        const { db } = await import("@/db");

        const conditions = input.status
          ? [eq(submissions.status, input.status)]
          : [];

        const [countResult] = await db
          .select({ count: count() })
          .from(submissions)
          .where(conditions.length > 0 ? conditions[0] : undefined);

        const [avgResult] = await db
          .select({ avg: avg(submissions.score) })
          .from(submissions)
          .where(conditions.length > 0 ? conditions[0] : undefined);

        return {
          totalRoasts: countResult?.count ?? 0,
          avgScore: Number(avgResult?.avg) ?? 0,
        };
      }),
  }),
  submissions: createTRPCRouter({
    create: baseProcedure
      .input(
        z.object({
          code: z.string().min(1).max(10000),
          language: z.string().min(1),
          roastMode: z
            .enum(["brutal", "balanced", "friendly"])
            .default("balanced"),
        }),
      )
      .mutation(async ({ input }) => {
        const { db } = await import("@/db");
        const { languageEnum, submissionStatusEnum } = await import(
          "@/db/schema"
        );

        const [submission] = await db
          .insert(submissions)
          .values({
            code: input.code,
            language:
              languageEnum.enumValues.find((l) => l === input.language) ??
              "javascript",
            status: submissionStatusEnum.enumValues[0],
            score: 0,
          })
          .returning();

        try {
          const roastResult = await generateRoast(
            input.code,
            input.language,
            input.roastMode,
          );

          const { submissionStatusEnum, roastModeEnum } = await import(
            "@/db/schema"
          );

          const [updated] = await db
            .update(submissions)
            .set({
              status: submissionStatusEnum.enumValues[2],
              score: roastResult.score,
              updatedAt: new Date(),
            })
            .where(eq(submissions.id, submission.id))
            .returning();

          await db.insert(roasts).values({
            submissionId: updated.id,
            content: JSON.stringify({
              quote: roastResult.quote,
              verdict: roastResult.verdict,
              issues: roastResult.issues,
              suggestedFix: roastResult.suggestedFix,
            }),
            roastMode:
              roastModeEnum.enumValues.find((r) => r === input.roastMode) ??
              "balanced",
          });

          return { id: submission.id };
        } catch (error) {
          const { submissionStatusEnum } = await import("@/db/schema");
          await db
            .update(submissions)
            .set({
              status: submissionStatusEnum.enumValues[3],
              updatedAt: new Date(),
            })
            .where(eq(submissions.id, submission.id));

          throw error;
        }
      }),
    getById: baseProcedure
      .input(z.object({ id: z.string().uuid() }))
      .query(async ({ input }) => {
        const { db } = await import("@/db");
        const { codeToHtml } = await import("@/lib/shiki");

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
          .where(eq(submissions.id, input.id))
          .limit(1);

        if (!submission) {
          throw new Error("Submission not found");
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
      }),
  }),
  leaderboard: createTRPCRouter({
    getShameTop3: baseProcedure.query(async () => {
      const { db } = await import("@/db");
      const { codeToHtml } = await import("@/lib/shiki");

      const result = await db
        .select({
          id: submissions.id,
          code: submissions.code,
          language: submissions.language,
          score: submissions.score,
          createdAt: submissions.createdAt,
        })
        .from(submissions)
        .where(eq(submissions.status, "completed"))
        .orderBy(asc(submissions.score))
        .limit(3);

      const items = await Promise.all(
        result.map(async (item) => {
          const html = await codeToHtml(item.code, item.language);
          return {
            id: item.id,
            code: item.code,
            codeHtml: html,
            language: item.language,
            score: item.score ?? 0,
            createdAt: item.createdAt.toISOString(),
          };
        }),
      );

      return items;
    }),
    getAll: baseProcedure
      .input(
        z.object({
          limit: z.number().min(1).max(100).default(20),
        }),
      )
      .query(async ({ input }) => {
        const { db } = await import("@/db");
        const { codeToHtml } = await import("@/lib/shiki");

        const result = await db
          .select({
            id: submissions.id,
            code: submissions.code,
            language: submissions.language,
            score: submissions.score,
            createdAt: submissions.createdAt,
          })
          .from(submissions)
          .where(eq(submissions.status, "completed"))
          .orderBy(asc(submissions.score))
          .limit(input.limit);

        const items = await Promise.all(
          result.map(async (item, idx) => {
            const html = await codeToHtml(item.code, item.language);
            return {
              id: item.id,
              rank: idx + 1,
              code: item.code,
              codeHtml: html,
              language: item.language,
              score: item.score ?? 0,
              createdAt: item.createdAt.toISOString(),
            };
          }),
        );

        return items;
      }),
  }),
});

export type AppRouter = typeof appRouter;
