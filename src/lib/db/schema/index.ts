import { sql } from "drizzle-orm";
import {
  pgTable,
  text,
  integer,
  boolean,
  timestamp,
  jsonb,
  index,
  uniqueIndex,
  foreignKey,
  check,
} from "drizzle-orm/pg-core";

// Shared timestamp convention: store timezone-aware timestamps in UTC.

const createdAt = () =>
  timestamp("created_at", { withTimezone: true }).notNull().defaultNow();

const updatedAt = () =>
  timestamp("updated_at", { withTimezone: true }).notNull().defaultNow();

// 1. USERS
export const users = pgTable(
  "users",
  {
    id: text("id").primaryKey(),
    userId: text("user_id").notNull(),
    phone: text("phone").notNull(),
    phoneVerified: boolean("phone_verified").notNull().default(false),
    email: text("email"),
    displayName: text("display_name").notNull(),
    passwordHash: text("password_hash").notNull(),
    role: text("role").notNull().default("user"),
    status: text("status").notNull().default("active"),
    deletedAt: timestamp("deleted_at", { withTimezone: true }),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  (table) => [
    uniqueIndex("users_user_id_uq").on(table.userId),
    uniqueIndex("users_phone_uq").on(table.phone),
    uniqueIndex("users_email_uq").on(table.email),
    index("users_status_idx").on(table.status),
  ],
);

// 2. USER PREFERENCES
export const userPreferences = pgTable(
  "user_preferences",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    language: text("language").notNull().default("my"),
    soundEnabled: boolean("sound_enabled").notNull().default(true),
    reducedMotion: boolean("reduced_motion").notNull().default(false),
    theme: text("theme").notNull().default("dark"),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  (table) => [uniqueIndex("user_preferences_user_id_uq").on(table.userId)],
);

// 3. USER WALLETS
export const userWallets = pgTable(
  "user_wallets",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "restrict" }),
    coinBalance: integer("coin_balance").notNull().default(0),
    freeCoinBalance: integer("free_coin_balance").notNull().default(0),
    purchasedCoinBalance: integer("purchased_coin_balance").notNull().default(0),
    promotionalCoinBalance: integer("promotional_coin_balance").notNull().default(0),
    ticketBalance: integer("ticket_balance").notNull().default(0),
    lifetimeCoinsEarned: integer("lifetime_coins_earned").notNull().default(0),
    lifetimeCoinsSpent: integer("lifetime_coins_spent").notNull().default(0),
    lifetimeTicketsEarned: integer("lifetime_tickets_earned")
      .notNull()
      .default(0),
    lifetimeTicketsSpent: integer("lifetime_tickets_spent")
      .notNull()
      .default(0),
    version: integer("version").notNull().default(0),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  (table) => [
    uniqueIndex("user_wallets_user_id_uq").on(table.userId),
    check("wallet_coin_balance_nonnegative", sql`${table.coinBalance} >= 0`),
    check(
      "wallet_coin_buckets_nonnegative",
      sql`${table.freeCoinBalance} >= 0 AND ${table.purchasedCoinBalance} >= 0 AND ${table.promotionalCoinBalance} >= 0`,
    ),
    check(
      "wallet_coin_total_matches_buckets",
      sql`${table.coinBalance} = ${table.freeCoinBalance} + ${table.purchasedCoinBalance} + ${table.promotionalCoinBalance}`,
    ),
    check(
      "wallet_ticket_balance_nonnegative",
      sql`${table.ticketBalance} >= 0`,
    ),
    check(
      "wallet_lifetime_values_nonnegative",
      sql`
      ${table.lifetimeCoinsEarned} >= 0 AND
      ${table.lifetimeCoinsSpent} >= 0 AND
      ${table.lifetimeTicketsEarned} >= 0 AND
      ${table.lifetimeTicketsSpent} >= 0 AND
      ${table.version} >= 0
    `,
    ),
  ],
);

