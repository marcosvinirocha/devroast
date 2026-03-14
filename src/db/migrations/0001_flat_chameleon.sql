ALTER TABLE "users" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "users" CASCADE;--> statement-breakpoint
ALTER TABLE "leaderboard" DROP CONSTRAINT "leaderboard_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "submissions" DROP CONSTRAINT "submissions_user_id_users_id_fk";
--> statement-breakpoint
DROP INDEX "idx_leaderboard_user_id";--> statement-breakpoint
DROP INDEX "idx_submissions_user_id";--> statement-breakpoint
ALTER TABLE "leaderboard" DROP COLUMN "user_id";--> statement-breakpoint
ALTER TABLE "submissions" DROP COLUMN "user_id";