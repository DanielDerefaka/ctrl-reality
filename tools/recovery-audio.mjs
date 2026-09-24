// Original offline additive synthesis. No sampled third-party music or sound.
import fs from 'node:fs/promises';import {execFileSync} from 'node:child_process';
const rate=24000, TAU=Math.PI*2, out='game/media/audio';const wrap=(t,d)=>(t%d+d)%d;
async function render(name,duration,fn,target=-22){const count=Math.round(duration*rate),data=Buffer.alloc(count*2);let peak=0;const samples=new Float32Array(count);for(let i=0;i<count;i++){const v=fn(i/rate,i);samples[i]=v;peak=Math.max(peak,Math.abs(v));}for(let i=0;i<count;i++)data.writeInt16LE(Math.max(-32767,Math.min(32767,Math.round(samples[i]/Math.max(peak,1)*26000))),i*2);const h=Buffer.alloc(44);h.write('RIFF');h.writeUInt32LE(36+data.length,4);h.write('WAVEfmt ',8);h.writeUInt32LE(16,16);h.writeUInt16LE(1,20);h.writeUInt16LE(1,22);h.writeUInt32LE(rate,24);h.writeUInt32LE(rate*2,28);h.writeUInt16LE(2,32);h.writeUInt16LE(16,34);h.write('data',36);h.writeUInt32LE(data.length,40);const wav='/private/tmp/ctrl-'+name.replaceAll('/','-')+'.wav';await fs.writeFile(wav,Buffer.concat([h,data]));const file=out+'/'+name+'.mp3';await fs.mkdir(file.slice(0,file.lastIndexOf('/')),{recursive:true});execFileSync('ffmpeg',['-y','-hide_banner','-loglevel','error','-i',wav,'-af',`loudnorm=I=${target}:TP=-2:LRA=7`,'-ar','24000','-codec:a','libmp3lame','-b:a',name.startsWith('music/')?'96k':'64k',file]);await fs.unlink(wav);return{file,duration,bytes:(await fs.stat(file)).size,targetLUFS:target};}
// Damped, inharmonic material modes plus filtered contact noise. No single-tone beeps.
const receipts=[];
function voice(seed=17){let state=seed,low=0,air=0;return()=>{state=(1664525*state+1013904223)>>>0;const n=state/2147483648-1;low+=.06*(n-low);air+=.55*(n-air);return{low,grain:n-air,air};};}
const modes=(t,f,decay,level=1)=>{if(t<0)return 0;const env=(1-Math.exp(-t*170));return [1,2.71,4.13,5.83,8.21].reduce((sum,ratio,i)=>sum+Math.sin(TAU*f*ratio*t+.15*i)*Math.exp(-t/(decay/(1+i*.37)))*level/(1+i*2.8),0)*env;};
async function shot(name,duration,make,target=-25){const noise=voice(name.length*271);receipts.push(await render('sfx/'+name,duration,make(noise),target));}
await shot('ui-back',.4,n=>t=>n().air*Math.exp(-t*24)*.045+modes(t,680,.12,.06)+modes(t-.07,340,.1,.035),-29);
await shot('ui-open',.55,n=>t=>n().air*Math.sin(Math.PI*t/.55)**2*.035+modes(t,440,.14,.06)+modes(t-.12,880,.12,.025),-29);
await shot('ui-close',.45,n=>t=>n().air*Math.sin(Math.PI*t/.45)**2*.04+modes(t,660,.12,.04)+modes(t-.09,330,.09,.025),-30);
await shot('ui-toggle',.22,n=>t=>n().grain*Math.exp(-t*70)*.045+modes(t,980,.05,.065),-30);
await shot('bridge-energy',1.85,n=>t=>n().low*Math.sin(Math.PI*t/1.85)**2*.28+modes(t-.15,110,.65,.06)+modes(t-.65,330,.6,.025),-27);
await shot('bridge-segment',.28,n=>t=>n().grain*Math.exp(-t*45)*.07+modes(t,185,.08,.07)+modes(t-.025,610,.04,.025),-29);
await fs.writeFile('production/recovery/audio-receipt.json',JSON.stringify({generator:'Original deterministic modal synthesis; no samples',format:'24kHz mono MP3',mix:'LUFS targets per file, true peak −2 dBTP before runtime master limiter',files:receipts},null,2));console.log('Rendered',receipts.length,'recovery cues.');
