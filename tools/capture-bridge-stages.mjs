import puppeteer from 'puppeteer';import fs from 'node:fs/promises';
const dir='production/visual-lock/boot-atrium',records=[];const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const browser=await puppeteer.launch({headless:true,protocolTimeout:20000,args:['--enable-unsafe-swiftshader']});
try{
 for(const [name,width,height,mobile]of [['desktop',1440,900,false],['mobile',390,844,true]]){
  const context=await browser.createBrowserContext(),p=await context.newPage();await p.setViewport({width,height,deviceScaleFactor:1,isMobile:mobile,hasTouch:mobile});await p.goto('http://127.0.0.1:4173/game/',{waitUntil:'networkidle0'});await p.waitForFunction(()=>window.__READY__);await p.click('#startb');await sleep(500);
  for(const [axis,to,key]of [['x',-1.8,'a'],['z',0,'w']]){await p.keyboard.down(key);await p.waitForFunction((axis,to)=>window.__CTRL__.state[axis]<=to+.05,{polling:'raf'},axis,to);await p.keyboard.up(key);}await sleep(400);
  await p.evaluate(()=>{window.__visualObservations=[];const sample=t=>{window.__visualObservations.push({wall:performance.timeOrigin+t,bridge:window.__CTRL__.state.bridge});requestAnimationFrame(sample);};requestAnimationFrame(sample);});
  const c=await p.createCDPSession(),frames=[];c.on('Page.screencastFrame',e=>{frames.push(e);c.send('Page.screencastFrameAck',{sessionId:e.sessionId}).catch(()=>{});});
  await c.send('Page.startScreencast',{format:'jpeg',quality:94,maxWidth:width,maxHeight:height,everyNthFrame:1});await sleep(150);
  await p.focus('#brightness');await p.keyboard.press('Enter');await p.keyboard.press('e');await p.waitForFunction(()=>window.__CTRL__.state.bridge===1);await sleep(250);await c.send('Page.stopScreencast');
  const observations=await p.evaluate(()=>window.__visualObservations);
  const paired=frames.map(frame=>{const time=frame.metadata.timestamp*1000;const sample=observations.reduce((a,b)=>Math.abs(b.wall-time)<Math.abs(a.wall-time)?b:a);return{frame,time,bridge:sample.bridge,timeDifferenceMs:Math.abs(sample.wall-time)};});
  for(const [label,target]of [['socket-accept',.10],['bridge-half',.5]]){const candidates=paired.filter(f=>f.bridge>0&&f.bridge<1);if(!candidates.length)throw new Error('No intermediate frames captured');const chosen=candidates.reduce((a,b)=>Math.abs(b.bridge-target)<Math.abs(a.bridge-target)?b:a);const file=`${name}-${label}.jpg`;await fs.writeFile(`${dir}/${file}`,Buffer.from(chosen.frame.data,'base64'));records.push({file,observedBridge:chosen.bridge,frameTelemetryDifferenceMs:chosen.timeDifferenceMs,viewport:{width,height},method:'Unretouched Chrome screencast frame during real keyboard installation. Nearest read-only animation-frame telemetry is recorded. No time manipulation or game-state changes.'});console.log(records.at(-1));}
  await context.close();
 }
 await fs.writeFile(`${dir}/timed-stage-report.json`,JSON.stringify(records,null,2));
}finally{await browser.close();}
