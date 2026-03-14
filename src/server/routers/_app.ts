import { avg, count, eq } from "drizzle-orm";
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
});

export type AppRouter = typeof appRouter;
