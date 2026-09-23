# Zero Hour loop

Fixed 60 Hz gameplay; frame-independent rendering. Start the operation, engage the scout, breach the Skybridge airlock, then test crossfire against the Security Spine shield. The final core encounter remains planned.

Q/ECHO cycles RECORD → STORE → DEPLOY. Record at 30 Hz for at most six seconds; timestamps drive shot, dodge and interaction playback. One stored track and one active echo, four-second cooldown. An echo expires rather than holding its last pose. Repositioning after store does not mutate the track. Echoes can fire and use eligible scanners but cannot transition the mission or secure its core.

Pulse carbine: 24/144 ammunition, .14s fire interval, 1.35s reload. Shields require two actor kinds, sufficiently different directions, and an .8s window. Pure tests reject same-actor, same-direction and late attacks. Aim assist must respect geometry occlusion.

Pause/blur resets input and freezes simulation. Scene changes clear transient recording/echo state and unload all owned resources. End Evaluation opens truthful incomplete results; it is not mission victory.
