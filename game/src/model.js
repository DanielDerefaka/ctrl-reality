export const SOCKET={x:-2,z:-2.2};
export const FRAGMENTS=[{x:3.1,z:3},{x:-3.6,z:-1.4},{x:2.8,z:-14}];
export function createState(){return {x:0,z:6,y:0,yaw:Math.PI,installed:false,bridge:0,elapsed:0,resets:0,moves:0,fragments:[],checkpoint:{x:0,z:6,installed:false},failure:0,won:false,checkpointReached:false,moving:false};}
export const nearSocket=s=>Math.hypot(s.x-SOCKET.x,s.z-SOCKET.z)<3.1;
export function install(s){if(s.failure||s.won||s.installed||!nearSocket(s))return false;s.installed=true;s.moves++;return true;}
export function retrieve(s){if(s.failure||s.won||!s.installed||!nearSocket(s))return false;s.installed=false;s.moves++;return true;}
export function restart(s,count=true){if(count)s.resets++;s.x=s.checkpoint.x;s.z=s.checkpoint.z;s.y=0;s.yaw=Math.PI;s.installed=s.checkpoint.installed;s.bridge=s.installed?1:0;s.failure=0;s.won=false;s.moving=false;}
export function groundAt(x,z,bridge){return (Math.abs(x)<5.4&&z<9&&z>-4.1)||(Math.abs(x)<4.8&&z<-10&&z>-20)||(Math.abs(x)<1.45&&z<=-4.1&&z>=-10&&bridge>=.99);}
export function step(s,input,dt){
 const events=[];if(s.won)return events;
 if(s.failure){s.failure+=dt;s.y=-Math.min(3,s.failure*4);if(s.failure>=1.25){restart(s);events.push('reset');}return events;}
 s.elapsed+=dt;s.bridge=Math.max(0,Math.min(1,s.bridge+(s.installed?1:-1)*dt/.95));
 let {x,z}=input;const l=Math.hypot(x,z);if(l>1){x/=l;z/=l;}s.moving=l>.08;
 if(s.moving){s.x+=x*3.4*dt;s.z+=z*3.4*dt;s.yaw=Math.atan2(x,z);}
 if(!groundAt(s.x,s.z,s.bridge)){s.failure=.001;s.moving=false;events.push('failure');return events;}
 for(let i=0;i<FRAGMENTS.length;i++){const f=FRAGMENTS[i];if(!s.fragments.includes(i)&&Math.hypot(s.x-f.x,s.z-f.z)<.85){s.fragments.push(i);events.push('fragment');}}
 if(s.z<-11.2&&!s.checkpointReached){s.checkpoint={x:0,z:-12,installed:true};s.checkpointReached=true;events.push('checkpoint');}
 return events;
}
export function restoreArchive(s){if(s.failure||s.won)return false;if(Math.hypot(s.x,s.z+17)>2.3)return false;s.won=true;s.moving=false;return true;}
export function results(s){const efficiency=Math.max(0,100-s.resets*12-Math.max(0,s.moves-1)*4);return {seconds:Math.floor(s.elapsed),resets:s.resets,fragments:s.fragments.length,moves:s.moves,efficiency,rank:efficiency>=95&&s.fragments.length===3?'S':efficiency>=85?'A':efficiency>=65?'B':'C'};}
