# ArcadeVerse — ARCHITECTURE.md

## High-Level System Architecture

ArcadeVerse is built around a server-authoritative, mobile-first arcade simulation paradigm.

```
┌────────────────────────────────────────────────────────┐
│                   ArcadeVerse Client                   │
│   (Next.js 14 App Router + Tailwind CSS + Phaser 3)    │
└───────────────────────────┬────────────────────────────┘
                            │ HTTPS / JSON API
                            ▼
┌────────────────────────────────────────────────────────┐
│                Next.js Route Handlers                  │
│       (/api/sessions, /api/scores, /api/wallet)        │
└─────────────┬───────────────────────────┬──────────────┘
              │                           │
              ▼                           ▼
┌───────────────────────────┐ ┌──────────────────────────┐
│ Anti-Cheat Validation    │ │   Atomic Ledger Engine   │
│ - Timing bounds check     │ │ - BEGIN IMMEDIATE txs    │
│ - Target lifetime bounds  │ │ - Append-only ledgers    │
│ - ClientRef deduplication │ │ - Idempotent executions  │
└─────────────┬─────────────┘ └───────────┬──────────────┘
              │                           │
              └─────────────┬─────────────┘
                            ▼
┌────────────────────────────────────────────────────────┐
│               SQLite Engine (WAL Mode)                 │
│         prisma/dev.db (Foreign Keys = ON)              │
└────────────────────────────────────────────────────────┘
```

## Security & Verification Guarantees
1. **Zero Client Trust:** Raw scores and reward counts sent by browsers are unconditionally rejected. All calculations occur server-side based on event telemetry.
2. **Immutable Configurations:** Gameplay parameters are versioned and signed. A started game session cannot have its rules modified mid-flight.
3. **Double-Spend Prevention:** Every coin deduction and ticket claim uses an idempotency key combined with atomic SQLite immediate transactions.
4. **Bilingual Data Pipeline:** English and Myanmar strings are co-located in database entities to ensure zero runtime key lookup latency for dynamic catalog items.
