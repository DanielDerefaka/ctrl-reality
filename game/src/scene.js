import * as THREE from '../vendor/archive-three.js';
import {ASSET,bakeStatic} from './assetlib.js';
import {createMara,MaraAnimator} from '../assets/mara.js';
import {SOCKET,SOCKETS,FRAGMENTS,NODES,activeSocket} from './model.js';

// Every physical object is a selected 404 module. Images are distant scenery only.
export async function createArchive(canvas){
 performance.mark('archive-construct-start');
 const renderer=new THREE.WebGLRenderer({canvas,antialias:true,powerPreference:'high-performance'});
 renderer.setPixelRatio(Math.min(devicePixelRatio,innerWidth<700?1.35:1.6));renderer.setSize(innerWidth,innerHeight);
 renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=.95;
 renderer.info.autoReset=false;renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;
 const scene=new THREE.Scene();scene.background=new THREE.Color(0x252c31);scene.fog=new THREE.FogExp2(0x807969,.010);
 const camera=new THREE.PerspectiveCamera(52,innerWidth/innerHeight,.09,250);
 const textures=new THREE.TextureLoader(),mattePromise=textures.loadAsync('./media/environment/archive-matte.webp');
 const families=['recovery-platform','socket-pedestal','bridge-segment','kernel-assembly','foreground-frame','archive-mechanism','card-housing'];
 const maraPromise=createMara();
 const prototypes=Object.fromEntries(await Promise.all(families.map(async name=>{
  const moving=['socket-pedestal','kernel-assembly'].includes(name);
  const asset=await ASSET(`./assets/production/${name}.js`,{keepHierarchy:moving});
  asset.traverse(o=>{if(o.isMesh){o.material=o.material.clone();if(o.material.name==='stone'){o.material.color.set(0xb4ab97);o.material.roughness=.7;o.material.metalness=.08;}else if(o.material.name==='metal'){o.material.roughness=Math.max(.42,o.material.roughness);if(o.material.color.r>.25)o.material.color.set(0xa58a61);}}});
  if(!asset.children.length)throw new Error(`Missing production asset: ${name}`);
  return[name,asset];
 })));
 performance.mark('archive-assets-loaded');
 function place(name,x,y,z,scale=1,rotation=0,parent=scene){const object=prototypes[name].clone(true);object.position.set(x,y,z);object.scale.setScalar(scale);object.rotation.y=rotation;parent.add(object);return object;}
 scene.add(new THREE.HemisphereLight(0xd9d3c5,0x171f27,1.05));
 const key=new THREE.DirectionalLight(0xffd5a0,2.4);key.position.set(18,26,-20);key.target.position.set(0,0,-2);key.castShadow=true;key.shadow.mapSize.set(1024,1024);Object.assign(key.shadow.camera,{left:-12,right:12,top:15,bottom:-14,near:1,far:65});key.shadow.normalBias=.027;key.shadow.bias=-.00025;key.shadow.radius=4;scene.add(key,key.target);
 const fill=new THREE.DirectionalLight(0xd4dfe5,1.5);fill.intensity=1.55;fill.position.set(-7,9,10);scene.add(fill);
 const rim=new THREE.DirectionalLight(0xffedcf,1.5);rim.position.set(-10,12,-18);scene.add(rim);
 // Neutral reflected light keeps bronze warm without the greybox's blue/green cast.
 const studio=new THREE.Scene();studio.background=new THREE.Color(0x77766f);
 for(const [x,y,z,w,h,color]of [[-5,6,2,7,12,0xb9c5c9],[6,8,-6,5,16,0xffe6bb],[0,12,0,8,8,0xf2efe6]]){const p=new THREE.Mesh(new THREE.PlaneGeometry(w,h),new THREE.MeshBasicMaterial({color,side:THREE.DoubleSide}));p.position.set(x,y,z);p.lookAt(0,0,0);studio.add(p);}
 const pmrem=new THREE.PMREMGenerator(renderer);scene.environment=pmrem.fromScene(studio,.04,.1,100,{size:innerWidth<700?64:128}).texture;scene.environmentIntensity=.4;pmrem.dispose();studio.traverse(o=>{o.geometry?.dispose();o.material?.dispose();});
 performance.mark('archive-lighting-ready');
 const obstacles=[];
 // Two grounded, dark supports frame the crossing without giant white arcs.
 const near=place('foreground-frame',-7.8,-3.5,-2,1.0,-.2);obstacles.push(near);
 
 near.traverse(o=>{if(o.isMesh&&o.material.name==='stone')o.material.color.set(0x66655d);});
 const floorHeight=prototypes['recovery-platform'].userData.nativeSize.y;
 const floor=place('recovery-platform',0,-floorHeight,2);const farFloor=place('recovery-platform',0,-floorHeight,-10.3);farFloor.scale.set(.965,1,.46);
 const endFloor=place('recovery-platform',0,-floorHeight-.10,-15.8);endFloor.scale.set(.90,1,.54);
 // Selected corbel module repeated as a shallow transition at the far threshold.
 const stepDeck=place('bridge-segment',0,-.38,-12.85);stepDeck.scale.set(1.13,1,1.05);
 const floors=[floor,farFloor,endFloor];
 // Fine radial etching and slight roughness variation, generated locally, never mesh data.
 const fc=document.createElement('canvas');fc.width=fc.height=1024;const ctx=fc.getContext('2d');ctx.fillStyle='#9a9b97';ctx.fillRect(0,0,1024,1024);
 let seed=19;const random=()=>{seed=(1664525*seed+1013904223)>>>0;return seed/4294967296;};
 for(let i=0;i<18000;i++){ctx.fillStyle=`rgba(230,230,217,${random()*.12})`;ctx.fillRect(random()*1024,random()*1024,random()*16+1,.6);}
 ctx.strokeStyle='#414949';ctx.lineWidth=1.4;for(let i=0;i<=8;i++){ctx.beginPath();ctx.moveTo(i*128,0);ctx.lineTo(i*128,1024);ctx.stroke();ctx.beginPath();ctx.moveTo(0,i*128);ctx.lineTo(1024,i*128);ctx.stroke();}
 ctx.strokeStyle='#ad9e77';ctx.lineWidth=1;for(const r of [180,186,290,294,390,396]){ctx.beginPath();ctx.arc(512,512,r,0,Math.PI*2);ctx.stroke();}
 const floorTexture=new THREE.CanvasTexture(fc);floorTexture.colorSpace=THREE.SRGBColorSpace;floorTexture.anisotropy=8;
 for(const platform of floors)platform.traverse(o=>{if(o.isMesh){o.castShadow=false;o.receiveShadow=true;const color=o.material.color;if(color&&color.r<.2&&o.geometry.attributes.uv){o.geometry=o.geometry.clone();const a=o.geometry.attributes.position,uv=new Float32Array(a.count*2);for(let i=0;i<a.count;i++){uv[i*2]=a.getX(i)/8.6+.5;uv[i*2+1]=a.getZ(i)/10+.5;}o.geometry.setAttribute('uv',new THREE.BufferAttribute(uv,2));o.material=o.material.clone();o.material.map=floorTexture;o.material.color.set(0x293039);o.material.roughness=.68;o.material.metalness=.28;}}});
 const floating=[];
 for(const platform of floors)platform.traverse(o=>{if(o.isMesh){o.material=o.material.clone();if(o.material.name==='stone')o.material.color.set(0x44474a);else if(o.material.color.r>o.material.color.b*1.4)o.material.color.set(0x846e49);else {o.material.color.set(0x172027);o.material.metalness=.08;o.material.bumpMap=floorTexture;o.material.bumpScale=.005;}o.material.roughness=.78;o.material.envMapIntensity=0;}});
 const kernel=place('kernel-assembly',3,-3,-48,1.3,.1);kernel.traverse(o=>{o.castShadow=false;if(o.isMesh&&o.material.name==='stone'){o.material=o.material.clone();o.material.color.set(0x967f5c);o.material.metalness=.65;}if(o.isMesh&&o.material.name==='interface'){o.material=o.material.clone();o.material.color.set(0xcab28a);o.material.emissive.set(0xffd29b);o.material.emissiveIntensity=.6;}});
 const rigidGroups=[];kernel.traverse(o=>{if(o.isGroup)rigidGroups.push(o);});for(const group of rigidGroups){const meshes=group.children.filter(o=>o.isMesh);if(meshes.length<2)continue;const rigid=new THREE.Group();for(const mesh of meshes)rigid.add(mesh);group.add(bakeStatic(rigid));}
 const orbits=[];kernel.traverse(o=>{if(/^orbit\d/.test(o.name))orbits.push(o);});const orbitRest=orbits.map(o=>o.rotation.clone());
 const mechanism=place('archive-mechanism',-5,-2.4,-17,1.1,.3);mechanism.traverse(o=>{o.castShadow=false;});
 // Socket petals, inset glass and opposing mechanical latches remain real articulated geometry.
 const sockets=SOCKETS.map((p,i)=>place('socket-pedestal',p.x,0,p.z,i===0?1.3:1.15,.16));const socket=sockets[0];const socketGlass=[];sockets.forEach(object=>object.traverse(o=>{if(o.isMesh&&o.material.name==='interface'){o.material=o.material.clone();o.material.color.set(0x245461);o.material.emissive.set(0x2794a0);socketGlass.push(o.material);}}));
 const latches=sockets.flatMap(object=>['leftLatch','rightLatch'].map(n=>object.getObjectByName(n)));const latchRest=latches.map(o=>o.position.x);
 const cards=SOCKETS.map(p=>{const c=place('card-housing',p.x,.92,p.z+.075,.85,.16);c.rotation.x=-.39;c.visible=false;return c;});
 const handCard=place('card-housing',0,0,0,.7);handCard.visible=false;
 const socketLight=new THREE.PointLight(0x56e8f2,1.2,3,2);socketLight.position.set(SOCKET.x,.85,SOCKET.z+.2);scene.add(socketLight);
 const bridgeLights=[];for(const z of [-3.5,-5.5,-7.4]){const light=new THREE.PointLight(0x7adce5,0,3.2,2);light.position.set(0,.24,z);scene.add(light);bridgeLights.push(light);}
 const bridge=[];const bridgeTop=prototypes['bridge-segment'].userData.nativeSize.y;
 for(let i=0;i<10;i++){const segment=place('bridge-segment',0,-bridgeTop,-3.2-i*.51);segment.scale.z=.96;segment.visible=false;segment.traverse(o=>{if(o.isMesh&&o.material.name==='interface')o.material=o.material.clone();});bridge.push(segment);}
 // A light channel is a rendering effect following the floor, not collision geometry.
 const channelCurve=new THREE.CatmullRomCurve3([new THREE.Vector3(SOCKET.x,.024,SOCKET.z),new THREE.Vector3(1.8,.024,-2.4),new THREE.Vector3(0,.024,-2.4),new THREE.Vector3(0,.024,-3.1)]);
 const channelMat=new THREE.MeshStandardMaterial({color:0x56e8f2,emissive:0x56e8f2,emissiveIntensity:1.2,transparent:true,opacity:0});
 const channel=new THREE.Mesh(new THREE.TubeGeometry(channelCurve,40,.012,5,false),channelMat);scene.add(channel);
 // Non-colliding light surfaces reveal in the selected structural segments.
 const spineCurve=new THREE.LineCurve3(new THREE.Vector3(0,-.12,-3),new THREE.Vector3(0,-.12,-8));
 const spine=new THREE.Mesh(new THREE.TubeGeometry(spineCurve,48,.055,6,false),new THREE.MeshStandardMaterial({color:0xa48658,emissive:0x4fcbd2,emissiveIntensity:.7,roughness:.4,metalness:.65}));scene.add(spine);
 const glass=bridge.map((segment,i)=>{const plane=new THREE.Mesh(new THREE.PlaneGeometry(2.48,.40),new THREE.MeshStandardMaterial({color:0x70cad1,emissive:0x39a9ba,emissiveIntensity:.8,transparent:true,opacity:.24,roughness:.3,metalness:.3,depthWrite:false}));plane.rotation.x=-Math.PI/2;plane.position.set(0,.015,-3.2-i*.51);scene.add(plane);return plane;});
 const dustPositions=[];for(let i=0;i<40;i++)dustPositions.push((random()-.5)*2.8,.05+random()*.6,-3-random()*5);const dustGeometry=new THREE.BufferGeometry();dustGeometry.setAttribute('position',new THREE.Float32BufferAttribute(dustPositions,3));const bridgeDust=new THREE.Points(dustGeometry,new THREE.PointsMaterial({color:0xddc9a5,size:.025,transparent:true,opacity:.55,depthWrite:false}));scene.add(bridgeDust);
 const fragments=FRAGMENTS.map((f,i)=>{const object=place('card-housing',f.x,.22,f.z,.31,(i-1)*.6);return object;});
 const exitCrown=place('archive-mechanism',SOCKETS[2].x,1.0,SOCKETS[2].z,.30);exitCrown.traverse(o=>{o.castShadow=false;});
 const glyphs=[0,1,2].map(i=>{const g=place('card-housing',.8+i*.58,.08,-10.8,.35);g.rotation.x=-Math.PI/2;return g;});
 const inscription=[2,0,1].map((symbol,i)=>{const canvas=document.createElement('canvas');canvas.width=canvas.height=128;const c=canvas.getContext('2d');c.strokeStyle='#acdbe0';c.lineWidth=3;c.beginPath();if(symbol===0)c.arc(64,64,34,0,Math.PI*2);else{const n=symbol===1?3:4;for(let k=0;k<=n;k++){const a=k/n*Math.PI*2-Math.PI/2,x=64+Math.cos(a)*39,y=64+Math.sin(a)*39;k?c.lineTo(x,y):c.moveTo(x,y);}}c.stroke();const tex=new THREE.CanvasTexture(canvas);const mark=new THREE.Mesh(new THREE.PlaneGeometry(.42,.42),new THREE.MeshBasicMaterial({map:tex,transparent:true,opacity:.8,depthWrite:false}));mark.rotation.x=-Math.PI/2;mark.position.set(.8+i*.58,.19,-10.8);scene.add(mark);return mark;});
 const nodes=NODES.map(p=>{const n=place('card-housing',p.x,.15,p.z,.38);n.traverse(o=>{if(o.isMesh){o.material=o.material.clone();if(o.material.name==='interface'){o.material.color.set(0xf78e8c);o.material.emissive.set(0xcc5365);}}});return n;});
 const dangerEdge=new THREE.Mesh(new THREE.PlaneGeometry(.72,8.7),new THREE.MeshBasicMaterial({color:0xcc5365,transparent:true,opacity:.18,depthWrite:false}));dangerEdge.rotation.x=-Math.PI/2;dangerEdge.position.set(3.6,.03,-13.35);scene.add(dangerEdge);
 const mara=await maraPromise;scene.add(mara.root);const animator=new MaraAnimator(mara);
 const characterFill=new THREE.PointLight(0xc4d9e1,12,5,2);scene.add(characterFill);
 const gloveLight=new THREE.PointLight(0x56e8f2,.7,2.5,2);scene.add(gloveLight);
 // Contact shadow follows the feet and stays soft at the edge of the void.
 const shade=document.createElement('canvas');shade.width=shade.height=128;const sc=shade.getContext('2d'),sg=sc.createRadialGradient(64,64,5,64,64,64);sg.addColorStop(0,'rgba(0,0,0,.42)');sg.addColorStop(.35,'rgba(0,0,0,.20)');sg.addColorStop(1,'rgba(0,0,0,0)');sc.fillStyle=sg;sc.fillRect(0,0,128,128);
 const contact=new THREE.Mesh(new THREE.PlaneGeometry(.85,.6),new THREE.MeshBasicMaterial({map:new THREE.CanvasTexture(shade),transparent:true,depthWrite:false}));contact.rotation.x=-Math.PI/2;scene.add(contact);
 // Local, restrained bloom only at the glove, socket and Kernel.
 const glowCanvas=document.createElement('canvas');glowCanvas.width=glowCanvas.height=128;const gc=glowCanvas.getContext('2d'),gradient=gc.createRadialGradient(64,64,0,64,64,64);gradient.addColorStop(0,'rgba(255,255,255,.3)');gradient.addColorStop(.12,'rgba(255,255,255,.12)');gradient.addColorStop(1,'rgba(255,255,255,0)');gc.fillStyle=gradient;gc.fillRect(0,0,128,128);const glowMap=new THREE.CanvasTexture(glowCanvas);
 function bloom(color,size){const s=new THREE.Sprite(new THREE.SpriteMaterial({map:glowMap,color,transparent:true,depthWrite:false,blending:THREE.AdditiveBlending}));s.scale.setScalar(size);scene.add(s);return s;}
 const gloveBloom=bloom(0x56e8f2,.55),socketBloom=bloom(0x56e8f2,1);socketBloom.position.copy(socketLight.position);const kernelBloom=bloom(0xffd9a0,15);kernelBloom.position.set(3,5.5,-48);
 const points=[];for(let i=0;i<65;i++)points.push((random()-.5)*35,random()*18,10-random()*75);const moteGeo=new THREE.BufferGeometry();moteGeo.setAttribute('position',new THREE.Float32BufferAttribute(points,3));const motes=new THREE.Points(moteGeo,new THREE.PointsMaterial({color:0xe5ddd0,size:.019,transparent:true,opacity:.4,depthWrite:false}));scene.add(motes);
 const target=new THREE.Vector3(),desired=new THREE.Vector3(),look=new THREE.Vector3(),projected=new THREE.Vector3(),gloveWorld=new THREE.Vector3(),headWorld=new THREE.Vector3(),direction=new THREE.Vector3(),ray=new THREE.Raycaster();
 let currentSocket=SOCKET,lastBridge=0,completionPulse=0;let initialized=false,frameCount=0,frameStart=performance.now(),fps=0;const dimensions=new THREE.Box3(),corner=new THREE.Vector3();
 const gl=renderer.getContext(),debug=gl.getExtension('WEBGL_debug_renderer_info');const device=debug?gl.getParameter(debug.UNMASKED_RENDERER_WEBGL):gl.getParameter(gl.RENDERER);
 function update(state,dt,time,{screen='hud',reduced=false,yaw=0,pitch=0,review=null,dragging=false,validDrag=false}={}){
  characterFill.position.set(state.x+1.3,2.7,state.z+1.5);mara.root.position.set(state.x,state.y,state.z);let d=state.yaw-mara.root.rotation.y;d=Math.atan2(Math.sin(d),Math.cos(d));mara.root.rotation.y+=d*Math.min(1,dt*12);animator.update(dt,reduced,state);
  mara.root.updateMatrixWorld(true);mara.bones.gloveLight.getWorldPosition(gloveWorld);gloveLight.position.copy(gloveWorld);gloveBloom.position.copy(gloveWorld);gloveBloom.material.opacity=dragging?.9:.48;
  handCard.visible=dragging;handCard.position.copy(gloveWorld);handCard.position.y+=.14;handCard.rotation.set(-.3,mara.root.rotation.y,0);
  currentSocket=activeSocket(state);socketLight.position.set(currentSocket.x,1,currentSocket.z+.2);socketBloom.position.copy(socketLight.position);
  cards.forEach((c,i)=>{c.visible=state.installed&&state.installedSocket===i;});socketGlass.forEach(m=>{m.emissiveIntensity=validDrag?1.5:state.installed?.9:.35;});socketLight.intensity=validDrag?2:state.installed?1.4:.6;socketBloom.material.opacity=validDrag?.9:.35;
  latches.forEach((l,i)=>{l.position.x=latchRest[i]+(state.installed&&Math.floor(i/2)===state.installedSocket?(i%2===0?.032:-.032):0);});
  channel.geometry.setDrawRange(0,Math.floor(Math.min(1,state.bridge/.16)*channel.geometry.index.count));
  spine.visible=state.bridge>.08;spine.geometry.setDrawRange(0,Math.floor(Math.min(1,Math.max(0,state.bridge-.08)/.18)*spine.geometry.index.count));
  glass.forEach((g,i)=>{g.visible=state.bridge>(i+2)/12;g.material.opacity=.16+(!reduced?Math.sin(time*2-i)*.04:0);});
  bridgeDust.visible=state.bridge>0&&state.bridge<1;const dust=dustGeometry.attributes.position;for(let i=0;i<dust.count;i++)dust.setY(i,dustPositions[i*3+1]+Math.sin(state.bridge*Math.PI)*.5-state.bridge*.3);dust.needsUpdate=true;
  sockets.forEach((s,i)=>{const receptacle=s.getObjectByName('receptacle');if(receptacle)receptacle.rotation.z=i===state.installedSocket&&state.bridge>0&&state.bridge<1?Math.sin(state.bridge*Math.PI)*.06:0;});
  channelMat.opacity=state.bridge;channelMat.emissiveIntensity=1+Math.sin(time*3)*.25;
  if(state.bridge>=1&&lastBridge<1)completionPulse=.65;lastBridge=state.bridge;completionPulse=Math.max(0,completionPulse-dt);bridgeLights.forEach((light,i)=>{light.intensity=state.bridge>(i+1)*.27?.9+completionPulse*2:0;light.color.set(completionPulse>.1?0xffda9b:0x7adce5);});
  bridge.forEach((segment,i)=>{const f=THREE.MathUtils.clamp((state.bridge-.16)*13-i,0,1),e=1-(1-f)**3;segment.visible=f>0;segment.position.y=-bridgeTop-(1-e)*1.5;segment.rotation.z=(1-e)*(i%2?-.65:.65);segment.scale.x=.15+.85*e;});
  stepDeck.visible=state.readSolved;glyphs.forEach((g,i)=>{g.visible=state.stage===1&&state.installed&&state.brightness==='DIM';g.rotation.z=0;inscription[i].visible=g.visible;});
  dangerEdge.visible=state.stage>0&&state.brightness==='RADIANT'&&!state.won&&!state.restoration;dangerEdge.material.opacity=.12+(reduced?0:Math.sin(time*2)*.035);
  nodes.forEach((n,i)=>{n.visible=state.stage===2&&!state.cleared.includes(i)&&(state.brightness==='DIM'||state.nodesSeen);n.rotation.y=reduced?0:Math.sin(time*.8+i)*.15;n.position.y=.15+(!reduced?Math.sin(time+i)*.025:0);});
  const lighting=state.restoration||state.won?1+state.restoration*.45:1;key.intensity=2.4*lighting+(reduced?0:Math.sin(time*.12)*.08);kernelBloom.material.opacity=state.won?1:.38;exitCrown.rotation.y=reduced?0:time*.06+state.restoration*Math.PI;
  fragments.forEach((f,i)=>{f.visible=!state.fragments.includes(i);f.rotation.y=(i-1)*.6+(reduced?0:Math.sin(time*.35+i)*.12);});
  const motionTime=time-(state.failure>.2?(state.failure-.2)*2:0);
  if(!reduced){orbits.forEach((o,i)=>{o.rotation.z=orbitRest[i].z+time*(i%2?-.007:.009)+state.restoration*.5;});floating.forEach((f,i)=>{f.object.position.y=f.y+Math.sin(time*.13+i)*.10;});const pos=moteGeo.attributes.position;for(let i=0;i<pos.count;i++){pos.setY(i,points[i*3+1]+Math.sin(motionTime*.2+i)*.24);pos.setX(i,points[i*3]+Math.sin(motionTime*.13+i*.7)*.18);}pos.needsUpdate=true;}
  contact.position.set(state.x,.018,state.z);contact.visible=state.y>-.15;gloveLight.visible=state.y>-.8;
  const mobile=innerWidth<700;const fov=mobile?52:50;if(camera.fov!==fov){camera.fov=fov;camera.updateProjectionMatrix();}
  if(review){mara.root.position.set(0,0,6);mara.root.rotation.y=review==='front'?0:review==='side'?Math.PI/2:Math.PI*.83;desired.set(.25,1.3,9.6);target.set(0,.97,6);}
  else {const push=state.bridge>0&&state.bridge<1&&!state.bridgeLatched?Math.sin(state.bridge*Math.PI)*.3:0;const distance=(mobile?7.6:7.1)-push;desired.set(state.x+(mobile?1.05:3.0)+Math.sin(yaw)*2.8,2.05+pitch,state.z+distance);target.set(state.x+(mobile?.5:2.1),1.05,state.z-3.0);}
  // Shorten the boom against nearby architectural surfaces. Gameplay collision is unchanged.
  headWorld.set(state.x,1.45,state.z);direction.copy(desired).sub(headWorld);const length=direction.length();direction.normalize();ray.set(headWorld,direction);ray.far=length;const hit=ray.intersectObjects(obstacles,true).find(h=>h.distance>.8);if(hit)desired.copy(headWorld).addScaledVector(direction,Math.max(1,hit.distance-.3));desired.y=Math.max(1.3,desired.y);
  if(!initialized||reduced||review){camera.position.copy(desired);look.copy(target);initialized=true;}else{const a=1-Math.exp(-dt*5);camera.position.lerp(desired,a);look.lerp(target,a);}camera.lookAt(look);renderer.info.reset();renderer.render(scene,camera);
  frameCount++;const now=performance.now();if(now-frameStart>=1200){fps=frameCount*1000/(now-frameStart);frameStart=now;frameCount=0;}
 }
 performance.mark('archive-geometry-ready');
 const matte=await mattePromise;matte.colorSpace=THREE.SRGBColorSpace;matte.anisotropy=4;scene.background=matte;
 return{renderer,scene,camera,mara,animator,update,snapCamera(){initialized=false;},resize(){renderer.setPixelRatio(Math.min(devicePixelRatio,innerWidth<700?1.35:1.6));renderer.setSize(innerWidth,innerHeight);camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();},socketScreen(){projected.set(currentSocket.x,1.08,currentSocket.z+.08).project(camera);return{x:(projected.x*.5+.5)*innerWidth,y:(-.5*projected.y+.5)*innerHeight,visible:projected.z<1&&Math.abs(projected.x)<1&&Math.abs(projected.y)<1};},metrics(){dimensions.setFromObject(mara.root);let minY=Infinity,maxY=-Infinity;for(let i=0;i<8;i++){corner.set(i&1?dimensions.max.x:dimensions.min.x,i&2?dimensions.max.y:dimensions.min.y,i&4?dimensions.max.z:dimensions.min.z).project(camera);minY=Math.min(minY,corner.y);maxY=Math.max(maxY,corner.y);}return{drawCalls:renderer.info.render.calls,triangles:renderer.info.render.triangles,fps:Number(fps.toFixed(1)),renderer:device,maraFrameHeight:Number(((maxY-minY)*50).toFixed(1)),fov:camera.fov};}};
}
