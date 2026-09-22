# SECOND HANDS: A Clockwork Heist
## 404 Game Jam Production Pack

This folder is the complete build brief for a polished 404 Game Jam entry that can be handed to Codex. It includes the game design, 404 asset workflow, art direction, UI prototype, technical architecture, starter code, testing gate, prompts, production logs, and submission material.

## First, the prize and deadline facts

The competition has a **10 TAO total prize pool**. Under the official rules available on September 22, 2026, first place receives **5 TAO**, second receives 3 TAO, third receives 1.5 TAO, and the community winner receives 0.5 TAO.

The submission deadline is **September 25, 2026 at 23:59 UTC**, which is **September 26, 2026 at 00:59 WAT** in Nigeria. Use **September 25 at 19:00 WAT** as the internal deadline. The remaining time after that is deployment and emergency buffer, not development time.

No plan can guarantee a win. This plan is designed to maximize the published judging criteria while remaining possible within the time left.

## The game in one sentence

**Program a crew by playing:** every 20-second attempt becomes a porcelain “Second Hand” that repeats your movements and interactions, letting you coordinate with up to three past versions of yourself to break into a living clockwork vault.

## Why this concept fits the jam

- It has a single mechanic that is understandable in seconds and deep enough for a 30-minute judge session.
- The mechanic is currently distinct from the six visible open entries reviewed on September 22.
- The entire world can be built from highly readable, animated 404-generated hard-surface objects.
- The signature rewind makes the generated geometry part of gameplay instead of decorative background.
- It works with three large mobile controls: move, act, rewind.
- It can be scoped down to one polished vault without destroying the central idea.

## Do these six things first

1. Create the public game repository immediately. The official rules require genuine public history, not one upload at the end.
2. Put this entire pack in the repository, then commit it as the design baseline.
3. Clone the official `404-game-recipe` repository next to the game repository and run its self-test.
4. Open the game repository in Codex. Codex reads the included `AGENTS.md` automatically.
5. Paste `prompts/00_CODEX_MASTER_PROMPT.md` into Codex.
6. Do not generate production art until the ugly one-room loop works on an actual phone.

## Recommended repository layout

```text
Projects/
  404-game-recipe/          # official organizer tooling, kept separate
  second-hands/             # your public entry repository
    AGENTS.md
    docs/
    production/
    game/                   # final self-contained game folder
    tools/
```

The `starter/` directory in this pack is a development scaffold. Copy its contents into your real repository, then let Codex replace development-only primitive geometry with verified 404 assets.

## Reading order for you

1. `docs/01_EXECUTIVE_BUILD_BRIEF.md`
2. `docs/03_GAME_DESIGN_DOCUMENT.md`
3. `docs/04_RUBRIC_WINNING_STRATEGY.md`
4. `docs/16_BUILD_SCHEDULE_WAT.md`
5. `prompts/00_CODEX_MASTER_PROMPT.md`
6. `checklists/PRE_SUBMISSION_CHECKLIST.md`

## Reading order for Codex

Codex should read `AGENTS.md` first, then every document listed under “Required reading” inside that file. Do not paste the whole folder into one chat message. Let Codex read it from disk so the files remain the source of truth.

## The only acceptable build priority

```text
P0: touch works → loop works → echo works → puzzle works → gate passes
P1: coherent 404 assets → lighting → UI feedback → sound → medals
P2: extra decoration, optional collectible, trailer polish
```

If P0 is not complete by midday September 23, cut scope. Do not add features to compensate for a broken core.
