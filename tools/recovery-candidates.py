from pathlib import Path
import runpy,json
v=runpy.run_path('production/asset-receipts/authoring/mara-candidates.py')
root=Path('production/recovery/candidates/mara');root.mkdir(parents=True,exist_ok=True)
for name,label,torso,arm,coat in v['variants']:
 s=v['common'].replace('/* TORSO_CONSTRUCTION */',torso).replace('/* ARM_CONSTRUCTION */',arm).replace('/* COAT_CONSTRUCTION */',coat).replace('CONSTRUCTION_NAME','Recovery: '+label).replace('const joints={maraRoot:root}','const joints={}')
 # A longer, fitted waist and overlapping angular shoulder shells, no ball joints.
 s=s.replace('0x10151c,.48,.29','0x12171d,.45,.39').replace('0xc99a4a,.72,.29','0xbda06e,.72,.38').replace('0xe7e1d5,.13,.33','0xd6ccba,.08,.42')
 s=s.replace('sign*.213,.199','sign*.203,.199').replace('.18,.825','.135,.78').replace('.205,.86','.16,.81')
 s=s.replace("const cap=add(new THREE.SphereGeometry(.077,20,10,0,Math.PI*2,0,Math.PI*.65),obsidian,shoulderPanel,0,-.005,0);cap.scale.set(1.12,.85,1.03);", "loft(shoulderPanel,[[.055,.014,.022],[.025,.065,.063],[-.008,.084,.061],[-.06,.065,.050],[-.095,.03,.027]],obsidian,24);")
 # More mask wrap at the temples but dark helmet at the rear, as in the approved profile.
 s=s.replace('const width=(.069+.041*t)*silhouette','const width=(.078+.036*t)*silhouette').replace('const z=.040+.078','const z=.025+.093')
 s=s.replace("root.userData.joints=joints;", """// The seam system is anatomical: shoulder blade, waist chevrons, glove rails.
 for(const sign of [-1,1]){
  sweep(lower,[[sign*.02,.31,-.080],[sign*.11,.25,-.113],[sign*.13,.17,-.097],[sign*.065,.035,-.087]],.0021);
  sweep(lower,[[sign*.03,.285,-.084],[sign*.11,.21,-.115],[sign*.08,.12,-.092]],.0015);
 }
 for(const name of ['coatLeft','coatRight','coatBack']){const panel=joints[name];if(panel){const sign=name==='coatLeft'?-1:1;sweep(panel,[[sign*.12,-.06,-.095],[sign*.155,-.31,-.15],[sign*.20,-.67,-.19]],.0018);}}
 const gauntlet=joints.leftForearm;
 for(const side of [-1,1])sweep(gauntlet,[[side*.023,-.03,.065],[side*.021,-.14,.056],[side*.014,-.232,.041]],.003,cyan);
 root.userData.joints=joints;""")
 (root/(name+'.js')).write_text(s);(root/(name+'.expect.json')).write_text(json.dumps({'height':1.8,'tolerance':.02}))
