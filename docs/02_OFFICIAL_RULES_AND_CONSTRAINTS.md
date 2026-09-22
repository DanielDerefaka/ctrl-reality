# Official Rules and Constraints

This summary is based on the official organizer repository as reviewed on September 22, 2026. Before submission, Codex must re-read the live official repository because organizer text takes priority over this summary.

## Dates

- Competition opened: September 11, 2026.
- Submission closes: **September 25, 2026 at 23:59 UTC**.
- Nigeria equivalent: **September 26, 2026 at 00:59 WAT**.
- Shortlist: September 27.
- Community vote closes: September 28 at 12:00 UTC.
- Winner announcement: September 28 at Exploit Summit in Montreal.

The pull request must already be open, the live game must work, and the official jam gate must pass at close.

## Prize allocation

| Result | Prize |
|---|---:|
| First | 5 TAO |
| Second | 3 TAO |
| Third | 1.5 TAO |
| Community | 0.5 TAO |
| Total | 10 TAO |

## Hard 3D rule

Every 3D object must be Three.js code written through the 404 recipe. The final asset module must build geometry from Three.js constructors and operations. The rules prohibit:

- downloaded mesh files,
- asset-store meshes,
- hand-modelled imported meshes,
- concealed geometry in literal vertex arrays,
- base64 or binary mesh blobs.

The organizer’s ship tool flags suspicious numeric arrays and base64 in asset modules for human review.

Textures, skies, sprites, sound, and music may be files when they are owned or properly generated and declared.

## Repository and originality

- One to four people per team.
- One entry per person.
- Source repository is public.
- First commit must be within the permitted date range.
- Development history must be real and visible in commits.
- No trademarked characters, names, or logos.
- Organizer reference games may be studied but their code and assets may not be copied.
- All tools and models used should be disclosed.

## Official mobile gate

The live URL is tested on a 390 × 844 phone viewport under a simulated 4G profile with a real touch. The gate checks:

- ready within 20 seconds,
- total transfer under 10 MB,
- starts from a real tap,
- moves from a real finger,
- no more than 900 draw calls,
- no more than 1.5 million triangles,
- no missing requests,
- no console errors.

The official command is currently documented as:

```bash
git clone https://github.com/404-Repo/404-game-recipe
cd 404-game-recipe
npm install
node harness/jam.mjs https://YOUR-LIVE-URL/ --commit=YOUR_COMMIT_SHA
```

Paste the resulting verdict block into the submission pull request without editing it.

## Judging

### Stage one: blind moving-frame comparison

Every entry appears in roughly six randomized side-by-side moving-frame pairs. Names are hidden. Judges answer one question: **does it look like a made thing?** The top twelve move to the shortlist, or all passing entries if fewer than twelve pass.

This means branding, explanation, and a long README cannot rescue visually weak gameplay frames.

### Stage two: hands-on judging

Every shortlisted game is played by every judge for 30 minutes on phone and laptop.

| Weight | Question |
|---:|---|
| 40 | Is it good to play? |
| 30 | Does it look like a made thing? |
| 20 | What did you find that nobody else tried? |
| 10 | How was it made, with receipts? |

The originality score is judged against the other shortlisted entries. The `what_i_found` field carries the concise originality claim.

## What this means for SECOND HANDS

1. The visual frame must be strong during movement, not only on the title screen.
2. The game must be immediately playable on a phone.
3. The defining echo mechanic needs a custom gate; the generic walking gate is insufficient.
4. The public history must contain real asset candidates, verification, decisions, tests, and discarded approaches.
5. The game should remain self-contained and CDN-independent by the final release where practical.
6. The final deployed commit, source commit, gate commit, and submission JSON must match exactly.

## Primary official sources

- Jam rules: `https://github.com/404-Repo/404-game-jam`
- Game recipe: `https://github.com/404-Repo/404-game-recipe`
- Entry template: `https://raw.githubusercontent.com/404-Repo/404-game-jam/main/entries/_template.json`

Always re-check them before final submission.
