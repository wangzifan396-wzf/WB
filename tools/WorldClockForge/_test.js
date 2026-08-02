
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);
const mod={exports:{}};
new Function('module','exports','require',m[1])(mod,mod.exports,require);
const P=mod.exports;
let n=0; function ok(c,msg){ if(!c){ console.error('FAIL: '+msg); process.exit(1);} n++; }
const d1=new Date(Date.UTC(2026,0,15,12,30,0));
const p1=P.worldParts('UTC',d1);
ok(p1.y===2026 && p1.m===1 && p1.d===15,'utc date');
ok(p1.hh==='12' && p1.mm==='30' && p1.ss==='00','utc time');
const p2=P.worldParts('Asia/Shanghai',d1);
ok(p2.hh==='20' && p2.mm==='30','shanghai +8');
ok(P.worldOffsetMin('Asia/Shanghai',d1)===480,'shanghai offset');
ok(P.worldOffsetMin('UTC',d1)===0,'utc offset');
ok(P.worldOffsetMin('America/New_York',new Date(Date.UTC(2026,0,15)))===-300,'ny est');
ok(P.worldOffsetMin('America/New_York',new Date(Date.UTC(2026,6,15)))===-240,'ny edt');
ok(P.worldOffsetLabel('Asia/Shanghai',d1).indexOf('+8')>=0,'offset label');
ok(P.worldZonePreset().length>=8,'presets');
console.log('PASS '+n+' assertions');
