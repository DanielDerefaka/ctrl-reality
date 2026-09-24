// Server-side production tool. Documented schemas verified 2026-09-24.
import fs from 'node:fs/promises';
import {environment,requireKeys,request,requestJSON,apiURL,httpsURL,sleep,json,sha,cliError} from './art-pipeline/common.mjs';
const env=await environment(); requireKeys(env,['HF_API_KEY_ID','HF_API_KEY_SECRET']);
const headers={'Authorization':`Key ${env.HF_API_KEY_ID}:${env.HF_API_KEY_SECRET}`,'Content-Type':'application/json'};
const base='https://api.higgsfield.ai';
function pollURL(value){const u=httpsURL(value);if(!['api.higgsfield.ai','platform.higgsfield.ai'].includes(u.hostname))throw Error('Untrusted polling origin');return apiURL(value,u.hostname);}
const dir='production/higgsfield';
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
 let u;try{u=JSON.parse(await fs.readFile(`${dir}/source-upload.json`,'utf8')).url;}catch{
  u=await upload(await fs.readFile('production/references/ctrl-reality-concept.png'),'image/png');await json(`${dir}/source-upload.json`,{url:u},env);
 }
 const identity='Preserve EXACTLY the masked female interface conservator Mara shown in the reference board: slim elegant adult proportions, closed ivory ceramic mask with tiny cyan eye slits, no face or hair, black obsidian articulated long coat with fine champagne bronze seams, fitted waist and armored shoulder panels, black fitted trousers and elegant boots, luminous cyan LEFT glove. No weapon. No other character. Original game CTRL//REALITY. Realistic premium cinematic game key art. Never reproduce any text, UI, collage panels, labels, borders or watermark from the source. ';
 const poster=await generate('title-keyframe','xai/grok-imagine-image-2.0',{image_urls:[u],quality:'medium',resolution:'2k',aspect_ratio:'16:9',prompt:identity+'Create ONE clean cinematic frame, not a board. Rear three-quarter full-body Mara at center-right, 55 percent of image height. Monumental impossible archive of obsidian glass, ivory vaulting, liquid bronze rings and suspended architectural fragments, dark reflective floor with restrained warm sunlight. Vast glowing reality kernel far away. Leave LEFT 45 percent very dark and visually quiet for separately rendered menu. Strong silhouette, intricate costume, physically coherent reflections. No text whatsoever.'});
 const moviePrompt=identity+'Six-second seamless cinematic title loop. Very slow controlled push forward. Mara takes one slow deliberate step, cyan glove gradually illuminates and pulses; small head turn toward distant kernel, rigid coat panels subtly settle. Floating architecture almost still, huge distant rings rotate slowly, one far bridge flickers into existence. End pose lighting and composition closely match first frame for seamless loop. No shake, cuts, fast movement, extra limbs, environment morph, text, UI or audio.';
 await generate('title-cinematic/mara-title-loop','kling-video/v3.0/std/image-to-video',{image_url:poster.remote,last_image_url:poster.remote,prompt:moviePrompt,sound:'off',duration:6,multi_shots:false,cfg_scale:0.5});
 const views=[['mara-front','three-quarter front full body'],['mara-back','three-quarter rear full body'],['mara-left','exact left profile full body'],['mara-right','exact right profile full body'],['mara-mask','close-up of ceramic mask and shoulders'],['mara-glove','close-up of luminous LEFT glove showing five anatomically correct fingers'],['mara-neutral','front full body neutral relaxed rigging reference pose'],['mara-gameplay','rear three-quarter full body poised to reach with left cyan glove toward a socket']];
 for(const [name,view]of views) await generate(name,'xai/grok-imagine-image-2.0',{image_urls:[u],quality:'medium',resolution:'1k',aspect_ratio:'2:3',prompt:identity+'ONE isolated reference image: '+view+'. Plain dark gray studio background, soft even light, no floor reflections, no architecture, do not crop body or requested detail. Match original character geometry and costume exactly.'});
 await generate('animation-references/mara-entry','kling-video/v3.0/std/image-to-video',{image_url:poster.remote,prompt:identity+'Six seconds motion study: poised stillness, one controlled left glove raise, cyan activation, then two measured forward steps and settle into still gameplay stance. Rear three-quarter full body, steady camera, physically plausible weight shift and rigid coat panel secondary motion. No text, cuts, face exposure, weapons or audio.',sound:'off',duration:6,multi_shots:false,cfg_scale:0.5});
}catch(e){cliError(e);}
