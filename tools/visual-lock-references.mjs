// Server-side production tool. Documented schemas verified 2026-09-24.
import fs from 'node:fs/promises';
import {environment,requireKeys,request,requestJSON,apiURL,httpsURL,sleep,json,sha,cliError} from './art-pipeline/common.mjs';
const env=await environment(); requireKeys(env,['HF_API_KEY_ID','HF_API_KEY_SECRET']);
const headers={'Authorization':`Key ${env.HF_API_KEY_ID}:${env.HF_API_KEY_SECRET}`,'Content-Type':'application/json'};
const base='https://api.higgsfield.ai';
function pollURL(value){const u=httpsURL(value);if(!['api.higgsfield.ai','platform.higgsfield.ai'].includes(u.hostname))throw Error('Untrusted polling origin');return apiURL(value,u.hostname);}
const dir='production/visual-lock/references';
await fs.mkdir(dir,{recursive:true});
async function upload(bytes,type){
 const u=await requestJSON(base+'/files/generate-upload-url',{method:'POST',headers,body:JSON.stringify({content_type:type})});
 await request(httpsURL(u.upload_url).href,{method:'PUT',headers:u.upload_headers,body:bytes});
 return httpsURL(u.public_url).href;
}
async function generate(name,model,input){
 const file=`${dir}/${name}.json`;
 let receipt; try{receipt=JSON.parse(await fs.readFile(file,'utf8'));}catch{}
 if(receipt?.local)return receipt;
 if(!receipt){
  const estimate=await requestJSON(base+'/estimate/'+model,{method:'POST',headers,body:JSON.stringify(input)});
  const job=await requestJSON(base+'/'+model,{method:'POST',headers,body:JSON.stringify(input)});
  receipt={name,model,input,estimate,job,date:new Date().toISOString()}; await json(file,receipt,env);
  console.log(name,'accepted',job.request_id);
 }
 let status=receipt.job;
 for(let n=0;n<180&&!['completed','failed','nsfw','canceled'].includes(status.status);n++){
  await sleep(5000); status=await requestJSON(pollURL(receipt.job.status_url),{headers});
 }
 if(status.status!=='completed'){receipt.status=status;await json(file,receipt,env);throw Error('Generation not completed: '+name);}
 if(!status.images&&!status.video&&status.response_url)status=await requestJSON(pollURL(status.response_url),{headers});
 const remote=status.images?.[0]?.url||status.video?.url;
 if(!remote)throw Error('Completed response has no media: '+name);
 const response=await request(httpsURL(remote).href); const bytes=Buffer.from(await response.arrayBuffer());
 const ext=status.video?'mp4':(response.headers.get('content-type')?.includes('png')?'png':'jpg');
 receipt.local=`${dir}/${name}.${ext}`; receipt.sha256=sha(bytes);receipt.status='completed';receipt.remote=remote;
 await fs.writeFile(receipt.local,bytes);await json(file,receipt,env);console.log(name,'saved',bytes.length);return receipt;
}
try{
 const u=JSON.parse(await fs.readFile('production/higgsfield/source-upload.json','utf8')).url;
 const style='Original CTRL//REALITY impossible archive from supplied concept. Obsidian polished black glass, warm ivory ceramic, thin champagne bronze structural lines and restrained cyan interface light. No green, no violet, no saturated blue, no text or UI, no characters, no weapons, no watermark. ';
 const assets=[
 ['archive-matte', 'Create a single cinematic architectural matte painting, monumental depth, not a collage: enormous bronze orrery offset to the upper RIGHT, distant intricate ivory spires and suspended broken vaults at multiple depths, glowing warm opening overhead, fine ivory ribs and obsidian surfaces. A deep archive canyon, elegant and realistic. Lower quarter opens to atmospheric warm-gray void, no playable floor in foreground. Composition asymmetrical, destination to right; no centered corridor or parallel rows of pillars. Camera shoulder-high on an imaginary near ledge, 52mm-like perspective. Intricate premium game environment lighting and detailed reflections. This will be a distant non-interactive backdrop behind real 3D platforms.'],
 ['archive-depth','Single distant layer of suspended impossibly detailed ivory architectural fragments, bronze suspension rings and obsidian spires, warm directional sun edges, softly hazed neutral dark charcoal sky. Asymmetric grouping along RIGHT edge and top, open soft hazy center, immense scale. No foreground floor, no character, no person, no text. Useful as a far background card.'],
 ['archive-arch','ONE isolated monumental pointed ivory ceramic ARCH, curving tapering ribs, obsidian recessed panel insets, narrow warm bronze inset seams, layered cornice and open pointed arch opening, elegant asymmetrical chipped outer edge. Three-quarter view showing depth and buttressed plinths. Full object fits frame, plain neutral warm gray background, evenly lit.'],
 ['floor-ledge','ONE isolated polished obsidian architectural LEDGE, gently curved clipped perimeter, several broad inlaid floor panels and delicate radial engraving, slim bronze perimeter seam, substantial ivory corbel buttresses and suspended structural ribs beneath, believable designed architecture not a flat slab. Three-quarter overhead view, plain neutral warm gray background, evenly lit.'],
 ['socket-pedestal','ONE isolated interface socket PEDESTAL, 1.05 meter tall, ivory tapered sculptural ceramic body like an opened split petal, narrow bronze mechanical gimbal embracing a recessed dark cyan glass rectangular receptacle tilted toward the user. Delicate seams, stepped circular foot integrated into body, no floating diamond or text. Full three-quarter studio view, warm gray background.'],
 ['bridge-segment','ONE isolated floating archive BRIDGE SEGMENT, wide and short, obsidian glass walking surface, two warm ivory curved structural ribs below, narrow liquid bronze channels curling along the side and underside, tiny cyan edge channels; substantive elegant depth, supported cantilever architecture, not a ladder or slab. Full three-quarter studio view, warm gray background.'],
 ['kernel-assembly','ONE isolated monumental Reality Kernel mechanism: nested enormous thin champagne-bronze rings with ivory ceramic arc counterweights, a small luminous pearl-white energy core and fine mechanical ribs; asymmetrical intersecting orbital planes, elegant precision, restrained cyan channels. Full three-quarter studio view on warm gray background.'],
 ['broken-fragment','ONE isolated broken floating ivory architectural voussoir, sculpted curving vault rib section with chipped ceramic ends, thin bronze internal seam and dark obsidian inset, substantial interesting asymmetric shape. Full three-quarter studio view warm gray background.'],
 ['bronze-trim','ONE isolated long curved liquid-bronze structural seam module with finely machined stepped profile, ivory attachment knuckles at each end, narrow cyan light-carrying recessed channel. Not broad yellow paint. Full three-quarter studio view warm gray background.'],
 ['archive-mechanism','ONE isolated decorative archive mechanism, ivory ceramic cage cradling bronze rotating counterweight arcs and thin radial fins, mounted on an obsidian sculpted base, elegant clockwork without numbers or text. Full three-quarter studio view warm gray background.'],
 ['foreground-frame','ONE isolated dramatic broken half-arch of ivory ceramic, thick curving irregular rib with detailed bronze seam and black glass inlays, chipped ends exposing dark core, substantial three dimensional side structure. Full object visible in three-quarter studio view warm gray background.'],
 ['card-housing','ONE isolated thin physical interface card housing, small obsidian glass rectangle with softly clipped corners, ivory rear ceramic spine, fine bronze structural frame, cyan inset center showing abstract radial sun geometry only, no letters or words. Full three-quarter studio view warm gray background.']];
 for(const [name,prompt]of assets)await generate(name,'xai/grok-imagine-image-2.0',{image_urls:[u],quality:'medium',resolution:name.startsWith('archive-')&&['archive-matte','archive-depth'].includes(name)?'2k':'1k',aspect_ratio:name==='archive-matte'||name==='archive-depth'?'16:9':'1:1',prompt:style+prompt});
}catch(e){cliError(e);}
