
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}}; fn(mod,mod.exports,require); const A=mod.exports;
let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
ok('total 20', A.POS.length+A.NEU.length+A.NEG.length===20);
ok('ask str', typeof A.ask(3)==='string' && A.ask(3).length>0);
ok('ask in pool', (function(){var a=A.ask(9); return A.POS.concat(A.NEU,A.NEG).indexOf(a)>=0;})());
console.log('Magic8Forge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
