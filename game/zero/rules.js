export const MAX_RECORDING = 6;
export const SECTIONS = Object.freeze({
  'command-bay': { name:'COMMAND BAY', spawn:[0,6], objective:'Select an operation', encounter:[], interaction:[], bounds:[-8,8,-20,13], light:0x45e6ff, available:true },
  skybridge: { name:'SKYBRIDGE INSERTION', spawn:[0,10], objective:'Eliminate the scout drone', encounter:[{id:'scout',x:0,y:1.65,z:-7,r:.7,hp:90}], interaction:[{id:'spine-door',x:0,z:-17}], bounds:[-5,5,-19,14], light:0xffb84d, available:true },
  'security-spine': { name:'SECURITY SPINE', spawn:[0,10], objective:'Break the shield with echo crossfire', encounter:[{id:'sentinel',x:0,y:1.65,z:-3,r:.9,hp:120,shield:true}], interaction:[{id:'phase-scanner',x:4,z:-14}], bounds:[-8,8,-19,14], light:0x8a6cff, available:true },
  'chrono-core': {name:'CHRONO CORE',available:false}, extraction:{name:'EXTRACTION',available:false},
});
export function createState() {
 return { mode:'boot', section:'command-bay', difficulty:'normal', time:0, health:100, armor:50, damage:0, shots:0, hits:0, eliminations:0, echoEliminations:0, synchronized:0, coreSecured:false, magazine:24,reserve:144,reload:0,fireWait:0,dodge:0,dodgeWait:0, player:{x:0,z:6,yaw:0}, targets:[], recording:null, stored:null, echo:null, cooldown:0, scanner:false, notice:'' };
}
export function enterSection(state,id) {
 const section=SECTIONS[id]; if(!section?.available) throw new Error(`Section not yet built: ${id}`);
 state.section=id; Object.assign(state.player,{x:section.spawn[0],z:section.spawn[1],yaw:0});
 state.targets=section.encounter.map(t=>({...t,hp:t.hp*(state.difficulty==='hard'?1.5:1),maxHp:t.hp*(state.difficulty==='hard'?1.5:1),recent:null}));
 state.recording=state.stored=state.echo=null; state.cooldown=0;state.scanner=false;
 state.reload=state.fireWait=state.dodge=state.dodgeWait=0;
}
export function aimDirection(yaw,pitch) { return {x:Math.sin(yaw)*Math.cos(pitch),y:Math.sin(pitch),z:-Math.cos(yaw)*Math.cos(pitch)}; }
export function relativeMovement(x,y,yaw,out={}) {
 const length=Math.max(1,Math.hypot(x,y));x/=length;y/=length;
 out.x=x*Math.cos(yaw)-y*Math.sin(yaw);out.z=x*Math.sin(yaw)+y*Math.cos(yaw);return out;
}
export function reload(state) { if(!state.reload && state.magazine<24 && state.reserve>0) {state.reload=1.35;return true;}return false; }
export function weaponTick(state,dt) {
 state.fireWait=Math.max(0,state.fireWait-dt);state.cooldown=Math.max(0,state.cooldown-dt);state.dodge=Math.max(0,state.dodge-dt);state.dodgeWait=Math.max(0,state.dodgeWait-dt);
 if(state.reload>0) {state.reload=Math.max(0,state.reload-dt);if(!state.reload){const n=Math.min(24-state.magazine,state.reserve);state.magazine+=n;state.reserve-=n;}}
}
export function consumeShot(state) {
 if(state.reload>0||state.fireWait>0)return false;
 if(state.magazine<=0){reload(state);return false;}
 state.magazine--;state.shots++;state.fireWait=.14;return true;
}
export function echoAction(state) {
 if(state.recording){finishRecording(state);return 'stored';}
 if(state.echo||state.cooldown>0)return 'cooldown';
 if(state.stored){state.echo={track:state.stored,time:0,cursor:0,frame:state.stored.frames[0]};state.stored=null;return 'deployed';}
 state.recording={duration:0,frames:[],events:[]};return 'recording';
}
export function recordFrame(state,yaw,pitch,pose) {
 if(!state.recording)return;
 const t=state.recording;
 t.frames.push({t:t.duration,x:state.player.x,z:state.player.z,yaw:state.player.yaw,aimYaw:yaw,aimPitch:pitch,pose});
}
export function recordEvent(state,event) {if(state.recording)state.recording.events.push({...event,t:state.recording.duration});}
export function finishRecording(state) {
 if(!state.recording)return;
 if(state.recording.frames.length)state.stored=structuredClone(state.recording);
 state.recording=null;
}
export function sampleEcho(track,t) {
 let a=track.frames[0];if(!a)return null;
 for(let i=1;i<track.frames.length;i++){const b=track.frames[i];if(b.t>=t){const f=Math.max(0,Math.min(1,(t-a.t)/(b.t-a.t||1)));return {...a,x:a.x+(b.x-a.x)*f,z:a.z+(b.z-a.z)*f};}a=b;}
 return a;
}
export function tickEcho(state,dt,dispatch) {
 if(state.recording){state.recording.duration=Math.min(MAX_RECORDING,state.recording.duration+dt);if(state.recording.duration>=MAX_RECORDING-1e-9){state.recording.duration=MAX_RECORDING;finishRecording(state);}}
 const echo=state.echo;if(!echo)return;
 echo.time+=dt;echo.frame=sampleEcho(echo.track,echo.time);
 while(echo.cursor<echo.track.events.length && echo.track.events[echo.cursor].t<=echo.time+1e-9)dispatch(echo.track.events[echo.cursor++]);
 if(echo.time>=echo.track.duration+.12){state.echo=null;state.cooldown=4;}
}
// Both different actors AND different attack directions are required inside an 800ms window.
export function damageTarget(state,target,origin,kind='player',critical=false) {
 if(target.hp<=0)return {hit:false};
 if(kind==='player')state.hits++;
 if(target.shield){
  const dx=origin.x-target.x,dz=origin.z-target.z,length=Math.hypot(dx,dz)||1;
  const hit={x:dx/length,z:dz/length,t:state.time,kind};const old=target.recent;
  if(old && old.kind!==kind && state.time-old.t<=.8 && old.x*hit.x+old.z*hit.z<.64){target.shield=false;state.synchronized++;}
  target.recent=hit;
  if(target.shield)return {hit:true,shield:true};
 }
 target.hp=Math.max(0,target.hp-(critical?40:25));
 const killed=target.hp===0;
 if(killed){state.eliminations++;if(kind==='echo')state.echoEliminations++;}
 return {hit:true,killed,critical};
}
export function statistics(state) {
 return {time:state.time,accuracy:state.shots?Math.round(state.hits/state.shots*100):0,damageTaken:state.damage,echoEliminations:state.echoEliminations,synchronizedAttacks:state.synchronized,coreSecured:state.coreSecured,rank:state.coreSecured?'A':'UNRANKED',missionComplete:state.coreSecured};
}
// Segment versus expanded AABB. Shared by camera obstruction and occlusion tests.
export function segmentBox(origin,end,box,padding=0) {
 let near=0,far=1;
 for(const axis of ['x','y','z']) {
  const d=end[axis]-origin[axis],lo=box.min[axis]-padding,hi=box.max[axis]+padding;
  if(Math.abs(d)<1e-9){if(origin[axis]<lo||origin[axis]>hi)return null;continue;}
  let a=(lo-origin[axis])/d,b=(hi-origin[axis])/d;if(a>b)[a,b]=[b,a];near=Math.max(near,a);far=Math.min(far,b);if(near>far)return null;
 }
 return near;
}