// 4. GAMES
export const games = pgTable(
  "games",
  {
    id: text("id").primaryKey(),
    slug: text("slug").notNull(),
    name: text("name").notNull(),
    nameMy: text("name_my").notNull(),
    shortDesc: text("short_desc"),
    shortDescMy: text("short_desc_my"),
    category: text("category").notNull(),
    accentTheme: text("accent_theme"),
    status: text("status").notNull().default("coming_soon"),
    modes: jsonb("modes").$type<string[]>().notNull().default([]),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  (table) => [
    uniqueIndex("games_slug_uq").on(table.slug),
    index("games_status_idx").on(table.status),
  ],
);

// 5. GAME CONFIGURATIONS
export const gameConfigurations = pgTable(
  "game_configurations",
  {
    id: text("id").primaryKey(),
    gameId: text("game_id")
      .notNull()
      .references(() => games.id, { onDelete: "restrict" }),
    version: integer("version").notNull(),
    state: text("state").notNull().default("draft"),
    rulesJson: jsonb("rules_json").notNull(),
    changeSummary: text("change_summary"),
    createdById: text("created_by_id").references(() => users.id, {
      onDelete: "set null",
    }),
    approvedById: text("approved_by_id").references(() => users.id, {
      onDelete: "set null",
    }),
    rollbackOfId: text("rollback_of_id"),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  (table) => [
    uniqueIndex("game_config_game_version_uq").on(table.gameId, table.version),
    index("game_config_state_idx").on(table.state),
    check("game_config_version_positive", sql`${table.version} > 0`),
    foreignKey({
      columns: [table.rollbackOfId],
      foreignColumns: [table.id],
      name: "game_config_rollback_of_fk",
    }).onDelete("restrict"),
  ],
);

// 6. GAME SESSIONS
export const gameSessions = pgTable(
  "game_sessions",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "restrict" }),
    gameId: text("game_id")
      .notNull()
      .references(() => games.id, { onDelete: "restrict" }),
    configVersionId: text("config_version_id")
      .notNull()
      .references(() => gameConfigurations.id, { onDelete: "restrict" }),
    difficulty: text("difficulty").notNull(),
    status: text("status").notNull().default("active"),
    playCostCoins: integer("play_cost_coins").notNull(),
    startedAt: timestamp("started_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    finishedAt: timestamp("finished_at", { withTimezone: true }),
    durationMs: integer("duration_ms"),
    finalScore: integer("final_score"),
    rewardTickets: integer("reward_tickets"),
    idempotencyKey: text("idempotency_key").notNull(),
    finalizeIdempotencyKey: text("finalize_idempotency_key"),
    createdAt: createdAt(),
  },
  (table) => [
    uniqueIndex("game_sessions_idempotency_uq").on(table.idempotencyKey),
    uniqueIndex("game_sessions_finalize_idempotency_uq").on(
      table.finalizeIdempotencyKey,
    ),
    index("game_sessions_user_started_idx").on(table.userId, table.startedAt),
    index("game_sessions_game_status_idx").on(table.gameId, table.status),
    check(
      "game_sessions_play_cost_nonnegative",
      sql`${table.playCostCoins} >= 0`,
    ),
    check(
      "game_sessions_duration_nonnegative",
      sql`${table.durationMs} IS NULL OR ${table.durationMs} >= 0`,
    ),
    check(
      "game_sessions_score_nonnegative",
      sql`${table.finalScore} IS NULL OR ${table.finalScore} >= 0`,
    ),
    check(
      "game_sessions_reward_nonnegative",
      sql`${table.rewardTickets} IS NULL OR ${table.rewardTickets} >= 0`,
    ),
  ],
);

// 7. COIN LEDGER
export const coinLedger = pgTable(
  "coin_ledger",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "restrict" }),
    sessionId: text("session_id").references(() => gameSessions.id, {
      onDelete: "restrict",
    }),
    amount: integer("amount").notNull(),
    coinType: text("coin_type").notNull().default("free"),
    reason: text("reason").notNull(),
    idempotencyKey: text("idempotency_key").notNull(),
    createdAt: createdAt(),
  },
  (table) => [
    check(
      "coin_ledger_coin_type_valid",
      sql`${table.coinType} IN ('free', 'purchased', 'promotional')`,
    ),
    uniqueIndex("coin_ledger_idempotency_uq").on(table.idempotencyKey),
    index("coin_ledger_user_created_idx").on(table.userId, table.createdAt),
  ],
);

