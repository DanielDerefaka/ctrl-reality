import puppeteer from 'puppeteer';
import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
const url = process.argv[2] || 'http://127.0.0.1:4173/game/';
const out = new URL('../production/evidence/floor/', import.meta.url);
await mkdir(out, { recursive:true });
const browser = await puppeteer.launch({ headless:true });
const errors = [], failedRequests = [], externalRequests = [], checks = [], frames = [];
const page = await browser.newPage();
const pause = ms => new Promise(resolve => setTimeout(resolve, ms));
function watch(p) {
  p.on('pageerror', error => errors.push(String(error)));
  p.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()); });
  p.on('requestfailed', request => failedRequests.push(`${request.url()} ${request.failure()?.errorText}`));
  p.on('response', response => { if (response.status() >= 400) failedRequests.push(`${response.status()} ${response.url()}`); });
  p.on('request', request => { if (!request.url().startsWith(url) && !request.url().startsWith('about:')) externalRequests.push(request.url()); });
}
watch(page);
const check = (name, condition) => { assert.ok(condition, name); checks.push(name); };
const game = () => page.evaluate(() => structuredClone(window.__GAME__));
const wait = (fn, ...args) => page.waitForFunction(fn, { timeout:10000 }, ...args);
const frame = async name => { const file = `${name}-390x844.png`; await page.screenshot({path:fileURLToPath(new URL(file,out))}); frames.push(file); };
const rect = selector => page.$eval(selector, e => { const r=e.getBoundingClientRect(); return {x:r.x+r.width/2,y:r.y+r.height/2,width:r.width,height:r.height}; });
const client = await page.createCDPSession();
const touches = new Map();
async function touch(type, id, x, y) {
  let point;
  if (type === 'touchEnd') { point = touches.get(id); touches.delete(id); }
  else if (type === 'touchCancel') touches.clear();
  else { point = {id,x,y,radiusX:5,radiusY:5,force:1}; touches.set(id,point); }
  // CDP sends the changed contact, including the contact being ended (not its siblings).
  await client.send('Input.dispatchTouchEvent',{type,touchPoints:point ? [point] : []});
}
let result = {};
try {
  await page.setViewport({width:390,height:844,deviceScaleFactor:1,isMobile:true,hasTouch:true});
  await page.setUserAgent('Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Mobile Safari/537.36');
  await page.goto(url,{waitUntil:'networkidle0'});
  await wait(() => window.__READY__ === true);
  check('all public hooks initialized; title waits for a user gesture', await page.evaluate(() => typeof window.__START__ === 'function' && window.__GAME__.ready && !window.__GAME__.started));
  await frame('00-title');
  const start = await rect('#start-button'); await page.touchscreen.tap(start.x,start.y);
  await wait(() => window.__GAME__.started && window.__GAME__.mode === 'playing');
  check('real touchscreen tap starts the floor',true);
  const camera = (await game()).camera;
  const initial = await game();
  check('specified spawn is used',initial.pos[0] === 0 && initial.pos[1] === 4.5);
  await frame('01-floor');
  for (const selector of ['#joystick-zone','#act-button','#rewind-button']) {
    const r = await rect(selector);
    check(`${selector} is >=64px and within the phone viewport`,r.width>=64 && r.height>=64 && r.x-r.width/2>=0 && r.x+r.width/2<=390 && r.y-r.height/2>=0 && r.y+r.height/2<=844);
  }
  const joy = await rect('.joystick-base');
  await touch('touchStart',1,joy.x,joy.y);
  await touch('touchMove',1,joy.x+100,joy.y-100);
  await wait(() => window.__GAME__.pos[0] > .7);
  let g = await game();
  check('real joystick drag moves player with a normalized vector',g.pos[1]<4.5 && Math.hypot(g.inputX,g.inputY)<=1.000001);
  check('touch does not scroll or zoom',await page.evaluate(() => scrollX===0 && scrollY===0 && visualViewport.scale===1));
  await frame('02-touch-movement');
  await touch('touchEnd',1);
  await wait(() => window.__GAME__.speed === 0 && window.__GAME__.inputX === 0 && window.__GAME__.inputY === 0);
  check('pointer release stops movement and recentres knob',await page.$eval('#joystick-knob',e=>e.style.transform==='translate(-50%, -50%)'));
  await touch('touchStart',2,joy.x,joy.y); await touch('touchMove',2,joy.x-30,joy.y);
  await wait(() => window.__GAME__.inputX < 0); await touch('touchCancel',2);
  await wait(() => window.__GAME__.speed === 0 && window.__GAME__.inputX === 0);
  check('real touch cancellation returns movement to zero',true);
  for (const [selector,field,id] of [['#act-button','actDown',3],['#rewind-button','rewindDown',4]]) {
    const r = await rect(selector); await touch('touchStart',id,r.x,r.y);
    await wait(key => window.__GAME__[key] === true,field);
    check(`${selector} visibly responds to touch`,await page.$eval(selector,e=>e.classList.contains('is-pressed')));
    await frame(field==='actDown'?'03-act':'04-rewind');
    await touch('touchMove',id,195,500); await touch('touchEnd',id);
    await wait(key => window.__GAME__[key] === false,field);
    check(`${selector} releases outside its bounds`,!(await page.$eval(selector,e=>e.classList.contains('is-pressed'))));
  }
  await page.keyboard.down('w'); await wait(() => window.__GAME__.inputY === -1);
  await touch('touchStart',5,joy.x,joy.y); await touch('touchMove',5,joy.x+35,joy.y);
  await wait(() => window.__GAME__.inputX > .8 && window.__GAME__.inputY === 0);
  await touch('touchEnd',5); await wait(() => window.__GAME__.speed === 0);
  await page.keyboard.up('w');
  check('touch takes movement ownership without resurrecting a held keyboard key',true);
  await touch('touchStart',6,joy.x,joy.y); await touch('touchMove',6,joy.x+35,joy.y);
  await page.keyboard.down('a'); await wait(() => window.__GAME__.inputX === -1);
  await page.keyboard.up('a'); await touch('touchEnd',6); await wait(() => window.__GAME__.speed === 0);
  check('keyboard takes ownership and releasing it leaves no stale joystick',true);
  const button = await rect('#act-button');
  await touch('touchStart',7,joy.x,joy.y); await touch('touchMove',7,joy.x,joy.y-35);
  await touch('touchStart',8,button.x,button.y);
  await wait(() => window.__GAME__.actDown && window.__GAME__.inputY < -.8);
  await touch('touchEnd',8); await wait(() => !window.__GAME__.actDown && window.__GAME__.inputY < -.8);
  await touch('touchEnd',7);
  check('two fingers can move and hold ACT independently',true);
  // Actual foreground switch exercises visibility/blur instead of calling game reset hooks.
  await page.keyboard.down('d');
  const other = await browser.newPage(); await other.bringToFront(); await pause(200);
  const hidden = await game(); await pause(300); const still = await game();
  check('backgrounding pauses simulation',Math.abs(hidden.elapsedTime-still.elapsedTime)<.02);
  await page.bringToFront(); await other.close(); await wait(() => window.__GAME__.mode === 'playing' && window.__GAME__.speed === 0);
  await page.keyboard.up('d');
  check('foreground resumes with cleared movement',true);
  // Drive to the rim via actual keys. The final actor circle must be fully contained.
  await page.keyboard.down('ArrowRight');
  await wait(() => Math.hypot(...window.__GAME__.pos)>5.7);
  await pause(300); g = await game();
  check('held input cannot move actor outside radius six',Math.hypot(...g.pos)<=5.720001);
  await page.keyboard.up('ArrowRight'); await frame('05-room-boundary');
  check('camera remains fixed during movement',JSON.stringify(g.camera)===JSON.stringify(camera));
  check('unimplemented puzzle fields stay truthful',g.echoCount===0 && !g.plateActive && !g.vaultOpen && !g.jewelTaken && !g.over && g.score===0 && g.loopTime===0);
  const metrics = await page.evaluate(() => {
    const gl = document.querySelector('canvas').getContext('webgl2');
    const ext = gl.getExtension('WEBGL_debug_renderer_info');
    return { telemetry:structuredClone(window.__GAME__), gpu:ext?gl.getParameter(ext.UNMASKED_RENDERER_WEBGL):gl.getParameter(gl.RENDERER), transferBytes:performance.getEntriesByType('resource').reduce((n,r)=>n+r.transferSize,0)+performance.getEntriesByType('navigation')[0].transferSize, viewport:{width:innerWidth,height:innerHeight}, devicePixelRatio, resources:performance.getEntriesByType('resource').map(r=>r.name) };
  });
  check('draw and triangle counters are nonzero and within floor budget',metrics.telemetry.draws>0 && metrics.telemetry.draws<250 && metrics.telemetry.tris>0 && metrics.telemetry.tris<300000);
  check('ready and transfer fit internal targets (unthrottled local browser)',metrics.telemetry.readyMs<5000 && metrics.transferBytes<6000000);
  // Real resize events; keep targets usable in landscape and with simulated notch insets.
  await page.setViewport({width:844,height:390,deviceScaleFactor:1,isMobile:true,hasTouch:true});
  await pause(100);
  check('landscape retains 64px action controls',(await rect('#act-button')).width>=64 && (await rect('#rewind-button')).width>=64);
  await page.setViewport({width:390,height:844,deviceScaleFactor:1,isMobile:true,hasTouch:true});
  await page.evaluate(()=>{document.documentElement.style.setProperty('--safe-bottom','34px');document.documentElement.style.setProperty('--safe-top','47px');});
  check('simulated safe inset keeps controls above bottom 34px',(await rect('#rewind-button')).y+44 <= 810);
  await page.evaluate(()=>{document.documentElement.style.removeProperty('--safe-bottom');document.documentElement.style.removeProperty('--safe-top');});
  const desktop = await browser.newPage(); watch(desktop);
  await desktop.setViewport({width:1365,height:768}); await desktop.goto(url,{waitUntil:'networkidle0'});
  await desktop.waitForFunction(()=>window.__READY__);
  await desktop.click('#start-button'); await desktop.waitForFunction(()=>window.__GAME__.started);
  check('desktop real click starts the floor',true);
  for (const [key,x,y] of [['w',0,-1],['s',0,1],['a',-1,0],['d',1,0],['ArrowUp',0,-1],['ArrowDown',0,1],['ArrowLeft',-1,0],['ArrowRight',1,0]]) {
    const before = await desktop.evaluate(()=>window.__GAME__.pos.slice());
    await desktop.keyboard.down(key);
    await desktop.waitForFunction((a,b)=>window.__GAME__.inputX===a && window.__GAME__.inputY===b,{},x,y);
    await desktop.waitForFunction(p=>Math.hypot(window.__GAME__.pos[0]-p[0],window.__GAME__.pos[1]-p[1])>.15,{},before);
    await desktop.keyboard.up(key);
    check(`desktop ${key} moves the player`,true);
  }
  for (const [key,field] of [['e','actDown'],['Space','actDown'],['r','rewindDown']]) {
    await desktop.keyboard.down(key);
    await desktop.waitForFunction(k=>window.__GAME__[k],{},field);
    check(`desktop ${key} highlights feedback`,await desktop.$eval('#keyboard-hint',(e,k)=>e.classList.contains(k==='actDown'?'act-held':'rewind-held'),field));
    await desktop.keyboard.up(key); await desktop.waitForFunction(k=>!window.__GAME__[k],{},field);
  }
  // Fresh page position stays near spawn. Walk straight into the closed gate.
  await desktop.keyboard.down('w');
  await desktop.waitForFunction(()=>window.__GAME__.pos[1] < 1);
  await pause(300);
  check('closed gate blocks keyboard travel',await desktop.evaluate(()=>window.__GAME__.pos[1]>=.909999));
  await desktop.keyboard.up('w');
  check('zero browser console/page errors',errors.length===0);
  check('zero failed or missing runtime requests',failedRequests.length===0);
  check('runtime requests stay entirely in the game folder',externalRequests.length===0);
  result = {pass:true,passed:checks.length,failed:0,date:new Date().toISOString(),url,browser:await browser.version(),physicalDevice:false,network:'unthrottled localhost',metrics,checks,frames,errors,failedRequests,externalRequests};
} catch (error) {
  await page.screenshot({path:fileURLToPath(new URL('failure.png',out))}).catch(()=>{});
  result = {pass:false,passed:checks.length,failed:1,date:new Date().toISOString(),error:error.stack,checks,errors,failedRequests,externalRequests}; process.exitCode=1;
} finally { await browser.close(); }
await writeFile(new URL('smoke-result.json',out),JSON.stringify(result,null,2)+'\n');
console.log(JSON.stringify(result,null,2));
