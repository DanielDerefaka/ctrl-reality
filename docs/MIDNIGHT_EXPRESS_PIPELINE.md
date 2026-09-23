# SECOND HANDS: MIDNIGHT EXPRESS — mask proof only

Selected direction: cinematic third-person stealth and time heist aboard a futuristic luxury train. No shooting or enemy elimination. Nyra is an original masked chrono-thief; future eight-second echoes cooperate on scanners and a memory vault. The main game remains the preserved Zero Hour prototype until this art proof is approved. Do not expand its combat or build another primitive game.

This task stops at **NYRA_MASK**, 0.24 metres high. Required named moving groups: `maskShell`, `eyeLight`, `leftTempleJoint`, `rightTempleJoint`. No full character, train assets or game integration yet. User approval of a visually reviewed candidate is required before integration; this is an explicit user instruction, not an inferred approval rule.

## Style lock for the proof

> A cinematic futuristic Art Deco luxury train racing through a rain-soaked drowned megacity, built from black obsidian, ivory ceramic, champagne gold, smoked glass, deep burgundy fabric and cyan temporal energy.

| Palette | Hex |
|---|---|
| Obsidian black | #07090D |
| Warm black metal | #17171C |
| Ivory ceramic | #E6DFD0 |
| Champagne gold | #C9A45C |
| Chrono cyan | #58E7F2 |
| Echo violet | #9273FF |
| Deep burgundy | #4A1727 |
| Emergency coral | #FF5268 |
| Glass blue | #173441 |

Mask reference: one unworn isolated mask, full object, plain light-gray background, even studio light, three-quarter front. Smooth faceted ivory cheeks, narrow cyan eye line, small gold temple joints; no mouth opening, text, logos or franchise likeness. Prompt: `production/asset-receipts/NYRA_MASK/reference-prompt.txt`.

## Current status

**Scaffold tested; live generation blocked, not proved.** No Higgsfield image, 404 candidate, mask measurement, comparison sheet, recommendation or selected asset exists yet. Blank local credentials and missing account-specific Higgsfield model documentation block paid requests. No replacement generator was used.

Official recipe: adjacent `/Users/dx/Documents/404-game-recipe`, commit `4effad311c5e137bca316257259fe5bffd6737de`. Read `404.md`, `GAME.md`, `docs/asset-contract.md`, `docs/concept-images.md`, `docs/traps.md`, `harness/wrap.mjs`, `harness/verify.mjs`. The public recipe documents a RunPod-hosted model and agent-authored geometry, not an MCP endpoint. This proof specifically uses the requested RunPod model route.

## Local configuration

`.env.local` is ignored, mode 0600, and outside `game/`. `.env.example` contains blank fields:

- HF_API_KEY_ID
- HF_API_KEY_SECRET
- RUNPOD_404_BASE_URL
- VLLM_API_KEY

Populate those values locally. Never paste keys into chat, source, request JSON or game files. The tools read `.env.local` with Node's dotenv parser; inherited environment values take precedence. The current server serves only `game/`.

From your authenticated Higgsfield Console, choose an image model and obtain its current API documentation. Copy `production/asset-receipts/NYRA_MASK/higgsfield-model.example.json` to a new configuration file. Set the exact documented model, documentationUrl, production endpoint and model-specific body; put `{{PROMPT}}` in the documented prompt field and request one image using that model's supported options. Set `reviewed: true` only after checking it. The example has no endpoint/model and is deliberately not runnable. No generic endpoint or model access is assumed. The client supports the documented production API host; preview services require a separately reviewed adapter.

## Commands after prerequisites are supplied

Run from `/Users/dx/Documents/second-hands`:

```sh
node tools/higgsfield-reference.mjs --config /path/to/reviewed-model.json
```

The actual image extension follows the response (PNG/JPEG/WebP). Use the returned receipt's output path:

```sh
node tools/generate-404-asset.mjs --reference /absolute/path/to/completed-reference.png
```

