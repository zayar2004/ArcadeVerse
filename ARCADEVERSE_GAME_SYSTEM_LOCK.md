# ARCADEVERSE GAME SYSTEM LOCK
Version: 1.0
Status: LOCKED
Platform: Next.js 14 + TypeScript + Phaser 3
Database: SQLite + Prisma
Backend: Next.js Route Handlers

## 1. GLOBAL RULES

Build real, playable arcade simulation games.
Never substitute a static mockup for gameplay.

Implement one game at a time.
Game 01 must pass its acceptance tests before Game 02 begins.

Every game must support:
- Easy
- Hard
- Very Hard
- Very Very Hard
- Custom Mode
- Common Settings
- Game-specific Settings
- Server-validated game sessions
- Server-validated score and rewards
- Configuration versioning
- Draft, Validate, Test, Approval, Publish and Rollback
  according to the configured permission policy
- Audit logs
- Mobile-responsive controls
- Loading, playing, paused where supported, and game-over states

Changing difficulty must change actual gameplay.
A label change alone is a failure.

Reward settings are separate from difficulty.
Harder difficulty does not automatically grant more rewards.

A session retains the configuration version selected at its start.
New published configurations apply to new sessions.
Never silently alter an active session's rules.

Use safe parameter limits.
Reject invalid settings on the server.
Do not trust client-submitted scores or reward amounts.
Prevent duplicate coin deductions and duplicate reward claims.
Use database transactions and unique references where appropriate.

Use the shared ArcadeVerse Design System:
Navy #101B3C
Primary Blue #2563EB
Dark Blue #1D4ED8
Arcade Purple #7C3AED
Coin Gold #F59E0B
Ticket Green #16A34A
Background #F8FAFC
Text #0F172A
Secondary Text #64748B
Border #E2E8F0
Danger #EF4444

Do not randomly redesign the game's shared UI.
Do not change the technology stack without approval.
Do not claim tests passed unless they were actually run.

## 2. GAME 01 — WHACK-A-MOLE

Gameplay:
- Show a grid of mole holes.
- Targets appear at valid positions.
- Player taps a visible target to score.
- Targets disappear according to configured lifetime.
- Track hits, misses, score and remaining time.
- Prevent one target from being scored more than once.
- Handle simultaneous taps safely.
- Display start screen, countdown, gameplay and result screen.
- Support replay without reusing an old session.
- Pause behavior must be explicitly defined and tested.
- Timer must not be extendable by repeatedly pausing or refreshing.

Common Settings:
- Game enabled/disabled
- Public/Private access
- Play cost
- Round duration
- Difficulty preset
- Custom configuration
- Reward rule reference
- Maximum allowed score/reward
- Maintenance status

Whack-a-Mole Settings:
- Grid dimensions
- Spawn interval
- Target lifetime
- Maximum simultaneous targets
- Target movement behavior, if implemented
- Hit points
- Miss penalty
- Combo rules
- Reaction window
- Valid hit and miss definitions

Difficulty behavior:
Easy: slower target appearances and longer reaction windows.
Hard: faster target appearances and shorter reaction windows.
Very Hard: faster target appearances, shorter target lifetime,
and a narrower reaction window.
Very Very Hard: highest validated challenge within safe limits.

Actual values must be stored as configuration parameters.
Admin must be able to adjust the values within validated bounds.
These descriptions alone are not a substitute for implementation.

Result validation:
- Verify session ownership and state.
- Verify allowed action timing and score bounds.
- Do not trust a client-supplied final score.
- Prevent duplicate finalization.
- Deduct the configured play cost once.
- Issue the validated reward once.
- Record the configuration version used.

Acceptance tests:
- Targets appear and disappear correctly.
- Tapping a valid target scores once.
- A target cannot score twice.
- Timer ends the session correctly.
- All four difficulty presets change actual gameplay.
- Custom settings affect gameplay.
- Invalid settings are rejected.
- Coin is deducted once.
- Reward is issued once.
- Refresh/retry cannot duplicate the reward.
- Published configuration affects new sessions.
- Existing sessions retain their original configuration.

## 3. GAME 02 — COIN PUSHER

Gameplay:
- Display a pusher platform and coin field.
- Allow player coin-drop actions.
- Simulate coin movement, collisions, and platform movement.
- Coins may move, stack, or fall according to implemented physics.
- Track player-owned game actions and session state.
- Do not award arbitrary tickets simply because a coin was dropped.
- Define which game events qualify for rewards.

