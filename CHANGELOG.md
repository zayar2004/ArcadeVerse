# ArcadeVerse — CHANGELOG.md

All notable changes to the ArcadeVerse project will be documented in this file.
The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

---

## [0.3.2] - 2026-11-02
### Added
- **`drizzle.config.ts`** (project root): Drizzle Kit configuration file.
  - Dialect: `postgresql`.
  - Schema source: `src/lib/db/schema/index.ts` (Phase 3.2 Step 3).
  - Migration output: `drizzle/migrations/` (Phase 3.2 Step 4).
  - Connection: `DATABASE_URL` env var — no credentials committed.
- **ADR-007** (`DECISIONS.md`): PostgreSQL + Neon Serverless + Drizzle ORM — supersedes ADR-001 (SQLite WAL). Rationale: zero native binaries on Termux ARM64, HTTP-based Neon driver, serverless-compatible.

### Changed
- **`PROJECT_STATE.md`**: Updated current phase to 3.2 IN PROGRESS; updated environment table (PostgreSQL + Drizzle); updated milestone matrix; added Phase 3.2 step log.
- **`DECISIONS.md`**: ADR-001 marked superseded by ADR-007.

### Dependencies (Phase 3.2 Step 1 — recorded here for completeness)
- Added production: `drizzle-orm@0.45.4`, `@neondatabase/serverless@1.2.0`.
- Added dev: `drizzle-kit@0.31.11`.

---

## [0.3.1] - 2026-11-02
### Added
- **Locked Specification Copied:** Synced `ARCADEVERSE_GAME_SYSTEM_LOCK.md` into repository root.
- **Database Architecture Specification (`DATABASE.md`):** Complete design covering 7 core domains, Mermaid ER diagram, transaction isolation patterns, and SQLite WAL pragmas.
- **Prisma Schema (`prisma/schema.prisma`):**
  - **Identity & Preferences:** `User`, `UserPreference` with Myanmar/English locale support.
  - **Dual-Currency Ledger & Wallet:** `CoinLedger`, `TicketLedger` (append-only with unique `idempotencyKey`), and `UserWallet` (O(1) read snapshot).
  - **Game Configuration Studio:** `Game`, `GameConfiguration` (monotonically increasing versions with strict state machine).
  - **Game Sessions & Validation:** `GameSession` (pinned config version, server-validated score/reward), `Score` (anti-cheat event log).
  - **Prize Redemption Pre-Architecture:** `Prize`, `RedemptionOrder` (Phase 4 ready).
  - **Gamification & Quotas:** `DailyChallenge`, `UserChallengeProgress`, `Achievement`, `UserAchievement`.
  - **Compliance & Audit:** `AuditLog` (immutable trail of admin actions), `SiteContent` (dynamic banners/maintenance flags).
- **Architecture Decision Records (`DECISIONS.md`):** ADR-001 through ADR-006 covering SQLite WAL, dual-currency ledger, config version pinning, anti-cheat, prize pre-modeling, and bilingual support.
- **Project State Tracking (`PROJECT_STATE.md`):** Updated milestone matrix and entry/exit criteria for Phase 3.1.

### Verified
- Next.js 14.2.35 production build passes cleanly (`npm run build` exits 0 with WebAssembly SWC on Termux ARM64).
- Prisma 5 schema syntax validated.

---

## [0.2.0] - 2026-11-02
### Added
- Phase 2 User Web Foundation (`1efd170`).
- Mobile-first dark cyber-arcade UI with Tailwind CSS.
- Bilingual localization engine (`src/lib/i18n.ts`) for Myanmar (`my`) and English (`en`).
- Bottom navigation (Home, Games, Wallet, Prizes, Profile).
- Simulated balance cards for Demo Coins and Demo Tickets.
- Featured game cards for upcoming titles.

---

## [0.1.0] - 2026-11-02
### Added
- Repository initialization and `.gitignore` (`fd41fdc`).
- Base Next.js 14 App Router project setup with TypeScript.
