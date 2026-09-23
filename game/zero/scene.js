// PROTOTYPE_ONLY: every mesh, light fixture, backdrop and effect here is temporary code geometry.
import * as THREE from '../vendor/three.module.js';
import { SECTIONS, segmentBox } from './rules.js';
export const C={void:0x05070c,metal:0x151b24,white:0xdde5eb,cyan:0x45e6ff,deep:0x0b8fa8,red:0xff355e,amber:0xffb84d,violet:0x8a6cff,glass:0x17394c};
function mat(color,glow=0){return new THREE.MeshStandardMaterial({color,roughness:.55,metalness:.42,emissive:color,emissiveIntensity:glow});}
function box(parent,name,x,y,z,w,h,d,color,glow=0){const mesh=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),mat(color,glow));mesh.position.set(x,y,z);mesh.name=`PROTOTYPE_ONLY_${name}`;mesh.castShadow=mesh.receiveShadow=true;parent.add(mesh);return mesh;}
export function operative(echo=false){
 const root=new THREE.Group();root.name='PROTOTYPE_ONLY_operative';
 const color=echo?C.violet:C.white;
 box(root,'torso',0,1.15,0,.52,.62,.34,color);
 box(root,'helmet',0,1.64,-.01,.36,.34,.36,color);
 box(root,'visor',0,1.66,-.2,.28,.11,.035,C.cyan,1.6);
 box(root,'chrono-pack',0,1.15,.25,.4,.48,.2,C.metal);
 box(root,'pack-core',0,1.15,.36,.12,.36,.035,C.violet,1.8);
 const limbs=[];
 for(const side of [-1,1]){const leg=box(root,'leg',side*.17,.43,0,.22,.76,.24,color);limbs.push(leg);box(root,'boot',side*.17,.08,-.06,.25,.16,.38,C.metal);const arm=box(root,'arm',side*.38,side===1?1.28:1.04,side===1?-.3:-.1,.2,.58,.22,color);if(side===1)arm.rotation.x=-Math.PI/2;}
 const gun=box(root,'pulse-carbine',.53,1.28,-.65,.2,.22,.86,C.metal);
 box(root,'carbine-energy',.64,1.32,-.65,.03,.07,.4,C.cyan,1.4);
 const muzzle=new THREE.Mesh(new THREE.OctahedronGeometry(.16),new THREE.MeshBasicMaterial({color:C.amber}));muzzle.name='PROTOTYPE_ONLY_muzzle';muzzle.position.set(.53,1.28,-1.1);muzzle.visible=false;root.add(muzzle);
 if(echo)root.traverse(n=>{if(n.material){n.material.transparent=true;n.material.opacity=.46;n.material.depthWrite=false;}});
 root.userData={limbs,gun,muzzle};return root;
}
function drone(parent,t){
 const root=new THREE.Group();root.name=`PROTOTYPE_ONLY_${t.id}`;root.position.set(t.x,t.y,t.z);parent.add(root);
 const body=new THREE.Mesh(new THREE.OctahedronGeometry(t.r*.6),mat(C.metal));body.name='PROTOTYPE_ONLY_drone-body';root.add(body);
 box(root,'drone-eye',0,0,.43,.24,.16,.08,C.red,2);
 for(const side of [-1,1]){box(root,'drone-wing',side*.65,0,0,.75,.13,.4,C.white);const ring=new THREE.Mesh(new THREE.TorusGeometry(.23,.05,6,20),mat(C.cyan,2));ring.name='PROTOTYPE_ONLY_rotor';ring.rotation.x=Math.PI/2;ring.position.x=side*.68;root.add(ring);}
 const shield=new THREE.Mesh(new THREE.IcosahedronGeometry(1.3,1),new THREE.MeshBasicMaterial({color:C.violet,wireframe:true,transparent:true,opacity:.4}));shield.name='PROTOTYPE_ONLY_shield';shield.visible=!!t.shield;root.add(shield);root.userData={shield};return root;
}
export class SectionManager {
 constructor(scene){this.scene=scene;this.current=null;this.loads=0;this.disposals=0;}
 load(id,targets=[]){
  if(!SECTIONS[id]?.available)throw new Error(`Section not available: ${id}`);
  this.unload();const config=SECTIONS[id],root=new THREE.Group();root.name=`PROTOTYPE_ONLY_${id}`;this.scene.add(root);
  const walls=[],emitters=[],drones=new Map();
  const width=id==='skybridge'?10:16;
  box(root,'deck',0,-.25,-2,width,.5,36,C.metal);
  for(let z=-18;z<15;z+=3){box(root,'deck-seam',0,.005,z,width,.015,.035,C.glass);for(const side of [-1,1])box(root,'guidance-strip',side*(width/2-.5),.035,z,.08,.04,1.8,C.cyan,1.8);}
  function wall(x,y,z,w,h,d,color=C.metal){box(root,'collision-wall',x,y,z,w,h,d,color);walls.push({min:{x:x-w/2,y:y-h/2,z:z-d/2},max:{x:x+w/2,y:y+h/2,z:z+d/2}});}
  for(const side of [-1,1]){
   if(id!=='skybridge')wall(side*(width/2+.25),2.7,-2,.5,5.4,36);
   else wall(side*5.1,.5,-2,.2,1,36);
   for(let z=-18;z<15;z+=6){box(root,'rib',side*(width/2-.08),2.1,z,.32,4.2,.45,C.glass);box(root,'light',side*(width/2-.27),2.1,z,.055,2.5,.14,side===1?C.cyan:C.amber,2);}
  }
  // Layered distant architecture provides a skyline and parallax beyond the walkable deck.
  for(let i=0;i<18;i++){
   const side=i%2?1:-1,x=side*(12+(i%4)*5),z=-38+(i*7)%66,h=12+(i%5)*7;
   box(root,'distant-tower',x,h/2-8,z,5,h,6,i%3?C.metal:C.glass);
   for(let row=0;row<4;row++)box(root,'tower-light',x, row*3-2,z+3.03,3,.07,.05,i%3?C.cyan:C.amber,1);
  }
  if(id==='command-bay'){
   box(root,'ceiling',0,5,-2,16,.3,32,C.metal);
   wall(-3.8,.7,1,2,1.4,2,C.glass);box(root,'console',-3.8,1.5,.8,1.8,.08,1,C.cyan,1);
   for(let z=-14;z<13;z+=6)box(root,'ceiling-rib',0,4.7,z,16,.18,.32,C.glass);
  } else {
   wall(-3.5,.6,-1,1.5,1.2,2);wall(3.4,.8,-10,1.5,1.6,2);
   box(root,'door-frame',0,2.6,-18,5,.5,.6,C.white);
   for(const side of [-1,1])box(root,'door-jamb',side*2.5,1.3,-18,.4,2.6,.6,C.white);
   const scanner=config.interaction[0];if(scanner){box(root,'phase-terminal',scanner.x,1,scanner.z,.65,2,.45,C.metal);box(root,'terminal-glow',scanner.x,1.5,scanner.z+.24,.48,.55,.025,C.amber,1.4);}
  }
  const hemi=new THREE.HemisphereLight(0x8ab6d0,0x111723,2.8);root.add(hemi);
  const key=new THREE.DirectionalLight(0xc3e8ff,3.5);key.position.set(4,10,5);key.castShadow=true;key.shadow.mapSize.set(1024,1024);Object.assign(key.shadow.camera,{left:-15,right:15,top:18,bottom:-18});root.add(key);
  for(const [x,z,color] of [[-4,3,C.amber],[4,-9,C.cyan],[0,-17,config.light]]){const lamp=new THREE.PointLight(color,28,18,2);lamp.position.set(x,3,z);root.add(lamp);emitters.push(lamp);}
  for(const t of targets)drones.set(t.id,drone(root,t));
  const hero=operative();root.add(hero);const echo=operative(true);echo.visible=false;root.add(echo);
  // Fixed-size pool: no new effect objects when firing.
  const effects=[];
  for(let i=0;i<16;i++){const tracer=new THREE.Mesh(new THREE.CylinderGeometry(.016,.016,1,4),new THREE.MeshBasicMaterial({color:C.cyan}));tracer.name='PROTOTYPE_ONLY_tracer';tracer.visible=false;root.add(tracer);const spark=new THREE.Mesh(new THREE.OctahedronGeometry(.13),new THREE.MeshBasicMaterial({color:C.amber}));spark.name='PROTOTYPE_ONLY_impact';spark.visible=false;root.add(spark);effects.push({tracer,spark,life:0});}
  this.current={id,root,config,walls,drones,hero,echo,effects,emitters,fx:0};this.loads++;return this.current;
 }
 unload(){if(!this.current)return;const root=this.current.root;this.scene.remove(root);const geometries=new Set(),materials=new Set();root.traverse(n=>{if(n.geometry)geometries.add(n.geometry);if(n.material)(Array.isArray(n.material)?n.material:[n.material]).forEach(m=>materials.add(m));if(n.isLight)n.dispose();});geometries.forEach(g=>g.dispose());materials.forEach(m=>m.dispose());root.clear();this.current=null;this.disposals++;}
}
export function cameraPosition(anchor,wanted,walls){let fraction=1;for(const wall of walls){const t=segmentBox(anchor,wanted,wall,.18);if(t!==null)fraction=Math.min(fraction,Math.max(0,t-.025));}return {x:anchor.x+(wanted.x-anchor.x)*fraction,y:Math.max(.4,anchor.y+(wanted.y-anchor.y)*fraction),z:anchor.z+(wanted.z-anchor.z)*fraction};}
