# Session 08 — Final Ship, Live Validation, and Submission Package

## Objective

Freeze features, ship the exact final commit, validate the live URL, and produce truthful submission material.

## Preconditions

- Definition of Done reviewed.
- No open P0 bug.
- Custom gate passes locally.
- Physical phone test completed.
- Asset audit complete.
- Provenance and tool/model declarations complete.

## Feature freeze

Do not add new mechanics, chambers, assets, or dependencies. Only fix release blockers, text, deployment, performance regressions, and compliance issues.

## Release sequence

Use the current organizer commands, not stale copied commands. At minimum:

1. Run all unit tests.
2. Run syntax/import checks.
3. Run custom gate three consecutive times against the local served folder.
4. Run organizer ship scanner and cache-stamping process.
5. Build/deploy the exact game folder.
6. Record final commit SHA.
7. Open the HTTPS live URL in a clean browser.
8. Run organizer live check.
9. Run official jam gate with the final commit.
10. Run the custom gate against the same live URL.
11. Test the live URL on the physical phone.
12. Save all unedited output under `production/gate-runs/final/`.
13. Fill `production/second-hands-entry.json` with real values.
14. Fill the PR body and paste only genuine verdict output.
15. Verify the live URL, source URL, entry JSON, commit SHA, and verdict all refer to the same release.

## Release audit

Search the complete game directory for:

- forbidden mesh extensions,
- remote CDN/runtime URLs,
- files outside the self-contained directory,
- undeclared images/audio,
- `TODO`, `FIXME`, debug flags, cheats, test query paths,
- prototype-only modules or geometry,
- console logging and overlays,
- secrets/tokens,
- source maps if they reveal unrelated local paths,
- stale filenames referenced by service worker/cache.

## Final human run

From a fresh private browser profile:

- open URL,
- tap Start,
- complete all chambers,
- restart once,
- toggle audio/reduced motion,
- rotate once and return to portrait,
- background and foreground the tab,
- verify result and replay,
- check console/network.

## Submission language

Keep `what_i_found` to three sentences or fewer and focus on the discovered interaction:

> Every attempt becomes a porcelain Second Hand that replays the player’s movements and interactions. The vault is solved by choreographing with previous versions of yourself, using past runs to hold mechanisms and open a path for the current thief. Rewind is not undo; it is how you program the crew.

Do not claim a world first, guaranteed win, AAA quality, benchmark, device pass, or tool usage without evidence.

## Acceptance checks

- [ ] Final commit exists in the public repository.
- [ ] Live URL serves that exact commit.
- [ ] Official jam gate passes.
- [ ] Custom live gate passes.
- [ ] Physical phone live run passes.
- [ ] Entry JSON validates.
- [ ] PR body is complete and truthful.
- [ ] Deadline buffer remains for hosting-only corrections.

## Commit

```text
release: ship second hands jam submission
```