// 8. SCORES
export const scores = pgTable(
  "scores",
  {
    id: text("id").primaryKey(),
    sessionId: text("session_id")
      .notNull()
      .references(() => gameSessions.id, { onDelete: "restrict" }),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "restrict" }),
    score: integer("score").notNull(),
    clientRef: text("client_ref"),
    metadataJson: jsonb("metadata_json"),
    createdAt: createdAt(),
  },
  (table) => [
    uniqueIndex("scores_client_ref_uq").on(table.clientRef),
    index("scores_session_idx").on(table.sessionId),
    index("scores_user_created_idx").on(table.userId, table.createdAt),
    check("scores_value_nonnegative", sql`${table.score} >= 0`),
  ],
);

// 9. PRIZES
export const prizes = pgTable(
  "prizes",
  {
    id: text("id").primaryKey(),
    slug: text("slug").notNull(),
    title: text("title").notNull(),
    titleMy: text("title_my").notNull(),
    description: text("description"),
    descriptionMy: text("description_my"),
    ticketCost: integer("ticket_cost").notNull(),
    stockQuantity: integer("stock_quantity").notNull().default(0),
    category: text("category").notNull(),
    status: text("status").notNull().default("draft"),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  (table) => [
    uniqueIndex("prizes_slug_uq").on(table.slug),
    index("prizes_status_idx").on(table.status),
    check("prizes_ticket_cost_nonnegative", sql`${table.ticketCost} >= 0`),
    check("prizes_stock_nonnegative", sql`${table.stockQuantity} >= 0`),
  ],
);

// 10. REDEMPTION ORDERS
export const redemptionOrders = pgTable(
  "redemption_orders",
  {
    id: text("id").primaryKey(),
    orderNumber: text("order_number").notNull(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "restrict" }),
    prizeId: text("prize_id")
      .notNull()
      .references(() => prizes.id, { onDelete: "restrict" }),
    ticketsSpent: integer("tickets_spent").notNull(),
    status: text("status").notNull().default("pending"),
    recipientName: text("recipient_name"),
    recipientPhone: text("recipient_phone"),
    shippingAddress: text("shipping_address"),
    idempotencyKey: text("idempotency_key").notNull(),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  (table) => [
    uniqueIndex("redemption_order_number_uq").on(table.orderNumber),
    uniqueIndex("redemption_idempotency_uq").on(table.idempotencyKey),
    index("redemption_user_created_idx").on(table.userId, table.createdAt),
    index("redemption_status_idx").on(table.status),
    check("redemption_tickets_positive", sql`${table.ticketsSpent} > 0`),
  ],
);

// 11. TICKET LEDGER
export const ticketLedger = pgTable(
  "ticket_ledger",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "restrict" }),
    sessionId: text("session_id").references(() => gameSessions.id, {
      onDelete: "restrict",
    }),
    redemptionId: text("redemption_id").references(() => redemptionOrders.id, {
      onDelete: "restrict",
    }),
    amount: integer("amount").notNull(),
    reason: text("reason").notNull(),
    idempotencyKey: text("idempotency_key").notNull(),
    createdAt: createdAt(),
  },
  (table) => [
    uniqueIndex("ticket_ledger_idempotency_uq").on(table.idempotencyKey),
    index("ticket_ledger_user_created_idx").on(table.userId, table.createdAt),
  ],
);

// 12. DAILY CHALLENGES
export const dailyChallenges = pgTable(
  "daily_challenges",
  {
    id: text("id").primaryKey(),
    title: text("title").notNull(),
    titleMy: text("title_my").notNull(),
    description: text("description"),
    descriptionMy: text("description_my"),
    challengeType: text("challenge_type").notNull(),
    targetValue: integer("target_value").notNull(),
    rewardCoins: integer("reward_coins").notNull().default(0),
    rewardTickets: integer("reward_tickets").notNull().default(0),
    startsAt: timestamp("starts_at", { withTimezone: true }).notNull(),
    endsAt: timestamp("ends_at", { withTimezone: true }).notNull(),
    status: text("status").notNull().default("draft"),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  (table) => [
    index("daily_challenges_window_idx").on(table.startsAt, table.endsAt),
    check("daily_challenge_target_positive", sql`${table.targetValue} > 0`),
    check(
      "daily_challenge_rewards_nonnegative",
      sql`${table.rewardCoins} >= 0 AND ${table.rewardTickets} >= 0`,
    ),
    check(
      "daily_challenge_valid_window",
      sql`${table.startsAt} < ${table.endsAt}`,
    ),
  ],
);

// 13. USER CHALLENGE PROGRESS
export const userChallengeProgress = pgTable(
  "user_challenge_progress",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "restrict" }),
    challengeId: text("challenge_id")
      .notNull()
      .references(() => dailyChallenges.id, { onDelete: "restrict" }),
    progress: integer("progress").notNull().default(0),
    completedAt: timestamp("completed_at", { withTimezone: true }),
    claimedAt: timestamp("claimed_at", { withTimezone: true }),
    claimIdempotencyKey: text("claim_idempotency_key"),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  (table) => [
    uniqueIndex("user_challenge_pair_uq").on(table.userId, table.challengeId),
    uniqueIndex("challenge_claim_idempotency_uq").on(table.claimIdempotencyKey),
    check("user_challenge_progress_nonnegative", sql`${table.progress} >= 0`),
  ],
);

