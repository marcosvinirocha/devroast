import {
  index,
  integer,
  numeric,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

export const languageEnum = pgEnum("language", [
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
]);

export const roastModeEnum = pgEnum("roast_mode", [
  "brutal",
  "balanced",
  "friendly",
]);

export const submissionStatusEnum = pgEnum("submission_status", [
  "pending",
  "processing",
  "completed",
  "failed",
]);

export const submissions = pgTable(
  "submissions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    code: text("code").notNull(),
    language: languageEnum("language").notNull(),
    title: varchar("title", { length: 200 }),
    description: text("description"),
    status: submissionStatusEnum("status").default("pending").notNull(),
    score: integer("score"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    statusIdx: index("idx_submissions_status").on(table.status),
  }),
);

export const roasts = pgTable(
  "roasts",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    submissionId: uuid("submission_id")
      .references(() => submissions.id, { onDelete: "cascade" })
      .notNull(),
    content: text("content").notNull(),
    roastMode: roastModeEnum("roast_mode").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => ({
    submissionIdIdx: index("idx_roasts_submission_id").on(table.submissionId),
  }),
);

export const leaderboard = pgTable(
  "leaderboard",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    totalScore: integer("total_score").notNull().default(0),
    submissionsCount: integer("submissions_count").notNull().default(0),
    averageScore: numeric("average_score", { precision: 5, scale: 2 }),
    rank: integer("rank"),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    rankIdx: index("idx_leaderboard_rank").on(table.rank),
  }),
);

export type Submission = typeof submissions.$inferSelect;
export type NewSubmission = typeof submissions.$inferInsert;
export type Roast = typeof roasts.$inferSelect;
export type NewRoast = typeof roasts.$inferInsert;
export type LeaderboardEntry = typeof leaderboard.$inferSelect;
export type NewLeaderboardEntry = typeof leaderboard.$inferInsert;
