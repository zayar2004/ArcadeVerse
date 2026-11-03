# ArcadeVerse — TESTING.md

## Testing Strategy & Acceptance Criteria

### 1. Database Architecture & Integrity Tests (Phase 3)
- **Referential Integrity:** Ensure cascading deletes on user profile cleanup do not orphan ledger entries; session foreign keys enforce referential validity.
- **Idempotency Enforcement:** Attempting to insert duplicate `idempotencyKey` values in `CoinLedger` or `TicketLedger` must fail with unique constraint violations.
- **Transaction Atomicity:** Emulate concurrent session finalizations to verify that only one ticket reward is minted, and no negative balance states are created.
- **Configuration Immutability:** Attempting to update a `GameConfiguration` in `published` state must be rejected by the validation layer.
- **Version Pinning:** Modifying an active configuration draft or publishing a new configuration must not affect existing `GameSession` records.

### 2. Runtime & Concurrency Tests
- **SQLite WAL Mode Test:** Verify concurrent reads do not block active ledger writes.
- **Busy Timeout Verification:** Ensure simulated high write loads do not throw `SQLITE_BUSY` errors under 5,000ms threshold.
- **Balance Snapshot Reconciliation:** Automated test asserting that `UserWallet.coinBalance === SUM(coin_ledger.amount)` and `UserWallet.ticketBalance === SUM(ticket_ledger.amount)`.
