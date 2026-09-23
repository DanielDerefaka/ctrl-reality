// Development-only helpers. Never import this directory from game/.
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseEnv } from 'node:util';
import { createHash } from 'node:crypto';
import { isIP } from 'node:net';
export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
export class PipelineError extends Error {
  constructor(code, message = code) { super(message); this.code = code; }
}
export const fail = (code, message) => { throw new PipelineError(code, message); };
export async function environment() {
  let local = {};
  try { local = parseEnv(await fs.readFile(path.join(ROOT, '.env.local'), 'utf8')); }
  catch (e) { if (e.code !== 'ENOENT') fail('ENV_READ_FAILED'); }
  return { ...local, ...process.env };
}
export function requireKeys(env, names) {
  const missing = names.filter(k => !env[k]?.trim() || /^(your_|YOUR_|REPLACE)/.test(env[k]));
  if (missing.length) fail('MISSING_CREDENTIALS', `Missing local variables: ${missing.join(', ')}`);
}
export function sanitize(value, env = {}) {
  const secrets = ['HF_API_KEY_ID', 'HF_API_KEY_SECRET', 'VLLM_API_KEY'].map(k => env[k]).filter(Boolean);
  const visit = (v, key = '') => {
    if (/secret|authorization|api.?key|token|password/i.test(key)) return '[REDACTED]';
    if (Array.isArray(v)) return v.map(x => visit(x));
    if (v && typeof v === 'object') return Object.fromEntries(Object.entries(v).map(([k,x]) => [k, visit(x,k)]));
    if (typeof v === 'string') for (const secret of secrets) v = v.split(secret).join('[REDACTED]');
    return v;
  };
  return visit(value);
}
export const sha = value => createHash('sha256').update(value).digest('hex');
export async function json(file, data, env) {
  await fs.writeFile(file, JSON.stringify(sanitize(data, env), null, 2) + '\n', { mode: 0o600 });
}
export function httpsURL(value, host) {
  let u; try { u = new URL(value); } catch { fail('INVALID_HTTPS_URL'); }
  if (u.protocol !== 'https:' || u.username || u.password || u.hash || (host && u.hostname !== host) || u.port)
    fail('UNTRUSTED_URL');
  return u;
}
export function apiURL(value, host) {
  const u = httpsURL(value, host);
  if (u.search) fail('QUERY_CREDENTIALS_FORBIDDEN');
  return u.href;
}
export async function outputDirectory(value, overwrite = false, resume = false) {
  const target = path.resolve(ROOT, value);
  const allowed = path.join(ROOT, 'production');
  if (!target.startsWith(allowed + path.sep)) fail('OUTPUT_OUTSIDE_PRODUCTION');
  // Check existing ancestors to prevent a symlink from moving evidence into game/ or outside the repo.
  let ancestor = target;
  while (true) {
    try { if (await fs.realpath(ancestor) !== ancestor) fail('SYMLINK_OUTPUT'); break; }
    catch (e) { if (e.code !== 'ENOENT') throw e; ancestor = path.dirname(ancestor); }
  }
  const exists = await fs.stat(target).then(() => true, () => false);
  if (exists && !resume) {
    if (!overwrite) fail('EVIDENCE_EXISTS', 'Evidence exists; use a new output directory or --overwrite to archive the old run.');
    await fs.rename(target, target + '.archived-' + Date.now());
  }
  if (!exists && resume) fail('NO_RECEIPT_TO_RESUME');
  await fs.mkdir(target, { recursive: true });
  return target;
}
export const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
export async function request(url, options = {}, fetcher = fetch) {
  let response;
  try { response = await fetcher(url, { redirect: 'error', signal: AbortSignal.timeout(30000), ...options }); }
  catch { fail('NETWORK_OR_TIMEOUT'); }
  if (!response.ok) fail(`HTTP_${response.status}`); // Never log the response body or authenticated URL.
  return response;
}
export async function requestJSON(url, options, fetcher) {
  const response = await request(url, options, fetcher);
  try { return await response.json(); } catch { fail('INVALID_JSON_RESPONSE'); }
}
export async function downloadImage(url, fetcher = fetch) {
  const u = httpsURL(url);
  if (isIP(u.hostname) || u.hostname === 'localhost' || !u.hostname.includes('.') || /\.(local|internal)$/.test(u.hostname)) fail('INVALID_MEDIA_HOST');
  const response = await request(u.href, {}, fetcher); // No API credentials sent to media host. Redirects rejected.
  const type = response.headers.get('content-type')?.split(';')[0];
  const ext = { 'image/png':'png', 'image/jpeg':'jpg', 'image/webp':'webp' }[type];
  if (!ext) fail('UNSUPPORTED_IMAGE_TYPE');
  const chunks = []; let size = 0;
  for await (const chunk of response.body) {
    size += chunk.length;
    if (size > 20 * 1024 * 1024) fail('IMAGE_TOO_LARGE');
    chunks.push(chunk);
  }
  const bytes = Buffer.concat(chunks);
  const valid = ext === 'png' ? bytes.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10])) : ext === 'jpg' ? bytes[0] === 255 && bytes[1] === 216 : bytes.toString('ascii',0,4) === 'RIFF' && bytes.toString('ascii',8,12) === 'WEBP';
  if (!valid) fail('INVALID_IMAGE_BYTES');
  return { bytes, ext };
}
export function isCLI(meta) { return process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(meta); }
export function cliError(e) {
  console.error(e instanceof PipelineError ? `${e.code}: ${e.message}` : 'PIPELINE_FAILED: inspect local receipts; raw exception withheld to protect credentials.');
  process.exitCode = 1;
}
