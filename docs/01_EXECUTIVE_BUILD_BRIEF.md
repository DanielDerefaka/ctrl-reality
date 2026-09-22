# Executive Build Brief

## Product

**Title:** SECOND HANDS: A Clockwork Heist  
**Genre:** Mobile-first 3D action puzzle / time-loop heist  
**Platform:** Web browser, phone and laptop  
**Camera:** Fixed three-quarter diorama camera  
**Typical first clear:** 6–10 minutes  
**Judge replay depth:** medals, fewer-loop solutions, speed targets, optional chrono shard  
**Primary controls:** move, act, rewind

## Player fantasy

The player is a miniature porcelain thief breaking into a gigantic mechanical pocket-watch vault. They cannot operate every mechanism at once. Instead, they demonstrate a route, rewind time, and turn that demonstration into an embodied replay agent. The final heist is a synchronized performance by the present thief and three past selves.

## Design thesis

The best jam concept is not the one with the most content. It is the one that creates one unmistakable moment, is reliable on the judged hardware, survives blind moving-frame comparison, and produces enough mastery for a 30-minute play session.

SECOND HANDS is built around one sentence:

> Rewind is not undo. Rewind is how you recruit the crew.

## The signature moment

The first rewind must happen within the first minute:

1. The timer reaches zero or the player presses REWIND.
2. The room desaturates and a reverse chime begins.
3. The giant second hand sweeps backward.
4. Gears, pins, doors, springs, and particles reverse to their baseline positions.
5. The current thief traces the recorded route backward as a luminous line.
6. The room snaps back into color.
7. A translucent porcelain copy begins replaying the previous route.
8. The player moves beside their past self.

The player should understand the mechanic before reading an explanation.

## Build strategy

Build a single coherent vault set and reuse it across three chambers. Do not build three separate worlds. Each chamber changes layout, active mechanisms, lighting emphasis, and required coordination while reusing the same production assets.

### Chamber 1 — The First Lock

One echo holds one pressure plate while the current player crosses a door and steals a calibration key.

### Chamber 2 — The Split Dial

Two echoes hold separated mechanisms while the current player crosses the sweeping hand and reaches the inner ring.

### Chamber 3 — The Heart Vault

Three echoes coordinate a plate, a timed crank, and a locking lever while the current player enters the heart chamber, takes the Chronoglass jewel, and escapes.

## Quality target

The finished game should feel like a small premium museum installation rather than a large prototype:

- Close camera.
- Large readable hero.
- Deliberate brass, lacquer, and porcelain material system.
- Clear warm/cool lighting split.
- Physical mechanical feedback for every rule.
- No generic grey boxes in the submitted build.
- No long lore screen.
- No cluttered mobile HUD.
- No controls that require explanation.

## Internal success metrics

| Area | Target |
|---|---|
| First movement | within 2 seconds of Start tap |
| First mechanism feedback | within 10 seconds |
| First rewind | within 30–45 seconds |
| First successful echo use | within 75 seconds |
| First clear | 6–10 minutes |
| Ready time | under 5 seconds target; 20 seconds official maximum |
| Transfer | under 6 MB target; 10 MB official maximum |
| Draw calls | under 250 target; 900 official maximum |
| Triangles | under 300,000 target; 1.5M official maximum |
| Console errors / 404s | zero |
| Touch targets | at least 64 CSS px |
| Visual critic rounds | maximum three focused rounds |

## The pitch for judges

> Instead of commanding companions through menus, the player programs each crew member by demonstrating its route. Every rewind turns the last 20 seconds of play into a persistent embodied agent that repeats those actions. The vault is solved by composing three demonstrations into one coordinated heist.

## Hard truth about winning

The total competition pool is 10 TAO, but the official first prize is 5 TAO. This pack cannot promise placement. It is an execution plan aimed at the published 40/30/20/10 rubric and the current competitive gap.
