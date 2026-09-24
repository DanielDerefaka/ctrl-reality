import * as THREE from '../vendor/three.module.js';
// Articulated development asset; final 404 candidate verification is pending.
export const ANIMATIONS=['BOOT_IDLE','TITLE_IDLE','ENTER_ARCHIVE','IDLE','WALK','FAST_WALK','START_MOVE','STOP_MOVE','TURN_LEFT','TURN_RIGHT','CONTROL_REACH','CONTROL_PULL','CONTROL_DRAG','CONTROL_DEPLOY','CONTROL_RETRIEVE','SOCKET_LOCK_REACTION','BRIDGE_REVEAL_REACTION','CHECKPOINT','REALIGN_FAILURE','VICTORY_IDLE'];
export function createMara(){
 const root=new THREE.Group();root.name='maraRoot';const bones={maraRoot:root};
 const black=new THREE.MeshStandardMaterial({color:0x111922,metalness:.75,roughness:.3});
 const cloth=new THREE.MeshStandardMaterial({color:0x080e16,metalness:.28,roughness:.7});
 const ivory=new THREE.MeshStandardMaterial({color:0xe7e1d5,metalness:.24,roughness:.32});
 const bronze=new THREE.MeshStandardMaterial({color:0xc99a4a,metalness:.84,roughness:.25});
 const cyan=new THREE.MeshStandardMaterial({color:0x56e8f2,emissive:0x24cbdc,emissiveIntensity:2,metalness:.4,roughness:.22});
 function joint(name,parent,x,y,z){const g=new THREE.Group();g.name=name;g.position.set(x,y,z);parent.add(g);bones[name]=g;return g;}
 function mesh(geo,mat,parent,x=0,y=0,z=0,sx=1,sy=1,sz=1){const m=new THREE.Mesh(geo,mat);m.position.set(x,y,z);m.scale.set(sx,sy,sz);m.castShadow=true;m.receiveShadow=true;parent.add(m);return m;}
 const sphere=new THREE.SphereGeometry(1,12,10);const ball=(p,x,y,z,a,b,c,mat=black)=>mesh(sphere,mat,p,x,y,z,a,b,c);
 const limb=(p,len,a,b,mat=black)=>mesh(new THREE.CylinderGeometry(a,b,len,8),mat,p,0,-len/2,0);
 const ring=(p,r,y,mat=bronze)=>{const m=mesh(new THREE.TorusGeometry(r,.014,4,16),mat,p,0,y,0);m.rotation.x=Math.PI/2;return m;};
 const pelvis=joint('pelvis',root,0,.96,0);ball(pelvis,0,0,0,.21,.15,.14,cloth);
 const spineLower=joint('spineLower',pelvis,0,.13,0);mesh(new THREE.CylinderGeometry(.23,.15,.24,8),black,spineLower,0,.08,0,1,1,.7);ring(spineLower,.168,-.025);
 const spineUpper=joint('spineUpper',spineLower,0,.2,0);ball(spineUpper,0,.1,0,.235,.245,.14);mesh(new THREE.CylinderGeometry(.22,.19,.31,6),black,spineUpper,0,.08,0,1,1,.63);
 for(const side of [-1,1]){const seam=mesh(new THREE.BoxGeometry(.012,.38,.012),bronze,spineUpper,side*.12,.08,.151);seam.rotation.z=side*.24;}
 const neck=joint('neck',spineUpper,0,.31,0);limb(neck,.07,.068,.075,bronze);
 // High segmented collar and a fully closed ceramic mask: no exposed face.
 mesh(new THREE.CylinderGeometry(.115,.145,.12,10,1,true),black,neck,0,0,0);
 const head=joint('head',neck,0,.085,0);ball(head,0,.03,0,.139,.197,.135,black);
 const mask=joint('mask',head,0,0,.065);ball(mask,0,.03,.045,.128,.184,.084,ivory);
 const chin=mesh(new THREE.ConeGeometry(.102,.19,4),ivory,mask,0,-.10,.067,.76,1,.48);chin.rotation.z=Math.PI;
 for(const side of [-1,1]){const slit=mesh(new THREE.BoxGeometry(.049,.008,.01),cyan,mask,side*.057,.069,.119);slit.rotation.z=side*.28;const line=mesh(new THREE.BoxGeometry(.006,.17,.008),bronze,mask,side*.082,-.01,.096);line.rotation.z=side*.24;const ear=mesh(new THREE.TorusGeometry(.064,.012,5,18),bronze,head,side*.135,.035,0);ear.rotation.y=Math.PI/2;}
 mesh(new THREE.BoxGeometry(.006,.23,.007),bronze,mask,0,.03,.13);
 for(const [side,x]of [['left',-.30],['right',.30]]){
  const shoulder=joint(side+'Shoulder',spineUpper,x,.21,0);const arm=joint(side+'UpperArm',shoulder,0,0,0);ball(arm,0,0,0,.108,.115,.12);limb(arm,.285,.07,.054);
  const panel=joint(side==='left'?'shoulderPanel':'rightShoulderPanel',shoulder,0,.025,0);ball(panel,0,0,0,.113,.055,.13,bronze);ball(panel,0,.023,0,.109,.06,.124,black);
  const forearm=joint(side+'Forearm',arm,0,-.285,0);ball(forearm,0,0,0,.057,.06,.055,bronze);limb(forearm,.25,.061,.046);ring(forearm,.055,-.2);
  const hand=joint(side+'Hand',forearm,0,-.27,0);ball(hand,0,-.035,0,.047,.079,.026);for(let i=0;i<4;i++)limb(joint(side+'Finger'+i,hand,-.03+i*.02,-.07,.006),.068,.009,.006);
  if(side==='left'){const core=joint('gloveCore',forearm,0,-.13,.049);mesh(new THREE.BoxGeometry(.025,.17,.018),cyan,core);const glow=joint('gloveLight',hand,0,0,.027);mesh(new THREE.BoxGeometry(.033,.065,.01),cyan,glow,0,-.025,0);const g=joint('gloveRing',forearm,0,-.22,0);ring(g,.061,0,cyan);for(let i=0;i<4;i++)mesh(new THREE.BoxGeometry(.008,.06,.009),cyan,hand,-.03+i*.02,-.095,.025);}
  const hip=joint(side+'Hip',pelvis,x*.48,-.04,0);const thigh=joint(side+'Thigh',hip,0,0,0);limb(thigh,.43,.097,.066,cloth);const shin=joint(side+'Shin',thigh,0,-.43,0);ball(shin,0,0,.014,.068,.075,.06,bronze);limb(shin,.38,.067,.047);const foot=joint(side+'Foot',shin,0,-.38,0);ball(foot,0,-.025,.055,.063,.057,.145);mesh(new THREE.BoxGeometry(.011,.3,.018),bronze,shin,0,-.19,.051);
 }
 // Three separately hinged, tapered coat panels; shape is authored procedurally.
 for(const [name,x,z,angle]of [['coatLeft',-.16,0,-.2],['coatRight',.16,0,.2],['coatBack',0,-.13,0]]){
  const panel=joint(name,pelvis,x,.02,z);const shape=new THREE.Shape();shape.moveTo(-.10,0);shape.lineTo(.1,0);shape.lineTo(.23,-.84);shape.quadraticCurveTo(0,-.91,-.23,-.84);shape.closePath();const m=mesh(new THREE.ExtrudeGeometry(shape,{depth:.026,bevelEnabled:true,bevelSize:.012,bevelThickness:.01,bevelSegments:1,steps:1,curveSegments:3}),black,panel,0,0,0);panel.rotation.z=angle;if(name==='coatBack')panel.rotation.y=Math.PI;
  const points=[new THREE.Vector3(-.10,0,.034),new THREE.Vector3(-.23,-.84,.034),new THREE.Vector3(0,-.88,.034),new THREE.Vector3(.23,-.84,.034),new THREE.Vector3(.10,0,.034)];panel.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(points),new THREE.LineBasicMaterial({color:0xc99a4a})));
 }
 // Back seams and a high collar preserve the long tailored silhouette.
 for(const side of [-1,1]){const seam=mesh(new THREE.BoxGeometry(.01,.4,.012),bronze,spineUpper,side*.10,.07,-.145);seam.rotation.z=side*-.22;}
 root.scale.setScalar(1.08);return {root,bones,cyan};
}
const ease=x=>x*x*(3-2*x);
export class MaraAnimator{
 constructor(mara){this.mara=mara;this.state='TITLE_IDLE';this.time=0;this.clock=0;this.weight=0;this.prevState=this.state;this.previous={};}
 set(state){if(state===this.state)return;this.previous={};for(const [k,b]of Object.entries(this.mara.bones))this.previous[k]=[b.rotation.x,b.rotation.y,b.rotation.z];this.prevState=this.state;this.state=state;this.time=0;}
 update(dt,reduced=false){this.time+=dt;this.clock+=dt;const t=this.time,b=this.mara.bones,pose={};for(const k of Object.keys(b))pose[k]=[0,0,0];pose.coatLeft[2]=-.2;pose.coatRight[2]=.2;pose.coatBack[1]=Math.PI;
  const walk=['WALK','FAST_WALK','START_MOVE','ENTER_ARCHIVE'].includes(this.state);const a=walk?Math.sin(this.clock*(this.state==='FAST_WALK'?10:7)):0;const amount=this.state==='ENTER_ARCHIVE'?.22:.48;
  pose.leftThigh[0]=a*amount;pose.rightThigh[0]=-a*amount;pose.leftShin[0]=Math.max(0,-a)*.65;pose.rightShin[0]=Math.max(0,a)*.65;pose.leftFoot[0]=-Math.max(0,a)*.2;pose.rightFoot[0]=-Math.max(0,-a)*.2;pose.leftUpperArm[0]=-a*.25;pose.rightUpperArm[0]=a*.25;pose.leftUpperArm[2]=.10;pose.rightUpperArm[2]=-.10;
  pose.spineUpper[1]=walk?a*.035:Math.sin(this.clock*.65)*.025;pose.head[1]=Math.sin(this.clock*.43)*.065;pose.coatLeft[0]=-.06+Math.max(0,-a)*.24;pose.coatRight[0]=-.06+Math.max(0,a)*.24;pose.coatBack[0]=walk?-.12-Math.abs(a)*.13:-.03;
  if(this.state.startsWith('CONTROL_')){const reach=this.state==='CONTROL_DRAG'?.9:Math.sin(Math.min(1,t/1.2)*Math.PI)*.9;pose.leftUpperArm[0]=-reach;pose.leftForearm[0]=-.45;pose.leftHand[0]=-.15;pose.spineUpper[1]=-.09;pose.head[0]=.1;}
  if(this.state==='SOCKET_LOCK_REACTION'||this.state==='BRIDGE_REVEAL_REACTION'){pose.head[0]=-.12;pose.leftForearm[0]=-.35*Math.exp(-t);}
  if(this.state==='TURN_LEFT'||this.state==='TURN_RIGHT')pose.spineUpper[1]=(this.state==='TURN_LEFT'?1:-1)*.2;
  if(this.state==='CHECKPOINT'||this.state==='VICTORY_IDLE'){pose.head[0]=-.08;pose.leftUpperArm[0]=-.3;pose.leftForearm[0]=-.4;}
  if(this.state==='REALIGN_FAILURE'){pose.spineUpper[0]=.22;pose.leftUpperArm[2]=.45;pose.rightUpperArm[2]=-.45;pose.head[0]=.2;}
  const blend=ease(Math.min(1,t/.19));for(const [k,v]of Object.entries(pose)){if(k==='maraRoot')continue;const old=this.previous[k]||v;b[k].rotation.set(...v.map((n,i)=>old[i]+(n-old[i])*blend));}
  b.pelvis.position.y=.96+(walk?Math.abs(a)*.025:Math.sin(this.clock*1.8)*.003);this.mara.cyan.emissiveIntensity=reduced?1.4:1.5+Math.sin(this.clock*2)*.25;
 }
}
