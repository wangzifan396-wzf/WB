
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);
const mod={exports:{}};
new Function('module','exports','require',m[1])(mod,mod.exports,require);
const P=mod.exports;
let n=0; function ok(c,msg){ if(!c){ console.error('FAIL: '+msg); process.exit(1);} n++; }
function u32(v){ return [(v>>>24)&255,(v>>>16)&255,(v>>>8)&255,v&255]; }
function chunk(t,d){ return u32(d.length).concat(t.split('').map(function(c){return c.charCodeAt(0);}), d, [0,0,0,0]); }
var sig=[137,80,78,71,13,10,26,10];
var ihdr=chunk('IHDR', u32(4).concat(u32(3),[8,2,0,0,0]));
var txt=chunk('tEXt', 'Title\u0000Hello'.split('').map(function(c){return c.charCodeAt(0);}));
var iend=chunk('IEND', []);
var bytes=Uint8Array.from(sig.concat(ihdr, txt, iend));
var r=P.pngParse(bytes);
ok(r.valid, 'valid');
ok(r.width===4 && r.height===3, 'dims 4x3');
ok(r.colorTypeDesc==='RGB', 'colorType RGB');
ok(r.bitDepth===8, 'bitDepth 8');
ok(r.metadata.Title==='Hello', 'tEXt metadata');
ok(P.pngParse([1,2,3]).valid===false, 'short invalid');
console.log('PngForge _test: '+n+' passed, 0 failed');
