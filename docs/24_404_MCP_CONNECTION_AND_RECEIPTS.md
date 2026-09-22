# 404 MCP Connection and Receipt Guide

## The connection is not assumed

This pack intentionally does not include a guessed MCP server command, URL, credential, or tool name. The organizer’s actual configuration may be supplied through event instructions, a repository, a private credential, or a preconfigured environment.

At the beginning of the asset stage, Codex must inspect its connected MCP tools and record the real names and schemas in `production/TOOLING_LOG.md`.

## Codex project configuration

The example file `.codex/config.toml.example` shows only configuration shape. Copy it to `.codex/config.toml` only after receiving the exact official values and trusting the repository.

Never commit a token. Prefer an environment variable or organizer-supported authentication mechanism.

## Connection verification

A valid verification is not “the server appears in settings.” It should include:

1. server/connection label,
2. list of exposed 404 tools,
3. schema for the relevant generation/verification tool,
4. one harmless test call,
5. actual response or output path,
6. timestamp and environment,
7. log entry.

If a call fails, record the failure. Do not mark it connected.

## MCP generation sequence

The exact tool calls depend on the exposed schema. The semantic sequence remains:

```text
style lock + isolated reference + object brief
  → candidate A source module
  → candidate B source module
  → candidate C source module
  → organizer verification renders
  → human visual comparison
  → selected module
  → gameplay integration
  → scanner + custom gate + receipt
```

Do not let the MCP generate the complete game in one opaque artifact. Keep each 3D object editable and attributable.

## Human selection is required

Codex may summarize candidates, but selection should be made by looking at:

- multi-angle verifier sheet,
- silhouette at 390 × 844,
- actual game camera,
- animation pivots,
- family resemblance to selected assets,
- performance cost.

The most complex candidate is not automatically the best.

## Receipt paths

Recommended structure:

```text
production/asset-receipts/thief/
  receipt.md
  reference.webp
  prompt.md
  candidate-a.js
  candidate-b.js
  candidate-c.js
  candidate-a-verifier.png
  candidate-b-verifier.png
  candidate-c-verifier.png
  comparison.png
  selected-game-camera.png
  scan.txt
```

Only the selected module belongs in `game/assets/`. Keep evidence out of the runtime folder.

## Compliant fallback

If the connected 404 MCP is genuinely unavailable, the organizer recipe documentation may allow the coding agent to author the same Three.js code geometry through the recipe workflow. Re-read the current rules before relying on that path. Document the unavailable connection, the fallback, prompts, candidates, verification, selection, and scanner output.

Do not use a different external mesh generator as a silent substitute.
