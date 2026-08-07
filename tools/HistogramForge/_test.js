
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}}; fn(mod,mod.exports,require); const A=mod.exports;
let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
var data=[255,0,0,255, 0,255,0,255, 0,0,255,255];
var h=A.histogram(data,32);
ok('hist pixels=3', h.pixels===3);
ok('hist r[31]=1 (red pixel)', h.r[31]===1);
ok('hist r[0]=2 (green & blue R=0)', h.r[0]===2);
ok('hist g[31]=1', h.g[31]===1);
ok('hist b[31]=1', h.b[31]===1);
ok('hist lum[9]=1 (red)', h.lum[9]===1);
ok('hist lum[18]=1 (green)', h.lum[18]===1);
ok('hist lum[3]=1 (blue)', h.lum[3]===1);
ok('hist max=2 (bin-0 collision)', h.max===2);
var h2=A.histogram([127,127,127,255],32); ok('hist mid-bin r[15]=1', h2.r[15]===1);
console.log('HistogramForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
