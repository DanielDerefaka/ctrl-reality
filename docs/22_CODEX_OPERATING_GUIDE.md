> Historical production-pack reference. The user-approved Zero Hour design in docs/03_GAME_DESIGN_DOCUMENT.md supersedes conflicting clockwork scope, controls, camera, timing and palette. Original wording is retained for provenance.

# Codex Operating Guide

## Use the pack from disk, not one giant pasted prompt

Codex can read `AGENTS.md` and repository files. Keep those files as the source of truth. Paste only the master prompt once, then use the numbered session prompts one at a time.

Recommended sequence:

1. `prompts/00_CODEX_MASTER_PROMPT.md`
2. `prompts/01_ENVIRONMENT_AND_FLOOR.md`
3. `prompts/02_CORE_REPLAY_MECHANIC.md`
4. `prompts/03_CUSTOM_GATE.md`
5. `prompts/04_404_PRODUCTION_ASSETS.md`
6. `prompts/05_CHAMBERS_AND_SCORING.md`
7. `prompts/06_UI_AUDIO_VFX.md`
8. `prompts/07_CRITIC_PERFORMANCE_AND_PHONE.md`
9. `prompts/08_FINAL_SHIP_AND_SUBMIT.md`

Do not ask Codex to execute all nine stages in one session. That encourages silent assumptions, shallow tests, and uncontrolled scope.

## Start every session from a passing commit

Before giving the next prompt:

```bash
git status
git log --oneline -8
npm test
```

Also run the current browser/custom gate once the mechanic exists. If the prior stage is broken, fix it before starting a new system.

## End every session with evidence

Require Codex to report:

- exact changed files,
- exact commands run,
- pass/fail output,
- one screenshot or evidence path when visual behavior changed,
- current mobile state,
- current performance numbers when measurable,
- single largest risk,
- next numbered prompt.

Do not accept “it should work” as a result.

## Review diffs before accepting them

```bash
git diff --stat
git diff
```

Look for:

- new dependencies,
- remote URLs,
- giant generated arrays,
- unrequested systems,
- removed tests,
- hard-coded success state,
- false log entries,
- changes to the style lock,
- fake gate output.

## Use subagents carefully

Parallel work is useful for independent audits, not for two agents editing the same core system. Safe parallel examples:

- one agent audits touch/UI,
- one audits deterministic replay,
- one audits asset provenance,
- one audits performance.

Unsafe parallel examples:

- two agents rewriting `main.js`,
- three agents generating incompatible asset APIs,
- UI and gameplay agents changing selectors without coordination.

The lead Codex session owns integration and final tests.

## Context reset points

Use a fresh Codex context for:

- each visual critic round,
- final release audit,
- rule/compliance audit,
- an investigation after repeated failed fixes.

A fresh critic is less likely to defend earlier work.

## When Codex should stop and ask

Only stop for genuinely external blockers:

- 404 MCP credentials/configuration are absent,
- deployment credentials are absent,
- organizer docs conflict in a way that changes compliance,
- wallet/team/contact information is required,
- a human must perform a physical-phone test or judge visual candidates.

Do not stop for design decisions already settled in this pack.

## Security

- Trust the project before enabling project-scoped MCP.
- Keep credentials out of `.codex/config.toml` if it is committed.
- Never execute unknown scripts from a generated asset without reading them.
- Review any shell command that deletes, deploys, rewrites git history, or modifies files outside the repository.
