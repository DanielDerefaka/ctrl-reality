# Boot Atrium scene and interaction

Start deck spans x±5.4, z9 to −4.1. Far platform spans x±4.8, z−10 to −20. The bridge is 2.9 units wide across the intervening void. Socket at (−2, −2.2); fragment positions are authored in game/src/model.js. A far checkpoint at z−12 preserves the installed bridge. Restore pedestal at (0,−17) ends this sector.

Simulation runs at 60Hz with normalized diagonal movement and bounded catch-up. Presentation interpolation is independent. Socket installation validates actor proximity as well as pointer target; remote dragging cannot solve the puzzle. Keyboard/ACT supports select/install/retrieve. Card deployment materializes a luminous object and sequential bridge segments. The destination is reachable only with the bridge restored. A fall suspends movement for 1.25 simulation seconds and restores checkpoint state once.

Static architectural surfaces are merged by material to reduce draw calls; geometry is procedurally constructed. Floor engraving and soft light sprites are authored canvas textures. No imported meshes or runtime generation APIs. Animation joints have named pivots; procedural states blend over 190ms. Detailed final coat deformation and foot planting remain production work.

Results derive elapsed simulation time, resets, collected fragments and control moves from actual play. The screen reports sector restoration and explicitly marks later chapters as future work.

Visual-lock renderer: selected 404 modules through the official local loader; one distant image plane only for noninteractive archive scale. Desktop/portrait camera FOV52/54, limited adjustment and raycast camera boom. Floor reflection is 768×512 desktop / 512×384 portrait, every third/fourth frame; performance reports include reflection and shadow passes. Gameplay bridge timing is unchanged; twelve distinct visible segments assemble in order. No gameplay collision is taken from matte images.
