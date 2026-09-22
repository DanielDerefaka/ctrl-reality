import { readdir, readFile, stat } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root = fileURLToPath(new URL('../', import.meta.url));
const game = path.join(root, 'game');
const forbidden = new Set(['.glb','.gltf','.fbx','.obj','.blend','.stl','.dae','.3ds']);
const findings = [];
let modules = 0, references = 0;
async function reference(file, specifier) {
  references++;
  if (/^(https?:|\/\/|data:)/i.test(specifier)) { findings.push(`Nonlocal dependency: ${file}: ${specifier}`); return; }
  if (!specifier.startsWith('.')) { findings.push(`Unresolved/absolute dependency: ${file}: ${specifier}`); return; }
  const target = path.resolve(path.dirname(file), specifier.split(/[?#]/)[0]);
  if (!target.startsWith(game + path.sep)) findings.push(`Escapes game: ${file}: ${specifier}`);
  try { await stat(target); } catch { findings.push(`Missing dependency: ${file}: ${specifier}`); }
}
async function walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes:true })) {
    const file = path.join(dir,entry.name);
    if (entry.isDirectory()) { await walk(file); continue; }
    const ext = path.extname(file);
    if (forbidden.has(ext)) findings.push(`Forbidden mesh: ${file}`);
    if (!['.js','.mjs','.css','.html'].includes(ext)) continue;
    const text = await readFile(file,'utf8');
    if (ext === '.js' || ext === '.mjs') {
      modules++;
      const parsed = spawnSync(process.execPath,['--check',file],{encoding:'utf8'});
      if (parsed.status !== 0) findings.push(parsed.stderr);
      for (const match of text.matchAll(/(?:from\s*|import\s*\(\s*|import\s*)['"]([^'"]+)['"]/g)) await reference(file,match[1]);
      // SDK URLs in comments/errors are not network requests. Verify vendor bytes separately.
      if (!file.includes(`${path.sep}vendor${path.sep}`) && /(?:fetch|WebSocket|importScripts)\s*\(\s*['"]https?:/i.test(text)) findings.push(`Remote request: ${file}`);
    }
    if (ext === '.html') {
      for (const match of text.matchAll(/(?:src|href)=["']([^"']+)["']/g)) await reference(file,match[1]);
      for (const match of text.matchAll(/import\s*\(\s*['"]([^'"]+)['"]/g)) await reference(file,match[1]);
    }
    if (ext === '.css') for (const match of text.matchAll(/url\(['"]?([^)'"\s]+)['"]?\)/g)) await reference(file,match[1]);
  }
}
await walk(game);
for (const file of ['three.module.js','three.core.js']) {
  const hash = async p => createHash('sha256').update(await readFile(p)).digest('hex');
  try {
    if (await hash(path.join(game,'vendor',file)) !== await hash(path.join(root,'node_modules/three/build',file))) findings.push(`Vendor mismatch: ${file}`);
  } catch { findings.push(`Run npm install and npm run setup: ${file} missing`); }
}
if (findings.length) { console.error(findings.join('\n')); process.exit(1); }
console.log(`Static check PASS: ${modules} modules parsed, ${references} local references verified; pinned vendor matches; no forbidden mesh files.`);
