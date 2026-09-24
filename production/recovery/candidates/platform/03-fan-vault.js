export default function generate(THREE){
const g=new THREE.Group();const stone=new THREE.MeshStandardMaterial({color:0x88857b,roughness:.8,metalness:.08}),dark=new THREE.MeshStandardMaterial({color:0x24282b,roughness:.65,metalness:.28}),bronze=new THREE.MeshStandardMaterial({color:0x9e8157,roughness:.47,metalness:.7});stone.name='stone';dark.name=bronze.name='metal';
function mesh(geo,mat,x=0,y=0,z=0){const m=new THREE.Mesh(geo,mat);m.position.set(x,y,z);m.receiveShadow=m.castShadow=true;g.add(m);return m;}
function slab(points,depth,y,mat){const s=new THREE.Shape();points.forEach(([x,z],i)=>i?s.lineTo(x,z):s.moveTo(x,z));s.closePath();const m=mesh(new THREE.ExtrudeGeometry(s,{depth,bevelEnabled:true,bevelSize:.025,bevelThickness:.025,bevelSegments:2}),mat,0,y,0);m.rotation.x=-Math.PI/2;return m;}
function line(points,r=.007,mat=bronze){const curve=new THREE.CatmullRomCurve3(points.map(p=>new THREE.Vector3(...p)));return mesh(new THREE.TubeGeometry(curve,points.length*3,r,5,false),mat);}
for(let i=0;i<12;i++){const a=i*Math.PI/6,b=(i+1)*Math.PI/6;slab([[0,0],[Math.cos(a)*4.3,Math.sin(a)*5],[Math.cos(b)*4.3,Math.sin(b)*5]],.2,1.83,dark);}slab([[-3.6,-3.5],[3.6,-3.5],[4.25,0],[3.6,3.5],[-3.6,3.5],[-4.25,0]],.24,1.54,stone);
// Restrained, engraved archive dial. No crossing random spokes.
for(const radius of [1.18,1.24,2.22]){const m=mesh(new THREE.TorusGeometry(radius,.006,4,96),bronze,0,2.052,.3);m.rotation.x=Math.PI/2;}
for(let i=0;i<12;i++){const a=i*Math.PI/6;line([[Math.cos(a)*1.28,2.053,.3+Math.sin(a)*1.28],[Math.cos(a)*1.45,2.053,.3+Math.sin(a)*1.45]],.006);}
for(const z of [-2.1,2.5])line([[-3.7,2.052,z],[3.7,2.052,z]],.006,dark);
for(const x of [-3.45,3.45]){line([[x,2.051,-4],[x,2.051,4]],.008);const s=new THREE.Shape();s.moveTo(-3.8,1.7);s.lineTo(3.8,1.7);s.lineTo(3.1,0);s.lineTo(2.5,0);s.quadraticCurveTo(0,1.2,-2.5,0);s.lineTo(-3.1,0);s.closePath();const m=mesh(new THREE.ExtrudeGeometry(s,{depth:.27,bevelEnabled:false}),stone,x,0,0);m.rotation.y=Math.PI/2;}
g.userData.family='recovery-platform';g.userData.height=2.08;return g;}
