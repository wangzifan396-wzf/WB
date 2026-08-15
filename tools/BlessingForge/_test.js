
function rngFactory(seed){ var s=(seed>>>0)||1; return function(){ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }


const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}}; fn(mod,mod.exports,require); const A=mod.exports;
let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
var g=A.gen(rngFactory(3));
ok('nonempty', g.length>6);
ok('ends period', g.charAt(g.length-1)==='。');
ok('deterministic', A.gen(rngFactory(3))===g);
ok('two differ', A.gen(rngFactory(3))!==A.gen(rngFactory(4)));
console.log('BlessingForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
