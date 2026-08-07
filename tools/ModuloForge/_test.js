
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}}; fn(mod,mod.exports,require); const A=mod.exports;
let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
ok('mod(-1,5)=4', A.mod(-1n,5n)===4n);
ok('mod(7,3)=1', A.mod(7n,3n)===1n);
ok('modInverse(3,11)=4', A.modInverse(3n,11n)===4n);
ok('modInverse(2,4)=null', A.modInverse(2n,4n)===null);
ok('modPow(2,10,7)=2', A.modPow(2n,10n,7n)===2n);
ok('modPow(3,3,5)=2', A.modPow(3n,3n,5n)===2n);
console.log('ModuloForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