// 14. ACHIEVEMENTS
export const achievements = pgTable(
  "achievements",
  {
    id: text("id").primaryKey(),
    slug: text("slug").notNull(),
    title: text("title").notNull(),
    titleMy: text("title_my").notNull(),
    description: text("description"),
    descriptionMy: text("description_my"),
    achievementType: text("achievement_type").notNull(),
    targetValue: integer("target_value").notNull(),
    rewardCoins: integer("reward_coins").notNull().default(0),
    rewardTickets: integer("reward_tickets").notNull().default(0),
    status: text("status").notNull().default("active"),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  (table) => [
    uniqueIndex("achievements_slug_uq").on(table.slug),
    check("achievement_target_positive", sql`${table.targetValue} > 0`),
    check(
      "achievement_rewards_nonnegative",
      sql`${table.rewardCoins} >= 0 AND ${table.rewardTickets} >= 0`,
    ),
  ],
);

// 15. USER ACHIEVEMENTS
export const userAchievements = pgTable(
  "user_achievements",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "restrict" }),
    achievementId: text("achievement_id")
      .notNull()
      .references(() => achievements.id, { onDelete: "restrict" }),
    unlockedAt: timestamp("unlocked_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    claimedAt: timestamp("claimed_at", { withTimezone: true }),
  },
  (table) => [
    uniqueIndex("user_achievement_pair_uq").on(
      table.userId,
      table.achievementId,
    ),
  ],
);

// 16. AUDIT LOGS
export const auditLogs = pgTable(
  "audit_logs",
  {
    id: text("id").primaryKey(),
    actorUserId: text("actor_user_id").references(() => users.id, {
      onDelete: "set null",
    }),
    action: text("action").notNull(),
    entityType: text("entity_type").notNull(),
    entityId: text("entity_id"),
    beforeJson: jsonb("before_json"),
    afterJson: jsonb("after_json"),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    createdAt: createdAt(),
  },
  (table) => [
    index("audit_logs_actor_created_idx").on(
      table.actorUserId,
      table.createdAt,
    ),
    index("audit_logs_entity_idx").on(table.entityType, table.entityId),
  ],
);

// Export all tables through this schema module.

// 17. AUTH SESSIONS
export const authSessions = pgTable(
  "auth_sessions",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    tokenHash: text("token_hash").notNull(),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    lastSeenAt: timestamp("last_seen_at", { withTimezone: true }),
    revokedAt: timestamp("revoked_at", { withTimezone: true }),
    createdAt: createdAt(),
  },
  (table) => [
    uniqueIndex("auth_sessions_token_hash_uq").on(table.tokenHash),
    index("auth_sessions_user_idx").on(table.userId),
    index("auth_sessions_expiry_idx").on(table.expiresAt),
  ],
);

// 18. AUTH RATE LIMITS
export const authRateLimits = pgTable(
  "auth_rate_limits",
  {
    keyHash: text("key_hash").primaryKey(),
    attempts: integer("attempts").notNull().default(0),
    windowStartedAt: timestamp("window_started_at", {
      withTimezone: true,
    }).notNull(),
    blockedUntil: timestamp("blocked_until", {
      withTimezone: true,
    }),
    updatedAt: updatedAt(),
  },
  (table) => [
    check("auth_rate_limits_attempts_nonnegative", sql`${table.attempts} >= 0`),
    index("auth_rate_limits_blocked_idx").on(table.blockedUntil),
  ],
);
