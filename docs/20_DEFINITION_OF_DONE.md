# Definition of Done

Codex may not describe the game as complete while any P0 item is false.

## P0 — Submission viability

### Repository and compliance

- [ ] Public repository exists.
- [ ] First commit is within official permitted date range.
- [ ] Commit history reflects actual work.
- [ ] Official current rules have been re-read.
- [ ] Every shipped 3D object is compliant Three.js code through the 404 recipe.
- [ ] No mesh file or concealed mesh data exists.
- [ ] All external/generative tools and assets are declared.
- [ ] No trademarked content or copied reference-game code/assets.

### Start and controls

- [ ] Game becomes ready within official limit.
- [ ] Real phone tap starts game.
- [ ] Real finger moves player.
- [ ] ACT works on phone.
- [ ] REWIND works on phone.
- [ ] Keyboard controls work on laptop.
- [ ] Controls do not overlap critical play space at 390 × 844.

### Core mechanic

- [ ] Current run records at fixed simulation time.
- [ ] Rewind creates a visible echo.
- [ ] Echo replays route predictably.
- [ ] Echo holds final pose.
- [ ] Echo activates a pressure plate.
- [ ] Door responds to plate.
- [ ] Current player crosses and takes objective.
- [ ] Up to three echoes replay simultaneously.
- [ ] Reset is deterministic.
- [ ] Clear-last and restart work.

### Content

- [ ] Chamber 1 complete.
- [ ] Chamber 2 complete or fallback configuration complete.
- [ ] Chamber 3 complete or fallback configuration complete.
- [ ] Final jewel/escape sequence works.
- [ ] First clear possible in under 10 minutes for a familiar tester.
- [ ] Fresh tester understands first chamber without verbal explanation.

### Visual production

- [ ] No temporary primitive remains in final frames.
- [ ] P0 assets have references, three candidates, verifier sheets, and receipts.
- [ ] Hero reads at phone scale.
- [ ] Floor is visibly lit.
- [ ] Warm and cool light both read.
- [ ] Current player and all echoes are distinguishable.
- [ ] Objective is visually prioritized.
- [ ] Moving filmstrip looks coherent.

### Stability and performance

- [ ] No console errors.
- [ ] No unhandled promises.
- [ ] No 404 requests.
- [ ] No files loaded above/outside game folder.
- [ ] Transfer under 10 MB.
- [ ] Draws under 900.
- [ ] Triangles under 1.5M.
- [ ] Ten rewinds do not leak noticeably.
- [ ] Ten restarts do not duplicate listeners/objects.
- [ ] Physical Android test completed and logged, or no physical claim is made.

### Tests and gates

- [ ] Pure logic tests pass.
- [ ] Asset modules parse.
- [ ] Organizer asset verification passes.
- [ ] Custom gate proves echo → plate → door → objective.
- [ ] Custom gate uses real touch.
- [ ] Live phone check passes.
- [ ] Live desktop check passes.
- [ ] Official jam gate passes against exact release SHA.

### Submission

- [ ] Live URL works in clean browser.
- [ ] Source URL is public.
- [ ] Release SHA matches verdict.
- [ ] Entry JSON fields complete.
- [ ] `what_i_found` is three sentences or fewer.
- [ ] Wallet/contact are valid or permitted placeholder used.
- [ ] Unedited verdict included in pull request.
- [ ] Pull request opened before deadline.

## P1 — Strong shortlist readiness

- [ ] Silver/Gold targets work.
- [ ] Procedural audio is balanced.
- [ ] Rewind VFX runs smoothly.
- [ ] Jewel payoff is polished.
- [ ] Two fresh visual critic rounds completed.
- [ ] Each critic round fixed one decisive issue.
- [ ] Moving frames beat floor build in every pair.
- [ ] Full judge session offers meaningful replay for 20–30 minutes.
- [ ] Trailer captured from real gameplay.

## P2 — Only after release candidate passes

- [ ] Optional chrono shards.
- [ ] Clockwork bird guide.
- [ ] Music loop.
- [ ] Attract/reset mode for conference demo.
- [ ] Extra decorative asset variation.

## Final release sentence

The release candidate is done when the exact deployed commit passes the custom mechanic gate, physical/manual play, organizer live checks, and official jam gate, while its moving frames show a coherent 404-generated vault and the first chamber teaches demonstration programming without verbal help.
