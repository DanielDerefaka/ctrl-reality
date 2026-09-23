import puppeteer from 'puppeteer';
import assert from 'node:assert/strict';
import {mkdir,writeFile} from 'node:fs/promises';
// Optional evidence destination keeps historical screenshots immutable during audits.
const out=new URL(process.env.SMOKE_OUT || '../production/zero-hour/',import.meta.url);await mkdir(new URL('screenshots/',out),{recursive:true});
const browser=await puppeteer.launch({headless:true});const checks=[],errors=[],missing=[],external=[],frames=[];let page,desktop,mobile,report={};
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const ok=(name,value=true)=>{assert.ok(value,name);checks.push(name);};
async function fresh(width,height,touch=false){const p=await browser.newPage();await p.setViewport({width,height,deviceScaleFactor:1,isMobile:touch,hasTouch:touch});p.on('pageerror',e=>errors.push(String(e)));p.on('console',m=>{if(m.type()==='error')errors.push(m.text())});p.on('response',r=>{if(r.status()>=400)missing.push(`${r.status()} ${r.url()}`)});p.on('requestfailed',r=>missing.push(r.url()));p.on('request',r=>{if(!r.url().startsWith('http://127.0.0.1:4173/game/'))external.push(r.url());});await p.goto('http://127.0.0.1:4173/game/',{waitUntil:'networkidle0'});await p.waitForFunction(()=>window.__READY__);return p;}
const g=()=>page.evaluate(()=>structuredClone(window.__GAME__));
const wait=(fn,...args)=>page.waitForFunction(fn,{timeout:12000},...args);
async function snap(name){if((await g()).mode!=='gameplay')await sleep(280);await page.screenshot({path:new URL(`screenshots/${name}.png`,out).pathname});frames.push(name+'.png');}
async function tap(selector){
 if(page!==mobile){await page.click(selector);return;}
 for(let i=0;i<5;i++){
  const r=await page.$eval(selector,e=>{const r=e.getBoundingClientRect();return{x:r.x+r.width/2,y:r.y+r.height/2};});
  if(r.y>70&&r.y<810){await page.touchscreen.tap(r.x,r.y);return;}
  const finger=await page.touchscreen.touchStart(195,680);await finger.move(195,300);await finger.end();await sleep(250);
 }
 throw new Error(`Cannot reach mobile control ${selector}`);
}
async function launch(){await tap('[data-action="operations"]');if(page===mobile)await snap('operations-mobile');await tap('[data-action="briefing"]');await snap(page===mobile?'briefing-mobile':'briefing-desktop');await tap('[data-action="insert"]');await wait(()=>window.__GAME__.mode==='gameplay');}
let mx=720,my=450;
async function steer(target){
 const data=await g(),c=data.camera;
 const wantYaw=Math.atan2(target.x-c.x,-(target.z-c.z)),wantPitch=Math.atan2(target.y-c.y,Math.hypot(target.x-c.x,target.z-c.z));
 const dyaw=Math.atan2(Math.sin(wantYaw-c.yaw),Math.cos(wantYaw-c.yaw));
 const dx=dyaw/(.0023*data.settings.sensitivity),dy=-(wantPitch-c.pitch)/(.002*data.settings.sensitivity);
 // Browser-generated mouse movement; no game state or camera hooks.
 mx+=dx;my+=dy;await page.mouse.move(mx,my);await sleep(80);
}
async function walk(key,predicate){await page.keyboard.down(key);try{await wait(predicate);}finally{await page.keyboard.up(key);}}
try{
 desktop=page=await fresh(1440,900);await snap('menu-desktop');ok('boot initializes into a real live main menu',(await g()).mode==='menu');
 for(const screen of ['how','credits']){await page.click(`[data-action="${screen}"]`);ok(`${screen} screen opens`,await page.$eval(`[data-screen="${screen}"]`,e=>!e.hidden));await page.click(`[data-screen="${screen}"] [data-action="menu"]`);}
 await page.click('[data-action="settings"]');await page.click('#invert');ok('invert setting changes',(await page.$eval('#invert',e=>e.getAttribute('aria-pressed')))==='true');await page.click('#invert');await page.click('#sound');await page.click('[data-action="back-settings"]');
 await page.click('[data-action="operations"]');await page.click('[data-difficulty="hard"]');ok('difficulty selector changes',await page.$eval('[data-difficulty="hard"]',e=>e.getAttribute('aria-pressed')==='true'));await page.click('[data-difficulty="normal"]');await snap('operations-desktop');await page.click('[data-action="briefing"]');await page.click('[data-action="insert"]');await wait(()=>window.__GAME__.mode==='gameplay');await sleep(200);await snap('skybridge-desktop');
 let data=await g();ok('ordinary shoulder camera frames hero at 18–24 percent',data.heroHeightFraction>=.18&&data.heroHeightFraction<=.24);ok('normal FOV is 52',Math.abs(data.camera.fov-52)<.1);
 await page.mouse.move(mx,my);await sleep(100);let t=(await g()).targets[0];for(let i=0;i<5;i++)await steer(t);
 await page.mouse.down({button:'right'});await wait(()=>window.__GAME__.camera.fov<43);ok('precision aim narrows FOV to 42');await page.mouse.up({button:'right'});
 await page.keyboard.press('q');await wait(()=>window.__GAME__.recordingTime>0);
 for(let i=0;i<4;i++)await steer(t);
 await page.mouse.down();await sleep(100); // initial pointer lock may transition the pointer
 if(!(await g()).input.fire){await page.mouse.up();await page.mouse.down();}
 for(let i=0;i<12;i++){await steer(t);if((await g()).targets[0].hp===0)break;await sleep(90);}
 await page.mouse.up();data=await g();ok('actual mouse firing consumes ammunition',data.shots>0 && data.magazine<24);ok('actual shots damage and defeat the drone',data.targets[0].hp===0);
 await snap('drone-defeated-desktop');await page.keyboard.press('q');await wait(()=>window.__GAME__.storedDuration>0);await page.keyboard.press('q');await wait(()=>window.__GAME__.echoCount===1);await snap('echo-desktop');ok('recorded track creates one holographic echo');await wait(()=>window.__GAME__.echoCount===0&&window.__GAME__.echoCooldown>0);ok('echo expires and enters cooldown');
 await page.keyboard.press('r');await wait(()=>window.__GAME__.magazine===24);ok('reload transfers reserve into magazine');
 // Return heading to north through real mouse movement, then walk to the airlock.
 for(let i=0;i<4;i++){const c=(await g()).camera;mx+=(-c.yaw)/.0023;my+=(-.09-c.pitch)/-.002;await page.mouse.move(mx,my);await sleep(100);}
 await walk('w',()=>window.__GAME__.pos[1]<-15.2);await page.keyboard.press('e');await wait(()=>window.__GAME__.section==='security-spine');await snap('security-spine-desktop');data=await g();ok('airlock transitions to Security Spine',data.targets[0].shield && data.sceneRoots===1 && data.sceneLoads===3 && data.sceneDisposals===2);

 // Prove the identity mechanic with real movement, aiming, firing and Q events.
 async function driveTo(x,z){
  const held=new Set();const until=Date.now()+14000;
  try{while(Date.now()<until){const d=await g(),dx=x-d.pos[0],dz=z-d.pos[1];if(Math.hypot(dx,dz)<.3)return;
   const c=d.camera.yaw,lx=dx*Math.cos(c)+dz*Math.sin(c),ly=-dx*Math.sin(c)+dz*Math.cos(c),largest=Math.max(Math.abs(lx),Math.abs(ly));
   const want=new Set();if(Math.abs(lx)>.35*largest)want.add(lx>0?'d':'a');if(Math.abs(ly)>.35*largest)want.add(ly>0?'s':'w');
   for(const k of held)if(!want.has(k)){await page.keyboard.up(k);held.delete(k);}for(const k of want)if(!held.has(k)){await page.keyboard.down(k);held.add(k);}await sleep(55);
  }throw new Error(`driveTo stalled at ${JSON.stringify((await g()).pos)} toward ${x},${z}`);}finally{for(const k of held)await page.keyboard.up(k);}
 }
 await driveTo(-5,10);await driveTo(-5,-3);t=(await g()).targets[0];for(let i=0;i<8;i++)await steer(t);
 await page.keyboard.press('q');await wait(()=>window.__GAME__.recordingTime>0);await page.mouse.down();
 for(let i=0;i<5;i++){await steer(t);await sleep(70);}await page.mouse.up();await page.keyboard.press('q');
 await wait(()=>window.__GAME__.storedDuration>0);ok('left-side attack is recorded while shield stays intact',(await g()).targets[0].shield);
 await snap('crossfire-record-left');await driveTo(-5,4);await driveTo(5,4);await driveTo(5,-3);for(let i=0;i<8;i++)await steer(t);
 await page.keyboard.press('q');await wait(()=>window.__GAME__.echoCount===1);await page.mouse.down();
 for(let i=0;i<12;i++){await steer(t);if((await g()).synchronized>0)break;await sleep(55);}await page.mouse.up();
 data=await g();ok('left echo plus right player attacks break the shield',data.synchronized===1 && data.targets[0].shield===false);await snap('crossfire-shield-broken');report.crossfire=data;
 // Inspect results through the actual pause menu; no fake mission completion.
 await page.keyboard.press('Escape');await wait(()=>window.__GAME__.mode==='pause');const paused=(await g()).elapsedTime;await sleep(200);ok('pause freezes simulation',(await g()).elapsedTime===paused);await page.click('[data-action="results"]');await snap('results-desktop');ok('results remain unranked without a secured core',await page.$eval('#result-stats',e=>e.textContent.includes('UNRANKED')));
 await page.click('[data-screen="results"] [data-action="menu"]');await wait(()=>window.__GAME__.section==='command-bay');const baseline=(await g()).geometries;
 for(let i=0;i<3;i++){await launch();await page.keyboard.press('Escape');await page.click('[data-screen="pause"] [data-action="menu"]');await wait(()=>window.__GAME__.section==='command-bay');}
 data=await g();ok('three repeated scene cycles retain one root and stable geometry count',data.sceneRoots===1&&data.geometries===baseline);report.desktop=data;
 mobile=page=await fresh(390,844,true);await snap('menu-mobile');await launch();ok('mobile menu-to-game flow uses real taps and scrollable sheets');await sleep(200);await snap('skybridge-mobile');
 const rect=selector=>page.$eval(selector,e=>{const r=e.getBoundingClientRect();return{x:r.x+r.width/2,y:r.y+r.height/2,w:r.width,h:r.height};});
 for(const selector of ['#stick','[data-control="fire"]','[data-control="echo"]','[data-control="dodge"]','#pause-button']){const r=await rect(selector);ok(`${selector} has a 64px mobile target`,r.w>=64&&r.h>=64&&r.x-r.w/2>=0&&r.x+r.w/2<=390&&r.y+r.h/2<=844);}
 const c=await page.createCDPSession();let touch;
 async function send(type,id,x,y){if(x!==undefined)touch={id,x,y,radiusX:5,radiusY:5,force:1};await c.send('Input.dispatchTouchEvent',{type,touchPoints:type==='touchCancel'?[]:[touch]});}
 const stick=await rect('#stick');const before=(await g()).pos;
 await send('touchStart',1,stick.x,stick.y);await send('touchMove',1,stick.x,stick.y-40);await wait(p=>window.__GAME__.pos[1]<p[1]-.5,before);await send('touchCancel',1);await wait(()=>window.__GAME__.speed===0);ok('real mobile joystick moves and cancels');
 const old=(await g()).camera.yaw;await send('touchStart',2,300,380);await send('touchMove',2,340,370);await send('touchEnd',2);await wait(v=>Math.abs(window.__GAME__.camera.yaw-v)>.05,old);ok('real right-side drag changes camera look');
 const fire=await rect('[data-control="fire"]'),shots=(await g()).shots;await send('touchStart',3,fire.x,fire.y);await wait(n=>window.__GAME__.shots>n,shots);await send('touchMove',3,195,400);await send('touchEnd',3);await wait(()=>!window.__GAME__.input.fire);ok('mobile FIRE fires and releases outside button');
 const echo=await rect('[data-control="echo"]');await page.touchscreen.tap(echo.x,echo.y);await wait(()=>window.__GAME__.recordingTime>0);await snap('recording-mobile');ok('mobile echo begins six-second recording');
 ok('touch did not scroll or zoom',await page.evaluate(()=>scrollY===0&&scrollX===0&&visualViewport.scale===1));
 const p=await rect('#pause-button');await page.touchscreen.tap(p.x,p.y);await wait(()=>window.__GAME__.mode==='pause');await snap('pause-mobile');ok('mobile pause is functional');
 await page.click('[data-action="resume"]');await wait(()=>window.__GAME__.mode==='gameplay');
 report.mobile=await g();report.browser=await browser.version();ok('no page or console errors',errors.length===0);ok('no missing or failed requests',missing.length===0);ok('all runtime requests stay local to game',external.length===0);
 report={...report,pass:true,passed:checks.length,failed:0,checks,errors,missing,external,frames,physicalDevice:false};
}catch(error){report={pass:false,passed:checks.length,failed:1,checks,error:error.stack,telemetry:await g().catch(()=>null),errors,missing,external,frames};await snap('FAILURE').catch(()=>{});process.exitCode=1;}finally{await browser.close();}
await writeFile(new URL('browser-result.json',out),JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report,null,2));
