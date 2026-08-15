
function rngFactory(seed){ var s=(seed>>>0)||1; return function(){ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }


const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}}; fn(mod,mod.exports,require); const A=mod.exports;
let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
ok('modInv', A.modInv(3,11)===4);
ok('modInv null', A.modInv(2,4)===null);
ok('modPow', A.modPow(2,10,1000)===24);
ok('crt', A.crt([2,3],[3,5])===8);
ok('crt null', A.crt([1,1],[2,4])===null);
console.log('ModForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
