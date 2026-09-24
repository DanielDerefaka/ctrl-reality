# Tooling — 2026-09-24

Higgsfield authenticated with local development credentials. Actual model schemas were read at official open.higgsfield.ai API references. Image model: `xai/grok-imagine-image-2.0`, image_urls reference, medium quality, 1k character views / 2k title. Video model: `kling-video/v3.0/std/image-to-video`, 6 seconds, sound off, same first/last image for title. Asynchronous job identifiers, prompts, estimates, hashes and outputs are in production/higgsfield/*.json. No API credentials are in runtime or receipts. The API returned polling URLs on platform.higgsfield.ai; the client allows only the two verified Higgsfield API hosts for authenticated polling.

Atlas: authenticated owner workspace “Daniel Derefaka's 404 Game Jam Workspace”. Private project created after explicit user approval, pid e78981cd-f4e3-43c3-8f78-285195a3cad1. `prompt_project_agent` planning+audio call returned AGENT_ERROR HTTP500 (receipt atlas-response.json). A smaller planning-only request ended with a network URLError; outcome unknown, not retried. No generated Atlas assets claimed, no publication or sharing performed. Native Atlas tools were not exposed in the session; actual discovered MCP tools were called via the configured authenticated HTTP MCP endpoint.

Geometry: Three.js0.180.0 local vendor. No 404 generation or verification claimed this milestone. Placeholder permission comes from the user's new brief.

Audio: tools/generate-audio.mjs authors original waveforms/composition offline; ffmpeg loudnorm and libmp3lame encode local files. No third-party music or samples. Fonts: Google Fonts official distributions, SIL OFL files bundled. Code and generated canvas textures: Codex.

Browser evidence uses installed Puppeteer/Chromium with software WebGL where required. This is emulation, not a physical-device test. ffprobe verifies no audio stream in title video. Generator source references and raw media are production-only, excluded from shipped game/.

## Boot Atrium visual-lock update

No 404 MCP tools were exposed. Used the recipe's explicit agent-authored workflow: clean reference, three separate construction strategies per family, official multiview verification, visual selection and retained rejections. Official recipe self-test passed. The exact 11 shipped modules pass the final verifier. This supersedes the earlier greybox statement that no 404 verification was performed.

Higgsfield produced twelve new references/layers; one compressed distant matte is shipped. The alternate depth plate is retained only as reference. No Atlas outputs are used. Runtime images are local. Final captures used hardware ANGLE Metal on Apple M5, not SwiftShader; portrait captures remain emulation. Chrome screencast frames provide precise short-stage evidence after normal PNG encoding missed the first attempt. No game state was injected.

New modal/noise Atrium audio has its own synthesis receipt. All rendering passes are included in reported draw calls and triangles. See visual-lock/REPORT.md.
