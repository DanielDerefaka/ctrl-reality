import puppeteer from 'puppeteer';
import fs from 'node:fs/promises';
const dir='production/visual-lock/boot-atrium';await fs.mkdir(dir,{recursive:true});
const browser=await puppeteer.launch({headless:true,args:['--enable-unsafe-swiftshader','--disable-background-timer-throttling','--disable-renderer-backgrounding']});
const report={date:new Date().toISOString(),captures:[],devices:[],errors:[],note:'Actual browser frames and real input. No state mutation, overlays, generated gameplay images or hidden visual-only scene.'};
const sleep=ms=>new Promise(r=>setTimeout(r,ms));const snap=p=>p.evaluate(()=>window.__CTRL__);
async function shot(p,name){const before=await snap(p);await p.screenshot({path:`${dir}/${name}.png`});const after=await snap(p);report.captures.push({name,screen:before.screen,bridgeBefore:before.state.bridge,bridgeAfter:after.state.bridge,position:{x:before.state.x,z:before.state.z},metrics:before.metrics});}
async function move(p,axis,target){const current=(await snap(p)).state[axis],sign=Math.sign(target-current);const key=axis==='x'?(sign>0?'d':'a'):(sign>0?'s':'w');await p.keyboard.down(key);await p.waitForFunction((axis,target,sign)=>(window.__CTRL__.state[axis]-target)*sign>=-.04,{polling:'raf',timeout:20000},axis,target,sign);await p.keyboard.up(key);await sleep(100);}
try{
 for(const [name,width,height,touch]of [['desktop',1440,900,false],['mobile',390,844,true]]){
  const context=await browser.createBrowserContext(),p=await context.newPage();await p.setViewport({width,height,deviceScaleFactor:1,isMobile:touch,hasTouch:touch});p.on('pageerror',e=>report.errors.push({name,error:e.stack}));p.on('response',r=>{if(r.status()>=400)report.errors.push({name,status:r.status(),url:r.url()});});
  const start=Date.now();await p.goto('http://127.0.0.1:4173/game/',{waitUntil:'networkidle0'});await p.waitForFunction(()=>window.__READY__);const readyMs=Date.now()-start;await sleep(1200);await shot(p,`${name}-title`);
  if(touch)await p.tap('#startb');else await p.click('#startb');await sleep(500);await shot(p,`${name}-enter`);await sleep(2400);await shot(p,`${name}-hud`);
  await move(p,'x',-1.8);await move(p,'z',0);await sleep(650);
  const rect=await(await p.$('#brightness')).boundingBox(),socket=(await snap(p)).socket;
  const c=touch?await p.createCDPSession():null;
  async function input(type,x,y){if(c)await c.send('Input.dispatchTouchEvent',{type:({down:'touchStart',move:'touchMove',up:'touchEnd'})[type],touchPoints:type==='up'?[]:[{x,y,id:1,radiusX:5,radiusY:5}]});else{if(type==='down'){await p.mouse.move(x,y);await p.mouse.down();}else if(type==='move')await p.mouse.move(x,y,{steps:12});else await p.mouse.up();}}
  await input('down',rect.x+rect.width/2,rect.y+rect.height/2);await input('move',socket.x,socket.y);await sleep(250);await shot(p,`${name}-drag`);await input('up',socket.x,socket.y);
  await p.waitForFunction(()=>window.__CTRL__.state.installed,{polling:'raf'});await shot(p,`${name}-socket-accept`);
  await p.waitForFunction(()=>window.__CTRL__.state.bridge>=.40,{polling:'raf'});await shot(p,`${name}-bridge-half`);
  await p.waitForFunction(()=>window.__CTRL__.state.bridge===1,{polling:'raf'});await sleep(2700);await shot(p,`${name}-bridge-complete`);
  const metrics=[];for(let i=0;i<30;i++){metrics.push((await snap(p)).metrics);await sleep(80);}
  if(touch)await p.tap('#pause-button');else await p.keyboard.press('Escape');await shot(p,`${name}-pause`);
  report.devices.push({name,width,height,readyObservedMs:readyMs,startLatency:(await snap(p)).startLatency,physicalMobile:false,renderer:metrics[0].renderer,drawCalls:{min:Math.min(...metrics.map(x=>x.drawCalls)),max:Math.max(...metrics.map(x=>x.drawCalls))},triangles:{min:Math.min(...metrics.map(x=>x.triangles)),max:Math.max(...metrics.map(x=>x.triangles))},fps:{min:Math.min(...metrics.map(x=>x.fps)),max:Math.max(...metrics.map(x=>x.fps))},maraFrameHeight:metrics[0].maraFrameHeight,transferBytes:await p.evaluate(()=>performance.getEntriesByType('resource').reduce((n,r)=>n+r.transferSize,0))});
  await context.close();
 }
 report.pass=report.errors.length===0;
}catch(e){report.pass=false;report.failure=e.stack;process.exitCode=1;console.error(e);}finally{await fs.writeFile(`${dir}/capture-report.json`,JSON.stringify(report,null,2));await browser.close();console.log(JSON.stringify(report.devices));}
