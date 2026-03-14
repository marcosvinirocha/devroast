CREATE TYPE "public"."language" AS ENUM('javascript', 'typescript', 'jsx', 'tsx', 'python', 'rust', 'go', 'java', 'c', 'cpp', 'csharp', 'ruby', 'php', 'swift', 'kotlin', 'scala', 'html', 'css', 'scss', 'json', 'yaml', 'markdown', 'bash', 'shell', 'sql');--> statement-breakpoint
CREATE TYPE "public"."roast_mode" AS ENUM('brutal', 'balanced', 'friendly');--> statement-breakpoint
CREATE TYPE "public"."submission_status" AS ENUM('pending', 'processing', 'completed', 'failed');--> statement-breakpoint
CREATE TABLE "leaderboard" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"total_score" integer DEFAULT 0 NOT NULL,
	"submissions_count" integer DEFAULT 0 NOT NULL,
	"average_score" numeric(5, 2),
	"rank" integer,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "roasts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"submission_id" uuid NOT NULL,
	"content" text NOT NULL,
	"roast_mode" "roast_mode" NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "submissions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"code" text NOT NULL,
	"language" "language" NOT NULL,
	"title" varchar(200),
	"description" text,
	"status" "submission_status" DEFAULT 'pending' NOT NULL,
	"score" integer,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"username" varchar(50) NOT NULL,
	"email" varchar(255) NOT NULL,
	"avatar_url" varchar(500),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_username_unique" UNIQUE("username"),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "leaderboard" ADD CONSTRAINT "leaderboard_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "roasts" ADD CONSTRAINT "roasts_submission_id_submissions_id_fk" FOREIGN KEY ("submission_id") REFERENCES "public"."submissions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "submissions" ADD CONSTRAINT "submissions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_leaderboard_user_id" ON "leaderboard" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_leaderboard_rank" ON "leaderboard" USING btree ("rank");--> statement-breakpoint
CREATE INDEX "idx_roasts_submission_id" ON "roasts" USING btree ("submission_id");--> statement-breakpoint
CREATE INDEX "idx_submissions_user_id" ON "submissions" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_submissions_status" ON "submissions" USING btree ("status");--> statement-breakpoint
CREATE INDEX "idx_users_username" ON "users" USING btree ("username");--> statement-breakpoint
CREATE INDEX "idx_users_email" ON "users" USING btree ("email");