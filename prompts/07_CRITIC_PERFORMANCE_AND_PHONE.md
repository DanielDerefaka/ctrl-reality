# Session 07 — Moving-Frame Critic, Performance, and Physical Phone QA

## Objective

Improve the game as judges will actually see and play it: moving, unnamed, on phone and laptop.

## Read first

- `docs/04_RUBRIC_WINNING_STRATEGY.md`
- `docs/14_MOBILE_PERFORMANCE_AND_RENDERING.md`
- `docs/15_QA_AND_CUSTOM_GATE.md`
- `prompts/VISUAL_CRITIC_PROMPT.md`
- `prompts/PLAYTEST_CRITIC_PROMPT.md`

## Preserve evidence

Before polishing further:

- tag/copy the current floor build evidence,
- capture current moving filmstrip,
- record current metrics,
- do not overwrite earlier critic rounds.

## Visual critic loop

Run at most three rounds. Each round must use a fresh critic context and a moving filmstrip that includes:

- normal movement,
- at least one echo,
- one mechanism activation,
- rewind,
- jewel/climax if available.

For each round:

1. Compare to the style lock and target frames.
2. Identify the one visual property most responsible for making the game look less authored.
3. Fix that property only, plus direct regressions.
4. Recapture and record before/after.
5. Stop when improvement is small or after round three.

Likely high-leverage categories: scale/readability, camera composition, material separation, ground readability, lighting hierarchy, mechanism motion, UI obstruction, echo silhouette.

## Performance pass

Measure on the real playable route:

- ready time,
- transfer size,
- draw calls,
- triangles,
- FPS/long frames,
- JavaScript heap trend,
- console/page/network errors.

Internal targets:

- ready < 5 s,
- transfer < 6 MB,
- draws < 250,
- triangles < 300k,
- no missing requests or runtime errors,
- stable input and acceptable frame pacing on the physical Android phone.

Optimize only after measuring. Prefer removing invisible work, sharing materials, pooling effects, lowering DPR/shadow cost, and reducing decorative geometry before damaging hero assets.

## Physical phone QA

Run the checklist in `checklists/PHYSICAL_PHONE_TEST.md`. Record device model, browser, OS, network, orientation, thermal state, and exact results. Do not claim a phone pass from desktop emulation.

## Playtest critic

Run at least two fresh-player sessions when possible. Observe without coaching for the first three minutes. Record:

- time to move,
- time to first rewind,
- time to understand echo purpose,
- first chamber completion time,
- mis-taps,
- control complaints,
- confusion points,
- desire to retry.

Fix blockers before polishing low-impact decoration.

## Acceptance checks

- [ ] Three or fewer documented critic rounds.
- [ ] Every round has before/after filmstrips and one focus issue.
- [ ] Internal performance targets pass or deviations are explicitly justified and still under official maximums.
- [ ] Physical phone run is recorded truthfully.
- [ ] No P0 usability problem remains.
- [ ] No visual change broke the custom gate.

## Commit

```text
perf: complete moving-frame polish and mobile budget pass
```
