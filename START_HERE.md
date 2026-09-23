> **Current direction: SECOND HANDS: MIDNIGHT EXPRESS.** Gameplay expansion is stopped pending the Nyra mask art-pipeline proof and user candidate approval. Read [the bounded pipeline brief](docs/MIDNIGHT_EXPRESS_PIPELINE.md). The Zero Hour build described below is preserved unchanged as historical prototype evidence.

# SECOND HANDS: ZERO HOUR

**YOUR BEST SQUADMATE IS YOU, SIX SECONDS AGO.**

Infiltrate a collapsing chrono-reactor and fight beside holographic recordings of your own previous actions.

This repository now follows the user's Zero Hour pivot. The former circular clockwork game is preserved at `floor-prototype-v1`, with screenshots under `production/floor-build/`. It is a technical floor control, not a final-art direction.

Start with `docs/03_GAME_DESIGN_DOCUMENT.md` and `docs/07_ART_DIRECTION_STYLE_LOCK.md`. The active implementation is `game/zero/`; `game/main.js` loads it. Old pure helpers remain available and tested but are not the new mission. The current foundation has only Command Bay, Skybridge and a Security Spine mechanic evaluation. It is not the complete 8–10 minute game.

Run `npm install`, `npm run setup`, `npm test`, `npm run check`, `npm run serve`, then `npm run smoke`. See README.md and production/ZERO_HOUR_MILESTONE_REPORT.md for current status. No final 404 assets have been generated.
