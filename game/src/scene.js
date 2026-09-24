import * as THREE from '../vendor/three.module.js';
import {createMara,MaraAnimator} from '../assets/mara.js';
import {SOCKET,FRAGMENTS} from './model.js';
export function createArchive(canvas){
 const renderer=new THREE.WebGLRenderer({canvas,antialias:true,alpha:false,powerPreference:'high-performance'});renderer.setPixelRatio(Math.min(devicePixelRatio,1.6));renderer.setSize(innerWidth,innerHeight);renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.28;renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;
 const scene=new THREE.Scene();scene.background=new THREE.Color(0x070e18);scene.fog=new THREE.FogExp2(0x273746,.019);
 const camera=new THREE.PerspectiveCamera(46,innerWidth/innerHeight,.1,180);camera.position.set(5,4.5,13);
 const materials={obsidian:new THREE.MeshStandardMaterial({color:0x121f2b,metalness:.65,roughness:.25}),ivory:new THREE.MeshStandardMaterial({color:0xd1cabb,metalness:.18,roughness:.5}),bronze:new THREE.MeshStandardMaterial({color:0xcfa257,metalness:.62,roughness:.31}),black:new THREE.MeshStandardMaterial({color:0x080f18,metalness:.5,roughness:.5}),cyan:new THREE.MeshStandardMaterial({color:0x8cffff,emissive:0x38dfea,emissiveIntensity:2}),gold:new THREE.MeshStandardMaterial({color:0xffdab0,emissive:0xf6a654,emissiveIntensity:1.8}),violet:new THREE.MeshStandardMaterial({color:0x7061b9,emissive:0x5a34a8,emissiveIntensity:.7})};
 scene.add(new THREE.HemisphereLight(0x8ba7c1,0x332d24,2.4));const sun=new THREE.DirectionalLight(0xffdfb5,4.2);sun.position.set(-12,22,-16);sun.castShadow=true;sun.shadow.mapSize.set(1024,1024);Object.assign(sun.shadow.camera,{left:-18,right:18,top:18,bottom:-22,near:.1,far:80});sun.shadow.bias=-.001;scene.add(sun);scene.add(sun.target);const rim=new THREE.DirectionalLight(0x68d4ff,2);rim.position.set(8,5,12);scene.add(rim);
 // A local, procedural studio environment supplies restrained metallic reflections.
 const envScene=new THREE.Scene();envScene.background=new THREE.Color(0x27384b);for(const [x,y,z,col]of [[-3,4,-3,0xffe3b9],[4,1,2,0x6ba9c9],[0,7,0,0xffffff]]){const p=new THREE.Mesh(new THREE.PlaneGeometry(5,8),new THREE.MeshBasicMaterial({color:col,side:THREE.DoubleSide}));p.position.set(x,y,z);p.lookAt(0,0,0);envScene.add(p);}const pmrem=new THREE.PMREMGenerator(renderer);const env=pmrem.fromScene(envScene,.12);scene.environment=env.texture;pmrem.dispose();
 const floorCanvas=document.createElement('canvas');floorCanvas.width=floorCanvas.height=512;const fc=floorCanvas.getContext('2d');fc.fillStyle='#29313a';fc.fillRect(0,0,512,512);let seed=73;const rand=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};for(let i=0;i<14000;i++){const a=rand()*.035;fc.fillStyle=`rgba(210,219,222,${a})`;fc.fillRect(rand()*512,rand()*512,1+rand()*3,1);}fc.strokeStyle='#73756a';fc.lineWidth=1;fc.strokeRect(6,6,500,500);fc.strokeStyle='#4c5659';fc.strokeRect(12,12,488,488);for(let j=0;j<4;j++){fc.beginPath();fc.moveTo(0,j*128);fc.lineTo(512,j*128);fc.stroke();}fc.strokeStyle='#736a52';fc.lineWidth=.7;for(const radius of [60,65,111,116]){fc.beginPath();fc.arc(256,256,radius,0,Math.PI*2);fc.stroke();}for(let i=0;i<24;i++){const a=i*Math.PI/12;fc.beginPath();fc.moveTo(256+Math.cos(a)*65,256+Math.sin(a)*65);fc.lineTo(256+Math.cos(a)*110,256+Math.sin(a)*110);fc.stroke();}const floorMap=new THREE.CanvasTexture(floorCanvas);floorMap.colorSpace=THREE.SRGBColorSpace;floorMap.wrapS=floorMap.wrapT=THREE.RepeatWrapping;floorMap.repeat.set(3,4);floorMap.anisotropy=4;
 const floorMaterial=new THREE.MeshStandardMaterial({map:floorMap,color:0xc2c9c9,metalness:.58,roughness:.29});for(const [z,w,l]of [[2.5,10.65,12.6],[-15,9.45,9.6]]){const m=new THREE.Mesh(new THREE.PlaneGeometry(w,l),floorMaterial);m.rotation.x=-Math.PI/2;m.position.set(0,.032,z);m.receiveShadow=true;scene.add(m);}
 const batches=new Map();function staticMesh(geometry,material,x,y,z,sx=1,sy=1,sz=1,rx=0,ry=0,rz=0){const m=new THREE.Mesh(geometry,materials[material]);m.position.set(x,y,z);m.scale.set(sx,sy,sz);m.rotation.set(rx,ry,rz);m.updateMatrix();const g=geometry.clone();g.applyMatrix4(m.matrix);const list=batches.get(material)||[];list.push(g);batches.set(material,list);}
 const box=new THREE.BoxGeometry(1,1,1);const cylinder=new THREE.CylinderGeometry(1,1,1,8);const torus=new THREE.TorusGeometry(1,.022,6,80);
 const block=(mat,x,y,z,sx,sy,sz,ry=0)=>staticMesh(box,mat,x,y,z,sx,sy,sz,0,ry);
 for(const [z,len,width]of [[2.5,13,11],[-15,10,9.8]]){
  block('obsidian',0,-.28,z,width,.5,len);block('bronze',0,-.08,z,width+.04,.035,len+.04);
  block('black',0,-.02,z,width-.13,.09,len-.13);
  for(let x=-4;x<=4;x++)block('obsidian',x,0,z,.97,.025,len-.4);
  for(let zz=z-len/2+.7;zz<z+len/2;zz+=1.4)block('bronze',0,.012,zz,width-.4,.008,.012);
  for(const x of [-width/2+.18,width/2-.18])block('gold',x,.018,z,.018,.012,len-.4);
 }
 // Architectural bays: floating counterweights, ribbed columns, and pointed vaults.
 for(let bay=0;bay<7;bay++){
  const z=6-bay*9;
  for(const side of [-1,1]){
   const x=side*(7+bay*.13);const height=16+(bay%3)*3;
   block('obsidian',x,height/2-2,z,1.7,height,2.2);block('bronze',x,.6,z,2.1,.3,2.6);block('ivory',x,height*.55,z+1.08,1.20,height*.72,.20);block('ivory',x-side*.81,height*.55,z,.16,height*.72,1.4);
   for(let q=0;q<4;q++)block('bronze',x-.48+q*.32,height*.55,z+1.2,.025,height*.72,.02);
   for(const dx of [-.58,.58])block('bronze',x+dx,height*.5,z+.85,.048,height-.8,.05);
   for(let yy=2;yy<height;yy+=2.2){block('obsidian',x,yy,z,1.85,.22,2.3);block('bronze',x,yy+.13,z,1.92,.036,2.38);}
   const arch=new THREE.CatmullRomCurve3([new THREE.Vector3(x,10,z),new THREE.Vector3(x*.83,15,z),new THREE.Vector3(x*.38,19,z),new THREE.Vector3(0,21,z)]);
   staticMesh(new THREE.TubeGeometry(arch,20,.24,6,false),'ivory',0,0,0);staticMesh(new THREE.TubeGeometry(arch,20,.035,4,false),'bronze',0,0,.3);
   // Detached suspended façade shards create depth without blocking the playable path.
   block('obsidian',side*(11+(bay%2)*4),5+(bay*3)%12,z-4,2,6+bay,2.5,side*.11);block('ivory',side*(12+(bay%2)*4),9+(bay*3)%12,z-4,.7,4,1.3);
  }
 }
 for(let i=0;i<48;i++){const side=i%2?1:-1;const x=side*(9+(i*17%21)),y=-6+(i*13%28),z=-15-(i*7%65);block(i%3?'obsidian':'ivory',x,y,z,.6+(i%3),2+(i%7),1.4,Math.sin(i)*.13);if(i%4===0)block('gold',x,y+1,z+.8,.018,2.5,.025);}
 // Hanging concentric bronze rings frame the route and the distant Kernel.
 for(const [z,y,r]of [[-19,11,7],[-31,14,9],[-43,17,10]]){
  staticMesh(torus,'bronze',0,y,z,r,r,r,Math.PI/2-.22);staticMesh(torus,'gold',0,y-.14,z,r*.97,r*.97,r*.97,Math.PI/2-.22);
  for(let i=0;i<12;i++){const a=i*Math.PI/6;block('bronze',Math.cos(a)*r,y+3,z+Math.sin(a)*r,.03,6,.03);}
 }
 // Merge static authored geometry by material: no external meshes or literal mesh data.
 for(const [name,geos]of batches){const expanded=geos.map(g=>g.index?g.toNonIndexed():g);const merged=new THREE.BufferGeometry();for(const attr of ['position','normal','uv']){let size=expanded.reduce((n,g)=>n+g.attributes[attr].array.length,0);const data=new Float32Array(size);let off=0;for(const g of expanded){data.set(g.attributes[attr].array,off);off+=g.attributes[attr].array.length;}merged.setAttribute(attr,new THREE.BufferAttribute(data,attr==='uv'?2:3));}const m=new THREE.Mesh(merged,materials[name]);m.castShadow=name!=='gold';m.receiveShadow=true;scene.add(m);for(const g of geos)g.dispose();}
 // Restrained light bloom is an authored radial texture, not a postprocessing dependency.
 const glowCanvas=document.createElement('canvas');glowCanvas.width=glowCanvas.height=128;const gc=glowCanvas.getContext('2d'),gradient=gc.createRadialGradient(64,64,0,64,64,64);gradient.addColorStop(0,'rgba(255,244,211,.65)');gradient.addColorStop(.16,'rgba(255,201,128,.25)');gradient.addColorStop(.5,'rgba(210,174,133,.07)');gradient.addColorStop(1,'rgba(150,180,220,0)');gc.fillStyle=gradient;gc.fillRect(0,0,128,128);const glowMap=new THREE.CanvasTexture(glowCanvas);const glow=new THREE.Sprite(new THREE.SpriteMaterial({map:glowMap,transparent:true,depthWrite:false,blending:THREE.AdditiveBlending}));glow.position.set(0,10,-35);glow.scale.set(27,33,1);scene.add(glow);
 const rayMat=new THREE.MeshBasicMaterial({color:0xffd5a0,transparent:true,opacity:.025,depthWrite:false,side:THREE.DoubleSide,blending:THREE.AdditiveBlending});for(let i=0;i<4;i++){const ray=new THREE.Mesh(new THREE.PlaneGeometry(1.3+i*.55,28),rayMat);ray.position.set(-6+i*3,10,-8-i*8);ray.rotation.z=-.35;scene.add(ray);}
 const kernel=new THREE.Group();kernel.position.set(0,9,-34);scene.add(kernel);const sphere=new THREE.Mesh(new THREE.IcosahedronGeometry(.95,2),materials.gold);kernel.add(sphere);for(let i=0;i<3;i++){const ring=new THREE.Mesh(new THREE.TorusGeometry(3.2+i*.85,.055,6,70),materials.bronze);ring.rotation.set(Math.PI/3+i*.7,i*.8,0);kernel.add(ring);}const beam=new THREE.Mesh(new THREE.CylinderGeometry(.026,.026,29,8),materials.gold);beam.position.y=2;kernel.add(beam);
 const socket=new THREE.Group();socket.position.set(SOCKET.x,0,SOCKET.z);scene.add(socket);for(const [rad,h,y,mat]of [[.58,.13,.065,'bronze'],[.48,.11,.18,'obsidian'],[.36,.08,.27,'ivory']]){const m=new THREE.Mesh(new THREE.CylinderGeometry(rad,rad,h,32),materials[mat]);m.position.y=y;socket.add(m);}const socketRing=new THREE.Mesh(new THREE.TorusGeometry(.39,.019,6,40),materials.cyan);socketRing.rotation.x=-Math.PI/2;socketRing.position.y=.34;socket.add(socketRing);const installedCard=new THREE.Mesh(new THREE.BoxGeometry(.48,.68,.055),materials.cyan);installedCard.position.y=.73;installedCard.rotation.x=-.18;socket.add(installedCard);
 const bridge=[];for(let i=0;i<12;i++){const g=new THREE.Group();const tile=new THREE.Mesh(new THREE.BoxGeometry(2.8,.16,.46),materials.obsidian);g.add(tile);for(const x of [-1.38,1.38]){const line=new THREE.Mesh(new THREE.BoxGeometry(.025,.04,.5),materials.gold);line.position.set(x,.1,0);g.add(line);}const seam=new THREE.Mesh(new THREE.BoxGeometry(2.8,.018,.018),materials.cyan);seam.position.y=.085;g.add(seam);g.position.set(0,0,-4.25-i*.5);scene.add(g);bridge.push(g);}
 const fragments=FRAGMENTS.map(f=>{const m=new THREE.Mesh(new THREE.OctahedronGeometry(.16),materials.cyan);m.position.set(f.x,.65,f.z);scene.add(m);return m;});
 const exit=new THREE.Group();exit.position.set(0,0,-17);scene.add(exit);const base=new THREE.Mesh(new THREE.CylinderGeometry(.9,1,.22,8),materials.bronze);base.position.y=.11;exit.add(base);const monument=new THREE.Mesh(new THREE.OctahedronGeometry(.4),materials.ivory);monument.position.y=1.25;exit.add(monument);const halo=new THREE.Mesh(new THREE.TorusGeometry(.68,.025,6,48),materials.cyan);halo.position.y=1.25;exit.add(halo);
 const mara=createMara();scene.add(mara.root);const animator=new MaraAnimator(mara);const light=new THREE.PointLight(0x56e8f2,2.5,5,2);scene.add(light);
 const moteGeo=new THREE.BufferGeometry();const pts=[];for(let i=0;i<100;i++)pts.push(Math.sin(i*12.31)*18,(i*1.131)%19,8-(i*3.71)%65);moteGeo.setAttribute('position',new THREE.Float32BufferAttribute(pts,3));const motes=new THREE.Points(moteGeo,new THREE.PointsMaterial({color:0xc9dfe4,size:.032,transparent:true,opacity:.45}));scene.add(motes);
 const target=new THREE.Vector3(),desired=new THREE.Vector3(),look=new THREE.Vector3(),projected=new THREE.Vector3();let initialized=false;
 function update(state,dt,time,{screen='hud',reduced=false,yaw=0,pitch=0,review=null}={}){
  const title=screen==='title';mara.root.position.set(state.x,state.y,state.z);let d=state.yaw-mara.root.rotation.y;d=Math.atan2(Math.sin(d),Math.cos(d));mara.root.rotation.y+=d*Math.min(1,dt*12);
  animator.update(dt,reduced);installedCard.visible=state.installed;socketRing.rotation.z=time*.12;light.position.set(state.x-.35,1.1+state.y,state.z);
  bridge.forEach((g,i)=>{const f=Math.max(0,Math.min(1,(state.bridge-i/15)*3));g.visible=f>.01;g.position.y=(1-f)*-1.3;g.scale.set(1,Math.max(.01,f),1);});
  fragments.forEach((m,i)=>{m.visible=!state.fragments.includes(i);m.position.y=.68+(reduced?0:Math.sin(time*1.4+i)*.09);m.rotation.y=time*.45;});
  if(!reduced){kernel.rotation.y=time*.06;monument.rotation.y=time*.3;motes.rotation.y=Math.sin(time*.015)*.02;}halo.rotation.y=time*.15;
  const mobile=innerWidth<700;camera.fov=mobile?53:46;camera.updateProjectionMatrix();
  if(review){mara.root.position.set(0,0,6);mara.root.rotation.y=review==='front'?0:review==='side'?Math.PI/2:Math.PI*.83;desired.set(0,1.45,11.2);target.set(0,1.15,6);}
  else if(title){mara.root.position.set(1.7,0,3);mara.root.rotation.y=Math.PI+.22;desired.set(mobile?3.9:6,3.5,11.5);target.set(mobile?1: -1.2,2.7,-3);}
  else {desired.set(state.x+Math.sin(yaw)*9.3,4.3+pitch,state.z+9.3);target.set(state.x,.98,state.z-2.2);}
  if(!initialized||reduced||review){camera.position.copy(desired);look.copy(target);initialized=true;}else{const a=1-Math.exp(-dt*4.5);camera.position.lerp(desired,a);look.lerp(target,a);}camera.lookAt(look);renderer.render(scene,camera);
 }
 return {renderer,scene,camera,mara,animator,update,snapCamera(){initialized=false;},resize(){renderer.setSize(innerWidth,innerHeight);camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();},socketScreen(){projected.set(SOCKET.x,.8,SOCKET.z).project(camera);return{x:(projected.x*.5+.5)*innerWidth,y:(-.5*projected.y+.5)*innerHeight,visible:projected.z<1};},metrics(){return{drawCalls:renderer.info.render.calls,triangles:renderer.info.render.triangles};}};
}
