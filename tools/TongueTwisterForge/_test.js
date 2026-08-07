
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}}; fn(mod,mod.exports,require); const A=mod.exports;
let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
var p=A.generate(15);
ok('all same letter', A.allSame(p)===true);
ok('deterministic', JSON.stringify(p)===JSON.stringify(A.generate(15)));
ok('nonempty phrase', p.phrase.split(' ').length>=3);
console.log('TongueTwisterForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
