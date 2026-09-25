// Layout probe only: installs BRIGHTNESS on a 390×844 viewport, forces the gravity console visible, and reports HUD boxes. Not gameplay evidence.
import puppeteer from 'puppeteer';
const b=await puppeteer.launch({headless:true,args:['--enable-unsafe-swiftshader']});const m=await b.newPage();await m.setViewport({width:390,height:844,deviceScaleFactor:1,isMobile:true,hasTouch:true});
await m.goto('http://127.0.0.1:4173/game/');await m.waitForFunction(()=>window.__READY__);await m.tap('#startb');await m.waitForFunction(()=>window.__CTRL__.state.elapsed>.05);
await m.keyboard.down('w');await m.waitForFunction(()=>window.__CTRL__.state.z<-.6);await m.keyboard.up('w');await m.focus('#brightness');await m.keyboard.press('Enter');await m.keyboard.press('e');await m.waitForFunction(()=>window.__CTRL__.state.installed);
await new Promise(r=>setTimeout(r,300));
await m.evaluate(()=>{for(const id of ['gravity-values','gravity']){const el=document.getElementById(id);el.removeAttribute('hidden');Object.defineProperty(el,'hidden',{get:()=>false,set(){}});}});
await new Promise(r=>setTimeout(r,300));
const boxes=await m.evaluate(()=>{return Object.fromEntries(['brightness-values','gravity-values','brightness','gravity','act','joystick','fragments','context'].map(id=>{const r=document.getElementById(id).getBoundingClientRect();return [id,[Math.round(r.x),Math.round(r.y),Math.round(r.right),Math.round(r.bottom)]];}));});
console.log(JSON.stringify(boxes));await m.screenshot({path:'production/recovery/browser/mobile-layout-probe.png'});await b.close();
