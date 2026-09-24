// Server-side production tool. Documented schemas verified 2026-09-24.
import fs from 'node:fs/promises';
import {environment,requireKeys,request,requestJSON,apiURL,httpsURL,sleep,json,sha,cliError} from './art-pipeline/common.mjs';
const env=await environment(); requireKeys(env,['HF_API_KEY_ID','HF_API_KEY_SECRET']);
const headers={'Authorization':`Key ${env.HF_API_KEY_ID}:${env.HF_API_KEY_SECRET}`,'Content-Type':'application/json'};
const base='https://api.higgsfield.ai';
function pollURL(value){const u=httpsURL(value);if(!['api.higgsfield.ai','platform.higgsfield.ai'].includes(u.hostname))throw Error('Untrusted polling origin');return apiURL(value,u.hostname);}
const dir='production/recovery/higgsfield';
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
 const source=JSON.parse(await fs.readFile('production/higgsfield/source-upload.json','utf8')).url;
 const previous=JSON.parse(await fs.readFile('production/higgsfield/title-keyframe.json','utf8')).remote;
 const identity='Use the attached character reference EXACTLY. Mara is an elegant adult female masked interface conservator. Closed ivory ceramic mask, no face or hair, obsidian black segmented tailored long coat, fine champagne bronze seams, fitted waist, sculptural shoulders, long controlled panels, black boots and luminous cyan LEFT glove. No weapons or extra characters. No text, letters, logos, captions, interface or watermark. ';
 const desktop=await generate('desktop-master','marketing-studio/image',{image_urls:[previous,source],quality:'high',resolution:'4k',aspect_ratio:'16:9',enhance_prompt:false,prompt:identity+'Re-render the first image as one exceptionally sharp cinematic title-screen master. Preserve its rear three-quarter full-body Mara placement at 72 percent across and 54 percent image height. Leave left 45 percent almost black for separately composited interface. Monumental coherent archive architecture of aged ivory, obsidian and fine bronze, warm light from upper right, enormous distant bronze rings, dark rough polished floor. Refine true costume and architectural detail, realistic material roughness. Calm, premium and restrained. No collage. Full body including boots must be visible.'});
 const mobile=await generate('mobile-master','marketing-studio/image',{image_urls:[desktop.remote,source],quality:'high',resolution:'2k',aspect_ratio:'9:16',enhance_prompt:false,prompt:identity+'Recompose the first image into a vertical portrait title-screen. Full-body rear three-quarter Mara on the RIGHT third, from 29 percent to 76 percent image height, including boots. Quiet dark negative space on left half and top 20 percent for separately rendered menu. Exact same monumental archive, distant bronze rings and warm right-side light as first image. Delicate cyan glove glow. Character must not be cropped. No text or interface.'});
 await generate('desktop-loop-master','kling-video/v3.0/pro/image-to-video',{image_url:desktop.remote,last_image_url:desktop.remote,prompt:identity+'Six second seamless title-screen loop. Locked cinematic composition, almost imperceptible camera push returning smoothly to original position. Mara stays planted, one gentle breath, slight masked head turn toward distant Kernel, cyan glove slowly brightens then returns to its original intensity. Rigid coat panels settle naturally. Huge distant bronze rings turn very slowly. No morphing, no rapid motion, no camera shake, no text or audio. First and last pose and lighting match.',sound:'off',duration:6,multi_shots:false,cfg_scale:0.5});
}catch(e){cliError(e);}
