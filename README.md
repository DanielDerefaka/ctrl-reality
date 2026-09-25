# CTRL//REALITY

An original third-person puzzle adventure. Mara, a masked interface conservator, repairs an impossible archive by moving controls from the HUD into the physical world.

## Run

`npm install` · `npm run setup` · `npm run serve`

Open http://127.0.0.1:4173/game/ . Local runtime only; no account, generation service or network API is needed by the player.

## Boot Atrium development slice

- ENTER THE ARCHIVE starts play and shows a three-line briefing. WASD/arrows move; E interacts. Touch uses the joystick and ACT.
- Mara carries the archive's last light as the BRIGHTNESS card. Walk to a glowing socket and drag the card into it, or stand at the socket and press E.
- At a socket, 1 / 2 / 3 set the light. DIM darkens the room and shows what is hidden. BALANCED lets Mara touch it. RADIANT builds the bridge but makes the far edges and any open fracture lethal.
- Reveal: RADIANT at the Atrium socket builds the bridge. Read: in the gallery, DIM shows the order of three floor plates; walk them in that order under BALANCED. A wrong plate only resets the order. Stabilize: at the Kernel, DIM shows three fractures; walk into them under BALANCED, then RADIANT restores the archive.
- Pressure: RADIANT at the Atrium socket lasts eight seconds, then drops to BALANCED and the bridge retracts. A started plate order cools after four seconds between plates. Sealed fractures reopen unless all three close within twelve seconds.
- Falling or touching a live fracture realigns Mara at the latest checkpoint. Escape pauses. Settings persist locally. The three challenges are a single connected Atrium sequence.

## Sector 02: the Gravity Well (user-approved scope override, 2026-09-25)

- Restoring the Kernel does not end the game. It hands BRIGHTNESS back and yields a second card, GRAVITY, which fits only the violet sockets of the Well below. At a violet socket, 4 / 5 / 6 set LOW / NORMAL / HEAVY.
- Lift: on the landing, LOW raises three sunken slabs, but LOW spends in nine seconds and Mara walks slowly under it. Cross before it drops.
- Anchor: on the deck, three anchors drift in orbit. HEAVY freezes them so Mara can pin them by walking onto them, but the deck crumbles while HEAVY holds; after about eleven seconds it collapses. Pins already set survive the realignment.
- Sync: at the core, both cards sit in adjacent sockets. DIM + HEAVY shows three locks; walk them under HEAVY. Then RADIANT + LOW raises the core, and stepping onto it restores the archive. RADIANT burns the deck edges beyond the core.
- Five fragments in total. Results count deployments of both controls. No new media: the fourth handbook step reuses the install capture.

## Checks

`npm test` · `npm run check` · `npm run media:audit` · `npm run gate` (server must be running) · `npm run test:startup`

The gate plays both sectors to the results screen at 1440×900 with real keyboard and mouse input, and Sector 01 at 390×844 with emulated touch. Screenshots land in `production/recovery/browser/` (`desktop-well-*` cover the Well).

Animation review: `/game/?review=1` offers every named state, three views and half speed. Tests use real keyboard, mouse and emulated touch input, with read-only telemetry; they do not teleport the player or set a success flag.

## Production status

Boot Atrium is awaiting user visual review. Eleven code-built asset families passed the official 404 structural verifier after three-candidate comparison; this does not imply visual approval. The new camera, architecture, hybrid backdrop, Mara, HUD and scoped audio preserve the greybox gameplay systems. See [visual review](production/visual-lock/review.html), [comparison board](production/visual-lock/comparison-board.png) and [full measured report](production/visual-lock/REPORT.md).

Physical-phone QA, listening approval, the official live jam gate and final submission remain outstanding. The final recovery pass (branch `feature/final-recovery-pass`) reworked the loop for readability: light levels now change the room, the gallery plates and Kernel fractures are walked rather than clicked, and an in-game briefing explains the premise. The tested pre-recovery build is tagged `ctrl-reality-pre-final-recovery`; rejected greybox v2 is preserved at `ctrl-reality-greybox-v2`.

Previous game directions were removed from the working tree. Their genuine history is retained at Git tag `archive-before-ctrl-reality`.
