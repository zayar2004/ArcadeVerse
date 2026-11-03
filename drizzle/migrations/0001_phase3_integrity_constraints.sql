ALTER TABLE "achievements" ADD CONSTRAINT "achievement_target_positive" CHECK ("achievements"."target_value" > 0);--> statement-breakpoint
ALTER TABLE "achievements" ADD CONSTRAINT "achievement_rewards_nonnegative" CHECK ("achievements"."reward_coins" >= 0 AND "achievements"."reward_tickets" >= 0);--> statement-breakpoint
ALTER TABLE "daily_challenges" ADD CONSTRAINT "daily_challenge_target_positive" CHECK ("daily_challenges"."target_value" > 0);--> statement-breakpoint
ALTER TABLE "daily_challenges" ADD CONSTRAINT "daily_challenge_rewards_nonnegative" CHECK ("daily_challenges"."reward_coins" >= 0 AND "daily_challenges"."reward_tickets" >= 0);--> statement-breakpoint
ALTER TABLE "daily_challenges" ADD CONSTRAINT "daily_challenge_valid_window" CHECK ("daily_challenges"."starts_at" < "daily_challenges"."ends_at");--> statement-breakpoint
ALTER TABLE "game_configurations" ADD CONSTRAINT "game_config_version_positive" CHECK ("game_configurations"."version" > 0);--> statement-breakpoint
ALTER TABLE "game_sessions" ADD CONSTRAINT "game_sessions_play_cost_nonnegative" CHECK ("game_sessions"."play_cost_coins" >= 0);--> statement-breakpoint
ALTER TABLE "game_sessions" ADD CONSTRAINT "game_sessions_duration_nonnegative" CHECK ("game_sessions"."duration_ms" IS NULL OR "game_sessions"."duration_ms" >= 0);--> statement-breakpoint
ALTER TABLE "game_sessions" ADD CONSTRAINT "game_sessions_score_nonnegative" CHECK ("game_sessions"."final_score" IS NULL OR "game_sessions"."final_score" >= 0);--> statement-breakpoint
ALTER TABLE "game_sessions" ADD CONSTRAINT "game_sessions_reward_nonnegative" CHECK ("game_sessions"."reward_tickets" IS NULL OR "game_sessions"."reward_tickets" >= 0);--> statement-breakpoint
ALTER TABLE "prizes" ADD CONSTRAINT "prizes_ticket_cost_nonnegative" CHECK ("prizes"."ticket_cost" >= 0);--> statement-breakpoint
ALTER TABLE "prizes" ADD CONSTRAINT "prizes_stock_nonnegative" CHECK ("prizes"."stock_quantity" >= 0);--> statement-breakpoint
ALTER TABLE "redemption_orders" ADD CONSTRAINT "redemption_tickets_positive" CHECK ("redemption_orders"."tickets_spent" > 0);--> statement-breakpoint
ALTER TABLE "scores" ADD CONSTRAINT "scores_value_nonnegative" CHECK ("scores"."score" >= 0);--> statement-breakpoint
ALTER TABLE "user_challenge_progress" ADD CONSTRAINT "user_challenge_progress_nonnegative" CHECK ("user_challenge_progress"."progress" >= 0);--> statement-breakpoint
ALTER TABLE "user_wallets" ADD CONSTRAINT "wallet_coin_balance_nonnegative" CHECK ("user_wallets"."coin_balance" >= 0);--> statement-breakpoint
ALTER TABLE "user_wallets" ADD CONSTRAINT "wallet_ticket_balance_nonnegative" CHECK ("user_wallets"."ticket_balance" >= 0);--> statement-breakpoint
ALTER TABLE "user_wallets" ADD CONSTRAINT "wallet_lifetime_values_nonnegative" CHECK (
      "user_wallets"."lifetime_coins_earned" >= 0 AND
      "user_wallets"."lifetime_coins_spent" >= 0 AND
      "user_wallets"."lifetime_tickets_earned" >= 0 AND
      "user_wallets"."lifetime_tickets_spent" >= 0 AND
      "user_wallets"."version" >= 0
    );