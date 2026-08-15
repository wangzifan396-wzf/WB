
function rngFactory(seed){ var s=(seed>>>0)||1; return function(){ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }


const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}}; fn(mod,mod.exports,require); const A=mod.exports;
let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
var g1=A.generate(rngFactory(1)); var g2=A.generate(rngFactory(2));
ok('nonempty', g1.length>5);
ok('deterministic', A.generate(rngFactory(5))===A.generate(rngFactory(5)));
ok('template', / 是偷走一切的 .+，它 .+。$/.test(g1));
ok('two differ', g1!==g2);
console.log('MetaphorForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
