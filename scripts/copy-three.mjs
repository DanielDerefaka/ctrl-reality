import { copyFile, mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
const vendor = new URL('../game/vendor/', import.meta.url);
await mkdir(vendor, { recursive: true });
// r180's WebGL module imports three.core.js; copying only the entry module cannot boot.
for (const name of ['three.module.js', 'three.core.js']) {
  await copyFile(new URL(`../node_modules/three/build/${name}`, import.meta.url), new URL(name, vendor));
}
await copyFile(new URL('../node_modules/three/LICENSE', import.meta.url), new URL('THREE-LICENSE.txt', vendor));
console.log(`Copied Three.js 0.180.0 module, core, and license to ${fileURLToPath(vendor)}`);
