// Real gameplay captures, loaded only when the handbook is opened.
export function initTutorial(){
 const $=id=>document.getElementById(id),panel=$('how');let index=0,startX=0;
 const steps=[['PULL','Take the <br>control.','Pull BRIGHTNESS from the interface. The world slows while you choose where to install it.','Drag the card. Keyboard: select it, then E.','pull'],['INSTALL','Give it <br>a place.','Bring the control to a matching socket. Valid mechanisms answer your glove.','Move closer. Release over the glowing socket.','install'],['RESTORE','Change <br>the world.','Installed controls alter reality. Retrieve a control when you need it somewhere else.','Choose DIM, BALANCED or RADIANT. E retrieves.','restore']];
 function show(n){index=(n+3)%3;const s=steps[index];$('lesson-kicker').textContent=`0${index+1} / ${s[0]}`;$('how-heading').innerHTML=s[1];$('lesson-copy').textContent=s[2];$('lesson-hint').textContent=s[3];$('lesson-progress').textContent=`0${index+1} / 03`;$('lesson-image').src=`./media/tutorial/${s[4]}.webp`;$('lesson-image').alt=s[0]==='PULL'?'Mara holding the detached Brightness card':s[0]==='INSTALL'?'Brightness locks into the physical socket':'Individual bridge segments assemble toward the destination';panel.querySelectorAll('.tutorial-pagination i').forEach((e,i)=>e.classList.toggle('active',i===index));}
 $('lesson-prev').onclick=()=>show(index-1);$('lesson-next').onclick=()=>show(index+1);
 document.querySelectorAll('[data-open="how"]').forEach(b=>b.addEventListener('click',()=>show(0)));
 document.addEventListener('keydown',e=>{if(panel.hidden)return;if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();show(index+(e.key==='ArrowRight'?1:-1));}});
 panel.addEventListener('pointerdown',e=>{startX=e.clientX;});panel.addEventListener('pointerup',e=>{if(Math.abs(e.clientX-startX)>60)show(index+(e.clientX<startX?1:-1));});
}
