import * as THREE from '../vendor/archive-three.js';
import {ASSET,bakeStatic} from '../src/assetlib.js';
// Selected official-404 candidate. Pivots remain articulated; only rigid siblings merge.
export {ANIMATIONS} from '../src/animations.js';
export async function createMara(){
 const root=await ASSET('./assets/production/mara.js',{height:1.8,keepHierarchy:true});
 const bones=root.userData.joints;if(!bones?.pelvis)throw new Error('Mara rig failed to load');
 let cyan;root.traverse(o=>{if(o.isMesh&&o.material.name==='interface')cyan=o.material;});
 const groups=[];root.traverse(o=>{if(o.isGroup)groups.push(o);});
 for(const group of groups){const meshes=group.children.filter(o=>o.isMesh);if(meshes.length<2)continue;const rigid=new THREE.Group();for(const mesh of meshes)rigid.add(mesh);const baked=bakeStatic(rigid);group.add(baked);}
 return {root,bones,cyan};
}
const ease=x=>x*x*(3-2*x);
export class MaraAnimator{
 constructor(mara){this.mara=mara;this.state='TITLE_IDLE';this.time=0;this.clock=0;this.weight=0;this.prevState=this.state;this.previous={};this.rest={};for(const [k,b] of Object.entries(mara.bones))this.rest[k]=[b.rotation.x,b.rotation.y,b.rotation.z];this.restHeight=mara.bones.pelvis.position.y;}
 set(state){if(state===this.state)return;this.previous={};for(const [k,b]of Object.entries(this.mara.bones))this.previous[k]=[b.rotation.x,b.rotation.y,b.rotation.z];this.prevState=this.state;this.state=state;this.time=0;}
 update(dt,reduced=false,player={}){this.time+=dt;this.clock+=dt;const t=this.time,b=this.mara.bones,pose={};for(const k of Object.keys(b))pose[k]=[...this.rest[k]];
  const walk=['WALK','FAST_WALK','START_MOVE'].includes(this.state)&&player.moving;const phase=(player.distance||0)/1.36*Math.PI*2;const a=walk?Math.sin(phase):0;
  // Distance-driven gait: stance feet travel backward at exactly ground speed.
  // Two-link sagittal IK keeps ankles level and raises only the swing foot.
  if(walk)for(const [side,offset]of [['left',0],['right',.5]]){
   const cycle=((player.distance||0)/1.36+offset)%1,stance=cycle<.5;
   const u=stance?cycle*2:(cycle-.5)*2;
   const z=stance?.34-.68*u:-.34+.68*(u*u*(3-2*u));
   const y=-.792+(stance?0:Math.sin(Math.PI*u)*.12);
   const l1=.415,l2=.409,r=Math.min(.821,Math.hypot(y,z));
   const knee=Math.acos(Math.max(-1,Math.min(1,(r*r-l1*l1-l2*l2)/(2*l1*l2))));
   const hip=Math.atan2(-z,-y)-Math.atan2(l2*Math.sin(knee),l1+l2*Math.cos(knee));
   pose[side+'Thigh'][0]=hip;pose[side+'Shin'][0]=knee;pose[side+'Foot'][0]=-hip-knee;
  }
  pose.leftUpperArm[0]=-a*.18;pose.rightUpperArm[0]=a*.18;pose.leftUpperArm[2]=-.12;pose.rightUpperArm[2]=.12;pose.leftForearm[0]=-.12;pose.rightForearm[0]=-.12;
  pose.spineUpper[1]=walk?a*.035:Math.sin(this.clock*.65)*.025;pose.head[1]=Math.sin(this.clock*.43)*.065;const delayed=walk?Math.sin(phase-.35):0;pose.coatLeft[0]=-.04+Math.max(0,-delayed)*.34;pose.coatRight[0]=-.04+Math.max(0,delayed)*.34;pose.coatLeft[2]=-.025;pose.coatRight[2]=.025;pose.coatBack[0]=walk?-.13-Math.abs(delayed)*.12:-.03;
  if(this.state.startsWith('CONTROL_')){const reach=this.state==='CONTROL_DRAG'?.9:Math.sin(Math.min(1,t/1.2)*Math.PI)*.9;pose.leftUpperArm[0]=-reach;pose.leftForearm[0]=-.45;pose.leftHand[0]=-.15;pose.spineUpper[1]=-.09;pose.head[0]=.1;}
  if(this.state==='SOCKET_LOCK_REACTION'||this.state==='BRIDGE_REVEAL_REACTION'){pose.head[0]=-.12;pose.leftForearm[0]=-.35*Math.exp(-t);}
  if(this.state==='TURN_LEFT'||this.state==='TURN_RIGHT')pose.spineUpper[1]=(this.state==='TURN_LEFT'?1:-1)*.2;
  if(this.state==='CHECKPOINT'||this.state==='VICTORY_IDLE'){pose.head[0]=-.08;pose.leftUpperArm[0]=-.3;pose.leftForearm[0]=-.4;}
  if(this.state==='REALIGN_FAILURE'){const reverse=Math.sin(Math.PI*Math.min(1,t/1.25));pose.spineUpper[0]=.22*reverse;pose.leftUpperArm[2]=.45*reverse;pose.rightUpperArm[2]=-.45*reverse;pose.head[0]=.2*reverse;}
  const blend=ease(Math.min(1,t/.19));for(const [k,v]of Object.entries(pose)){if(k==='maraRoot')continue;const old=this.previous[k]||v;b[k].rotation.set(...v.map((n,i)=>old[i]+(n-old[i])*blend));}
  b.pelvis.position.y=this.restHeight+(walk?Math.abs(a)*.008:Math.sin(this.clock*1.8)*.003);this.mara.cyan.emissiveIntensity=reduced?1.4:1.5+Math.sin(this.clock*2)*.25;
 }
}
