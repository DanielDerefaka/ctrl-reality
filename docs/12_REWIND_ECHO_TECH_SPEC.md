# Six-second combat echo

The old 20-second rewind/three-echo system is superseded. Current action states: ready → recording (<=6s) → stored → active echo → four-second cooldown. One stored track and one active echo.

Frames capture simulation timestamp, player position/facing, aim yaw/pitch and animation pose at 30Hz. Timestamped events capture shots (world origin + normalized direction), dodge, and scanner interaction with stable target ID and recorded position. Stored tracks are structured clones; later player movement cannot mutate them.

Playback interpolates recorded positions, uses recorded facing/pose, dispatches each event once through a monotonic cursor, fires recorded rays against current eligible targets, and can authenticate the phase scanner. Echo actor collision is disabled. It expires shortly after the recording ends rather than holding a final plate pose. Scene transitions clear recordings/echo/cooldown.

Shield validation: different player/echo kind, two directions with dot < .64, time difference <= .8 seconds. Tests include positive left/right synchronized playback and negative same actor/direction/late shots. The echo cannot secure objectives or advance sections for the player. Aim orientation interpolation and authored animations remain a refinement task, not a final animation claim.
