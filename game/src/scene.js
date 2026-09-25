import * as THREE from '../vendor/archive-three.js';
import {ASSET,bakeStatic} from './assetlib.js';
import {createMara,MaraAnimator} from '../assets/mara.js';
import {SOCKET,SOCKETS,FRAGMENTS,NODES,GLYPHS,GLYPH_SEQUENCE,activeSocket,floorY,SLABS,WELL,CORE,LOCKS,anchorAt,anchorsFrozen,here} from './model.js';

// Every physical object is a selected 404 module. Images are distant scenery only.
export async function createArchive(canvas){
 performance.mark('archive-construct-start');
 const renderer=new THREE.WebGLRenderer({canvas,antialias:true,powerPreference:'high-performance'});
 renderer.setPixelRatio(Math.min(devicePixelRatio,innerWidth<700?1.35:1.6));renderer.setSize(innerWidth,innerHeight);
 renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=.95;
 renderer.info.autoReset=false;renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;
 const scene=new THREE.Scene();scene.background=new THREE.Color(0x252c31);scene.fog=new THREE.FogExp2(0x807969,.010);
 // The installed light level drives the whole room: exposure, fog, key light and backdrop.
 const FOG_DIM=new THREE.Color(0x1a2632),FOG_BALANCED=new THREE.Color(0x807969),FOG_RADIANT=new THREE.Color(0xb8a98a),FOG_LOW=new THREE.Color(0x6b5a9a),FOG_HEAVY=new THREE.Color(0x4a2a24);
 // In the Atrium any installed socket lights the room; in the Well only the socket of the current stage does.
 const lightTarget=state=>{const lit=state.stage<3?state.installed:here(state,'brightness');return state.won||state.restoration?1.6:!lit?.55:state.brightness==='DIM'?.14:state.brightness==='RADIANT'?1.5:1;};
 let lux=.55,flash=0;let seed=19;const random=()=>{seed=(1664525*seed+1013904223)>>>0;return seed/4294967296;};
 const camera=new THREE.PerspectiveCamera(52,innerWidth/innerHeight,.09,250);
 // The backdrop is a real dome, not a painting: a gradient sky that turns from Atrium dusk to Well violet as Mara descends.
 const skyCanvas=document.createElement('canvas');skyCanvas.width=4;skyCanvas.height=256;const skyCtx=skyCanvas.getContext('2d');const skyTex=new THREE.CanvasTexture(skyCanvas);skyTex.colorSpace=THREE.SRGBColorSpace;
 const SKY_ATRIUM=['#1b2634','#3d4c5c','#c9946a','#f0c896','#5a4a3c','#0d1117'],SKY_WELL=['#07061a','#1d1640','#5a3d8a','#b98cff','#2a1a44','#05030c'];const skyMix=new Array(6).fill(null).map(()=>new THREE.Color());
 function paintSky(t){const g=skyCtx.createLinearGradient(0,0,0,256);const stops=[0,.28,.5,.56,.66,1];for(let i=0;i<6;i++){skyMix[i].set(SKY_ATRIUM[i]).lerp(new THREE.Color(SKY_WELL[i]),t);g.addColorStop(stops[i],'#'+skyMix[i].getHexString());}skyCtx.fillStyle=g;skyCtx.fillRect(0,0,4,256);skyTex.needsUpdate=true;}
 paintSky(0);const sky=new THREE.Mesh(new THREE.SphereGeometry(190,24,16),new THREE.MeshBasicMaterial({map:skyTex,side:THREE.BackSide,fog:false,depthWrite:false}));sky.renderOrder=-10;scene.add(sky);let skyBlend=0;
 const families=['recovery-platform','socket-pedestal','bridge-segment','kernel-assembly','foreground-frame','archive-mechanism','card-housing','archive-arch','floor-ledge','bronze-trim','broken-fragment'];
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
 const hemi=new THREE.HemisphereLight(0xd9d3c5,0x171f27,1.05);scene.add(hemi);
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
 // Sector 02, the Gravity Well, sits 1.2 lower: a landing, the anchor deck and the core deck, all the same platform module.
 const WELL_Y=floorY(-30);const landing=place('recovery-platform',0,WELL_Y-floorHeight,-22.9);landing.scale.set(.74,1,.51);
 const anchorDeck=place('recovery-platform',0,WELL_Y-floorHeight,WELL.z);anchorDeck.scale.set(.78,1,.585);
 const coreDeck=place('recovery-platform',0,WELL_Y-floorHeight,CORE.z);coreDeck.scale.set(.78,1,.49);
 const floors=[floor,farFloor,endFloor,landing,anchorDeck,coreDeck];
 // ATRIUM HALL: two colonnades of the selected pointed arch flank the crossing, a taller rank stands behind them,
 // and a rank across the far end closes the hall behind the Kernel. Every piece is a verified 404 module clone.
 const archHeight=prototypes['archive-arch'].userData.nativeSize.y;
 const hall=new THREE.Group();scene.add(hall);
 function arch(x,y,z,scale,rotation,tone){const a=place('archive-arch',x,y,z,scale,rotation,hall);a.traverse(o=>{if(o.isMesh){o.castShadow=false;o.material=o.material.clone();if(o.material.name==='stone'){o.material.color.set(tone);o.material.roughness=.72;}else if(o.material.name==='metal'&&o.material.color.r>.25)o.material.color.set(0xb8934f);}});return a;}
 for(let i=0;i<6;i++){const z=6.5-i*4.4;for(const sign of [-1,1])arch(sign*7.6,-.9,z,.62,Math.PI/2,i<3?0xd8ccb6:0x9fb3b4);}
 for(let i=-1;i<=1;i++)arch(i*9+3.5,-3.2,-62,1.3,0,0x6c5a48);
 // Atrium balustrade: the bronze trim module runs along both long edges of the entry platform.
 const trimSize=prototypes['bronze-trim'].userData.nativeSize;for(const sign of [-1,1])for(let i=0;i<4;i++){const t=place('bronze-trim',sign*4.05,0,4.6-i*2.2,Math.min(1,2.1/trimSize.x),Math.PI/2,hall);t.traverse(o=>{o.castShadow=false;});}
 const ledgeSize=prototypes['floor-ledge'].userData.nativeSize;for(const [x,z,r] of [[-4.6,2,0],[4.6,2,Math.PI],[-4.2,-10.3,0],[4.2,-10.3,Math.PI]]){const l=place('floor-ledge',x,-.02,z,Math.min(1,3.6/ledgeSize.x),r,hall);l.traverse(o=>{o.castShadow=false;});}
 // Skylight shafts: tall additive planes that read as light falling through the hall, cheap and always facing the camera.
 const shaftCanvas=document.createElement('canvas');shaftCanvas.width=64;shaftCanvas.height=256;{const c=shaftCanvas.getContext('2d');const g=c.createLinearGradient(0,0,0,256);g.addColorStop(0,'rgba(255,240,210,.55)');g.addColorStop(.7,'rgba(255,225,180,.18)');g.addColorStop(1,'rgba(255,220,170,0)');c.fillStyle=g;c.fillRect(0,0,64,256);const h=c.createLinearGradient(0,0,64,0);h.addColorStop(0,'rgba(0,0,0,1)');h.addColorStop(.5,'rgba(0,0,0,0)');h.addColorStop(1,'rgba(0,0,0,1)');c.globalCompositeOperation='destination-out';c.fillStyle=h;c.fillRect(0,0,64,256);}
 const shaftTex=new THREE.CanvasTexture(shaftCanvas);const shafts=[[-5,-4],[4.5,-8],[-3,-16],[6,-20]].map(([x,z],i)=>{const s=new THREE.Mesh(new THREE.PlaneGeometry(2.2+i*.4,16),new THREE.MeshBasicMaterial({map:shaftTex,transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,color:0xffe2b0,opacity:.5,fog:false}));s.position.set(x,7,z);s.rotation.y=.4;scene.add(s);return s;});
 // The abyss under the decks glows faintly so the drop reads as depth rather than a black hole.
 const abyssCanvas=document.createElement('canvas');abyssCanvas.width=abyssCanvas.height=256;{const c=abyssCanvas.getContext('2d');const g=c.createRadialGradient(128,128,10,128,128,128);g.addColorStop(0,'rgba(255,200,140,.55)');g.addColorStop(.5,'rgba(120,90,70,.25)');g.addColorStop(1,'rgba(20,20,30,0)');c.fillStyle=g;c.fillRect(0,0,256,256);}
 const abyss=new THREE.Mesh(new THREE.PlaneGeometry(90,110),new THREE.MeshBasicMaterial({map:new THREE.CanvasTexture(abyssCanvas),transparent:true,depthWrite:false,fog:false}));abyss.rotation.x=-Math.PI/2;abyss.position.set(0,-16,-22);scene.add(abyss);
 // GRAVITY WELL: a shaft of ten arches ringed around the sunken decks, and cut stone drifting in the dark.
 const wellRing=new THREE.Group();scene.add(wellRing);const WELL_C={x:0,z:-31.5};
 for(let i=0;i<6;i++){const a=i/6*Math.PI*2,r=12.5;arch(WELL_C.x+Math.sin(a)*r,WELL_Y-4.5,WELL_C.z+Math.cos(a)*r,1.05,a+Math.PI,0x4a3a66);}
 const debris=[];for(let i=0;i<8;i++){const a=i/8*Math.PI*2,r=6.5+random()*5,y=WELL_Y+random()*5-1;const d=place('broken-fragment',WELL_C.x+Math.sin(a)*r,y,WELL_C.z+Math.cos(a)*r,.4+random()*.5,random()*6,wellRing);d.rotation.x=random()*1.5;d.traverse(o=>{o.castShadow=false;if(o.isMesh){o.material=o.material.clone();if(o.material.name==='stone')o.material.color.set(0x8a7ea4);}});debris.push({object:d,a,r,y,spin:(random()-.5)*.4});}
 const wellShafts=[[-6,-28],[5,-36],[-4,-42]].map(([x,z])=>{const s=new THREE.Mesh(new THREE.PlaneGeometry(3,18),new THREE.MeshBasicMaterial({map:shaftTex,transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,color:0xb98cff,opacity:.45,fog:false}));s.position.set(x,WELL_Y+6,z);s.rotation.y=-.5;scene.add(s);return s;});
 // Fine radial etching and slight roughness variation, generated locally, never mesh data.
 const fc=document.createElement('canvas');fc.width=fc.height=1024;const ctx=fc.getContext('2d');ctx.fillStyle='#9a9b97';ctx.fillRect(0,0,1024,1024);
 for(let i=0;i<18000;i++){ctx.fillStyle=`rgba(230,230,217,${random()*.12})`;ctx.fillRect(random()*1024,random()*1024,random()*16+1,.6);}
 ctx.strokeStyle='#414949';ctx.lineWidth=1.4;for(let i=0;i<=8;i++){ctx.beginPath();ctx.moveTo(i*128,0);ctx.lineTo(i*128,1024);ctx.stroke();ctx.beginPath();ctx.moveTo(0,i*128);ctx.lineTo(1024,i*128);ctx.stroke();}
 ctx.strokeStyle='#ad9e77';ctx.lineWidth=1;for(const r of [180,186,290,294,390,396]){ctx.beginPath();ctx.arc(512,512,r,0,Math.PI*2);ctx.stroke();}
 const floorTexture=new THREE.CanvasTexture(fc);floorTexture.colorSpace=THREE.SRGBColorSpace;floorTexture.anisotropy=8;
 for(const platform of floors)platform.traverse(o=>{if(o.isMesh){o.castShadow=false;o.receiveShadow=true;const color=o.material.color;if(color&&color.r<.2&&o.geometry.attributes.uv){o.geometry=o.geometry.clone();const a=o.geometry.attributes.position,uv=new Float32Array(a.count*2);for(let i=0;i<a.count;i++){uv[i*2]=a.getX(i)/8.6+.5;uv[i*2+1]=a.getZ(i)/10+.5;}o.geometry.setAttribute('uv',new THREE.BufferAttribute(uv,2));o.material=o.material.clone();o.material.map=floorTexture;o.material.color.set(0x293039);o.material.roughness=.68;o.material.metalness=.28;}}});
 const floating=[];
 // Each platform reads as its own place: the Atrium is slate, the gallery is deep teal, the Kernel deck is scorched bronze.
 // The Well decks run indigo, violet and scorched gold so each is its own place too.
 const deckTint=[[0x172027,0x000000],[0x14262c,0x07262a],[0x2a1d14,0x2a0f08],[0x161a2a,0x0b0a2a],[0x1c1526,0x1a0826],[0x241c14,0x2a1a06]];
 floors.forEach((platform,index)=>platform.traverse(o=>{if(o.isMesh){o.material=o.material.clone();if(o.material.name==='stone')o.material.color.set([0x44474a,0x3b474b,0x4d4238,0x3a3f4a,0x463a4e,0x4a4034][index]);else if(o.material.color.r>o.material.color.b*1.4)o.material.color.set([0x846e49,0x6f7b5c,0x9a6b3a,0x5f6a8a,0x7a5f8a,0x9a7a3a][index]);else {o.material.color.set(deckTint[index][0]);o.material.emissive.set(deckTint[index][1]);o.material.emissiveIntensity=.35;o.material.metalness=.08;o.material.bumpMap=floorTexture;o.material.bumpScale=.005;}o.material.roughness=.78;o.material.envMapIntensity=0;}}));
 const kernel=place('kernel-assembly',3.5,-3,-53,1.3,.1);kernel.traverse(o=>{o.castShadow=false;if(o.isMesh&&o.material.name==='stone'){o.material=o.material.clone();o.material.color.set(0x967f5c);o.material.metalness=.65;}if(o.isMesh&&o.material.name==='interface'){o.material=o.material.clone();o.material.color.set(0xcab28a);o.material.emissive.set(0xffd29b);o.material.emissiveIntensity=.6;}});
 const rigidGroups=[];kernel.traverse(o=>{if(o.isGroup)rigidGroups.push(o);});for(const group of rigidGroups){const meshes=group.children.filter(o=>o.isMesh);if(meshes.length<2)continue;const rigid=new THREE.Group();for(const mesh of meshes)rigid.add(mesh);group.add(bakeStatic(rigid));}
 const orbits=[];kernel.traverse(o=>{if(/^orbit\d/.test(o.name))orbits.push(o);});const orbitRest=orbits.map(o=>o.rotation.clone());
 const mechanism=place('archive-mechanism',-5,-2.4,-17,1.1,.3);mechanism.traverse(o=>{o.castShadow=false;});
 // Socket petals, inset glass and opposing mechanical latches remain real articulated geometry.
 const sockets=SOCKETS.map((p,i)=>place('socket-pedestal',p.x,floorY(p.z),p.z,i===0?1.3:1.05,.16));const socketGlass=[];sockets.forEach((object,i)=>object.traverse(o=>{if(o.isMesh&&o.material.name==='interface'){o.material=o.material.clone();const gravity=SOCKETS[i].card==='gravity';o.material.color.set(gravity?0x4a2f66:0x245461);o.material.emissive.set(gravity?0x9a5cff:0x2794a0);socketGlass.push(o.material);}}));
 // A pedestal standing between the camera and Mara turns to glass instead of hiding her.
 const socketSkins=sockets.map(object=>{const mats=[];object.traverse(o=>{if(o.isMesh){o.material=o.material.clone();o.material.transparent=true;mats.push(o.material);}});return{mats,fade:1};});
 const latches=sockets.flatMap(object=>['leftLatch','rightLatch'].map(n=>object.getObjectByName(n)));const latchRest=latches.map(o=>o.position.x);
 const cards=SOCKETS.map(p=>{const c=place('card-housing',p.x,floorY(p.z)+.92,p.z+.075,.85,.16);c.rotation.x=-.39;c.visible=false;if(p.card==='gravity')c.traverse(o=>{if(o.isMesh&&o.material.emissive){o.material=o.material.clone();o.material.emissive.set(0x9a5cff);}});return c;});
 const handCard=place('card-housing',0,0,0,.7);handCard.visible=false;
 const socketLight=new THREE.PointLight(0x56e8f2,1.2,3,2);socketLight.position.set(SOCKET.x,.85,SOCKET.z+.2);scene.add(socketLight);
 const gravityLight=new THREE.PointLight(0xb98cff,0,3,2);scene.add(gravityLight);
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
 const deckY=floorY;
 const fragments=FRAGMENTS.map((f,i)=>{const object=place('card-housing',f.x,deckY(f.z)+.34,f.z,.31,(i-1)*.6);return object;});
 // Well structure: the stair down from the Kernel, three sunken slabs, and the stair onto the core deck.
 const ramp=[-18.75,-19.35,-19.95].map(z=>{const s=place('bridge-segment',0,floorY(z)-bridgeTop,z);s.scale.set(1.13,1,1.15);s.visible=false;return s;});
 const slabs=SLABS.map(z=>{const s=place('bridge-segment',0,WELL_Y-bridgeTop-1.4,z);s.scale.set(.85,1,3.2);s.traverse(o=>{if(o.isMesh&&o.material.name==='interface')o.material=o.material.clone();});return s;});
 const coreStair=place('bridge-segment',0,WELL_Y-bridgeTop,-37.1);coreStair.scale.set(1.13,1,1.9);coreStair.visible=false;
 const exitCrown=place('archive-mechanism',SOCKETS[2].x,1.0,SOCKETS[2].z,.30);exitCrown.traverse(o=>{o.castShadow=false;});
 // Gallery plates: a floor ring, its symbol, and the order numeral that only DIM shows. Mara walks them; nothing is clicked.
 function label(draw){const canvas=document.createElement('canvas');canvas.width=canvas.height=128;const c=canvas.getContext('2d');c.strokeStyle=c.fillStyle='#ffffff';c.lineWidth=6;c.lineJoin='round';draw(c);const tex=new THREE.CanvasTexture(canvas);tex.colorSpace=THREE.SRGBColorSpace;return tex;}
 const symbolTex=[0,1,2].map(symbol=>label(c=>{c.beginPath();if(symbol===0)c.arc(64,64,36,0,Math.PI*2);else{const n=symbol===1?3:4;for(let k=0;k<=n;k++){const a=k/n*Math.PI*2-Math.PI/2,x=64+Math.cos(a)*42,y=64+Math.sin(a)*42+(symbol===1?6:0);k?c.lineTo(x,y):c.moveTo(x,y);}}c.stroke();}));
 const numeralTex=['I','II','III'].map(n=>label(c=>{c.font='600 78px Georgia,serif';c.textAlign='center';c.textBaseline='middle';c.fillText(n,64,68);}));
 const flat=(geometry,material,x,y,z)=>{const m=new THREE.Mesh(geometry,material);m.rotation.x=-Math.PI/2;m.position.set(x,y,z);scene.add(m);return m;};
 // The trimmed vendor build has no ring or disc geometry, so rings are drawn onto square planes.
 const ringTex=label(c=>{c.lineWidth=14;c.beginPath();c.arc(64,64,55,0,Math.PI*2);c.stroke();}),discTex=label(c=>{c.beginPath();c.arc(64,64,56,0,Math.PI*2);c.fill();});
 const plates=GLYPHS.map((p,i)=>{const ring=flat(new THREE.PlaneGeometry(1.32,1.32),new THREE.MeshBasicMaterial({map:ringTex,color:0x56e8f2,transparent:true,opacity:.7,depthWrite:false}),p.x,.022,p.z);
  const symbol=flat(new THREE.PlaneGeometry(.62,.62),new THREE.MeshBasicMaterial({map:symbolTex[i],color:0xbdf6fb,transparent:true,opacity:.9,depthWrite:false}),p.x,.026,p.z);
  const numeral=flat(new THREE.PlaneGeometry(.4,.4),new THREE.MeshBasicMaterial({map:numeralTex[GLYPH_SEQUENCE.indexOf(i)],color:0xffd9a0,transparent:true,opacity:.95,depthWrite:false}),p.x,.028,p.z+.86);
  const glow=new THREE.PointLight(0x56e8f2,0,2.6,2);glow.position.set(p.x,.55,p.z);scene.add(glow);return{ring,symbol,numeral,glow};});
 // Kernel fractures: coral rings on the deck joined by veins that fade as Mara seals them.
 const nodes=NODES.map(p=>{const y=deckY(p.z);const ring=flat(new THREE.PlaneGeometry(1,1),new THREE.MeshBasicMaterial({map:ringTex,color:0xff6d7a,transparent:true,opacity:.8,depthWrite:false}),p.x,y+.024,p.z);const core=flat(new THREE.PlaneGeometry(.4,.4),new THREE.MeshBasicMaterial({map:discTex,color:0xffb0a8,transparent:true,opacity:.6,depthWrite:false}),p.x,y+.026,p.z);const glow=new THREE.PointLight(0xff5b6e,0,2.6,2);glow.position.set(p.x,y+.5,p.z);scene.add(glow);return{ring,core,glow};});
 const veinCanvas=document.createElement('canvas');veinCanvas.width=veinCanvas.height=512;{const c=veinCanvas.getContext('2d');c.strokeStyle='#ff5268';c.lineWidth=3;c.lineCap='round';const px=p=>[(p.x+3.9)/7.8*512,(p.z+18.5)/5.4*512];for(let i=0;i<NODES.length;i++)for(let j=i+1;j<NODES.length;j++){const [ax,ay]=px(NODES[i]),[bx,by]=px(NODES[j]);c.beginPath();c.moveTo(ax,ay);const steps=9;for(let k=1;k<=steps;k++){const t=k/steps;c.lineTo(ax+(bx-ax)*t+(random()-.5)*22,ay+(by-ay)*t+(random()-.5)*22);}c.stroke();}for(const n of NODES){const [x,y]=px(n);for(let k=0;k<5;k++){const a=random()*Math.PI*2,l=25+random()*40;c.beginPath();c.moveTo(x,y);c.lineTo(x+Math.cos(a)*l*.5+(random()-.5)*8,y+Math.sin(a)*l*.5+(random()-.5)*8);c.lineTo(x+Math.cos(a)*l,y+Math.sin(a)*l);c.stroke();}}}
 const veinTex=new THREE.CanvasTexture(veinCanvas);veinTex.colorSpace=THREE.SRGBColorSpace;const veins=flat(new THREE.PlaneGeometry(7.8,5.4),new THREE.MeshBasicMaterial({map:veinTex,transparent:true,opacity:.3,depthWrite:false}),0,-.078,-15.8);
 const dangerEdge=new THREE.Mesh(new THREE.PlaneGeometry(.72,8.7),new THREE.MeshBasicMaterial({color:0xcc5365,transparent:true,opacity:.18,depthWrite:false}));dangerEdge.rotation.x=-Math.PI/2;dangerEdge.position.set(3.6,.03,-13.35);scene.add(dangerEdge);
 // Anchors drift on the violet deck; pinned they turn gold. Locks ring the core; the core itself is a torus that lifts when powered.
 const anchors=[0,1,2].map(()=>{const ring=flat(new THREE.PlaneGeometry(1.1,1.1),new THREE.MeshBasicMaterial({map:ringTex,color:0xb98cff,transparent:true,opacity:.8,depthWrite:false}),0,WELL_Y+.024,WELL.z);const core=flat(new THREE.PlaneGeometry(.42,.42),new THREE.MeshBasicMaterial({map:discTex,color:0xd9c4ff,transparent:true,opacity:.6,depthWrite:false}),0,WELL_Y+.026,WELL.z);const glow=new THREE.PointLight(0xb98cff,0,2.6,2);scene.add(glow);return{ring,core,glow,halo:null};});
 const locks=LOCKS.map(p=>{const ring=flat(new THREE.PlaneGeometry(1,1),new THREE.MeshBasicMaterial({map:ringTex,color:0xffd9a0,transparent:true,opacity:.8,depthWrite:false}),p.x,WELL_Y+.024,p.z);const core=flat(new THREE.PlaneGeometry(.38,.38),new THREE.MeshBasicMaterial({map:discTex,color:0xffe6bb,transparent:true,opacity:.6,depthWrite:false}),p.x,WELL_Y+.026,p.z);const glow=new THREE.PointLight(0xffd9a0,0,2.4,2);glow.position.set(p.x,WELL_Y+.5,p.z);scene.add(glow);return{ring,core,glow};});
 const coreRing=new THREE.Mesh(new THREE.TorusGeometry(CORE.radius+.08,.07,8,40),new THREE.MeshStandardMaterial({color:0xcab28a,emissive:0xffd29b,emissiveIntensity:.5,roughness:.35,metalness:.7}));coreRing.rotation.x=Math.PI/2;coreRing.position.set(CORE.x,WELL_Y+.06,CORE.z);scene.add(coreRing);
 const coreDisc=flat(new THREE.PlaneGeometry(CORE.radius*2,CORE.radius*2),new THREE.MeshBasicMaterial({map:discTex,color:0xffd9a0,transparent:true,opacity:.15,depthWrite:false}),CORE.x,WELL_Y+.03,CORE.z);
 const coreLight=new THREE.PointLight(0xffd29b,0,5,2);coreLight.position.set(CORE.x,WELL_Y+1,CORE.z);scene.add(coreLight);
 const crumbleRing=flat(new THREE.PlaneGeometry(1,1),new THREE.MeshBasicMaterial({map:ringTex,color:0xff5268,transparent:true,opacity:0,depthWrite:false}),WELL.x,WELL_Y+.03,WELL.z);
 const coreEdge=flat(new THREE.PlaneGeometry(6.8,6.8),new THREE.MeshBasicMaterial({map:ringTex,color:0xcc5365,transparent:true,opacity:.2,depthWrite:false}),CORE.x,WELL_Y+.03,CORE.z);coreEdge.visible=false;
 // Motes that rise in the Well under LOW gravity.
 const wellPositions=[];for(let i=0;i<60;i++)wellPositions.push((random()-.5)*7,WELL_Y+random()*2.2,-20.5-random()*22);const wellGeo=new THREE.BufferGeometry();wellGeo.setAttribute('position',new THREE.Float32BufferAttribute(wellPositions,3));const wellMotes=new THREE.Points(wellGeo,new THREE.PointsMaterial({color:0xd9c4ff,size:.03,transparent:true,opacity:.5,depthWrite:false}));scene.add(wellMotes);
 const mara=await maraPromise;scene.add(mara.root);const animator=new MaraAnimator(mara);
 // Readable hero palette: the near-black coat becomes deep teal, the lining rust, so Mara separates from every deck and sky.
 {const seen=new Map();mara.root.traverse(o=>{if(!o.isMesh||o.material.name==='interface')return;const src=o.material;if(!seen.has(src)){const m=src.clone();const c=src.color;if(c.r<.13&&c.g<.13&&c.b<.16&&src.name==='metal'){m.color.set(0x1e7d8f);m.roughness=.48;m.metalness=.3;}else if(src.name==='fabric'&&c.r<.12&&c.b<.15){m.color.set(0xc2643a);m.roughness=.7;}else if(src.name==='fabric'){m.color.set(0x2a1a14);}seen.set(src,m);}o.material=seen.get(src);});}
 const characterFill=new THREE.PointLight(0xc4d9e1,12,5,2);scene.add(characterFill);
 const gloveLight=new THREE.PointLight(0x56e8f2,.7,2.5,2);scene.add(gloveLight);
 // Contact shadow follows the feet and stays soft at the edge of the void.
 const shade=document.createElement('canvas');shade.width=shade.height=128;const sc=shade.getContext('2d'),sg=sc.createRadialGradient(64,64,5,64,64,64);sg.addColorStop(0,'rgba(0,0,0,.42)');sg.addColorStop(.35,'rgba(0,0,0,.20)');sg.addColorStop(1,'rgba(0,0,0,0)');sc.fillStyle=sg;sc.fillRect(0,0,128,128);
 const contact=new THREE.Mesh(new THREE.PlaneGeometry(.85,.6),new THREE.MeshBasicMaterial({map:new THREE.CanvasTexture(shade),transparent:true,depthWrite:false}));contact.rotation.x=-Math.PI/2;scene.add(contact);
 // Local, restrained bloom only at the glove, socket and Kernel.
 const glowCanvas=document.createElement('canvas');glowCanvas.width=glowCanvas.height=128;const gc=glowCanvas.getContext('2d'),gradient=gc.createRadialGradient(64,64,0,64,64,64);gradient.addColorStop(0,'rgba(255,255,255,.3)');gradient.addColorStop(.12,'rgba(255,255,255,.12)');gradient.addColorStop(1,'rgba(255,255,255,0)');gc.fillStyle=gradient;gc.fillRect(0,0,128,128);const glowMap=new THREE.CanvasTexture(glowCanvas);
 function bloom(color,size){const s=new THREE.Sprite(new THREE.SpriteMaterial({map:glowMap,color,transparent:true,depthWrite:false,blending:THREE.AdditiveBlending}));s.scale.setScalar(size);scene.add(s);return s;}
 const gloveBloom=bloom(0x56e8f2,.55),socketBloom=bloom(0x56e8f2,1);socketBloom.position.copy(socketLight.position);const gravityBloom=bloom(0xb98cff,1);gravityBloom.visible=false;const kernelBloom=bloom(0xffd9a0,15);kernelBloom.position.set(3.5,5.5,-53);const coreBloom=bloom(0xffd9a0,2.4);coreBloom.position.set(CORE.x,WELL_Y+.4,CORE.z);anchors.forEach(a=>{a.halo=bloom(0xb98cff,1.2);});
 const fragmentBlooms=FRAGMENTS.map(f=>{const s=bloom(0xffd9a0,1.1);s.position.set(f.x,deckY(f.z)+.42,f.z);return s;});const nodeBlooms=NODES.map(n=>{const s=bloom(0xff6d7a,1.3);s.position.set(n.x,deckY(n.z)+.25,n.z);return s;});
 // Objective beacon: a beam and a bobbing chevron always stand over the next thing to do, so nobody has to read to know where to go.
 const chevronTex=label(c=>{c.lineWidth=12;c.beginPath();c.moveTo(24,40);c.lineTo(64,84);c.lineTo(104,40);c.stroke();c.beginPath();c.moveTo(34,16);c.lineTo(64,50);c.lineTo(94,16);c.stroke();});
 const beacon=new THREE.Group();scene.add(beacon);const beam=new THREE.Mesh(new THREE.PlaneGeometry(.7,5),new THREE.MeshBasicMaterial({map:shaftTex,transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,color:0x56e8f2,opacity:.7,fog:false}));beam.position.y=2.6;beacon.add(beam);
 const chevron=new THREE.Sprite(new THREE.SpriteMaterial({map:chevronTex,color:0x56e8f2,transparent:true,depthWrite:false,depthTest:false}));chevron.scale.setScalar(.55);chevron.position.y=1.9;beacon.add(chevron);const beaconRing=flat(new THREE.PlaneGeometry(1.4,1.4),new THREE.MeshBasicMaterial({map:ringTex,color:0x56e8f2,transparent:true,opacity:.5,depthWrite:false}),0,0,0);beacon.add(beaconRing);beaconRing.position.set(0,.03,0);
 const beaconTarget=new THREE.Vector3();let beaconSmooth=null;
 function objective(state){const S=SOCKETS;const sock=i=>[S[i].x,S[i].z];if(state.won||state.restoration||state.failure)return null;
  switch(state.stage){case 0:return state.bridge<1?sock(0):[0,-8.8];
   case 1:if(!state.installed||state.installedSocket!==1||!state.glyphSeen)return sock(1);if(!state.readSolved){const g=GLYPHS[GLYPH_SEQUENCE[state.glyphInput.length]];return state.brightness==='BALANCED'?[g.x,g.z]:sock(1);}return[0,-13.6];
   case 2:if(!state.installed||state.installedSocket!==2||!state.nodesSeen)return sock(2);if(state.cleared.length<3){if(state.brightness!=='BALANCED')return sock(2);const n=NODES.find((_,i)=>!state.cleared.includes(i));return[n.x,n.z];}return sock(2);
   case 3:if(!state.landed)return[0,-21.4];if(!state.gInstalled||state.lift<1)return sock(3);return[0,-31];
   case 4:if(!state.gInstalled||state.gSocket!==4||state.gravity!=='HEAVY')return sock(4);if(!state.anchored){const i=state.pins.findIndex(p=>!p);const a=anchorAt(state,i);return[a.x,a.z];}return[0,-37.5];
   case 5:if(!state.installed||state.installedSocket!==5)return sock(5);if(!state.gInstalled||state.gSocket!==6)return sock(6);if(!state.locksSeen)return sock(5);if(state.locks.length<3){if(state.gravity!=='HEAVY'||state.brightness!=='DIM')return sock(5);const l=LOCKS.find((_,i)=>!state.locks.includes(i));return[l.x,l.z];}if(state.core<1)return sock(5);return[CORE.x,CORE.z];}return null;}
 // Fragment burst: a ring of sparks that flies outward for half a second when a fragment is taken.
 const burstCount=36,burstBase=new Float32Array(burstCount*3);for(let i=0;i<burstCount;i++){const a=i/burstCount*Math.PI*2;burstBase[i*3]=Math.cos(a);burstBase[i*3+1]=.3+random()*.9;burstBase[i*3+2]=Math.sin(a);}
 const burstGeo=new THREE.BufferGeometry();burstGeo.setAttribute('position',new THREE.Float32BufferAttribute(new Float32Array(burstCount*3),3));const burst=new THREE.Points(burstGeo,new THREE.PointsMaterial({color:0xffd9a0,size:.09,transparent:true,opacity:0,depthWrite:false,blending:THREE.AdditiveBlending}));scene.add(burst);let burstLife=0,lastFragments=0;const burstOrigin=new THREE.Vector3();
 const points=[];for(let i=0;i<65;i++)points.push((random()-.5)*35,random()*18,10-random()*75);const moteGeo=new THREE.BufferGeometry();moteGeo.setAttribute('position',new THREE.Float32BufferAttribute(points,3));const motes=new THREE.Points(moteGeo,new THREE.PointsMaterial({color:0xe5ddd0,size:.019,transparent:true,opacity:.4,depthWrite:false}));scene.add(motes);
 const target=new THREE.Vector3(),desired=new THREE.Vector3(),look=new THREE.Vector3(),projected=new THREE.Vector3(),gloveWorld=new THREE.Vector3(),headWorld=new THREE.Vector3(),direction=new THREE.Vector3(),ray=new THREE.Raycaster();
 let currentSocket=SOCKET,currentGravity=null,lastBridge=0,completionPulse=0;let initialized=false,frameCount=0,frameStart=performance.now(),fps=0;const dimensions=new THREE.Box3(),corner=new THREE.Vector3();
 const gl=renderer.getContext(),debug=gl.getExtension('WEBGL_debug_renderer_info');const device=debug?gl.getParameter(debug.UNMASKED_RENDERER_WEBGL):gl.getParameter(gl.RENDERER);
 function update(state,dt,time,{screen='hud',reduced=false,yaw=0,pitch=0,review=null,dragging=false,validDrag=false}={}){
  characterFill.position.set(state.x+1.3,2.7,state.z+1.5);mara.root.position.set(state.x,state.y,state.z);let d=state.yaw-mara.root.rotation.y;d=Math.atan2(Math.sin(d),Math.cos(d));mara.root.rotation.y+=d*Math.min(1,dt*12);animator.update(dt,reduced,state);
  mara.root.updateMatrixWorld(true);mara.bones.gloveLight.getWorldPosition(gloveWorld);gloveLight.position.copy(gloveWorld);gloveBloom.position.copy(gloveWorld);gloveBloom.material.opacity=dragging?.9:.48;
  handCard.visible=dragging;handCard.position.copy(gloveWorld);handCard.position.y+=.14;handCard.rotation.set(-.3,mara.root.rotation.y,0);
  currentSocket=activeSocket(state,'brightness');currentGravity=activeSocket(state,'gravity');const ground=floorY(state.z);
  socketLight.visible=socketBloom.visible=!!currentSocket;if(currentSocket){socketLight.position.set(currentSocket.x,floorY(currentSocket.z)+1,currentSocket.z+.2);socketBloom.position.copy(socketLight.position);}
  gravityLight.visible=gravityBloom.visible=!!currentGravity;if(currentGravity){gravityLight.position.set(currentGravity.x,floorY(currentGravity.z)+1,currentGravity.z+.2);gravityBloom.position.copy(gravityLight.position);}
  const bHere=here(state,'brightness'),gHere=here(state,'gravity');
  cards.forEach((c,i)=>{c.visible=(state.installed&&state.installedSocket===i)||(state.gInstalled&&state.gSocket===i);});socketGlass.forEach((m,i)=>{const gravity=SOCKETS[i].card==='gravity',lit=gravity?state.gInstalled&&state.gSocket===i:state.installed&&state.installedSocket===i;m.emissiveIntensity=validDrag===SOCKETS[i].card?1.5:lit?.9:.35;});
  socketLight.intensity=validDrag==='brightness'?2:bHere?1.4:.6;socketBloom.material.opacity=validDrag==='brightness'?.9:.35;gravityLight.intensity=validDrag==='gravity'?2:gHere?1.4:.6;gravityBloom.material.opacity=validDrag==='gravity'?.9:.35;
  latches.forEach((l,i)=>{const k=Math.floor(i/2),shut=(state.installed&&k===state.installedSocket)||(state.gInstalled&&k===state.gSocket);l.position.x=latchRest[i]+(shut?(i%2===0?.032:-.032):0);});
  channel.geometry.setDrawRange(0,Math.floor(Math.min(1,state.bridge/.16)*channel.geometry.index.count));
  spine.visible=state.bridge>.08;spine.geometry.setDrawRange(0,Math.floor(Math.min(1,Math.max(0,state.bridge-.08)/.18)*spine.geometry.index.count));
  glass.forEach((g,i)=>{g.visible=state.bridge>(i+2)/12;g.material.opacity=(.16+(!reduced?Math.sin(time*2-i)*.04:0))*(.3+.7*Math.min(1,lux));});
  bridgeDust.visible=state.bridge>0&&state.bridge<1;const dust=dustGeometry.attributes.position;for(let i=0;i<dust.count;i++)dust.setY(i,dustPositions[i*3+1]+Math.sin(state.bridge*Math.PI)*.5-state.bridge*.3);dust.needsUpdate=true;
  sockets.forEach((s,i)=>{const receptacle=s.getObjectByName('receptacle');if(receptacle)receptacle.rotation.z=i===state.installedSocket&&state.bridge>0&&state.bridge<1?Math.sin(state.bridge*Math.PI)*.06:0;});
  channelMat.opacity=state.bridge;channelMat.emissiveIntensity=1+Math.sin(time*3)*.25;
  if(state.bridge>=1&&lastBridge<1){completionPulse=.65;flash=reduced?0:.6;}lastBridge=state.bridge;completionPulse=Math.max(0,completionPulse-dt);flash=Math.max(0,flash-dt*1.1);
  // Light level: DIM darkens and thickens the fog, RADIANT floods the room, no card leaves it half-lit.
  const targetLux=lightTarget(state);lux=reduced?targetLux:lux+(targetLux-lux)*Math.min(1,dt*3.2);const L=Math.min(1,lux),hot=Math.max(0,lux-1);
  // Gravity tints the Well: LOW lifts a violet haze, HEAVY presses it down to rust.
  const low=gHere&&state.gravity==='LOW',heavy=gHere&&state.gravity==='HEAVY';
  renderer.toneMappingExposure=.95*(.5+.5*lux)+flash*.45;scene.fog.density=.010+(1-L)*.016-hot*.003+(heavy?.004:0);scene.fog.color.copy(FOG_DIM).lerp(FOG_BALANCED,L).lerp(FOG_RADIANT,Math.min(1,hot*1.6));if(low)scene.fog.color.lerp(FOG_LOW,.45);else if(heavy)scene.fog.color.lerp(FOG_HEAVY,.45);scene.backgroundIntensity=.25+.75*L+hot*.5;
  key.intensity=2.4*(.22+.78*L+hot*.5)+(reduced?0:Math.sin(time*.12)*.08);hemi.intensity=1.05*(.3+.7*L+hot*.3);fill.intensity=1.55*(.3+.7*L);rim.intensity=1.5*(.4+.6*L+hot*.6);characterFill.intensity=12*(.62+.38*L);
  bridgeLights.forEach((light,i)=>{light.intensity=(state.bridge>(i+1)*.27?.9+completionPulse*2:0)*(.35+.65*L);light.color.set(completionPulse>.1?0xffda9b:0x7adce5);});
  bridge.forEach((segment,i)=>{const f=THREE.MathUtils.clamp((state.bridge-.16)*13-i,0,1),e=1-(1-f)**3;segment.visible=f>0;segment.position.y=-bridgeTop-(1-e)*1.5;segment.rotation.z=(1-e)*(i%2?-.65:.65);segment.scale.x=.15+.85*e;});
  stepDeck.visible=state.readSolved;
  // Plates: DIM shows ring, symbol and order; BALANCED keeps ring and symbol; RADIANT washes them out. Stepped plates hold gold.
  const galleryLit=state.installed&&state.installedSocket===1&&(state.stage===1||state.stage===2);
  plates.forEach((p,i)=>{const dim=galleryLit&&state.brightness==='DIM',shown=state.stage===1&&(galleryLit&&state.brightness!=='RADIANT'||state.readSolved),stepped=state.glyphInput.includes(i)||state.readSolved,wrong=state.misstep>0&&state.onGlyph===i;
   p.ring.visible=p.symbol.visible=shown;p.numeral.visible=dim&&!state.readSolved;const pulse=reduced?0:Math.sin(time*3+i)*.08;
   p.ring.material.color.set(wrong?0xff5268:stepped?0xffd9a0:0x56e8f2);p.symbol.material.color.set(wrong?0xffb0a8:stepped?0xffe6bb:0xbdf6fb);p.ring.material.opacity=(stepped?.95:dim?.9:.62)+pulse;p.symbol.material.opacity=stepped?1:dim?.95:.8;
   p.glow.intensity=!shown?0:wrong?2.2:stepped?1.1:dim?1.4:.45;p.glow.color.set(wrong?0xff5268:stepped?0xffd9a0:0x56e8f2);});
  dangerEdge.visible=state.stage>0&&state.installed&&state.brightness==='RADIANT'&&!state.won&&!state.restoration;dangerEdge.material.opacity=.2+(reduced?0:Math.sin(time*2)*.06);
  // Fractures: bright coral in DIM, faint once remembered in BALANCED, live and pulsing in RADIANT, gone when sealed.
  const kernelLit=state.stage===2&&state.installed&&state.installedSocket===2,live=kernelLit&&state.brightness==='RADIANT';let open=0;
  nodes.forEach((n,i)=>{const sealed=state.cleared.includes(i);if(!sealed)open++;const visible=state.stage===2&&!sealed&&!state.won&&!state.restoration&&(state.brightness==='DIM'&&kernelLit||state.nodesSeen);n.ring.visible=n.core.visible=nodeBlooms[i].visible=visible;
   const strength=!visible?0:live?1.2+(reduced?0:Math.sin(time*7+i)*.4):kernelLit&&state.brightness==='DIM'?1:.4;n.ring.material.opacity=Math.min(1,.5*strength+.2);n.core.material.opacity=Math.min(1,.4*strength+.1);nodeBlooms[i].material.opacity=Math.min(1,.55*strength);n.glow.intensity=visible?strength*1.6:0;const s=live?1+(reduced?0:Math.sin(time*7+i)*.12):1;n.ring.scale.setScalar(s);});
  veins.visible=state.stage===2&&open>0&&!state.won;veins.material.opacity=(open/3)*(live?.55:kernelLit&&state.brightness==='DIM'?.4:.16)+(live&&!reduced?Math.sin(time*6)*.08:0);
  kernelBloom.material.opacity=state.won?1:state.kernelRestored?.7:.38;exitCrown.rotation.y=reduced?0:time*.06+state.restoration*Math.PI;
  // Sector 02: the stair opens once the Kernel is restored; slabs float up in sequence under LOW and sink when it spends.
  ramp.forEach(r=>{r.visible=state.kernelRestored;});coreStair.visible=state.anchored;
  slabs.forEach((slab,i)=>{const f=THREE.MathUtils.clamp(state.lift*3-i,0,1),e=1-(1-f)**3;slab.position.y=WELL_Y-bridgeTop-(1-e)*1.4;slab.rotation.z=(1-e)*(i%2?-.28:.28);slab.traverse(o=>{if(o.isMesh&&o.material.name==='interface'){o.material.emissive.set(0x9a5cff);o.material.emissiveIntensity=.2+e*1.2;}});});
  const shrink=1-.28*state.crumble;anchorDeck.scale.set(.78*shrink,1,.585*shrink);crumbleRing.scale.set(7.4*shrink,6.6*shrink,1);crumbleRing.material.opacity=state.crumble>0?.25+state.crumble*.4+(reduced?0:Math.sin(time*8)*.08):0;crumbleRing.visible=state.crumble>0;
  const frozen=anchorsFrozen(state);anchors.forEach((a,i)=>{const p=anchorAt(state,i),pinned=!!state.pins[i],show=state.stage===4&&!state.won;const rise=low&&!pinned?.35:0;a.ring.visible=a.core.visible=a.halo.visible=show;a.ring.position.set(p.x,WELL_Y+.024+rise,p.z);a.core.position.set(p.x,WELL_Y+.026+rise,p.z);a.halo.position.set(p.x,WELL_Y+.25+rise,p.z);a.glow.position.set(p.x,WELL_Y+.5,p.z);
   a.ring.material.color.set(pinned?0xffd9a0:frozen?0xe2d2ff:0xb98cff);a.core.material.color.set(pinned?0xffe6bb:0xd9c4ff);a.ring.material.opacity=pinned?.95:.7+(reduced?0:Math.sin(time*3+i)*.1);a.halo.material.opacity=pinned?.5:frozen?.7:.35;a.glow.intensity=show?(pinned?1.1:frozen?1.6:.5):0;a.glow.color.set(pinned?0xffd9a0:0xb98cff);a.ring.scale.setScalar(pinned?1.15:1);});
  const locksShown=state.stage===5&&(state.locksSeen||(bHere&&state.brightness==='DIM'&&gHere&&state.gravity==='HEAVY'))&&!state.won;
  locks.forEach((l,i)=>{const pinned=state.locks.includes(i);l.ring.visible=l.core.visible=locksShown;l.ring.material.color.set(pinned?0x56e8f2:0xffd9a0);l.core.material.color.set(pinned?0xbdf6fb:0xffe6bb);l.ring.material.opacity=pinned?.95:.65+(reduced?0:Math.sin(time*3+i)*.1);l.glow.intensity=locksShown?(pinned?1.2:heavy?1.5:.6):0;l.glow.color.set(pinned?0x56e8f2:0xffd9a0);});
  coreRing.position.y=WELL_Y+.06+state.core*.32;coreRing.rotation.z=reduced?0:time*.4*(1+state.core*2);coreRing.material.emissiveIntensity=.5+state.core*1.6+(state.restoration&&state.stage===5?2:0);coreDisc.material.opacity=.15+state.core*.6;coreLight.intensity=state.core*3+(state.stage===5&&state.locks.length===3?.6:0);coreBloom.material.opacity=.2+state.core*.7;coreBloom.visible=state.stage>=4;
  coreEdge.visible=state.stage===5&&bHere&&state.brightness==='RADIANT'&&!state.won&&!state.restoration;coreEdge.material.opacity=.22+(reduced?0:Math.sin(time*2)*.06);
  wellMotes.visible=state.stage>=3;{const pos=wellGeo.attributes.position;for(let i=0;i<pos.count;i++){const base=wellPositions[i*3+1];pos.setY(i,low?base+((time*.5+i*.37)%2.2):heavy?base-.4+Math.sin(time*.4+i)*.05:base+Math.sin(time*.3+i)*.15);}pos.needsUpdate=true;}
  fragments.forEach((f,i)=>{const held=state.fragments.includes(i);f.visible=fragmentBlooms[i].visible=!held;f.rotation.y=(i-1)*.6+(reduced?0:time*.6);f.position.y=deckY(FRAGMENTS[i].z)+.34+(reduced?0:Math.sin(time*1.6+i)*.05);fragmentBlooms[i].position.y=f.position.y+.08;fragmentBlooms[i].material.opacity=.45+(reduced?0:Math.sin(time*2+i)*.15);});
  const motionTime=time-(state.failure>.2?(state.failure-.2)*2:0);
  if(!reduced){orbits.forEach((o,i)=>{o.rotation.z=orbitRest[i].z+time*(i%2?-.007:.009)+state.restoration*.5;});floating.forEach((f,i)=>{f.object.position.y=f.y+Math.sin(time*.13+i)*.10;});const pos=moteGeo.attributes.position;for(let i=0;i<pos.count;i++){pos.setY(i,points[i*3+1]+Math.sin(motionTime*.2+i)*.24);pos.setX(i,points[i*3]+Math.sin(motionTime*.13+i*.7)*.18);}pos.needsUpdate=true;}
  contact.position.set(state.x,ground+.018,state.z);contact.visible=state.y>ground-.15;gloveLight.visible=state.y>ground-.8;
  // Sky, shafts and hall respond to where Mara is: the Atrium dusk gives way to Well violet past the stair.
  const wantSky=state.stage>=3?1:0;if(Math.abs(wantSky-skyBlend)>.002){skyBlend=reduced?wantSky:skyBlend+(wantSky-skyBlend)*Math.min(1,dt*1.5);paintSky(skyBlend);}
  sky.position.set(camera.position.x,camera.position.y-40,camera.position.z);shafts.forEach((s,i)=>{s.material.opacity=(.28+.32*L+hot*.3)*(1-skyBlend);s.position.y=7+(reduced?0:Math.sin(time*.2+i)*.3);});wellShafts.forEach((s,i)=>{s.material.opacity=(low?.7:.4)*skyBlend;});
  if(!reduced)debris.forEach((d,i)=>{const a=d.a+time*.03*(i%2?-1:1);d.object.position.set(WELL_C.x+Math.sin(a)*d.r,d.y+Math.sin(time*.5+i)*(low?.6:.2)-(heavy?.5:0),WELL_C.z+Math.cos(a)*d.r);d.object.rotation.y+=dt*d.spin;});
  // Beacon follows the current objective and pulses; it hides during failure, restoration and victory.
  {const o=objective(state);beacon.visible=!!o;if(o){beaconTarget.set(o[0],floorY(o[1]),o[1]);if(!beaconSmooth){beaconSmooth=beaconTarget.clone();}else beaconSmooth.lerp(beaconTarget,Math.min(1,dt*6));beacon.position.copy(beaconSmooth);const pulse=reduced?0:Math.sin(time*4);chevron.position.y=1.75+pulse*.12;chevron.material.opacity=.75+pulse*.2;beam.material.opacity=.35+pulse*.15;beaconRing.scale.setScalar(1+pulse*.06);beam.lookAt(camera.position.x,beam.position.y+beaconSmooth.y,camera.position.z);const gravityTarget=state.stage>=3&&SOCKETS.some(s=>s.card==='gravity'&&Math.abs(s.x-o[0])<.01&&Math.abs(s.z-o[1])<.01);const color=gravityTarget?0xb98cff:0x56e8f2;chevron.material.color.set(color);beam.material.color.set(color);beaconRing.material.color.set(color);}}
  if(state.fragments.length>lastFragments){const f=FRAGMENTS[state.fragments[state.fragments.length-1]];burstOrigin.set(f.x,deckY(f.z)+.3,f.z);burstLife=.55;}lastFragments=state.fragments.length;
  if(burstLife>0){burstLife=Math.max(0,burstLife-dt);const k=1-burstLife/.55,pos=burstGeo.attributes.position;for(let i=0;i<burstCount;i++){pos.setXYZ(i,burstOrigin.x+burstBase[i*3]*k*1.6,burstOrigin.y+burstBase[i*3+1]*k,burstOrigin.z+burstBase[i*3+2]*k*1.6);}pos.needsUpdate=true;burst.material.opacity=1-k;burst.visible=true;}else burst.visible=false;
  const mobile=innerWidth<700;const fov=mobile?52:50;if(camera.fov!==fov){camera.fov=fov;camera.updateProjectionMatrix();}
  if(review){mara.root.position.set(0,0,6);mara.root.rotation.y=review==='front'?0:review==='side'?Math.PI/2:Math.PI*.83;desired.set(.25,1.3,9.6);target.set(0,.97,6);}
  else {const push=state.bridge>0&&state.bridge<1&&!state.bridgeLatched?Math.sin(state.bridge*Math.PI)*.3:0;const distance=(mobile?7.6:7.1)-push+(state.stage===0&&state.bridge>0&&!state.bridgeLatched?state.bridge*.9:0);// The gallery frames the plates instead of the empty right-hand air.
   // The gallery frames the plates; the Well decks are centred so the drifting anchors and the core stay in view.
   const gallery=state.stage===1&&!state.readSolved,well=state.stage>=4,side=mobile?1.05:gallery?1.4:well?1.6:3.0,aim=mobile?.5:gallery?.7:well?.6:2.1;desired.set(state.x+side+Math.sin(yaw)*2.8,ground+2.05+pitch+(well?.5:0),state.z+distance);target.set(state.x+aim,ground+1.05,state.z-3.0);}
  // Shorten the boom against nearby architectural surfaces. Gameplay collision is unchanged.
  headWorld.set(state.x,ground+1.45,state.z);direction.copy(desired).sub(headWorld);const length=direction.length();direction.normalize();ray.set(headWorld,direction);ray.far=length;const hit=ray.intersectObjects(obstacles,true).find(h=>h.distance>.8);if(hit)desired.copy(headWorld).addScaledVector(direction,Math.max(1,hit.distance-.3));desired.y=Math.max(ground+1.3,desired.y);
  if(!initialized||reduced||review){camera.position.copy(desired);look.copy(target);initialized=true;}else{const a=1-Math.exp(-dt*5);camera.position.lerp(desired,a);look.lerp(target,a);}camera.lookAt(look);
  // Fade any pedestal that sits on the line from the camera to Mara's body.
  socketSkins.forEach((skin,i)=>{const p=SOCKETS[i];direction.copy(headWorld).sub(camera.position);const len=direction.length();direction.normalize();const t=(p.x-camera.position.x)*direction.x+(p.z-camera.position.z)*direction.z;let want=1;if(!review&&t>1&&t<len-.2){const cx=camera.position.x+direction.x*t,cz=camera.position.z+direction.z*t;const gap=Math.hypot(p.x-cx,p.z-cz);want=gap<1.1?.18:gap<1.6?.18+(gap-1.1)/.5*.82:1;}skin.fade+=(want-skin.fade)*Math.min(1,dt*10);for(const m of skin.mats)m.opacity=skin.fade;});
  renderer.info.reset();renderer.render(scene,camera);
  frameCount++;const now=performance.now();if(now-frameStart>=1200){fps=frameCount*1000/(now-frameStart);frameStart=now;frameCount=0;}
 }
 performance.mark('archive-geometry-ready');
 scene.background=null;
 return{renderer,scene,camera,mara,animator,update,snapCamera(){initialized=false;},resize(){renderer.setPixelRatio(Math.min(devicePixelRatio,innerWidth<700?1.35:1.6));renderer.setSize(innerWidth,innerHeight);camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();},socketScreen(card='brightness'){const k=card==='gravity'?currentGravity:currentSocket;if(!k)return{x:-9999,y:-9999,visible:false};projected.set(k.x,floorY(k.z)+1.08,k.z+.08).project(camera);return{x:(projected.x*.5+.5)*innerWidth,y:(-.5*projected.y+.5)*innerHeight,visible:projected.z<1&&Math.abs(projected.x)<1&&Math.abs(projected.y)<1};},metrics(){dimensions.setFromObject(mara.root);let minY=Infinity,maxY=-Infinity;for(let i=0;i<8;i++){corner.set(i&1?dimensions.max.x:dimensions.min.x,i&2?dimensions.max.y:dimensions.min.y,i&4?dimensions.max.z:dimensions.min.z).project(camera);minY=Math.min(minY,corner.y);maxY=Math.max(maxY,corner.y);}return{drawCalls:renderer.info.render.calls,triangles:renderer.info.render.triangles,fps:Number(fps.toFixed(1)),renderer:device,maraFrameHeight:Number(((maxY-minY)*50).toFixed(1)),fov:camera.fov};}};
}
