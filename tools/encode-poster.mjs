import puppeteer from 'puppeteer';
import fs from 'node:fs/promises';
const b=await puppeteer.launch({headless:true});const p=await b.newPage();const bytes=await fs.readFile('production/higgsfield/title-keyframe.png');
const encoded=await p.evaluate(async data=>{const img=new Image();img.src=data;await img.decode();const c=document.createElement('canvas');c.width=1600;c.height=900;c.getContext('2d').drawImage(img,0,0,1600,900);return c.toDataURL('image/webp',.77).split(',')[1];},'data:image/png;base64,'+bytes.toString('base64'));
await fs.writeFile('game/media/video/mara-title-poster.webp',Buffer.from(encoded,'base64'));await b.close();console.log('Poster encoded');
