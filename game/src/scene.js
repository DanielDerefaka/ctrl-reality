import * as THREE from '../vendor/three.module.js';
import {Reflector} from '../vendor/Reflector.js';
import {ASSET,bakeStatic} from './assetlib.js';
import {createMara,MaraAnimator} from '../assets/mara.js';
import {SOCKET,FRAGMENTS} from './model.js';

// Every physical object is a selected 404 module. Images are distant scenery only.
export async function createArchive(canvas){
 const renderer=new THREE.WebGLRenderer({canvas,antialias:true,powerPreference:'high-performance'});
 renderer.setPixelRatio(Math.min(devicePixelRatio,innerWidth<700?1.35:1.6));renderer.setSize(innerWidth,innerHeight);
 renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.05;
 renderer.info.autoReset=false;renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;
 const scene=new THREE.Scene();scene.background=new THREE.Color(0x252c31);scene.fog=new THREE.FogExp2(0x8e8d82,.006);
 const camera=new THREE.PerspectiveCamera(52,innerWidth/innerHeight,.09,250);
 const families=['archive-arch','floor-ledge','socket-pedestal','bridge-segment','kernel-assembly','broken-fragment','bronze-trim','foreground-frame','archive-mechanism','card-housing'];
 const prototypes=Object.fromEntries(await Promise.all(families.map(async name=>{
  const moving=['socket-pedestal','kernel-assembly'].includes(name);
  const asset=await ASSET(`./assets/production/${name}.js`,{keepHierarchy:moving});
  if(!asset.children.length)throw new Error(`Missing production asset: ${name}`);
  return[name,asset];
 })));
 function place(name,x,y,z,scale=1,rotation=0,parent=scene){const object=prototypes[name].clone(true);object.position.set(x,y,z);object.scale.setScalar(scale);object.rotation.y=rotation;parent.add(object);return object;}
 const textures=new THREE.TextureLoader();const matte=await textures.loadAsync('./media/environment/archive-matte.webp');
 for(const texture of [matte]){texture.colorSpace=THREE.SRGBColorSpace;texture.anisotropy=4;}
 // The distant matte plane supplies parallax behind real arches; the background extends it beyond the guided view.
 const backdrop=new THREE.Mesh(new THREE.PlaneGeometry(250,140.625),new THREE.MeshBasicMaterial({map:matte,fog:false,toneMapped:false}));backdrop.position.set(4,8,-115);scene.add(backdrop);scene.background=matte;
 scene.add(new THREE.HemisphereLight(0xe7e4db,0x24272b,1.35));
 const key=new THREE.DirectionalLight(0xffe0af,3.3);key.position.set(18,26,-20);key.target.position.set(0,0,-2);key.castShadow=true;key.shadow.mapSize.set(1024,1024);Object.assign(key.shadow.camera,{left:-12,right:12,top:15,bottom:-14,near:1,far:65});key.shadow.normalBias=.027;key.shadow.bias=-.00025;key.shadow.radius=4;scene.add(key,key.target);
 const fill=new THREE.DirectionalLight(0xd4dfe5,1.5);fill.intensity=2.1;fill.position.set(-7,9,10);scene.add(fill);
 const rim=new THREE.DirectionalLight(0xffedcf,1.5);rim.position.set(-10,12,-18);scene.add(rim);
 // Neutral reflected light keeps bronze warm without the greybox's blue/green cast.
 const studio=new THREE.Scene();studio.background=new THREE.Color(0x77766f);
 for(const [x,y,z,w,h,color]of [[-5,6,2,7,12,0xb9c5c9],[6,8,-6,5,16,0xffe6bb],[0,12,0,8,8,0xf2efe6]]){const p=new THREE.Mesh(new THREE.PlaneGeometry(w,h),new THREE.MeshBasicMaterial({color,side:THREE.DoubleSide}));p.position.set(x,y,z);p.lookAt(0,0,0);studio.add(p);}
 const pmrem=new THREE.PMREMGenerator(renderer);scene.environment=pmrem.fromScene(studio,.04).texture;scene.environmentIntensity=.65;pmrem.dispose();studio.traverse(o=>{o.geometry?.dispose();o.material?.dispose();});
 const obstacles=[];
 // Three unequal architectural gestures, not a repeated corridor of columns.
 const near=place('foreground-frame',-6.3,-1,3,1.65,-.32);obstacles.push(near);
 const arch=place('archive-arch',15.8,-2,-13,1.7,-.52);obstacles.push(arch);
 const farArch=place('archive-arch',-24,-4,-35,2.5,.4);farArch.traverse(o=>{o.castShadow=false;});
 place('foreground-frame',10.6,-3,-36,2.5,-.15);
 const floorHeight=prototypes['floor-ledge'].userData.nativeSize.y;
 const floor=place('floor-ledge',0,-floorHeight,2.5);const farFloor=place('floor-ledge',0,-floorHeight,-15);farFloor.scale.set(.89,1,10/13);
 const floors=[floor,farFloor];
 const reflectionShader={...Reflector.ReflectorShader,fragmentShader:Reflector.ReflectorShader.fragmentShader.replace('vec4 base = texture2DProj( tDiffuse, vUv );',`vec2 uv=vUv.xy/vUv.w;vec4 base=texture2D(tDiffuse,uv)*.4;base+=texture2D(tDiffuse,uv+vec2(.0015,0.0))*.15;base+=texture2D(tDiffuse,uv-vec2(.0015,0.0))*.15;base+=texture2D(tDiffuse,uv+vec2(0.0,.0025))*.15;base+=texture2D(tDiffuse,uv-vec2(0.0,.0025))*.15;`).replace('color ), 1.0','color ), 0.31')};
 const reflection=new Reflector(new THREE.PlaneGeometry(10.82,12.78),{textureWidth:innerWidth<700?512:768,textureHeight:innerWidth<700?384:512,multisample:0,color:0x777c7c,clipBias:.005,shader:reflectionShader});reflection.rotation.x=-Math.PI/2;reflection.position.set(0,-.008,2.5);reflection.material.transparent=true;reflection.material.depthWrite=false;scene.add(reflection);
 const reflect=reflection.onBeforeRender;let reflectionFrame=0;reflection.onBeforeRender=function(...args){if(reflectionFrame++%(innerWidth<700?4:3)===0)reflect.apply(this,args);};

 // Fine radial etching and slight roughness variation, generated locally, never mesh data.
 const fc=document.createElement('canvas');fc.width=fc.height=1024;const ctx=fc.getContext('2d');ctx.fillStyle='#9a9b97';ctx.fillRect(0,0,1024,1024);
 let seed=19;const random=()=>{seed=(1664525*seed+1013904223)>>>0;return seed/4294967296;};
 for(let i=0;i<18000;i++){ctx.fillStyle=`rgba(230,230,217,${random()*.12})`;ctx.fillRect(random()*1024,random()*1024,random()*16+1,.6);}
 ctx.strokeStyle='#414949';ctx.lineWidth=1.4;for(let i=0;i<=8;i++){ctx.beginPath();ctx.moveTo(i*128,0);ctx.lineTo(i*128,1024);ctx.stroke();ctx.beginPath();ctx.moveTo(0,i*128);ctx.lineTo(1024,i*128);ctx.stroke();}
 ctx.strokeStyle='#ad9e77';ctx.lineWidth=1;for(const r of [180,186,290,294,390,396]){ctx.beginPath();ctx.arc(512,512,r,0,Math.PI*2);ctx.stroke();}
 const floorTexture=new THREE.CanvasTexture(fc);floorTexture.colorSpace=THREE.SRGBColorSpace;floorTexture.anisotropy=8;
 for(const platform of floors)platform.traverse(o=>{if(o.isMesh){o.castShadow=false;o.receiveShadow=true;const color=o.material.color;if(color&&color.r<.1&&o.geometry.attributes.uv){o.geometry=o.geometry.clone();const a=o.geometry.attributes.position,uv=new Float32Array(a.count*2);for(let i=0;i<a.count;i++){uv[i*2]=a.getX(i)/11+.5;uv[i*2+1]=a.getZ(i)/13+.5;}o.geometry.setAttribute('uv',new THREE.BufferAttribute(uv,2));o.material=o.material.clone();o.material.map=floorTexture;o.material.color.set(0x293039);o.material.roughness=.28;o.material.metalness=.6;}}});
 for(const [x,y,z,s,r]of [[-12,7,-16,2,.8],[12,15,-26,1.6,-.6],[-18,17,-45,2.4,.3],[19,4,-44,3,-1],[8,-8,-13,1.1,.7],[-9,-6,-9,1.2,-.4],[-4,24,-60,2.9,.4]]){const f=place('broken-fragment',x,y,z,s,r);f.rotation.z=(random()-.5)*.3;f.traverse(o=>{o.castShadow=false;});}
 for(const [x,z,r]of [[-5.3,2.5,0],[5.3,2.5,0],[-4.7,-15,0],[4.7,-15,0]]){const trim=place('bronze-trim',x,.012,z,1,r);trim.scale.z=3;trim.scale.x=.5;trim.scale.y=.3;trim.traverse(o=>{o.castShadow=false;});}
 const kernel=place('kernel-assembly',4,-4,-55,1.65,.1);kernel.traverse(o=>{o.castShadow=false;if(o.isMesh&&o.material.name==='interface'){o.material=o.material.clone();o.material.color.set(0xfff1d6);o.material.emissive.set(0xffd29b);o.material.emissiveIntensity=1.4;}});
 const rigidGroups=[];kernel.traverse(o=>{if(o.isGroup)rigidGroups.push(o);});for(const group of rigidGroups){const meshes=group.children.filter(o=>o.isMesh);if(meshes.length<2)continue;const rigid=new THREE.Group();for(const mesh of meshes)rigid.add(mesh);group.add(bakeStatic(rigid));}
 const orbits=[];kernel.traverse(o=>{if(/^orbit\d/.test(o.name))orbits.push(o);});const orbitRest=orbits.map(o=>o.rotation.clone());
 const mechanism=place('archive-mechanism',-6,-3,-18,2.6,.3);mechanism.traverse(o=>{o.castShadow=false;});
 // Socket petals, inset glass and opposing mechanical latches remain real articulated geometry.
 const socket=place('socket-pedestal',SOCKET.x,0,SOCKET.z,1.1,.16);const socketGlass=[];socket.traverse(o=>{if(o.isMesh&&o.material.name==='interface'){o.material=o.material.clone();socketGlass.push(o.material);}});
 const latches=['leftLatch','rightLatch'].map(n=>socket.getObjectByName(n));const latchRest=latches.map(o=>o.position.x);
 const card=place('card-housing',SOCKET.x,.73,SOCKET.z+.075,.8,.16);card.rotation.x=-.39;card.visible=false;
 const handCard=place('card-housing',0,0,0,.7);handCard.visible=false;
 const socketLight=new THREE.PointLight(0x56e8f2,1.2,3,2);socketLight.position.set(SOCKET.x,.85,SOCKET.z+.2);scene.add(socketLight);
 const bridgeLights=[];for(const z of [-4.7,-7,-9.4]){const light=new THREE.PointLight(0x7adce5,0,3.2,2);light.position.set(0,.24,z);scene.add(light);bridgeLights.push(light);}
 const bridge=[];const bridgeTop=prototypes['bridge-segment'].userData.nativeSize.y;
 for(let i=0;i<12;i++){const segment=place('bridge-segment',0,-bridgeTop,-4.25-i*.5);segment.scale.z=.9;segment.visible=false;segment.traverse(o=>{if(o.isMesh&&o.material.name==='interface')o.material=o.material.clone();});bridge.push(segment);}
 // A light channel is a rendering effect following the floor, not collision geometry.
 const channelCurve=new THREE.CatmullRomCurve3([new THREE.Vector3(SOCKET.x,.024,SOCKET.z),new THREE.Vector3(-2,.024,-3.1),new THREE.Vector3(0,.024,-3.5),new THREE.Vector3(0,.024,-4.2)]);
 const channelMat=new THREE.MeshStandardMaterial({color:0x56e8f2,emissive:0x56e8f2,emissiveIntensity:1.2,transparent:true,opacity:0});
 const channel=new THREE.Mesh(new THREE.TubeGeometry(channelCurve,40,.012,5,false),channelMat);scene.add(channel);
 const fragments=FRAGMENTS.map((f,i)=>{const object=place('card-housing',f.x,.22,f.z,.31,(i-1)*.6);return object;});
 const exit=place('socket-pedestal',0,0,-17,1.2);const exitCrown=place('archive-mechanism',0,.9,-17,.24);exitCrown.traverse(o=>{o.castShadow=false;});
 const mara=await createMara();scene.add(mara.root);const animator=new MaraAnimator(mara);
 const gloveLight=new THREE.PointLight(0x56e8f2,.7,2.5,2);scene.add(gloveLight);
 // Contact shadow follows the feet and stays soft at the edge of the void.
 const shade=document.createElement('canvas');shade.width=shade.height=128;const sc=shade.getContext('2d'),sg=sc.createRadialGradient(64,64,5,64,64,64);sg.addColorStop(0,'rgba(0,0,0,.42)');sg.addColorStop(.35,'rgba(0,0,0,.20)');sg.addColorStop(1,'rgba(0,0,0,0)');sc.fillStyle=sg;sc.fillRect(0,0,128,128);
 const contact=new THREE.Mesh(new THREE.PlaneGeometry(.85,.6),new THREE.MeshBasicMaterial({map:new THREE.CanvasTexture(shade),transparent:true,depthWrite:false}));contact.rotation.x=-Math.PI/2;scene.add(contact);
 // Local, restrained bloom only at the glove, socket and Kernel.
 const glowCanvas=document.createElement('canvas');glowCanvas.width=glowCanvas.height=128;const gc=glowCanvas.getContext('2d'),gradient=gc.createRadialGradient(64,64,0,64,64,64);gradient.addColorStop(0,'rgba(255,255,255,.3)');gradient.addColorStop(.12,'rgba(255,255,255,.12)');gradient.addColorStop(1,'rgba(255,255,255,0)');gc.fillStyle=gradient;gc.fillRect(0,0,128,128);const glowMap=new THREE.CanvasTexture(glowCanvas);
 function bloom(color,size){const s=new THREE.Sprite(new THREE.SpriteMaterial({map:glowMap,color,transparent:true,depthWrite:false,blending:THREE.AdditiveBlending}));s.scale.setScalar(size);scene.add(s);return s;}
 const gloveBloom=bloom(0x56e8f2,.55),socketBloom=bloom(0x56e8f2,1);socketBloom.position.copy(socketLight.position);const kernelBloom=bloom(0xffd9a0,25);kernelBloom.position.set(4,5.5,-55);
 const points=[];for(let i=0;i<65;i++)points.push((random()-.5)*35,random()*18,10-random()*75);const moteGeo=new THREE.BufferGeometry();moteGeo.setAttribute('position',new THREE.Float32BufferAttribute(points,3));const motes=new THREE.Points(moteGeo,new THREE.PointsMaterial({color:0xe5ddd0,size:.019,transparent:true,opacity:.4,depthWrite:false}));scene.add(motes);
 const target=new THREE.Vector3(),desired=new THREE.Vector3(),look=new THREE.Vector3(),projected=new THREE.Vector3(),gloveWorld=new THREE.Vector3(),headWorld=new THREE.Vector3(),direction=new THREE.Vector3(),ray=new THREE.Raycaster();
 let lastBridge=0,completionPulse=0;let initialized=false,frameCount=0,frameStart=performance.now(),fps=0;const dimensions=new THREE.Box3(),corner=new THREE.Vector3();
 const gl=renderer.getContext(),debug=gl.getExtension('WEBGL_debug_renderer_info');const device=debug?gl.getParameter(debug.UNMASKED_RENDERER_WEBGL):gl.getParameter(gl.RENDERER);
 function update(state,dt,time,{screen='hud',reduced=false,yaw=0,pitch=0,review=null,dragging=false,validDrag=false}={}){
  mara.root.position.set(state.x,state.y,state.z);let d=state.yaw-mara.root.rotation.y;d=Math.atan2(Math.sin(d),Math.cos(d));mara.root.rotation.y+=d*Math.min(1,dt*12);animator.update(dt,reduced);
  mara.root.updateMatrixWorld(true);mara.bones.gloveLight.getWorldPosition(gloveWorld);gloveLight.position.copy(gloveWorld);gloveBloom.position.copy(gloveWorld);gloveBloom.material.opacity=dragging?.9:.48;
  handCard.visible=dragging;handCard.position.copy(gloveWorld);handCard.position.y+=.14;handCard.rotation.set(-.3,mara.root.rotation.y,0);
  card.visible=state.installed;socketGlass.forEach(m=>{m.emissiveIntensity=validDrag?2:state.installed?1.1:.35;});socketLight.intensity=validDrag?2:state.installed?1.3:.6;socketBloom.material.opacity=validDrag?.9:.35;
  latches.forEach((l,i)=>{l.position.x=latchRest[i]+(state.installed?(i===0?.032:-.032):0);});channelMat.opacity=state.bridge;
  if(state.bridge>=1&&lastBridge<1)completionPulse=.65;lastBridge=state.bridge;completionPulse=Math.max(0,completionPulse-dt);bridgeLights.forEach((light,i)=>{light.intensity=state.bridge>(i+1)*.27?.55+completionPulse*2:0;});
  bridge.forEach((segment,i)=>{const f=THREE.MathUtils.clamp(state.bridge*12-i,0,1),e=1-(1-f)**3;segment.visible=f>0;segment.position.y=-bridgeTop-(1-e)*1.5;segment.rotation.z=(1-e)*(i%2?-.12:.12);});
  fragments.forEach((f,i)=>{f.visible=!state.fragments.includes(i);f.rotation.y=(i-1)*.6+(reduced?0:Math.sin(time*.35+i)*.12);});
  if(!reduced)orbits.forEach((o,i)=>{o.rotation.z=orbitRest[i].z+time*(i%2?-.007:.009);});
  contact.position.set(state.x,.018,state.z);contact.visible=state.y>-.15;gloveLight.visible=state.y>-.8;
  const mobile=innerWidth<700;const fov=mobile?54:52;if(camera.fov!==fov){camera.fov=fov;camera.updateProjectionMatrix();}
  if(review){mara.root.position.set(0,0,6);mara.root.rotation.y=review==='front'?0:review==='side'?Math.PI/2:Math.PI*.83;desired.set(.25,1.3,9.6);target.set(0,.97,6);}
  else {const distance=mobile?8.4:8.2;desired.set(state.x+(mobile?1.1:3.3)+Math.sin(yaw)*3.5,2.4+pitch,state.z+distance);target.set(state.x+(mobile?.25:1.95),1.05,state.z-3.3);}
  // Shorten the boom against nearby architectural surfaces. Gameplay collision is unchanged.
  headWorld.set(state.x,1.45,state.z);direction.copy(desired).sub(headWorld);const length=direction.length();direction.normalize();ray.set(headWorld,direction);ray.far=length;const hit=ray.intersectObjects(obstacles,true).find(h=>h.distance>.8);if(hit)desired.copy(headWorld).addScaledVector(direction,Math.max(1,hit.distance-.3));desired.y=Math.max(1.3,desired.y);
  if(!initialized||reduced||review){camera.position.copy(desired);look.copy(target);initialized=true;}else{const a=1-Math.exp(-dt*5);camera.position.lerp(desired,a);look.lerp(target,a);}camera.lookAt(look);renderer.info.reset();renderer.render(scene,camera);
  frameCount++;const now=performance.now();if(now-frameStart>=1200){fps=frameCount*1000/(now-frameStart);frameStart=now;frameCount=0;}
 }
 return{renderer,scene,camera,mara,animator,update,snapCamera(){initialized=false;},resize(){renderer.setPixelRatio(Math.min(devicePixelRatio,innerWidth<700?1.35:1.6));renderer.setSize(innerWidth,innerHeight);camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();},socketScreen(){projected.set(SOCKET.x,1.02,SOCKET.z+.08).project(camera);return{x:(projected.x*.5+.5)*innerWidth,y:(-.5*projected.y+.5)*innerHeight,visible:projected.z<1&&Math.abs(projected.x)<1&&Math.abs(projected.y)<1};},metrics(){dimensions.setFromObject(mara.root);let minY=Infinity,maxY=-Infinity;for(let i=0;i<8;i++){corner.set(i&1?dimensions.max.x:dimensions.min.x,i&2?dimensions.max.y:dimensions.min.y,i&4?dimensions.max.z:dimensions.min.z).project(camera);minY=Math.min(minY,corner.y);maxY=Math.max(maxY,corner.y);}return{drawCalls:renderer.info.render.calls,triangles:renderer.info.render.triangles,fps:Number(fps.toFixed(1)),renderer:device,maraFrameHeight:Number(((maxY-minY)*50).toFixed(1)),fov:camera.fov};}};
}
