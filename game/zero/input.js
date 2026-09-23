export class ActionInput {
 constructor(canvas,onPause){
  this.canvas=canvas;this.enabled=false;this.mouseFire=false;this.mouseAim=false;this.keys=new Set();this.stick={x:0,y:0};this.lookX=0;this.lookY=0;this.buttons=new Set();this.edges=new Set();this.source='keyboard';this.mobile=false;this.pointers=new Map();this.controller=new AbortController();const signal=this.controller.signal;
  const keyMap={KeyQ:'echo',Space:'dodge',KeyE:'interact',KeyR:'reload'};
  window.addEventListener('keydown',e=>{if(e.code==='Escape'){if(this.enabled){e.preventDefault();onPause();}return;}if(!this.enabled)return;if(['KeyW','KeyA','KeyS','KeyD','Space','KeyQ','KeyE','KeyR'].includes(e.code)){e.preventDefault();if(e.code.startsWith('Key')&&'WASD'.includes(e.code.slice(3))){if(e.repeat&&this.source!=='keyboard')return;this.source='keyboard';this.cancelStick();}this.keys.add(e.code);if(keyMap[e.code]&&!e.repeat)this.edges.add(keyMap[e.code]);}}, {signal});
  window.addEventListener('keyup',e=>this.keys.delete(e.code),{signal});
  window.addEventListener('blur',()=>this.clear(),{signal});
  document.addEventListener('visibilitychange',()=>{if(document.hidden)this.clear();},{signal});
  window.addEventListener('contextmenu',e=>{if(this.enabled)e.preventDefault();},{signal});
  window.addEventListener('pointermove',e=>{
   if(!this.enabled)return;
   const p=this.pointers.get(e.pointerId);
   if(p?.type==='stick'){const dx=e.clientX-p.cx,dy=e.clientY-p.cy,l=Math.hypot(dx,dy),n=Math.max(1,l/42);this.stick.x=dx/42/n;this.stick.y=dy/42/n;document.querySelector('#stick-knob').style.transform=`translate(${this.stick.x*32}px,${this.stick.y*32}px)`;}
   else if(p?.type==='look'){this.lookX+=e.clientX-p.x;this.lookY+=e.clientY-p.y;p.x=e.clientX;p.y=e.clientY;}
   else if(e.pointerType==='mouse' && (e.target===canvas || document.pointerLockElement===canvas)){this.lookX+=e.movementX;this.lookY+=e.movementY;}
  },{signal});
  const up=e=>{if(e.pointerType==='mouse'){this.mouseFire=(e.buttons&1)!==0;this.mouseAim=(e.buttons&2)!==0;}const p=this.pointers.get(e.pointerId);if(!p)return;this.pointers.delete(e.pointerId);if(p.type==='stick')this.cancelStick();if(p.action)this.buttons.delete(p.action);if(p.element?.hasPointerCapture(e.pointerId))p.element.releasePointerCapture(e.pointerId);};
  for(const type of ['pointerup','pointercancel','lostpointercapture'])window.addEventListener(type,up,{signal});
  const bind=(el,type,action)=>el.addEventListener('pointerdown',e=>{if(!this.enabled || [...this.pointers.values()].some(p=>p.element===el))return;e.preventDefault();this.mobile=e.pointerType==='touch';
   const rect=el.getBoundingClientRect();const p={type,action,element:el,cx:rect.x+rect.width/2,cy:rect.y+rect.height/2,x:e.clientX,y:e.clientY};
   if(type==='stick'){for(const k of ['KeyW','KeyA','KeyS','KeyD'])this.keys.delete(k);this.source='touch';}
   if(action){this.buttons.add(action);this.edges.add(action);}
   this.pointers.set(e.pointerId,p);el.setPointerCapture(e.pointerId);
  },{signal});
  bind(document.querySelector('#stick'),'stick');bind(document.querySelector('#look-zone'),'look');
  for(const el of document.querySelectorAll('[data-control]'))bind(el,'button',el.dataset.control);
  canvas.addEventListener('pointerdown',e=>{if(!this.enabled||e.pointerType!=='mouse')return;this.mobile=false;e.preventDefault();this.mouseFire=(e.buttons&1)!==0;this.mouseAim=(e.buttons&2)!==0;this.pointers.set(e.pointerId,{type:'mouse',element:canvas});if(!document.pointerLockElement)canvas.setPointerCapture(e.pointerId);if(e.button===0)this.edges.add('fire');if(e.button===0&&!document.pointerLockElement)canvas.requestPointerLock?.()?.catch?.(()=>{});},{signal});
 }
 get fire(){return this.mouseFire||this.buttons.has('fire');}get aim(){return this.mouseAim||this.buttons.has('aim');}
 take(action){const yes=this.edges.has(action);this.edges.delete(action);return yes;}
 movement(out){out.x=this.source==='touch'?this.stick.x:Number(this.keys.has('KeyD'))-Number(this.keys.has('KeyA'));out.y=this.source==='touch'?this.stick.y:Number(this.keys.has('KeyS'))-Number(this.keys.has('KeyW'));const l=Math.max(1,Math.hypot(out.x,out.y));out.x/=l;out.y/=l;return out;}
 cancelStick(){this.stick.x=this.stick.y=0;const knob=document.querySelector('#stick-knob');if(knob)knob.style.transform='translate(0,0)';for(const [id,p]of this.pointers)if(p.type==='stick'){this.pointers.delete(id);if(p.element.hasPointerCapture(id))p.element.releasePointerCapture(id);}}
 clear(){this.mouseFire=this.mouseAim=false;this.keys.clear();this.buttons.clear();this.edges.clear();this.cancelStick();for(const [id,p]of this.pointers){if(p.element?.hasPointerCapture(id))p.element.releasePointerCapture(id);}this.pointers.clear();this.lookX=this.lookY=0;}
 enable(value){this.enabled=value;this.clear();if(!value&&document.pointerLockElement)document.exitPointerLock();}
 destroy(){this.clear();this.controller.abort();}
}
