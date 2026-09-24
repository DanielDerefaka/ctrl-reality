# CTRL//REALITY

An original third-person puzzle adventure. Mara, a masked interface conservator, repairs an impossible archive by moving controls from the HUD into the physical world.

## Run

`npm install` · `npm run setup` · `npm run serve`

Open http://127.0.0.1:4173/game/ . Local runtime only; no account, generation service or network API is needed by the player.

## Boot Atrium development slice

- ENTER THE ARCHIVE starts play. WASD/arrows move; E interacts. Touch uses the joystick and ACT.
- Approach the cyan socket. Drag BRIGHTNESS from the HUD onto its recessed glass receptacle. Keyboard alternative: select BRIGHTNESS, then E.
- The bridge forms. E/ACT at the socket retrieves the control. Cross the bridge, collect the three optional fragments, and restore the far pedestal with E/ACT.
- Falling realigns Mara at the latest checkpoint. Escape pauses. Settings persist locally.
- PAUSE and UNDO are visibly locked; this build contains one chamber, not the complete three-sector adventure.

## Checks

`npm test` · `npm run check` · `npm run media:audit` · `npm run gate` (server must be running)

Animation review: `/game/?review=1` offers every named state, three views and half speed. Tests use real keyboard, mouse and emulated touch input, with read-only telemetry; they do not teleport the player or set a success flag.

## Production status

Boot Atrium is awaiting user visual review. Eleven code-built asset families passed the official 404 structural verifier after three-candidate comparison; this does not imply visual approval. The new camera, architecture, hybrid backdrop, Mara, HUD and scoped audio preserve the greybox gameplay systems. See [visual review](production/visual-lock/review.html), [comparison board](production/visual-lock/comparison-board.png) and [full measured report](production/visual-lock/REPORT.md).

Physical-phone QA, listening approval, the official live jam gate and final submission remain outstanding. Feature development is stopped until the visual direction is explicitly approved. Rejected greybox v2 is preserved at `ctrl-reality-greybox-v2`.

Previous game directions were removed from the working tree. Their genuine history is retained at Git tag `archive-before-ctrl-reality`.
