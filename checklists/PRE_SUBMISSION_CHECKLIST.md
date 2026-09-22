# Pre-Submission Checklist

Run against the exact final commit and exact live URL.

## Rules and provenance

- [ ] Every visible 3D object is a 404-recipe Three.js code module.
- [ ] No forbidden mesh/model file exists anywhere in `game/`.
- [ ] No large concealed vertex/base64/binary geometry exists.
- [ ] Every P0 asset has three candidate receipts and verification evidence.
- [ ] Every image, texture, sprite, audio file, tool, model, and license/source is declared.
- [ ] No trademarked or copied game material.
- [ ] No organizer reference-game code or assets copied.
- [ ] Public commit history is genuine.

## Runtime

- [ ] One visible tap starts the game.
- [ ] Real touch solves all chambers.
- [ ] Keyboard solves all chambers.
- [ ] Echo plate puzzle works from a clean load.
- [ ] Restart, clear echoes, pause, audio, and reduced motion work.
- [ ] `__READY__`, `__START__`, and `__GAME__` are truthful.
- [ ] Zero console errors, page errors, unhandled rejections, and missing requests.
- [ ] No runtime CDN or file outside `game/`.
- [ ] No `TODO`, debug overlay, cheat flag, local path, or secret.

## Performance

- [ ] Internal ready target < 5 s.
- [ ] Internal transfer target < 6 MB.
- [ ] Internal draws target < 250.
- [ ] Internal triangles target < 300k.
- [ ] Official maximums pass under the required phone/network profile.
- [ ] Physical phone 20-minute run completed and logged.

## Evidence and tests

- [ ] Unit tests pass.
- [ ] Import/syntax audit passes.
- [ ] Custom local gate passes three times consecutively.
- [ ] Organizer ship/scanner passes or all human-review flags are explained.
- [ ] Live URL serves the stamped final build.
- [ ] Official jam gate passes against final SHA.
- [ ] Custom gate passes against the same URL/SHA.
- [ ] Raw outputs are saved unedited.

## Submission

- [ ] Entry JSON is valid JSON and contains real values.
- [ ] Team handles are correct.
- [ ] Play/source URLs are public.
- [ ] Final commit SHA matches deployed/tested build.
- [ ] `what_i_found` is three sentences or fewer.
- [ ] Actual agents/models are declared.
- [ ] Wallet/contact are correct.
- [ ] PR body contains genuine verdict output.
- [ ] PR is open before deadline.
- [ ] Live URL and PR checked from a signed-out/private browser.

## Final human question

- [ ] Would a judge understand the mechanic in the first minute without reading the repository?
- [ ] Does the first rewind look distinctive in anonymized moving frames?
- [ ] Is any last-minute change worth risking the passing build? Default answer: no.
