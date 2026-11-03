-- ArcadeVerse Wallet: separate Free, Purchased and Promotional Coins.
-- Preserve all existing aggregate balances as Free Coins.

ALTER TABLE "user_wallets"
  ADD COLUMN "free_coin_balance" integer NOT NULL DEFAULT 0;

ALTER TABLE "user_wallets"
  ADD COLUMN "purchased_coin_balance" integer NOT NULL DEFAULT 0;

ALTER TABLE "user_wallets"
  ADD COLUMN "promotional_coin_balance" integer NOT NULL DEFAULT 0;

-- Backfill existing balances without changing the total.
UPDATE "user_wallets"
SET
  "free_coin_balance" = "coin_balance",
  "purchased_coin_balance" = 0,
  "promotional_coin_balance" = 0;

ALTER TABLE "coin_ledger"
  ADD COLUMN "coin_type" text NOT NULL DEFAULT 'free';

ALTER TABLE "user_wallets"
  ADD CONSTRAINT "wallet_coin_buckets_nonnegative"
  CHECK (
    "free_coin_balance" >= 0
    AND "purchased_coin_balance" >= 0
    AND "promotional_coin_balance" >= 0
  );

ALTER TABLE "user_wallets"
  ADD CONSTRAINT "wallet_coin_total_matches_buckets"
  CHECK (
    "coin_balance" =
    "free_coin_balance" +
    "purchased_coin_balance" +
    "promotional_coin_balance"
  );

ALTER TABLE "coin_ledger"
  ADD CONSTRAINT "coin_ledger_coin_type_valid"
  CHECK ("coin_type" IN ('free', 'purchased', 'promotional'));
