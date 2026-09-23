# Tooling and Model Log

This file supports provenance and prevents accidental false claims.

## Environment

| Item | Actual value | Date checked | Evidence |
|---|---|---|---|
| Operating system |  |  |  |
| Node |  |  |  |
| npm |  |  |  |
| Browser/Chromium |  |  |  |
| Three.js version |  |  |  |
| Organizer recipe repo commit |  |  |  |
| Game repo commit |  |  |  |

## Coding agents/models

| Agent/tool | Model/version | Purpose | Dates used | Notes |
|---|---|---|---|---|
| Codex |  | engineering, testing, release audit |  |  |
|  |  |  |  |  |

## 404 MCP connection

- Connection available: YES / NO / PARTIAL
- Date checked:
- Actual server/connection label:
- Actual exposed tool names:
- Schema/usage notes:
- Test call and result:
- Evidence path:
- Fallback used, if any:

Never enter an imagined MCP name or claim a call succeeded without output.

## Image/reference tools

| Tool/model | Material created | Shipped or reference-only | Source path | Declaration needed |
|---|---|---|---|---|
|  |  |  |  |  |

## Audio tools

| Tool/model/library | Material created | License/source | Runtime path |
|---|---|---|---|
| Web Audio API | procedural UI/mechanism sounds | original procedural code |  |
|  |  |  |  |

## Organizer commands run

| Date/time WAT | Command | Result | Raw output path | Commit/URL tested |
|---|---|---|---|---|
|  |  |  |  |  |

## Verified milestone 01 environment — 2026-09-23T00:56:55+01:00

| Item | Observed value |
|---|---|
| Working root | /Users/dx/Documents/second-hands |
| Initial Git | main, no commits, bootstrap files untracked; no remote |
| OS | Darwin 25.6.0 arm64 (macOS) |
| Node / npm | v24.15.0 / 11.12.1 |
| Browser | Chrome/153.0.8010.36 |
| GPU | ANGLE (Apple, ANGLE Metal Renderer: Apple M5, Unspecified Version) |
| Three.js | 0.180.0, local module + core |
| Puppeteer | 25.11.0, development only |
| Recipe checkout | /Users/dx/Documents/404-game-recipe |
| Recipe SHA | 4effad311c5e137bca316257259fe5bffd6737de |
| Coding agent | Codex, GPT-6; no sub-agents used |
| Images/textures/models generated | None; screenshots are browser captures; 3D is existing/edited prototype code |
| New favicon | Original inline-shape SVG authored by Codex; game/favicon.svg |
| Audio | None imported/played; original dormant scaffold retained |

### Actual 404 MCP discovery

Inspected the full session tool inventory. Exposed MCP namespaces include `mcp__codex_app`, `mcp__codex_apps`, `mcp__inspo`, `mcp__node_repl`, and the directly exposed `mcp__cua_repl`; none exposes 404 generation/verification.

- 404 connection/server name: **none exposed**.
- Actual 404 tool names: **none**.
- Relevant descriptions/input schemas: **not available**.
- Authentication: **not testable without an exposed tool**; no authentication success claimed.
- Harmless 404 verification call: **not performed**, no callable 404 tool exists.
- Full evidence: `evidence/floor/mcp-inventory.json`.
- Fallback for this session: only explicitly labelled temporary floor primitives. No final assets.

### Commands and exact outcomes

Commands run from the game root unless the recipe root is specified:

