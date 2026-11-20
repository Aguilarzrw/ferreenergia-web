import sharp from 'sharp'; import { readdirSync } from 'node:fs';
const fs = readdirSync('raw').filter(f=>/^p\d+/.test(f)).sort(); const W=300,H=300;
const tiles = await Promise.all(fs.map(async (f,i)=>({input: await sharp('raw/'+f).resize(W,H,{fit:'contain',background:'#222'}).toBuffer(), left:(i%4)*W, top:Math.floor(i/4)*H})));
await sharp({create:{width:W*4,height:H*Math.ceil(fs.length/4),channels:3,background:'#000'}}).composite(tiles).jpeg().toFile('raw/sheet.jpg');
for (const f of fs){ const m=await sharp('raw/'+f).metadata(); console.log(f,m.width+'x'+m.height);} 
