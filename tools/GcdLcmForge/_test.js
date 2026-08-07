
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}}; fn(mod,mod.exports,require); const A=mod.exports;
let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
ok('gcd(12,18)=6', A.gcd(12n,18n)===6n);
ok('lcm(4,6)=12', A.lcm(4n,6n)===12n);
ok('gcdList([12,18,24])=6', A.gcdList([12,18,24])===6n);
ok('lcmList([2,3,4])=12', A.lcmList([2,3,4])===12n);
ok('gcd(-8,12)=4', A.gcd(-8n,12n)===4n);
console.log('GcdLcmForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
