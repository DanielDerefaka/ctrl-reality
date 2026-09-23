> Historical production-pack reference. The user-approved Zero Hour design in docs/03_GAME_DESIGN_DOCUMENT.md supersedes conflicting clockwork scope, controls, camera, timing and palette. Original wording is retained for provenance.

# Rubric Strategy

The game should be built directly against the published 40/30/20/10 weighting. This document translates each criterion into observable evidence.

## 40 points — Is it good to play?

### What judges must feel

- The character responds immediately.
- The rule is understood through action.
- Rewinding feels satisfying rather than punitive.
- The echoes are predictable enough to plan around.
- Each chamber introduces one clear complication.
- Restarting and replaying are frictionless.
- The final coordination feels earned.

### Concrete implementation targets

- Start button to controllable movement: under 500 ms after assets are ready.
- Input latency: one rendered frame under normal conditions.
- Player acceleration: fast enough to feel direct, with 80–120 ms smoothing.
- First plate feedback: visible and audible within 10 seconds.
- First rewind: no later than 45 seconds for a new player.
- Rewind duration: 0.75–1.1 seconds. Longer becomes waiting.
- Chamber restart: under one second.
- No tutorial paragraph. Use at most three short prompts in Chamber 1.
- Every required interaction has at least three feedback channels: movement, light, sound/UI.
- Controls remain usable with one thumb for movement and one thumb for actions.

### Playtest questions

Ask fresh players:

1. What does rewind do?
2. Why did the door open?
3. What will your next recording accomplish?
4. Did any echo surprise you in a way that felt unfair?
5. Could you restart without searching for the control?

If a player cannot answer the first three after Chamber 1, fix communication before adding content.

## 30 points — Does it look like a made thing?

### Stage-one reality

Stage one uses moving frames with names hidden. The visual target is not a beautiful menu. It is a coherent game frame while the player, echoes, hazard, and mechanisms are moving.

### Frame claims

Every strong gameplay frame should satisfy most of these claims:

- The playable area sits in a controlled pool of warm light surrounded by near-black space.
- At least two color temperatures are visible: warm brass mechanism light and cool moon/echo light.
- The hero silhouette is large and distinct.
- One major mechanical object is moving.
- The objective is visually brighter or more saturated than irrelevant decoration.
- The floor receives visible light and shadow; it is not a black slab.
- Materials are consistent across every object.
- UI occupies the perimeter, not the center.
- Echo colors remain legible without washing out the porcelain form.
- No object looks like an unstyled development primitive.

### Production choices

- One exact style lock shared by all asset agents.
- Three candidates per P0 asset and multi-angle verification.
- Reuse the same 10–14 strong assets in deliberate compositions.
- Put visual detail into silhouette, layering, moving subassemblies, and material breakup rather than tiny unreadable geometry.
- Use HTML/CSS for text; do not attempt printed labels as geometry.
- Capture critic filmstrips while the actual game is moving.

## 20 points — What did nobody else try?

### The actual novelty claim

The novelty is not generic time travel. It is **programming embodied collaborators by demonstration**:

- Perform a route.
- Rewind.
- The route becomes a persistent agent.
- Compose multiple demonstrated agents into one simultaneous solution.

This should be visible in the first two minutes and essential to every chamber.

### Defend the novelty in execution

- Do not add a separate mechanic that steals attention from demonstration programming.
- Name the copies “Second Hands,” not generic ghosts.
- Show their route identity through shape and color.
- Make mechanisms require simultaneous physical presence.
- Let the final solution visibly place all Second Hands on screen together.
- Use the `what_i_found` text provided in the submission document.

### Current gap in visible entries

As of September 22, visible open submissions cover haunted lantern tower defense, grocery-store vacuum/FPS play, orbital timing, modular tank combat, historical flying-boat simulation, and lighthouse resource management. None of those visible entries centers on recorded demonstrations becoming cooperative embodied agents. Recheck the field before the deadline.

## 10 points — How was it made, with receipts?

### Evidence to preserve

- The one-pass floor build and six frames.
- Target visual frames and written frame claims.
- Reference image for every production asset.
- Three independent candidates per P0 asset.
- Verifier sheets.
- Selection and rejection notes.
- Commit history showing mechanics, art, UI, tests, and fixes.
- A discard log that explains real scope decisions.
- Phone playtest logs.
- Custom gate runs.
- Official gate verdicts.
- Visual critic comparisons and the single chosen fix per round.
- Tool and model provenance.

### Receipts must be useful, not decorative

A screenshot folder without decisions is weak evidence. Every receipt should answer:

- What were we trying to prove?
- What failed?
- What changed?
- What did the next test show?

## Internal rubric readiness checklist

### Playability

- [ ] New player creates first useful echo without verbal coaching.
- [ ] No required action uses a hidden state.
- [ ] Mobile controls survive ten consecutive restarts.
- [ ] Echo playback is deterministic across frame rates.
- [ ] All three chambers are completable on phone and laptop.

### Visual quality

- [ ] Six moving frames all look coherent.
- [ ] Hero scale is readable in portrait.
- [ ] Floor is visibly lit.
- [ ] No placeholder primitive remains.
- [ ] Echo transparency does not destroy silhouette.

### Originality

- [ ] Demonstration programming is required, not optional.
- [ ] Final chamber visibly combines three recorded roles.
- [ ] `what_i_found` explains the mechanic in three sentences or fewer.

### Receipts

- [ ] Public history is real.
- [ ] Asset receipts are complete.
- [ ] Discard log includes at least three real choices.
- [ ] Custom gate proves the echo/plate/door/jewel sequence.
- [ ] Final live verdict matches the submitted commit.
