import { asc, avg, count, eq } from "drizzle-orm";
import { z } from "zod";
import { submissions } from "@/db/schema";
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
  leaderboard: createTRPCRouter({
    getShameTop3: baseProcedure.query(async () => {
      const { db } = await import("@/db");

      const result = await db
        .select({
          id: submissions.id,
          code: submissions.code,
          language: submissions.language,
          score: submissions.score,
        })
        .from(submissions)
        .where(eq(submissions.status, "completed"))
        .orderBy(asc(submissions.score))
        .limit(3);

      return result;
    }),
  }),
});

export type AppRouter = typeof appRouter;
