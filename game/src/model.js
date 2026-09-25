// SECTOR 01, the Atrium: three connected uses of BRIGHTNESS, each under pressure.
// REVEAL: RADIANT builds the bridge, but the socket only holds RADIANT for a short surge. Cross before it fades.
// READ: DIM shows the plate order; walk it in BALANCED. Plates cool if you dawdle between them.
// STABILIZE: DIM shows the fractures, BALANCED seals them by walking in; sealed fractures reopen unless all three close in time.
// SECTOR 02, the Gravity Well: the Kernel yields GRAVITY (LOW / NORMAL / HEAVY).
// LIFT: LOW floats sunken slabs into a path, but LOW drains and Mara floats slowly. Cross before it spends.
// ANCHOR: three loose anchors drift under NORMAL. HEAVY freezes them so Mara can pin them, but HEAVY crumbles the deck from its edges.
// SYNC: both cards in adjacent sockets. DIM + HEAVY shows and pins the core locks. RADIANT + LOW powers the core; step onto it before LOW spends.
export const SOCKET={x:1.8,z:-1.5};
export const SOCKETS=[{x:1.8,z:-1.5,card:'brightness',stage:0},{x:2,z:-9.6,card:'brightness',stage:1},{x:-1.7,z:-15.8,card:'brightness',stage:2},{x:2.0,z:-22.4,card:'gravity',stage:3},{x:1.5,z:-31.6,card:'gravity',stage:4},{x:-1.1,z:-38.6,card:'brightness',stage:5},{x:1.1,z:-38.6,card:'gravity',stage:5}];
export const FRAGMENTS=[{x:2.7,z:3},{x:-3,z:-1},{x:2.8,z:-14},{x:-2.4,z:-24.4},{x:2.4,z:-41.4}];
// Gallery floor plates. The index is the symbol: 0 circle, 1 triangle, 2 diamond.
export const GLYPHS=[{x:-2.8,z:-11.2},{x:.6,z:-11.6},{x:-1.2,z:-9}];
export const GLYPH_SEQUENCE=[2,0,1];
export const NODES=[{x:-2.7,z:-14},{x:0,z:-15},{x:1.8,z:-16.5}];
export const LEVELS=['DIM','BALANCED','RADIANT'];
export const GRAVITY_LEVELS=['LOW','NORMAL','HEAVY'];
export const PLATE_RADIUS=.62,NODE_RADIUS=.6;
// Sector 02 geometry. Slabs bridge the pit between the landing and the anchor deck; the core sits in the middle of the last deck.
export const SLABS=[-26.35,-28.05,-29.75];
export const WELL={x:0,z:-33.6},CORE={x:0,z:-40.1,radius:.9};
export const ANCHOR_ORBIT={rx:2.3,rz:1.8,speed:.55};
export const LOCKS=[{x:-2.3,z:-40.6},{x:2.3,z:-40.6},{x:0,z:-42.1}];
export const TIMING={surge:8,plateWindow:4,hold:12,lowCharge:9,crumble:11,liftRise:1.6,liftSink:1.1};
export const CARDS={brightness:{inst:'installed',sock:'installedSocket',level:'brightness',levels:LEVELS,rest:'BALANCED'},gravity:{inst:'gInstalled',sock:'gSocket',level:'gravity',levels:GRAVITY_LEVELS,rest:'NORMAL'}};
const CP=['x','z','installed','installedSocket','brightness','gInstalled','gSocket','gravity','stage','bridgeLatched','readSolved','hasGravity','kernelRestored','landed','anchored','locksSeen'];
export function createState(){return {x:0,z:4.6,y:0,yaw:Math.PI,installed:false,installedSocket:-1,brightness:'BALANCED',gInstalled:false,gSocket:-1,gravity:'NORMAL',hasGravity:false,kernelRestored:false,landed:false,bridge:0,bridgeLatched:false,stage:0,glyphSeen:false,glyphInput:[],onGlyph:-1,misstep:0,missteps:0,readSolved:false,nodesSeen:false,cleared:[],surge:0,plateTimer:0,holdTimer:0,lowCharge:0,lift:0,anchorPhase:0,pins:[null,null,null],crumble:0,anchored:false,locksSeen:false,locks:[],core:0,restoration:0,elapsed:0,resets:0,moves:0,deployments:0,fragments:[],checkpoint:{x:0,z:4.6,installed:false,installedSocket:-1,brightness:'BALANCED',gInstalled:false,gSocket:-1,gravity:'NORMAL',stage:0,bridgeLatched:false,readSolved:false,hasGravity:false,kernelRestored:false,landed:false,anchored:false,locksSeen:false,cleared:[],pins:[null,null,null],locks:[]},failure:0,won:false,checkpointReached:false,moving:false,distance:0};}
export const sector=s=>s.stage>=3?2:1;
export const socketFor=(s,card='brightness')=>SOCKETS.findIndex(k=>k.stage===s.stage&&k.card===card);
export const activeSocket=(s,card='brightness')=>SOCKETS[socketFor(s,card)]||null;
export const nearSocket=(s,card='brightness')=>{const k=activeSocket(s,card);return !!k&&Math.hypot(s.x-k.x,s.z-k.z)<2.65;};
export const hasCard=(s,card)=>card==='brightness'||(card==='gravity'&&s.hasGravity);
// A card is "here" when it sits in the socket that belongs to the current stage.
export const here=(s,card='brightness')=>{const c=CARDS[card];return !!c&&s[c.inst]&&s[c.sock]===socketFor(s,card);};
export const floorY=z=>z>-13.1?0:z>-18.5?-.10:z>-20.3?-.10-((-18.5-z)/1.8)*1.2:-1.3;
export const speed=s=>s.gInstalled&&here(s,'gravity')&&s.gravity==='LOW'?2.3:3.4;
export function install(s,card='brightness'){const c=CARDS[card];if(!c||s.failure||s.won||!hasCard(s,card)||s[c.inst]||!nearSocket(s,card))return false;s[c.inst]=true;s[c.sock]=socketFor(s,card);s[c.level]=c.rest;s.moves++;s.deployments++;
 // A card installed at this stage's socket stays there through a realignment; the checkpoint learns the new placement.
 if(s.checkpoint.stage===s.stage){s.checkpoint[c.inst]=true;s.checkpoint[c.sock]=s[c.sock];s.checkpoint[c.level]=c.rest;}return true;}
