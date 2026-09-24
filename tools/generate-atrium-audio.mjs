// Original offline additive synthesis. No sampled third-party music or sound.
import fs from 'node:fs/promises';import {execFileSync} from 'node:child_process';
const rate=24000, TAU=Math.PI*2, out='game/media/audio';const wrap=(t,d)=>(t%d+d)%d;
async function render(name,duration,fn,target=-22){const count=Math.round(duration*rate),data=Buffer.alloc(count*2);let peak=0;const samples=new Float32Array(count);for(let i=0;i<count;i++){const v=fn(i/rate,i);samples[i]=v;peak=Math.max(peak,Math.abs(v));}for(let i=0;i<count;i++)data.writeInt16LE(Math.max(-32767,Math.min(32767,Math.round(samples[i]/Math.max(peak,1)*26000))),i*2);const h=Buffer.alloc(44);h.write('RIFF');h.writeUInt32LE(36+data.length,4);h.write('WAVEfmt ',8);h.writeUInt32LE(16,16);h.writeUInt16LE(1,20);h.writeUInt16LE(1,22);h.writeUInt32LE(rate,24);h.writeUInt32LE(rate*2,28);h.writeUInt16LE(2,32);h.writeUInt16LE(16,34);h.write('data',36);h.writeUInt32LE(data.length,40);const wav='/private/tmp/ctrl-'+name.replaceAll('/','-')+'.wav';await fs.writeFile(wav,Buffer.concat([h,data]));const file=out+'/'+name+'.mp3';await fs.mkdir(file.slice(0,file.lastIndexOf('/')),{recursive:true});execFileSync('ffmpeg',['-y','-hide_banner','-loglevel','error','-i',wav,'-af',`loudnorm=I=${target}:TP=-2:LRA=7`,'-ar','24000','-codec:a','libmp3lame','-b:a',name.startsWith('music/')?'96k':'64k',file]);await fs.unlink(wav);return{file,duration,bytes:(await fs.stat(file)).size,targetLUFS:target};}
// Damped, inharmonic material modes plus filtered contact noise. No single-tone beeps.
const receipts=[];
function voice(seed=17){let state=seed,low=0,air=0;return()=>{state=(1664525*state+1013904223)>>>0;const n=state/2147483648-1;low+=.06*(n-low);air+=.55*(n-air);return{low,grain:n-air,air};};}
const modes=(t,f,decay,level=1)=>{if(t<0)return 0;const env=(1-Math.exp(-t*170));return [1,2.71,4.13,5.83,8.21].reduce((sum,ratio,i)=>sum+Math.sin(TAU*f*ratio*t+.15*i)*Math.exp(-t/(decay/(1+i*.37)))*level/(1+i*2.8),0)*env;};
async function shot(name,duration,make,target=-25){const noise=voice(name.length*271);receipts.push(await render('sfx/'+name,duration,make(noise),target));}
for(let i=1;i<=5;i++)await shot('footstep-'+i,.34,n=>t=>{const a=n();return a.low*Math.exp(-t*35)*.85+a.grain*Math.exp(-t*100)*.10+modes(t-.034,120+i*11,.035,.045)+modes(t-.11,420+i*7,.025,.014);},-29);
await shot('ui-hover',.3,n=>t=>{const a=n();return a.air*Math.exp(-t*48)*.10+modes(t,1830,.035,.013);},-34);
await shot('ui-tick',.18,n=>t=>n().grain*Math.exp(-t*85)*.11+modes(t,1840,.022,.025),-31);
await shot('ui-confirm',.65,n=>t=>n().air*Math.exp(-t*30)*.06+modes(t,960,.17,.07)+modes(t-.085,340,.13,.08),-27);
await shot('control-pickup',.8,n=>t=>{const a=n(),e=Math.sin(Math.PI*Math.min(t/.45,1))**2;return a.air*e*.055+modes(t,1480,.12,.055)+modes(t-.23,530,.18,.05);},-26);
await shot('socket-valid',.7,n=>t=>n().low*Math.sin(Math.PI*t/.7)**2*.1+modes(t,1120,.18,.04)+modes(t-.12,748,.13,.04),-29);
await shot('control-socket',1.5,n=>t=>{const a=n();return modes(t,1478,.10,.045)+a.air*Math.sin(Math.PI*Math.min(t/.48,1))**2*.08+modes(t-.39,724,.035,.14)+modes(t-.47,179,.16,.15)+modes(t-.66,523,.22,.06)+modes(t-.74,785,.24,.028);},-23);
await shot('bridge-reveal',1.45,n=>t=>{const a=n();let v=a.low*Math.sin(Math.PI*t/1.45)**2*.32;for(let i=0;i<12;i++)v+=modes(t-.075*i,128+(i%3)*19,.085,.044)+modes(t-.075*i-.012,590+i*5,.042,.012);return v;},-26);
await shot('bridge-complete',1.2,n=>t=>n().air*Math.exp(-t*10)*.04+modes(t,196,.32,.09)+modes(t-.09,588,.29,.035)+modes(t-.18,784,.3,.03),-27);
await shot('checkpoint',1.5,n=>t=>n().air*Math.sin(Math.PI*t/1.5)**2*.02+modes(t,349,.3,.08)+modes(t-.13,698,.25,.035)+modes(t-.26,1047,.23,.023),-27);
await shot('pause-open',.5,n=>t=>n().air*Math.sin(Math.PI*t/.5)**2*.06+modes(t,456,.13,.04),-30);
await shot('pause-close',.5,n=>t=>n().air*Math.sin(Math.PI*t/.5)**2*.06+modes(t,684,.13,.04),-30);
// Periodic modes use integer cycles in the two-second loop; endpoints match.
receipts.push(await render('sfx/control-drag',2,t=>[83,167,252,421].reduce((v,f,i)=>v+Math.sin(TAU*f*t+Math.sin(TAU*t/2)*.2)*(.5+.12*Math.cos(TAU*t/2))/(i+1),0)*.05,-32));
await fs.writeFile('production/audio/visual-lock-receipt.json',JSON.stringify({date:new Date().toISOString(),generator:'Original Codex-authored modal synthesis and seeded filtered contact noise',command:'node tools/generate-atrium-audio.mjs',scope:'Boot Atrium tactile sounds only. Existing title composition and archive bed retained.',mix:'MP3 24kHz mono; loudnorm targets per file, true-peak ceiling −2dBTP. Listening approval remains with the user.',files:receipts},null,2));console.log('Rendered',receipts.length,'Atrium material sounds.');
