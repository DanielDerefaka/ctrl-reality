// Offline protocol fixtures only. These are NOT Higgsfield/404 generation receipts.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { ROOT, PipelineError, requireKeys, sanitize, outputDirectory, downloadImage, requestJSON } from '../tools/art-pipeline/common.mjs';
import { modelSpec, poll, run as runReference } from '../tools/higgsfield-reference.mjs';
import { runpodBase, streamCode, prepareCode, cleanChildEnvironment, verificationCommand } from '../tools/generate-404-asset.mjs';
const response = data => new Response(JSON.stringify(data),{headers:{'Content-Type':'application/json'}});
const spec={reviewed:true,model:'offline-fixture-only',documentationUrl:'https://console.higgsfield.ai/fixture',endpoint:'https://api.higgsfield.ai/fixture',body:{prompt:'{{PROMPT}}',nested:{prompt:'{{PROMPT}}'}}};
const error = code => e => e instanceof PipelineError && e.code===code;
const statusURL='https://api.higgsfield.ai/requests/offline-fixture/status';
const stream = content => new ReadableStream({start(controller){for(const byte of new TextEncoder().encode(content))controller.enqueue(Uint8Array.of(byte));controller.close();}});
const chunk = x => `data: ${JSON.stringify(x)}\r\n\r\n`;
test('credentials fail closed with names only',()=>{
 assert.throws(()=>requireKeys({HF_API_KEY_ID:'private'},['HF_API_KEY_ID','HF_API_KEY_SECRET']),error('MISSING_CREDENTIALS'));
 assert.throws(()=>requireKeys({VLLM_API_KEY:'your_key'},['VLLM_API_KEY']),error('MISSING_CREDENTIALS'));
});
test('receipt redaction removes secret values and nested credential fields',()=>{
 const clean=sanitize({prompt:'prefix-secret-suffix',nested:{Authorization:'Bearer x',token:'x'},normal:'safe'},{HF_API_KEY_SECRET:'secret'});
 assert.equal(clean.prompt,'prefix-[REDACTED]-suffix');assert.equal(clean.nested.Authorization,'[REDACTED]');assert.equal(clean.nested.token,'[REDACTED]');assert.equal(clean.normal,'safe');
});
test('Higgsfield model must be reviewed and cannot redirect credentials to another origin',()=>{
 assert.throws(()=>modelSpec({...spec,reviewed:false},'mask'),error('MODEL_DOCUMENTATION_REQUIRED'));
 assert.throws(()=>modelSpec({...spec,endpoint:'https://other.example/generate'},'mask'),error('UNTRUSTED_URL'));
 assert.throws(()=>modelSpec({...spec,endpoint:spec.endpoint+'?key=secret'},'mask'),error('QUERY_CREDENTIALS_FORBIDDEN'));
 const prompt='mask "ivory"\ncyan';assert.deepEqual(modelSpec(spec,prompt).body,{prompt,nested:{prompt}});
});
test('poll follows queued and in_progress to completed with capped backoff',async()=>{
 const waits=[],states=['queued','in_progress','queued','queued','queued','queued','completed'];let n=0;
 const result=await poll(statusURL,{}, {fetcher:async()=>response({status:states[n++],images:[{url:'https://media.example/mask.png'}]}),wait:async ms=>waits.push(ms)});
 assert.equal(result.status,'completed');assert.deepEqual(waits,[2000,3000,4500,6750,10000,10000]);
});
test('poll stops on failed, moderated, canceled and unknown states',async()=>{
 for(const status of ['failed','nsfw','canceled','surprise'])await assert.rejects(poll(statusURL,{}, {fetcher:async()=>response({status})}),error(status==='surprise'?'UNKNOWN_GENERATION_STATE':`GENERATION_${status.toUpperCase()}`));
});
test('poll retries transient failures but never retries authentication failure',async()=>{
 let calls=0;await poll(statusURL,{}, {fetcher:async()=>++calls===1?new Response('',{status:503}):response({status:'completed'}),wait:async()=>{}});assert.equal(calls,2);
 calls=0;await assert.rejects(poll(statusURL,{}, {fetcher:async()=>{calls++;return new Response('secret-body',{status:401});},wait:async()=>{}}),error('HTTP_401'));assert.equal(calls,1);
});
test('poll refuses cross-origin status URL before sending any credential',async()=>{
 let calls=0;await assert.rejects(poll('https://other.example/status',{Authorization:'private'},{fetcher:async()=>{calls++;}}),error('UNTRUSTED_URL'));assert.equal(calls,0);
});
test('poll has a bounded total wait',async()=>{
 let time=0;await assert.rejects(poll(statusURL,{}, {fetcher:async()=>response({status:'queued'}),now:()=>time,wait:async ms=>{time+=ms;},timeoutMs:1000}),error('POLL_TIMEOUT'));
});
test('HTTP errors never expose server response bodies',async()=>{
 await assert.rejects(requestJSON(spec.endpoint,{},async()=>new Response('SUPER_SECRET',{status:403})),e=>e.code==='HTTP_403'&&!e.message.includes('SUPER_SECRET'));
});
test('image download has no authorization and checks media bytes',async()=>{
 const bytes=Uint8Array.from([137,80,78,71,13,10,26,10]);let options;
 const result=await downloadImage('https://media.example/mask.png?signature=private',async(_,opts)=>{options=opts;return new Response(bytes,{headers:{'content-type':'image/png'}});});
 assert.equal(result.ext,'png');assert.equal(options.headers,undefined);assert.equal(options.redirect,'error');
 await assert.rejects(downloadImage('https://media.example/a',async()=>new Response('not-image',{headers:{'content-type':'image/png'}})),error('INVALID_IMAGE_BYTES'));
 await assert.rejects(downloadImage('https://127.0.0.1/a'),error('INVALID_MEDIA_HOST'));
});
test('stream decoder survives byte-split UTF-8, CRLF and comments',async()=>{
 const code='export default function(THREE) { /* é */ return new THREE.Group(); }';let saved='';
 const events=': keepalive\r\n\r\n'+chunk({choices:[{delta:{content:code}}]})+chunk({choices:[{delta:{},finish_reason:'stop'}]})+'data: [DONE]\r\n\r\n';
 assert.equal(await streamCode(stream(events),async p=>{saved+=p;}),code);assert.equal(saved,code);
});
test('stream rejects truncation, token-limit and server errors',async()=>{
 const text=chunk({choices:[{delta:{content:'partial'}}]});
 await assert.rejects(streamCode(stream(text)),error('INCOMPLETE_MODEL_STREAM'));
 await assert.rejects(streamCode(stream(text+chunk({choices:[{finish_reason:'length'}]})+'data: [DONE]\n\n')),error('INCOMPLETE_MODEL_STREAM'));
 await assert.rejects(streamCode(stream(chunk({error:{message:'secret'}}))),error('MODEL_STREAM_ERROR'));
});
test('RunPod endpoint is HTTPS proxy v1, without URL credentials',()=>{
 assert.equal(runpodBase('https://example-8001.proxy.runpod.net/v1/'),'https://example-8001.proxy.runpod.net/v1');
 for(const value of ['http://example-8001.proxy.runpod.net/v1','https://other.example/v1','https://example-8001.proxy.runpod.net/v1?key=x'])assert.throws(()=>runpodBase(value),PipelineError);
});
test('code preparation never executes generated code and refuses contract violations',()=>{
 const source='export default function generate(THREE) { throw new Error("would execute"); }';
 const prepared=prepareCode('```js\n'+source+'\n```');assert.ok(prepared.includes('Missing named group:'));
 for(const source of ['export default async function(THREE) {}','export default function(THREE) { fetch("url"); }','import x from "x"; export default function(THREE) {}'])assert.throws(()=>prepareCode(source),PipelineError);
});
test('official verification receives no inherited secrets and uses the official harness path',()=>{
 assert.deepEqual(cleanChildEnvironment({PATH:'/bin',HOME:'/tmp/home',HF_API_KEY_SECRET:'secret',VLLM_API_KEY:'secret',OTHER_SECRET:'x'}),{PATH:'/bin',HOME:'/tmp/home'});
 assert.deepEqual(verificationCommand('/recipe','/candidates'),['/recipe/harness/verify.mjs','/candidates','--size=560']);
});
test('evidence refuses overwrite and game paths; explicit replacement archives evidence',async()=>{
 const dir=path.join(ROOT,'production',`.pipeline-test-${process.pid}`);let archive;
 try{
  await fs.mkdir(dir);await fs.writeFile(path.join(dir,'receipt.txt'),'original');
  await assert.rejects(outputDirectory(dir),error('EVIDENCE_EXISTS'));
  await assert.rejects(outputDirectory('game/reference'),error('OUTPUT_OUTSIDE_PRODUCTION'));
  await outputDirectory(dir,true);assert.deepEqual(await fs.readdir(dir),[]);
  archive=(await fs.readdir(path.dirname(dir))).find(n=>n.startsWith(path.basename(dir)+'.archived-'));
  assert.equal(await fs.readFile(path.join(path.dirname(dir),archive,'receipt.txt'),'utf8'),'original');
 }finally{await fs.rm(dir,{recursive:true,force:true});if(archive)await fs.rm(path.join(path.dirname(dir),archive),{recursive:true,force:true});}
});
test('missing Higgsfield credentials send zero requests',async()=>{
 let calls=0;await assert.rejects(runReference({},{env:{},fetcher:async()=>{calls++;}}),error('MISSING_CREDENTIALS'));assert.equal(calls,0);
});
test('offline reference lifecycle writes a local image and secret-free request receipt',async()=>{
 const dir=path.join(ROOT,'production',`.reference-fixture-${process.pid}`),out=path.join(dir,'output');
 const env={HF_API_KEY_ID:'fixture-key-id',HF_API_KEY_SECRET:'fixture-key-secret'};
 try{
  await fs.mkdir(dir);await fs.writeFile(path.join(dir,'prompt.txt'),'Mask reference');await fs.writeFile(path.join(dir,'model.json'),JSON.stringify(spec));
  let calls=0;const fetcher=async(url,options)=>{
   calls++;
   if(calls===1){assert.equal(options.headers.Authorization,'Key fixture-key-id:fixture-key-secret');assert.equal(JSON.parse(options.body).prompt,'Mask reference');return response({request_id:'offline-only',status:'queued',status_url:statusURL});}
   if(calls===2)return response({status:'completed',images:[{url:'https://media.example/output.png?signature=not-a-real-token'}]});
   assert.equal(options.headers,undefined);return new Response(Uint8Array.from([137,80,78,71,13,10,26,10]),{headers:{'content-type':'image/png'}});
  };
  const r=await runReference({config:path.join(dir,'model.json'),prompt:path.join(dir,'prompt.txt'),out},{env,fetcher});
  assert.equal(calls,3);assert.equal(r.requestId,'offline-only');assert.equal(r.outputs.length,1);
  const receipt=await fs.readFile(path.join(out,'receipt.json'),'utf8');
  for(const privateText of ['fixture-key-secret','fixture-key-id','not-a-real-token'])assert.ok(!receipt.includes(privateText));
  assert.equal((await fs.stat(path.join(ROOT,r.outputs[0].path))).size,8);
 }finally{await fs.rm(dir,{recursive:true,force:true});}
});
test('ambiguous submission is not retried and keeps a failure receipt',async()=>{
 const dir=path.join(ROOT,'production',`.ambiguous-fixture-${process.pid}`),out=path.join(dir,'output');
 try{
  await fs.mkdir(dir);await fs.writeFile(path.join(dir,'prompt.txt'),'Mask');await fs.writeFile(path.join(dir,'model.json'),JSON.stringify(spec));
  let calls=0;
  await assert.rejects(runReference({config:path.join(dir,'model.json'),prompt:path.join(dir,'prompt.txt'),out},{env:{HF_API_KEY_ID:'fixture-id',HF_API_KEY_SECRET:'fixture-secret'},fetcher:async()=>{calls++;throw Error('network error with private details');}}),error('NETWORK_OR_TIMEOUT'));
  assert.equal(calls,1);const receipt=JSON.parse(await fs.readFile(path.join(out,'receipt.json'),'utf8'));
  assert.equal(receipt.status,'submission_pending');assert.equal(receipt.failureCode,'NETWORK_OR_TIMEOUT');assert.equal(receipt.requestId,undefined);
 }finally{await fs.rm(dir,{recursive:true,force:true});}
});
test('resume leaves a malformed receipt intact and sends no request',async()=>{
 const dir=path.join(ROOT,'production',`.resume-fixture-${process.pid}`),out=path.join(dir,'output');
 try{
  await fs.mkdir(out,{recursive:true});await fs.writeFile(path.join(dir,'prompt.txt'),'Mask');await fs.writeFile(path.join(dir,'model.json'),JSON.stringify(spec));
  await fs.writeFile(path.join(out,'receipt.json'),'malformed-but-preserved');let calls=0;
  await assert.rejects(runReference({config:path.join(dir,'model.json'),prompt:path.join(dir,'prompt.txt'),out,resume:true},{env:{HF_API_KEY_ID:'fixture-id',HF_API_KEY_SECRET:'fixture-secret'},fetcher:async()=>{calls++;}}));
  assert.equal(calls,0);assert.equal(await fs.readFile(path.join(out,'receipt.json'),'utf8'),'malformed-but-preserved');
 }finally{await fs.rm(dir,{recursive:true,force:true});}
});