export function retrieve(s,card='brightness'){const c=CARDS[card];if(!c||s.failure||s.won||!s[c.inst]||!nearSocket(s,card)||s.restoration)return false;s[c.inst]=false;s[c.sock]=-1;s.moves++;return true;}
export function setLevel(s,card,value){const c=CARDS[card];if(!c||!c.levels.includes(value)||!s[c.inst]||s.failure||s.won||s.restoration||!here(s,card)||!nearSocket(s,card))return false;s[c.level]=value;
 if(card==='brightness'){if(s.stage===1&&value==='DIM')s.glyphSeen=true;if(s.stage===2&&value==='DIM')s.nodesSeen=true;if(s.stage===0&&value==='RADIANT')s.surge=TIMING.surge;}
 else if(value==='LOW')s.lowCharge=TIMING.lowCharge;
 if(s.stage===5&&here(s,'brightness')&&s.brightness==='DIM'&&here(s,'gravity')&&s.gravity==='HEAVY')s.locksSeen=true;return true;}
export const setBrightness=(s,value)=>setLevel(s,'brightness',value);
export const setGravity=(s,value)=>setLevel(s,'gravity',value);
// A plate answers only in BALANCED after DIM has shown the order. A wrong plate clears the sequence in place; it is not a fall.
export function activateGlyph(s,index){if(s.stage!==1||!s.installed||s.installedSocket!==1||s.brightness!=='BALANCED'||!s.glyphSeen||s.failure||s.readSolved||s.misstep||!GLYPHS[index])return false;if(GLYPH_SEQUENCE[s.glyphInput.length]!==index){s.glyphInput=[];s.plateTimer=0;s.misstep=.001;s.missteps++;return false;}s.glyphInput.push(index);s.plateTimer=0;if(s.glyphInput.length===3)s.readSolved=true;return true;}
export function clearNode(s,index){if(s.stage!==2||!s.nodesSeen||!s.installed||s.installedSocket!==2||s.brightness!=='BALANCED'||s.failure||s.cleared.includes(index)||!NODES[index])return false;s.cleared.push(index);if(s.cleared.length===3)s.holdTimer=0;return true;}
export const anchorAt=(s,i)=>s.pins[i]||{x:WELL.x+ANCHOR_ORBIT.rx*Math.cos(s.anchorPhase+i*Math.PI*2/3),z:WELL.z+ANCHOR_ORBIT.rz*Math.sin(s.anchorPhase+i*Math.PI*2/3)};
export const anchorsFrozen=s=>s.stage===4&&here(s,'gravity')&&s.gravity==='HEAVY';
export const liftPowered=s=>s.stage===3&&here(s,'gravity')&&s.gravity==='LOW';
export const corePowered=s=>s.stage===5&&s.locks.length===3&&here(s,'brightness')&&s.brightness==='RADIANT'&&here(s,'gravity')&&s.gravity==='LOW';
function checkpoint(s,x,z){const cp={};for(const k of CP)cp[k]=s[k];Object.assign(cp,{x,z,cleared:[...s.cleared],pins:[...s.pins],locks:[...s.locks]});s.checkpoint=cp;}
export function restart(s,count=true){if(count)s.resets++;const cp=s.checkpoint;Object.assign(s,{...cp,cleared:[...cp.cleared],pins:[...s.pins],anchored:cp.anchored||s.pins.every(Boolean),locks:[...cp.locks],yaw:Math.PI,bridge:cp.bridgeLatched?1:0,failure:0,restoration:0,won:false,moving:false,glyphInput:[],onGlyph:-1,misstep:0,surge:0,plateTimer:0,holdTimer:0,lowCharge:0,lift:0,crumble:0,core:0});s.y=floorY(s.z);}
export function groundAt(x,z,bridge=0,readSolved=false,s=null){if(bridge&&typeof bridge==='object'){s=bridge;bridge=s.bridge;readSolved=s.readSolved;}const ax=Math.abs(x);
 if((ax<4.3&&z<7&&z>-3)||(ax<4.15&&z<=-8&&z>-12.6)||(ax<3.9&&z<=-13.1&&z>-18.5)||(ax<1.35&&z<=-3&&z>=-8&&bridge>=.99)||(ax<1.6&&z<=-12.6&&z>=-13.1&&readSolved))return true;
 if(!s)return false;const shrink=1-.28*s.crumble;
 return (s.kernelRestored&&ax<1.6&&z<=-18.5&&z>=-20.3)||(ax<3.2&&z<=-20.3&&z>-25.5)||(s.lift>=.99&&ax<1.2&&z<=-25.5&&z>=-30.6)||(ax<3.4*shrink&&Math.abs(z-WELL.z)<3.0*shrink)||(s.anchored&&ax<1.6&&z<=-36.6&&z>=-37.6)||(ax<3.4&&z<=-37.6&&z>-42.6);}
