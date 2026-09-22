import * as THREE from '../vendor/three.module.js';
import { CONFIG } from '../config.js';
import { createClockFloor, createThief, createPressurePlate, createVaultGate, createJewelPedestal } from '../assets/manifest.js';

export function createChamber01(scene) {
  const root = new THREE.Group(); root.name = 'chamber-01'; scene.add(root);
  const floor = createClockFloor(); root.add(floor);
  const playerView = createThief(); playerView.position.set(CONFIG.spawn.x, .13, CONFIG.spawn.z); root.add(playerView);
  const plateView = createPressurePlate(); plateView.position.set(CONFIG.plate.x, .12, CONFIG.plate.z); root.add(plateView);
  const gateView = createVaultGate(); gateView.position.set(CONFIG.gate.x, .1, CONFIG.gate.z); root.add(gateView);
  const pedestalView = createJewelPedestal(); pedestalView.position.set(CONFIG.jewel.x, .1, CONFIG.jewel.z); root.add(pedestalView);

  // PROTOTYPE_ONLY: temporary spawn marker, not a verified 404 asset.
  const spawnRing = new THREE.Mesh(
    new THREE.RingGeometry(.48, .58, 32),
    new THREE.MeshBasicMaterial({ color: 0x70879a, transparent: true, opacity: .35, side: THREE.DoubleSide })
  );
  spawnRing.name = 'PROTOTYPE_ONLY_spawn_ring';
  spawnRing.rotation.x = -Math.PI / 2; spawnRing.position.set(CONFIG.spawn.x, .13, CONFIG.spawn.z); root.add(spawnRing);

  return {
    root,
    playerView,
    plateView,
    gateView,
    pedestalView,
    echoViews: [],
    addEcho(index) {
      const color = CONFIG.echoColors[index % CONFIG.echoColors.length];
      const view = createThief(color, true); view.position.y = .13; view.renderOrder = 2; root.add(view); this.echoViews.push(view); return view;
    },
    clearEchoes() { for (const view of this.echoViews) root.remove(view); this.echoViews.length = 0; },
    update(state, realTime) {
      playerView.position.set(state.player.x, .13, state.player.z);
      playerView.rotation.y = state.player.yaw;
      const top = plateView.getObjectByName('topPlate');
      if (top) top.position.y = state.plateActive ? .105 : .17;
      const indicator = plateView.getObjectByName('indicator');
      if (indicator?.material) indicator.material.emissiveIntensity = state.plateActive ? 1.2 : .25;
      const left = gateView.getObjectByName('leftDoor');
      const right = gateView.getObjectByName('rightDoor');
      const amount = state.doorOpen;
      if (left) left.position.x = -.47 - amount * .76;
      if (right) right.position.x = .47 + amount * .76;
      const jewel = pedestalView.getObjectByName('jewel');
      if (jewel) {
        jewel.visible = !state.jewelTaken;
        jewel.rotation.y = realTime * .7;
        jewel.position.y = 1.22 + Math.sin(realTime * 1.6) * .04;
      }
    },
  };
}
