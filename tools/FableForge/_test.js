
function rngFactory(seed){ var s=(seed>>>0)||1; return function(){ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }


const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}}; fn(mod,mod.exports,require); const A=mod.exports;
let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
var g=A.gen(rngFactory(11));
ok('nonempty', g.length>20);
ok('has moral word', /慢即是快|骄傲使人落后|合作胜过独行|诚实最珍贵|知足常乐/.test(g));
ok('two animals', (g.match(/一只/g)||[]).length>=2);
ok('deterministic', A.gen(rngFactory(11))===g);
console.log('FableForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
