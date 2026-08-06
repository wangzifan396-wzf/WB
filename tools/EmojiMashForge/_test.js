
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}}; fn(mod,mod.exports,require); const A=mod.exports;
let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
ok('side', A.layout("side",100,100).length === 2);
ok('side x', Math.abs(A.layout("side",100,100)[0].x - 27) < 1);
ok('top', A.layout("top",100,100)[0].y < A.layout("top",100,100)[1].y);
ok('overlap', A.layout("overlap",100,100).length === 2);
console.log('EmojiMashForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
