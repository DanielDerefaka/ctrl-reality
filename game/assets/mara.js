import * as THREE from '../vendor/three.module.js';
import {ASSET,bakeStatic} from '../src/assetlib.js';
// Selected official-404 candidate. Pivots remain articulated; only rigid siblings merge.
export const ANIMATIONS=['BOOT_IDLE','TITLE_IDLE','ENTER_ARCHIVE','IDLE','WALK','FAST_WALK','START_MOVE','STOP_MOVE','TURN_LEFT','TURN_RIGHT','CONTROL_REACH','CONTROL_PULL','CONTROL_DRAG','CONTROL_DEPLOY','CONTROL_RETRIEVE','SOCKET_LOCK_REACTION','BRIDGE_REVEAL_REACTION','CHECKPOINT','REALIGN_FAILURE','VICTORY_IDLE'];
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
 update(dt,reduced=false){this.time+=dt;this.clock+=dt;const t=this.time,b=this.mara.bones,pose={};for(const k of Object.keys(b))pose[k]=[...this.rest[k]];
  const walk=['WALK','FAST_WALK','START_MOVE','ENTER_ARCHIVE'].includes(this.state);const a=walk?Math.sin(this.clock*(this.state==='FAST_WALK'?10:7)):0;const amount=this.state==='ENTER_ARCHIVE'?.22:.48;
  pose.leftThigh[0]=a*amount;pose.rightThigh[0]=-a*amount;pose.leftShin[0]=Math.max(0,-a)*.65;pose.rightShin[0]=Math.max(0,a)*.65;pose.leftFoot[0]=-Math.max(0,a)*.2;pose.rightFoot[0]=-Math.max(0,-a)*.2;pose.leftUpperArm[0]=-a*.25;pose.rightUpperArm[0]=a*.25;pose.leftUpperArm[2]=-.16;pose.rightUpperArm[2]=.16;pose.leftForearm[0]=-.12;pose.rightForearm[0]=-.12;
  pose.spineUpper[1]=walk?a*.035:Math.sin(this.clock*.65)*.025;pose.head[1]=Math.sin(this.clock*.43)*.065;pose.coatLeft[0]=-.06+Math.max(0,-a)*.24;pose.coatRight[0]=-.06+Math.max(0,a)*.24;pose.coatBack[0]=walk?-.12-Math.abs(a)*.13:-.03;
  if(this.state.startsWith('CONTROL_')){const reach=this.state==='CONTROL_DRAG'?.9:Math.sin(Math.min(1,t/1.2)*Math.PI)*.9;pose.leftUpperArm[0]=-reach;pose.leftForearm[0]=-.45;pose.leftHand[0]=-.15;pose.spineUpper[1]=-.09;pose.head[0]=.1;}
  if(this.state==='SOCKET_LOCK_REACTION'||this.state==='BRIDGE_REVEAL_REACTION'){pose.head[0]=-.12;pose.leftForearm[0]=-.35*Math.exp(-t);}
  if(this.state==='TURN_LEFT'||this.state==='TURN_RIGHT')pose.spineUpper[1]=(this.state==='TURN_LEFT'?1:-1)*.2;
  if(this.state==='CHECKPOINT'||this.state==='VICTORY_IDLE'){pose.head[0]=-.08;pose.leftUpperArm[0]=-.3;pose.leftForearm[0]=-.4;}
  if(this.state==='REALIGN_FAILURE'){pose.spineUpper[0]=.22;pose.leftUpperArm[2]=.45;pose.rightUpperArm[2]=-.45;pose.head[0]=.2;}
  const blend=ease(Math.min(1,t/.19));for(const [k,v]of Object.entries(pose)){if(k==='maraRoot')continue;const old=this.previous[k]||v;b[k].rotation.set(...v.map((n,i)=>old[i]+(n-old[i])*blend));}
  b.pelvis.position.y=this.restHeight+(walk?Math.abs(a)*.025:Math.sin(this.clock*1.8)*.003);this.mara.cyan.emissiveIntensity=reduced?1.4:1.5+Math.sin(this.clock*2)*.25;
 }
}
