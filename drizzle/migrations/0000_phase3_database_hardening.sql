CREATE TABLE "achievements" (
	"id" text PRIMARY KEY NOT NULL,
	"slug" text NOT NULL,
	"title" text NOT NULL,
	"title_my" text NOT NULL,
	"description" text,
	"description_my" text,
	"achievement_type" text NOT NULL,
	"target_value" integer NOT NULL,
	"reward_coins" integer DEFAULT 0 NOT NULL,
	"reward_tickets" integer DEFAULT 0 NOT NULL,
	"status" text DEFAULT 'active' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "audit_logs" (
	"id" text PRIMARY KEY NOT NULL,
	"actor_user_id" text,
	"action" text NOT NULL,
	"entity_type" text NOT NULL,
	"entity_id" text,
	"before_json" jsonb,
	"after_json" jsonb,
	"ip_address" text,
	"user_agent" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "coin_ledger" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"session_id" text,
	"amount" integer NOT NULL,
	"reason" text NOT NULL,
	"idempotency_key" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "daily_challenges" (
	"id" text PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"title_my" text NOT NULL,
	"description" text,
	"description_my" text,
	"challenge_type" text NOT NULL,
	"target_value" integer NOT NULL,
	"reward_coins" integer DEFAULT 0 NOT NULL,
	"reward_tickets" integer DEFAULT 0 NOT NULL,
	"starts_at" timestamp with time zone NOT NULL,
	"ends_at" timestamp with time zone NOT NULL,
	"status" text DEFAULT 'draft' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "game_configurations" (
	"id" text PRIMARY KEY NOT NULL,
	"game_id" text NOT NULL,
	"version" integer NOT NULL,
	"state" text DEFAULT 'draft' NOT NULL,
	"rules_json" jsonb NOT NULL,
	"change_summary" text,
	"created_by_id" text,
	"approved_by_id" text,
	"rollback_of_id" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "game_sessions" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"game_id" text NOT NULL,
	"config_version_id" text NOT NULL,
	"difficulty" text NOT NULL,
	"status" text DEFAULT 'active' NOT NULL,
	"play_cost_coins" integer NOT NULL,
	"started_at" timestamp with time zone DEFAULT now() NOT NULL,
	"finished_at" timestamp with time zone,
	"duration_ms" integer,
	"final_score" integer,
	"reward_tickets" integer,
	"idempotency_key" text NOT NULL,
	"finalize_idempotency_key" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "games" (
	"id" text PRIMARY KEY NOT NULL,
	"slug" text NOT NULL,
	"name" text NOT NULL,
	"name_my" text NOT NULL,
	"short_desc" text,
	"short_desc_my" text,
	"category" text NOT NULL,
	"accent_theme" text,
	"status" text DEFAULT 'coming_soon' NOT NULL,
	"modes" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "prizes" (
	"id" text PRIMARY KEY NOT NULL,
	"slug" text NOT NULL,
	"title" text NOT NULL,
	"title_my" text NOT NULL,
	"description" text,
	"description_my" text,
	"ticket_cost" integer NOT NULL,
	"stock_quantity" integer DEFAULT 0 NOT NULL,
	"category" text NOT NULL,
	"status" text DEFAULT 'draft' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "redemption_orders" (
	"id" text PRIMARY KEY NOT NULL,
	"order_number" text NOT NULL,
	"user_id" text NOT NULL,
	"prize_id" text NOT NULL,
	"tickets_spent" integer NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL,
	"recipient_name" text,
	"recipient_phone" text,
	"shipping_address" text,
	"idempotency_key" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "scores" (
	"id" text PRIMARY KEY NOT NULL,
	"session_id" text NOT NULL,
	"user_id" text NOT NULL,
	"score" integer NOT NULL,
	"client_ref" text,
	"metadata_json" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "ticket_ledger" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"session_id" text,
	"redemption_id" text,
	"amount" integer NOT NULL,
	"reason" text NOT NULL,
	"idempotency_key" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_achievements" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"achievement_id" text NOT NULL,
	"unlocked_at" timestamp with time zone DEFAULT now() NOT NULL,
	"claimed_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "user_challenge_progress" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"challenge_id" text NOT NULL,
	"progress" integer DEFAULT 0 NOT NULL,
	"completed_at" timestamp with time zone,
	"claimed_at" timestamp with time zone,
	"claim_idempotency_key" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_preferences" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"language" text DEFAULT 'my' NOT NULL,
	"sound_enabled" boolean DEFAULT true NOT NULL,
	"reduced_motion" boolean DEFAULT false NOT NULL,
	"theme" text DEFAULT 'dark' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_wallets" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"coin_balance" integer DEFAULT 0 NOT NULL,
	"ticket_balance" integer DEFAULT 0 NOT NULL,
	"lifetime_coins_earned" integer DEFAULT 0 NOT NULL,
	"lifetime_coins_spent" integer DEFAULT 0 NOT NULL,
	"lifetime_tickets_earned" integer DEFAULT 0 NOT NULL,
	"lifetime_tickets_spent" integer DEFAULT 0 NOT NULL,
	"version" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"phone" text NOT NULL,
	"phone_verified" boolean DEFAULT false NOT NULL,
	"email" text,
	"display_name" text NOT NULL,
	"password_hash" text NOT NULL,
	"role" text DEFAULT 'user' NOT NULL,
	"status" text DEFAULT 'active' NOT NULL,
	"deleted_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_actor_user_id_users_id_fk" FOREIGN KEY ("actor_user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "coin_ledger" ADD CONSTRAINT "coin_ledger_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "coin_ledger" ADD CONSTRAINT "coin_ledger_session_id_game_sessions_id_fk" FOREIGN KEY ("session_id") REFERENCES "public"."game_sessions"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "game_configurations" ADD CONSTRAINT "game_configurations_game_id_games_id_fk" FOREIGN KEY ("game_id") REFERENCES "public"."games"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "game_configurations" ADD CONSTRAINT "game_configurations_created_by_id_users_id_fk" FOREIGN KEY ("created_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "game_configurations" ADD CONSTRAINT "game_configurations_approved_by_id_users_id_fk" FOREIGN KEY ("approved_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "game_configurations" ADD CONSTRAINT "game_config_rollback_of_fk" FOREIGN KEY ("rollback_of_id") REFERENCES "public"."game_configurations"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "game_sessions" ADD CONSTRAINT "game_sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "game_sessions" ADD CONSTRAINT "game_sessions_game_id_games_id_fk" FOREIGN KEY ("game_id") REFERENCES "public"."games"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "game_sessions" ADD CONSTRAINT "game_sessions_config_version_id_game_configurations_id_fk" FOREIGN KEY ("config_version_id") REFERENCES "public"."game_configurations"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "redemption_orders" ADD CONSTRAINT "redemption_orders_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "redemption_orders" ADD CONSTRAINT "redemption_orders_prize_id_prizes_id_fk" FOREIGN KEY ("prize_id") REFERENCES "public"."prizes"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "scores" ADD CONSTRAINT "scores_session_id_game_sessions_id_fk" FOREIGN KEY ("session_id") REFERENCES "public"."game_sessions"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "scores" ADD CONSTRAINT "scores_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ticket_ledger" ADD CONSTRAINT "ticket_ledger_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ticket_ledger" ADD CONSTRAINT "ticket_ledger_session_id_game_sessions_id_fk" FOREIGN KEY ("session_id") REFERENCES "public"."game_sessions"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ticket_ledger" ADD CONSTRAINT "ticket_ledger_redemption_id_redemption_orders_id_fk" FOREIGN KEY ("redemption_id") REFERENCES "public"."redemption_orders"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_achievements" ADD CONSTRAINT "user_achievements_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_achievements" ADD CONSTRAINT "user_achievements_achievement_id_achievements_id_fk" FOREIGN KEY ("achievement_id") REFERENCES "public"."achievements"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_challenge_progress" ADD CONSTRAINT "user_challenge_progress_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_challenge_progress" ADD CONSTRAINT "user_challenge_progress_challenge_id_daily_challenges_id_fk" FOREIGN KEY ("challenge_id") REFERENCES "public"."daily_challenges"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_preferences" ADD CONSTRAINT "user_preferences_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_wallets" ADD CONSTRAINT "user_wallets_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "achievements_slug_uq" ON "achievements" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "audit_logs_actor_created_idx" ON "audit_logs" USING btree ("actor_user_id","created_at");--> statement-breakpoint
CREATE INDEX "audit_logs_entity_idx" ON "audit_logs" USING btree ("entity_type","entity_id");--> statement-breakpoint
CREATE UNIQUE INDEX "coin_ledger_idempotency_uq" ON "coin_ledger" USING btree ("idempotency_key");--> statement-breakpoint
CREATE INDEX "coin_ledger_user_created_idx" ON "coin_ledger" USING btree ("user_id","created_at");--> statement-breakpoint
CREATE INDEX "daily_challenges_window_idx" ON "daily_challenges" USING btree ("starts_at","ends_at");--> statement-breakpoint
CREATE UNIQUE INDEX "game_config_game_version_uq" ON "game_configurations" USING btree ("game_id","version");--> statement-breakpoint
CREATE INDEX "game_config_state_idx" ON "game_configurations" USING btree ("state");--> statement-breakpoint
CREATE UNIQUE INDEX "game_sessions_idempotency_uq" ON "game_sessions" USING btree ("idempotency_key");--> statement-breakpoint
CREATE UNIQUE INDEX "game_sessions_finalize_idempotency_uq" ON "game_sessions" USING btree ("finalize_idempotency_key");--> statement-breakpoint
CREATE INDEX "game_sessions_user_started_idx" ON "game_sessions" USING btree ("user_id","started_at");--> statement-breakpoint
CREATE INDEX "game_sessions_game_status_idx" ON "game_sessions" USING btree ("game_id","status");--> statement-breakpoint
CREATE UNIQUE INDEX "games_slug_uq" ON "games" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "games_status_idx" ON "games" USING btree ("status");--> statement-breakpoint
CREATE UNIQUE INDEX "prizes_slug_uq" ON "prizes" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "prizes_status_idx" ON "prizes" USING btree ("status");--> statement-breakpoint
CREATE UNIQUE INDEX "redemption_order_number_uq" ON "redemption_orders" USING btree ("order_number");--> statement-breakpoint
CREATE UNIQUE INDEX "redemption_idempotency_uq" ON "redemption_orders" USING btree ("idempotency_key");--> statement-breakpoint
CREATE INDEX "redemption_user_created_idx" ON "redemption_orders" USING btree ("user_id","created_at");--> statement-breakpoint
CREATE INDEX "redemption_status_idx" ON "redemption_orders" USING btree ("status");--> statement-breakpoint
CREATE UNIQUE INDEX "scores_client_ref_uq" ON "scores" USING btree ("client_ref");--> statement-breakpoint
CREATE INDEX "scores_session_idx" ON "scores" USING btree ("session_id");--> statement-breakpoint
CREATE INDEX "scores_user_created_idx" ON "scores" USING btree ("user_id","created_at");--> statement-breakpoint
CREATE UNIQUE INDEX "ticket_ledger_idempotency_uq" ON "ticket_ledger" USING btree ("idempotency_key");--> statement-breakpoint
CREATE INDEX "ticket_ledger_user_created_idx" ON "ticket_ledger" USING btree ("user_id","created_at");--> statement-breakpoint
CREATE UNIQUE INDEX "user_achievement_pair_uq" ON "user_achievements" USING btree ("user_id","achievement_id");--> statement-breakpoint
CREATE UNIQUE INDEX "user_challenge_pair_uq" ON "user_challenge_progress" USING btree ("user_id","challenge_id");--> statement-breakpoint
CREATE UNIQUE INDEX "challenge_claim_idempotency_uq" ON "user_challenge_progress" USING btree ("claim_idempotency_key");--> statement-breakpoint
CREATE UNIQUE INDEX "user_preferences_user_id_uq" ON "user_preferences" USING btree ("user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "user_wallets_user_id_uq" ON "user_wallets" USING btree ("user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "users_user_id_uq" ON "users" USING btree ("user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "users_phone_uq" ON "users" USING btree ("phone");--> statement-breakpoint
CREATE UNIQUE INDEX "users_email_uq" ON "users" USING btree ("email");--> statement-breakpoint
CREATE INDEX "users_status_idx" ON "users" USING btree ("status");