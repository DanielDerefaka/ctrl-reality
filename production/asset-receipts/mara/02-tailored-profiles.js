export default function generate(THREE) {
 const root=new THREE.Group();root.name='maraRoot';const joints={maraRoot:root};
 const material=(name,color,metalness,roughness,emissive=0)=>{const m=new THREE.MeshStandardMaterial({color,metalness,roughness,emissive,emissiveIntensity:1.2,side:THREE.DoubleSide});m.name=name;return m;};
 const obsidian=material('metal',0x10151c,.48,.29),lining=material('fabric',0x131820,.1,.72),bronze=material('metal',0xc99a4a,.72,.29),ivory=material('stone',0xe7e1d5,.13,.33),cyan=material('interface',0x56e8f2,.35,.25,0x36cddd),recess=material('fabric',0x070b0f,.15,.6);
 function joint(name,parent,x=0,y=0,z=0){const g=new THREE.Group();g.name=name;g.position.set(x,y,z);parent.add(g);joints[name]=g;return g;}
 function add(geo,mat,parent,x=0,y=0,z=0){const m=new THREE.Mesh(geo,mat);m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;parent.add(m);return m;}
 // Closed shaped rings form a fitted garment surface; radii describe silhouette, not a mesh blob.
 function loft(parent,profile,mat,segments=24){const p=[],idx=[];for(let j=0;j<profile.length;j++){const [y,rx,rz,ox=0,oz=0]=profile[j];for(let i=0;i<=segments;i++){const a=i/segments*Math.PI*2;p.push(ox+Math.sin(a)*rx,y,oz+Math.cos(a)*rz);}}for(let j=0;j<profile.length-1;j++)for(let i=0;i<segments;i++){const k=j*(segments+1)+i;idx.push(k,k+1,k+segments+1,k+1,k+segments+2,k+segments+1);}const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.Float32BufferAttribute(p,3));geo.setIndex(idx);geo.computeVertexNormals();return add(geo,mat,parent);}
 function sweep(parent,points,radius,mat=bronze){const curve=new THREE.CatmullRomCurve3(points.map(p=>new THREE.Vector3(...p)));return add(new THREE.TubeGeometry(curve,Math.max(8,points.length*5),radius,5,false),mat,parent);}
 function plate(parent,points,depth,mat,z=0){const shape=new THREE.Shape();points.forEach(([x,y],i)=>i?shape.lineTo(x,y):shape.moveTo(x,y));shape.closePath();return add(new THREE.ExtrudeGeometry(shape,{depth,bevelEnabled:true,bevelSegments:2,steps:1,bevelSize:.006,bevelThickness:.004,curveSegments:8}),mat,parent,0,0,z);}
 function coatPanel(name,parent,start,end,flare,length,offset=0){const g=joint(name,parent,0,0,offset);const p=[],ix=[],N=18,M=12;function point(u,v){const a=start+(end-start)*u,r=.185+flare*Math.pow(v,1.45);return [Math.sin(a)*r,-v*length+.018*Math.sin(u*Math.PI),Math.cos(a)*(r*.69)-.025*v*v];}for(let j=0;j<=M;j++)for(let i=0;i<=N;i++)p.push(...point(i/N,j/M));for(let j=0;j<M;j++)for(let i=0;i<N;i++){const k=j*(N+1)+i;ix.push(k,k+1,k+N+1,k+1,k+N+2,k+N+1);}const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.Float32BufferAttribute(p,3));geo.setIndex(ix);geo.computeVertexNormals();add(geo,obsidian,g);for(const u of [0,1])sweep(g,Array.from({length:7},(_,i)=>point(u,i/6)),.0028);sweep(g,Array.from({length:9},(_,i)=>point(i/8,1)),.003);sweep(g,Array.from({length:7},(_,i)=>point(.52,i/6)),.0014,bronze);return g;}
 const pelvis=joint('pelvis',root,0,.96,0);loft(pelvis,[[-.06,.155,.09],[0,.19,.105],[.085,.15,.09]],lining);
 const lower=joint('spineLower',pelvis,0,.10,0),upper=joint('spineUpper',lower,0,.19,0);
 plate(lower,[[-.17,-.04],[-.139,.10],[-.18,.24],[-.214,.30],[-.155,.355],[.155,.355],[.214,.30],[.18,.24],[.139,.10],[.17,-.04]],.13,obsidian,-.065);
 for(const sign of [-1,1]){const panel=plate(lower,[[sign*.012,-.05],[sign*.14,.10],[sign*.205,.29],[sign*.145,.35],[sign*.03,.14]],.027,obsidian,.073);sweep(lower,[[sign*.012,-.05,.109],[sign*.14,.10,.113],[sign*.205,.29,.106]],.0034);sweep(lower,[[sign*.04,-.03,-.072],[sign*.11,.17,-.072],[sign*.17,.31,-.072]],.0034);}
 // Fitted high collar rises around the closed helmet; three-quarter rear seams remain legible.
 const neck=joint('neck',upper,0,.29,0);loft(neck,[[-.07,.094,.075],[.015,.116,.105],[.05,.109,.10]],obsidian);sweep(neck,Array.from({length:21},(_,i)=>{const a=i/20*Math.PI*2;return[Math.sin(a)*.11,.05,Math.cos(a)*.101];}),.0025);
 const head=joint('head',neck,0,.105,0);loft(head,[[-.105,.045,.052],[-.05,.093,.09],[.025,.104,.096],[.09,.089,.088],[.139,.042,.055],[.149,.002,.002]],recess,32);
 const mask=joint('mask',head);const maskPos=[],maskIx=[],rows=22,cols=28;
 for(let j=0;j<=rows;j++){const t=j/rows,y=-.119+t*.266;const silhouette=Math.sin(Math.PI*t)**.53;const width=(.069+.041*t)*silhouette;for(let i=0;i<=cols;i++){const u=i/cols*2-1;const z=.040+.078*Math.sqrt(Math.max(0,1-u*u))*(.82+.18*Math.sin(t*Math.PI))+.020*(1-t);maskPos.push(width*u,y,z);}}
 for(let j=0;j<rows;j++)for(let i=0;i<cols;i++){const k=j*(cols+1)+i;maskIx.push(k,k+1,k+cols+1,k+1,k+cols+2,k+cols+1);}const maskGeo=new THREE.BufferGeometry();maskGeo.setAttribute('position',new THREE.Float32BufferAttribute(maskPos,3));maskGeo.setIndex(maskIx);maskGeo.computeVertexNormals();add(maskGeo,ivory,mask);
 for(const sign of [-1,1]){
  plate(mask,[[sign*.024,.033],[sign*.078,.053],[sign*.068,.025],[sign*.043,.009]],.004,recess,.114);
  plate(mask,[[sign*.034,.030],[sign*.068,.042],[sign*.058,.025],[sign*.043,.019]],.002,cyan,.120);
  sweep(mask,[[sign*.08,.08,.077],[sign*.084,.034,.092],[sign*.057,-.029,.106],[sign*.030,-.104,.092]],.0018,recess);
  const ear=joint(sign<0?'leftTemple':'rightTemple',head,sign*.103,.024,-.004);const ring=add(new THREE.TorusGeometry(.047,.006,5,24),bronze,ear);ring.rotation.y=Math.PI/2;const inset=add(new THREE.SphereGeometry(.037,12,8),obsidian,ear);inset.scale.x=.24;
 }
 sweep(mask,[[0,.147,.067],[0,.100,.111],[0,.01,.126],[0,-.11,.084]],.0011,bronze);
 for(const [side,sign]of [['left',-1],['right',1]]){
  const shoulder=joint(side+'Shoulder',upper,sign*.213,.199,0),arm=joint(side+'UpperArm',shoulder);
  const pauldron=joint(side==='left'?'shoulderPanel':'rightShoulderPanel',shoulder);plate(pauldron,[[-.061,.014],[0,.067],[.068,.009],[.07,-.082],[0,-.117],[-.06,-.066]],.10,obsidian,-.055);sweep(pauldron,[[-.061,.014,.05],[0,.067,.055],[.068,.009,.054],[0,-.117,.048]],.003);loft(arm,[[-.04,.052,.05],[-.15,.046,.039],[-.268,.039,.032]],lining,12);
  const forearm=joint(side+'Forearm',arm,0,-.267,0);loft(forearm,[[0,.047,.047],[-.045,.060,.047],[-.16,.043,.034],[-.255,.034,.029]],obsidian,16);
  plate(forearm,[[-.055,-.035],[0,.009],[.052,-.035],[.025,-.238],[-.024,-.238]],.016,obsidian,.039);sweep(forearm,[[-.052,-.04,.06],[0,-.005,.064],[.045,-.035,.059],[.025,-.24,.049]],.0025);
  const hand=joint(side+'Hand',forearm,0,-.258,0);plate(hand,[[-.034,0],[.032,0],[.037,-.062],[.021,-.083],[-.032,-.077]],.025,obsidian,-.012);
  for(let f=0;f<4;f++){const finger=joint(side+'Finger'+f,hand,-.026+f*.017,-.069,.006);loft(finger,[[0,.009,.01],[-.026,.008,.009,0,.006],[-.047-(f===1?.007:0),.006,.008,0,.015],[-.057,.002,.003,0,.015]],obsidian,8);if(side==='left')sweep(finger,[[0,0,.015],[0,-.026,.019],[0,-.049,.024]],.0018,cyan);}
  const thumb=joint(side+'Thumb',hand,sign*.038,-.025,.002);thumb.rotation.z=sign*.45;loft(thumb,[[0,.010,.011],[-.042,.007,.008]],obsidian,8);
  if(side==='left'){const core=joint('gloveCore',forearm,0,-.125,.062);plate(core,[[-.014,.085],[.014,.085],[.009,-.08],[-.009,-.08]],.008,cyan);const glow=joint('gloveLight',hand);sweep(glow,[[0,-.009,.025],[0,-.065,.029]],.004,cyan);const ring=joint('gloveRing',forearm,0,-.242,0);const tor=add(new THREE.TorusGeometry(.038,.004,5,24),cyan,ring);tor.rotation.x=Math.PI/2;}
  const hip=joint(side+'Hip',pelvis,sign*.09,-.035,0),thigh=joint(side+'Thigh',hip);loft(thigh,[[0,.085,.076],[-.13,.079,.068],[-.29,.056,.051],[-.415,.046,.046]],lining,18);
  const shin=joint(side+'Shin',thigh,0,-.415,0);loft(shin,[[0,.047,.044],[-.07,.059,.047],[-.22,.045,.037],[-.405,.029,.034]],obsidian,18);
  plate(shin,[[-.044,-.012],[0,.027],[.044,-.01],[.032,-.21],[0,-.3],[-.024,-.20]],.014,obsidian,.038);sweep(shin,[[0,.025,.061],[.044,-.01,.061],[.032,-.21,.056],[0,-.29,.05]],.0025);
  const foot=joint(side+'Foot',shin,0,-.409,.011);const shoe=plate(foot,[[-.046,0],[-.048,.045],[-.035,.088],[.031,.088],[.048,.045],[.044,0]],.145,obsidian,-.035);shoe.rotation.x=-.04;const heel=add(new THREE.BoxGeometry(.055,.038,.046),obsidian,foot,0,.016,-.04);sweep(foot,[[-.045,.016,.105],[0,.008,.126],[.045,.016,.105]],.0022);
 }
 for(const [name,sign]of [['coatLeft',-1],['coatRight',1]]){const g=joint(name,pelvis,sign*.14,0,0);const m=plate(g,[[sign*-.04,.025],[sign*.067,-.05],[sign*.19,-.8],[sign*-.10,-.84]],.02,obsidian,-.035);m.rotation.y=sign*-.33;sweep(g,[[sign*.067,-.05,0],[sign*.19,-.8,0],[sign*-.10,-.84,0]],.003);}coatPanel('coatBack',pelvis,1.7,4.58,.17,.85);
 root.userData.joints=joints;root.userData.parts=joints;root.userData.height=1.8;root.userData.construction='Beveled tailored shell profiles with overlapping sculpted lapels and separate skirt plates';
 // Exact vertex bounds account for all bevels; uniform scale preserves proportions.
 root.updateMatrixWorld(true);const box=new THREE.Box3(),v=new THREE.Vector3();root.traverse(o=>{if(o.isMesh){const p=o.geometry.attributes.position;for(let i=0;i<p.count;i++)box.expandByPoint(v.fromBufferAttribute(p,i).applyMatrix4(o.matrixWorld));}});const c=box.getCenter(new THREE.Vector3()),scale=1.8/(box.max.y-box.min.y);for(const child of root.children){child.position.x-=c.x;child.position.y-=box.min.y;child.position.z-=c.z;}root.scale.setScalar(scale);return root;
}
