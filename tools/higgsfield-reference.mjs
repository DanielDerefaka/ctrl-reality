#!/usr/bin/env node
// Official shared lifecycle; endpoint/body must come from the account's selected model docs.
import fs from 'node:fs/promises';
import path from 'node:path';
import { parseArgs } from 'node:util';
import { ROOT, fail, environment, requireKeys, apiURL, httpsURL, outputDirectory, json, requestJSON, downloadImage, sleep, sha, isCLI, cliError } from './art-pipeline/common.mjs';
export function modelSpec(spec, prompt) {
  if (spec.reviewed !== true || !spec.model || !spec.documentationUrl) fail('MODEL_DOCUMENTATION_REQUIRED', 'Provide the reviewed model endpoint and request body from your Higgsfield account.');
  const doc = httpsURL(spec.documentationUrl);
  if (!['docs.higgsfield.ai','console.higgsfield.ai'].includes(doc.hostname)) fail('MODEL_DOCUMENTATION_REQUIRED');
  const endpoint = apiURL(spec.endpoint, 'api.higgsfield.ai');
  if (!spec.body || typeof spec.body !== 'object' || Array.isArray(spec.body)) fail('MODEL_BODY_REQUIRED');
  const template = JSON.stringify(spec.body);
  if (!template.includes('{{PROMPT}}')) fail('PROMPT_PLACEHOLDER_REQUIRED');
  // Substitute values, not serialized JSON, so quotes/newlines cannot corrupt the request.
  const replace = value => typeof value === 'string' ? value.replaceAll('{{PROMPT}}', prompt) : Array.isArray(value) ? value.map(replace) : value && typeof value === 'object' ? Object.fromEntries(Object.entries(value).map(([k,v]) => [k,replace(v)])) : value;
  return { endpoint, body:replace(spec.body), model:spec.model, documentationUrl:spec.documentationUrl };
}
export async function poll(statusURL, headers, { fetcher = fetch, wait = sleep, timeoutMs = 1200000, now = Date.now, onStatus = async()=>{} } = {}) {
  const url = apiURL(statusURL, 'api.higgsfield.ai');
  const start = now(); let delay = 2000;
  while (now() - start < timeoutMs) {
    let result;
    try { result = await requestJSON(url, { headers }, fetcher); }
    catch (e) {
      if (e.code !== 'NETWORK_OR_TIMEOUT' && !/^HTTP_(5\d\d|429)$/.test(e.code || '')) throw e;
      await wait(delay); delay = Math.min(10000, delay * 1.5); continue;
    }
    await onStatus(result.status);
    if (result.status === 'completed') return result;
    if (['failed','nsfw','canceled'].includes(result.status)) fail(`GENERATION_${result.status.toUpperCase()}`);
    if (!['queued','in_progress'].includes(result.status)) fail('UNKNOWN_GENERATION_STATE');
    await wait(delay); delay = Math.min(10000, delay * 1.5);
  }
  fail('POLL_TIMEOUT', 'Polling timed out; resume the accepted request instead of submitting again.');
}
export async function run(options, deps = {}) {
  const env = deps.env || await environment();
  requireKeys(env, ['HF_API_KEY_ID','HF_API_KEY_SECRET']);
  const prompt = await fs.readFile(path.resolve(ROOT, options.prompt), 'utf8');
  const config = JSON.parse(await fs.readFile(path.resolve(ROOT, options.config), 'utf8'));
  const spec = modelSpec(config, prompt);
  if (options.resume && options.overwrite) fail('CONFLICTING_EVIDENCE_FLAGS');
  const out = await outputDirectory(options.out, options.overwrite, options.resume);
  const receiptFile = path.join(out, 'receipt.json');
  const headers = { Authorization:`Key ${env.HF_API_KEY_ID}:${env.HF_API_KEY_SECRET}`, 'Content-Type':'application/json' };
  let receipt = { provider:'Higgsfield', model:spec.model, documentationUrl:spec.documentationUrl, endpoint:spec.endpoint, prompt, parameters:spec.body, startedAt:new Date().toISOString(), status:'not_submitted', outputs:[] };
  // Validate a resume before writing anything, preserving even a malformed old receipt.
  if (options.resume) {
    receipt = JSON.parse(await fs.readFile(receiptFile,'utf8'));
    if (!receipt.requestId || !receipt.statusURL) fail('NO_REQUEST_TO_RESUME');
    if (receipt.outputs?.length) fail('REFERENCE_ALREADY_DOWNLOADED');
    apiURL(receipt.statusURL, 'api.higgsfield.ai');
  }
  const save = () => json(receiptFile, receipt, env);
  try {
    if (!options.resume) {
      // Persist before POST. Never retry an ambiguous POST: it may already have incurred a charge.
      receipt.status = 'submission_pending'; await save();
      const accepted = await requestJSON(spec.endpoint, { method:'POST', headers, body:JSON.stringify(spec.body) }, deps.fetcher);
      if (typeof accepted.request_id !== 'string' || !accepted.request_id) fail('MISSING_REQUEST_ID');
      receipt.requestId = accepted.request_id;
      receipt.status = accepted.status;
      // Persist the ID even if the returned poll URL is malformed.
      await save();
      receipt.statusURL = apiURL(accepted.status_url, 'api.higgsfield.ai'); await save();
    }
    const result = await poll(receipt.statusURL, headers, { ...deps, onStatus:async status=>{receipt.status=status;await save();} });
    if (!Array.isArray(result.images) || result.images.length !== 1) fail('EXPECTED_ONE_REFERENCE_IMAGE');
    const {bytes,ext} = await downloadImage(result.images[0].url, deps.fetcher);
    const output = path.join(out, `NYRA_MASK-reference.${ext}`);
    await fs.writeFile(output, bytes, {flag:'wx'});
    receipt.outputs = [{path:path.relative(ROOT,output), sha256:sha(bytes), bytes:bytes.length}];
    receipt.status = 'completed'; receipt.finishedAt=new Date().toISOString(); await save();
    return receipt;
  } catch (e) {
    receipt.failureCode=e.code || 'LOCAL_FAILURE'; receipt.stoppedAt=new Date().toISOString(); await save(); throw e;
  }
}
if (isCLI(import.meta.url)) {
  try {
    const {values} = parseArgs({options:{config:{type:'string'},prompt:{type:'string',default:'production/asset-receipts/NYRA_MASK/reference-prompt.txt'},out:{type:'string',default:'production/asset-receipts/NYRA_MASK/reference'},overwrite:{type:'boolean'},resume:{type:'boolean'},help:{type:'boolean'}}});
    if (values.help) console.log('node tools/higgsfield-reference.mjs --config <reviewed-model.json> [--prompt file] [--out production/path] [--resume | --overwrite]\nNo model endpoint is guessed. --overwrite archives previous evidence.');
    else { if (!values.config) fail('MODEL_DOCUMENTATION_REQUIRED','Supply --config with account-specific model documentation.'); const r=await run(values); console.log(`Reference completed; ${r.outputs.length} local image. Receipt saved.`); }
  } catch(e) { cliError(e); }
}