(root/'PROCESS.md').write_text('''# Mara recovery constructions\n\nClean references: production/higgsfield/mara-{front,back,left,right,mask,glove}.jpg, inspected alongside the supplied concept. Independent garment construction strategies share the same 1.8m articulated human proportions, mask and hands.\n\n01: curved continuous couture lofts and swept coat surfaces; 02: beveled tailored profile shells and overlapping lapels; 03: segmented cuirass and six overlapping meridian panels. Recovery refinements: sculpted shoulder silhouettes, narrower coat flare, mask temple wrap, dark rear helmet, dorsal seams and two cyan glove rails. No external meshes. No candidate chosen before multiview review.\n''')
# Three floor constructions; the chosen silhouette is also the collision footprint.
root=Path('production/recovery/candidates/platform');root.mkdir(parents=True,exist_ok=True)
common='''export default function generate(THREE){
const g=new THREE.Group();const stone=new THREE.MeshStandardMaterial({color:0x88857b,roughness:.8,metalness:.08}),dark=new THREE.MeshStandardMaterial({color:0x24282b,roughness:.65,metalness:.28}),bronze=new THREE.MeshStandardMaterial({color:0x9e8157,roughness:.47,metalness:.7});stone.name='stone';dark.name=bronze.name='metal';
function mesh(geo,mat,x=0,y=0,z=0){const m=new THREE.Mesh(geo,mat);m.position.set(x,y,z);m.receiveShadow=m.castShadow=true;g.add(m);return m;}
function slab(points,depth,y,mat){const s=new THREE.Shape();points.forEach(([x,z],i)=>i?s.lineTo(x,z):s.moveTo(x,z));s.closePath();const m=mesh(new THREE.ExtrudeGeometry(s,{depth,bevelEnabled:true,bevelSize:.025,bevelThickness:.025,bevelSegments:2}),mat,0,y,0);m.rotation.x=-Math.PI/2;return m;}
function line(points,r=.007,mat=bronze){const curve=new THREE.CatmullRomCurve3(points.map(p=>new THREE.Vector3(...p)));return mesh(new THREE.TubeGeometry(curve,points.length*3,r,5,false),mat);}
/*STRUCTURE*/
// Restrained, engraved archive dial. No crossing random spokes.
for(const radius of [1.18,1.24,2.22]){const m=mesh(new THREE.TorusGeometry(radius,.006,4,96),bronze,0,2.052,.3);m.rotation.x=Math.PI/2;}
for(let i=0;i<12;i++){const a=i*Math.PI/6;line([[Math.cos(a)*1.28,2.053,.3+Math.sin(a)*1.28],[Math.cos(a)*1.45,2.053,.3+Math.sin(a)*1.45]],.006);}
for(const z of [-2.1,2.5])line([[-3.7,2.052,z],[3.7,2.052,z]],.006,dark);
for(const x of [-3.45,3.45]){line([[x,2.051,-4],[x,2.051,4]],.008);const s=new THREE.Shape();s.moveTo(-3.8,1.7);s.lineTo(3.8,1.7);s.lineTo(3.1,0);s.lineTo(2.5,0);s.quadraticCurveTo(0,1.2,-2.5,0);s.lineTo(-3.1,0);s.closePath();const m=mesh(new THREE.ExtrudeGeometry(s,{depth:.27,bevelEnabled:false}),stone,x,0,0);m.rotation.y=Math.PI/2;}
g.userData.family='recovery-platform';g.userData.height=2.08;return g;}
'''
variants=[('01-chamfered-corbel',"const outline=[[-4.25,-4.4],[-3.7,-5],[3.7,-5],[4.25,-4.4],[4.25,4.4],[3.7,5],[-3.7,5],[-4.25,4.4]];slab(outline,.18,1.85,dark);slab(outline.map(([x,z])=>[x*1.012,z*1.012]),.08,1.72,bronze);slab(outline.map(([x,z])=>[x*1.02,z*1.02]),.22,1.47,stone);"),('02-separated-flags',"for(let j=0;j<5;j++)for(let i=0;i<4;i++){const x=-4.2+i*2.1,z=-5+j*2;slab([[x+.025,z+.025],[x+2.07,z+.025],[x+2.07,z+1.97],[x+.025,z+1.97]],.2,1.83,(i+j)%3?dark:stone);}slab([[-4.27,-5.05],[4.27,-5.05],[4.27,5.05],[-4.27,5.05]],.18,1.59,stone);"),('03-fan-vault',"for(let i=0;i<12;i++){const a=i*Math.PI/6,b=(i+1)*Math.PI/6;slab([[0,0],[Math.cos(a)*4.3,Math.sin(a)*5],[Math.cos(b)*4.3,Math.sin(b)*5]],.2,1.83,dark);}slab([[-3.6,-3.5],[3.6,-3.5],[4.25,0],[3.6,3.5],[-3.6,3.5],[-4.25,0]],.24,1.54,stone);")]
for name,code in variants:(root/(name+'.js')).write_text(common.replace('/*STRUCTURE*/',code))
(root/'PROCESS.md').write_text('# Compact platform candidates\nReference: production/visual-lock/references/floor-ledge.jpg. 01 extruded chamfered layered deck on corbels; 02 separated stone flags; 03 radial fan vault. Purposeful dial inlays replace sprawling intersecting lines. No textures or imported meshes.\n')