export function restoreArchive(s){if(s.failure||s.won||s.stage!==2||!s.installed||s.installedSocket!==2||s.brightness!=='RADIANT'||s.cleared.length!==3||!nearSocket(s))return false;if(!s.restoration)s.restoration=.001;return true;}
// The Kernel restored: it returns BRIGHTNESS to Mara's hand and yields the second control.
function descend(s){Object.assign(s,{stage:3,kernelRestored:true,hasGravity:true,installed:false,installedSocket:-1,brightness:'BALANCED',restoration:0});checkpoint(s,0,-17.8);}
export function step(s,input,dt){
 const events=[];if(s.won)return events;
 if(s.failure){s.failure+=dt;const t=s.failure;s.y=floorY(s.z)+(t<.15?0:t<.6?-(t-.15)*2:-(1.25-t)*1.38);if(t>=1.25){restart(s);events.push('reset');}return events;}
 if(s.restoration){s.restoration=Math.min(1,s.restoration+dt/2.2);s.moving=false;if(s.restoration===1){if(s.stage===2){descend(s);events.push('kernel-restored');}else{s.won=true;events.push('victory');}}return events;}
 s.elapsed+=dt;const powered=s.bridgeLatched||(s.installed&&s.installedSocket===0&&s.brightness==='RADIANT');s.bridge=Math.max(0,Math.min(1,s.bridge+(powered?1:-1)*dt/1.85));
 // Atrium surge: RADIANT at the first socket lasts a few seconds, then drops to BALANCED and the bridge fades.
 if(s.stage===0&&here(s,'brightness')&&s.brightness==='RADIANT'){s.surge-=dt;if(s.surge<=0){s.surge=0;s.brightness='BALANCED';events.push('surge-spent');}}
 if(s.misstep){s.misstep+=dt;if(s.misstep>=.8)s.misstep=0;}
 // Gallery plates cool: a started sequence must be finished plate to plate.
 if(s.stage===1&&!s.readSolved&&s.glyphInput.length>0){s.plateTimer+=dt;if(s.plateTimer>TIMING.plateWindow){s.glyphInput=[];s.plateTimer=0;events.push('plates-cooled');}}
 // Kernel hold: sealed fractures reopen unless all three close within the hold.
 if(s.stage===2&&s.cleared.length>0&&s.cleared.length<3){s.holdTimer+=dt;if(s.holdTimer>TIMING.hold){s.cleared=[];s.holdTimer=0;events.push('fractures-reopened');}}
 // LOW gravity spends. Lift slabs and the core only hold while it lasts.
 if(s.gInstalled&&s.gravity==='LOW'&&here(s,'gravity')){s.lowCharge-=dt;if(s.lowCharge<=0){s.lowCharge=0;s.gravity='NORMAL';events.push('charge-spent');}}
 const lifting=liftPowered(s),before=s.lift;s.lift=Math.max(0,Math.min(1,s.lift+(lifting?dt/TIMING.liftRise:-dt/TIMING.liftSink)));if(s.lift>=1&&before<1)events.push('lift-ready');
 const frozen=anchorsFrozen(s);if(!frozen&&!s.anchored)s.anchorPhase+=dt*ANCHOR_ORBIT.speed;
 s.crumble=Math.max(0,Math.min(1,s.crumble+(frozen&&!s.anchored?dt/TIMING.crumble:-dt/3)));
 // HEAVY held too long: the anchor deck gives way. Pins already set survive the realignment.
 if(s.crumble>=1&&!s.anchored){s.failure=.001;s.moving=false;events.push('collapse','failure');return events;}
 if(s.stage===5&&here(s,'brightness')&&s.brightness==='DIM'&&here(s,'gravity')&&s.gravity==='HEAVY')s.locksSeen=true;
 const coreOn=corePowered(s),coreBefore=s.core;s.core=Math.max(0,Math.min(1,s.core+(coreOn?dt/TIMING.liftRise:-dt/TIMING.liftSink)));if(s.core>=1&&coreBefore<1)events.push('core-ready');
 let {x,z}=input;const l=Math.hypot(x,z);if(l>1){x/=l;z/=l;}s.moving=l>.08;const v=speed(s);
 if(s.moving){s.x+=x*v*dt;s.z+=z*v*dt;s.distance+=Math.min(1,l)*v*dt;s.yaw=Math.atan2(x,z);}
 // Keep Mara's body outside the physical pedestal, including while turning beside it.
 for(const socket of SOCKETS){const dx=s.x-socket.x,dz=s.z-socket.z,d=Math.hypot(dx,dz),radius=.66;if(d<radius){s.x=socket.x+(d>.001?dx/d:0)*radius;s.z=socket.z+(d>.001?dz/d:1)*radius;}}
 const unstable=s.brightness==='RADIANT'&&((s.stage===1||s.stage===2)&&s.x>3.1&&s.z<-9||(s.stage===5&&here(s,'brightness')&&Math.hypot(s.x-CORE.x,s.z-CORE.z)>2.9));
 const corrupt=s.stage===2&&s.brightness==='RADIANT'&&NODES.some((n,i)=>!s.cleared.includes(i)&&Math.hypot(s.x-n.x,s.z-n.z)<.5);
 if(!groundAt(s.x,s.z,s)||unstable||corrupt){s.failure=.001;s.moving=false;events.push('failure');return events;}
 s.y=floorY(s.z);
 // The second threshold is physically sealed until the remembered sequence is correct.
 if(!s.readSolved&&s.z<-12.35&&s.stage===1){s.z=-12.35;s.moving=false;}
 // Gallery plates answer when Mara steps onto them, once per entry.
 let on=-1;for(let i=0;i<GLYPHS.length;i++)if(Math.hypot(s.x-GLYPHS[i].x,s.z-GLYPHS[i].z)<PLATE_RADIUS)on=i;
 if(on!==s.onGlyph){s.onGlyph=on;if(on>=0){const missteps=s.missteps;if(activateGlyph(s,on))events.push(s.readSolved?'read-solved':'glyph');else if(s.missteps>missteps)events.push('misstep');}}
 // Kernel fractures seal when Mara walks into them under BALANCED light.
 for(let i=0;i<NODES.length;i++)if(Math.hypot(s.x-NODES[i].x,s.z-NODES[i].z)<NODE_RADIUS&&clearNode(s,i))events.push('node');
 // Anchors pin under HEAVY when Mara steps onto them. Core locks pin the same way once DIM + HEAVY has shown them.
 if(frozen&&!s.anchored)for(let i=0;i<3;i++){if(s.pins[i])continue;const a=anchorAt(s,i);if(Math.hypot(s.x-a.x,s.z-a.z)<.6){s.pins[i]={x:a.x,z:a.z};events.push('anchor');if(s.pins.every(Boolean)){s.anchored=true;events.push('anchored');}}}
 if(s.stage===5&&s.locksSeen&&here(s,'gravity')&&s.gravity==='HEAVY')for(let i=0;i<LOCKS.length;i++)if(!s.locks.includes(i)&&Math.hypot(s.x-LOCKS[i].x,s.z-LOCKS[i].z)<.6){s.locks.push(i);events.push(s.locks.length===3?'locked':'lock');}
 if(coreOn&&s.core>=.99&&Math.hypot(s.x-CORE.x,s.z-CORE.z)<CORE.radius){s.restoration=.001;s.moving=false;events.push('sync');return events;}
 for(let i=0;i<FRAGMENTS.length;i++){const f=FRAGMENTS[i];if(!s.fragments.includes(i)&&Math.hypot(s.x-f.x,s.z-f.z)<.85){s.fragments.push(i);events.push('fragment');}}
 if(s.z<-8.5&&s.stage===0){s.stage=1;s.bridgeLatched=true;s.bridge=1;s.checkpointReached=true;checkpoint(s,0,-9);events.push('checkpoint');}
 if(s.readSolved&&s.z<-13.3&&s.stage===1){s.stage=2;checkpoint(s,0,-13.7);events.push('checkpoint');}
 if(s.stage===3&&!s.landed&&s.z<-21){s.landed=true;checkpoint(s,0,-21.5);events.push('checkpoint');}
 if(s.stage===3&&s.z<-30.9){s.stage=4;checkpoint(s,0,-31.3);events.push('checkpoint');}
 if(s.stage===4&&s.anchored&&s.z<-36.9){s.stage=5;checkpoint(s,0,-37.9);events.push('checkpoint');}
 return events;
}
export function results(s){const efficiency=Math.max(0,100-s.resets*12-s.missteps*3-Math.max(0,s.deployments-7)*4);return {seconds:Math.floor(s.elapsed),resets:s.resets,fragments:s.fragments.length,moves:s.deployments,efficiency,rank:efficiency>=95&&s.fragments.length===FRAGMENTS.length?'S':efficiency>=85?'A':efficiency>=65?'B':'C'};}
