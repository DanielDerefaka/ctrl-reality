// One Atrium, three connected uses of the same physical control.
export const SOCKET={x:1.8,z:-1.5};
export const SOCKETS=[SOCKET,{x:2,z:-9.6},{x:-1.7,z:-15.8}];
export const FRAGMENTS=[{x:2.7,z:3},{x:-3,z:-1},{x:2.8,z:-14}];
export const GLYPH_SEQUENCE=[2,0,1];
export const NODES=[{x:-2.7,z:-14},{x:0,z:-15},{x:1.8,z:-16.5}];
export const LEVELS=['DIM','BALANCED','RADIANT'];
export function createState(){return {x:0,z:4.6,y:0,yaw:Math.PI,installed:false,installedSocket:-1,brightness:'BALANCED',bridge:0,bridgeLatched:false,stage:0,glyphSeen:false,glyphInput:[],readSolved:false,nodesSeen:false,cleared:[],restoration:0,elapsed:0,resets:0,moves:0,deployments:0,fragments:[],checkpoint:{x:0,z:4.6,installed:false,installedSocket:-1,brightness:'BALANCED',stage:0,bridgeLatched:false,readSolved:false,cleared:[]},failure:0,won:false,checkpointReached:false,moving:false,distance:0};}
export const activeSocket=s=>SOCKETS[s.stage];
export const nearSocket=s=>Math.hypot(s.x-activeSocket(s).x,s.z-activeSocket(s).z)<2.65;
export function install(s){if(s.failure||s.won||s.installed||!nearSocket(s))return false;s.installed=true;s.installedSocket=s.stage;s.brightness='BALANCED';s.moves++;s.deployments++;return true;}
export function retrieve(s){if(s.failure||s.won||!s.installed||!nearSocket(s)||s.restoration)return false;s.installed=false;s.installedSocket=-1;s.moves++;return true;}
export function setBrightness(s,value){if(!LEVELS.includes(value)||!s.installed||s.failure||s.won||s.restoration||s.installedSocket!==s.stage||!nearSocket(s))return false;s.brightness=value;if(s.stage===1&&value==='DIM')s.glyphSeen=true;if(s.stage===2&&value==='DIM')s.nodesSeen=true;return true;}
export function activateGlyph(s,index){if(s.stage!==1||!s.installed||s.installedSocket!==1||s.brightness!=='BALANCED'||!s.glyphSeen||!nearSocket(s)||s.failure||s.readSolved)return false;if(GLYPH_SEQUENCE[s.glyphInput.length]!==index){s.glyphInput=[];s.failure=.001;return false;}s.glyphInput.push(index);if(s.glyphInput.length===3)s.readSolved=true;return true;}
export function clearNode(s,index){if(s.stage!==2||!s.nodesSeen||!s.installed||s.installedSocket!==2||s.brightness!=='BALANCED'||s.failure||!nearSocket(s)||s.cleared.includes(index)||!NODES[index])return false;s.cleared.push(index);return true;}
function checkpoint(s,x,z){s.checkpoint={x,z,installed:s.installed,installedSocket:s.installedSocket,brightness:s.brightness,stage:s.stage,bridgeLatched:s.bridgeLatched,readSolved:s.readSolved,cleared:[...s.cleared]};}
export function restart(s,count=true){if(count)s.resets++;const cp=s.checkpoint;Object.assign(s,{...cp,cleared:[...cp.cleared],y:0,yaw:Math.PI,bridge:cp.bridgeLatched?1:0,failure:0,restoration:0,won:false,moving:false,glyphInput:[]});}
export function groundAt(x,z,bridge,readSolved=false){return (Math.abs(x)<4.3&&z<7&&z>-3)||(Math.abs(x)<4.15&&z<=-8&&z>-12.6)||(Math.abs(x)<3.9&&z<=-13.1&&z>-18.5)||(Math.abs(x)<1.35&&z<=-3&&z>=-8&&bridge>=.99)||(Math.abs(x)<1.6&&z<=-12.6&&z>=-13.1&&readSolved);}
export function restoreArchive(s){if(s.failure||s.won||s.stage!==2||!s.installed||s.installedSocket!==2||s.brightness!=='RADIANT'||s.cleared.length!==3||!nearSocket(s))return false;if(!s.restoration)s.restoration=.001;return true;}
export function step(s,input,dt){
 const events=[];if(s.won)return events;
 if(s.failure){s.failure+=dt;const t=s.failure;s.y=t<.15?0:t<.6?-(t-.15)*2:-(1.25-t)*1.38;if(t>=1.25){restart(s);events.push('reset');}return events;}
 if(s.restoration){s.restoration=Math.min(1,s.restoration+dt/2.2);s.moving=false;if(s.restoration===1){s.won=true;events.push('victory');}return events;}
 s.elapsed+=dt;const powered=s.bridgeLatched||(s.installed&&s.installedSocket===0&&s.brightness==='RADIANT');s.bridge=Math.max(0,Math.min(1,s.bridge+(powered?1:-1)*dt/1.85));
 let {x,z}=input;const l=Math.hypot(x,z);if(l>1){x/=l;z/=l;}s.moving=l>.08;
 if(s.moving){s.x+=x*3.4*dt;s.z+=z*3.4*dt;s.distance+=Math.min(1,l)*3.4*dt;s.yaw=Math.atan2(x,z);}
 // Keep Mara's body outside the physical pedestal, including while turning beside it.
 for(const socket of SOCKETS){const dx=s.x-socket.x,dz=s.z-socket.z,d=Math.hypot(dx,dz),radius=.66;if(d<radius){s.x=socket.x+(d>.001?dx/d:0)*radius;s.z=socket.z+(d>.001?dz/d:1)*radius;}}
 const unstable=s.brightness==='RADIANT'&&s.stage>0&&s.x>3.1&&s.z<-9;
 const corrupt=s.stage===2&&s.brightness==='RADIANT'&&NODES.some((n,i)=>!s.cleared.includes(i)&&Math.hypot(s.x-n.x,s.z-n.z)<.5);
 if(!groundAt(s.x,s.z,s.bridge,s.readSolved)||unstable||corrupt){s.failure=.001;s.moving=false;events.push('failure');return events;}
 s.y=s.z<-13.1?-.10:0;
 // The second threshold is physically sealed until the remembered sequence is correct.
 if(!s.readSolved&&s.z<-12.35&&s.stage===1){s.z=-12.35;s.moving=false;}
 for(let i=0;i<FRAGMENTS.length;i++){const f=FRAGMENTS[i];if(!s.fragments.includes(i)&&Math.hypot(s.x-f.x,s.z-f.z)<.85){s.fragments.push(i);events.push('fragment');}}
 if(s.z<-8.5&&s.stage===0){s.stage=1;s.bridgeLatched=true;s.bridge=1;s.checkpointReached=true;checkpoint(s,0,-9);events.push('checkpoint');}
 if(s.readSolved&&s.z<-13.3&&s.stage===1){s.stage=2;checkpoint(s,0,-13.7);events.push('checkpoint');}
 return events;
}
export function results(s){const efficiency=Math.max(0,100-s.resets*12-Math.max(0,s.deployments-3)*4);return {seconds:Math.floor(s.elapsed),resets:s.resets,fragments:s.fragments.length,moves:s.deployments,efficiency,rank:efficiency>=95&&s.fragments.length===3?'S':efficiency>=85?'A':efficiency>=65?'B':'C'};}
