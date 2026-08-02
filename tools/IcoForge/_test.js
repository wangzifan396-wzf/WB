
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);
const mod={exports:{}};
new Function('module','exports','require',m[1])(mod,mod.exports,require);
const P=mod.exports;
let n=0; function ok(c,msg){ if(!c){ console.error('FAIL: '+msg); process.exit(1);} n++; }
var png=Uint8Array.from([137,80,78,71,13,10,26,10, 0,0,0,13, 73,72,68,82, 0,0,0,16,0,0,0,16,8,6,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0]);
ok(P.isPngBytes(png)===true, 'isPng true');
ok(P.isPngBytes([1,2,3])===false, 'isPng false');
var ico=P.pngToIco(png);
ok(ico && ico.length>0, 'ico built');
ok(ico[2]===1 && ico[3]===0, 'reserved=0 type=1 (little-endian)');
ok(ico[4]===1 && ico[5]===0, 'count=1');
ok(ico[6]===16, 'entry width 16');
ok(ico[7]===16, 'entry height 16');
ok(P.pngToIco([1,2,3])===null, 'non-png -> null');
console.log('IcoForge _test: '+n+' passed, 0 failed');
