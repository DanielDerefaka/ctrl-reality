// Original local media, decoded only after a real user gesture. No external requests.
export class ArchiveAudio{
 constructor(){this.context=null;this.ready=false;this.beds=[];this.shots=new Set();this.buffers=new Map();this.last=new Map();this.epoch=0;this.mode='title';this.settings={master:80,music:65,effects:80,mute:false};}
 async unlock(){
  if(this.context){await this.context.resume().catch(()=>{});return;}
  const Audio=window.AudioContext||window.webkitAudioContext;if(!Audio)return;
  try{const c=this.context=new Audio();this.master=c.createGain();this.limit=c.createDynamicsCompressor();this.limit.threshold.value=-4;this.limit.knee.value=8;this.limit.ratio.value=8;this.master.connect(this.limit);this.limit.connect(c.destination);
   this.buses={};for(const name of ['MUSIC','AMBIENCE','WORLD_SFX','UI_SFX']){const g=c.createGain();g.connect(this.master);this.buses[name]=g;}this.filter=c.createBiquadFilter();this.filter.type='lowpass';this.filter.frequency.value=19000;this.buses.MUSIC.disconnect();this.buses.MUSIC.connect(this.filter);this.filter.connect(this.master);this.apply(this.settings);await c.resume();this.ready=true;this.setMode(this.mode);
  }catch{this.ready=false;}
 }
 apply(settings){this.settings={...settings};if(!this.context)return;const t=this.context.currentTime;this.master.gain.setTargetAtTime(settings.mute?0:settings.master/100,t,.04);this.buses.MUSIC.gain.setTargetAtTime(settings.music/100*.75,t,.12);this.buses.AMBIENCE.gain.setTargetAtTime(settings.effects/100*.6,t,.12);this.buses.WORLD_SFX.gain.setTargetAtTime(settings.effects/100*.75,t,.04);this.buses.UI_SFX.gain.setTargetAtTime(settings.effects/100*.5,t,.04);}
 async buffer(file){if(this.buffers.has(file))return this.buffers.get(file);const pending=fetch('./media/audio/'+file).then(r=>{if(!r.ok)throw Error('Audio unavailable');return r.arrayBuffer();}).then(b=>this.context.decodeAudioData(b)).catch(()=>null);this.buffers.set(file,pending);return pending;}
 async setMode(mode){this.mode=mode;if(!this.ready)return;const ticket=++this.epoch;const c=this.context;this.filter.frequency.setTargetAtTime(mode==='pause'?1200:19000,c.currentTime,.25);if(mode==='pause')return;
  // Fade outgoing beds once; ticket prevents late decode from restarting an old scene.
  for(const bed of this.beds){bed.gain.gain.setTargetAtTime(0,c.currentTime,.18);try{bed.source.stop(c.currentTime+.8);}catch{}}this.beds=[];
  if(mode==='silent')return;
  const files=mode==='title'?[['music/title-archive.mp3','MUSIC']]:mode==='results'?[['music/boot-atrium.mp3','AMBIENCE']]:[['music/boot-atrium.mp3','AMBIENCE'],['music/title-archive.mp3','MUSIC']];
  for(const [file,bus]of files){const buffer=await this.buffer(file);if(!buffer||ticket!==this.epoch)return;const source=c.createBufferSource(),gain=c.createGain();source.buffer=buffer;source.loop=true;gain.gain.value=0;source.connect(gain);gain.connect(this.buses[bus]);source.start();gain.gain.setTargetAtTime(mode==='game'&&bus==='MUSIC'?.35:1,c.currentTime,.7);source.onended=()=>{source.disconnect();gain.disconnect();};this.beds.push({source,gain});}
 }
 async play(name,{bus='WORLD_SFX',volume=1,rate=1}={}){if(!this.ready)return;const now=performance.now();if(now-(this.last.get(name)||-10000)<70)return;this.last.set(name,now);const epoch=this.epoch,buffer=await this.buffer('sfx/'+name+'.mp3');if(!buffer||epoch!==this.epoch||this.shots.size>=16)return;const c=this.context,source=c.createBufferSource(),g=c.createGain();source.buffer=buffer;source.playbackRate.value=rate;g.gain.value=volume;source.connect(g);g.connect(this.buses[bus]);this.shots.add(source);source.onended=()=>{this.shots.delete(source);source.disconnect();g.disconnect();};source.start();}
 stopShots(){for(const s of this.shots){try{s.stop();}catch{}}this.shots.clear();}
 teardown(){this.stopShots();this.setMode('silent');this.context?.suspend();}
 get status(){return{unlocked:this.ready,state:this.context?.state||'locked',beds:this.beds.length,oneShots:this.shots.size,buses:['MASTER','MUSIC','AMBIENCE','WORLD_SFX','UI_SFX']};}
}
