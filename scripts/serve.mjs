import http from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '../game');
const port = Number(process.env.PORT || 4173);
const host = process.env.HOST || '0.0.0.0';

const TYPES = new Map([
  ['.html', 'text/html; charset=utf-8'],
  ['.js', 'text/javascript; charset=utf-8'],
  ['.mjs', 'text/javascript; charset=utf-8'],
  ['.css', 'text/css; charset=utf-8'],
  ['.json', 'application/json; charset=utf-8'],
  ['.svg', 'image/svg+xml'],
  ['.png', 'image/png'],
  ['.webp', 'image/webp'],
  ['.ogg', 'audio/ogg'],
  ['.wav', 'audio/wav'],
]);

function safePath(urlPath) {
  const pathname = decodeURIComponent(new URL(urlPath, 'http://local').pathname);
  if (!pathname.startsWith('/game/')) return null;
  const relative = pathname.slice(5);
  const candidate = path.resolve(root, `.${relative}`);
  if (!candidate.startsWith(root + path.sep) && candidate !== root) return null;
  return candidate;
}

const server = http.createServer(async (req, res) => {
  try {
    if (req.url === '/' || req.url === '/game') { res.writeHead(302, { Location: '/game/' }).end(); return; }
    let filePath = safePath(req.url || '/');
    if (!filePath) {
      res.writeHead(403).end('Forbidden');
      return;
    }
    let info = await stat(filePath);
    if (info.isDirectory()) {
      filePath = path.join(filePath, 'index.html');
      info = await stat(filePath);
    }
    const body = await readFile(filePath);
    res.writeHead(200, {
      'Content-Type': TYPES.get(path.extname(filePath).toLowerCase()) || 'application/octet-stream',
      'Cache-Control': 'no-store',
      'Cross-Origin-Resource-Policy': 'same-origin',
    });
    res.end(body);
  } catch (error) {
    const status = error?.code === 'ENOENT' ? 404 : 500;
    res.writeHead(status, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end(status === 404 ? 'Not found' : 'Server error');
  }
});

server.listen(port, host, () => {
  console.log(`SECOND HANDS floor: http://127.0.0.1:${port}/game/`);
  if (host === '0.0.0.0') console.log('For phone testing, use this computer’s LAN IP with the same port.');
});
