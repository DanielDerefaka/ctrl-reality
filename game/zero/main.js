import * as THREE from '../vendor/three.module.js';
import { FixedStepClock } from '../core/fixed-step.js';
import { FpsMeter } from '../core/telemetry.js';
import { createState, enterSection, SECTIONS, relativeMovement, aimDirection, weaponTick, consumeShot, reload, echoAction, recordFrame, recordEvent, tickEcho, damageTarget, statistics, segmentBox } from './rules.js';
import { SectionManager, cameraPosition, C } from './scene.js';
import { ActionInput } from './input.js';
const $=s=>document.querySelector(s);
const app=$('#app'),canvas=$('#game-canvas');
const renderer=new THREE.WebGLRenderer({canvas,antialias:true,alpha:false});
renderer.setClearColor(C.void);renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.15;
renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;
const scene=new THREE.Scene();scene.fog=new THREE.FogExp2(C.void,.015);
const camera=new THREE.PerspectiveCamera(52,1,.1,180);
const manager=new SectionManager(scene);
let state=createState(),yaw=0,pitch=-.09,tick=0,visualTime=0,lastObjective='',flash=0,hitTime=0,noticeTime=0,settingsBack='menu',cameraSnap=true;
const options={sensitivity:1,invert:false,sound:true,haptics:true};
try{const saved=JSON.parse(localStorage.getItem('zero-hour-settings'));if(saved){options.sensitivity=Math.max(.3,Math.min(2,Number(saved.sensitivity)||1));for(const k of ['invert','sound','haptics'])if(typeof saved[k]==='boolean')options[k]=saved[k];}}catch{}
const clock=new FixedStepClock({hz:60,maxSteps:5}),fps=new FpsMeter();
const input=new ActionInput(canvas,()=>setScreen('pause'));
const movement={x:0,y:0},worldMove={x:0,z:0},look=new THREE.Vector3(),anchor=new THREE.Vector3(),desired=new THREE.Vector3(),ray=new THREE.Ray(),sphere=new THREE.Sphere(),intersection=new THREE.Vector3(),up=new THREE.Vector3(0,1,0),delta=new THREE.Vector3();
let audio;
function beep(){if(!options.sound)return;try{audio??=new AudioContext();if(audio.state==='suspended')audio.resume().catch(()=>{});const osc=audio.createOscillator(),gain=audio.createGain();osc.type='triangle';osc.frequency.setValueAtTime(260,audio.currentTime);osc.frequency.exponentialRampToValueAtTime(65,audio.currentTime+.09);gain.gain.setValueAtTime(.06,audio.currentTime);gain.gain.exponentialRampToValueAtTime(.001,audio.currentTime+.1);osc.connect(gain);gain.connect(audio.destination);osc.start();osc.stop(audio.currentTime+.1);osc.onended=()=>{osc.disconnect();gain.disconnect();};}catch{}}
function notice(text){state.notice=text;noticeTime=2.5;}
function loadSection(id){enterSection(state,id);manager.load(id,state.targets);renderer.renderLists.dispose();yaw=0;pitch=-.09;cameraSnap=true;input.clear();lastObjective='';}
function setScreen(mode){
 if(mode==='settings')settingsBack=state.mode==='pause'?'pause':'menu';
 if(mode==='menu' && state.section!=='command-bay')loadSection('command-bay');
 state.mode=mode;app.dataset.mode=mode;
 document.querySelectorAll('[data-screen]').forEach(e=>e.hidden=e.dataset.screen!==mode);
 $('#hud').hidden=!['gameplay','pause'].includes(mode);
 input.enable(mode==='gameplay');movement.x=movement.y=worldMove.x=worldMove.z=0;clock.reset();
 if(mode==='results'){
  const stats=statistics(state),rows=[['ELAPSED',`${stats.time.toFixed(1)} S`],['ACCURACY',`${stats.accuracy}%`],['DAMAGE TAKEN',stats.damageTaken],['ECHO ELIMINATIONS',stats.echoEliminations],['SYNCHRONIZED ATTACKS',stats.synchronizedAttacks],['CORE SECURED',stats.coreSecured?'YES':'NO'],['FINAL RANK',stats.rank]];
  $('#result-stats').replaceChildren(...rows.map(([label,value])=>{const div=document.createElement('div'),dt=document.createElement('dt'),dd=document.createElement('dd');dt.textContent=label;dd.textContent=String(value);div.append(dt,dd);return div;}));
 }
}
function insert(){const difficulty=state.difficulty;state=createState();state.difficulty=difficulty;loadSection('skybridge');setScreen('gameplay');notice('SKYBRIDGE INSERTION · LINK ESTABLISHED');}
for(const button of document.querySelectorAll('[data-action]'))button.addEventListener('click',()=>{
 const a=button.dataset.action;
 if(a==='insert'||a==='restart')insert();else if(a==='resume')setScreen('gameplay');else if(a==='back-settings')setScreen(settingsBack);else setScreen(a);
});
for(const button of document.querySelectorAll('[data-difficulty]'))button.addEventListener('click',()=>{state.difficulty=button.dataset.difficulty;document.querySelectorAll('[data-difficulty]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));});
function settings(){ $('#sensitivity').value=options.sensitivity;$('#sensitivity-value').textContent=Number(options.sensitivity).toFixed(1);for(const k of ['invert','sound','haptics']){$(`#${k}`).setAttribute('aria-pressed',String(options[k]));$(`#${k} b`).textContent=options[k]?'ON':'OFF';}try{localStorage.setItem('zero-hour-settings',JSON.stringify(options));}catch{}}
$('#sensitivity').addEventListener('input',e=>{options.sensitivity=Number(e.target.value);settings();});
for(const k of ['invert','sound','haptics'])$(`#${k}`).addEventListener('click',()=>{options[k]=!options[k];settings();});settings();
window.addEventListener('blur',()=>{if(state.mode==='gameplay')setScreen('pause');});
document.addEventListener('visibilitychange',()=>{if(document.hidden&&state.mode==='gameplay')setScreen('pause');clock.reset();});
function resize(){renderer.setPixelRatio(Math.min(devicePixelRatio||1,innerWidth<800?1.5:2));renderer.setSize(innerWidth,innerHeight,false);camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();}window.addEventListener('resize',resize,{passive:true});resize();
function aimRay(origin,direction){
 ray.set(new THREE.Vector3(origin.x,origin.y,origin.z),new THREE.Vector3(direction.x,direction.y,direction.z).normalize());
 let distance=80,target=null,critical=false;
 const end={x:origin.x+direction.x*80,y:origin.y+direction.y*80,z:origin.z+direction.z*80};
 for(const wall of manager.current.walls){const t=segmentBox(origin,end,wall);if(t!==null)distance=Math.min(distance,t*80);}
 for(const t of state.targets){if(t.hp<=0)continue;sphere.center.set(t.x,t.y,t.z);sphere.radius=t.r;if(ray.intersectSphere(sphere,intersection)){const d=intersection.distanceTo(ray.origin);if(d<distance){distance=d;target=t;critical=ray.distanceToPoint(sphere.center)<.18;}}}
 return {target,critical,distance,end:{x:origin.x+direction.x*distance,y:origin.y+direction.y*distance,z:origin.z+direction.z*distance}};
}
function emitShot(origin,direction,kind='player'){
 const hit=aimRay(origin,direction);const fx=manager.current.effects[manager.current.fx++%16];fx.life=.085;fx.tracer.visible=fx.spark.visible=true;
 fx.tracer.position.set((origin.x+hit.end.x)/2,(origin.y+hit.end.y)/2,(origin.z+hit.end.z)/2);
 delta.set(hit.end.x-origin.x,hit.end.y-origin.y,hit.end.z-origin.z);fx.tracer.scale.y=delta.length();fx.tracer.quaternion.setFromUnitVectors(up,delta.normalize());fx.tracer.material.color.setHex(kind==='echo'?C.violet:C.cyan);fx.spark.position.set(hit.end.x,hit.end.y,hit.end.z);
 if(hit.target){const outcome=damageTarget(state,hit.target,origin,kind,hit.critical);if(kind==='player'){hitTime=.18;$('#hit-marker').classList.toggle('critical',!!outcome.critical);}if(outcome.shield)notice('PHASE SHIELD · ATTACK FROM TWO SIDES');if(outcome.killed)notice(kind==='echo'?'ECHO ELIMINATION':'TARGET NEUTRALIZED');if(!hit.target.shield&&state.synchronized>0)notice('SYNCHRONIZED CROSSFIRE · SHIELD BROKEN');}
 if(kind==='player'){flash=.07;beep();if(options.haptics&&input.mobile)navigator.vibrate?.(8);}
 return hit;
}
function fire(){
 if(!consumeShot(state))return;
 const cameraDir=new THREE.Vector3();camera.getWorldDirection(cameraDir);
 // Mobile assist only selects a visible target close to the crosshair; never through walls.
 if(input.mobile){let best=.996;for(const t of state.targets){if(t.hp<=0)continue;const toward=new THREE.Vector3(t.x,t.y,t.z).sub(camera.position).normalize(),dot=toward.dot(cameraDir);if(dot>best && aimRay(camera.position,toward).target===t){cameraDir.copy(toward);best=dot;}}}
 const destination=aimRay(camera.position,cameraDir).end;
 const origin={x:state.player.x+.35*Math.cos(yaw)+.5*Math.sin(yaw),y:1.28,z:state.player.z+.35*Math.sin(yaw)-.5*Math.cos(yaw)};
 const d=new THREE.Vector3(destination.x-origin.x,destination.y-origin.y,destination.z-origin.z).normalize();
 emitShot(origin,d);recordEvent(state,{type:'shot',origin,direction:{x:d.x,y:d.y,z:d.z}});pitch=Math.min(.6,pitch+.008);
}
function interact(actor=state.player,kind='player',targetId=null){
 const item=manager.current.config.interaction.find(t=>(!targetId||t.id===targetId)&&Math.hypot(actor.x-t.x,actor.z-t.z)<2.3);if(!item)return;
 if(kind==='player')recordEvent(state,{type:'interact',targetId:item.id,x:actor.x,z:actor.z});
 if(item.id==='spine-door'){if(kind==='echo')return;if(state.targets.some(t=>t.hp>0)){notice('SECURITY LOCK · CLEAR THE DRONE');return;}loadSection('security-spine');notice('SECURITY SPINE · ECHO CROSSFIRE REQUIRED');}
 if(item.id==='phase-scanner'){state.scanner=true;notice(kind==='echo'?'ECHO AUTHENTICATED AT SCANNER':'PHASE SCANNER AUTHENTICATED');if(state.targets.every(t=>t.hp<=0)&&kind==='player')setScreen('results');}
}
function step(dt){
 if(state.mode!=='gameplay')return;
 state.time+=dt;tick++;weaponTick(state,dt);
 yaw+=input.lookX*.0023*options.sensitivity;pitch=Math.max(-.6,Math.min(.6,pitch-input.lookY*.002*options.sensitivity*(options.invert?-1:1)));input.lookX=input.lookY=0;
 input.movement(movement);relativeMovement(movement.x,movement.y,yaw,worldMove);
 if(input.take('dodge')&&state.dodgeWait===0){state.dodge=.24;state.dodgeWait=1.1;recordEvent(state,{type:'dodge'});}
 const speed=state.dodge>0?10:input.aim?2.8:5;
 state.player.x+=worldMove.x*speed*dt;state.player.z+=worldMove.z*speed*dt;
 const bounds=manager.current.config.bounds;state.player.x=Math.max(bounds[0]+.35,Math.min(bounds[1]-.35,state.player.x));state.player.z=Math.max(bounds[2]+.35,Math.min(bounds[3]-.35,state.player.z));
 for(const b of manager.current.walls){if(b.max.y<.2)continue;const x=Math.max(b.min.x,Math.min(b.max.x,state.player.x)),z=Math.max(b.min.z,Math.min(b.max.z,state.player.z)),dx=state.player.x-x,dz=state.player.z-z,d=Math.hypot(dx,dz);if(d>0&&d<.35){state.player.x+=dx/d*(.35-d);state.player.z+=dz/d*(.35-d);}}
 const moving=Math.hypot(worldMove.x,worldMove.z)>.05;
 const facing=input.aim||input.fire?yaw:moving?Math.atan2(worldMove.x,-worldMove.z):state.player.yaw;
 const diff=Math.atan2(Math.sin(facing-state.player.yaw),Math.cos(facing-state.player.yaw));state.player.yaw+=diff*(1-Math.exp(-dt*18));
 if(input.take('reload'))reload(state);
 if(input.take('echo')){const action=echoAction(state);if(action==='recording')recordFrame(state,yaw,pitch,moving?'run':'idle');if(action==='deployed'){$('#temporal-treatment').classList.remove('deployed');void $('#temporal-treatment').offsetWidth;$('#temporal-treatment').classList.add('deployed');}notice({recording:'RECORDING · SIX SECONDS',stored:'TRACK STORED · REPOSITION',deployed:'ECHO DEPLOYED',cooldown:'TEMPORAL RIG RECHARGING'}[action]);}
 const firePressed=input.take('fire');if(input.fire||firePressed)fire();
 if(input.take('interact'))interact();
 if(state.mode!=='gameplay')return;
 if(tick%2===0)recordFrame(state,yaw,pitch,state.dodge?'dodge':moving?'run':'idle');
 tickEcho(state,dt,event=>{if(event.type==='shot')emitShot(event.origin,event.direction,'echo');if(event.type==='interact')interact(event,'echo',event.targetId);if(event.type==='dodge')manager.current.echo.scale.y=.65;});
}
function updateCamera(dt){
 if(state.section==='command-bay'){
  const hero=manager.current.hero;hero.position.set(2,0,5);hero.rotation.y=.3;hero.userData.limbs.forEach((leg,i)=>leg.rotation.x=Math.sin(visualTime*.7+i)*.015);
  camera.position.set(4.8+Math.sin(visualTime*.12)*.15,2.4,11.4);camera.lookAt(.6,1.25,3.8);camera.fov=52;camera.updateProjectionMatrix();return;
 }
 const dir=aimDirection(yaw,pitch),distance=input.aim?6.1:8;
 anchor.set(state.player.x,1.35,state.player.z);
 desired.set(anchor.x-dir.x*distance+Math.cos(yaw)*.8,anchor.y-dir.y*distance+1.1,anchor.z-dir.z*distance+Math.sin(yaw)*.8);
 const safe=cameraPosition(anchor,desired,manager.current.walls);
 const weight=cameraSnap?1:1-Math.exp(-dt*14);camera.position.lerp(new THREE.Vector3(safe.x,safe.y,safe.z),weight);cameraSnap=false;
 const checked=cameraPosition(anchor,camera.position,manager.current.walls);camera.position.set(checked.x,checked.y,checked.z);
 // Always attached to the operative's shoulder. Look direction is independent of movement.
 look.copy(camera.position).add(new THREE.Vector3(dir.x,dir.y-flash*.25,dir.z));camera.lookAt(look);
 const fade=Math.hypot(camera.position.x-state.player.x,camera.position.z-state.player.z)<4;
 if(manager.current.hero.userData.faded!==fade){manager.current.hero.userData.faded=fade;manager.current.hero.traverse(n=>{if(n.material){n.material.transparent=fade;n.material.opacity=fade?.28:1;n.material.depthWrite=!fade;n.material.needsUpdate=true;}});}
 camera.fov+=( (input.aim?42:52)-camera.fov)*(1-Math.exp(-dt*14));camera.updateProjectionMatrix();
}
function hud(){
 const living=state.targets.find(t=>t.hp>0),section=manager.current.config;
 const objective=state.section==='skybridge'?(living?'Eliminate the scout drone':'Reach the security airlock'):living?(living.shield?'Record left. Deploy right. Break the shield.':'Neutralize the sentinel'):'Authenticate at the phase scanner';
 if(objective!==lastObjective){$('#objective').textContent=objective;$('.hud-objective').classList.remove('updated');void $('.hud-objective').offsetWidth;$('.hud-objective').classList.add('updated');lastObjective=objective;}
 $('#section-name').textContent=section.name;
 const degrees=((yaw*180/Math.PI)%360+360)%360;$('#heading').textContent=`${['N','E','S','W'][Math.round(degrees/90)%4]} · ${Math.round(degrees).toString().padStart(3,'0')}`;
 const target=living||section.interaction[0];let near=false;
 if(target){const dx=target.x-state.player.x,dz=target.z-state.player.z,angle=Math.atan2(dx,-dz)-yaw;$('#objective-distance').textContent=`${Math.sin(angle)>.3?'→':Math.sin(angle)<-.3?'←':'↑'} ${Math.round(Math.hypot(dx,dz))} M`;}
 const item=section.interaction[0];if(item)near=Math.hypot(state.player.x-item.x,state.player.z-item.z)<2.3;
 $('#interaction').hidden=$('#use-button').hidden=!near;$('#interaction').textContent=state.section==='skybridge'?'E / USE · ENTER SECURITY SPINE':'E / USE · AUTHENTICATE SCANNER';
 $('#echo-state').textContent=state.recording?`REC ${state.recording.duration.toFixed(1)} / 6.0`:state.echo?'ECHO ACTIVE':state.stored?'READY TO DEPLOY':state.cooldown>0?`COOLDOWN ${state.cooldown.toFixed(1)}`:'READY TO RECORD';
 $('#echo-meter').style.width=`${state.recording?state.recording.duration/6*100:state.cooldown?100-state.cooldown/4*100:100}%`;
 $('#echo-count').textContent=`${state.echo?1:0} / 1 ECHO ACTIVE`;
 $('#ammo').textContent=state.magazine;$('#reserve').textContent=` / ${state.reserve}`;$('#reload-state').textContent=state.reload?`RELOADING ${state.reload.toFixed(1)}`:'R / TAP TO RELOAD';
 $('#temporal-treatment').classList.toggle('recording',!!state.recording);
 $('#hit-marker').style.opacity=hitTime>0?'1':'0';$('#event-notice').textContent=noticeTime>0?state.notice:'';
 $('#reticle').style.width=$('#reticle').style.height=`${input.aim?20:30+Math.hypot(movement.x,movement.y)*8+flash*80}px`;
 const dir=new THREE.Vector3();camera.getWorldDirection(dir);const enemy=aimRay(camera.position,dir).target;
 $('#enemy-info').hidden=!enemy;if(enemy){$('#enemy-name').textContent=enemy.shield?'PHASE SHIELD':enemy.id.toUpperCase();$('#enemy-health').max=enemy.maxHp;$('#enemy-health').value=enemy.hp;}
 document.querySelectorAll('[data-control]').forEach(e=>e.classList.toggle('pressed',input.buttons.has(e.dataset.control)));
}
for(let i=0;i<5;i++)$('#health').append(document.createElement('i'));
window.__GAME__={ready:false,started:false,mode:'boot'};
function render(now){
 const timing=clock.tick(now,step),dt=Math.min(timing.realDt,.1);visualTime+=dt;flash=Math.max(0,flash-dt);hitTime=Math.max(0,hitTime-dt);noticeTime=Math.max(0,noticeTime-dt);
 const room=manager.current;
 if(room){
  if(state.section!=='command-bay'){room.hero.position.set(state.player.x,0,state.player.z);room.hero.rotation.y=-state.player.yaw;room.hero.scale.y=state.dodge>0?.72:1;room.hero.userData.limbs.forEach((leg,i)=>leg.rotation.x=Math.sin(state.time*12+i*Math.PI)*Math.min(.4,Math.hypot(worldMove.x,worldMove.z)*.4));}
  room.hero.userData.muzzle.visible=flash>0;room.echo.visible=!!state.echo;
  if(state.echo?.frame){const f=state.echo.frame;room.echo.position.set(f.x,0,f.z);room.echo.rotation.y=-f.yaw;room.echo.scale.y=f.pose==='dodge'?.7:1;}
  for(const t of state.targets){const view=room.drones.get(t.id);view.visible=t.hp>0;view.position.y=t.y+Math.sin(visualTime*2)*.035;view.rotation.z=Math.sin(visualTime*1.5)*.05;view.userData.shield.visible=!!t.shield;view.userData.shield.rotation.y=visualTime*.2;}
  for(const fx of room.effects){fx.life-=dt;fx.tracer.visible=fx.spark.visible=fx.life>0;}
  updateCamera(dt);if(['gameplay','pause'].includes(state.mode))hud();
 }
 if(!document.hidden)renderer.render(scene,camera);
 const head=new THREE.Vector3(state.player.x,1.85,state.player.z).project(camera),foot=new THREE.Vector3(state.player.x,0,state.player.z).project(camera);
 const telemetry=window.__GAME__;
 Object.assign(telemetry,{ready:window.__READY__,started:state.section!=='command-bay',mode:state.mode,section:state.section,pos:[state.player.x,state.player.z],fps:fps.push(timing.realDt),speed:state.mode==='gameplay'?Math.hypot(worldMove.x,worldMove.z)*(state.dodge?10:5):0,score:state.eliminations*100,over:state.mode==='results',draws:renderer.info.render.calls,tris:renderer.info.render.triangles,elapsedTime:state.time,health:state.health,armor:state.armor,magazine:state.magazine,reserve:state.reserve,reload:state.reload,shots:state.shots,hits:state.hits,echoCount:state.echo?1:0,recordingTime:state.recording?.duration||0,storedDuration:state.stored?.duration||0,echoCooldown:state.cooldown,synchronized:state.synchronized,echoEliminations:state.echoEliminations,scanner:state.scanner,coreSecured:state.coreSecured,targets:state.targets.map(t=>({id:t.id,hp:t.hp,shield:!!t.shield,x:t.x,y:t.y,z:t.z})),camera:{x:camera.position.x,y:camera.position.y,z:camera.position.z,fov:camera.fov,yaw,pitch},heroHeightFraction:Math.abs(head.y-foot.y)/2,sceneLoads:manager.loads,sceneDisposals:manager.disposals,sceneRoots:scene.children.length,geometries:renderer.info.memory.geometries,textures:renderer.info.memory.textures,input:{x:movement.x,y:movement.y,fire:input.fire,aim:input.aim},settings:{...options},stats:statistics(state)});
 requestAnimationFrame(render);
}
loadSection('command-bay');renderer.render(scene,camera);window.__START__=insert;window.__READY__=true;window.__GAME__.ready=true;window.__GAME__.readyMs=performance.now();setScreen('menu');requestAnimationFrame(render);
