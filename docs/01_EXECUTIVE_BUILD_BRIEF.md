## SECOND HANDS: ZERO HOUR

# SECOND HANDS: ZERO HOUR — active design

Tagline: **YOUR BEST SQUADMATE IS YOU, SIX SECONDS AGO.**

Pitch: Infiltrate a collapsing chrono-reactor and fight beside holographic recordings of your own previous actions.

## Vertical slice

One 8–10 minute first-completion mission: **OPERATION: DEAD CLOCK**, Nexus-9 Chrono Facility. Third-person action, fixed right shoulder, approximately 52° movement FOV and 42° precision aim. The ordinary operative silhouette occupies 18–24% of screen height. Mouse/right drag looks; movement follows camera heading; aim is independent of movement direction.

1. **SKYBRIDGE INSERTION** — 2–3 minutes. Insertion, pulse-carbine tutorial, scout encounter, airlock breach. Current prototype has one damageable scout and a transition.
2. **SECURITY SPINE** — 3–4 minutes. Learn six-second recording, reposition, deploy, synchronized crossfire and phase scanner use. Current prototype has a stationary shield target and scanner.
3. **CHRONO CORE** — 2–3 minutes. Chrono Warden encounter, containment breach, steal the reactor core. Planned only; not part of the foundation task.
4. **EXTRACTION** — optional final section, cut first. Not built.

## Identity mechanic

Record up to six seconds of movement, facing, aim, firing, dodging and interactions at fixed simulation time. Stop early or auto-store at six seconds. Reposition freely, then deploy one translucent holographic operative that replays the track and shots. It can damage enemies and activate eligible scanners, cannot collide with the player or secure the core, and expires after its track. Four-second deployment cooldown. One stored track, one active echo; no upgrades.

Shield proof: record an attack from the left → store → move to the right → deploy → echo attacks left while current player attacks right. Shield breaks only for different actors, direction dot product below .64 (over roughly 50°), inside an 800ms window. Same-side spam and player-only attacks must fail.

## Combat

One pulse carbine, 24-round magazine, 144 reserve, 140ms shot interval, 1.35s reload. Hitscan uses occlusion from collision walls. Body hit 25, critical center hit 40. Current scouts are stationary damage targets; adversarial combat, player damage and encounter pacing are future production work. Normal/Hard currently affect target durability (1× / 1.5×), not invented enemy intelligence.

## Screen flow and controls

Boot → live Command Bay main menu → Operations (Normal/Hard) → skippable briefing → Gameplay. Menu also has working How to Play, Settings and Credits. Pause supports resume, settings, restart evaluation, end evaluation, and return to Command Bay. Results report actual elapsed time, accuracy, damage, echo eliminations, synchronized attacks, core secured and rank. Until the core mission exists, rank is UNRANKED and core secured is NO.

Desktop: WASD, mouse look, left fire, right precision aim, Space dodge, Q echo, E interact, R reload, Escape pause. Mobile: left joystick, right drag, Fire, Echo, Dodge, contextual Use, Aim, ammo tap reload, Pause. Sensitivity, invert-Y, sound and vibration settings persist where local storage is available. Nearby visible targets may receive narrow mobile aim assistance; walls must block it.

## Presentation and scoring

Black translucent HUD, thin cyan borders, white text, amber objectives, red alerts, violet echoes. Minimum 12px essential text and 64px targets. Connected spaces need foreground, subject, background, and meaningful visible motion. All current 3D is PROTOTYPE_ONLY; no commercial-quality or final-asset claim.

Planned full-mission ranks should combine completion, accuracy, damage and echo use after playtesting; the foundation reports raw statistics without awarding an unearned completion rank. No weapon inventory, extra weapons, multiplayer or backend.
