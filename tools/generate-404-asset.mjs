#!/usr/bin/env node
// Development-only RunPod client. Generated JavaScript is never imported by this tool.
import fs from 'node:fs/promises';
import path from 'node:path';
import { parseArgs } from 'node:util';
import { spawnSync } from 'node:child_process';
import { ROOT, fail, environment, requireKeys, apiURL, outputDirectory, json, requestJSON, request, sha, sanitize, isCLI, cliError } from './art-pipeline/common.mjs';
export const MODEL = 'Tooony133/Qwen-3.6-27B-AronHorn';
export const REQUIRED_GROUPS = ['maskShell','eyeLight','leftTempleJoint','rightTempleJoint'];
export function runpodBase(value) {
  const u = new URL(apiURL(value));
  if (!/^[a-z0-9-]+-8001\.proxy\.runpod\.net$/.test(u.hostname) || !/^\/v1\/?$/.test(u.pathname)) fail('INVALID_RUNPOD_ENDPOINT');
  return u.href.replace(/\/$/,'');
}
export async function streamCode(body, onChunk = async()=>{}) {
  const decoder = new TextDecoder(); let pending='', code='', done=false, finish=null;
  const consume = async event => {
    const data = event.split('\n').filter(line=>line.startsWith('data:')).map(line=>line.slice(5).trimStart()).join('\n');
    if (!data) return;
    if (data === '[DONE]') { done=true; return; }
    let msg; try { msg=JSON.parse(data); } catch { fail('INVALID_STREAM_JSON'); }
    if (msg.error) fail('MODEL_STREAM_ERROR');
    const choice=msg.choices?.[0];
    if (choice?.finish_reason) finish=choice.finish_reason;
    const part=choice?.delta?.content;
    if (typeof part === 'string') {
      code+=part;
      if (Buffer.byteLength(code)>2*1024*1024) fail('GENERATED_CODE_TOO_LARGE');
      await onChunk(part);
    }
  };
  for await (const chunk of body) {
    pending+=decoder.decode(chunk,{stream:true});
    // Handle CRLF delimiters even when \r and \n arrive in separate network chunks.
    let match;
    while ((match=/\r?\n\r?\n/.exec(pending))) {
      const event=pending.slice(0,match.index).replace(/\r\n/g,'\n');
      pending=pending.slice(match.index+match[0].length); await consume(event);
    }
    if (pending.length>2*1024*1024) fail('STREAM_EVENT_TOO_LARGE');
  }
  pending+=decoder.decode(); if(pending.trim()) await consume(pending.replace(/\r\n/g,'\n'));
  if (!done || finish !== 'stop' || !code.trim()) fail('INCOMPLETE_MODEL_STREAM');
  return code;
}
export function prepareCode(raw) {
  let code=raw.trim();
  if (code.startsWith('```')) {
    const match=/^```(?:javascript|js)?\s*\n([\s\S]*?)\n```$/.exec(code);
    if (!match) fail('INVALID_CODE_FENCE'); code=match[1];
  }
  // Early contract lint only, NOT a sandbox or full security proof. Execution belongs to official verify.mjs.
  if ((code.match(/\bexport\b/g)||[]).length!==1 || !/export\s+default\s+function\b/.test(code)) fail('ASSET_EXPORT_CONTRACT');
  if (/\b(?:import|require|fetch|XMLHttpRequest|WebSocket|eval|Function|setTimeout|setInterval|requestAnimationFrame|process|globalThis|window|document)\b/.test(code) || /data:|base64/i.test(code)) fail('ASSET_FORBIDDEN_API');
  const internal=code.replace(/export\s+default\s+function/, 'const buildCandidate = function');
  // Group validation executes inside the official browser verifier, not in this Node process.
  return `${internal}\n\n// Local hierarchy assertions; executed only by the official verifier.\nexport default function generate(THREE) {\n  const group = buildCandidate(THREE);\n  if (!group?.isGroup) throw new Error('NYRA_MASK must return a THREE.Group');\n  for (const name of ${JSON.stringify(REQUIRED_GROUPS)}) {\n    if (!group.getObjectByName(name)?.isGroup) throw new Error('Missing named group: ' + name);\n  }\n  return group;\n}\n`;
}
export function verificationCommand(recipe, directory) {
  return [path.join(recipe,'harness/verify.mjs'),directory,'--size=560'];
}
export function cleanChildEnvironment(env) {
  // Do not inherit API credentials into the wrapper, verifier or its Chromium children.
  return Object.fromEntries(['PATH','HOME','TMPDIR','TEMP','TMP','SYSTEMROOT','SystemRoot'].filter(k=>env[k]).map(k=>[k,env[k]]));
}
async function runOfficial(args, cwd, logPath, env) {
  const r=spawnSync(process.execPath,args,{cwd,env:cleanChildEnvironment(env),encoding:'utf8',timeout:15*60*1000,maxBuffer:10*1024*1024});
  await fs.writeFile(logPath,sanitize((r.stdout||'')+(r.stderr||'')+`\nEXIT_CODE=${r.status}\n`,env));
  return r.status ?? -1;
}
export async function run(options, deps={}) {
  const env=deps.env || await environment(); requireKeys(env,['RUNPOD_404_BASE_URL','VLLM_API_KEY']);
  const base=runpodBase(env.RUNPOD_404_BASE_URL), recipe=path.resolve(ROOT,options.recipe || '../404-game-recipe');
  const recipeSHA=spawnSync('git',['rev-parse','HEAD'],{cwd:recipe,encoding:'utf8'});
  if(recipeSHA.status!==0) fail('RECIPE_NOT_FOUND');
  await fs.access(path.join(recipe,'harness/wrap.mjs')); await fs.access(path.join(recipe,'harness/verify.mjs'));
  const contract=await fs.readFile(path.join(recipe,'docs/asset-contract.md'),'utf8');
  const referencePath=path.resolve(ROOT,options.reference);
  const reference=await fs.readFile(referencePath);
  if(reference.length>20*1024*1024) fail('REFERENCE_TOO_LARGE');
  const type=reference.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10]))?'image/png':reference[0]===255&&reference[1]===216?'image/jpeg':reference.toString('ascii',0,4)==='RIFF'&&reference.toString('ascii',8,12)==='WEBP'?'image/webp':null;
  if(!type) fail('INVALID_REFERENCE_IMAGE');
  const model=options.model || MODEL;
  const headers={Authorization:`Bearer ${env.VLLM_API_KEY}`,'Content-Type':'application/json'};
  const models=await requestJSON(base+'/models',{headers},deps.fetcher);
  if(!models.data?.some(m=>m.id===model)) fail('MODEL_NOT_SERVED','Requested model ID not returned by RunPod /v1/models; verify the deployed model.');
  const out=await outputDirectory(options.out,options.overwrite);
  const rawDir=path.join(out,'raw'),preparedDir=path.join(out,'prepared'),wrappedDir=path.join(out,'wrapped');
  for(const dir of [rawDir,preparedDir,wrappedDir])await fs.mkdir(dir);
  const prompt=`Write a Three.js module reproducing this reference as export default function generate(THREE). Code only. NYRA_MASK: original ivory ceramic chrono-thief mask, Art Deco faceted cheeks, narrow cyan eye line, champagne-gold temple joints, no mouth opening, logo or text. No person or extra objects. Front faces +Z. Return THREE.Group with named child Groups maskShell, eyeLight, leftTempleJoint, rightTempleJoint, appropriate temple pivots and userData.parts references. Independent new construction, not an edit of another candidate. Use MeshStandardMaterial and procedural Three.js geometry only. No mesh data blobs, imports, network, timers, textures or external files. Normalize geometry inside [-0.5,0.5]; the official wrapper sets real height to 0.24m and grounds it. Follow this contract except unit-cube scale/origin are converted by that wrapper:\n${contract}`;
  const receipt={provider:'RunPod-hosted 404 open model',asset:'NYRA_MASK',model,temperature:.6,heightMetres:.24,reference:{path:path.relative(ROOT,referencePath),sha256:sha(reference)},prompt,recipeCommit:recipeSHA.stdout.trim(),startedAt:new Date().toISOString(),candidates:[],selectedCandidate:null,userApproval:'required',status:'generating'};
  const save=()=>json(path.join(out,'receipt.json'),receipt,env);await save();
  // Three separate streamed requests. No candidate source is fed into another candidate.
  for(let i=1;i<=3;i++){
    const name=`NYRA_MASK_${String(i).padStart(2,'0')}`,start=Date.now();
    const entry={name,status:'pending',raw:`raw/${name}.txt`};receipt.candidates.push(entry);await save();
    const rawFile=path.join(rawDir,`${name}.txt`);await fs.writeFile(rawFile,'',{flag:'wx'});
    try{
      const response=await request(base+'/chat/completions',{method:'POST',headers,signal:AbortSignal.timeout(15*60*1000),body:JSON.stringify({model,temperature:.6,stream:true,max_tokens:16384,messages:[{role:'user',content:[{type:'text',text:prompt},{type:'image_url',image_url:{url:`data:${type};base64,${reference.toString('base64')}`}}]}]})},deps.fetcher);
      if(!response.headers.get('content-type')?.includes('text/event-stream'))fail('EXPECTED_EVENT_STREAM');
      const raw=await streamCode(response.body,part=>fs.appendFile(rawFile,sanitize(part,env)));
      entry.generationMs=Date.now()-start;
      entry.rawSha256=sha(raw);const prepared=path.join(preparedDir,`${name}.js`);
      await fs.writeFile(prepared,prepareCode(raw),{flag:'wx'});
      entry.wrapExit=await runOfficial([path.join(recipe,'harness/wrap.mjs'),prepared,'0.24','-o',path.join(wrappedDir,`${name}.js`)],recipe,path.join(out,`${name}-wrap.txt`),env);
      if(entry.wrapExit!==0)fail('OFFICIAL_WRAP_FAILED');
      await json(path.join(wrappedDir,`${name}.expect.json`),{height:.24,tolerance:.02});
      entry.status='wrapped';entry.path=`wrapped/${name}.js`;
    }catch(e){entry.status='failed';entry.failureCode=e.code||'LOCAL_FAILURE';}
    entry.totalProcessingMs=Date.now()-start;await save();
  }
  if(receipt.candidates.some(c=>c.status==='wrapped')){
    receipt.verifierExit=await runOfficial(verificationCommand(recipe,wrappedDir),recipe,path.join(out,'verify-output.txt'),env);
    try {receipt.measurements=JSON.parse(await fs.readFile(path.join(wrappedDir,'_verify/report.json'),'utf8'));}catch{receipt.verificationReportMissing=true;}
    receipt.verificationSheet=await fs.access(path.join(wrappedDir,'_verify/sheet.png')).then(()=> 'wrapped/_verify/sheet.png',()=>null);
  }
  receipt.finishedAt=new Date().toISOString();
  receipt.status=receipt.candidates.every(c=>c.status==='wrapped') && receipt.verifierExit===0 && receipt.measurements?.length===3 && receipt.measurements.every(m=>m.ok) && receipt.verificationSheet ? 'awaiting_visual_review_and_user_approval' : 'incomplete_or_verification_failed';
  await save();
  if(receipt.status!=='awaiting_visual_review_and_user_approval')fail('ASSET_PROOF_INCOMPLETE','Inspect preserved candidate and verifier receipts; no asset selected or integrated.');
  return receipt;
}
if(isCLI(import.meta.url)){
 try{
  const {values}=parseArgs({options:{reference:{type:'string'},out:{type:'string',default:'production/asset-receipts/NYRA_MASK/candidates'},recipe:{type:'string'},model:{type:'string'},overwrite:{type:'boolean'},help:{type:'boolean'}}});
  if(values.help)console.log('node tools/generate-404-asset.mjs --reference <local-image> [--recipe ../404-game-recipe] [--model exact-served-id] [--out production/path] [--overwrite]\nThree streamed independent candidates, 0.24m official wrap + verifier. No automatic selection or game integration.');
  else {if(!values.reference)fail('REFERENCE_REQUIRED','Supply --reference with the actual completed Higgsfield image.');await run(values);console.log('Three candidates verified. Stop for visual review and user approval; none integrated.');}
 }catch(e){cliError(e);}
}
