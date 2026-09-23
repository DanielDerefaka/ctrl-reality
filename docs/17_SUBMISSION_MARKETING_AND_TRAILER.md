> Historical production-pack reference. The user-approved Zero Hour design in docs/03_GAME_DESIGN_DOCUMENT.md supersedes conflicting clockwork scope, controls, camera, timing and palette. Original wording is retained for provenance.

# Submission, Marketing, and Trailer

## Recommended official metadata

### Title

`SECOND HANDS: A Clockwork Heist`

### Slug

`second-hands`

### Genre

`other`

### What I found — preferred version

> Instead of commanding companions through menus, the player programs each crew member by demonstrating its route. Every rewind turns the last 20 seconds of play into a persistent embodied agent that repeats those movements and interactions. The vault is solved by composing three demonstrations into one synchronized heist.

This is three sentences and names the game-level originality directly.

### Three-sentence entry description

> SECOND HANDS is a mobile-first clockwork heist where every rewind turns your previous attempt into a porcelain replay agent. Coordinate up to three Second Hands to hold plates, turn mechanisms, and open the path to the Chronoglass. Every 3D object in the vault is built as editable Three.js code through the 404 recipe.

## Entry JSON template

Use `production/second-hands-entry.json` and replace every placeholder. The commit must match the official verdict block.

## Pull request body structure

```markdown
## Entry

- Play: <LIVE URL>
- Source: <PUBLIC REPO>
- Tested commit: `<SHA>`
- Contributors: <HANDLES>
- Wallet: <SS58 OR later>

## Official mobile verdict

<PASTE UNEDITED BLOCK>

## What I found

Instead of commanding companions through menus, the player programs each crew member by demonstrating its route. Every rewind turns the last 20 seconds of play into a persistent embodied agent that repeats those movements and interactions. The vault is solved by composing three demonstrations into one synchronized heist.

## Build receipts

- 404 asset candidates and verification: <PATH/LINK>
- Floor and target comparisons: <PATH/LINK>
- Custom echo-mechanic gate: <PATH/LINK>
- Physical phone tests: <PATH/LINK, ONLY IF REAL>
- Tool and art provenance: <PATH/LINK>

## Declarations

- [x] Every 3D object follows the 404 code-construction requirement.
- [x] Artwork, sound, generation tools, and provenance are disclosed.
- [x] Public history reflects genuine development.
- [x] No organizer reference-game code or assets were copied.
- [x] The team has read the official rules and can make the rights declarations.
```

## 30-second trailer shot list

### 0:00–0:03 — Establish the object

Close moving shot of the miniature porcelain thief inside the giant pocket-watch vault. The second hand sweeps overhead. On-screen title: `SECOND HANDS`.

### 0:03–0:07 — The impossible problem

Player stands on a pressure plate. Door opens. Player steps off; door slams shut. No explanation.

### 0:07–0:11 — Signature rewind

Color drains, mechanisms reverse, route ribbon retracts, giant hand sweeps backward.

### 0:11–0:16 — The realization

Cyan Second Hand repeats the route and stays on the plate. Current player runs beside it through the open gate.

### 0:16–0:23 — Escalation

Fast cuts:

- cyan echo on plate,
- violet echo turning crank,
- amber echo pulling lever,
- current player crossing pendulum corridor.

### 0:23–0:28 — Payoff

Pedestal opens. Chronoglass rises. All echoes turn toward it. Player takes jewel.

### 0:28–0:30 — End card

```text
SECOND HANDS
REWIND BUILDS THE CREW
Built with the 404 game recipe
```

No logos/lore montage before gameplay.

## Gameplay clip capture

Use the custom gate’s screencast approach or real gameplay capture. Do not fake gameplay with a separately animated scene. Keep real-speed segments and disclose edits.

Capture both:

- portrait phone gameplay for authenticity,
- 16:9 cropped/composed trailer version for social sharing.

## X announcement draft

> Every failed attempt becomes part of the plan.
>
> In SECOND HANDS, you program a crew by playing. Rewind turns your last 20 seconds into a porcelain agent that repeats the route, holds the mechanism, and helps the next version of you break deeper into the vault.
>
> Built entirely from editable Three.js code through the 404 game recipe.

Add the live link and gameplay clip only after the release URL is stable.

## Conference demo requirements

A conference player may give the game 30 seconds. Therefore:

- Start with one button.
- Chamber 1 must teach itself.
- Provide a `RESET` control visible from pause.
- Do not require sound.
- Do not require account/login.
- Do not require orientation change.
- Do not leave the game in Chamber 3 after idle; use an attract reset after prolonged inactivity if time permits.

## Build breakdown outline if selected

1. The problem: one body cannot operate the vault.
2. The mechanic: demonstrations become persistent agents.
3. Why 404 code assets suited moving mechanisms.
4. Three-candidate pipeline and selected examples.
5. How the custom gate proved the actual puzzle.
6. Floor vs final moving frames.
7. What was cut to ship.
8. Mobile performance and final verdict.