Coin Pusher Settings:
- Platform speed
- Platform movement cycle
- Coin spawn/drop interval
- Coin movement parameters
- Collision behavior
- Valid play area
- Round duration
- Maximum active coins
- Reward trigger conditions
- Maximum reward

Difficulty must change actual movement, timing, or gameplay challenge.
Every parameter must be bounded and tested.

Prevent repeated reward issuance from one physical simulation event.
Validate session ownership, action limits and result state.

Acceptance tests:
- Coins drop at valid positions.
- Platform movement changes according to configuration.
- Collision and falling behavior are consistent.
- Difficulty changes actual gameplay.
- Invalid actions cannot create unlimited coins.
- Reward conditions are enforced.
- Duplicate requests cannot duplicate rewards.

## 4. GAME 03 — CLAW MACHINE

Gameplay:
- Display a prize cabinet, claw and prize objects.
- Support horizontal movement.
- Support drop, grab attempt, lift and return behavior.
- Implement a defined timer and game-over state.
- Track the selected prize and final outcome.
- Use a documented grab mechanic.
- Do not secretly change an individual player's result
  outside the published game rules.

Claw Settings:
- Horizontal movement speed
- Drop speed
- Lift speed
- Movement bounds
- Grab mechanics
- Prize position and collision area
- Round timer
- Grab/release behavior
- Prize eligibility
- Reward limits

Difficulty must affect actual movement precision, timing,
or other documented gameplay parameters.

If probability is used, configure it transparently and validate it.
Do not use an undocumented probability to secretly manipulate users.

Acceptance tests:
- Claw stays within cabinet bounds.
- Drop, grab, lift and return work.
- Timer is enforced.
- Prize eligibility is checked.
- Difficulty changes actual gameplay.
- One session cannot award the same prize twice.
- Stock and redemption updates are transaction-safe.

## 5. GAME 04 — BASKETBALL CHALLENGE

Gameplay:
- Display a court, ball and hoop.
- Support the defined shooting interaction.
- Implement shot timing and ball trajectory.
- Track valid shots, misses and score.
- Enforce round duration and end conditions.
- Display the final result.
- Prevent client-only score manipulation.

Basketball Settings:
- Round duration
- Ball launch parameters
- Shot timing window
- Aim/movement precision
- Target score
- Valid shot conditions
- Maximum shots where applicable
- Score rules
- Reward rule reference
- Maximum reward

Difficulty must affect real shot timing, physics, accuracy
requirements or target challenge.
Do not merely change the target score label.

Acceptance tests:
- Ball movement and shot results are functional.
- Valid shots score according to the rules.
- Invalid actions cannot create unlimited score.
- Timer and end conditions work.
- All four difficulty presets change actual gameplay.
- Custom settings affect gameplay.
- Score and rewards are validated.
- Duplicate reward issuance is prevented.

## 6. ADMIN CONFIGURATION CONTRACT

For every game provide:
- Common Settings tab
- Game-specific Settings tab
- Difficulty Presets
- Custom Mode
- Save Draft
- Validate
- Test Mode
- Submit for Approval where required
- Publish
- Version History
- Rollback

Admin UI controls must be connected to actual backend operations.
No fake save, publish or rollback buttons.

Changing a setting must have a demonstrable effect on gameplay.
Show the active configuration version in session/admin diagnostics.

Use setting-category permissions.
High-risk financial and reward settings require stronger approval.
Unauthorized users must not bypass approval by calling APIs directly.

## 7. DEVELOPMENT ORDER

1. Build Whack-a-Mole end to end.
2. Test the database, session lifecycle, gameplay and rewards.
3. Build its complete Admin Configuration Studio.
4. Verify all four difficulty presets and Custom Mode.
5. Fix all critical failures before continuing.
6. Build Coin Pusher.
7. Build Claw Machine.
8. Build Basketball Challenge.
9. Reuse shared components only where the behavior is genuinely common.

Do not implement four unfinished games simultaneously.

## 8. CHAT CONTINUITY

Maintain these project files:
- ARCADEVERSE_MASTER_PROMPT.md
- ARCADEVERSE_GAME_SYSTEM_LOCK.md
- PROJECT_STATE.md
- ARCHITECTURE.md
- DATABASE.md
- CHANGELOG.md
- TESTING.md
- DECISIONS.md

At the end of each milestone update PROJECT_STATE.md.
Record completed work, remaining work, changed files, migrations,
dependencies, commands run, real test results and the next action.

For a new chat, read the Master Prompt and current project state.
Never invent files, successful tests or previous progress.
Ask for current files/output when needed.
Do not regenerate existing files blindly.

END OF LOCKED GAME SYSTEM SPECIFICATION
