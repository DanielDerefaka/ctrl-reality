#!/usr/bin/env node
import puppeteer from 'puppeteer';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const url = process.argv.find((arg) => /^https?:\/\//.test(arg)) || 'http://127.0.0.1:4173/game/';
const commitArg = process.argv.find((arg) => arg.startsWith('--commit='));
const commit = commitArg?.slice('--commit='.length) || 'local-uncommitted';
const here = path.dirname(fileURLToPath(import.meta.url));
const outputDir = path.resolve(here, '..', 'production', 'gate-runs');
await mkdir(outputDir, { recursive: true });
const stamp = new Date().toISOString().replaceAll(':', '-').replaceAll('.', '-');
const errors = [];
const failedRequests = [];
const frames = [];
const assertions = [];
const startedAt = performance.now();

function assert(value, message) {
  assertions.push({ pass: Boolean(value), message });
  if (!value) throw new Error(message);
}

const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'] });
const page = await browser.newPage();
await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 1, isMobile: true, hasTouch: true });
page.on('console', (msg) => { if (msg.type() === 'error') errors.push(`console: ${msg.text()}`); });
page.on('pageerror', (error) => errors.push(`pageerror: ${error.message}`));
page.on('requestfailed', (request) => failedRequests.push(`${request.failure()?.errorText}: ${request.url()}`));
page.on('response', (response) => { if (response.status() >= 400) failedRequests.push(`${response.status()}: ${response.url()}`); });

async function screenshot(label) {
  const file = path.join(outputDir, `${stamp}-${label}.png`);
  await page.screenshot({ path: file });
  frames.push(file);
}

async function waitGame(predicate, description, timeout = 12000) {
  await page.waitForFunction(predicate, { timeout });
  assertions.push({ pass: true, message: description });
}

async function rect(selector) {
  return page.$eval(selector, (el) => {
    const r = el.getBoundingClientRect();
    return { x: r.x, y: r.y, width: r.width, height: r.height };
  });
}

const client = await page.createCDPSession();
let touchId = 17;
async function dispatchTouch(type, x, y) {
  const touchPoints = type === 'touchEnd' ? [] : [{ x, y, id: touchId, radiusX: 8, radiusY: 8, force: .8 }];
  await client.send('Input.dispatchTouchEvent', { type, touchPoints });
}

async function tap(selector) {
  const r = await rect(selector);
  const x = r.x + r.width / 2;
  const y = r.y + r.height / 2;
  touchId += 1;
  await dispatchTouch('touchStart', x, y);
  await new Promise(r => setTimeout(r, 70));
  await dispatchTouch('touchEnd', x, y);
}

async function driveTo(targetX, targetZ, timeout = 12000) {
  const r = await rect('[data-testid="joystick"] .joystick-base');
  const cx = r.x + r.width / 2;
  const cy = r.y + r.height / 2;
  const reach = r.width * .31;
  touchId += 1;
  await dispatchTouch('touchStart', cx, cy);
  const begin = Date.now();
  try {
    while (Date.now() - begin < timeout) {
      const pos = await page.evaluate(() => window.__GAME__?.pos);
      if (!Array.isArray(pos)) throw new Error('missing telemetry position');
      const dx = targetX - pos[0];
      const dz = targetZ - pos[1];
      const distance = Math.hypot(dx, dz);
      if (distance < .30) return;
      const scale = reach / Math.max(distance, 1e-6);
      const x = cx + dx * scale;
      const y = cy + dz * scale;
      await dispatchTouch('touchMove', x, y);
      await new Promise(r => setTimeout(r, 80));
    }
    throw new Error(`driveTo timeout for ${targetX},${targetZ}`);
  } finally {
    await dispatchTouch('touchEnd', cx, cy);
  }
}

let result;
try {
  const response = await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 });
  assert(response?.ok(), `URL should return success: ${url}`);
  await waitGame(() => window.__READY__ === true && window.__GAME__?.ready === true, 'runtime reports ready');
  await screenshot('00-title');
  await tap('[data-testid="start-button"]');
  await waitGame(() => window.__GAME__?.started === true && window.__GAME__?.mode === 'playing', 'visible Start tap begins game');
  await screenshot('01-started');

  await driveTo(-2.55, 1.85);
  await waitGame(() => window.__GAME__?.plateActive === true, 'current player reaches pressure plate');
  await screenshot('02-on-plate');
  await tap('[data-testid="rewind-button"]');
  await waitGame(() => window.__GAME__?.echoCount >= 1, 'rewind creates an echo');
  await waitGame(() => window.__GAME__?.mode === 'playing', 'rewind transition completes');
  await screenshot('03-echo-created');

  await waitGame(() => window.__GAME__?.plateActive === true && window.__GAME__?.vaultOpen === true, 'echo activates plate and opens gate', 12000);
  await screenshot('04-echo-opens-gate');
  await driveTo(0, -3.62, 16000);
  await screenshot('05-at-jewel');
  await tap('[data-testid="act-button"]');
  await waitGame(() => window.__GAME__?.jewelTaken === true && window.__GAME__?.over === true, 'current player takes jewel and completes chamber');
  await screenshot('06-complete');

  const telemetry = await page.evaluate(() => structuredClone(window.__GAME__));
  assert(errors.length === 0, `expected zero console/page errors, found ${errors.length}`);
  assert(failedRequests.length === 0, `expected zero failed requests/HTTP errors, found ${failedRequests.length}`);
  result = { pass: true, url, commit, elapsedMs: Math.round(performance.now() - startedAt), telemetry, assertions, errors, failedRequests, frames };
} catch (error) {
  await screenshot('FAILED').catch(() => {});
  result = { pass: false, url, commit, elapsedMs: Math.round(performance.now() - startedAt), error: error?.stack || String(error), assertions, errors, failedRequests, frames };
  process.exitCode = 1;
} finally {
  await browser.close();
}

const jsonPath = path.join(outputDir, `${stamp}-verdict.json`);
await writeFile(jsonPath, JSON.stringify(result, null, 2));
const mdPath = path.join(outputDir, `${stamp}-summary.md`);
await writeFile(mdPath, `# SECOND HANDS custom gate\n\n- Result: **${result.pass ? 'PASS' : 'FAIL'}**\n- URL: ${url}\n- Commit: ${commit}\n- Elapsed: ${result.elapsedMs} ms\n- Errors: ${errors.length}\n- Failed requests: ${failedRequests.length}\n- JSON: ${path.basename(jsonPath)}\n`);
console.log(JSON.stringify(result, null, 2));