1. `pwd`, `git status`, `ls -la`, `cat AGENTS.md`: correct root; all required entries present; existing main repository, no commits. No git init/copy needed.
2. `git clone https://github.com/404-Repo/404-game-recipe.git /Users/dx/Documents/404-game-recipe`: exit 0; adjacent directory initially absent.
3. Recipe: `npm install`: exit 0, 27 added, 28 audited, zero vulnerabilities.
4. Recipe: `npm run selftest`: exit 0; 3 intentionally bad fixtures flagged, 4/4 clean outside-tree fixtures accepted, mounting/bounds/size assertions passed, 7/7 loader assertions passed. Raw `evidence/floor/organizer-selftest.txt`.
5. Initial game `npm install`: exit 0; 98 added, 99 audited; four high **dev dependency** findings. `npm audit --json` identified Puppeteer/extract-zip chain.
6. `npm install --save-dev --save-exact puppeteer@25.11.0`: exit 0; 6 added, 76 removed, 14 changed, 29 audited, zero vulnerabilities.
7. Final `npm install`: exit 0; 29 audited, zero vulnerabilities. `evidence/floor/install-output.txt`.
8. `npm run setup`: exit 0; module, core and license copied. `evidence/floor/setup-output.txt`.
9. Baseline `npm test`: 11 passed, 0 failed. After focused tests: **23 passed, 0 failed**, no skipped/cancelled. `evidence/floor/unit-output.txt`.
10. First post-vendor `npm run check`: exit 1, false positive on vendor documentation URL. Corrected check: **20 modules parsed, 25 local references verified**, exit 0. `evidence/floor/check-output.txt`.
11. `npm run serve`: listening on port 4173, mounts only the game directory. `npm run smoke`: first attempt 16 passed / 1 failed (driver bug), corrected attempt **42 passed / 0 failed**, exit 0. Raw outputs and both verdicts in `evidence/floor/`.
12. Clean-copy commands: `npm install`, `npm run setup`, `npm test`, `npm run check`, run in a new temporary directory without node_modules/vendor; see `evidence/floor/clean-install-output.txt` for exact path and exit codes.

The source under test is the uncommitted initial milestone, subsequently committed with the required message. Resolve its SHA with `git log -1 --format=%H --grep='prototype: establish mobile floor build and truthful telemetry'`. No prior SHA existed; no fabricated SHA attached to evidence.

Pre-commit inspection: secret-pattern filename scan returned no matches. Full initial `git diff --cached --check` reports existing Markdown hard-break trailing spaces, an existing final blank line in diagrams/README.md, and upstream Three.js indentation. Preserved supplied docs and exact vendor bytes. The authored-code/evidence check excluding vendor passed. No node_modules, credentials or cache files staged.

## 2026-09-23 — Zero Hour pivot provenance

- Coding and visual review: Codex / GPT-6, no subagents. Node/npm/Three/Puppeteer unchanged from the verified environment above. Browser reports Chrome/153.0.8010.36.
- Work performed only in `/Users/dx/Documents/second-hands`. Original production-pack directory and preserved floor evidence were not edited.
- New meshes are original Three.js prototype construction in `game/zero/scene.js`, explicitly PROTOTYPE_ONLY. No imported mesh, image/texture download, asset service or production 404 generation. Existing locally vendored Three.js remains byte-verified by the static check.
- New sound is an original short triangle-oscillator envelope in `game/zero/main.js` using Web Audio. No recorded audio files or external sound library. Audible quality and device vibration were not physically tested. Browser runs disabled sound via the functional setting.
- Screenshots are actual running-browser captures, not generated pictures or mockups. Puppeteer/CDP delivered mouse, keyboard and touch input; telemetry was read for assertions/navigation, with no teleport or injected combat success.
- Prior 404 discovery remains the only connection receipt; no new 404 connection or verifier success is claimed. Rediscover actual tools before Section 1 final asset generation.
- Commands: `npm test` => 35 passed / 0 failed; `npm run check` => 24 modules parsed / 25 local references verified, pinned vendor matches, no forbidden meshes; `npm run smoke` => 34 passed / 0 failed, exit 0. Raw outputs in `production/zero-hour/`.
- Failed evidence retained: browser-round2-failed.json and browser-round2-output.txt report 30 passed / 1 failed plus two pointer-capture DOM exceptions. The corrected final browser-result.json contains zero errors. The initial new unit run had 34 passed / 1 failed at the six-second endpoint; its output is in the task tool history, not a separately saved file.
- No organizer live gate, physical phone, cellular throttle, deployment, sound audition or final asset verification performed in this pivot milestone.
