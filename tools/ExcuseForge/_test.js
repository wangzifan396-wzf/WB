
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}}; fn(mod,mod.exports,require); const A=mod.exports;
let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
ok('make str', typeof A.make(3)==='string' && A.make(3).length>5);
ok('make varies', A.make(1)!==A.make(2));
ok('batch len', A.batch(7,4).length===4);
ok('batch unique', (function(){var b=A.batch(7,4); return new Set(b).size===4;})());
console.log('ExcuseForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