Default model: `Tooony133/Qwen-3.6-27B-AronHorn`, as documented by the pinned recipe. The client checks authenticated `/v1/models` first; a different served ID needs explicit `--model` and review of the actual deployment. No pod is created, started or paid for by the scaffold. The user must supply an existing correctly deployed endpoint. Stop your billed pod after generation using your RunPod controls.

## What the tools do

`tools/higgsfield-reference.mjs` uses the documented `Authorization: Key ID:SECRET` header, submits once, immediately persists request ID, follows the returned same-origin status URL, backs off from two to ten seconds, and handles queued/in_progress/completed/failed/nsfw/canceled. Retries transient GET failures, never automatically retries POST. It downloads one completed image with no API credentials sent to the media host, checks type/signature/size, and saves a hash plus local path. Signed output URLs are not retained in receipts. `--resume` polls an already accepted request; after ambiguous POST failure without request ID, inspect the provider console before any new submission.

`tools/generate-404-asset.mjs` makes three independent streamed requests at temperature 0.6, using the same actual reference and no prior candidate context. Preserves partial/raw code, request metadata, prompt/model/time/hash, and candidate-specific failures. Rejects interrupted/token-truncated streams. Applies contract lint and named-group assertions without importing generated code. Runs official `harness/wrap.mjs` for each valid candidate at 0.24m, adds a 2% height expectation, then runs official `harness/verify.mjs` over the wrapped candidates. The verifier alone loads generated modules and renders its four sides plus three-quarter comparison sheet. It also executes the named Group checks. Preserves warnings, measurements, exit code and sheet; a clean numeric result still only means ready for visual review.

Credentials are stripped from the wrapper/verifier child environment. Early lint is not a security sandbox; never import or eval generated modules elsewhere. The official verifier needs its documented CDN access and uses Three.js 0.169.0; the preserved game uses 0.180.0. Actual gameplay-camera/version compatibility remains a later integration check after selection approval.

Default evidence paths (not existing generation results):

- `production/asset-receipts/NYRA_MASK/reference/receipt.json`
- `production/asset-receipts/NYRA_MASK/reference/NYRA_MASK-reference.<extension>`
- `production/asset-receipts/NYRA_MASK/candidates/raw/NYRA_MASK_01.txt` through `_03.txt`
- `production/asset-receipts/NYRA_MASK/candidates/wrapped/NYRA_MASK_01.js` through `_03.js`
- `production/asset-receipts/NYRA_MASK/candidates/wrapped/_verify/sheet.png`
- `production/asset-receipts/NYRA_MASK/candidates/wrapped/_verify/report.json`
- `production/asset-receipts/NYRA_MASK/candidates/receipt.json`

Existing evidence is refused unless `--overwrite` is explicit; that flag archives the old directory rather than deleting it. Prefer a new `--out production/...` directory. No tool selects a winner or writes to `game/`.

Once real results exist: inspect reference and all five views, compare silhouette, thickness, rear structure, temple pivots and cyan/gold balance; present all three sources, real measurements/warnings, receipts and a reasoned recommendation. **Stop for user candidate approval.**

## Sources checked this session

- [404 generation workflow](https://github.com/404-Repo/404-game-recipe/blob/4effad311c5e137bca316257259fe5bffd6737de/404.md)
- [Higgsfield model discovery priority](https://docs.higgsfield.ai/docs/llms.txt)
- [Higgsfield authentication](https://docs.higgsfield.ai/docs/authentication)
- [Higgsfield lifecycle](https://docs.higgsfield.ai/docs/concepts/requests)
- [Higgsfield polling](https://docs.higgsfield.ai/docs/concepts/polling)
- [Higgsfield status schema](https://docs.higgsfield.ai/docs/api-reference/requests/get-request-status)
- [Official Codex MCP documentation](https://learn.chatgpt.com/docs/extend/mcp?surface=cli)

The account-specific model documentation is still missing. Shared documentation cannot establish account access or the chosen model's request schema.
