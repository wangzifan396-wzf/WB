
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}}; fn(mod,mod.exports,require); const A=mod.exports;
let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
var ft=A.freqTable([1,2,2,3,3,3,4]);
ok('freqTable counts', JSON.stringify(ft.map(function(r){return r.count;}))==='[1,2,3,1]');
ok('freqTable total pct=100', Math.abs(ft.reduce(function(s,r){return s+r.pct;},0)-100)<1e-9);
var h=A.histogram([1,2,3,4,5],5);
ok('histogram 5 bins each 1', h.length===5 && h.every(function(b){return b.count===1;}));
ok('histogram single value', A.histogram([7,7,7],3)[0].count===3);
console.log('FrequencyForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
