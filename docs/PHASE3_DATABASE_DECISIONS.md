# ArcadeVerse — Phase 3 Database Decisions

Status: APPROVED DESIGN
Database: PostgreSQL
Provider: Neon
ORM: Drizzle ORM

## 1. Architecture

- PostgreSQL is the database engine.
- Neon is the managed database provider.
- Drizzle ORM is the schema and query layer.
- DATABASE_URL is provided through environment variables.
- Never commit database credentials.

## 2. Game Session Idempotency

- Every game session start request must include an idempotency key.
- The key must be non-null.
- A unique constraint prevents duplicate session creation.
- Retrying the same request must not deduct coins twice.

## 3. Game Finalization Idempotency

- Session start and session finalization are separate operations.
- Finalization must have its own idempotency protection.
- A session must only be finalized once.
- Duplicate finalization requests must not issue tickets twice.
- Finalization must verify session ownership and active status.

## 4. Financial Ledger

- Coin and ticket ledgers are append-only.
- Every ledger entry requires a unique idempotency key.
- Never edit or delete an existing financial ledger entry.
- Corrections must use compensating reverse entries.
- Wallet snapshots and ledger entries must update in one database transaction.
- Balance changes must be server-authoritative.
- Never trust client-submitted balances or reward amounts.

## 5. Wallet Integrity

- Wallet balances are cached snapshots.
- Ledger entries are the financial audit trail.
- Wallet updates must use safe concurrency control.
- Insufficient balances must reject the transaction.
- Negative balances must never be allowed.

## 6. Configuration Rollback

- Game configurations are versioned per game.
- Published configurations are immutable.
- rollbackOfId references the configuration being rolled back to.
- The reference must be a self-referencing foreign key.
- A rollback creates a new configuration version; it does not rewrite history.

## 7. Score Deduplication

- scores.clientRef remains globally unique for now.
- Score events must be validated by the server.
- A score event cannot be accepted more than once.
- Any future change to uniqueness requires a documented design review.

## 8. Migration Safety

- Do not run migrations before reviewing generated SQL.
- Do not run production migrations without explicit approval.
- Preserve existing backups and untracked files.
- Do not commit or push without explicit approval.

## 9. Pending Design Work

- Add a dedicated finalization idempotency field or equivalent mechanism.
- Define database-level constraints for non-negative wallet balances.
- Review challenge and achievement fields against the final product requirements.
- Review all foreign keys, indexes, and deletion rules.
- Update DATABASE.md to PostgreSQL + Neon + Drizzle.
