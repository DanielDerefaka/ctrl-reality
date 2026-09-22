// PROTOTYPE_ONLY: Every object in this file must be replaced through the verified 404 recipe.
import * as THREE from '../vendor/three.module.js';

const palette = {
  lacquer: 0x14131a,
  brass: 0xa77b3e,
  brassLight: 0xe6c978,
  porcelain: 0xe7e0d2,
  moon: 0x70879a,
  cyan: 0x55d9e2,
  jewel: 0xc8fff2,
};

function material(color, options = {}) {
  return new THREE.MeshStandardMaterial({ color, roughness: options.roughness ?? 0.55, metalness: options.metalness ?? 0.15, transparent: options.transparent ?? false, opacity: options.opacity ?? 1, emissive: options.emissive ?? 0x000000, emissiveIntensity: options.emissiveIntensity ?? 0 });
}

export function createPrototypeFloor() {
  const group = new THREE.Group(); group.name = 'PROTOTYPE_ONLY_floor';
  const floor = new THREE.Mesh(new THREE.CylinderGeometry(6, 6, 0.18, 64), material(0x292632, { metalness: .15, roughness: .72 }));
  floor.receiveShadow = true; group.add(floor);
  for (const radius of [2.15, 4.1, 5.65]) {
    const ring = new THREE.Mesh(new THREE.TorusGeometry(radius, .045, 8, 96), material(palette.brass, { metalness: .72, roughness: .35 }));
    ring.rotation.x = Math.PI / 2; ring.position.y = .12; group.add(ring);
  }
  return group;
}

export function createPrototypeThief(color = palette.porcelain, echo = false) {
  const group = new THREE.Group(); group.name = 'PROTOTYPE_ONLY_thief';
  const bodyMat = material(color, { roughness: .44, transparent: echo, opacity: echo ? .48 : 1, emissive: echo ? color : 0, emissiveIntensity: echo ? .28 : 0 });
  const brassMat = material(palette.brass, { metalness: .72, roughness: .28, transparent: echo, opacity: echo ? .5 : 1 });
  const body = new THREE.Mesh(new THREE.CapsuleGeometry(.22, .34, 5, 10), bodyMat); body.position.y = .62; body.castShadow = !echo; group.add(body);
  const head = new THREE.Mesh(new THREE.OctahedronGeometry(.29, 1), bodyMat); head.scale.set(1, .78, .82); head.position.y = 1.04; head.castShadow = !echo; group.add(head);
  for (const side of [-1, 1]) {
    const arm = new THREE.Mesh(new THREE.CapsuleGeometry(.065, .28, 4, 8), brassMat); arm.position.set(side * .31, .67, 0); arm.rotation.z = side * .16; group.add(arm);
    const leg = new THREE.Mesh(new THREE.CapsuleGeometry(.075, .29, 4, 8), brassMat); leg.position.set(side * .12, .25, 0); group.add(leg);
  }
  return group;
}

export function createPrototypePlate() {
  const group = new THREE.Group(); group.name = 'PROTOTYPE_ONLY_plate';
  const base = new THREE.Mesh(new THREE.CylinderGeometry(.78, .78, .14, 8), material(palette.brass, { metalness: .7, roughness: .35 })); base.position.y = .07; group.add(base);
  const top = new THREE.Mesh(new THREE.CylinderGeometry(.61, .65, .12, 8), material(palette.porcelain, { roughness: .55 })); top.position.y = .17; top.name = 'topPlate'; group.add(top);
  const light = new THREE.Mesh(new THREE.TorusGeometry(.63, .035, 6, 24), material(palette.brassLight, { emissive: palette.brassLight, emissiveIntensity: .25 })); light.rotation.x = Math.PI / 2; light.position.y = .24; light.name = 'indicator'; group.add(light);
  return group;
}

export function createPrototypeGate() {
  const group = new THREE.Group(); group.name = 'PROTOTYPE_ONLY_gate';
  const brassMat = material(palette.brass, { metalness: .75, roughness: .32 });
  const frameMat = material(palette.lacquer, { metalness: .35, roughness: .5 });
  for (const x of [-1.25, 1.25]) {
    const pillar = new THREE.Mesh(new THREE.BoxGeometry(.34, 2.25, .46), frameMat); pillar.position.set(x, 1.12, 0); pillar.castShadow = true; group.add(pillar);
  }
  const top = new THREE.Mesh(new THREE.BoxGeometry(2.84, .34, .46), frameMat); top.position.y = 2.08; group.add(top);
  const ring = new THREE.Mesh(new THREE.TorusGeometry(1.03, .12, 8, 32, Math.PI), brassMat); ring.position.y = 1.03; ring.rotation.z = Math.PI; group.add(ring);
  const left = new THREE.Mesh(new THREE.BoxGeometry(.92, 1.9, .16), brassMat); left.position.set(-.47, .96, 0); left.name = 'leftDoor'; group.add(left);
  const right = left.clone(); right.position.x = .47; right.name = 'rightDoor'; group.add(right);
  return group;
}

export function createPrototypePedestal() {
  const group = new THREE.Group(); group.name = 'PROTOTYPE_ONLY_pedestal';
  const base = new THREE.Mesh(new THREE.CylinderGeometry(.55, .7, .78, 12), material(palette.lacquer, { metalness: .35 })); base.position.y = .39; group.add(base);
  const trim = new THREE.Mesh(new THREE.TorusGeometry(.56, .055, 7, 24), material(palette.brass, { metalness: .7 })); trim.rotation.x = Math.PI / 2; trim.position.y = .78; group.add(trim);
  const jewel = new THREE.Mesh(new THREE.OctahedronGeometry(.27, 1), material(palette.jewel, { transparent: true, opacity: .78, emissive: palette.cyan, emissiveIntensity: .55, roughness: .12 })); jewel.position.y = 1.22; jewel.name = 'jewel'; group.add(jewel);
  return group;
}
